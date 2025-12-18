// Better Together: Stripe Payment Integration
// Handles subscriptions, checkout sessions, and webhooks

import { Hono } from 'hono'
import type { Context } from 'hono'

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
paymentsApi.post('/create-checkout-session', async (c: Context) => {
  try {
    const { tierId, userId, email, successUrl, cancelUrl } = await c.req.json()
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
})

// POST /api/payments/webhook
// Handle Stripe webhook events
paymentsApi.post('/webhook', async (c: Context) => {
  try {
    const body = await c.req.text()
    const signature = c.req.header('stripe-signature')
    const webhookSecret = (c.env as any)?.STRIPE_WEBHOOK_SECRET

    // In production, verify webhook signature
    // For now, parse the event directly
    const event = JSON.parse(body)

    const db = (c.env as any)?.DB

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.metadata?.userId || session.client_reference_id
        const tierId = session.metadata?.tierId

        if (db && userId) {
          await db.prepare(`
            INSERT INTO subscriptions (id, user_id, tier_id, stripe_subscription_id, status, created_at)
            VALUES (?, ?, ?, ?, 'active', datetime('now'))
            ON CONFLICT(user_id) DO UPDATE SET
              tier_id = excluded.tier_id,
              stripe_subscription_id = excluded.stripe_subscription_id,
              status = 'active',
              updated_at = datetime('now')
          `).bind(
            `sub_${Date.now()}`,
            userId,
            tierId,
            session.subscription
          ).run()
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object
        const userId = subscription.metadata?.userId

        if (db && userId) {
          await db.prepare(`
            UPDATE subscriptions SET status = ?, updated_at = datetime('now')
            WHERE stripe_subscription_id = ?
          `).bind(subscription.status, subscription.id).run()
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object

        if (db) {
          await db.prepare(`
            UPDATE subscriptions SET status = 'canceled', updated_at = datetime('now')
            WHERE stripe_subscription_id = ?
          `).bind(subscription.id).run()
        }
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
    const userId = c.req.query('userId')
    const db = (c.env as any)?.DB

    if (!userId) {
      return c.json({ error: 'userId required' }, 400)
    }

    if (!db) {
      return c.json({
        hasSubscription: false,
        tier: null,
        status: 'none'
      })
    }

    const subscription = await db.prepare(`
      SELECT * FROM subscriptions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1
    `).bind(userId).first()

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
paymentsApi.post('/cancel-subscription', async (c: Context) => {
  try {
    const { userId } = await c.req.json()
    const apiKey = (c.env as any)?.STRIPE_SECRET_KEY
    const db = (c.env as any)?.DB

    if (!apiKey) {
      return c.json({ error: 'Stripe not configured' }, 500)
    }

    // Get subscription from database
    const subscription = await db?.prepare(`
      SELECT stripe_subscription_id FROM subscriptions WHERE user_id = ? AND status = 'active'
    `).bind(userId).first()

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
})

// POST /api/payments/create-gift-checkout
// Create checkout for gift subscription
paymentsApi.post('/create-gift-checkout', async (c: Context) => {
  try {
    const { tierId, senderUserId, recipientEmail, recipientName, message, successUrl, cancelUrl } = await c.req.json()
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
})

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
