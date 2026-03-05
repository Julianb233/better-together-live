/**
 * Subscription Gating Middleware
 *
 * Provides getUserTier() to check a user's subscription level and
 * requireTier() Hono middleware to gate premium routes.
 */

import type { MiddlewareHandler } from 'hono'
import { createAdminClient, type SupabaseEnv } from './supabase'
import type { SupabaseClient } from '@supabase/supabase-js'

/** Subscription tier levels, ordered from lowest to highest */
export type SubscriptionTier = 'free' | 'try-it-out' | 'better-together'

const TIER_ORDER: SubscriptionTier[] = ['free', 'try-it-out', 'better-together']

/**
 * Get the current subscription tier for a user.
 * Returns 'free' if no active subscription exists.
 */
export async function getUserTier(
  supabase: SupabaseClient,
  userId: string
): Promise<SubscriptionTier> {
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('plan_id, status')
    .eq('user_id', userId)
    .in('status', ['active', 'trialing'])
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!subscription) return 'free'

  const planId = subscription.plan_id as SubscriptionTier
  if (TIER_ORDER.includes(planId)) return planId

  return 'free'
}

/**
 * Hono middleware that gates routes by subscription tier.
 * Returns 403 with upgrade URL if user's tier is below the required minimum.
 *
 * Usage: app.use('/api/ai-coach/*', requireTier('try-it-out'))
 */
export function requireTier(minTier: SubscriptionTier): MiddlewareHandler {
  const minIndex = TIER_ORDER.indexOf(minTier)

  return async (c, next) => {
    const userId = c.get('userId') as string | undefined

    if (!userId) {
      return c.json({ error: 'Authentication required' }, 401)
    }

    const supabase = createAdminClient(c.env as SupabaseEnv)
    const userTier = await getUserTier(supabase, userId)
    const userIndex = TIER_ORDER.indexOf(userTier)

    if (userIndex < minIndex) {
      return c.json({
        error: 'Upgrade required',
        requiredTier: minTier,
        currentTier: userTier,
        upgradeUrl: '/paywall',
      }, 403)
    }

    await next()
  }
}
