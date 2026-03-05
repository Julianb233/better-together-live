/**
 * AI Coach Rate Limiter
 *
 * Per-user in-memory rate limiting middleware for the AI coach endpoint.
 * Configurable max requests per time window.
 */

import { createMiddleware } from 'hono/factory'
import { HTTPException } from 'hono/http-exception'

interface RateLimitEntry {
  count: number
  resetAt: number
}

// In-memory store -- resets on cold start (acceptable for serverless)
const store = new Map<string, RateLimitEntry>()

/**
 * Rate limiting middleware for AI coach routes.
 *
 * @param maxRequests - Maximum requests per window (default: 20)
 * @param windowMs - Window duration in milliseconds (default: 1 hour)
 */
export function aiCoachRateLimit(maxRequests = 20, windowMs = 60 * 60 * 1000) {
  return createMiddleware(async (c, next) => {
    const userId = c.get('userId') as string | undefined

    if (!userId) {
      throw new HTTPException(401, { message: 'Authentication required' })
    }

    const key = `ai-coach:${userId}`
    const now = Date.now()
    let entry = store.get(key)

    // Reset if window expired
    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs }
      store.set(key, entry)
    }

    // Increment count
    entry.count++

    const remaining = Math.max(0, maxRequests - entry.count)
    const resetSeconds = Math.ceil((entry.resetAt - now) / 1000)

    // Set rate limit headers on all responses
    c.header('X-RateLimit-Limit', String(maxRequests))
    c.header('X-RateLimit-Remaining', String(remaining))
    c.header('X-RateLimit-Reset', String(resetSeconds))

    // Check if over limit
    if (entry.count > maxRequests) {
      throw new HTTPException(429, {
        message: "You've reached your AI coach limit. Try again later.",
      })
    }

    await next()
  })
}
