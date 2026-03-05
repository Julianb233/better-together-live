// Better Together: Check-in Validation Schemas
// Matches fields from src/api/checkins.ts

import { z } from 'zod'
import { uuidParam, scoreField } from './common'

/** POST /api/checkins - Submit daily check-in */
export const createCheckinSchema = z.object({
  relationship_id: uuidParam,
  user_id: uuidParam,
  connection_score: scoreField,
  mood_score: scoreField,
  relationship_satisfaction: scoreField,
  gratitude_note: z.string().max(500).optional(),
  support_needed: z.string().max(500).optional(),
  highlight_of_day: z.string().max(500).optional(),
})

/** GET /api/checkins/:relationshipId - query params */
export const checkinQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
})
