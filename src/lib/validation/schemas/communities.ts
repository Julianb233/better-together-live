// Better Together: Communities Validation Schemas
// Matches fields from src/api/communities.ts

import { z } from 'zod'
import { paginationSchema } from './common'

const categoryEnum = z.enum([
  'relationship_stage', 'interests', 'location', 'support', 'lifestyle', 'other',
])
const privacyLevelEnum = z.enum(['public', 'private', 'invite_only'])
const memberRoleEnum = z.enum(['member', 'moderator', 'admin'])
const sortEnum = z.enum(['recent', 'popular', 'alphabetical'])

/** POST /api/communities - Create community */
export const createCommunitySchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().trim().min(1).max(2000),
  category: categoryEnum,
  privacy_level: privacyLevelEnum.default('public'),
  cover_image_url: z.string().url().optional().nullable(),
})

/** PUT /api/communities/:id - Update community */
export const updateCommunitySchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: z.string().trim().min(1).max(2000).optional(),
  cover_image_url: z.string().url().optional().nullable(),
  privacy_level: privacyLevelEnum.optional(),
  category: categoryEnum.optional(),
})

/** GET /api/communities - query params */
export const communityQuerySchema = paginationSchema.extend({
  category: categoryEnum.optional(),
  search: z.string().optional(),
  sort: sortEnum.default('recent'),
})

/** POST /api/communities/:id/join - Join community */
export const joinCommunitySchema = z.object({
  invite_code: z.string().optional(),
})

/** PUT /api/communities/:id/members/:userId - Update member role */
export const updateMemberRoleSchema = z.object({
  role: memberRoleEnum,
})

/** DELETE /api/communities/:id/members/:userId - Remove/ban member */
export const removeMemberSchema = z.object({
  ban: z.boolean().optional(),
})

/** POST /api/communities/:id/invite - Create invite */
export const createInviteSchema = z.object({
  invited_email: z.string().email().optional(),
  expires_in_days: z.number().int().min(1).max(90).optional(),
})

/** GET /api/communities/:id/members - query params */
export const memberQuerySchema = paginationSchema.extend({
  role: z.enum(['owner', 'admin', 'moderator', 'member']).optional(),
  search: z.string().optional(),
})
