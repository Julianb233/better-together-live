/**
 * Database Connection Module for Supabase
 *
 * Provides a unified database interface that works with Supabase.
 * Maintains backward compatibility with the existing Neon-based interface.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './lib/supabase/types'

// Type for query result rows (compatible with existing interface)
export type QueryResult<T = Record<string, unknown>> = {
  rows: T[]
  rowCount: number
}

export interface SupabaseDbEnv {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY?: string
  SUPABASE_SERVICE_ROLE_KEY?: string
  // Fallback to Neon if Supabase not configured
  DATABASE_URL?: string
}

/**
 * Supabase Database wrapper class
 * Provides D1-like API compatibility for easier migration
 */
export class SupabaseDatabase {
  private client: SupabaseClient<Database>

  constructor(url: string, key: string) {
    this.client = createClient<Database>(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
      }
    })
  }

  /**
   * Get the underlying Supabase client for direct access
   */
  getClient(): SupabaseClient<Database> {
    return this.client
  }

  /**
   * Execute a raw SQL query using Supabase's rpc or direct table access
   * Note: For complex queries, prefer using Supabase's query builder
   */
  async query<T = Record<string, unknown>>(
    query: string,
    params: unknown[] = []
  ): Promise<QueryResult<T>> {
    try {
      // For raw SQL, we use Supabase's postgres function if available
      // Otherwise, parse and convert to Supabase query builder
      const { data, error, count } = await this.client.rpc('execute_sql', {
        query,
        params
      })

      if (error) {
        // If RPC doesn't exist, try to use query builder approach
        console.warn('Raw SQL not available, consider using Supabase query builder:', error.message)
        throw error
      }

      return {
        rows: (data || []) as T[],
        rowCount: count || (data?.length ?? 0)
      }
    } catch (error) {
      console.error('Database query error:', error)
      throw error
    }
  }

  /**
   * Execute a query and return the first row (or null)
   */
  async first<T = Record<string, unknown>>(
    tableName: string,
    options?: {
      select?: string
      filter?: Record<string, unknown>
      eq?: [string, unknown][]
    }
  ): Promise<T | null> {
    try {
      let query = this.client.from(tableName).select(options?.select || '*')

      if (options?.eq) {
        for (const [column, value] of options.eq) {
          query = query.eq(column, value)
        }
      }

      const { data, error } = await query.limit(1).single()

      if (error && error.code !== 'PGRST116') {
        // PGRST116 is "no rows returned" which is expected
        throw error
      }

      return data as T || null
    } catch (error) {
      console.error('Database first error:', error)
      throw error
    }
  }

  /**
   * Execute a query and return all rows
   */
  async all<T = Record<string, unknown>>(
    tableName: string,
    options?: {
      select?: string
      filter?: Record<string, unknown>
      eq?: [string, unknown][]
      order?: { column: string; ascending?: boolean }
      limit?: number
    }
  ): Promise<T[]> {
    try {
      let query = this.client.from(tableName).select(options?.select || '*')

      if (options?.eq) {
        for (const [column, value] of options.eq) {
          query = query.eq(column, value)
        }
      }

      if (options?.order) {
        query = query.order(options.order.column, { ascending: options.order.ascending ?? true })
      }

      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      return (data || []) as T[]
    } catch (error) {
      console.error('Database all error:', error)
      throw error
    }
  }

  /**
   * Insert a row
   */
  async insert<T = Record<string, unknown>>(
    tableName: string,
    data: Record<string, unknown>
  ): Promise<T | null> {
    try {
      const { data: result, error } = await this.client
        .from(tableName)
        .insert(data)
        .select()
        .single()

      if (error) {
        throw error
      }

      return result as T
    } catch (error) {
      console.error('Database insert error:', error)
      throw error
    }
  }

  /**
   * Update rows
   */
  async update<T = Record<string, unknown>>(
    tableName: string,
    data: Record<string, unknown>,
    filter: { eq: [string, unknown][] }
  ): Promise<T[]> {
    try {
      let query = this.client.from(tableName).update(data)

      for (const [column, value] of filter.eq) {
        query = query.eq(column, value)
      }

      const { data: result, error } = await query.select()

      if (error) {
        throw error
      }

      return (result || []) as T[]
    } catch (error) {
      console.error('Database update error:', error)
      throw error
    }
  }

  /**
   * Delete rows
   */
  async delete(
    tableName: string,
    filter: { eq: [string, unknown][] }
  ): Promise<void> {
    try {
      let query = this.client.from(tableName).delete()

      for (const [column, value] of filter.eq) {
        query = query.eq(column, value)
      }

      const { error } = await query

      if (error) {
        throw error
      }
    } catch (error) {
      console.error('Database delete error:', error)
      throw error
    }
  }

  /**
   * Execute a modification query (INSERT, UPDATE, DELETE)
   * Backward compatible with existing code
   */
  async run(query: string, params: unknown[] = []): Promise<void> {
    // For compatibility, log a warning and attempt to execute
    console.warn('Using raw SQL with Supabase. Consider migrating to query builder.')
    await this.query(query, params)
  }
}

/**
 * Create a Supabase database instance from environment
 */
export function createSupabaseDatabase(env: SupabaseDbEnv): SupabaseDatabase {
  if (!env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL environment variable is required')
  }

  // Prefer service role key for server-side operations, fallback to anon key
  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY

  if (!key) {
    throw new Error('SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  }

  return new SupabaseDatabase(env.SUPABASE_URL, key)
}

/**
 * Get a raw Supabase client for direct access
 */
export function getSupabaseClient(env: SupabaseDbEnv): SupabaseClient<Database> {
  if (!env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL environment variable is required')
  }

  const key = env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_ANON_KEY

  if (!key) {
    throw new Error('SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY environment variable is required')
  }

  return createClient<Database>(env.SUPABASE_URL, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false
    }
  })
}

export type { SupabaseClient, Database }
