// Better Together: Goals Validation Schemas
// Matches fields from src/api/goals.ts

import { z } from 'zod'
import { uuidParam, dateString } from './common'

const goalTypeEnum = z.enum(['weekly', 'monthly', 'milestone', 'custom'])
const goalStatusEnum = z.enum(['active', 'completed', 'paused', 'cancelled'])

/** POST /api/goals - Create shared goal */
export const createGoalSchema = z.object({
  relationship_id: uuidParam,
  goal_name: z.string().trim().min(1).max(200),
  goal_description: z.string().max(1000).optional(),
  goal_type: goalTypeEnum.default('custom'),
  target_count: z.number().int().positive().optional(),
  target_date: dateString.optional(),
  created_by_user_id: uuidParam,
})

/** PUT /api/goals/:goalId/progress - Update goal progress */
export const updateGoalProgressSchema = z.object({
  progress_increment: z.number().int(),
})

/** GET /api/goals/:relationshipId - query params */
export const goalQuerySchema = z.object({
  status: z.union([goalStatusEnum, z.literal('all')]).default('all'),
})
