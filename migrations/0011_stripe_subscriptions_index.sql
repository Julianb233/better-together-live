-- Ensure unique constraint on subscriptions.user_id for upsert conflict resolution
-- and add indexes for common Stripe subscription lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_user_id_unique
  ON subscriptions(user_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_subscription_id
  ON subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id
  ON subscriptions(stripe_customer_id);

CREATE INDEX IF NOT EXISTS idx_subscriptions_status
  ON subscriptions(status);
