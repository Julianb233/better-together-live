import { Hono } from 'hono'
import type { Env } from '../types'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase/server'
import { checkOwnership, forbiddenResponse } from '../lib/security'
import {
  generateId,
  getCurrentDate,
  getCurrentDateTime,
  isValidEmail,
  getUserByEmail,
  getUserById,
  getRelationshipByUserId,
  getPartnerId,
  sendNotification,
} from '../utils'

const inlineApi = new Hono<{ Bindings: Env }>()

// Database availability check helper
const checkDatabase = (c: any) => {
  if (!c.env?.SUPABASE_URL) {
    return c.json({
      message: 'Database functionality is currently unavailable in this demo deployment.',
      demo: true,
      note: 'Full functionality available with SUPABASE_URL configured'
    }, 503)
  }
  return null
}

// Create new user account
inlineApi.post('/api/users', async (c) => {
  const dbCheck = checkDatabase(c)
  if (dbCheck) return dbCheck

  try {
    const supabase = createAdminClient(c.env as unknown as SupabaseEnv)
    const { email, name, nickname, phone_number, timezone, love_language_primary, love_language_secondary } = await c.req.json()

    if (!email || !name) {
      return c.json({ error: 'Email and name are required' }, 400)
    }

    if (!isValidEmail(email)) {
      return c.json({ error: 'Invalid email format' }, 400)
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(c.env, email)
    if (existingUser) {
      return c.json({ error: 'User already exists with this email' }, 409)
    }

    const userId = generateId()
    const now = getCurrentDateTime()

    const { error: insertError } = await supabase.from('users').insert({
      id: userId,
      email,
      name,
      nickname: nickname || null,
      phone_number: phone_number || null,
      timezone: timezone || 'UTC',
      love_language_primary: love_language_primary || null,
      love_language_secondary: love_language_secondary || null,
      created_at: now,
      updated_at: now,
      last_active_at: now,
    } as any)

    if (insertError) throw insertError

    const user = await getUserById(c.env, userId)
    return c.json({ user }, 201)
  } catch (error) {
    c.var.logger.error({ err: error }, 'Create user error')
    return c.json({ error: 'Failed to create user' }, 500)
  }
})

// Get user profile
inlineApi.get('/api/users/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')

    if (!checkOwnership(c, userId)) {
      return forbiddenResponse(c)
    }

    const user = await getUserById(c.env, userId)

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({ user })
  } catch (error) {
    c.var.logger.error({ err: error }, 'Get user error')
    return c.json({ error: 'Failed to get user' }, 500)
  }
})

// Update user profile
inlineApi.put('/api/users/:userId', async (c) => {
  try {
    const supabase = createAdminClient(c.env as unknown as SupabaseEnv)
    const userId = c.req.param('userId')

    if (!checkOwnership(c, userId)) {
      return forbiddenResponse(c)
    }

    const updates = await c.req.json()

    const user = await getUserById(c.env, userId)
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    const now = getCurrentDateTime()
    const allowedFields = ['name', 'nickname', 'phone_number', 'timezone', 'love_language_primary', 'love_language_secondary', 'profile_photo_url']

    const filteredUpdates: Record<string, any> = {}
    for (const key of Object.keys(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = updates[key]
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return c.json({ error: 'No valid fields to update' }, 400)
    }

    filteredUpdates.updated_at = now

    const { error: updateError } = await supabase
      .from('users')
      .update(filteredUpdates as any)
      .eq('id', userId)

    if (updateError) throw updateError

    const updatedUser = await getUserById(c.env, userId)
    return c.json({ user: updatedUser })
  } catch (error) {
    c.var.logger.error({ err: error }, 'Update user error')
    return c.json({ error: 'Failed to update user' }, 500)
  }
})

// Invite partner to join relationship
inlineApi.post('/api/invite-partner', async (c) => {
  try {
    const supabase = createAdminClient(c.env as unknown as SupabaseEnv)
    const { user_id, partner_email, relationship_type, start_date } = await c.req.json()

    if (!user_id || !partner_email) {
      return c.json({ error: 'User ID and partner email are required' }, 400)
    }

    if (!isValidEmail(partner_email)) {
      return c.json({ error: 'Invalid partner email format' }, 400)
    }

    // Check if user exists
    const user = await getUserById(c.env, user_id)
    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    // Check if user already has an active relationship
    const existingRelationship = await getRelationshipByUserId(c.env, user_id)
    if (existingRelationship) {
      return c.json({ error: 'User already has an active relationship' }, 409)
    }

    // Check if partner exists, if not create invitation
    let partner = await getUserByEmail(c.env, partner_email)

    if (partner) {
      // Partner exists, create relationship immediately
      const relationshipId = generateId()
      const now = getCurrentDateTime()

      const { error: relError } = await supabase.from('relationships').insert({
        id: relationshipId,
        user_1_id: user_id,
        user_2_id: partner.id,
        relationship_type: relationship_type || 'dating',
        start_date: start_date || getCurrentDate(),
        status: 'active',
        created_at: now,
        updated_at: now,
      } as any)

      if (relError) throw relError

      // Send notification to partner
      await sendNotification(
        c.env,
        partner.id,
        'partner_activity',
        'New Relationship Created!',
        `${user.name} has added you as their partner on Better Together`,
        relationshipId
      )

      return c.json({
        message: 'Relationship created successfully',
        relationship_id: relationshipId
      })
    } else {
      // Partner doesn't exist, create invitation (in real app, send email)
      // For demo, we'll just return success message
      return c.json({
        message: 'Invitation sent! Partner will need to create an account first.',
        action: 'invitation_sent'
      })
    }
  } catch (error) {
    c.var.logger.error({ err: error }, 'Invite partner error')
    return c.json({ error: 'Failed to invite partner' }, 500)
  }
})

// Get relationship details
inlineApi.get('/api/relationships/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')

    if (!checkOwnership(c, userId)) {
      return forbiddenResponse(c)
    }

    const relationship = await getRelationshipByUserId(c.env, userId)

    if (!relationship) {
      return c.json({ error: 'No active relationship found' }, 404)
    }

    // Get partner details
    const partnerId = getPartnerId(relationship, userId)
    const partner = await getUserById(c.env, partnerId)

    return c.json({
      relationship,
      partner
    })
  } catch (error) {
    c.var.logger.error({ err: error }, 'Get relationship error')
    return c.json({ error: 'Failed to get relationship' }, 500)
  }
})

export default inlineApi
