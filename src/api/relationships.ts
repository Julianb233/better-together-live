// Better Together: Relationships API
// Handles partner linking, relationship status, and management
// Migrated from Neon raw SQL to Supabase query builder

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { zValidator } from '@hono/zod-validator'
import {
  linkPartnersSchema,
  invitePartnerSchema,
  updateRelationshipSchema,
  acceptInviteSchema,
} from '../lib/validation/schemas/relationships'
import { checkOwnership, forbiddenResponse } from '../lib/security'

const relationshipsApi = new Hono()

function getSupabaseEnv(c: Context): SupabaseEnv {
  return {
    SUPABASE_URL: c.env?.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: c.env?.SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: c.env?.SUPABASE_SERVICE_ROLE_KEY
  }
}

// POST /api/relationships/link
// Link two users as partners
relationshipsApi.post(
  '/link',
  zValidator('json', linkPartnersSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const { user1Id, user2Id, relationshipType, startDate } = c.req.valid('json' as never) as {
        user1Id: string
        user2Id: string
        relationshipType: string
        startDate?: string
      }

      // Check if relationship already exists
      const { data: existing } = await supabase
        .from('relationships')
        .select('id')
        .or(`and(user_1_id.eq.${user1Id},user_2_id.eq.${user2Id}),and(user_1_id.eq.${user2Id},user_2_id.eq.${user1Id})`)
        .maybeSingle()

      if (existing) {
        return c.json({ error: 'Relationship already exists', relationshipId: existing.id }, 409)
      }

      // Create relationship
      const relationshipId = `rel_${Date.now()}_${Math.random().toString(36).substring(7)}`

      const { error } = await supabase
        .from('relationships')
        .insert({
          id: relationshipId,
          user_1_id: user1Id,
          user_2_id: user2Id,
          relationship_type: relationshipType || 'partnership',
          start_date: startDate || new Date().toISOString().split('T')[0],
          status: 'active',
          created_at: new Date().toISOString(),
        })

      if (error) throw error

      return c.json({
        success: true,
        relationshipId,
        message: 'Partners linked successfully'
      })
    } catch (error) {
      console.error('Link error:', error)
      return c.json({ error: 'Failed to link partners' }, 500)
    }
  }
)

// POST /api/relationships/invite
// Send partner invitation
relationshipsApi.post(
  '/invite',
  zValidator('json', invitePartnerSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const { inviterUserId, partnerEmail, relationshipType, message } = c.req.valid('json' as never) as {
        inviterUserId: string
        partnerEmail: string
        relationshipType: string
        message?: string
      }

      // Generate invitation token
      const inviteToken = `inv_${Date.now()}_${Math.random().toString(36).substring(7)}`
      const invitationId = `invite_${Date.now()}`
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()

      const { error } = await supabase
        .from('partner_invitations')
        .insert({
          id: invitationId,
          inviter_user_id: inviterUserId,
          partner_email: partnerEmail,
          invite_token: inviteToken,
          relationship_type: relationshipType || 'partnership',
          message: message || null,
          status: 'pending',
          created_at: new Date().toISOString(),
          expires_at: expiresAt,
        })

      if (error) throw error

      return c.json({
        success: true,
        invitationId,
        inviteToken,
        inviteUrl: `https://better-together.app/accept-invite?token=${inviteToken}`,
        expiresIn: '7 days'
      })
    } catch (error) {
      console.error('Invite error:', error)
      return c.json({ error: 'Failed to create invitation' }, 500)
    }
  }
)

// GET /api/relationships/:relationshipId/status
// Get relationship status with stats
relationshipsApi.get('/:relationshipId/status', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const relationshipId = c.req.param('relationshipId')

    // Get relationship with user info via separate queries (Supabase doesn't support arbitrary JOINs on same table twice)
    const { data: relationship, error } = await supabase
      .from('relationships')
      .select('*')
      .eq('id', relationshipId)
      .maybeSingle()

    if (error) throw error
    if (!relationship) {
      return c.json({ error: 'Relationship not found' }, 404)
    }

    // Get user info for both partners
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email')
      .in('id', [relationship.user_1_id, relationship.user_2_id])

    const user1 = users?.find(u => u.id === relationship.user_1_id)
    const user2 = users?.find(u => u.id === relationship.user_2_id)

    // Calculate days together
    const startDate = new Date(relationship.start_date)
    const today = new Date()
    const daysTogether = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Get recent activity count
    const { count: activityCount } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('relationship_id', relationshipId)

    // Get goal progress
    const { data: goalsData } = await supabase
      .from('shared_goals')
      .select('status')
      .eq('relationship_id', relationshipId)

    const goalsTotal = goalsData?.length || 0
    const goalsCompleted = goalsData?.filter(g => g.status === 'completed').length || 0

    return c.json({
      id: relationship.id,
      status: relationship.status,
      type: relationship.relationship_type,
      startDate: relationship.start_date,
      daysTogether,
      partners: [
        { id: relationship.user_1_id, name: user1?.name, email: user1?.email },
        { id: relationship.user_2_id, name: user2?.name, email: user2?.email }
      ],
      stats: {
        activitiesCompleted: activityCount || 0,
        goalsTotal,
        goalsCompleted
      },
      anniversary: relationship.anniversary_date,
      createdAt: relationship.created_at
    })
  } catch (error) {
    console.error('Status error:', error)
    return c.json({ error: 'Failed to get relationship status' }, 500)
  }
})

