-- Better Together: Payment & Subscription Schema
-- Stripe Integration Tables for Premium Plans & Transactions

-- Subscription Plans table - Define available subscription tiers
CREATE TABLE IF NOT EXISTS subscription_plans (
  id TEXT PRIMARY KEY,
  plan_name TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK(plan_type IN ('try_it_out', 'better_together', 'premium_plus', 'custom')),
  billing_period TEXT NOT NULL CHECK(billing_period IN ('monthly', 'annual')),
  price_cents INTEGER NOT NULL, -- Store as cents to avoid decimal issues
  price_display TEXT NOT NULL, -- "$30" or "$240/year"
  currency TEXT DEFAULT 'USD',
  stripe_price_id TEXT UNIQUE, -- Stripe Price ID
  stripe_product_id TEXT, -- Stripe Product ID
  features TEXT, -- JSON array of features included
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Subscription Purchases table - Track user subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
  id TEXT PRIMARY KEY,
  relationship_id TEXT NOT NULL,
  plan_id TEXT NOT NULL,
  user_id TEXT NOT NULL, -- Who purchased (could be individual or couple)
  stripe_customer_id TEXT, -- Stripe Customer ID
  stripe_subscription_id TEXT UNIQUE, -- Stripe Subscription ID
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'past_due', 'canceled', 'trialing', 'paused', 'incomplete')),
  billing_period TEXT NOT NULL CHECK(billing_period IN ('monthly', 'annual')),
  price_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  trial_end_date TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  canceled_at TIMESTAMPTZ,
  cancel_reason TEXT,
  is_gift BOOLEAN DEFAULT FALSE, -- True if gifted to partner
  gift_from_user_id TEXT, -- If gift, who gave it
  gift_message TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES subscription_plans(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (gift_from_user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Payment Transactions table - Track all payments
CREATE TABLE IF NOT EXISTS payment_transactions (
  id TEXT PRIMARY KEY,
  subscription_id TEXT,
  user_id TEXT NOT NULL,
  relationship_id TEXT,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_charge_id TEXT,
  transaction_type TEXT NOT NULL CHECK(transaction_type IN ('subscription', 'credits', 'add_on', 'gift', 'box', 'coaching', 'refund')),
  amount_cents INTEGER NOT NULL,
  currency TEXT DEFAULT 'USD',
  status TEXT NOT NULL CHECK(status IN ('succeeded', 'pending', 'failed', 'refunded', 'canceled')),
  payment_method TEXT CHECK(payment_method IN ('card', 'bank_account', 'apple_pay', 'google_pay')),
  description TEXT,
  metadata TEXT, -- JSON for additional data
  failure_reason TEXT,
  refund_amount_cents INTEGER,
  refunded_at TIMESTAMPTZ,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE SET NULL
);

-- AI Credits table - Track credit purchases and usage
CREATE TABLE IF NOT EXISTS ai_credits (
  id TEXT PRIMARY KEY,
  relationship_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  transaction_type TEXT NOT NULL CHECK(transaction_type IN ('purchase', 'grant', 'usage', 'expiration', 'refund')),
  credits_amount INTEGER NOT NULL, -- Positive for purchase/grant, negative for usage
  credits_balance INTEGER NOT NULL, -- Running balance after transaction
  purchase_price_cents INTEGER, -- For purchases only
  usage_description TEXT, -- What the credits were used for
  stripe_payment_id TEXT, -- Link to payment if purchased
  expires_at TIMESTAMPTZ, -- Credits may expire
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Subscription Add-ons table - Track premium add-ons
CREATE TABLE IF NOT EXISTS subscription_addons (
  id TEXT PRIMARY KEY,
  addon_name TEXT NOT NULL,
  addon_type TEXT NOT NULL CHECK(addon_type IN ('surprise_box', 'coaching', 'calendar_features', 'analytics', 'customization', 'content')),
  description TEXT,
  price_cents INTEGER NOT NULL,
  billing_period TEXT CHECK(billing_period IN ('one_time', 'monthly', 'annual')),
  stripe_price_id TEXT UNIQUE,
  stripe_product_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  features TEXT, -- JSON array
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User Add-on Purchases table - Track add-on subscriptions
CREATE TABLE IF NOT EXISTS user_addons (
  id TEXT PRIMARY KEY,
  relationship_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  addon_id TEXT NOT NULL,
  stripe_subscription_id TEXT, -- For recurring add-ons
  status TEXT NOT NULL DEFAULT 'active' CHECK(status IN ('active', 'canceled', 'paused')),
  price_cents INTEGER NOT NULL,
  billing_period TEXT,
  purchase_date TIMESTAMPTZ NOT NULL,
  expiration_date TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (addon_id) REFERENCES subscription_addons(id)
);

-- Stripe Webhooks Log table - Track webhook events for debugging
CREATE TABLE IF NOT EXISTS stripe_webhooks (
  id TEXT PRIMARY KEY,
  event_id TEXT UNIQUE NOT NULL,
  event_type TEXT NOT NULL,
  event_data TEXT NOT NULL, -- Full JSON payload
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Refunds table - Track refund requests and processing
CREATE TABLE IF NOT EXISTS refunds (
  id TEXT PRIMARY KEY,
  transaction_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  relationship_id TEXT,
  refund_amount_cents INTEGER NOT NULL,
  refund_reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'denied', 'processed')),
  stripe_refund_id TEXT,
  requested_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMPTZ,
  processed_by TEXT, -- Admin user who processed
  notes TEXT,
  FOREIGN KEY (transaction_id) REFERENCES payment_transactions(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE SET NULL
);

-- Discount Codes table - Track promo codes and discounts
CREATE TABLE IF NOT EXISTS discount_codes (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK(discount_type IN ('percentage', 'fixed_amount', 'trial_extension')),
  discount_value INTEGER NOT NULL, -- Percentage (25 = 25%) or cents for fixed
  applies_to TEXT CHECK(applies_to IN ('all', 'subscription', 'credits', 'addons')),
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  stripe_coupon_id TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Discount Usage table - Track who used discount codes
CREATE TABLE IF NOT EXISTS discount_usage (
  id TEXT PRIMARY KEY,
  discount_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  relationship_id TEXT,
  transaction_id TEXT,
  discount_amount_cents INTEGER NOT NULL,
  used_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (discount_id) REFERENCES discount_codes(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE SET NULL,
  FOREIGN KEY (transaction_id) REFERENCES payment_transactions(id) ON DELETE SET NULL
);

-- Create indexes for payment tables
CREATE INDEX IF NOT EXISTS idx_subscriptions_relationship ON subscriptions(relationship_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription ON subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period_end ON subscriptions(current_period_end);

CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_relationship ON payment_transactions(relationship_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_subscription ON payment_transactions(subscription_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_type ON payment_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_stripe_intent ON payment_transactions(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created ON payment_transactions(created_at);

CREATE INDEX IF NOT EXISTS idx_ai_credits_relationship ON ai_credits(relationship_id);
CREATE INDEX IF NOT EXISTS idx_ai_credits_user ON ai_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_credits_created ON ai_credits(created_at);

CREATE INDEX IF NOT EXISTS idx_user_addons_relationship ON user_addons(relationship_id);
CREATE INDEX IF NOT EXISTS idx_user_addons_user ON user_addons(user_id);
CREATE INDEX IF NOT EXISTS idx_user_addons_status ON user_addons(status);

CREATE INDEX IF NOT EXISTS idx_stripe_webhooks_event_id ON stripe_webhooks(event_id);
CREATE INDEX IF NOT EXISTS idx_stripe_webhooks_processed ON stripe_webhooks(processed);
CREATE INDEX IF NOT EXISTS idx_stripe_webhooks_event_type ON stripe_webhooks(event_type);

CREATE INDEX IF NOT EXISTS idx_refunds_transaction ON refunds(transaction_id);
CREATE INDEX IF NOT EXISTS idx_refunds_status ON refunds(status);

CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON discount_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_discount_usage_discount ON discount_usage(discount_id);
CREATE INDEX IF NOT EXISTS idx_discount_usage_user ON discount_usage(user_id);
