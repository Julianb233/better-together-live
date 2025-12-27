// Better Together: Challenges API
// Handles relationship challenges and participation tracking

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import {
  generateId,
  getCurrentDate,
  getCurrentDateTime
} from '../utils'

const challengesApi = new Hono()

// GET /api/challenges
// Get available challenges
challengesApi.get('/', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const category = c.req.query('category')
    const difficulty = c.req.query('difficulty')

    let query = 'SELECT * FROM challenges WHERE is_template = true'
    const params: any[] = []

    if (category) {
      query += ` AND category = $${params.length + 1}`
      params.push(category)
    }

    if (difficulty) {
      query += ` AND difficulty_level = $${params.length + 1}`
      params.push(difficulty)
    }

    query += ' ORDER BY created_at DESC'

    const results = await db.all(query, params)

    return c.json({ challenges: results || [] })
  } catch (error) {
    console.error('Get challenges error:', error)
    return c.json({ error: 'Failed to get challenges' }, 500)
  }
})

// POST /api/challenges/:challengeId/start
// Start challenge participation
challengesApi.post('/:challengeId/start', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const challengeId = c.req.param('challengeId')
    const { relationship_id } = await c.req.json()

    if (!relationship_id) {
      return c.json({ error: 'Relationship ID is required' }, 400)
    }

    // Get challenge details
    const challenge = await db.first<any>(
      'SELECT * FROM challenges WHERE id = $1',
      [challengeId]
    )

    if (!challenge) {
      return c.json({ error: 'Challenge not found' }, 404)
    }

    const participationId = generateId()
    const today = getCurrentDate()
    const now = getCurrentDateTime()

    // Calculate target end date
    let targetEndDate = null
    if (challenge.duration_days) {
      const endDate = new Date()
      endDate.setDate(endDate.getDate() + challenge.duration_days)
      targetEndDate = endDate.toISOString().split('T')[0]
    }

    await db.run(`
      INSERT INTO challenge_participation (
        id, relationship_id, challenge_id, start_date, target_end_date,
        status, progress_percentage, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, 'active', 0, $6, $7)
    `, [participationId, relationship_id, challengeId, today, targetEndDate, now, now])

    return c.json({
      message: 'Challenge started successfully',
      participation_id: participationId
    })
  } catch (error) {
    console.error('Start challenge error:', error)
    return c.json({ error: 'Failed to start challenge' }, 500)
  }
})

// GET /api/challenges/participation/:relationshipId
// Get challenge participation for relationship
challengesApi.get('/participation/:relationshipId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const relationshipId = c.req.param('relationshipId')
    const status = c.req.query('status') || 'all'

    let query = `
      SELECT cp.*, c.challenge_name, c.challenge_description, c.category, c.difficulty_level
      FROM challenge_participation cp
      JOIN challenges c ON cp.challenge_id = c.id
      WHERE cp.relationship_id = $1
    `

    const params: any[] = [relationshipId]

    if (status !== 'all') {
      query += ' AND cp.status = $2'
      params.push(status)
    }

    query += ' ORDER BY cp.created_at DESC'

    const results = await db.all(query, params)

    return c.json({ participations: results || [] })
  } catch (error) {
    console.error('Get challenge participation error:', error)
    return c.json({ error: 'Failed to get challenge participation' }, 500)
  }
})

