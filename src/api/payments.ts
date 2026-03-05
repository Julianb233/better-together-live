// Better Together: Stripe Payment Integration
// Handles subscriptions, checkout sessions, and webhooks

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { verifyStripeSignature } from '../lib/stripe'
import { zValidator, zodErrorHandler } from '../lib/validation'
import { createCheckoutSchema, cancelSubscriptionSchema, createGiftCheckoutSchema, subscriptionStatusQuerySchema } from '../lib/validation/schemas/payments'

const paymentsApi = new Hono()

// Stripe configuration
const STRIPE_API_VERSION = '2023-10-16'

// Subscription tiers from paywall
const SUBSCRIPTION_TIERS = {
  'growing-together': {
    name: 'Growing Together',
    price: 3900, // $39.00 in cents
    interval: 'month',
    features: ['AI Relationship Coach', 'Smart Scheduling', 'Basic Analytics', 'Email Support']
  },
  'growing-together-plus': {
    name: 'Growing Together+',
    price: 6900, // $69.00 in cents
    interval: 'month',
    features: ['Everything in Growing Together', 'Advanced Analytics', 'Priority Support', 'Partner Gifting', 'Intimacy Challenges']
  },
  'growing-together-annual': {
    name: 'Growing Together (Annual)',
    price: 24000, // $240.00/year ($20/mo)
    interval: 'year',
    features: ['All Growing Together features', '48% savings', 'Exclusive annual benefits']
  }
}

