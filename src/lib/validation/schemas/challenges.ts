// Better Together: Challenges Validation Schemas
// Matches fields from src/api/challenges.ts

import { z } from 'zod'
import { paginationSchema } from './common'

/** GET /api/challenges - query params */
export const challengesQuerySchema = paginationSchema.extend({
  category: z.string().optional(),
  difficulty: z.string().optional(),
})

/** POST /api/challenges/:challengeId/start - Start challenge */
export const startChallengeSchema = z.object({
  relationship_id: z.string().min(1, 'Relationship ID is required'),
})

/** PUT /api/challenges/participation/:participationId/progress */
export const updateProgressSchema = z.object({
  progress_percentage: z.number().min(0).max(100).optional(),
  completion_notes: z.string().max(2000).optional(),
  status: z.enum(['active', 'completed', 'paused', 'abandoned']).optional(),
})

/** POST /api/challenges/participation/:participationId/entry */
export const createEntrySchema = z.object({
  user_id: z.string().min(1, 'User ID is required'),
  entry_content: z.string().max(5000).optional(),
  reflection: z.string().max(5000).optional(),
  completion_status: z.boolean().optional(),
})
