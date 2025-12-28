// Better Together: Messaging & DM System API
// Handles direct messages, group conversations, and real-time messaging

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import { requireAuth, checkRateLimit } from './auth'

const messagingApi = new Hono()

// Helper function to check if user is blocked
async function isBlocked(db: any, userId: string, otherUserId: string): Promise<boolean> {
  const block = await db.first<{ id: string }>(`
    SELECT id FROM user_blocks
    WHERE (blocker_id = $1 AND blocked_id = $2) OR (blocker_id = $2 AND blocked_id = $1)
  `, [userId, otherUserId])
  return !!block
}

// Helper function to verify conversation participant
async function isParticipant(db: any, conversationId: string, userId: string): Promise<boolean> {
  const participant = await db.first<{ id: string }>(`
    SELECT id FROM conversation_participants
    WHERE conversation_id = $1 AND user_id = $2 AND left_at IS NULL
  `, [conversationId, userId])
  return !!participant
}

// Helper function to get unread count for a conversation
async function getUnreadCount(db: any, conversationId: string, userId: string): Promise<number> {
  const participant = await db.first<{ last_read_at: string | null }>(`
    SELECT last_read_at FROM conversation_participants
    WHERE conversation_id = $1 AND user_id = $2
  `, [conversationId, userId])

  if (!participant) return 0

  const result = await db.first<{ count: number }>(`
    SELECT COUNT(*) as count FROM messages
    WHERE conversation_id = $1
      AND sender_id != $2
      AND deleted_at IS NULL
      AND created_at > COALESCE($3, '1970-01-01')
  `, [conversationId, userId, participant.last_read_at || null])

  return result?.count || 0
}