// Helper: Make Stripe API request
async function stripeRequest(endpoint: string, method: string, body: any, apiKey: string) {
  const response = await fetch(`https://api.stripe.com/v1${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Stripe-Version': STRIPE_API_VERSION
    },
    body: method !== 'GET' ? new URLSearchParams(body).toString() : undefined
  })
  return response.json()
}

// POST /api/payments/create-checkout-session
// Create Stripe checkout session for subscription
paymentsApi.post('/create-checkout-session',
  zValidator('json', createCheckoutSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const { tierId, userId, email, successUrl, cancelUrl } = c.req.valid('json' as never)
      const apiKey = (c.env as any)?.STRIPE_SECRET_KEY

      if (!apiKey) {
        return c.json({ error: 'Stripe not configured' }, 500)
      }

      const tier = SUBSCRIPTION_TIERS[tierId as keyof typeof SUBSCRIPTION_TIERS]
      if (!tier) {
        return c.json({ error: 'Invalid subscription tier' }, 400)
      }

      // Create Stripe checkout session
      const session = await stripeRequest('/checkout/sessions', 'POST', {
        'mode': 'subscription',
        'customer_email': email,
        'client_reference_id': userId,
        'success_url': successUrl || 'https://better-together.app/portal?success=true',
        'cancel_url': cancelUrl || 'https://better-together.app/paywall?canceled=true',
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': tier.name,
        'line_items[0][price_data][unit_amount]': tier.price,
        'line_items[0][price_data][recurring][interval]': tier.interval,
        'line_items[0][quantity]': 1,
        'metadata[userId]': userId,
        'metadata[tierId]': tierId,
        'subscription_data[metadata][userId]': userId,
        'subscription_data[metadata][tierId]': tierId,
        'allow_promotion_codes': 'true'
      }, apiKey)

      if (session.error) {
        return c.json({ error: session.error.message }, 400)
      }

      return c.json({
        sessionId: session.id,
        url: session.url
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
    const body = await c.req.text()
    const signature = c.req.header('stripe-signature')
    const webhookSecret = (c.env as any)?.STRIPE_WEBHOOK_SECRET

    if (!signature || !webhookSecret) {
      return c.json({ error: 'Missing signature or webhook secret' }, 400)
    }

    const isValid = await verifyStripeSignature(body, signature, webhookSecret)
    if (!isValid) {
      console.error('Stripe webhook signature verification failed')
      return c.json({ error: 'Invalid signature' }, 401)
    }

    const event = JSON.parse(body)

    const supabase = createAdminClient(c.env as SupabaseEnv)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId || session.client_reference_id
        const tierId = session.metadata?.tierId

        if (userId) {
          const { error } = await supabase
            .from('subscriptions')
            .upsert({
              id: `sub_${Date.now()}`,
              user_id: userId,
              tier_id: tierId,
              stripe_subscription_id: session.subscription,
              status: 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }, { onConflict: 'user_id' })

          if (error) throw error
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const userId = subscription.metadata?.userId

        if (userId) {
          const { error } = await supabase
            .from('subscriptions')
            .update({ status: subscription.status, updated_at: new Date().toISOString() })
            .eq('stripe_subscription_id', subscription.id)

          if (error) throw error
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        const { error } = await supabase
          .from('subscriptions')
          .update({ status: 'canceled', updated_at: new Date().toISOString() })
          .eq('stripe_subscription_id', subscription.id)

        if (error) throw error
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object
        // Handle failed payment - send notification email
        console.log('Payment failed for subscription:', invoice.subscription)
        break
      }
    }

    return c.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return c.json({ error: 'Webhook processing failed' }, 400)
  }
})

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
        tier: null,
        status: 'none'
      })
    }

    const tier = SUBSCRIPTION_TIERS[subscription.tier_id as keyof typeof SUBSCRIPTION_TIERS]

    return c.json({
      hasSubscription: subscription.status === 'active',
      tier: tier ? { id: subscription.tier_id, ...tier } : null,
      status: subscription.status,
      stripeSubscriptionId: subscription.stripe_subscription_id,
      createdAt: subscription.created_at
    })
  } catch (error) {
    console.error('Status error:', error)
    return c.json({ error: 'Failed to get subscription status' }, 500)
  }
})

// POST /api/payments/cancel-subscription
// Cancel subscription
paymentsApi.post('/cancel-subscription',
  zValidator('json', cancelSubscriptionSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const { userId } = c.req.valid('json' as never)
      const apiKey = (c.env as any)?.STRIPE_SECRET_KEY

      if (!apiKey) {
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
      const result = await stripeRequest(
        `/subscriptions/${subscription.stripe_subscription_id}`,
        'POST',
        { 'cancel_at_period_end': 'true' },
        apiKey
      )

      if (result.error) {
        return c.json({ error: result.error.message }, 400)
      }

      return c.json({
        success: true,
        cancelAt: result.cancel_at,
        message: 'Subscription will be canceled at end of billing period'
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
      const { tierId, senderUserId, recipientEmail, recipientName, message, successUrl, cancelUrl } = c.req.valid('json' as never)
      const apiKey = (c.env as any)?.STRIPE_SECRET_KEY

      if (!apiKey) {
        return c.json({ error: 'Stripe not configured' }, 500)
      }

      const tier = SUBSCRIPTION_TIERS[tierId as keyof typeof SUBSCRIPTION_TIERS]
      if (!tier) {
        return c.json({ error: 'Invalid subscription tier' }, 400)
      }

      // Create one-time payment for gift
      const session = await stripeRequest('/checkout/sessions', 'POST', {
        'mode': 'payment',
        'success_url': successUrl || 'https://better-together.app/gift-sent?success=true',
        'cancel_url': cancelUrl || 'https://better-together.app/gift?canceled=true',
        'line_items[0][price_data][currency]': 'usd',
        'line_items[0][price_data][product_data][name]': `Gift: ${tier.name}`,
        'line_items[0][price_data][product_data][description]': `Gift subscription for ${recipientName || recipientEmail}`,
        'line_items[0][price_data][unit_amount]': tier.price,
        'line_items[0][quantity]': 1,
        'metadata[type]': 'gift',
        'metadata[senderUserId]': senderUserId,
        'metadata[recipientEmail]': recipientEmail,
        'metadata[recipientName]': recipientName || '',
        'metadata[message]': message || '',
        'metadata[tierId]': tierId
      }, apiKey)

      if (session.error) {
        return c.json({ error: session.error.message }, 400)
      }

      return c.json({
        sessionId: session.id,
        url: session.url
      })
    } catch (error) {
      console.error('Gift checkout error:', error)
      return c.json({ error: 'Failed to create gift checkout' }, 500)
    }
  }
)

// GET /api/payments/tiers
// Get available subscription tiers
paymentsApi.get('/tiers', async (c: Context) => {
  return c.json({
    tiers: Object.entries(SUBSCRIPTION_TIERS).map(([id, tier]) => ({
      id,
      ...tier,
      priceFormatted: `$${(tier.price / 100).toFixed(2)}`
    }))
  })
})

export default paymentsApi
