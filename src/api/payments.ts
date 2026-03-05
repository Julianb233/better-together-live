// Better Together: Stripe Payment Integration
// Handles subscriptions, checkout sessions, webhooks, and customer portal

import { Hono } from 'hono'
import type { Context } from 'hono'
import Stripe from 'stripe'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { createStripeClient, STRIPE_PLANS, getPriceId, type PlanId } from '../lib/stripe'
import { zValidator, zodErrorHandler } from '../lib/validation'
import {
  createCheckoutSchema,
  cancelSubscriptionSchema,
  createGiftCheckoutSchema,
  subscriptionStatusQuerySchema,
  createPortalSessionSchema,
} from '../lib/validation/schemas/payments'

const paymentsApi = new Hono()

// Helper to get Stripe client from Hono context
function getStripe(c: Context): Stripe | null {
  const apiKey = (c.env as any)?.STRIPE_SECRET_KEY
  if (!apiKey) return null
  return createStripeClient(apiKey)
}

// POST /api/payments/create-checkout-session
// Create Stripe checkout session for subscription
paymentsApi.post('/create-checkout-session',
  zValidator('json', createCheckoutSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const { planId, userId, email } = c.req.valid('json' as never)
      const stripe = getStripe(c)

      if (!stripe) {
        return c.json({ error: 'Stripe not configured' }, 500)
      }

      // Validate planId against known plans (server-side whitelist)
      if (!(planId in STRIPE_PLANS)) {
        return c.json({ error: 'Invalid plan' }, 400)
      }

      const priceId = getPriceId(planId as PlanId, c.env as Record<string, string>)
      const supabase = createAdminClient(c.env as SupabaseEnv)

      // Check if user already has a stripe_customer_id
      const { data: user } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', userId)
        .maybeSingle()

      const origin = new URL(c.req.url).origin

      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode: 'subscription',
        line_items: [{ price: priceId, quantity: 1 }],
        subscription_data: {
          metadata: { userId, planId },
        },
        client_reference_id: userId,
        success_url: `${origin}/portal?success=true`,
        cancel_url: `${origin}/paywall?canceled=true`,
        allow_promotion_codes: true,
      }

      // Use existing customer if available, otherwise let Stripe create one
      if (user?.stripe_customer_id) {
        sessionParams.customer = user.stripe_customer_id
      } else {
        sessionParams.customer_email = email
      }

      const session = await stripe.checkout.sessions.create(sessionParams)

      return c.json({
        sessionId: session.id,
        url: session.url,
      })
    } catch (error) {
      console.error('Checkout error:', error)
      return c.json({ error: 'Failed to create checkout session' }, 500)
    }
  }
)

// POST /api/payments/webhook
// Handle Stripe webhook events
paymentsApi.post('/webhook', async (c: Context) => {
  try {
    // Must read raw body BEFORE any JSON parsing
    const body = await c.req.text()
    const signature = c.req.header('stripe-signature')
    const webhookSecret = (c.env as any)?.STRIPE_WEBHOOK_SECRET
    const stripe = getStripe(c)

    if (!signature || !webhookSecret || !stripe) {
      return c.json({ error: 'Missing signature, webhook secret, or Stripe config' }, 400)
    }

    // Verify signature using SDK
    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
    const supabase = createAdminClient(c.env as SupabaseEnv)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId || session.client_reference_id
        const planId = session.subscription_data?.metadata?.planId || session.metadata?.planId

        if (userId) {
          // Upsert subscription record
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              id: `sub_${Date.now()}`,
              user_id: userId,
              plan_id: planId || 'try-it-out',
              stripe_subscription_id: session.subscription as string,
              stripe_customer_id: session.customer as string,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            } as any, { onConflict: 'user_id' })

          if (error) throw error

          // Store stripe_customer_id on users table for future checkouts
          if (session.customer) {
            await supabase
              .from('users')
              .update({ stripe_customer_id: session.customer as string, updated_at: new Date().toISOString() } as any)
              .eq('id', userId)
          }
        }
        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'active',
              current_period_start: invoice.period_start
                ? new Date(invoice.period_start * 1000).toISOString()
                : undefined,
              current_period_end: invoice.period_end
                ? new Date(invoice.period_end * 1000).toISOString()
                : undefined,
              updated_at: new Date().toISOString(),
            } as any)
            .eq('stripe_subscription_id', subscriptionId)

          if (error) throw error
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const subscriptionId = invoice.subscription as string

        if (subscriptionId) {
          const { error } = await supabase
            .from('subscriptions')
            .update({
              status: 'past_due',
              updated_at: new Date().toISOString(),
            } as any)
            .eq('stripe_subscription_id', subscriptionId)

          if (error) throw error
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: subscription.status,
            canceled_at: subscription.canceled_at
              ? new Date(subscription.canceled_at * 1000).toISOString()
              : null,
            updated_at: new Date().toISOString(),
          } as any)
          .eq('stripe_subscription_id', subscription.id)

        if (error) throw error
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const { error } = await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as any)
          .eq('stripe_subscription_id', subscription.id)

        if (error) throw error
        break
      }
    }

    return c.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return c.json({ error: 'Webhook processing failed' }, 400)
  }
})

