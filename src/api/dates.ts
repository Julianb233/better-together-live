// Better Together: Important Dates API
// Handles anniversaries, birthdays, and special dates tracking

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import {
  generateId,
  getCurrentDate,
  getCurrentDateTime
} from '../utils'

const datesApi = new Hono()

// POST /api/important-dates
// Add important date
datesApi.post('/', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
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
    } = await c.req.json()

    if (!relationship_id || !date_value || !event_name || !created_by_user_id) {
      return c.json({ error: 'Relationship ID, date, event name, and creator ID are required' }, 400)
    }

    const dateId = generateId()
    const now = getCurrentDateTime()

    await db.run(`
      INSERT INTO important_dates (
        id, relationship_id, date_value, event_name, event_type, description,
        is_recurring, recurrence_pattern, reminder_days_before, created_by_user_id, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      dateId, relationship_id, date_value, event_name, event_type || 'custom',
      description || null, is_recurring || false, recurrence_pattern || null,
      reminder_days_before || 7, created_by_user_id, now
    ])

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
datesApi.get('/:relationshipId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const relationshipId = c.req.param('relationshipId')
    const upcoming = c.req.query('upcoming') === 'true'

    let query = `
      SELECT d.*, u.name as created_by_name
      FROM important_dates d
      JOIN users u ON d.created_by_user_id = u.id
      WHERE d.relationship_id = $1
    `

    const params: any[] = [relationshipId]

    if (upcoming) {
      const today = getCurrentDate()
      const futureDate = new Date()
      futureDate.setDate(futureDate.getDate() + 60)
      const future = futureDate.toISOString().split('T')[0]

      query += ' AND d.date_value BETWEEN $2 AND $3'
      params.push(today, future)
    }

    query += ' ORDER BY d.date_value ASC'

    const results = await db.all(query, params)

    return c.json({ dates: results || [] })
  } catch (error) {
    console.error('Get important dates error:', error)
    return c.json({ error: 'Failed to get important dates' }, 500)
  }
})

export default datesApi
