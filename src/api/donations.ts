// Better Together: Donation Payment Integration
// Handles one-time and recurring (monthly) donations via Stripe Checkout
// Supports preset amounts ($25, $50, $100, $250, $500) and custom amounts

import { Hono } from 'hono'
import type { Context } from 'hono'
import Stripe from 'stripe'
import { createStripeClient } from '../lib/stripe'

const donationsApi = new Hono()

// Helper to get Stripe client from Hono context
function getStripe(c: Context): Stripe | null {
  const apiKey = (c.env as any)?.STRIPE_SECRET_KEY
  if (!apiKey) return null
  return createStripeClient(apiKey)
}

// POST /api/donations/create-checkout
// Create a Stripe Checkout session for a donation (one-time or monthly recurring)
donationsApi.post('/create-checkout', async (c: Context) => {
  try {
    const body = await c.req.json()
    const { amount, type, email, firstName, lastName, anonymous } = body

    // Validate amount
    const donationAmount = parseInt(amount)
    if (!donationAmount || donationAmount < 1 || donationAmount > 99999) {
      return c.json({ error: 'Invalid donation amount. Must be between $1 and $99,999.' }, 400)
    }

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return c.json({ error: 'A valid email address is required.' }, 400)
    }

    // Validate type
    const donationType = type === 'monthly' ? 'monthly' : 'onetime'

    const stripe = getStripe(c)
    if (!stripe) {
      return c.json({ error: 'Stripe is not configured. Please contact support.' }, 500)
    }

    const origin = new URL(c.req.url).origin
    const amountInCents = donationAmount * 100

    // Build donor name for metadata
    const donorName = anonymous
      ? 'Anonymous'
      : [firstName, lastName].filter(Boolean).join(' ') || 'Anonymous'

    // Impact message for the line item description
    const impactMessages: Record<number, string> = {
      25: 'Books and reading materials for 1 child',
      50: 'School supplies for 1 kid for a semester',
      100: 'After-school program access for 1 child',
      250: 'Tutoring package for 1 student (3 months)',
      500: 'Technology access & mentorship for 1 child (1 year)',
    }
    const impactDescription = impactMessages[donationAmount] || `Donation to help kids in need`

    const metadata: Record<string, string> = {
      type: 'donation',
      donationType,
      donorName,
      donorEmail: email,
      anonymous: anonymous ? 'true' : 'false',
    }

    const successUrl = `${origin}/donate/thank-you?amount=${donationAmount}&type=${donationType}`
    const cancelUrl = `${origin}/donate?canceled=true`

    if (donationType === 'monthly') {
      // Create a subscription checkout for monthly recurring donations
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: email,
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Monthly Donation - Let\'s Help These Kids',
              description: `$${donationAmount}/month: ${impactDescription}`,
            },
            unit_amount: amountInCents,
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        }],
        subscription_data: {
          metadata,
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
      })

      return c.json({ sessionId: session.id, url: session.url })
    } else {
      // Create a one-time payment checkout
      const session = await stripe.checkout.sessions.create({
        mode: 'payment',
        customer_email: email,
        line_items: [{
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Donation - Let\'s Help These Kids',
              description: `$${donationAmount}: ${impactDescription}`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata,
      })

      return c.json({ sessionId: session.id, url: session.url })
    }
  } catch (error) {
    c.var.logger?.error?.({ err: error }, 'Donation checkout error')
    return c.json({ error: 'Failed to create donation checkout. Please try again.' }, 500)
  }
})

// POST /api/donations/webhook
// Handle Stripe webhook events for donations
// NOTE: This supplements the existing /api/payments/webhook handler.
// In production, you may want to add donation-specific handling there instead.
donationsApi.post('/webhook', async (c: Context) => {
  try {
    const body = await c.req.text()
    const signature = c.req.header('stripe-signature')
    const webhookSecret = (c.env as any)?.STRIPE_WEBHOOK_SECRET
    const stripe = getStripe(c)

    if (!signature || !webhookSecret || !stripe) {
      return c.json({ error: 'Missing signature, webhook secret, or Stripe config' }, 400)
    }

    const event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const meta = session.metadata || {}

        // Only handle donation-type sessions
        if (meta.type !== 'donation') break

        // Log the donation (in production, save to your donations table)
        c.var.logger?.info?.({
          event: 'donation_completed',
          amount: session.amount_total,
          currency: session.currency,
          donorEmail: meta.donorEmail,
          donorName: meta.donorName,
          donationType: meta.donationType,
          anonymous: meta.anonymous,
          stripeSessionId: session.id,
        }, 'Donation received')

        break
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice
        // Handle recurring donation payments
        if (invoice.subscription_details?.metadata?.type === 'donation') {
          c.var.logger?.info?.({
            event: 'recurring_donation_paid',
            amount: invoice.amount_paid,
            subscriptionId: invoice.subscription,
          }, 'Recurring donation paid')
        }
        break
      }
    }

    return c.json({ received: true })
  } catch (error) {
    c.var.logger?.error?.({ err: error }, 'Donation webhook error')
    return c.json({ error: 'Webhook processing failed' }, 400)
  }
})

export default donationsApi
