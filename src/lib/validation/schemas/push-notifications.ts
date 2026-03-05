// Better Together: Push Notifications Validation Schemas
// Matches fields from src/api/push-notifications.ts

import { z } from 'zod'

/** POST /api/push/register */
export const registerDeviceSchema = z.object({
  user_id: z.string().min(1),
  device_token: z.string().min(1),
  platform: z.enum(['ios', 'android']),
})

/** POST /api/push/send */
export const sendPushSchema = z.object({
  user_id: z.string().min(1),
  notification_type: z.enum([
    'partner_checkin_reminder', 'partner_activity', 'milestone_achieved',
    'daily_prompt', 'gift_received',
  ]).optional(),
  payload: z.any().optional(),
  custom_payload: z.object({
    title: z.string().min(1).max(200),
    body: z.string().min(1).max(1000),
    data: z.record(z.any()).optional(),
    imageUrl: z.string().url().optional(),
    badge: z.number().int().min(0).optional(),
    sound: z.string().max(100).optional(),
  }).optional(),
})

/** POST /api/push/broadcast */
export const broadcastPushSchema = z.object({
  notification_type: z.string().min(1).optional(),
  payload: z.any().optional(),
  custom_payload: z.object({
    title: z.string().min(1).max(200),
    body: z.string().min(1).max(1000),
    data: z.record(z.any()).optional(),
    imageUrl: z.string().url().optional(),
    badge: z.number().int().min(0).optional(),
    sound: z.string().max(100).optional(),
  }).optional(),
  admin_key: z.string().min(1),
})

/** DELETE /api/push/unregister */
export const unregisterDeviceSchema = z.object({
  device_token: z.string().min(1),
  user_id: z.string().optional(),
})
