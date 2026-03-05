/**
 * Stripe Client Library
 *
 * Creates per-request Stripe instances (env vars are per-request in Vercel edge)
 * and provides plan configuration as the single source of truth for pricing.
 */

import Stripe from 'stripe'

/**
 * Create a Stripe client instance.
 * Must be called per-request since env vars are injected per-request on Vercel edge.
 */
export function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    apiVersion: '2025-06-30.basil' as any,
    typescript: true,
  })
}

/** Plan identifiers matching Stripe Products */
export type PlanId = keyof typeof STRIPE_PLANS

/**
 * Single source of truth for plan configuration.
 * Price IDs are resolved at request time from env vars.
 */
export const STRIPE_PLANS = {
  'try-it-out': {
    name: 'Try It Out',
    interval: 'month' as const,
    amount: 3000, // $30.00 in cents
    priceEnvVar: 'STRIPE_PRICE_TRY_IT_OUT',
    fallbackPriceId: 'price_placeholder_tryitout',
  },
  'better-together': {
    name: 'Better Together',
    interval: 'year' as const,
    amount: 24000, // $240.00 in cents
    priceEnvVar: 'STRIPE_PRICE_BETTER_TOGETHER',
    fallbackPriceId: 'price_placeholder_bt',
  },
} as const

/**
 * Resolve the Stripe Price ID for a plan from environment variables.
 * Must be called at request time since env is per-request in edge runtime.
 */
export function getPriceId(planId: PlanId, env: Record<string, string>): string {
  const plan = STRIPE_PLANS[planId]
  return env[plan.priceEnvVar] || plan.fallbackPriceId
}