// GET /api/relationships/user/:userId
// Get relationship for a specific user
relationshipsApi.get('/user/:userId', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.req.param('userId')

    if (!checkOwnership(c, userId)) {
      return forbiddenResponse(c)
    }

    // Find active relationship where user is either user_1 or user_2
    const { data: relationship, error } = await supabase
      .from('relationships')
      .select('*')
      .eq('status', 'active')
      .or(`user_1_id.eq.${userId},user_2_id.eq.${userId}`)
      .maybeSingle()

    if (error) throw error
    if (!relationship) {
      return c.json({ hasPartner: false, relationship: null })
    }

    // Get user info for both partners
    const { data: users } = await supabase
      .from('users')
      .select('id, name, email')
      .in('id', [relationship.user_1_id, relationship.user_2_id])

    const isUser1 = relationship.user_1_id === userId
    const partnerId = isUser1 ? relationship.user_2_id : relationship.user_1_id
    const partnerData = users?.find(u => u.id === partnerId)

    const startDate = new Date(relationship.start_date)
    const today = new Date()
    const daysTogether = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    return c.json({
      hasPartner: true,
      relationship: {
        id: relationship.id,
        type: relationship.relationship_type,
        startDate: relationship.start_date,
        daysTogether,
        partner: {
          id: partnerId,
          name: partnerData?.name,
          email: partnerData?.email,
        },
        status: relationship.status
      }
    })
  } catch (error) {
    console.error('Get user relationship error:', error)
    return c.json({ error: 'Failed to get relationship' }, 500)
  }
})

// PUT /api/relationships/:relationshipId
// Update relationship info
relationshipsApi.put(
  '/:relationshipId',
  zValidator('json', updateRelationshipSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const relationshipId = c.req.param('relationshipId')
      const { relationshipType, startDate, anniversaryDate } = c.req.valid('json' as never) as {
        relationshipType?: string
        startDate?: string
        anniversaryDate?: string
      }

      const updates: Record<string, any> = {
        updated_at: new Date().toISOString(),
      }
      if (relationshipType !== undefined) updates.relationship_type = relationshipType
      if (startDate !== undefined) updates.start_date = startDate
      if (anniversaryDate !== undefined) updates.anniversary_date = anniversaryDate

      const { error } = await supabase
        .from('relationships')
        .update(updates)
        .eq('id', relationshipId)

      if (error) throw error

      return c.json({ success: true, message: 'Relationship updated' })
    } catch (error) {
      console.error('Update error:', error)
      return c.json({ error: 'Failed to update relationship' }, 500)
    }
  }
)

// DELETE /api/relationships/:relationshipId
// End relationship (soft delete)
relationshipsApi.delete('/:relationshipId', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const relationshipId = c.req.param('relationshipId')

    const { error } = await supabase
      .from('relationships')
      .update({ status: 'ended', updated_at: new Date().toISOString() })
      .eq('id', relationshipId)

    if (error) throw error

    return c.json({ success: true, message: 'Relationship ended' })
  } catch (error) {
    console.error('Delete error:', error)
    return c.json({ error: 'Failed to end relationship' }, 500)
  }
})

