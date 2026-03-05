// Better Together: Email Validation Schemas
// Matches fields from src/api/email.ts

import { z } from 'zod'

/** POST /api/email/invite-partner */
export const invitePartnerEmailSchema = z.object({
  inviterName: z.string().trim().min(1, 'Inviter name is required').max(200),
  partnerEmail: z.string().email('Invalid partner email'),
  inviteToken: z.string().min(1, 'Invite token is required'),
})

/** POST /api/email/subscription-confirmation */
export const subscriptionConfirmationEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  userName: z.string().trim().min(1, 'User name is required').max(200),
  planName: z.string().trim().min(1, 'Plan name is required').max(100),
  price: z.string().trim().min(1, 'Price is required').max(50),
})

/** POST /api/email/password-reset */
export const passwordResetEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  userName: z.string().trim().min(1, 'User name is required').max(200),
  resetToken: z.string().min(1, 'Reset token is required'),
})

/** POST /api/email/notify-gift */
export const notifyGiftEmailSchema = z.object({
  recipientEmail: z.string().email('Invalid recipient email'),
  recipientName: z.string().trim().min(1, 'Recipient name is required').max(200),
  senderName: z.string().trim().min(1, 'Sender name is required').max(200),
  giftType: z.string().trim().min(1, 'Gift type is required').max(100),
})

/** POST /api/email/milestone-reminder */
export const milestoneReminderEmailSchema = z.object({
  email: z.string().email('Invalid email address'),
  userName: z.string().trim().min(1, 'User name is required').max(200),
  partnerName: z.string().trim().min(1, 'Partner name is required').max(200),
  milestone: z.string().trim().min(1, 'Milestone is required').max(300),
  daysUntil: z.number().int().min(0).max(365),
})
