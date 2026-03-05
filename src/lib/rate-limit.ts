import type { Context, Next } from 'hono'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

/**
 * Distributed rate limiting middleware using Upstash Redis.
 * Sliding window: 60 requests per minute per IP.
 * Falls back to allowing requests if Upstash is not configured (dev mode).
 */
export function rateLimitMiddleware() {
  return async (c: Context, next: Next) => {
    const redisUrl = c.env?.UPSTASH_REDIS_REST_URL
    const redisToken = c.env?.UPSTASH_REDIS_REST_TOKEN

    // Skip rate limiting if Upstash not configured (dev/demo mode)
    if (!redisUrl || !redisToken) {
      await next()
      return
    }

    const redis = new Redis({ url: redisUrl, token: redisToken })
    const limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, '1 m'),
      prefix: 'bt-ratelimit',
    })

    const ip = c.req.header('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { success, remaining, reset } = await limiter.limit(ip)

    c.header('X-RateLimit-Remaining', String(remaining))
    c.header('X-RateLimit-Reset', String(reset))

    if (!success) {
      return c.json({ error: 'Too many requests' }, 429)
    }

    await next()
  }
}
