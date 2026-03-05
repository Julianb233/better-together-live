// Better Together: Users Validation Schemas
// Matches fields from src/api/users.ts

import { z } from 'zod'

const loveLanguageEnum = z.enum([
  'words_of_affirmation', 'quality_time', 'receiving_gifts',
  'acts_of_service', 'physical_touch',
])

/** PUT /api/users/:userId/preferences - Update user preferences */
export const updatePreferencesSchema = z.object({
  communicationStyle: z.string().max(100).optional(),
  datePreferences: z.any().optional(),
  budgetRange: z.string().max(50).optional(),
  interests: z.array(z.string().max(100)).optional(),
})

/** PUT /api/users/:userId/love-languages */
export const updateLoveLanguagesSchema = z.object({
  primary: loveLanguageEnum.optional(),
  secondary: loveLanguageEnum.optional(),
})

/** PUT /api/users/:userId/notification-settings */
export const updateNotificationSettingsSchema = z.object({
  email: z.object({
    dailyCheckins: z.boolean().optional(),
    weeklyDigest: z.boolean().optional(),
    milestoneReminders: z.boolean().optional(),
    partnerActivity: z.boolean().optional(),
    promotions: z.boolean().optional(),
  }).optional(),
  push: z.object({
    dailyCheckins: z.boolean().optional(),
    partnerMessages: z.boolean().optional(),
    challenges: z.boolean().optional(),
    achievements: z.boolean().optional(),
  }).optional(),
  sms: z.object({
    urgentReminders: z.boolean().optional(),
    anniversaryAlerts: z.boolean().optional(),
  }).optional(),
})
