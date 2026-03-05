// Better Together: Payments Validation Schemas
// Matches fields from src/api/payments.ts

import { z } from 'zod'

const tierIdEnum = z.enum(['growing-together', 'growing-together-plus', 'growing-together-annual'])

/** POST /api/payments/create-checkout-session */
export const createCheckoutSchema = z.object({
  tierId: tierIdEnum,
  userId: z.string().min(1),
  email: z.string().email(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

/** POST /api/payments/cancel-subscription */
export const cancelSubscriptionSchema = z.object({
  userId: z.string().min(1),
})

/** POST /api/payments/create-gift-checkout */
export const createGiftCheckoutSchema = z.object({
  tierId: tierIdEnum,
  senderUserId: z.string().min(1),
  recipientEmail: z.string().email(),
  recipientName: z.string().max(200).optional(),
  message: z.string().max(500).optional(),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
})

/** GET /api/payments/subscription-status - query params */
export const subscriptionStatusQuerySchema = z.object({
  userId: z.string().min(1),
})
