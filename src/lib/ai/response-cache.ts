/**
 * AI Coach Response Cache
 *
 * In-memory cache for AI coach responses with TTL and size eviction.
 * Intentionally in-memory -- acceptable to lose on cold start (optimization, not critical).
 */

interface CacheEntry {
  response: string
  tier: string
  model: string
  expiresAt: number
}

const MAX_CACHE_SIZE = 500
const cache = new Map<string, CacheEntry>()

/**
 * Normalize a message into a cache key.
 * Lowercase, trim, remove non-alphanumeric/space chars, collapse whitespace.
 */
export function getCacheKey(message: string): string {
  return message
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
}

/**
 * Check if a cached response exists for this message.
 * Returns null if not found or expired.
 */
export function getCachedResponse(
  message: string
): { response: string; tier: string; model: string } | null {
  const key = getCacheKey(message)
  const entry = cache.get(key)

  if (!entry) return null

  // Check expiry
  if (Date.now() >= entry.expiresAt) {
    cache.delete(key)
    return null
  }

  return {
    response: entry.response,
    tier: entry.tier,
    model: entry.model,
  }
}

/**
 * Cache an AI coach response.
 * Evicts oldest entry if cache exceeds max size.
 *
 * @param ttlMs - Time-to-live in milliseconds (default: 24 hours)
 */
export function cacheResponse(
  message: string,
  response: string,
  tier: string,
  model: string,
  ttlMs = 24 * 60 * 60 * 1000
): void {
  const key = getCacheKey(message)

  // Evict oldest entry if at capacity
  if (cache.size >= MAX_CACHE_SIZE && !cache.has(key)) {
    const oldestKey = cache.keys().next().value
    if (oldestKey !== undefined) {
      cache.delete(oldestKey)
    }
  }

  cache.set(key, {
    response,
    tier,
    model,
    expiresAt: Date.now() + ttlMs,
  })
}
