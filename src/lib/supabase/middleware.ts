/**
 * Supabase Auth Middleware for Hono
 *
 * Provides authentication middleware for API routes.
 */

import type { Context, Next } from 'hono'
import { createClientWithContext, type SupabaseEnv } from './server'

/**
 * Middleware that requires authentication
 * Sets userId and userEmail in context if authenticated
 */
export function requireAuth(env: SupabaseEnv) {
  return async (c: Context, next: Next) => {
    try {
      const supabase = createClientWithContext(c, env)
      const { data: { user }, error } = await supabase.auth.getUser()

      if (error || !user) {
        return c.json({ error: 'Unauthorized' }, 401)
      }

      // Set user info in context for downstream handlers
      c.set('userId', user.id)
      c.set('userEmail', user.email)
      c.set('user', user)
      c.set('supabase', supabase)

      await next()
    } catch (error) {
      console.error('Auth middleware error:', error)
      return c.json({ error: 'Authentication failed' }, 401)
    }
  }
}

/**
 * Middleware that optionally authenticates
 * Sets user info if authenticated, but allows unauthenticated access
 */
export function optionalAuth(env: SupabaseEnv) {
  return async (c: Context, next: Next) => {
    try {
      const supabase = createClientWithContext(c, env)
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        c.set('userId', user.id)
        c.set('userEmail', user.email)
        c.set('user', user)
      }
      c.set('supabase', supabase)

      await next()
    } catch (error) {
      // Continue without auth on error
      await next()
    }
  }
}

/**
 * Get Supabase client from context (set by middleware)
 */
export function getSupabaseFromContext(c: Context) {
  return c.get('supabase')
}

/**
 * Get current user from context (set by middleware)
 */
export function getUserFromContext(c: Context) {
  return c.get('user')
}

/**
 * Get user ID from context (set by middleware)
 */
export function getUserIdFromContext(c: Context): string | undefined {
  return c.get('userId')
}
