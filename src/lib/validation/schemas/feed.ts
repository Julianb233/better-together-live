// Better Together: Feed Validation Schemas
// Matches fields from src/api/feed.ts

import { z } from 'zod'
import { paginationSchema } from './common'

/** GET /api/feed - Personalized feed query params */
export const feedQuerySchema = paginationSchema.extend({
  userId: z.string().min(1, 'User ID required'),
  filter: z.enum(['all', 'communities', 'connections']).default('all'),
})

/** GET /api/feed/trending - Trending feed query params */
export const trendingFeedQuerySchema = paginationSchema.extend({
  timeframe: z.enum(['24h', 'week', 'month']).default('24h'),
  userId: z.string().optional(),
})

/** GET /api/feed/community/:communityId - Community feed query params */
export const communityFeedQuerySchema = paginationSchema.extend({
  userId: z.string().optional(),
  pinnedFirst: z.enum(['true', 'false']).optional(),
})

/** GET /api/feed/user/:targetUserId - User feed query params */
export const userFeedQuerySchema = paginationSchema.extend({
  viewerId: z.string().optional(),
})
