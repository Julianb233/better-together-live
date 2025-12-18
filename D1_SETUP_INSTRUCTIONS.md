# Better Together - D1 Production Database Setup Guide

## Prerequisites

- Cloudflare account with Workers Paid plan ($5/month minimum)
- Wrangler CLI installed (`npm install -g wrangler`)
- Authenticated with Cloudflare (`wrangler login`)
- Access to Better Together Cloudflare account

---

## Step 1: Create Production D1 Database

### Option A: Via Wrangler CLI (Recommended)

```bash
# Navigate to project directory
cd /root/github-repos/better-together-live

# Create production D1 database
wrangler d1 create better-together-production

# Output will show:
# ✅ Successfully created DB 'better-together-production'
#
# [[d1_databases]]
# binding = "DB"
# database_name = "better-together-production"
# database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**IMPORTANT**: Copy the `database_id` from the output!

### Option B: Via Cloudflare Dashboard

1. Go to https://dash.cloudflare.com/
2. Navigate to **Workers & Pages** → **D1**
3. Click **Create Database**
4. Name: `better-together-production`
5. Click **Create**
6. Copy the **Database ID** from the overview page

---

## Step 2: Update Wrangler Configuration

Edit `wrangler.jsonc` and replace the `database_id`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "better-together",
  "compatibility_date": "2025-08-15",
  "pages_build_output_dir": "./dist",
  "compatibility_flags": [
    "nodejs_compat"
  ],
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "better-together-production",
      "database_id": "PASTE_YOUR_DATABASE_ID_HERE"  // ← Replace with actual ID
    }
  ],
  "vars": {
    "ENVIRONMENT": "production"
  }
}
```

**Important Notes:**
- Keep `"binding": "DB"` - this is how code references the database
- Keep `"database_name": "better-together-production"`
- Replace `"database_id": "local"` with your actual database ID

---

## Step 3: Run Migrations on Production Database

### Apply all migrations in order:

```bash
# Test migrations locally first (recommended)
npm run db:migrate:local

# If successful, apply to production
npm run db:migrate:prod
```

This will execute:
1. `0001_initial_relationship_schema.sql` - Core relationship tables
2. `0002_payment_subscription_schema.sql` - Payment & Stripe integration
3. `0003_analytics_events.sql` - Analytics and event tracking

### Verify migrations succeeded:

```bash
# List all tables
wrangler d1 execute better-together-production --command "SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;"

# Should show 40+ tables including:
# - users, relationships, subscriptions
# - payment_transactions, ai_credits
# - analytics_events, page_views
# - And many more...
```

---

## Step 4: Configure Stripe Environment Variables

### Add Stripe secrets to Cloudflare Workers:

```bash
# Add Stripe Secret Key (from Stripe Dashboard)
wrangler secret put STRIPE_SECRET_KEY
# Paste your Stripe secret key when prompted

# Add Stripe Webhook Secret (from Stripe Dashboard → Webhooks)
wrangler secret put STRIPE_WEBHOOK_SECRET
# Paste your webhook signing secret when prompted

# Stripe Publishable Key (not secret, can be in wrangler.jsonc vars)
# Add to wrangler.jsonc:
{
  "vars": {
    "STRIPE_PUBLISHABLE_KEY": "pk_live_..."
  }
}
```

### Get Stripe Keys:
1. Go to https://dashboard.stripe.com/
2. Navigate to **Developers** → **API Keys**
3. Copy **Secret key** (starts with `sk_live_` or `sk_test_`)
4. Copy **Publishable key** (starts with `pk_live_` or `pk_test_`)

### Setup Stripe Webhook:
1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://better-together.pages.dev/api/webhooks/stripe`
4. Select events to listen for:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `charge.refunded`
5. Copy the **Signing secret** (starts with `whsec_`)

---

## Step 5: Seed Production Database (Optional)

### Create subscription plans:

```bash
# Create a seed file: seed-production.sql
cat > seed-production.sql << 'EOF'
-- Seed subscription plans based on MONETIZATION_STRATEGY.md

INSERT INTO subscription_plans (id, plan_name, plan_type, billing_period, price_cents, price_display, stripe_price_id, features, is_active, sort_order)
VALUES
  ('plan_try_monthly', 'Try It Out Plan', 'try_it_out', 'monthly', 3000, '$30/month', 'price_stripe_try_monthly', '["Essential AI Coach", "Basic Challenges", "Simple Date Planning", "Email Support"]', 1, 1),
  ('plan_better_annual', 'Better Together Plan', 'better_together', 'annual', 24000, '$240/year', 'price_stripe_better_annual', '["Personal AI Coach", "Intimacy Challenges", "Smart Date Planning", "Relationship Games", "Priority Support", "$50 Surprise Credits", "Private Community", "First Access to Features"]', 1, 2),
  ('plan_premium_annual', 'Premium Plus Plan', 'premium_plus', 'annual', 28900, '$289/year', 'price_stripe_premium_annual', '["Everything in Better Together", "Monthly Surprise Box", "Save $49/year"]', 1, 3);

-- Seed common add-ons
INSERT INTO subscription_addons (id, addon_name, addon_type, description, price_cents, billing_period, is_active)
VALUES
  ('addon_surprise_box', 'Monthly Surprise Box', 'surprise_box', 'Curated relationship items, games, and treats delivered monthly', 4900, 'monthly', 1),
  ('addon_coaching_virtual', 'Virtual Coaching Session', 'coaching', 'One-on-one session with certified relationship expert', 8900, 'one_time', 1),
  ('addon_coaching_person', 'In-Person Coaching Session', 'coaching', 'In-person session with certified relationship therapist', 14900, 'one_time', 1);
EOF

# Apply seed data
wrangler d1 execute better-together-production --file=seed-production.sql
```

