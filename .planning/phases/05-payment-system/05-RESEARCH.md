# Phase 5: Payment System - Research

**Researched:** 2026-03-05
**Domain:** Stripe Subscriptions, Freemium Gating, Webhook Lifecycle
**Confidence:** HIGH

## Summary

The current payment system uses raw `fetch()` calls to the Stripe REST API with manual URL-encoded form bodies, no webhook signature verification, hardcoded pricing that conflicts across pages (paywall.ts has $39/$69 tiers, premium-pricing.ts has $240/yr and $30/mo tiers), and raw SQL queries to a legacy database adapter. The codebase already has well-defined TypeScript types for subscriptions, plans, and transactions in `src/types.ts` -- these are good and should be leveraged.

The migration path is clear: install the official `stripe` npm package (v20.x), replace all raw fetch calls with SDK methods, implement webhook signature verification using `stripe.webhooks.constructEventAsync()` (the async version required for edge/Hono), create Stripe Products and Prices in the dashboard (not inline price_data), and use the Stripe Customer Portal for subscription self-management instead of building a custom management UI.

**Primary recommendation:** Use `stripe` SDK v20.x with pre-created Stripe Products/Prices, Stripe Checkout for payment collection, Stripe Customer Portal for subscription management, and `constructEventAsync` for webhook verification in Hono.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `stripe` | ^20.4.0 | Server-side Stripe SDK | Official SDK with TypeScript types, webhook verification, all API methods |
| `@stripe/stripe-js` | ^7.x | Client-side Stripe.js loader | Already loaded via CDN script tag; npm package is optional but cleaner |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@supabase/supabase-js` | ^2.89.0 | Subscription state storage | Already installed; store subscription records in Supabase |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Stripe SDK | Raw fetch (current) | SDK provides TypeScript types, auto-retries, webhook verification, pagination -- raw fetch has none |
| Stripe Customer Portal | Custom management UI | Portal is free, maintained by Stripe, handles edge cases (proration, payment method updates) -- custom UI is weeks of work |
| Stripe Checkout (hosted) | Embedded Elements | Hosted checkout is simpler, PCI-compliant by default, supports Apple/Google Pay out of the box |

**Installation:**
```bash
npm install stripe
```

No need to install `@stripe/stripe-js` separately since the project already loads Stripe.js via CDN `<script src="https://js.stripe.com/v3/"></script>`.

## Architecture Patterns

### Recommended Project Structure
```
src/
  api/
    payments.ts              # Refactored: Stripe SDK, checkout, portal, subscription status
  lib/
    stripe.ts                # NEW: Stripe client initialization, helper functions
  pages/
    paywall.ts               # Refactored: Consistent pricing, links to Stripe Checkout
    premium-pricing.ts       # Refactored: Consistent pricing matching Stripe Products
    subscription-management.ts  # Refactored: Redirect to Stripe Customer Portal
```

### Pattern 1: Stripe Client Singleton
**What:** Create the Stripe client once per request context, not globally (env vars are per-request in edge runtimes).
**When to use:** Every Stripe API call.
**Example:**
```typescript
// src/lib/stripe.ts
import Stripe from 'stripe'

export function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    apiVersion: '2025-06-30.basil', // Use latest stable API version
    typescript: true,
  })
}
```

### Pattern 2: Stripe Checkout with Pre-Created Prices
**What:** Use Price IDs from Stripe Dashboard instead of inline `price_data`.
**When to use:** All checkout session creation.
**Why:** Inline price_data creates a new Price object every time. Pre-created Prices let you manage pricing in Stripe Dashboard, enable Customer Portal price switching, and maintain a single source of truth.
**Example:**
```typescript
// src/api/payments.ts
const PLAN_PRICE_MAP: Record<string, string> = {
  'try-it-out-monthly': 'price_xxx',       // $30/mo
  'better-together-annual': 'price_yyy',    // $240/yr
}

