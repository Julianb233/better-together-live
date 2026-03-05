// Better Together: Messaging & DM System API
// Handles direct messages, group conversations, and real-time messaging
// Migrated from Neon raw SQL to Supabase query builder

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { zValidator } from '@hono/zod-validator'
import {
  createConversationSchema,
  sendMessageSchema,
  editMessageSchema,
  muteConversationSchema,
  addParticipantsSchema,
} from '../lib/validation/schemas/messaging'
import { getPaginationParams } from '../lib/pagination'
import { sanitizeTextInput } from '../lib/sanitize'

const messagingApi = new Hono()

function getSupabaseEnv(c: Context): SupabaseEnv {
  return {
    SUPABASE_URL: c.env?.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: c.env?.SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: c.env?.SUPABASE_SERVICE_ROLE_KEY
  }
}

// Helper: Check if user is blocked
async function isBlocked(supabase: any, userId: string, otherUserId: string): Promise<boolean> {
  const { data } = await supabase
    .from('user_blocks')
    .select('id')
    .or(`and(blocker_id.eq.${userId},blocked_id.eq.${otherUserId}),and(blocker_id.eq.${otherUserId},blocked_id.eq.${userId})`)
    .maybeSingle()
  return !!data
}

// Helper: Verify conversation participant
async function isParticipant(supabase: any, conversationId: string, userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('conversation_participants')
    .select('id')
    .eq('conversation_id', conversationId)
    .eq('user_id', userId)
    .is('left_at', null)
    .maybeSingle()
  return !!data
}


// ============================================================================
// 1. GET /api/conversations - List user's conversations
// ============================================================================
messagingApi.get('/', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const { limit, offset } = getPaginationParams(c)

    // Get user's conversation IDs
    const { data: participations } = await supabase
      .from('conversation_participants')
      .select('conversation_id, last_read_at, is_muted')
      .eq('user_id', userId)
      .is('left_at', null)

    if (!participations || participations.length === 0) {
      return c.json({ conversations: [], page: 1, limit, hasMore: false })
    }

    const conversationIds = participations.map((p: any) => p.conversation_id)
    const participationMap = new Map(participations.map((p: any) => [p.conversation_id, p]))

    // Get conversations
    const { data: conversations } = await supabase
      .from('conversations')
      .select('*')
      .in('id', conversationIds)
      .order('last_message_at', { ascending: false, nullsFirst: false })
      .range(offset, offset + limit - 1)

    const convIds = (conversations || []).map((c: any) => c.id)
    if (convIds.length === 0) {
      return c.json({ conversations: [], page: Math.floor(offset / limit) + 1, limit, hasMore: false })
    }

    // Query 3: Batch-fetch all other participants for all conversations
    const { data: allParticipants } = await supabase
      .from('conversation_participants')
      .select('conversation_id, user_id, role')
      .in('conversation_id', convIds)
      .is('left_at', null)
      .neq('user_id', userId)

    // Query 4: Batch-fetch user details for all participants
    const participantUserIds = [...new Set((allParticipants || []).map((p: any) => p.user_id))]
    let userMap = new Map<string, any>()
    if (participantUserIds.length > 0) {
      const { data: users } = await supabase
        .from('users')
        .select('id, name, nickname, profile_photo_url')
        .in('id', participantUserIds)
      for (const u of (users || [])) userMap.set(u.id, u)
    }

    // Build participant lists per conversation
    const partByConv = new Map<string, any[]>()
    for (const p of (allParticipants || [])) {
      const user = userMap.get(p.user_id)
      if (!user) continue
      if (!partByConv.has(p.conversation_id)) partByConv.set(p.conversation_id, [])
      partByConv.get(p.conversation_id)!.push({ ...user, role: p.role })
    }

    // Query 5: Batch unread counts -- get all unread messages for user across all conversations
    // Since last_read_at varies per conversation, fetch all candidate messages
    // after the oldest last_read_at and filter in memory (1 query vs N*2 queries).
    const oldestReadAt = Array.from(participationMap.values())
      .map((p: any) => p.last_read_at)
      .filter(Boolean)
      .sort()[0] || '1970-01-01T00:00:00Z'

    const { data: candidateUnreads } = await supabase
      .from('messages')
      .select('conversation_id, created_at')
      .in('conversation_id', convIds)
      .neq('sender_id', userId)
      .is('deleted_at', null)
      .gte('created_at', oldestReadAt)

    // Count per conversation, filtering by each conversation's actual last_read_at
    const unreadMap = new Map<string, number>()
    for (const msg of (candidateUnreads || [])) {
      const participation = participationMap.get(msg.conversation_id)
      const lastRead = participation?.last_read_at || '1970-01-01T00:00:00Z'
      if (msg.created_at > lastRead) {
        unreadMap.set(msg.conversation_id, (unreadMap.get(msg.conversation_id) || 0) + 1)
      }
    }

    // Assemble enriched conversations (no async, pure in-memory join)
    const enriched = (conversations || []).map((conv: any) => {
      const participation = participationMap.get(conv.id)
      return {
        id: conv.id,
        type: conv.type,
        name: conv.name,
        avatar_url: conv.avatar_url,
        participants: partByConv.get(conv.id) || [],
        last_message_at: conv.last_message_at,
        last_message_preview: conv.last_message_preview,
        unread_count: unreadMap.get(conv.id) || 0,
        is_muted: participation?.is_muted,
        created_at: conv.created_at
      }
    })

    return c.json({
      conversations: enriched,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: (conversations || []).length === limit
    })
  } catch (error) {
    console.error('List conversations error:', error)
    return c.json({ error: 'Failed to list conversations' }, 500)
  }
})