// PUT /api/challenges/participation/:participationId/progress
// Update challenge progress
challengesApi.put('/participation/:participationId/progress', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const participationId = c.req.param('participationId')
    const { progress_percentage, completion_notes, status } = await c.req.json()

    // Validate progress percentage
    if (progress_percentage !== undefined && (progress_percentage < 0 || progress_percentage > 100)) {
      return c.json({ error: 'Progress percentage must be between 0 and 100' }, 400)
    }

    // Get current participation
    const participation = await db.first<any>(
      'SELECT * FROM challenge_participation WHERE id = $1',
      [participationId]
    )

    if (!participation) {
      return c.json({ error: 'Challenge participation not found' }, 404)
    }

    const now = getCurrentDateTime()
    const today = getCurrentDate()

    // Determine new status
    let newStatus = status || participation.status
    let actualEndDate = participation.actual_end_date

    // Auto-complete if progress reaches 100%
    if (progress_percentage === 100 && newStatus !== 'completed') {
      newStatus = 'completed'
      actualEndDate = today
    }

    await db.run(`
      UPDATE challenge_participation
      SET progress_percentage = COALESCE($1, progress_percentage),
          completion_notes = COALESCE($2, completion_notes),
          status = $3,
          actual_end_date = $4,
          updated_at = $5
      WHERE id = $6
    `, [
      progress_percentage,
      completion_notes,
      newStatus,
      actualEndDate,
      now,
      participationId
    ])

    return c.json({
      success: true,
      message: newStatus === 'completed' ? 'Challenge completed!' : 'Progress updated',
      participation: {
        id: participationId,
        progress_percentage: progress_percentage ?? participation.progress_percentage,
        status: newStatus,
        actual_end_date: actualEndDate
      }
    })
  } catch (error) {
    console.error('Update challenge progress error:', error)
    return c.json({ error: 'Failed to update progress' }, 500)
  }
})

// POST /api/challenges/participation/:participationId/entry
// Add a challenge entry (daily/weekly log)
challengesApi.post('/participation/:participationId/entry', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const participationId = c.req.param('participationId')
    const { user_id, entry_content, reflection, completion_status } = await c.req.json()

    if (!user_id) {
      return c.json({ error: 'User ID is required' }, 400)
    }

    // Verify participation exists
    const participation = await db.first<any>(
      'SELECT * FROM challenge_participation WHERE id = $1',
      [participationId]
    )

    if (!participation) {
      return c.json({ error: 'Challenge participation not found' }, 404)
    }

    const entryId = generateId()
    const today = getCurrentDate()
    const now = getCurrentDateTime()

    // Check if entry already exists for today
    const existingEntry = await db.first<any>(
      'SELECT id FROM challenge_entries WHERE participation_id = $1 AND user_id = $2 AND entry_date = $3',
      [participationId, user_id, today]
    )

    if (existingEntry) {
      // Update existing entry
      await db.run(`
        UPDATE challenge_entries
        SET entry_content = COALESCE($1, entry_content),
            reflection = COALESCE($2, reflection),
            completion_status = COALESCE($3, completion_status)
        WHERE id = $4
      `, [entry_content, reflection, completion_status, existingEntry.id])

      return c.json({
        success: true,
        message: 'Entry updated',
        entryId: existingEntry.id
      })
    }

    // Create new entry
    await db.run(`
      INSERT INTO challenge_entries (id, participation_id, user_id, entry_date, entry_content, reflection, completion_status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [entryId, participationId, user_id, today, entry_content, reflection, completion_status || false, now])

    // Calculate and update overall progress
    const challenge = await db.first<any>(
      'SELECT duration_days FROM challenges WHERE id = $1',
      [participation.challenge_id]
    )

    if (challenge && challenge.duration_days) {
      const entriesResult = await db.first<{ count: number }>(
        'SELECT COUNT(*) as count FROM challenge_entries WHERE participation_id = $1 AND completion_status = true',
        [participationId]
      )
      const completedEntries = entriesResult?.count || 0
      const newProgress = Math.min(100, Math.round((completedEntries / challenge.duration_days) * 100))

      await db.run(
        'UPDATE challenge_participation SET progress_percentage = $1, updated_at = $2 WHERE id = $3',
        [newProgress, now, participationId]
      )
    }

    return c.json({
      success: true,
      message: 'Entry created',
      entryId
    })
  } catch (error) {
    console.error('Create challenge entry error:', error)
    return c.json({ error: 'Failed to create entry' }, 500)
  }
})

// GET /api/challenges/participation/:participationId/entries
// Get all entries for a challenge participation
challengesApi.get('/participation/:participationId/entries', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const participationId = c.req.param('participationId')

    const entries = await db.all(
      `SELECT * FROM challenge_entries
       WHERE participation_id = $1
       ORDER BY entry_date DESC`,
      [participationId]
    )

    return c.json({ entries: entries || [] })
  } catch (error) {
    console.error('Get challenge entries error:', error)
    return c.json({ error: 'Failed to get entries' }, 500)
  }
})

export default challengesApi
