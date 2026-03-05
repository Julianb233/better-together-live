/**
 * Supabase Auth Middleware for Hono
 *
 * Provides authentication middleware for API routes.
 * Reads env from c.env at request time (required for Vercel per-request env).
 */

import type { Context, Next } from 'hono'
import { deleteCookie } from 'hono/cookie'
import { createClientWithContext } from './server'

/**
 * Cookie relay middleware.
 * Applies Set-Cookie headers from @supabase/ssr (token refresh) to the actual response.
 * Must run BEFORE auth middleware so that createClientWithContext's setAll cookies reach the browser.
 */
export function supabaseCookieRelay() {
  return async (c: Context, next: Next) => {
    await next()

    // After route handler runs, check if @supabase/ssr set any cookies
    const headers = c.get('supabaseResponseHeaders') as Headers | undefined
    if (headers) {
      headers.forEach((value, key) => {
        c.header(key, value, { append: true })
      })
    }
  }
}

/**
 * Legacy cookie cleanup middleware.
 * Clears old bt_access_token and bt_refresh_token cookies from the custom JWT auth system.
 * These are no longer used since we migrated to Supabase Auth.
 */
export function clearLegacyCookies() {
  return async (c: Context, next: Next) => {
    const cookieHeader = c.req.header('Cookie') ?? ''
    if (cookieHeader.includes('bt_access_token')) {
      deleteCookie(c, 'bt_access_token', { path: '/' })
      deleteCookie(c, 'bt_refresh_token', { path: '/' })
    }
    await next()
  }
}

/**
 * Middleware that requires authentication
 * Sets userId, userEmail, user, and supabase in context if authenticated
 */
export function requireAuth() {
  return async (c: Context, next: Next) => {
    try {
      const env = {
        SUPABASE_URL: c.env?.SUPABASE_URL || '',
        SUPABASE_ANON_KEY: c.env?.SUPABASE_ANON_KEY || '',
        SUPABASE_SERVICE_ROLE_KEY: c.env?.SUPABASE_SERVICE_ROLE_KEY
      }
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
export function optionalAuth() {
  return async (c: Context, next: Next) => {
    try {
      const env = {
        SUPABASE_URL: c.env?.SUPABASE_URL || '',
        SUPABASE_ANON_KEY: c.env?.SUPABASE_ANON_KEY || '',
        SUPABASE_SERVICE_ROLE_KEY: c.env?.SUPABASE_SERVICE_ROLE_KEY
      }
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
 * Middleware that requires admin role
 * Must be used after requireAuth() in the middleware chain
 */
export function requireAdmin() {
  return async (c: Context, next: Next) => {
    const user = c.get('user')
    if (!user) return c.json({ error: 'Unauthorized' }, 401)
    const isAdmin = user.app_metadata?.role === 'admin'
    if (!isAdmin) return c.json({ error: 'Forbidden' }, 403)
    await next()
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