// ============================================================================
// 2. POST /api/conversations - Create/get conversation
// ============================================================================
messagingApi.post(
  '/',
  zValidator('json', createConversationSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const userId = c.get('userId')
      if (!userId) return c.json({ error: 'Unauthorized' }, 401)

      const body = c.req.valid('json' as never) as {
        participant_id?: string
        participant_ids?: string[]
        name?: string
        type?: string
      }

      const conversationType = body.type || (body.participant_ids ? 'group' : 'direct')

      if (conversationType === 'direct') {
        if (!body.participant_id) {
          return c.json({ error: 'participant_id required for direct messages' }, 400)
        }

        // Check if blocked
        if (await isBlocked(supabase, userId, body.participant_id)) {
          return c.json({ error: 'Cannot message this user' }, 403)
        }

        // Check if conversation already exists between these two users
        const { data: userConvs } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', userId)
          .is('left_at', null)

        const userConvIds = (userConvs || []).map((uc: any) => uc.conversation_id)

        let existingConv = null
        if (userConvIds.length > 0) {
          const { data: partnerConvs } = await supabase
            .from('conversation_participants')
            .select('conversation_id')
            .eq('user_id', body.participant_id)
            .is('left_at', null)
            .in('conversation_id', userConvIds)

          if (partnerConvs && partnerConvs.length > 0) {
            // Check if any of these are direct conversations
            const sharedConvIds = partnerConvs.map((pc: any) => pc.conversation_id)
            const { data: directConvs } = await supabase
              .from('conversations')
              .select('*')
              .in('id', sharedConvIds)
              .eq('type', 'direct')
              .maybeSingle()

            existingConv = directConvs
          }
        }

        if (existingConv) {
          // Return existing conversation with participants
          const { data: participants } = await supabase
            .from('conversation_participants')
            .select('user_id, role, last_read_at')
            .eq('conversation_id', existingConv.id)
            .is('left_at', null)

          const participantUserIds = (participants || []).map((p: any) => p.user_id)
          const { data: users } = await supabase
            .from('users')
            .select('id, name, nickname, profile_photo_url')
            .in('id', participantUserIds)

          return c.json({
            conversation: {
              ...existingConv,
              participants: (users || []).map((u: any) => {
                const p = participants?.find((p: any) => p.user_id === u.id)
                return { ...u, role: p?.role, last_read_at: p?.last_read_at }
              })
            },
            isNew: false
          })
        }

        // Create new direct conversation
        const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`
        const now = new Date().toISOString()

        await supabase.from('conversations').insert({
          id: conversationId, type: 'direct', created_by: userId,
          created_at: now, updated_at: now,
        })

        // Add participants
        const p1Id = `cp_${Date.now()}_${Math.random().toString(36).substring(7)}`
        const p2Id = `cp_${Date.now()}_${Math.random().toString(36).substring(7)}_2`

        await supabase.from('conversation_participants').insert([
          { id: p1Id, conversation_id: conversationId, user_id: userId, role: 'member', joined_at: now },
          { id: p2Id, conversation_id: conversationId, user_id: body.participant_id, role: 'member', joined_at: now },
        ])

        // Get participants for response
        const { data: newParticipants } = await supabase
          .from('users')
          .select('id, name, nickname, profile_photo_url')
          .in('id', [userId, body.participant_id])

        const { data: conversation } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single()

        return c.json({
          conversation: { ...conversation, participants: newParticipants || [] },
          isNew: true
        }, 201)

      } else {
        // Group conversation
        if (!body.participant_ids || body.participant_ids.length < 2) {
          return c.json({ error: 'At least 2 participants required for group chat' }, 400)
        }
        if (!body.name) {
          return c.json({ error: 'Group name required' }, 400)
        }

        const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`
        const now = new Date().toISOString()

        await supabase.from('conversations').insert({
          id: conversationId, type: 'group', name: body.name, created_by: userId,
          created_at: now, updated_at: now,
        })

        // Add creator as owner
        const creatorCpId = `cp_${Date.now()}_${Math.random().toString(36).substring(7)}`
        const participantInserts = [
          { id: creatorCpId, conversation_id: conversationId, user_id: userId, role: 'owner', joined_at: now }
        ]

        for (const participantId of body.participant_ids) {
          if (participantId !== userId) {
            const cpId = `cp_${Date.now()}_${Math.random().toString(36).substring(7)}_${participantId.slice(-4)}`
            participantInserts.push({
              id: cpId, conversation_id: conversationId, user_id: participantId, role: 'member', joined_at: now
            })
          }
        }

        await supabase.from('conversation_participants').insert(participantInserts)

        // Get participants for response
        const allUserIds = [userId, ...body.participant_ids.filter(id => id !== userId)]
        const { data: users } = await supabase
          .from('users')
          .select('id, name, nickname, profile_photo_url')
          .in('id', allUserIds)

        const { data: conversation } = await supabase
          .from('conversations')
          .select('*')
          .eq('id', conversationId)
          .single()

        return c.json({
          conversation: { ...conversation, participants: users || [] },
          isNew: true
        }, 201)
      }
    } catch (error) {
      console.error('Create conversation error:', error)
      return c.json({ error: 'Failed to create conversation' }, 500)
    }
  }
)

