/**
 * Supabase Client - Browser/Client-side
 *
 * Use this client for browser-side operations.
 * For server-side operations, use server.ts instead.
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Environment variables for client-side (must be public)
const supabaseUrl = typeof process !== 'undefined'
  ? process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ''
  : ''
const supabaseAnonKey = typeof process !== 'undefined'
  ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || ''
  : ''

/**
 * Create a Supabase client for browser/client-side usage
 */
export function createBrowserClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase URL or Anon Key not configured. Auth features will be limited.')
  }

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  })
}

/**
 * Create a Supabase client with custom URL and key
 * Used when environment variables aren't available (e.g., in Hono context)
 */
export function createSupabaseClient(url: string, anonKey: string) {
  return createClient<Database>(url, anonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  })
}

// Singleton instance for client-side
let browserClient: ReturnType<typeof createBrowserClient> | null = null

/**
 * Get the singleton browser client instance
 */
export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createBrowserClient()
  }
  return browserClient
}

export type SupabaseClient = ReturnType<typeof createBrowserClient>
