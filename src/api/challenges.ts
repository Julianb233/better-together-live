// Better Together: Challenges API
// Handles relationship challenges and participation tracking
// Migrated from Neon raw SQL to Supabase query builder

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { zValidator } from '@hono/zod-validator'
import {
  challengesQuerySchema,
  startChallengeSchema,
  updateProgressSchema,
  createEntrySchema,
} from '../lib/validation/schemas/challenges'
import {
  generateId,
  getCurrentDate,
  getCurrentDateTime
} from '../utils'

const challengesApi = new Hono()

function getSupabaseEnv(c: Context): SupabaseEnv {
  return {
    SUPABASE_URL: c.env?.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: c.env?.SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: c.env?.SUPABASE_SERVICE_ROLE_KEY
  }
}

// GET /api/challenges
// Get available challenges
challengesApi.get('/', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const category = c.req.query('category')
    const difficulty = c.req.query('difficulty')

    let query = supabase
      .from('challenges')
      .select('*')
      .eq('is_template', true)
      .order('created_at', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    if (difficulty) {
      query = query.eq('difficulty_level', difficulty)
    }

    const { data: results, error } = await query

    if (error) throw error

    return c.json({ challenges: results || [] })
  } catch (error) {
    console.error('Get challenges error:', error)
    return c.json({ error: 'Failed to get challenges' }, 500)
  }
})

// POST /api/challenges/:challengeId/start
// Start challenge participation
challengesApi.post(
  '/:challengeId/start',
  zValidator('json', startChallengeSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const challengeId = c.req.param('challengeId')
      const { relationship_id } = c.req.valid('json' as never) as { relationship_id: string }

      // Get challenge details
      const { data: challenge, error: challengeErr } = await supabase
        .from('challenges')
        .select('*')
        .eq('id', challengeId)
        .maybeSingle()

      if (challengeErr) throw challengeErr
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

      const { error: insertErr } = await supabase
        .from('challenge_participation')
        .insert({
          id: participationId,
          relationship_id,
          challenge_id: challengeId,
          start_date: today,
          target_end_date: targetEndDate,
          status: 'active',
          progress_percentage: 0,
          created_at: now,
          updated_at: now,
        })

      if (insertErr) throw insertErr

      return c.json({
        message: 'Challenge started successfully',
        participation_id: participationId
      })
    } catch (error) {
      console.error('Start challenge error:', error)
      return c.json({ error: 'Failed to start challenge' }, 500)
    }
  }
)

// GET /api/challenges/participation/:relationshipId
// Get challenge participation for relationship
challengesApi.get('/participation/:relationshipId', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const relationshipId = c.req.param('relationshipId')
    const status = c.req.query('status') || 'all'

    let query = supabase
      .from('challenge_participation')
      .select(`
        *,
        challenges (
          challenge_name,
          challenge_description,
          category,
          difficulty_level
        )
      `)
      .eq('relationship_id', relationshipId)
      .order('created_at', { ascending: false })

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: results, error } = await query

    if (error) throw error

    // Flatten the nested challenge data to match original response shape
    const participations = (results || []).map((cp: any) => ({
      ...cp,
      challenge_name: cp.challenges?.challenge_name,
      challenge_description: cp.challenges?.challenge_description,
      category: cp.challenges?.category,
      difficulty_level: cp.challenges?.difficulty_level,
      challenges: undefined,
    }))

    return c.json({ participations })
  } catch (error) {
    console.error('Get challenge participation error:', error)
    return c.json({ error: 'Failed to get challenge participation' }, 500)
  }
})