// ============================================================================
// 3. GET /api/conversations/:id - Get conversation details
// ============================================================================
messagingApi.get('/:id', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const conversationId = c.req.param('id')

    if (!await isParticipant(supabase, conversationId, userId)) {
      return c.json({ error: 'Not authorized to view this conversation' }, 403)
    }

    // Get conversation + user's participation details
    const { data: conversation } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .maybeSingle()

    if (!conversation) {
      return c.json({ error: 'Conversation not found' }, 404)
    }

    const { data: userParticipation } = await supabase
      .from('conversation_participants')
      .select('last_read_at, is_muted, role')
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)
      .maybeSingle()

    // Get all participants
    const { data: participants } = await supabase
      .from('conversation_participants')
      .select('user_id, role, joined_at')
      .eq('conversation_id', conversationId)
      .is('left_at', null)

    const participantUserIds = (participants || []).map((p: any) => p.user_id)
    const { data: users } = participantUserIds.length > 0
      ? await supabase.from('users').select('id, name, nickname, profile_photo_url').in('id', participantUserIds)
      : { data: [] }

    return c.json({
      conversation: {
        ...conversation,
        last_read_at: userParticipation?.last_read_at,
        is_muted: userParticipation?.is_muted,
        role: userParticipation?.role,
        participants: (users || []).map((u: any) => {
          const p = participants?.find((p: any) => p.user_id === u.id)
          return { ...u, role: p?.role, joined_at: p?.joined_at }
        })
      }
    })
  } catch (error) {
    console.error('Get conversation error:', error)
    return c.json({ error: 'Failed to get conversation' }, 500)
  }
})

