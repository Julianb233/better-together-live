// Better Together: Activities & Date Nights API
// Handles activity planning, tracking, and completion

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase/server'
import { zValidator } from '@hono/zod-validator'
import { zodErrorHandler } from '../lib/validation'
import {
  createActivitySchema,
  completeActivitySchema,
  activityQuerySchema,
} from '../lib/validation/schemas/activities'
import {
  generateId,
  getCurrentDateTime
} from '../utils'

const activitiesApi = new Hono()

// POST /api/activities
// Create activity
activitiesApi.post('/', zValidator('json', createActivitySchema, zodErrorHandler), async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const {
      relationship_id,
      activity_name,
      activity_type,
      description,
      location,
      planned_date,
      cost_amount,
      created_by_user_id
    } = c.req.valid('json' as never)

    const activityId = generateId()
    const now = getCurrentDateTime()

    const { error } = await supabase.from('activities').insert({
      id: activityId,
      relationship_id,
      title: activity_name,
      activity_type: activity_type || 'custom',
      description: description ?? null,
      location: location ?? null,
      date: planned_date ?? null,
      cost: cost_amount ?? null,
      created_at: now,
      updated_at: now,
    } as any)

    if (error) throw error

    return c.json({
      message: 'Activity created successfully',
      activity_id: activityId
    })
  } catch (error) {
    console.error('Create activity error:', error)
    return c.json({ error: 'Failed to create activity' }, 500)
  }
})

// GET /api/activities/:relationshipId
// Get activities for relationship
activitiesApi.get('/:relationshipId', zValidator('query', activityQuerySchema, zodErrorHandler), async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const relationshipId = c.req.param('relationshipId')
    const { status, limit } = c.req.valid('query' as never)

    let query = supabase
      .from('activities')
      .select('*')
      .eq('relationship_id', relationshipId)

    if (status !== 'all') {
      query = query.eq('activity_type', status)
    }

    const { data: results, error } = await query
      .order('date', { ascending: false, nullsFirst: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) throw error

    // Map Supabase column names to frontend-expected shape
    const activities = (results || []).map((row: any) => ({
      ...row,
      activity_name: row.title,
      planned_date: row.date,
      cost_amount: row.cost,
    }))

    return c.json({ activities })
  } catch (error) {
    console.error('Get activities error:', error)
    return c.json({ error: 'Failed to get activities' }, 500)
  }
})

// PUT /api/activities/:activityId/complete
// Mark activity as completed
activitiesApi.put('/:activityId/complete', zValidator('json', completeActivitySchema, zodErrorHandler), async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const activityId = c.req.param('activityId')
    const { satisfaction_rating_user1, satisfaction_rating_user2, notes } = c.req.valid('json' as never)

    const now = getCurrentDateTime()

    const { error } = await (supabase
      .from('activities') as any)
      .update({
        satisfaction_rating: satisfaction_rating_user1 ?? null,
        notes: notes ?? null,
        updated_at: now,
      })
      .eq('id', activityId)

    if (error) throw error

    return c.json({ message: 'Activity marked as completed' })
  } catch (error) {
    console.error('Complete activity error:', error)
    return c.json({ error: 'Failed to complete activity' }, 500)
  }
})

export default activitiesApi