app.post('/create-checkout-session', async (c) => {
  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY)
  const { planId, userId, email } = await c.req.json()

  const priceId = PLAN_PRICE_MAP[planId]
  if (!priceId) return c.json({ error: 'Invalid plan' }, 400)

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: email,
    client_reference_id: userId,
    line_items: [{ price: priceId, quantity: 1 }],
    subscription_data: {
      metadata: { userId, planId },
      trial_period_days: 7,  // Free trial from paywall
    },
    success_url: `${c.req.url.replace(/\/api.*/, '')}/portal?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${c.req.url.replace(/\/api.*/, '')}/paywall`,
    allow_promotion_codes: true,
  })

  return c.json({ sessionId: session.id, url: session.url })
})
```

### Pattern 3: Webhook with Async Signature Verification (Hono-specific)
**What:** Use `constructEventAsync` (not `constructEvent`) because Hono runs in edge/async context.
**When to use:** Webhook endpoint.
**Example:**
```typescript
// Source: https://hono.dev/examples/stripe-webhook
app.post('/webhook', async (c) => {
  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY)
  const signature = c.req.header('stripe-signature')

  if (!signature) return c.text('Missing signature', 400)

  const body = await c.req.text()  // MUST use raw text, not json()

  const event = await stripe.webhooks.constructEventAsync(
    body,
    signature,
    c.env.STRIPE_WEBHOOK_SECRET
  )

  // Handle event...
  return c.json({ received: true })
})
```

### Pattern 4: Stripe Customer Portal for Subscription Management
**What:** Instead of building cancel/upgrade UI, redirect to Stripe-hosted portal.
**When to use:** Subscription management, payment method updates, cancellation.
**Example:**
```typescript
app.post('/create-portal-session', async (c) => {
  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY)
  const { customerId } = await c.req.json()

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${c.req.url.replace(/\/api.*/, '')}/portal`,
  })

  return c.json({ url: session.url })
})
```

### Anti-Patterns to Avoid
- **Inline price_data in checkout sessions:** Creates orphan Price objects, breaks Customer Portal, makes pricing inconsistent. Use pre-created Price IDs.
- **Raw fetch to Stripe API:** No type safety, no auto-retry, no webhook verification, manual URL encoding. Use the SDK.
- **Parsing webhook JSON before verification:** `JSON.parse(body)` before `constructEvent` means you skip signature verification. Always verify first.
- **Storing subscription state only locally:** Stripe is the source of truth. Local DB is a cache. Always trust webhook events over local state.
- **Using `constructEvent` (sync) in edge runtime:** Hono/Vercel edge requires `constructEventAsync`. The sync version will fail.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Subscription management UI | Custom cancel/upgrade/payment method pages | Stripe Customer Portal | Handles proration, payment method updates, invoice history, plan switching -- all for free |
| Webhook signature verification | Manual HMAC comparison | `stripe.webhooks.constructEventAsync()` | Edge cases around timing tolerance, replay attacks, key rotation |
| Checkout payment form | Custom card input fields | Stripe Checkout (hosted page) | PCI compliance, Apple Pay/Google Pay, 3D Secure, localization |
| Retry logic for failed payments | Custom retry scheduler | Stripe Smart Retries (Billing settings) | Stripe has ML-optimized retry timing across billions of transactions |
| Proration calculation | Manual price math for plan changes | Stripe automatic proration | Off-by-one errors, timezone issues, mid-cycle changes |
| Invoice generation | Custom PDF/email generation | Stripe Invoices | Tax calculation, compliance, email delivery |

**Key insight:** Stripe has spent years building subscription lifecycle management. Every custom implementation of cancellation, proration, retry, or portal functionality will have bugs that Stripe has already fixed.

## Common Pitfalls

### Pitfall 1: Inconsistent Pricing Across Pages
**What goes wrong:** The current codebase has THREE different pricing models: paywall.ts ($39/$69/month), premium-pricing.ts ($240/year, $30/month), and payments.ts hardcoded SUBSCRIPTION_TIERS object. Users see different prices on different pages.
**Why it happens:** Pricing is hardcoded in multiple places instead of having a single source of truth.
**How to avoid:** Create Products and Prices in Stripe Dashboard. Store price IDs in a single config map. Frontend pages fetch pricing from `/api/payments/tiers` endpoint which reads from Stripe.
**Warning signs:** Any file containing dollar amounts or price values that isn't the single pricing config.

### Pitfall 2: Webhook Body Parsing Before Verification
**What goes wrong:** Calling `await c.req.json()` before signature verification silently consumes the body. The raw body is then unavailable for `constructEventAsync`.
**Why it happens:** Natural instinct to parse JSON first.
**How to avoid:** Always call `c.req.text()` first for the raw body, verify signature, then parse from the verified event object.
**Warning signs:** Webhook endpoint has `c.req.json()` anywhere before `constructEventAsync`.

### Pitfall 3: Not Linking Stripe Customer to User
**What goes wrong:** Using `customer_email` in checkout creates a new Stripe Customer each time. Multiple Customer objects for one user means broken portal sessions and duplicate charges.
**Why it happens:** Easier to pass email than manage Customer objects.
**How to avoid:** On first checkout, create or retrieve a Stripe Customer. Store `stripe_customer_id` in the user/subscription table. Use `customer` (not `customer_email`) in subsequent checkout sessions.
**Warning signs:** Checkout session creation uses `customer_email` without checking for existing customer.

### Pitfall 4: Trusting Client-Side Plan Selection
**What goes wrong:** Frontend sends a plan ID, backend trusts it and creates a session with that price. Malicious user could modify the request.
**Why it happens:** Backend doesn't validate against known price IDs.
**How to avoid:** Backend maintains a whitelist of valid Stripe Price IDs. Only accept known plan identifiers, map them server-side to Price IDs.
**Warning signs:** Price or amount values coming from client request body.

### Pitfall 5: Missing Webhook Event Handling
**What goes wrong:** Only handling `checkout.session.completed` misses renewal failures, cancellations initiated from Stripe Dashboard, and subscription status changes.
**Why it happens:** Developers implement the happy path only.
**How to avoid:** Handle the minimum set: `checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated`, `customer.subscription.deleted`.
**Warning signs:** Webhook handler has fewer than 4 event type cases.

### Pitfall 6: Not Implementing Idempotent Webhook Processing
**What goes wrong:** Stripe retries webhook delivery. Without idempotency, duplicate events cause duplicate database writes or double-processing.
**Why it happens:** Assumes webhooks are delivered exactly once.
**How to avoid:** Store processed event IDs. Check before processing. Use database upserts.
**Warning signs:** No event ID tracking in webhook handler.

## Code Examples

### Complete Stripe Client Setup
```typescript
// src/lib/stripe.ts
import Stripe from 'stripe'

export function createStripeClient(secretKey: string): Stripe {
  return new Stripe(secretKey, {
    apiVersion: '2025-06-30.basil',
    typescript: true,
  })
}

// Plan configuration - single source of truth
// Price IDs created in Stripe Dashboard
export const STRIPE_PLANS = {
  'try-it-out': {
    name: 'Try It Out',
    priceId: process.env.STRIPE_PRICE_TRY_IT_OUT || 'price_placeholder_tryitout',
    interval: 'month' as const,
    amount: 3000, // $30.00 - display only, actual price in Stripe
  },
  'better-together': {
    name: 'Better Together',
    priceId: process.env.STRIPE_PRICE_BETTER_TOGETHER || 'price_placeholder_bt',
    interval: 'year' as const,
    amount: 24000, // $240.00 - display only
  },
} as const

export type PlanId = keyof typeof STRIPE_PLANS
```

### Webhook Handler with Full Lifecycle
```typescript
// src/api/payments.ts - webhook handler
app.post('/webhook', async (c) => {
  const stripe = createStripeClient(c.env.STRIPE_SECRET_KEY)
  const signature = c.req.header('stripe-signature')
  if (!signature) return c.text('Missing signature', 400)

  let event: Stripe.Event
  try {
    const body = await c.req.text()
    event = await stripe.webhooks.constructEventAsync(
      body, signature, c.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return c.text('Invalid signature', 400)
  }

  const db = createSupabaseDatabase(c.env)

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const userId = session.metadata?.userId || session.client_reference_id
      if (userId && session.subscription) {
        await db.insert('subscriptions', {
          id: `sub_${Date.now()}`,
          user_id: userId,
          plan_id: session.metadata?.planId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
      break
    }

    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.subscription) {
        await db.update('subscriptions',
          { status: 'active', updated_at: new Date().toISOString() },
          { eq: [['stripe_subscription_id', invoice.subscription as string]] }
        )
      }
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      if (invoice.subscription) {
        await db.update('subscriptions',
          { status: 'past_due', updated_at: new Date().toISOString() },
          { eq: [['stripe_subscription_id', invoice.subscription as string]] }
        )
      }
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      await db.update('subscriptions',
        {
          status: subscription.status,
          canceled_at: subscription.canceled_at
            ? new Date(subscription.canceled_at * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        },
        { eq: [['stripe_subscription_id', subscription.id]] }
      )
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await db.update('subscriptions',
        { status: 'canceled', updated_at: new Date().toISOString() },
        { eq: [['stripe_subscription_id', subscription.id]] }
      )
      break
    }
  }

  return c.json({ received: true })
})
```

### Subscription Status Check with Gating
```typescript
// src/lib/subscription-gate.ts
import type { Context } from 'hono'

export type SubscriptionTier = 'free' | 'try-it-out' | 'better-together'

export async function getUserTier(
  db: SupabaseDatabase,
  userId: string
): Promise<SubscriptionTier> {
  const sub = await db.first('subscriptions', {
    select: 'plan_id, status',
    eq: [['user_id', userId]],
  })

  if (!sub || sub.status !== 'active') return 'free'
  return (sub.plan_id as SubscriptionTier) || 'free'
}

export function requireTier(minTier: SubscriptionTier) {
  const tierOrder: SubscriptionTier[] = ['free', 'try-it-out', 'better-together']

  return async (c: Context, next: () => Promise<void>) => {
    const userId = c.get('userId')
    if (!userId) return c.json({ error: 'Unauthorized' }, 401)

    const db = createSupabaseDatabase(c.env)
    const userTier = await getUserTier(db, userId)

    if (tierOrder.indexOf(userTier) < tierOrder.indexOf(minTier)) {
      return c.json({
        error: 'Upgrade required',
        requiredTier: minTier,
        currentTier: userTier,
        upgradeUrl: '/paywall'
      }, 403)
    }

    await next()
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Inline `price_data` in checkout | Pre-created Products/Prices in Dashboard | Always recommended, now enforced for Portal | Enables Customer Portal, consistent pricing |
| `constructEvent` (sync) | `constructEventAsync` (async) | Stripe SDK v13+ | Required for edge runtimes (Vercel, Cloudflare, Hono) |
| Custom subscription management UI | Stripe Customer Portal | Portal GA 2020, continuously updated | Eliminates 80% of subscription management code |
| Stripe API version `2023-10-16` (current in codebase) | API version `2025-06-30.basil` | June 2025 | New billing features, subscription improvements |
| Manual payment retry logic | Stripe Smart Retries | Stripe Billing default | ML-optimized retry timing |

**Deprecated/outdated:**
- `STRIPE_API_VERSION = '2023-10-16'` in current code: Over 2 years old. Update to latest when migrating to SDK.
- Raw `fetch()` to Stripe API: Never recommended; SDK has always existed for Node.js.
- `stripeRequest()` helper function: Delete entirely when SDK is adopted.

## Pricing Consolidation Decision

The codebase currently has conflicting pricing. The research recommends consolidating to TWO plans matching `premium-pricing.ts` (the more recent page):

| Plan | Price | Interval | Stripe Product |
|------|-------|----------|----------------|
| Try It Out | $30/month | Monthly | Create in Dashboard |
| Better Together | $240/year ($20/mo) | Annual | Create in Dashboard |

The paywall.ts tiers ($39/$69) should be deprecated in favor of these. Create the Products and Prices in Stripe Dashboard, then reference the Price IDs in code.

## Supabase Schema Requirements

The `subscriptions` table needs these columns (derived from existing `Subscription` type in `src/types.ts`):

```sql
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  relationship_id TEXT REFERENCES relationships(id),
  plan_id TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL DEFAULT 'incomplete',
  billing_period TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  trial_end_date TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  is_gift BOOLEAN DEFAULT false,
  gift_from_user_id TEXT,
  gift_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_sub_id ON subscriptions(stripe_subscription_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

Also add `stripe_customer_id` to the users table:

```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE;
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
```

## Open Questions

1. **Which pricing model is final?**
   - What we know: Two conflicting pricing structures exist in the codebase.
   - What's unclear: Whether the owner wants the $39/$69 model or the $240/yr + $30/mo model.
   - Recommendation: Default to the premium-pricing.ts model (2 plans) as it's newer and cleaner. Confirm with product owner.

2. **Free tier scope**
   - What we know: PAY-02 requires freemium with free tier + premium. premium-pricing.ts says "No Free Tier Available."
   - What's unclear: What features are available without payment.
   - Recommendation: Implement a limited free tier (view dashboard, basic check-ins) with premium features gated. The free tier exists in code only -- no Stripe Product needed.

3. **Stripe account setup**
   - What we know: STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET are defined in Env type.
   - What's unclear: Whether Products/Prices are already created in the Stripe Dashboard.
   - Recommendation: Phase implementation should include creating Products/Prices in test mode.

## Sources

### Primary (HIGH confidence)
- [Hono Stripe Webhook Example](https://hono.dev/examples/stripe-webhook) - Official Hono docs showing constructEventAsync pattern
- [Stripe Subscription Webhooks](https://docs.stripe.com/billing/subscriptions/webhooks) - Minimum webhook events for subscriptions
- [Stripe Checkout for Subscriptions](https://docs.stripe.com/payments/checkout/build-subscriptions) - Checkout Session creation pattern
- [Stripe Customer Portal](https://docs.stripe.com/customer-management/integrate-customer-portal) - Portal session creation
- [Stripe SDK npm](https://www.npmjs.com/package/stripe) - v20.4.0 current

### Secondary (MEDIUM confidence)
- [Stripe Cancel Subscriptions](https://docs.stripe.com/billing/subscriptions/cancel) - cancel_at_period_end pattern
- [Stripe Freemium Model](https://stripe.com/resources/more/freemium-pricing-explained) - Stripe's own guidance on freemium

### Tertiary (LOW confidence)
- None. All findings verified with official Stripe docs.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Stripe SDK, verified on npm
- Architecture: HIGH - Hono-specific webhook pattern from official Hono docs
- Pitfalls: HIGH - Derived from actual codebase analysis + Stripe docs
- Pricing consolidation: MEDIUM - Requires product owner confirmation on final pricing

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (Stripe SDK is stable, patterns don't change frequently)
