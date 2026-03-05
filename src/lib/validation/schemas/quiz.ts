// Better Together: Quiz Validation Schemas
// Matches fields from src/api/quiz.ts

import { z } from 'zod'

/** POST /api/quiz/responses - Single response */
export const quizResponseSchema = z.object({
  userId: z.string().trim().min(1, 'User ID is required'),
  questionId: z.string().trim().min(1, 'Question ID is required'),
  answerId: z.string().trim().min(1, 'Answer ID is required'),
  answerValue: z.number().optional(),
})

/** Single response item within a bulk submission */
const bulkResponseItem = z.object({
  questionId: z.string().trim().min(1),
  answerId: z.string().trim().min(1),
  answerValue: z.number().optional(),
})

/** POST /api/quiz/responses/bulk - Bulk responses */
export const quizBulkResponseSchema = z.object({
  userId: z.string().trim().min(1, 'User ID is required'),
  responses: z.array(bulkResponseItem).min(1, 'At least one response is required').max(100),
})
