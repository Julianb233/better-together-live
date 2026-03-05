/**
 * Supabase Server Client
 *
 * Uses @supabase/ssr for proper cookie-based session management.
 * createClientWithContext handles automatic token refresh via getAll/setAll.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import {
  createServerClient as createSSRClient,
  parseCookieHeader,
  serializeCookieHeader,
} from '@supabase/ssr'
import type { Database } from './types'
import type { Context } from 'hono'
import { setCookie, deleteCookie } from 'hono/cookie'

export interface SupabaseEnv {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

/**
 * Create a plain Supabase client with anon key (no cookie session).
 * Use this for auth route handlers (signup/login) where no session exists yet.
 */
export function createAnonClient(env: SupabaseEnv): SupabaseClient<Database> {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required')
  }

  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
}

/**
 * Create a Supabase admin client with service role key
 * Use this for admin operations that bypass RLS
 * WARNING: Only use server-side, never expose to client
 */
export function createAdminClient(env: SupabaseEnv): SupabaseClient<Database> {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables are required for admin client')
  }

  return createClient<Database>(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
}

/**
 * Create a Supabase client with user context from cookies using @supabase/ssr.
 * Handles automatic token refresh via getAll/setAll cookie pattern.
 * Response cookies are stored on the Hono context for the cookie relay middleware to apply.
 */
export function createClientWithContext(c: Context, env: SupabaseEnv): SupabaseClient<Database> {
  // Accumulate Set-Cookie headers from @supabase/ssr's setAll calls
  const responseHeaders = new Headers()

  const supabase = createSSRClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        const cookieHeader = c.req.header('Cookie') ?? ''
        return parseCookieHeader(cookieHeader) as { name: string; value: string }[]
      },
      setAll(cookiesToSet) {
        for (const { name, value, options } of cookiesToSet) {
          const serialized = serializeCookieHeader(name, value, options)
          responseHeaders.append('Set-Cookie', serialized)
        }
      },
    },
  })

  // Store response headers on context for the cookie relay middleware
  c.set('supabaseResponseHeaders', responseHeaders)

  return supabase
}

/**
 * Set auth cookies from Supabase session
 * Used by supabase-auth.ts for login/signup responses.
 * Will be removed in plan 02-03 when auth routes use @supabase/ssr directly.
 */
export function setSupabaseAuthCookies(
  c: Context,
  accessToken: string,
  refreshToken: string,
  expiresIn: number = 3600
) {
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'lax' as const,
    path: '/',
    maxAge: expiresIn
  }

  setCookie(c, 'sb-access-token', accessToken, cookieOptions)
  setCookie(c, 'sb-refresh-token', refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7 // 7 days for refresh token
  })
}

/**
 * Clear auth cookies
 * Used by supabase-auth.ts for logout.
 * Will be removed in plan 02-03.
 */
export function clearSupabaseAuthCookies(c: Context) {
  deleteCookie(c, 'sb-access-token', { path: '/' })
  deleteCookie(c, 'sb-refresh-token', { path: '/' })
}

/**
 * Get current user from Supabase session
 * Uses getUser() which validates with the auth server (not getSession()).
 */
export async function getCurrentUser(c: Context, env: SupabaseEnv) {
  const supabase = createClientWithContext(c, env)
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

/**
 * Require authentication middleware helper
 */
export async function requireSupabaseAuth(c: Context, env: SupabaseEnv) {
  const user = await getCurrentUser(c, env)

  if (!user) {
    return null
  }

  return user
}

export type { SupabaseClient, Database }
