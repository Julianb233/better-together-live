// Better Together: Daily Check-ins API
// Handles daily relationship check-ins and mood tracking

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase/server'
import { zValidator } from '@hono/zod-validator'
import { zodErrorHandler } from '../lib/validation'
import { createCheckinSchema, checkinQuerySchema } from '../lib/validation/schemas/checkins'
import {
  generateId,
  getCurrentDate,
  getCurrentDateTime,
  hasTodayCheckin,
  checkAchievements
} from '../utils'

const checkinsApi = new Hono()

// POST /api/checkins
// Submit daily check-in
checkinsApi.post('/', zValidator('json', createCheckinSchema, zodErrorHandler), async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const {
      relationship_id,
      user_id,
      connection_score,
      mood_score,
      relationship_satisfaction,
      gratitude_note,
      support_needed,
      highlight_of_day
    } = c.req.valid('json' as never)

    // Check if already checked in today
    const hasCheckin = await hasTodayCheckin(c.env, relationship_id, user_id)
    if (hasCheckin) {
      return c.json({ error: 'Already checked in today' }, 409)
    }

    const checkinId = generateId()
    const today = getCurrentDate()
    const now = getCurrentDateTime()

    const { error } = await supabase.from('daily_checkins').insert({
      id: checkinId,
      relationship_id,
      user_id,
      checkin_date: today,
      connection_score: connection_score ?? null,
      mood: mood_score != null ? String(mood_score) : null,
      satisfaction: relationship_satisfaction ?? null,
      gratitude: gratitude_note ?? null,
      notes: highlight_of_day ?? null,
      created_at: now,
    } as any)

    if (error) throw error

    // Check for achievements
    const newAchievements = await checkAchievements(c.env, relationship_id, user_id)

    return c.json({
      message: 'Check-in completed successfully',
      checkin_id: checkinId,
      achievements_earned: newAchievements
    })
  } catch (error) {
    console.error('Create checkin error:', error)
    return c.json({ error: 'Failed to create check-in' }, 500)
  }
})

// GET /api/checkins/:relationshipId
// Get recent check-ins for relationship
checkinsApi.get('/:relationshipId', zValidator('query', checkinQuerySchema, zodErrorHandler), async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const relationshipId = c.req.param('relationshipId')
    const { limit } = c.req.valid('query' as never)

    // Join with users table to get user_name
    const { data: checkins, error } = await supabase
      .from('daily_checkins')
      .select('*, users!daily_checkins_user_id_fkey(name)')
      .eq('relationship_id', relationshipId)
      .order('checkin_date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Map to expected response shape (flatten user_name from join)
    const results = (checkins || []).map((row: any) => ({
      ...row,
      user_name: row.users?.name ?? null,
      users: undefined,
    }))

    return c.json({ checkins: results })
  } catch (error) {
    console.error('Get checkins error:', error)
    return c.json({ error: 'Failed to get check-ins' }, 500)
  }
})

export default checkinsApi