// ============================================================================
// 4. GET /api/conversations/:id/messages - Get messages
// ============================================================================
messagingApi.get('/:id/messages', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const conversationId = c.req.param('id')

    if (!await isParticipant(supabase, conversationId, userId)) {
      return c.json({ error: 'Not authorized to view messages' }, 403)
    }

    const { limit } = getPaginationParams(c)
    const beforeId = c.req.query('before_id')
    const afterId = c.req.query('after_id')

    let query = supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (beforeId) {
      const { data: beforeMsg } = await supabase
        .from('messages')
        .select('created_at')
        .eq('id', beforeId)
        .maybeSingle()

      if (beforeMsg) {
        query = query.lt('created_at', beforeMsg.created_at)
      }
    } else if (afterId) {
      const { data: afterMsg } = await supabase
        .from('messages')
        .select('created_at')
        .eq('id', afterId)
        .maybeSingle()

      if (afterMsg) {
        query = query.gt('created_at', afterMsg.created_at)
      }
    }

    const { data: messages, error } = await query
    if (error) throw error

    // Reverse to show oldest first
    const orderedMessages = (messages || []).reverse()

    // Enrich with sender info
    const senderIds = [...new Set(orderedMessages.map((m: any) => m.sender_id))]
    const { data: senders } = senderIds.length > 0
      ? await supabase.from('users').select('id, name, nickname, profile_photo_url').in('id', senderIds)
      : { data: [] }

    const sendersMap = new Map((senders || []).map((s: any) => [s.id, s]))

    return c.json({
      messages: orderedMessages.map((msg: any) => {
        const sender = sendersMap.get(msg.sender_id)
        return {
          id: msg.id,
          conversation_id: msg.conversation_id,
          sender: {
            id: msg.sender_id,
            name: sender?.name,
            nickname: sender?.nickname,
            profile_photo_url: sender?.profile_photo_url
          },
          message_type: msg.message_type,
          content: msg.content,
          media_url: msg.media_url,
          shared_activity_id: msg.shared_activity_id,
          shared_post_id: msg.shared_post_id,
          shared_challenge_id: msg.shared_challenge_id,
          is_edited: msg.is_edited,
          edited_at: msg.edited_at,
          created_at: msg.created_at
        }
      }),
      hasMore: (messages || []).length === limit
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return c.json({ error: 'Failed to get messages' }, 500)
  }
})

