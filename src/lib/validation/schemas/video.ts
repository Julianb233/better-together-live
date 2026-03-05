// Better Together: Video Validation Schemas
// Matches fields from src/api/video.ts

import { z } from 'zod'

/** POST /api/video/token */
export const videoTokenSchema = z.object({
  roomName: z.string().trim().min(1, 'Room name is required').max(200),
  participantName: z.string().trim().min(1, 'Participant name is required').max(200),
  participantId: z.string().max(200).optional(),
})

/** POST /api/video/rooms */
export const createRoomSchema = z.object({
  roomName: z.string().trim().min(1, 'Room name is required').max(200),
  metadata: z.record(z.unknown()).optional(),
  maxParticipants: z.number().int().min(1).max(100).default(2),
})

/** POST /api/video/date-room */
export const createDateRoomSchema = z.object({
  coupleId: z.string().trim().min(1, 'Couple ID is required').max(200),
  user1Name: z.string().max(200).optional(),
  user2Name: z.string().max(200).optional(),
  scheduledTime: z.string().optional(),
})