// ============================================================================
// 1. GET /api/conversations - List user's conversations
// ============================================================================
messagingApi.get('/', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    // Get conversations where user is a participant
    const conversations = await db.all<any>(`
      SELECT
        c.*,
        cp.last_read_at,
        cp.is_muted
      FROM conversations c
      INNER JOIN conversation_participants cp ON c.id = cp.conversation_id
      WHERE cp.user_id = $1 AND cp.left_at IS NULL
      ORDER BY c.last_message_at DESC NULLS LAST, c.created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset])

    // Enrich with participant info and unread counts
    const enriched = await Promise.all(conversations.map(async (conv) => {
      // Get other participants
      const participants = await db.all<any>(`
        SELECT
          u.id,
          u.name,
          u.nickname,
          u.profile_photo_url,
          cp.role
        FROM conversation_participants cp
        INNER JOIN users u ON cp.user_id = u.id
        WHERE cp.conversation_id = $1 AND cp.left_at IS NULL AND u.id != $2
      `, [conv.id, userId])

      // Get unread count
      const unreadCount = await getUnreadCount(db, conv.id, userId)

      return {
        id: conv.id,
        type: conv.type,
        name: conv.name,
        avatar_url: conv.avatar_url,
        participants,
        last_message_at: conv.last_message_at,
        last_message_preview: conv.last_message_preview,
        unread_count: unreadCount,
        is_muted: conv.is_muted,
        created_at: conv.created_at
      }
    }))

    return c.json({
      conversations: enriched,
      page,
      limit,
      hasMore: conversations.length === limit
    })
  } catch (error) {
    console.error('List conversations error:', error)
    return c.json({ error: 'Failed to list conversations' }, 500)
  }
})

// ============================================================================
// 2. POST /api/conversations - Create/get conversation
// ============================================================================
messagingApi.post('/', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const { participant_id, participant_ids, name, type } = await c.req.json()

    // Determine conversation type
    const conversationType = type || (participant_ids ? 'group' : 'direct')

    if (conversationType === 'direct') {
      // Direct message - must have exactly one other participant
      if (!participant_id) {
        return c.json({ error: 'participant_id required for direct messages' }, 400)
      }

      // Check if blocked
      if (await isBlocked(db, userId, participant_id)) {
        return c.json({ error: 'Cannot message this user' }, 403)
      }

      // Check if conversation already exists
      const existing = await db.first<any>(`
        SELECT c.* FROM conversations c
        INNER JOIN conversation_participants cp1 ON c.id = cp1.conversation_id AND cp1.user_id = $1
        INNER JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id = $2
        WHERE c.type = 'direct'
          AND cp1.left_at IS NULL
          AND cp2.left_at IS NULL
      `, [userId, participant_id])

      if (existing) {
        // Return existing conversation with participants
        const participants = await db.all<any>(`
          SELECT
            u.id,
            u.name,
            u.nickname,
            u.profile_photo_url,
            cp.role,
            cp.last_read_at
          FROM conversation_participants cp
          INNER JOIN users u ON cp.user_id = u.id
          WHERE cp.conversation_id = $1 AND cp.left_at IS NULL
        `, [existing.id])

        return c.json({
          conversation: {
            ...existing,
            participants
          },
          isNew: false
        })
      }

      // Create new direct conversation
      const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`

      await db.run(`
        INSERT INTO conversations (id, type, created_by, created_at, updated_at)
        VALUES ($1, 'direct', $2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [conversationId, userId])

      // Add participants
      const participant1Id = `cp_${Date.now()}_${Math.random().toString(36).substring(7)}`
      const participant2Id = `cp_${Date.now()}_${Math.random().toString(36).substring(7)}_2`

      await db.run(`
        INSERT INTO conversation_participants (id, conversation_id, user_id, role, joined_at)
        VALUES
          ($1, $2, $3, 'member', CURRENT_TIMESTAMP),
          ($4, $2, $5, 'member', CURRENT_TIMESTAMP)
      `, [participant1Id, conversationId, userId, participant2Id, participant_id])

      // Get participants for response
      const participants = await db.all<any>(`
        SELECT
          u.id,
          u.name,
          u.nickname,
          u.profile_photo_url
        FROM conversation_participants cp
        INNER JOIN users u ON cp.user_id = u.id
        WHERE cp.conversation_id = $1
      `, [conversationId])

      const conversation = await db.first(`
        SELECT * FROM conversations WHERE id = $1
      `, [conversationId])

      return c.json({
        conversation: {
          ...conversation,
          participants
        },
        isNew: true
      }, 201)

    } else {
      // Group conversation
      if (!participant_ids || participant_ids.length < 2) {
        return c.json({ error: 'At least 2 participants required for group chat' }, 400)
      }

      if (!name) {
        return c.json({ error: 'Group name required' }, 400)
      }

      // Create group conversation
      const conversationId = `conv_${Date.now()}_${Math.random().toString(36).substring(7)}`

      await db.run(`
        INSERT INTO conversations (id, type, name, created_by, created_at, updated_at)
        VALUES ($1, 'group', $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [conversationId, name, userId])

      // Add creator as owner
      const creatorParticipantId = `cp_${Date.now()}_${Math.random().toString(36).substring(7)}`
      await db.run(`
        INSERT INTO conversation_participants (id, conversation_id, user_id, role, joined_at)
        VALUES ($1, $2, $3, 'owner', CURRENT_TIMESTAMP)
      `, [creatorParticipantId, conversationId, userId])

      // Add other participants as members
      for (const participantId of participant_ids) {
        if (participantId !== userId) {
          const cpId = `cp_${Date.now()}_${Math.random().toString(36).substring(7)}`
          await db.run(`
            INSERT INTO conversation_participants (id, conversation_id, user_id, role, joined_at)
            VALUES ($1, $2, $3, 'member', CURRENT_TIMESTAMP)
          `, [cpId, conversationId, participantId])
        }
      }

      // Get participants for response
      const participants = await db.all<any>(`
        SELECT
          u.id,
          u.name,
          u.nickname,
          u.profile_photo_url,
          cp.role
        FROM conversation_participants cp
        INNER JOIN users u ON cp.user_id = u.id
        WHERE cp.conversation_id = $1
      `, [conversationId])

      const conversation = await db.first(`
        SELECT * FROM conversations WHERE id = $1
      `, [conversationId])

      return c.json({
        conversation: {
          ...conversation,
          participants
        },
        isNew: true
      }, 201)
    }
  } catch (error) {
    console.error('Create conversation error:', error)
    return c.json({ error: 'Failed to create conversation' }, 500)
  }
})

