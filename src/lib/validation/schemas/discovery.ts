// Better Together: Discovery Validation Schemas
// Matches fields from src/api/discovery.ts

import { z } from 'zod'
import { paginationSchema } from './common'

const searchTypeEnum = z.enum(['all', 'users', 'communities', 'posts'])

/** GET /api/search - Universal search */
export const searchQuerySchema = paginationSchema.extend({
  q: z.string().min(2, 'Search query must be at least 2 characters'),
  type: searchTypeEnum.default('all'),
})

/** GET /api/search/users */
export const searchUsersQuerySchema = paginationSchema.extend({
  q: z.string().min(2, 'Search query must be at least 2 characters'),
})

/** GET /api/search/communities */
export const searchCommunitiesQuerySchema = paginationSchema.extend({
  q: z.string().min(2, 'Search query must be at least 2 characters'),
  category: z.enum([
    'relationship_stage', 'interests', 'location', 'support', 'lifestyle', 'other',
  ]).optional(),
  privacy_level: z.enum(['public', 'private', 'invite_only']).optional(),
})

/** GET /api/discover/communities */
export const discoverCommunitiesQuerySchema = paginationSchema.extend({
  category: z.enum(['featured', 'popular', 'new', 'for_you']).default('featured'),
})

/** GET /api/discover/users */
export const discoverUsersQuerySchema = paginationSchema

/** GET /api/discover/trending */
export const trendingQuerySchema = paginationSchema.extend({
  timeframe: z.enum(['24h', 'week']).default('24h'),
})