// POST /api/relationships/accept-invite
// Accept partner invitation
relationshipsApi.post(
  '/accept-invite',
  zValidator('json', acceptInviteSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const { inviteToken, acceptingUserId } = c.req.valid('json' as never) as {
        inviteToken: string
        acceptingUserId: string
      }

      // Find invitation
      const { data: invitation, error: inviteErr } = await supabase
        .from('partner_invitations')
        .select('*')
        .eq('invite_token', inviteToken)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle()

      if (inviteErr) throw inviteErr
      if (!invitation) {
        return c.json({ error: 'Invalid or expired invitation' }, 400)
      }

      // Create relationship
      const relationshipId = `rel_${Date.now()}_${Math.random().toString(36).substring(7)}`
      const now = new Date().toISOString()

      const { error: relErr } = await supabase
        .from('relationships')
        .insert({
          id: relationshipId,
          user_1_id: invitation.inviter_user_id,
          user_2_id: acceptingUserId,
          relationship_type: invitation.relationship_type,
          start_date: now,
          status: 'active',
          created_at: now,
        })

      if (relErr) throw relErr

      // Update invitation status
      const { error: updateErr } = await supabase
        .from('partner_invitations')
        .update({ status: 'accepted', accepted_at: now })
        .eq('id', invitation.id)

      if (updateErr) throw updateErr

      return c.json({
        success: true,
        relationshipId,
        message: 'Invitation accepted! You are now connected.'
      })
    } catch (error) {
      console.error('Accept invite error:', error)
      return c.json({ error: 'Failed to accept invitation' }, 500)
    }
  }
)

// GET /api/partner/comparison - Get quiz comparison data
relationshipsApi.get('/partner/comparison', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const relationshipId = c.req.query('relationshipId')
    const userId = c.req.query('userId')

    if (!relationshipId || !userId) {
      return c.json({ error: 'relationshipId and userId are required' }, 400)
    }

    // Get relationship to find partner
    const { data: relationship, error: relErr } = await supabase
      .from('relationships')
      .select('*')
      .eq('id', relationshipId)
      .maybeSingle()

    if (relErr) throw relErr
    if (!relationship) {
      return c.json({ error: 'Relationship not found' }, 404)
    }

    const partnerId = relationship.user_1_id === userId
      ? relationship.user_2_id
      : relationship.user_1_id

    // Get both users' data
    const { data: users, error: usersErr } = await supabase
      .from('users')
      .select('id, name, primary_love_language, secondary_love_language')
      .in('id', [userId, partnerId])

    if (usersErr) throw usersErr

    const user = users?.find(u => u.id === userId)
    const partner = users?.find(u => u.id === partnerId)

    // In production, this would query quiz responses and calculate detailed compatibility
    const comparison = {
      relationshipId,
      users: {
        user: {
          id: user?.id,
          name: user?.name,
          primaryLoveLanguage: user?.primary_love_language,
          secondaryLoveLanguage: user?.secondary_love_language
        },
        partner: {
          id: partner?.id,
          name: partner?.name,
          primaryLoveLanguage: partner?.primary_love_language,
          secondaryLoveLanguage: partner?.secondary_love_language
        }
      },
      compatibility: {
        overallScore: 82,
        categories: {
          communication: {
            score: 85,
            userScore: 4.2,
            partnerScore: 4.3,
            alignment: 'high',
            insights: [
              'Both prefer open communication',
              'Similar conflict resolution styles'
            ]
          },
          quality_time: {
            score: 78,
            userScore: 4.5,
            partnerScore: 3.9,
            alignment: 'medium',
            insights: [
              'Both value quality time but with different intensities',
              'Consider finding balance in activity planning'
            ]
          },
          intimacy: {
            score: 88,
            userScore: 4.4,
            partnerScore: 4.4,
            alignment: 'high',
            insights: [
              'Very aligned on physical affection needs',
              'Strong emotional connection'
            ]
          },
          future_planning: {
            score: 75,
            userScore: 4.0,
            partnerScore: 3.5,
            alignment: 'medium',
            insights: [
              'Some differences in planning approaches',
              'Good opportunity for compromise'
            ]
          },
          family: {
            score: 80,
            userScore: 4.1,
            partnerScore: 4.0,
            alignment: 'high',
            insights: [
              'Similar family values',
              'Aligned on family importance'
            ]
          }
        }
      },
      strengths: [
        'Strong emotional and physical connection',
        'Excellent communication alignment',
        'Shared family values'
      ],
      growthAreas: [
        'Balancing quality time preferences',
        'Aligning on future planning approaches'
      ],
      recommendations: [
        'Schedule regular date nights to satisfy quality time needs',
        'Have a deep conversation about 5-year goals',
        'Continue your open communication practices'
      ]
    }

    return c.json({
      success: true,
      comparison
    })
  } catch (error) {
    console.error('Get partner comparison error:', error)
    return c.json({ error: 'Failed to get comparison data' }, 500)
  }
})

export default relationshipsApi
