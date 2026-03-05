// Better Together: Shared Goals API
// Handles relationship goals creation, tracking, and progress

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase/server'
import { zValidator } from '@hono/zod-validator'
import { zodErrorHandler } from '../lib/validation'
import {
  createGoalSchema,
  updateGoalProgressSchema,
  goalQuerySchema,
} from '../lib/validation/schemas/goals'
import {
  generateId,
  getCurrentDate,
  getCurrentDateTime
} from '../utils'

const goalsApi = new Hono()

// POST /api/goals
// Create shared goal
goalsApi.post('/', zValidator('json', createGoalSchema, zodErrorHandler), async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const {
      relationship_id,
      goal_name,
      goal_description,
      goal_type,
      target_count,
      target_date,
      created_by_user_id
    } = c.req.valid('json' as never)

    const goalId = generateId()
    const now = getCurrentDateTime()

    const { error } = await supabase.from('shared_goals').insert({
      id: goalId,
      relationship_id,
      title: goal_name,
      description: goal_description ?? null,
      goal_type: goal_type || 'custom',
      target_date: target_date ?? null,
      progress_percentage: 0,
      status: 'active',
      created_at: now,
      updated_at: now,
    } as any)

    if (error) throw error

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
goalsApi.get('/:relationshipId', zValidator('query', goalQuerySchema, zodErrorHandler), async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const relationshipId = c.req.param('relationshipId')
    const { status } = c.req.valid('query' as never)

    let query = supabase
      .from('shared_goals')
      .select('*')
      .eq('relationship_id', relationshipId)

    if (status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: results, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    // Map Supabase column names to frontend-expected shape
    const goals = (results || []).map((row: any) => ({
      ...row,
      goal_name: row.title,
      goal_description: row.description,
      current_progress: row.progress_percentage,
    }))

    return c.json({ goals })
  } catch (error) {
    console.error('Get goals error:', error)
    return c.json({ error: 'Failed to get goals' }, 500)
  }
})

// PUT /api/goals/:goalId/progress
// Update goal progress
goalsApi.put('/:goalId/progress', zValidator('json', updateGoalProgressSchema, zodErrorHandler), async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const goalId = c.req.param('goalId')
    const { progress_increment } = c.req.valid('json' as never)

    // Fetch current goal
    const { data: goal, error: fetchError } = await supabase
      .from('shared_goals')
      .select('*')
      .eq('id', goalId)
      .maybeSingle() as { data: any; error: any }

    if (fetchError) throw fetchError
    if (!goal) {
      return c.json({ error: 'Goal not found' }, 404)
    }

    const currentProgress = Number(goal.progress_percentage) || 0
    const increment = Number(progress_increment)
    const newProgress = currentProgress + increment
    const now = getCurrentDateTime()
    let status = goal.status
    let completedAt: string | null = null

    // Check if goal is completed (progress_percentage >= 100)
    if (newProgress >= 100) {
      status = 'completed'
      completedAt = now
    }

    const { error: updateError } = await (supabase
      .from('shared_goals') as any)
      .update({
        progress_percentage: Math.min(newProgress, 100),
        status,
        completed_at: completedAt,
        updated_at: now,
      })
      .eq('id', goalId)

    if (updateError) throw updateError

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
