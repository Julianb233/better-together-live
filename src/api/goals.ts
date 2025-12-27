// Better Together: Shared Goals API
// Handles relationship goals creation, tracking, and progress

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import {
  generateId,
  getCurrentDate,
  getCurrentDateTime
} from '../utils'

const goalsApi = new Hono()

// POST /api/goals
// Create shared goal
goalsApi.post('/', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const {
      relationship_id,
      goal_name,
      goal_description,
      goal_type,
      target_count,
      target_date,
      created_by_user_id
    } = await c.req.json()

    if (!relationship_id || !goal_name || !created_by_user_id) {
      return c.json({ error: 'Relationship ID, goal name, and creator ID are required' }, 400)
    }

    const goalId = generateId()
    const now = getCurrentDateTime()
    const today = getCurrentDate()

    await db.run(`
      INSERT INTO shared_goals (
        id, relationship_id, goal_name, goal_description, goal_type,
        target_count, current_progress, status, start_date, target_date,
        created_by_user_id, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, 0, 'active', $7, $8, $9, $10, $11)
    `, [
      goalId, relationship_id, goal_name, goal_description || null,
      goal_type || 'custom', target_count || null, today,
      target_date || null, created_by_user_id, now, now
    ])

    return c.json({
      message: 'Goal created successfully',
      goal_id: goalId
    })
  } catch (error) {
    console.error('Create goal error:', error)
    return c.json({ error: 'Failed to create goal' }, 500)
  }
})

// GET /api/goals/:relationshipId
// Get shared goals for relationship
goalsApi.get('/:relationshipId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const relationshipId = c.req.param('relationshipId')
    const status = c.req.query('status') || 'all'

    let query = `
      SELECT g.*, u.name as created_by_name
      FROM shared_goals g
      JOIN users u ON g.created_by_user_id = u.id
      WHERE g.relationship_id = $1
    `

    const params: any[] = [relationshipId]

    if (status !== 'all') {
      query += ' AND g.status = $2'
      params.push(status)
    }

    query += ' ORDER BY g.created_at DESC'

    const results = await db.all(query, params)

    return c.json({ goals: results || [] })
  } catch (error) {
    console.error('Get goals error:', error)
    return c.json({ error: 'Failed to get goals' }, 500)
  }
})

// PUT /api/goals/:goalId/progress
// Update goal progress
goalsApi.put('/:goalId/progress', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const goalId = c.req.param('goalId')
    const { progress_increment } = await c.req.json()

    if (progress_increment === undefined) {
      return c.json({ error: 'Progress increment is required' }, 400)
    }

    const goal = await db.first<any>(
      'SELECT * FROM shared_goals WHERE id = $1',
      [goalId]
    )

    if (!goal) {
      return c.json({ error: 'Goal not found' }, 404)
    }

    const newProgress = (goal.current_progress || 0) + progress_increment
    const now = getCurrentDateTime()
    let status = goal.status
    let completionDate = null

    // Check if goal is completed
    if (goal.target_count && newProgress >= goal.target_count) {
      status = 'completed'
      completionDate = now
    }

    await db.run(`
      UPDATE shared_goals
      SET current_progress = $1, status = $2, completion_date = $3, updated_at = $4
      WHERE id = $5
    `, [newProgress, status, completionDate, now, goalId])

    return c.json({
      message: 'Goal progress updated',
      new_progress: newProgress,
      status,
      completed: status === 'completed'
    })
  } catch (error) {
    console.error('Update goal progress error:', error)
    return c.json({ error: 'Failed to update goal progress' }, 500)
  }
})

export default goalsApi
