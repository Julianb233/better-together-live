// Better Together: Relationships Validation Schemas
// Matches fields from src/api/relationships.ts

import { z } from 'zod'
import { uuidParam, dateString } from './common'

const relationshipTypeEnum = z.enum(['dating', 'engaged', 'married', 'partnership'])

/** POST /api/relationships/link - Link two users as partners */
export const linkPartnersSchema = z.object({
  user1Id: uuidParam,
  user2Id: uuidParam,
  relationshipType: relationshipTypeEnum.default('partnership'),
  startDate: dateString.optional(),
}).refine((data) => data.user1Id !== data.user2Id, {
  message: 'Cannot link user to themselves',
})

/** POST /api/relationships/invite - Send partner invitation */
export const invitePartnerSchema = z.object({
  inviterUserId: uuidParam,
  partnerEmail: z.string().email(),
  relationshipType: relationshipTypeEnum.default('partnership'),
  message: z.string().max(500).optional(),
})

/** PUT /api/relationships/:relationshipId - Update relationship */
export const updateRelationshipSchema = z.object({
  relationshipType: relationshipTypeEnum.optional(),
  startDate: dateString.optional(),
  anniversaryDate: dateString.optional(),
})

/** POST /api/relationships/accept-invite - Accept invitation */
export const acceptInviteSchema = z.object({
  inviteToken: z.string().min(1),
  acceptingUserId: uuidParam,
})
