/**
 * Supabase Server Client
 *
 * Use this for server-side operations in Hono/API routes.
 * Supports service role key for admin operations.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'
import type { Context } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

export interface SupabaseEnv {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

/**
 * Create a Supabase client for server-side usage with anon key
 * Use this for operations that respect RLS policies
 */
export function createServerClient(env: SupabaseEnv): SupabaseClient<Database> {
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
 * Create a Supabase client with user context from cookies
 * Use this in API routes to maintain user session
 */
export function createClientWithContext(c: Context, env: SupabaseEnv): SupabaseClient<Database> {
  const accessToken = getCookie(c, 'sb-access-token')
  const refreshToken = getCookie(c, 'sb-refresh-token')

  const supabase = createClient<Database>(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })

  // Set session if tokens exist
  if (accessToken && refreshToken) {
    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })
  }

  return supabase
}

/**
 * Set auth cookies from Supabase session
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
 */
export function clearSupabaseAuthCookies(c: Context) {
  deleteCookie(c, 'sb-access-token', { path: '/' })
  deleteCookie(c, 'sb-refresh-token', { path: '/' })
}

/**
 * Get current user from Supabase session
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