// ============================================================================
// 3. GET /api/conversations/:id - Get conversation details
// ============================================================================
messagingApi.get('/:id', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const conversationId = c.req.param('id')

    // Verify user is participant
    if (!await isParticipant(db, conversationId, userId)) {
      return c.json({ error: 'Not authorized to view this conversation' }, 403)
    }

    // Get conversation details
    const conversation = await db.first<any>(`
      SELECT c.*, cp.last_read_at, cp.is_muted, cp.role
      FROM conversations c
      INNER JOIN conversation_participants cp ON c.id = cp.conversation_id AND cp.user_id = $1
      WHERE c.id = $2
    `, [userId, conversationId])

    if (!conversation) {
      return c.json({ error: 'Conversation not found' }, 404)
    }

    // Get all participants
    const participants = await db.all<any>(`
      SELECT
        u.id,
        u.name,
        u.nickname,
        u.profile_photo_url,
        cp.role,
        cp.joined_at
      FROM conversation_participants cp
      INNER JOIN users u ON cp.user_id = u.id
      WHERE cp.conversation_id = $1 AND cp.left_at IS NULL
    `, [conversationId])

    return c.json({
      conversation: {
        ...conversation,
        participants
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
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const conversationId = c.req.param('id')

    // Verify user is participant
    if (!await isParticipant(db, conversationId, userId)) {
      return c.json({ error: 'Not authorized to view messages' }, 403)
    }

    const limit = parseInt(c.req.query('limit') || '50')
    const beforeId = c.req.query('before_id')
    const afterId = c.req.query('after_id')

    let query = `
      SELECT
        m.*,
        u.name as sender_name,
        u.nickname as sender_nickname,
        u.profile_photo_url as sender_photo
      FROM messages m
      INNER JOIN users u ON m.sender_id = u.id
      WHERE m.conversation_id = $1 AND m.deleted_at IS NULL
    `
    const params: any[] = [conversationId]

    if (beforeId) {
      // Get messages before this ID (pagination backwards)
      const beforeMessage = await db.first<{ created_at: string }>(`
        SELECT created_at FROM messages WHERE id = $1
      `, [beforeId])

      if (beforeMessage) {
        query += ` AND m.created_at < $${params.length + 1}`
        params.push(beforeMessage.created_at)
      }
    } else if (afterId) {
      // Get messages after this ID (pagination forwards)
      const afterMessage = await db.first<{ created_at: string }>(`
        SELECT created_at FROM messages WHERE id = $1
      `, [afterId])

      if (afterMessage) {
        query += ` AND m.created_at > $${params.length + 1}`
        params.push(afterMessage.created_at)
      }
    }

    query += ` ORDER BY m.created_at DESC LIMIT $${params.length + 1}`
    params.push(limit)

    const messages = await db.all<any>(query, params)

    // Reverse to show oldest first
    messages.reverse()

    return c.json({
      messages: messages.map(msg => ({
        id: msg.id,
        conversation_id: msg.conversation_id,
        sender: {
          id: msg.sender_id,
          name: msg.sender_name,
          nickname: msg.sender_nickname,
          profile_photo_url: msg.sender_photo
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
      })),
      hasMore: messages.length === limit
    })
  } catch (error) {
    console.error('Get messages error:', error)
    return c.json({ error: 'Failed to get messages' }, 500)
  }
})

// ============================================================================
// 5. POST /api/conversations/:id/messages - Send message
// ============================================================================
messagingApi.post('/:id/messages', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const conversationId = c.req.param('id')

    // Rate limiting - max 60 messages per minute
    if (checkRateLimit(`msg:${userId}`, 60, 1)) {
      return c.json({ error: 'Rate limit exceeded. Please slow down.' }, 429)
    }

    // Verify user is participant
    if (!await isParticipant(db, conversationId, userId)) {
      return c.json({ error: 'Not authorized to send messages' }, 403)
    }

    const {
      content,
      media_url,
      message_type = 'text',
      shared_activity_id,
      shared_post_id,
      shared_challenge_id
    } = await c.req.json()

    // Validate content
    if (!content && !media_url && !shared_activity_id && !shared_post_id && !shared_challenge_id) {
      return c.json({ error: 'Message content, media, or shared content required' }, 400)
    }

    // Sanitize content
    const sanitizedContent = content?.trim().substring(0, 5000) // Max 5000 chars

    // Create message
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`

    await db.run(`
      INSERT INTO messages (
        id,
        conversation_id,
        sender_id,
        message_type,
        content,
        media_url,
        shared_activity_id,
        shared_post_id,
        shared_challenge_id,
        created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
    `, [
      messageId,
      conversationId,
      userId,
      message_type,
      sanitizedContent || null,
      media_url || null,
      shared_activity_id || null,
      shared_post_id || null,
      shared_challenge_id || null
    ])

    // Update conversation last_message_at and preview (done by trigger, but doing manually for consistency)
    await db.run(`
      UPDATE conversations
      SET
        last_message_at = CURRENT_TIMESTAMP,
        last_message_preview = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [sanitizedContent?.substring(0, 100) || '[Media]', conversationId])

    // Get created message with sender info
    const message = await db.first<any>(`
      SELECT
        m.*,
        u.name as sender_name,
        u.nickname as sender_nickname,
        u.profile_photo_url as sender_photo
      FROM messages m
      INNER JOIN users u ON m.sender_id = u.id
      WHERE m.id = $1
    `, [messageId])

    return c.json({
      message: {
        id: message.id,
        conversation_id: message.conversation_id,
        sender: {
          id: message.sender_id,
          name: message.sender_name,
          nickname: message.sender_nickname,
          profile_photo_url: message.sender_photo
        },
        message_type: message.message_type,
        content: message.content,
        media_url: message.media_url,
        shared_activity_id: message.shared_activity_id,
        shared_post_id: message.shared_post_id,
        shared_challenge_id: message.shared_challenge_id,
        created_at: message.created_at
      }
    }, 201)
  } catch (error) {
    console.error('Send message error:', error)
    return c.json({ error: 'Failed to send message' }, 500)
  }
})

