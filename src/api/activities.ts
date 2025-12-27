// Better Together: Activities & Date Nights API
// Handles activity planning, tracking, and completion

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import {
  generateId,
  getCurrentDateTime
} from '../utils'

const activitiesApi = new Hono()

// POST /api/activities
// Create activity
activitiesApi.post('/', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const {
      relationship_id,
      activity_name,
      activity_type,
      description,
      location,
      planned_date,
      cost_amount,
      created_by_user_id
    } = await c.req.json()

    if (!relationship_id || !activity_name || !created_by_user_id) {
      return c.json({ error: 'Relationship ID, activity name, and creator ID are required' }, 400)
    }

    const activityId = generateId()
    const now = getCurrentDateTime()

    await db.run(`
      INSERT INTO activities (
        id, relationship_id, activity_name, activity_type, description,
        location, planned_date, cost_amount, status, created_by_user_id,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'planned', $9, $10, $11)
    `, [
      activityId, relationship_id, activity_name, activity_type || 'custom',
      description || null, location || null, planned_date || null,
      cost_amount || null, created_by_user_id, now, now
    ])

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
activitiesApi.get('/:relationshipId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const relationshipId = c.req.param('relationshipId')
    const status = c.req.query('status') || 'all'
    const limit = c.req.query('limit') || '50'

    let query = `
      SELECT a.*, u.name as created_by_name
      FROM activities a
      JOIN users u ON a.created_by_user_id = u.id
      WHERE a.relationship_id = $1
    `

    const params: any[] = [relationshipId]

    if (status !== 'all') {
      query += ' AND a.status = $2'
      params.push(status)
    }

    query += ` ORDER BY a.planned_date DESC, a.created_at DESC LIMIT $${params.length + 1}`
    params.push(parseInt(limit))

    const results = await db.all(query, params)

    return c.json({ activities: results || [] })
  } catch (error) {
    console.error('Get activities error:', error)
    return c.json({ error: 'Failed to get activities' }, 500)
  }
})

// PUT /api/activities/:activityId/complete
// Mark activity as completed
activitiesApi.put('/:activityId/complete', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const activityId = c.req.param('activityId')
    const { satisfaction_rating_user1, satisfaction_rating_user2, notes } = await c.req.json()

    const now = getCurrentDateTime()

    await db.run(`
      UPDATE activities
      SET status = 'completed', completed_date = $1, satisfaction_rating_user1 = $2,
          satisfaction_rating_user2 = $3, notes = $4, updated_at = $5
      WHERE id = $6
    `, [
      now, satisfaction_rating_user1 || null, satisfaction_rating_user2 || null,
      notes || null, now, activityId
    ])

    return c.json({ message: 'Activity marked as completed' })
  } catch (error) {
    console.error('Complete activity error:', error)
    return c.json({ error: 'Failed to complete activity' }, 500)
  }
})

export default activitiesApi
