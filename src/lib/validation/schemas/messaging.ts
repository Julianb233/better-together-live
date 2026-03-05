// Better Together: Messaging Validation Schemas
// Matches fields from src/api/messaging.ts

import { z } from 'zod'
import { uuidParam, paginationSchema } from './common'

const messageTypeEnum = z.enum(['text', 'image', 'activity_share', 'post_share', 'challenge_share'])
const conversationTypeEnum = z.enum(['direct', 'group'])

/** POST /api/conversations - Create or get conversation */
export const createConversationSchema = z.object({
  participant_id: uuidParam.optional(),
  participant_ids: z.array(uuidParam).min(2).optional(),
  name: z.string().trim().min(1).max(100).optional(),
  type: conversationTypeEnum.optional(),
}).refine(
  (data) => data.participant_id || (data.participant_ids && data.participant_ids.length >= 2),
  { message: 'Either participant_id (direct) or participant_ids (group, min 2) is required' }
)

/** POST /api/conversations/:id/messages - Send message */
export const sendMessageSchema = z.object({
  content: z.string().max(5000).optional(),
  media_url: z.string().url().optional(),
  message_type: messageTypeEnum.default('text'),
  shared_activity_id: uuidParam.optional(),
  shared_post_id: z.string().optional(),
  shared_challenge_id: z.string().optional(),
}).refine(
  (data) => data.content || data.media_url || data.shared_activity_id || data.shared_post_id || data.shared_challenge_id,
  { message: 'Message content, media, or shared content required' }
)

/** PUT /api/conversations/:id/messages/:messageId - Edit message */
export const editMessageSchema = z.object({
  content: z.string().trim().min(1).max(5000),
})

/** PUT /api/conversations/:id/mute - Mute/unmute */
export const muteConversationSchema = z.object({
  is_muted: z.boolean(),
})

/** POST /api/conversations/:id/participants - Add participants */
export const addParticipantsSchema = z.object({
  participant_ids: z.array(uuidParam).min(1),
})

/** GET /api/conversations/:id/messages - query params */
export const messagesQuerySchema = paginationSchema.extend({
  before_id: z.string().optional(),
  after_id: z.string().optional(),
})
