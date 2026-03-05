// Better Together: Common Validation Schemas
// Reusable atomic schemas shared across all domain validators

import { z } from 'zod'

/** UUID string validator */
export const uuidParam = z.string().uuid()

/** Pagination query parameters (page + limit with coercion from query strings) */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

/** Date string in YYYY-MM-DD format */
export const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Must be YYYY-MM-DD format')

/** Optional string with max length */
export const optionalString = (maxLen: number) => z.string().max(maxLen).optional()

/** Score field (1-10, optional) */
export const scoreField = z.number().min(1).max(10).optional()

/** Non-empty trimmed string */
export const nonEmptyString = (maxLen: number) =>
  z.string().trim().min(1, 'Cannot be empty').max(maxLen)

/** Optional URL string */
export const optionalUrl = z.string().url().optional().nullable()
