# D1 Database - Quick Start Guide

## One-Command Setup

```bash
# Set your Cloudflare API token
export CLOUDFLARE_API_TOKEN="your-token-here"

# Run the automated setup script
./scripts/init-production-db.sh
```

That's it! The script will:
1. Create the production D1 database
2. Update wrangler.jsonc with the database ID
3. Run all migrations
4. Seed subscription plans and challenges
5. Verify the setup

## Manual Setup (Step-by-Step)

### 1. Create Database

```bash
npx wrangler d1 create better-together-production
```

Copy the `database_id` from the output.

### 2. Update Configuration

Edit `wrangler.jsonc` and replace the `database_id`:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "better-together-production",
      "database_id": "YOUR_DATABASE_ID_HERE"
    }
  ]
}
```

### 3. Run Migrations

```bash
npm run db:migrate:prod
```

### 4. Verify Setup

```bash
./scripts/verify-database.sh better-together-production production
```

## Database Overview

### 43 Tables Across 3 Migrations

**Core Relationship Platform** (0001):
- users, relationships, daily_checkins, activities
- challenges, achievements, shared_goals
- 14 core tables for relationship management

**Payments & Subscriptions** (0002):
- subscription_plans, subscriptions, payment_transactions
- ai_credits, stripe_webhooks, refunds
- 10 tables for Stripe integration

**Analytics & Events** (0003):
- analytics_events, page_views, user_sessions
- revenue_analytics, engagement_scores, conversion_funnels
- 19 tables for comprehensive analytics

## Subscription Plans

| Plan | Price | Billing | Features |
|------|-------|---------|----------|
| Try It Out | $30/month | Monthly | Essential AI Coach, Basic Challenges |
| Better Together | $240/year | Annual | Full platform + $50 credits |
| Premium Plus | $289/year | Annual | Everything + Monthly Surprise Box |

## Useful Commands

```bash
# Check database status
npx wrangler d1 info better-together-production

# Run SQL query
npx wrangler d1 execute better-together-production \
  --command "SELECT COUNT(*) FROM users"

# Interactive SQL console
npx wrangler d1 execute better-together-production

# Export backup
npx wrangler d1 export better-together-production \
  --output=backup.sql

# Verify all tables
./scripts/verify-database.sh
```

## Next Steps

After database setup:

1. **Configure Stripe**
   ```bash
   npx wrangler secret put STRIPE_SECRET_KEY
   npx wrangler secret put STRIPE_WEBHOOK_SECRET
   ```

2. **Deploy Application**
   ```bash
   npm run build
   npm run deploy:prod
   ```

3. **Setup Stripe Webhook**
   - URL: `https://better-together.pages.dev/api/webhooks/stripe`
   - Events: subscription.*, invoice.*, charge.refunded

4. **Test Subscription Flow**
   - Create test user
   - Purchase subscription
   - Verify webhook processing

## Troubleshooting

**Database not found?**
```bash
npx wrangler d1 list
```

**Migrations failing?**
```bash
# Check migration status
npx wrangler d1 execute better-together-production \
  --command "SELECT * FROM d1_migrations"
```

**Need to reset local database?**
```bash
npm run db:reset
```

## Documentation

- **Detailed Setup**: `D1_SETUP_INSTRUCTIONS.md`
- **Schema Reference**: `DATABASE_ARCHITECTURE.md`
- **Business Model**: `MONETIZATION_STRATEGY.md`

## Support

- Cloudflare D1: https://developers.cloudflare.com/d1/
- Wrangler CLI: https://developers.cloudflare.com/workers/wrangler/
- Better Together: See project README

---

**Ready to go!** Your production database is set up and ready for deployment.