// ============================================================================
// 6. PUT /api/conversations/:id/messages/:messageId - Edit message
// ============================================================================
messagingApi.put('/:id/messages/:messageId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const conversationId = c.req.param('id')
    const messageId = c.req.param('messageId')

    const { content } = await c.req.json()

    if (!content) {
      return c.json({ error: 'Content required' }, 400)
    }

    // Get message
    const message = await db.first<any>(`
      SELECT * FROM messages WHERE id = $1 AND conversation_id = $2 AND deleted_at IS NULL
    `, [messageId, conversationId])

    if (!message) {
      return c.json({ error: 'Message not found' }, 404)
    }

    // Verify sender
    if (message.sender_id !== userId) {
      return c.json({ error: 'Only sender can edit message' }, 403)
    }

    // Check time window (15 minutes)
    const messageAge = Date.now() - new Date(message.created_at).getTime()
    const fifteenMinutes = 15 * 60 * 1000

    if (messageAge > fifteenMinutes) {
      return c.json({ error: 'Messages can only be edited within 15 minutes' }, 403)
    }

    // Sanitize content
    const sanitizedContent = content.trim().substring(0, 5000)

    // Update message
    await db.run(`
      UPDATE messages
      SET
        content = $1,
        is_edited = true,
        edited_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [sanitizedContent, messageId])

    // Get updated message
    const updated = await db.first<any>(`
      SELECT
        m.*,
        u.name as sender_name,
        u.nickname as sender_nickname,
        u.profile_photo_url as sender_photo
      FROM messages m
      INNER JOIN users u ON m.sender_id = u.id
      WHERE m.id = $1
    `, [messageId])

    return c.json({
      message: {
        id: updated.id,
        content: updated.content,
        is_edited: updated.is_edited,
        edited_at: updated.edited_at,
        created_at: updated.created_at
      }
    })
  } catch (error) {
    console.error('Edit message error:', error)
    return c.json({ error: 'Failed to edit message' }, 500)
  }
})

// ============================================================================
// 7. DELETE /api/conversations/:id/messages/:messageId - Delete message
// ============================================================================
messagingApi.delete('/:id/messages/:messageId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const conversationId = c.req.param('id')
    const messageId = c.req.param('messageId')

    // Get message
    const message = await db.first<any>(`
      SELECT * FROM messages WHERE id = $1 AND conversation_id = $2 AND deleted_at IS NULL
    `, [messageId, conversationId])

    if (!message) {
      return c.json({ error: 'Message not found' }, 404)
    }

    // Verify sender
    if (message.sender_id !== userId) {
      return c.json({ error: 'Only sender can delete message' }, 403)
    }

    // Soft delete
    await db.run(`
      UPDATE messages SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1
    `, [messageId])

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
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const conversationId = c.req.param('id')

    // Verify user is participant
    if (!await isParticipant(db, conversationId, userId)) {
      return c.json({ error: 'Not authorized' }, 403)
    }

    // Update last_read_at
    await db.run(`
      UPDATE conversation_participants
      SET last_read_at = CURRENT_TIMESTAMP
      WHERE conversation_id = $1 AND user_id = $2
    `, [conversationId, userId])

    return c.json({ success: true, message: 'Marked as read' })
  } catch (error) {
    console.error('Mark as read error:', error)
    return c.json({ error: 'Failed to mark as read' }, 500)
  }
})

// ============================================================================
// 9. PUT /api/conversations/:id/mute - Mute/unmute conversation
// ============================================================================
messagingApi.put('/:id/mute', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const conversationId = c.req.param('id')
    const { is_muted } = await c.req.json()

    // Verify user is participant
    if (!await isParticipant(db, conversationId, userId)) {
      return c.json({ error: 'Not authorized' }, 403)
    }

    // Update mute status
    await db.run(`
      UPDATE conversation_participants
      SET is_muted = $1
      WHERE conversation_id = $2 AND user_id = $3
    `, [is_muted, conversationId, userId])

    return c.json({
      success: true,
      is_muted,
      message: is_muted ? 'Conversation muted' : 'Conversation unmuted'
    })
  } catch (error) {
    console.error('Mute conversation error:', error)
    return c.json({ error: 'Failed to update mute status' }, 500)
  }
})

// ============================================================================
// 10. POST /api/conversations/:id/leave - Leave group conversation
// ============================================================================
messagingApi.post('/:id/leave', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const conversationId = c.req.param('id')

    // Get conversation
    const conversation = await db.first<any>(`
      SELECT * FROM conversations WHERE id = $1
    `, [conversationId])

    if (!conversation) {
      return c.json({ error: 'Conversation not found' }, 404)
    }

    // Can only leave group conversations
    if (conversation.type !== 'group') {
      return c.json({ error: 'Cannot leave direct conversations' }, 400)
    }

    // Verify user is participant
    if (!await isParticipant(db, conversationId, userId)) {
      return c.json({ error: 'Not a participant' }, 403)
    }

    // Mark as left
    await db.run(`
      UPDATE conversation_participants
      SET left_at = CURRENT_TIMESTAMP
      WHERE conversation_id = $1 AND user_id = $2
    `, [conversationId, userId])

    return c.json({ success: true, message: 'Left conversation' })
  } catch (error) {
    console.error('Leave conversation error:', error)
    return c.json({ error: 'Failed to leave conversation' }, 500)
  }
})

// ============================================================================
// 11. POST /api/conversations/:id/participants - Add participants (group only)
// ============================================================================
messagingApi.post('/:id/participants', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const conversationId = c.req.param('id')
    const { participant_ids } = await c.req.json()

    if (!participant_ids || !Array.isArray(participant_ids) || participant_ids.length === 0) {
      return c.json({ error: 'participant_ids array required' }, 400)
    }

    // Get conversation
    const conversation = await db.first<any>(`
      SELECT * FROM conversations WHERE id = $1
    `, [conversationId])

    if (!conversation) {
      return c.json({ error: 'Conversation not found' }, 404)
    }

    // Can only add to group conversations
    if (conversation.type !== 'group') {
      return c.json({ error: 'Can only add participants to group conversations' }, 400)
    }

    // Check if user is admin/owner
    const participant = await db.first<any>(`
      SELECT * FROM conversation_participants
      WHERE conversation_id = $1 AND user_id = $2 AND left_at IS NULL
    `, [conversationId, userId])

    if (!participant || !['owner', 'admin'].includes(participant.role)) {
      return c.json({ error: 'Only admins can add participants' }, 403)
    }

    // Add new participants
    const added = []
    for (const newParticipantId of participant_ids) {
      // Check if already a participant
      const existing = await db.first<{ id: string }>(`
        SELECT id FROM conversation_participants
        WHERE conversation_id = $1 AND user_id = $2 AND left_at IS NULL
      `, [conversationId, newParticipantId])

      if (!existing) {
        const cpId = `cp_${Date.now()}_${Math.random().toString(36).substring(7)}`
        await db.run(`
          INSERT INTO conversation_participants (id, conversation_id, user_id, role, joined_at)
          VALUES ($1, $2, $3, 'member', CURRENT_TIMESTAMP)
        `, [cpId, conversationId, newParticipantId])
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
})

export default messagingApi