// ============================================================================
// 5. POST /api/conversations/:id/messages - Send message
// ============================================================================
messagingApi.post(
  '/:id/messages',
  zValidator('json', sendMessageSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const userId = c.get('userId')
      if (!userId) return c.json({ error: 'Unauthorized' }, 401)

      const conversationId = c.req.param('id')

      if (!await isParticipant(supabase, conversationId, userId)) {
        return c.json({ error: 'Not authorized to send messages' }, 403)
      }

      const body = c.req.valid('json' as never) as {
        content?: string
        media_url?: string
        message_type?: string
        shared_activity_id?: string
        shared_post_id?: string
        shared_challenge_id?: string
      }

      const sanitizedContent = body.content ? sanitizeTextInput(body.content).substring(0, 5000) : null
      const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`
      const now = new Date().toISOString()

      const { error: insertErr } = await supabase
        .from('messages')
        .insert({
          id: messageId,
          conversation_id: conversationId,
          sender_id: userId,
          message_type: body.message_type || 'text',
          content: sanitizedContent || null,
          media_url: body.media_url || null,
          shared_activity_id: body.shared_activity_id || null,
          shared_post_id: body.shared_post_id || null,
          shared_challenge_id: body.shared_challenge_id || null,
          created_at: now,
        })

      if (insertErr) throw insertErr

      // Update conversation last_message_at and preview
      await supabase
        .from('conversations')
        .update({
          last_message_at: now,
          last_message_preview: sanitizedContent?.substring(0, 100) || '[Media]',
          updated_at: now,
        })
        .eq('id', conversationId)

      // Get sender info
      const { data: sender } = await supabase
        .from('users')
        .select('name, nickname, profile_photo_url')
        .eq('id', userId)
        .maybeSingle()

      return c.json({
        message: {
          id: messageId,
          conversation_id: conversationId,
          sender: {
            id: userId,
            name: sender?.name,
            nickname: sender?.nickname,
            profile_photo_url: sender?.profile_photo_url
          },
          message_type: body.message_type || 'text',
          content: sanitizedContent,
          media_url: body.media_url || null,
          shared_activity_id: body.shared_activity_id || null,
          shared_post_id: body.shared_post_id || null,
          shared_challenge_id: body.shared_challenge_id || null,
          created_at: now
        }
      }, 201)
    } catch (error) {
      console.error('Send message error:', error)
      return c.json({ error: 'Failed to send message' }, 500)
    }
  }
)

// ============================================================================
// 6. PUT /api/conversations/:id/messages/:messageId - Edit message
// ============================================================================
messagingApi.put(
  '/:id/messages/:messageId',
  zValidator('json', editMessageSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const userId = c.get('userId')
      if (!userId) return c.json({ error: 'Unauthorized' }, 401)

      const conversationId = c.req.param('id')
      const messageId = c.req.param('messageId')
      const { content } = c.req.valid('json' as never) as { content: string }

      // Get message
      const { data: message } = await supabase
        .from('messages')
        .select('*')
        .eq('id', messageId)
        .eq('conversation_id', conversationId)
        .is('deleted_at', null)
        .maybeSingle()

      if (!message) {
        return c.json({ error: 'Message not found' }, 404)
      }

      if (message.sender_id !== userId) {
        return c.json({ error: 'Only sender can edit message' }, 403)
      }

      // Check time window (15 minutes)
      const messageAge = Date.now() - new Date(message.created_at).getTime()
      if (messageAge > 15 * 60 * 1000) {
        return c.json({ error: 'Messages can only be edited within 15 minutes' }, 403)
      }

      const sanitizedContent = sanitizeTextInput(content).substring(0, 5000)
      const now = new Date().toISOString()

      await supabase
        .from('messages')
        .update({ content: sanitizedContent, is_edited: true, edited_at: now })
        .eq('id', messageId)

      return c.json({
        message: {
          id: messageId,
          content: sanitizedContent,
          is_edited: true,
          edited_at: now,
          created_at: message.created_at
        }
      })
    } catch (error) {
      console.error('Edit message error:', error)
      return c.json({ error: 'Failed to edit message' }, 500)
    }
  }
)

// ============================================================================
// 7. DELETE /api/conversations/:id/messages/:messageId - Delete message
// ============================================================================
messagingApi.delete('/:id/messages/:messageId', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const messageId = c.req.param('messageId')
    const conversationId = c.req.param('id')

    const { data: message } = await supabase
      .from('messages')
      .select('sender_id')
      .eq('id', messageId)
      .eq('conversation_id', conversationId)
      .is('deleted_at', null)
      .maybeSingle()

    if (!message) {
      return c.json({ error: 'Message not found' }, 404)
    }

    if (message.sender_id !== userId) {
      return c.json({ error: 'Only sender can delete message' }, 403)
    }

    await supabase
      .from('messages')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', messageId)

    return c.json({ success: true, message: 'Message deleted' })
  } catch (error) {
    console.error('Delete message error:', error)
    return c.json({ error: 'Failed to delete message' }, 500)
  }
})

// ============================================================================
// 8. POST /api/conversations/:id/read - Mark as read
// ============================================================================
messagingApi.post('/:id/read', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const conversationId = c.req.param('id')

    if (!await isParticipant(supabase, conversationId, userId)) {
      return c.json({ error: 'Not authorized' }, 403)
    }

    await supabase
      .from('conversation_participants')
      .update({ last_read_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)

    return c.json({ success: true, message: 'Marked as read' })
  } catch (error) {
    console.error('Mark as read error:', error)
    return c.json({ error: 'Failed to mark as read' }, 500)
  }
})

// ============================================================================
// 9. PUT /api/conversations/:id/mute - Mute/unmute conversation
// ============================================================================
messagingApi.put(
  '/:id/mute',
  zValidator('json', muteConversationSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const userId = c.get('userId')
      if (!userId) return c.json({ error: 'Unauthorized' }, 401)

      const conversationId = c.req.param('id')
      const { is_muted } = c.req.valid('json' as never) as { is_muted: boolean }

      if (!await isParticipant(supabase, conversationId, userId)) {
        return c.json({ error: 'Not authorized' }, 403)
      }

      await supabase
        .from('conversation_participants')
        .update({ is_muted })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId)

      return c.json({
        success: true,
        is_muted,
        message: is_muted ? 'Conversation muted' : 'Conversation unmuted'
      })
    } catch (error) {
      console.error('Mute conversation error:', error)
      return c.json({ error: 'Failed to update mute status' }, 500)
    }
  }
)

// ============================================================================
// 10. POST /api/conversations/:id/leave - Leave group conversation
// ============================================================================
messagingApi.post('/:id/leave', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const conversationId = c.req.param('id')

    const { data: conversation } = await supabase
      .from('conversations')
      .select('type')
      .eq('id', conversationId)
      .maybeSingle()

    if (!conversation) {
      return c.json({ error: 'Conversation not found' }, 404)
    }

    if (conversation.type !== 'group') {
      return c.json({ error: 'Cannot leave direct conversations' }, 400)
    }

    if (!await isParticipant(supabase, conversationId, userId)) {
      return c.json({ error: 'Not a participant' }, 403)
    }

    await supabase
      .from('conversation_participants')
      .update({ left_at: new Date().toISOString() })
      .eq('conversation_id', conversationId)
      .eq('user_id', userId)

    return c.json({ success: true, message: 'Left conversation' })
  } catch (error) {
    console.error('Leave conversation error:', error)
    return c.json({ error: 'Failed to leave conversation' }, 500)
  }
})

// ============================================================================
// 11. POST /api/conversations/:id/participants - Add participants (group only)
// ============================================================================
messagingApi.post(
  '/:id/participants',
  zValidator('json', addParticipantsSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const userId = c.get('userId')
      if (!userId) return c.json({ error: 'Unauthorized' }, 401)

      const conversationId = c.req.param('id')
      const { participant_ids } = c.req.valid('json' as never) as { participant_ids: string[] }

      const { data: conversation } = await supabase
        .from('conversations')
        .select('type')
        .eq('id', conversationId)
        .maybeSingle()

      if (!conversation) {
        return c.json({ error: 'Conversation not found' }, 404)
      }

      if (conversation.type !== 'group') {
        return c.json({ error: 'Can only add participants to group conversations' }, 400)
      }

      // Check if user is admin/owner
      const { data: participant } = await supabase
        .from('conversation_participants')
        .select('role')
        .eq('conversation_id', conversationId)
        .eq('user_id', userId)
        .is('left_at', null)
        .maybeSingle()

      if (!participant || !['owner', 'admin'].includes(participant.role)) {
        return c.json({ error: 'Only admins can add participants' }, 403)
      }

      // Add new participants
      const added: string[] = []
      const now = new Date().toISOString()

      for (const newParticipantId of participant_ids) {
        const { data: existing } = await supabase
          .from('conversation_participants')
          .select('id')
          .eq('conversation_id', conversationId)
          .eq('user_id', newParticipantId)
          .is('left_at', null)
          .maybeSingle()

        if (!existing) {
          const cpId = `cp_${Date.now()}_${Math.random().toString(36).substring(7)}`
          await supabase.from('conversation_participants').insert({
            id: cpId, conversation_id: conversationId, user_id: newParticipantId,
            role: 'member', joined_at: now,
          })
          added.push(newParticipantId)
        }
      }

      return c.json({
        success: true,
        added_count: added.length,
        message: `Added ${added.length} participant(s)`
      })
    } catch (error) {
      console.error('Add participants error:', error)
      return c.json({ error: 'Failed to add participants' }, 500)
    }
  }
)

export default messagingApi