// POST /api/payments/create-portal-session
// Create Stripe Customer Portal session for subscription management
paymentsApi.post('/create-portal-session',
  zValidator('json', createPortalSessionSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const { userId } = c.req.valid('json' as never)
      const stripe = getStripe(c)

      if (!stripe) {
        return c.json({ error: 'Stripe not configured' }, 500)
      }

      const supabase = createAdminClient(c.env as SupabaseEnv)

      // Look up stripe_customer_id from users table
      const { data: user } = await supabase
        .from('users')
        .select('stripe_customer_id')
        .eq('id', userId)
        .maybeSingle()

      if (!user?.stripe_customer_id) {
        return c.json({ error: 'No Stripe customer found. Please subscribe first.' }, 404)
      }

      const origin = new URL(c.req.url).origin
      const portalSession = await stripe.billingPortal.sessions.create({
        customer: user.stripe_customer_id,
        return_url: `${origin}/portal`,
      })

      return c.json({ url: portalSession.url })
    } catch (error) {
      console.error('Portal session error:', error)
      return c.json({ error: 'Failed to create portal session' }, 500)
    }
  }
)

// GET /api/payments/subscription-status
// Get current subscription status for user
paymentsApi.get('/subscription-status', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const userId = c.req.query('userId')

    if (!userId) {
      return c.json({ error: 'userId required' }, 400)
    }

    const { data: subscription, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) throw error

    if (!subscription) {
      return c.json({
        hasSubscription: false,
        plan: null,
        status: 'none',
      })
    }

    const plan = STRIPE_PLANS[subscription.plan_id as PlanId]

    return c.json({
      hasSubscription: subscription.status === 'active',
      plan: plan ? { id: subscription.plan_id, ...plan } : null,
      status: subscription.status,
      stripeSubscriptionId: subscription.stripe_subscription_id,
      createdAt: subscription.created_at,
    })
  } catch (error) {
    console.error('Status error:', error)
    return c.json({ error: 'Failed to get subscription status' }, 500)
  }
})

// POST /api/payments/cancel-subscription
// Cancel subscription at end of billing period
paymentsApi.post('/cancel-subscription',
  zValidator('json', cancelSubscriptionSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const { userId } = c.req.valid('json' as never)
      const stripe = getStripe(c)

      if (!stripe) {
        return c.json({ error: 'Stripe not configured' }, 500)
      }

      // Get subscription from database
      const { data: subscription, error } = await supabase
        .from('subscriptions')
        .select('stripe_subscription_id')
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle()

      if (error) throw error

      if (!subscription?.stripe_subscription_id) {
        return c.json({ error: 'No active subscription found' }, 404)
      }

      // Cancel at period end (not immediately)
      const result = await stripe.subscriptions.update(
        subscription.stripe_subscription_id,
        { cancel_at_period_end: true }
      )

      return c.json({
        success: true,
        cancelAt: result.cancel_at,
        message: 'Subscription will be canceled at end of billing period',
      })
    } catch (error) {
      console.error('Cancel error:', error)
      return c.json({ error: 'Failed to cancel subscription' }, 500)
    }
  }
)

// POST /api/payments/create-gift-checkout
// Create checkout for gift subscription
paymentsApi.post('/create-gift-checkout',
  zValidator('json', createGiftCheckoutSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const { planId, senderUserId, recipientEmail, recipientName, message } = c.req.valid('json' as never)
      const stripe = getStripe(c)

      if (!stripe) {
        return c.json({ error: 'Stripe not configured' }, 500)
      }

      // Validate planId
      if (!(planId in STRIPE_PLANS)) {
        return c.json({ error: 'Invalid plan' }, 400)
      }

      const plan = STRIPE_PLANS[planId as PlanId]
      const origin = new URL(c.req.url).origin

      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        success_url: `${origin}/gift-sent?success=true`,
        cancel_url: `${origin}/gift?canceled=true`,
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Gift: ${plan.name}`,
              description: `Gift subscription for ${recipientName || recipientEmail}`,
            },
            unit_amount: plan.amount,
          },
          quantity: 1,
        }],
        metadata: {
          type: 'gift',
          senderUserId,
          recipientEmail,
          recipientName: recipientName || '',
          message: message || '',
          planId,
        },
      })

      return c.json({
        sessionId: session.id,
        url: session.url,
      })
    } catch (error) {
      console.error('Gift checkout error:', error)
      return c.json({ error: 'Failed to create gift checkout' }, 500)
    }
  }
)

// GET /api/payments/tiers
// Get available subscription plans
paymentsApi.get('/tiers', async (c: Context) => {
  return c.json({
    plans: Object.entries(STRIPE_PLANS).map(([id, plan]) => ({
      id,
      name: plan.name,
      interval: plan.interval,
      amount: plan.amount,
      priceFormatted: `$${(plan.amount / 100).toFixed(2)}`,
    })),
  })
})

export default paymentsApi