// PUT /api/challenges/participation/:participationId/progress
// Update challenge progress
challengesApi.put(
  '/participation/:participationId/progress',
  zValidator('json', updateProgressSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const participationId = c.req.param('participationId')
      const { progress_percentage, completion_notes, status } = c.req.valid('json' as never) as {
        progress_percentage?: number
        completion_notes?: string
        status?: string
      }

      // Get current participation
      const { data: participation, error: fetchErr } = await supabase
        .from('challenge_participation')
        .select('*')
        .eq('id', participationId)
        .maybeSingle()

      if (fetchErr) throw fetchErr
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

      const { error: updateErr } = await supabase
        .from('challenge_participation')
        .update({
          progress_percentage: progress_percentage ?? participation.progress_percentage,
          completion_notes: completion_notes ?? participation.completion_notes,
          status: newStatus,
          actual_end_date: actualEndDate,
          updated_at: now,
        })
        .eq('id', participationId)

      if (updateErr) throw updateErr

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
  }
)

// POST /api/challenges/participation/:participationId/entry
// Add a challenge entry (daily/weekly log)
challengesApi.post(
  '/participation/:participationId/entry',
  zValidator('json', createEntrySchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const participationId = c.req.param('participationId')
      const { user_id, entry_content, reflection, completion_status } = c.req.valid('json' as never) as {
        user_id: string
        entry_content?: string
        reflection?: string
        completion_status?: boolean
      }

      // Verify participation exists
      const { data: participation, error: fetchErr } = await supabase
        .from('challenge_participation')
        .select('*')
        .eq('id', participationId)
        .maybeSingle()

      if (fetchErr) throw fetchErr
      if (!participation) {
        return c.json({ error: 'Challenge participation not found' }, 404)
      }

      const entryId = generateId()
      const today = getCurrentDate()
      const now = getCurrentDateTime()

      // Check if entry already exists for today
      const { data: existingEntry } = await supabase
        .from('challenge_entries')
        .select('id')
        .eq('participation_id', participationId)
        .eq('user_id', user_id)
        .eq('entry_date', today)
        .maybeSingle()

      if (existingEntry) {
        // Update existing entry
        const { error: updateErr } = await supabase
          .from('challenge_entries')
          .update({
            entry_content: entry_content ?? undefined,
            reflection: reflection ?? undefined,
            completion_status: completion_status ?? undefined,
          })
          .eq('id', existingEntry.id)

        if (updateErr) throw updateErr

        return c.json({
          success: true,
          message: 'Entry updated',
          entryId: existingEntry.id
        })
      }

      // Create new entry
      const { error: insertErr } = await supabase
        .from('challenge_entries')
        .insert({
          id: entryId,
          participation_id: participationId,
          user_id,
          entry_date: today,
          entry_content: entry_content || null,
          reflection: reflection || null,
          completion_status: completion_status || false,
          created_at: now,
        })

      if (insertErr) throw insertErr

      // Calculate and update overall progress
      const { data: challenge } = await supabase
        .from('challenges')
        .select('duration_days')
        .eq('id', participation.challenge_id)
        .maybeSingle()

      if (challenge && challenge.duration_days) {
        const { count } = await supabase
          .from('challenge_entries')
          .select('*', { count: 'exact', head: true })
          .eq('participation_id', participationId)
          .eq('completion_status', true)

        const completedEntries = count || 0
        const newProgress = Math.min(100, Math.round((completedEntries / challenge.duration_days) * 100))

        await supabase
          .from('challenge_participation')
          .update({ progress_percentage: newProgress, updated_at: now })
          .eq('id', participationId)
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
  }
)

// GET /api/challenges/participation/:participationId/entries
// Get all entries for a challenge participation
challengesApi.get('/participation/:participationId/entries', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const participationId = c.req.param('participationId')

    const { data: entries, error } = await supabase
      .from('challenge_entries')
      .select('*')
      .eq('participation_id', participationId)
      .order('entry_date', { ascending: false })

    if (error) throw error

    return c.json({ entries: entries || [] })
  } catch (error) {
    console.error('Get challenge entries error:', error)
    return c.json({ error: 'Failed to get entries' }, 500)
  }
})

export default challengesApi
