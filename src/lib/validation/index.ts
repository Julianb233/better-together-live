// Better Together: Validation Infrastructure
// Shared Zod utilities and re-exports for all API route validation

import type { Context } from 'hono'

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
export function zodErrorHandler(result: { success: boolean; error?: any }, c: Context) {
  if (!result.success) {
    const err = result.error
    // Zod v4 uses $ZodError with flatten(), Zod v3 uses ZodError with flatten()
    const details = typeof err?.flatten === 'function'
      ? err.flatten().fieldErrors
      : err?.issues ?? err
    return c.json(
      {
        error: 'Invalid input',
        details,
      },
      400
    )
  }
}
