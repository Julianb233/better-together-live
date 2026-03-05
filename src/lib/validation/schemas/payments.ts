// Better Together: Payments Validation Schemas
// Matches fields from src/api/payments.ts

import { z } from 'zod'

const planIdEnum = z.enum(['try-it-out', 'better-together'])

/** POST /api/payments/create-checkout-session */
export const createCheckoutSchema = z.object({
  planId: planIdEnum,
  userId: z.string().min(1),
  email: z.string().email(),
})

/** POST /api/payments/cancel-subscription */
export const cancelSubscriptionSchema = z.object({
  userId: z.string().min(1),
})

/** POST /api/payments/create-portal-session */
export const createPortalSessionSchema = z.object({
  userId: z.string().min(1),
})

/** POST /api/payments/create-gift-checkout */
export const createGiftCheckoutSchema = z.object({
  planId: planIdEnum,
  senderUserId: z.string().min(1),
  recipientEmail: z.string().email(),
  recipientName: z.string().max(200).optional(),
  message: z.string().max(500).optional(),
})

/** GET /api/payments/subscription-status - query params */
export const subscriptionStatusQuerySchema = z.object({
  userId: z.string().min(1),
})
