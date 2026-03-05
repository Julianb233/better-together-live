// Better Together: Validation Infrastructure
// Shared Zod utilities and re-exports for all API route validation

import type { Context } from 'hono'
import type { ZodError } from 'zod'

export { z } from 'zod'
export { zValidator } from '@hono/zod-validator'

// Re-export common schemas
export { uuidParam, paginationSchema, dateString, optionalString, scoreField } from './schemas/common'

/**
 * Standard error handler for @hono/zod-validator.
 * Returns a consistent 400 JSON response with field-level error details.
 *
 * Usage with zValidator:
 *   zValidator('json', schema, zodErrorHandler)
 */
export function zodErrorHandler(result: { success: boolean; error?: ZodError }, c: Context) {
  if (!result.success) {
    return c.json(
      {
        error: 'Invalid input',
        details: result.error!.flatten().fieldErrors,
      },
      400
    )
  }
}
