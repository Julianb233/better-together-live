// Better Together: Relationships API
// Handles partner linking, relationship status, and management

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'

const relationshipsApi = new Hono()

// POST /api/relationships/link
// Link two users as partners
relationshipsApi.post('/link', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const { user1Id, user2Id, relationshipType, startDate } = await c.req.json()

    if (!user1Id || !user2Id) {
      return c.json({ error: 'Both user IDs required' }, 400)
    }

    if (user1Id === user2Id) {
      return c.json({ error: 'Cannot link user to themselves' }, 400)
    }

    // Check if relationship already exists
    const existing = await db.first<{ id: string }>(`
      SELECT id FROM relationships
      WHERE (user_1_id = $1 AND user_2_id = $2) OR (user_1_id = $2 AND user_2_id = $1)
    `, [user1Id, user2Id])

    if (existing) {
      return c.json({ error: 'Relationship already exists', relationshipId: existing.id }, 409)
    }

    // Create relationship
    const relationshipId = `rel_${Date.now()}_${Math.random().toString(36).substring(7)}`

    await db.run(`
      INSERT INTO relationships (id, user_1_id, user_2_id, relationship_type, start_date, status, created_at)
      VALUES ($1, $2, $3, $4, $5, 'active', CURRENT_TIMESTAMP)
    `, [
      relationshipId,
      user1Id,
      user2Id,
      relationshipType || 'partnership',
      startDate || new Date().toISOString().split('T')[0]
    ])

    return c.json({
      success: true,
      relationshipId,
      message: 'Partners linked successfully'
    })
  } catch (error) {
    console.error('Link error:', error)
    return c.json({ error: 'Failed to link partners' }, 500)
  }
})

// POST /api/relationships/invite
// Send partner invitation
relationshipsApi.post('/invite', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const { inviterUserId, partnerEmail, relationshipType, message } = await c.req.json()

    if (!inviterUserId || !partnerEmail) {
      return c.json({ error: 'Inviter ID and partner email required' }, 400)
    }

    // Generate invitation token
    const inviteToken = `inv_${Date.now()}_${Math.random().toString(36).substring(7)}`
    const invitationId = `invite_${Date.now()}`

    await db.run(`
      INSERT INTO partner_invitations (id, inviter_user_id, partner_email, invite_token, relationship_type, message, status, created_at, expires_at)
      VALUES ($1, $2, $3, $4, $5, $6, 'pending', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '7 days')
    `, [
      invitationId,
      inviterUserId,
      partnerEmail,
      inviteToken,
      relationshipType || 'partnership',
      message || null
    ])

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
})

