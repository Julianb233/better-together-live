// Better Together: Activities Validation Schemas
// Matches fields from src/api/activities.ts

import { z } from 'zod'
import { uuidParam, dateString } from './common'

const activityTypeEnum = z.enum([
  'date_night', 'quality_time', 'adventure', 'relaxation',
  'learning', 'exercise', 'social', 'custom',
])

const activityStatusEnum = z.enum(['planned', 'completed', 'cancelled'])

/** POST /api/activities - Create activity */
export const createActivitySchema = z.object({
  relationship_id: uuidParam,
  activity_name: z.string().trim().min(1).max(200),
  activity_type: activityTypeEnum.default('custom'),
  description: z.string().max(1000).optional(),
  location: z.string().max(300).optional(),
  planned_date: dateString.optional(),
  cost_amount: z.number().min(0).optional(),
  created_by_user_id: uuidParam,
})

/** PUT /api/activities/:activityId/complete - Complete activity */
export const completeActivitySchema = z.object({
  satisfaction_rating_user1: z.number().min(1).max(10).optional(),
  satisfaction_rating_user2: z.number().min(1).max(10).optional(),
  notes: z.string().max(1000).optional(),
})

/** GET /api/activities/:relationshipId - query params */
export const activityQuerySchema = z.object({
  status: z.union([activityStatusEnum, z.literal('all')]).default('all'),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})
