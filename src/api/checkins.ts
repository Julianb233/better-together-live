// Better Together: Daily Check-ins API
// Handles daily relationship check-ins and mood tracking

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
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
checkinsApi.post('/', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const {
      relationship_id,
      user_id,
      connection_score,
      mood_score,
      relationship_satisfaction,
      gratitude_note,
      support_needed,
      highlight_of_day
    } = await c.req.json()

    if (!relationship_id || !user_id) {
      return c.json({ error: 'Relationship ID and User ID are required' }, 400)
    }

    // Check if already checked in today
    const hasCheckin = await hasTodayCheckin(c.env, relationship_id, user_id)
    if (hasCheckin) {
      return c.json({ error: 'Already checked in today' }, 409)
    }

    const checkinId = generateId()
    const today = getCurrentDate()
    const now = getCurrentDateTime()

    await db.run(`
      INSERT INTO daily_checkins (
        id, relationship_id, user_id, checkin_date, connection_score, mood_score,
        relationship_satisfaction, gratitude_note, support_needed, highlight_of_day, created_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    `, [
      checkinId, relationship_id, user_id, today, connection_score || null,
      mood_score || null, relationship_satisfaction || null, gratitude_note || null,
      support_needed || null, highlight_of_day || null, now
    ])

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
checkinsApi.get('/:relationshipId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const relationshipId = c.req.param('relationshipId')
    const limit = c.req.query('limit') || '30'

    const results = await db.all(`
      SELECT c.*, u.name as user_name
      FROM daily_checkins c
      JOIN users u ON c.user_id = u.id
      WHERE c.relationship_id = $1
      ORDER BY c.checkin_date DESC, c.created_at DESC
      LIMIT $2
    `, [relationshipId, parseInt(limit)])

    return c.json({ checkins: results || [] })
  } catch (error) {
    console.error('Get checkins error:', error)
    return c.json({ error: 'Failed to get check-ins' }, 500)
  }
})

export default checkinsApi
