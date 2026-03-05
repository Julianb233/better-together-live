// Better Together: Important Dates API
// Handles anniversaries, birthdays, and special dates tracking

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase/server'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { zodErrorHandler } from '../lib/validation'
import { uuidParam, dateString } from '../lib/validation/schemas/common'
import {
  generateId,
  getCurrentDate,
  getCurrentDateTime
} from '../utils'

/** POST /api/important-dates - Add important date */
const createDateSchema = z.object({
  relationship_id: uuidParam,
  date_value: dateString,
  event_name: z.string().trim().min(1).max(200),
  event_type: z.enum(['anniversary', 'birthday', 'milestone', 'custom']).default('custom'),
  description: z.string().max(500).optional(),
  is_recurring: z.boolean().default(false),
  recurrence_pattern: z.string().max(100).optional().nullable(),
  reminder_days_before: z.number().int().min(0).max(365).default(7),
  created_by_user_id: uuidParam,
})

/** GET /api/important-dates/:relationshipId - query params */
const datesQuerySchema = z.object({
  upcoming: z.enum(['true', 'false']).optional(),
})

const datesApi = new Hono()

// POST /api/important-dates
// Add important date
datesApi.post('/', zValidator('json', createDateSchema, zodErrorHandler), async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const {
      relationship_id,
      date_value,
      event_name,
      event_type,
      description,
      is_recurring,
      recurrence_pattern,
      reminder_days_before,
      created_by_user_id
    } = c.req.valid('json' as never)

    const dateId = generateId()
    const now = getCurrentDateTime()

    const { error } = await supabase.from('important_dates').insert({
      id: dateId,
      relationship_id,
      date: date_value,
      name: event_name,
      recurrence: is_recurring ? (recurrence_pattern || 'yearly') : 'none',
      reminder_days_before: reminder_days_before,
      created_at: now,
    } as any)

    if (error) throw error

    return c.json({
      message: 'Important date added successfully',
      date_id: dateId
    })
  } catch (error) {
    console.error('Add important date error:', error)
    return c.json({ error: 'Failed to add important date' }, 500)
  }
})

// GET /api/important-dates/:relationshipId
// Get important dates for relationship
datesApi.get('/:relationshipId', zValidator('query', datesQuerySchema, zodErrorHandler), async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const relationshipId = c.req.param('relationshipId')
    const { upcoming } = c.req.valid('query' as never)

    let query = supabase
      .from('important_dates')
      .select('*')
      .eq('relationship_id', relationshipId)

    if (upcoming === 'true') {
      const today = getCurrentDate()
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 60)
      const future = futureDate.toISOString().split('T')[0]

      query = query.gte('date', today).lte('date', future)
    }

    const { data: results, error } = await query.order('date', { ascending: true })

    if (error) throw error

    // Map Supabase column names back to the response shape the frontend expects
    const dates = (results || []).map((row: any) => ({
      ...row,
      date_value: row.date,
      event_name: row.name,
    }))

    return c.json({ dates })
  } catch (error) {
    console.error('Get important dates error:', error)
    return c.json({ error: 'Failed to get important dates' }, 500)
  }
})

export default datesApi
