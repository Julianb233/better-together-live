/**
 * Supabase Client Library
 *
 * Central export point for all Supabase utilities.
 */

// Client-side utilities
export {
  createBrowserClient,
  createSupabaseClient,
  getSupabaseBrowserClient,
  type SupabaseClient
} from './client'

// Server-side utilities
export {
  createServerClient,
  createAdminClient,
  createClientWithContext,
  setSupabaseAuthCookies,
  clearSupabaseAuthCookies,
  getCurrentUser,
  requireSupabaseAuth,
  type SupabaseEnv
} from './server'

// Middleware
export {
  requireAuth,
  optionalAuth,
  getSupabaseFromContext,
  getUserFromContext,
  getUserIdFromContext
} from './middleware'

// Types
export type {
  Database,
  Tables,
  InsertTables,
  UpdateTables,
  User,
  Relationship,
  ImportantDate,
  DailyCheckin,
  SharedGoal,
  Activity,
  Subscription,
  Notification,
  Json
} from './types'
