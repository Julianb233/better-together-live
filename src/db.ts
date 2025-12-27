/**
 * Database Connection Module for Neon PostgreSQL
 *
 * Provides connection pooling and query utilities for serverless environments.
 */

import { neon, neonConfig, NeonQueryFunction } from '@neondatabase/serverless'

// Configure for serverless
neonConfig.fetchConnectionCache = true

// Type for query result rows
export type QueryResult<T = Record<string, unknown>> = {
  rows: T[]
  rowCount: number
}

/**
 * Get a database connection
 */
export function getDb(databaseUrl: string): NeonQueryFunction<false, false> {
  return neon(databaseUrl)
}

/**
 * Database wrapper class for D1-like API compatibility
 */
export class Database {
  private sql: NeonQueryFunction<false, false>

  constructor(databaseUrl: string) {
    this.sql = neon(databaseUrl)
  }

  /**
   * Execute a parameterized query
   */
  async query<T = Record<string, unknown>>(
    query: string,
    params: unknown[] = []
  ): Promise<QueryResult<T>> {
    try {
      const rows = await this.sql(query, params) as T[]
      return {
        rows,
        rowCount: rows.length
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
    query: string,
    params: unknown[] = []
  ): Promise<T | null> {
    const result = await this.query<T>(query, params)
    return result.rows[0] || null
  }

  /**
   * Execute a query and return all rows
   */
  async all<T = Record<string, unknown>>(
    query: string,
    params: unknown[] = []
  ): Promise<T[]> {
    const result = await this.query<T>(query, params)
    return result.rows
  }

  /**
   * Execute a modification query (INSERT, UPDATE, DELETE)
   */
  async run(query: string, params: unknown[] = []): Promise<void> {
    await this.query(query, params)
  }
}

/**
 * Create a database instance from environment
 */
export function createDatabase(env: { DATABASE_URL: string }): Database {
  if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required')
  }
  return new Database(env.DATABASE_URL)
}
