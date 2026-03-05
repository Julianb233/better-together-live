import type { Context } from 'hono'

const MAX_PAGE_SIZE = 100
const DEFAULT_PAGE_SIZE = 20

/**
 * Parse pagination params from query string with enforced maximum.
 * Usage: const { limit, offset } = getPaginationParams(c)
 */
export function getPaginationParams(c: Context): { limit: number; offset: number } {
  const limit = Math.min(
    Math.max(parseInt(c.req.query('limit') || String(DEFAULT_PAGE_SIZE), 10) || DEFAULT_PAGE_SIZE, 1),
    MAX_PAGE_SIZE
  )
  const offset = Math.max(parseInt(c.req.query('offset') || '0', 10) || 0, 0)
  return { limit, offset }
}