---

## Step 6: Verify Database Setup

### Run test queries:

```bash
# Count users (should be 0 initially)
wrangler d1 execute better-together-production --command "SELECT COUNT(*) as user_count FROM users;"

# List subscription plans
wrangler d1 execute better-together-production --command "SELECT plan_name, price_display FROM subscription_plans WHERE is_active = 1;"

# Check tables exist
wrangler d1 execute better-together-production --command "SELECT COUNT(*) as table_count FROM sqlite_master WHERE type='table';"
```

### Expected Results:
- `user_count`: 0 (no users yet)
- `subscription_plans`: 3 plans listed
- `table_count`: 40+ tables

---

## Step 7: Deploy Application

```bash
# Build the application
npm run build

# Deploy to Cloudflare Pages
npm run deploy:prod

# Or deploy with Wrangler
wrangler pages deploy dist --project-name better-together
```

### Verify deployment:
1. Visit `https://better-together.pages.dev`
2. Check database connectivity
3. Test subscription plan loading
4. Verify Stripe integration

---

## Database Management Commands

### Useful Wrangler D1 Commands:

```bash
# Execute SQL query
wrangler d1 execute better-together-production --command "SELECT * FROM users LIMIT 5;"

# Execute SQL file
wrangler d1 execute better-together-production --file=query.sql

# Interactive SQL console
wrangler d1 execute better-together-production

# List all D1 databases
wrangler d1 list

# Get database info
wrangler d1 info better-together-production

# Export database (backup)
wrangler d1 export better-together-production --output=backup.sql

# Import database (restore)
wrangler d1 execute better-together-production --file=backup.sql
```

---

## Monitoring & Maintenance

### Check Database Health:

```bash
# View database size
wrangler d1 info better-together-production

# Check index usage (run in console)
wrangler d1 execute better-together-production --command "SELECT * FROM sqlite_master WHERE type='index';"

# View migration history
wrangler d1 execute better-together-production --command "SELECT * FROM d1_migrations ORDER BY id;"
```

### Regular Maintenance Tasks:

1. **Weekly**: Review error logs
   ```sql
   SELECT * FROM error_logs WHERE severity IN ('high', 'critical') AND created_at > datetime('now', '-7 days');
   ```

2. **Monthly**: Check subscription churn
   ```sql
   SELECT COUNT(*) as canceled_count FROM subscriptions WHERE status = 'canceled' AND canceled_at > datetime('now', '-30 days');
   ```

3. **Monthly**: Revenue analytics
   ```sql
   SELECT SUM(total_revenue_cents) / 100.0 as revenue_usd FROM revenue_analytics WHERE analytics_date > date('now', '-30 days');
   ```

---

## Troubleshooting

### Issue: Migration fails with "table already exists"

**Solution**: Check if migration already ran
```bash
wrangler d1 execute better-together-production --command "SELECT * FROM d1_migrations;"
```

### Issue: Cannot connect to database

**Solution**: Verify binding in wrangler.jsonc
- Ensure `binding = "DB"` matches code references
- Check database_id is correct
- Redeploy application after config changes

### Issue: Stripe webhooks failing

**Solution**:
1. Check webhook secret is configured correctly
2. Verify webhook URL is accessible
3. Check `stripe_webhooks` table for error messages:
   ```sql
   SELECT * FROM stripe_webhooks WHERE processed = 0 ORDER BY created_at DESC LIMIT 10;
   ```

### Issue: Slow queries

**Solution**: Check indexes exist
```bash
wrangler d1 execute better-together-production --command "EXPLAIN QUERY PLAN SELECT * FROM subscriptions WHERE user_id = 'test';"
```

---

## Security Checklist

- [ ] Production D1 database created
- [ ] Database ID added to wrangler.jsonc (not committed to git)
- [ ] Stripe API keys added as secrets (not in code)
- [ ] Webhook signing secret configured
- [ ] All migrations applied successfully
- [ ] Subscription plans seeded
- [ ] Test subscription flow works
- [ ] Backup strategy in place
- [ ] Monitoring alerts configured

---

## Rollback Plan

If deployment fails:

1. **Rollback application code**:
   ```bash
   wrangler pages deployment list
   wrangler pages deployment rollback <deployment-id>
   ```

2. **Database rollback** (if needed):
   - D1 doesn't support automatic rollback
   - Restore from backup: `wrangler d1 execute better-together-production --file=backup.sql`
   - Or manually drop tables and re-run migrations

3. **Emergency**: Switch to previous database
   - Update `database_id` in wrangler.jsonc to previous working DB
   - Redeploy application

---

## Next Steps After Setup

1. **Configure Stripe Products** (see MONETIZATION_STRATEGY.md)
   - Create products in Stripe Dashboard
   - Update `subscription_plans` table with Stripe Price IDs

2. **Setup Analytics** (see DATABASE_ARCHITECTURE.md)
   - Configure event tracking endpoints
   - Setup scheduled analytics aggregation Workers

3. **Email Integration** (blocked on T1 completion)
   - Configure Resend API for transactional emails
   - Setup email templates

4. **Partner Integrations** (future)
   - Add partner tables when ready
   - Configure booking system

---

**Setup Complete! 🎉**

Your Better Together production database is now ready. Tasks T3 (Payments), T4 (Email), and T6 (Analytics) can now proceed.

For questions or issues, refer to:
- DATABASE_ARCHITECTURE.md - Schema documentation
- MONETIZATION_STRATEGY.md - Business model details
- Cloudflare D1 Docs: https://developers.cloudflare.com/d1/
