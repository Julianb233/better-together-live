// Better Together: Social Validation Schemas
// Matches fields from src/api/social.ts and src/api/posts.ts

import { z } from 'zod'
import { uuidParam, paginationSchema } from './common'

// -- Reaction types --
const reactionTypeEnum = z.enum(['like', 'love', 'celebrate', 'support', 'insightful'])

/** POST /api/posts/:postId/reactions or /api/comments/:commentId/reactions */
export const createReactionSchema = z.object({
  reaction_type: reactionTypeEnum,
})

// -- Post types --
const contentTypeEnum = z.enum([
  'text', 'photo', 'activity', 'milestone', 'challenge_complete', 'achievement',
])
const visibilityEnum = z.enum(['public', 'community', 'connections', 'private'])

/** POST /api/posts - Create a new post */
export const createPostSchema = z.object({
  authorId: z.string().min(1),
  content: z.string().max(5000).optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  visibility: visibilityEnum,
  communityId: uuidParam.optional().nullable(),
  contentType: contentTypeEnum.default('text'),
  relationshipId: uuidParam.optional().nullable(),
  linkedActivityId: z.string().optional().nullable(),
  linkedChallengeId: z.string().optional().nullable(),
  linkedAchievementId: z.string().optional().nullable(),
}).refine(
  (data) => data.content || (data.mediaUrls && data.mediaUrls.length > 0),
  { message: 'Either content or media URLs required' }
)

/** PUT /api/posts/:id - Update a post */
export const updatePostSchema = z.object({
  userId: z.string().min(1),
  content: z.string().max(5000).optional(),
  mediaUrls: z.array(z.string().url()).optional(),
  visibility: visibilityEnum.optional(),
})

/** POST /api/posts/:id/share - Share a post */
export const sharePostSchema = z.object({
  userId: z.string().min(1),
  content: z.string().max(5000).optional(),
  visibility: visibilityEnum.optional(),
  communityId: uuidParam.optional().nullable(),
})

// -- Comments --

/** POST /api/posts/:postId/comments - Create comment */
export const createCommentSchema = z.object({
  content: z.string().trim().min(1, 'Comment content is required').max(2000),
  parent_comment_id: z.string().optional(),
})

/** PUT /api/comments/:id - Update comment */
export const updateCommentSchema = z.object({
  content: z.string().trim().min(1, 'Comment content is required').max(2000),
})

// -- Connections --

/** PUT /api/connections/:userId/friend - Accept/reject friend request */
export const friendRequestActionSchema = z.object({
  action: z.enum(['accept', 'reject']),
})

// -- Blocks --

/** POST /api/blocks/:userId - Block a user */
export const createBlockSchema = z.object({
  reason: z.enum(['spam', 'harassment', 'inappropriate', 'other']).optional(),
  notes: z.string().max(500).optional(),
})

// -- Reports --
const reportTargetTypeEnum = z.enum(['post', 'comment', 'message', 'user', 'community'])
const reportReasonEnum = z.enum([
  'spam', 'harassment', 'hate_speech', 'violence',
  'inappropriate', 'misinformation', 'copyright', 'other',
])

/** POST /api/reports - Report content */
export const createReportSchema = z.object({
  target_type: reportTargetTypeEnum,
  target_id: z.string().min(1),
  reason: reportReasonEnum,
  description: z.string().max(2000).optional(),
})

// -- Query schemas --

/** GET /api/posts/:postId/comments - query params */
export const commentsQuerySchema = paginationSchema.extend({
  sort: z.enum(['newest', 'oldest', 'popular']).default('newest'),
})

/** GET /api/connections - query params */
export const connectionsQuerySchema = paginationSchema.extend({
  type: z.enum(['followers', 'following', 'friends']),
  status: z.enum(['pending', 'accepted', 'rejected', 'blocked']).default('accepted'),
})