// GET /api/relationships/:relationshipId/status
// Get relationship status with stats
relationshipsApi.get('/:relationshipId/status', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const relationshipId = c.req.param('relationshipId')

    const relationship = await db.first<any>(`
      SELECT r.*,
             u1.name as user1_name, u1.email as user1_email,
             u2.name as user2_name, u2.email as user2_email
      FROM relationships r
      LEFT JOIN users u1 ON r.user_1_id = u1.id
      LEFT JOIN users u2 ON r.user_2_id = u2.id
      WHERE r.id = $1
    `, [relationshipId])

    if (!relationship) {
      return c.json({ error: 'Relationship not found' }, 404)
    }

    // Calculate days together
    const startDate = new Date(relationship.start_date)
    const today = new Date()
    const daysTogether = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    // Get recent activity count
    const activityCount = await db.first<{ count: number }>(`
      SELECT COUNT(*) as count FROM activities WHERE relationship_id = $1
    `, [relationshipId])

    // Get goal progress
    const goals = await db.first<{ total: number; completed: number }>(`
      SELECT COUNT(*) as total, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM shared_goals WHERE relationship_id = $1
    `, [relationshipId])

    return c.json({
      id: relationship.id,
      status: relationship.status,
      type: relationship.relationship_type,
      startDate: relationship.start_date,
      daysTogether,
      partners: [
        { id: relationship.user_1_id, name: relationship.user1_name, email: relationship.user1_email },
        { id: relationship.user_2_id, name: relationship.user2_name, email: relationship.user2_email }
      ],
      stats: {
        activitiesCompleted: activityCount?.count || 0,
        goalsTotal: goals?.total || 0,
        goalsCompleted: goals?.completed || 0
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
    const db = createDatabase(c.env as Env)
    const userId = c.req.param('userId')

    const relationship = await db.first<any>(`
      SELECT r.*,
             u1.name as user1_name, u1.email as user1_email,
             u2.name as user2_name, u2.email as user2_email
      FROM relationships r
      LEFT JOIN users u1 ON r.user_1_id = u1.id
      LEFT JOIN users u2 ON r.user_2_id = u2.id
      WHERE (r.user_1_id = $1 OR r.user_2_id = $1) AND r.status = 'active'
    `, [userId])

    if (!relationship) {
      return c.json({ hasPartner: false, relationship: null })
    }

    // Determine partner (the other user)
    const isUser1 = relationship.user_1_id === userId
    const partner = isUser1
      ? { id: relationship.user_2_id, name: relationship.user2_name, email: relationship.user2_email }
      : { id: relationship.user_1_id, name: relationship.user1_name, email: relationship.user1_email }

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
        partner,
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
relationshipsApi.put('/:relationshipId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const relationshipId = c.req.param('relationshipId')
    const { relationshipType, startDate, anniversaryDate } = await c.req.json()

    await db.run(`
      UPDATE relationships SET
        relationship_type = COALESCE($1, relationship_type),
        start_date = COALESCE($2, start_date),
        anniversary_date = COALESCE($3, anniversary_date),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `, [relationshipType, startDate, anniversaryDate, relationshipId])

    return c.json({ success: true, message: 'Relationship updated' })
  } catch (error) {
    console.error('Update error:', error)
    return c.json({ error: 'Failed to update relationship' }, 500)
  }
})

// DELETE /api/relationships/:relationshipId
// End relationship (soft delete)
relationshipsApi.delete('/:relationshipId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const relationshipId = c.req.param('relationshipId')

    await db.run(`
      UPDATE relationships SET status = 'ended', updated_at = CURRENT_TIMESTAMP WHERE id = $1
    `, [relationshipId])

    return c.json({ success: true, message: 'Relationship ended' })
  } catch (error) {
    console.error('Delete error:', error)
    return c.json({ error: 'Failed to end relationship' }, 500)
  }
})

// POST /api/relationships/accept-invite
// Accept partner invitation
relationshipsApi.post('/accept-invite', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const { inviteToken, acceptingUserId } = await c.req.json()

    // Find invitation
    const invitation = await db.first<any>(`
      SELECT * FROM partner_invitations
      WHERE invite_token = $1 AND status = 'pending' AND expires_at > CURRENT_TIMESTAMP
    `, [inviteToken])

    if (!invitation) {
      return c.json({ error: 'Invalid or expired invitation' }, 400)
    }

    // Create relationship
    const relationshipId = `rel_${Date.now()}_${Math.random().toString(36).substring(7)}`

    await db.run(`
      INSERT INTO relationships (id, user_1_id, user_2_id, relationship_type, start_date, status, created_at)
      VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, 'active', CURRENT_TIMESTAMP)
    `, [
      relationshipId,
      invitation.inviter_user_id,
      acceptingUserId,
      invitation.relationship_type
    ])

    // Update invitation status
    await db.run(`
      UPDATE partner_invitations SET status = 'accepted', accepted_at = CURRENT_TIMESTAMP WHERE id = $1
    `, [invitation.id])

    return c.json({
      success: true,
      relationshipId,
      message: 'Invitation accepted! You are now connected.'
    })
  } catch (error) {
    console.error('Accept invite error:', error)
    return c.json({ error: 'Failed to accept invitation' }, 500)
  }
})

export default relationshipsApi
