// Better Together: Security Helpers
// Reusable IDOR (Insecure Direct Object Reference) protection utilities

import type { Context, Next } from 'hono'

/**
 * Middleware: Verify the authenticated user matches the :userId route param.
 * Apply to any route with :userId in the path.
 */
export function requireOwnership() {
  return async (c: Context, next: Next) => {
    const authUserId = c.get('userId')
    const paramUserId = c.req.param('userId')

    if (paramUserId && authUserId !== paramUserId) {
      return c.json({ error: 'Forbidden' }, 403)
    }
    await next()
  }
}

/**
 * Inline helper: Check if authenticated user owns the requested userId.
 * Use inside handlers when middleware isn't practical.
 * Returns true if authorized, false if not.
 */
export function checkOwnership(c: Context, requestedUserId: string): boolean {
  const authUserId = c.get('userId')
  return authUserId === requestedUserId
}

/**
 * Inline helper: Return 403 response for IDOR violations.
 */
export function forbiddenResponse(c: Context) {
  return c.json({ error: 'Forbidden' }, 403)
}

// TODO: Add verifyRelationshipMembership() when database consolidation is
// complete (Phase 3). This helper should query the relationships table to
// confirm the authenticated user is user_1_id or user_2_id of the given
// relationship before allowing access to relationship-scoped data.
