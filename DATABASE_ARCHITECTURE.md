# Better Together - Database Architecture Documentation

## Overview

Better Together uses **Cloudflare D1** (SQLite-based edge database) for all data persistence. The database schema is organized into three migration files, each focusing on a specific domain.

## Technology Stack

- **Database**: Cloudflare D1 (SQLite on the edge)
- **ORM/Query Builder**: Direct SQL queries via D1 API
- **Migrations**: Wrangler D1 migrations
- **Payment Processing**: Stripe (integrated with database)
- **Analytics**: Custom event tracking system

---

## Schema Overview

### Migration 0001: Core Relationship Platform
**File**: `migrations/0001_initial_relationship_schema.sql`

Core tables for relationship management, user profiles, activities, and relationship tracking.

#### Key Tables:
- **users** - User profiles with love languages and preferences
- **relationships** - Links two users as partners
- **important_dates** - Anniversaries, birthdays, milestones
- **shared_goals** - Relationship goals and challenges
- **daily_checkins** - Daily relationship wellness tracking
- **activities** - Shared activities and date nights
- **communication_log** - Track meaningful conversations
- **challenges** - Relationship building challenges
- **achievements** - Gamification system
- **notifications** - System notifications and reminders
- **relationship_analytics** - Computed relationship health metrics

---

### Migration 0002: Payments & Subscriptions
**File**: `migrations/0002_payment_subscription_schema.sql`

Complete Stripe integration for premium subscriptions, credits, add-ons, and transactions.

#### Key Tables:

##### Subscription Management
- **subscription_plans** - Available subscription tiers
  - `try_it_out` - $30/month per person
  - `better_together` - $240/year ($20/month per person)
  - `premium_plus` - $289/year with surprise box
  - Tracks Stripe Product/Price IDs

- **subscriptions** - Active user subscriptions
  - Links to Stripe Customer and Subscription IDs
  - Supports gifting (with gift messages)
  - Tracks status (active, past_due, canceled, trialing)
  - Stores billing periods and renewal dates

##### Payment Processing
- **payment_transactions** - All payment records
  - Subscription payments
  - Credit purchases
  - Add-on purchases
  - Gifts and refunds
  - Links to Stripe Payment Intent IDs

- **ai_credits** - Credit system for AI actions
  - Purchase, grant, usage, expiration tracking
  - Running balance per relationship
  - Linked to payment transactions

##### Add-ons & Extras
- **subscription_addons** - Available add-ons
  - Surprise boxes ($49/month)
  - Personal coaching sessions
  - Premium features
  - Calendar enhancements

- **user_addons** - Purchased add-ons per user

##### Discounts & Promotions
- **discount_codes** - Promo codes and coupons
  - Percentage or fixed amount discounts
  - Usage limits and expiration dates
  - Stripe Coupon ID integration

- **discount_usage** - Track discount redemptions

##### Financial Operations
- **refunds** - Refund requests and processing
- **stripe_webhooks** - Webhook event log for debugging

---

### Migration 0003: Analytics & Events
**File**: `migrations/0003_analytics_events.sql`

Comprehensive analytics for user behavior, feature usage, revenue tracking, and business intelligence.

#### Key Tables:

##### Event Tracking
- **analytics_events** - All user interactions
  - User actions, feature usage, conversions
  - System events, errors, payments
  - Session tracking with device/browser info

- **page_views** - Page navigation tracking
  - Duration, bounce rate, referrer
  - Device and session correlation

- **user_sessions** - Complete session tracking
  - Entry/exit pages
  - Session duration and engagement
  - Conversion tracking

##### Feature Analytics
- **feature_usage_metrics** - Daily feature statistics
  - Active users, new users, interactions
  - Time spent, completion rates
  - Satisfaction scores

- **engagement_scores** - Daily user engagement
  - Check-ins, activities, messages
  - Feature usage counts
  - Session duration
  - Scoring algorithm (0-100)

##### Business Intelligence
- **revenue_analytics** - Daily revenue aggregations
  - Subscription, credits, add-ons revenue
  - MRR (Monthly Recurring Revenue)
  - ARR (Annual Recurring Revenue)
  - Churn and new subscriptions

- **partner_analytics** - Partner performance metrics
  - Bookings, revenue, commissions
  - Ratings and repeat bookings
  - Cancellation tracking

##### Conversion & Testing
- **conversion_funnels** - Funnel step tracking
  - Sign-up to subscription conversion
  - Feature adoption funnels
  - Drop-off analysis

- **ab_test_variants** - A/B test configurations
- **ab_test_assignments** - User variant assignments

##### User Behavior
- **user_cohorts** - Cohort analysis
  - Sign-up date cohorts
  - Acquisition channel tracking
  - Lifetime value per cohort

- **email_campaign_analytics** - Email performance
  - Open rates, click rates
  - Conversion tracking
  - Campaign ROI

##### System Health
- **error_logs** - Application error tracking
  - Error severity levels
  - Stack traces for debugging
  - Resolution status

---

## Database Design Principles

### 1. Normalization Strategy
- **3NF (Third Normal Form)** for transactional data
- Strategic denormalization for analytics tables
- Computed fields stored in `*_analytics` tables for performance

### 2. Indexing Strategy

#### High-Traffic Query Patterns:
- User lookups by email (unique index)
- Relationship queries by user IDs (composite index)
- Date range queries (created_at, date fields)
- Status filters (active subscriptions, completed activities)
- Foreign key relationships (automatic index on FK)

#### Optimization Techniques:
- Covering indexes for read-heavy queries
- Partial indexes for filtered queries (e.g., active subscriptions only)
- Composite indexes for multi-column WHERE clauses

### 3. Data Integrity

#### Constraints:
- CHECK constraints for enum values
- UNIQUE constraints for external IDs (Stripe IDs, email)
- NOT NULL for required fields
- Foreign key constraints with CASCADE/SET NULL

#### Audit Trail:
- `created_at` timestamp on all tables
- `updated_at` timestamp on mutable tables
- Soft deletes where data retention is required (via status fields)

### 4. JSON Storage
- Use TEXT columns for JSON data
- Store flexible/dynamic data (event_data, metadata, features)
- Keep structured data in columns for queryability

---

## Performance Optimization

### Query Patterns

#### 1. User Dashboard Load
```sql
-- Optimized with indexes on relationship_id and date fields
SELECT * FROM daily_checkins
WHERE relationship_id = ?
ORDER BY checkin_date DESC
LIMIT 7;
```

#### 2. Subscription Status Check
```sql
-- Indexed on user_id and status
SELECT * FROM subscriptions
WHERE user_id = ?
  AND status = 'active'
  AND current_period_end > CURRENT_TIMESTAMP;
```

#### 3. Analytics Aggregation
```sql
-- Pre-computed daily rollups
SELECT * FROM revenue_analytics
WHERE analytics_date BETWEEN ? AND ?;
```

### Caching Strategy
- **Edge caching**: User profiles, relationship data (5 min TTL)
- **Application caching**: Analytics aggregations (15 min TTL)
- **No caching**: Real-time data (payments, check-ins)

### Batch Operations
- Daily analytics computation (scheduled Workers)
- Weekly cohort analysis
- Monthly revenue reports

---

## Scalability Considerations

### Current Capacity
- D1 database: 10GB storage limit
- 100K writes/day per database
- Unlimited reads with edge replication

### Growth Strategy
- **Phase 1** (0-10K users): Single D1 database
- **Phase 2** (10K-100K users): Read replicas via D1 replication
- **Phase 3** (100K+ users): Sharding by relationship_id

### Hot Data vs Cold Data
- **Hot**: Last 90 days of events, active subscriptions
- **Warm**: 90-365 days, accessible but slower
- **Cold**: 1+ year, archived to R2 storage

---

## Security & Compliance

### Data Protection
- PII stored with encryption at rest (Cloudflare default)
- Payment data stored only as Stripe references (PCI compliant)
- No raw credit card data stored

### Access Control
- Row-level security via application logic
- Users can only access their own relationship data
- Admin access logged in audit trail

### Data Retention
- User data: Retained until account deletion
- Analytics events: 2 years rolling window
- Payment transactions: 7 years (compliance requirement)
- Error logs: 90 days

---

## Migration Management

### Running Migrations

#### Local Development:
```bash
npm run db:migrate:local
```

#### Production:
```bash
npm run db:migrate:prod
```

### Migration Best Practices
1. **Never modify existing migrations** - Create new ones
2. **Test locally first** - Always run on local D1 before prod
3. **Backward compatible** - Ensure old code works during migration
4. **Rollback plan** - Document reversal steps for each migration

### Zero-Downtime Migrations
1. Add new columns/tables (non-breaking)
2. Deploy application code that writes to both old and new
3. Backfill data if needed
4. Deploy code that reads from new schema
5. Remove old columns/tables in future migration

---

## Monitoring & Observability

### Key Metrics to Track

#### Database Health:
- Query latency (p50, p95, p99)
- Error rates per table
- Storage utilization
- Connection pool usage

#### Business Metrics:
- Daily Active Users (DAU)
- Monthly Recurring Revenue (MRR)
- Subscription churn rate
- Feature adoption rates

### Alerting Thresholds
- Query latency > 500ms (P95)
- Error rate > 1%
- Failed payment rate > 5%
- Database storage > 80% capacity

---

## API Integration Points

### Stripe Webhooks
Handled by `stripe_webhooks` table:
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `charge.refunded`

### Analytics Events
Track via `analytics_events` table:
- User sign-up
- Subscription purchase
- Feature usage
- Goal completion
- Activity creation
- Check-in submission

---

## Future Enhancements

### Planned Features (Q1-Q2)
1. **Partner Integrations** - Restaurant/activity booking tables
2. **Social Features** - Friend relationships, public profiles
3. **Content Library** - Courses, guides, challenges (CMS tables)
4. **Advanced Analytics** - ML predictions, recommendation engine

### Schema Evolution Strategy
- Maintain backwards compatibility for 2 major versions
- Deprecation notices for 30 days before removal
- Version API endpoints to support old clients

---

## Quick Reference

### Connection String
```typescript
// In Cloudflare Workers
const db = env.DB;
const result = await db.prepare("SELECT * FROM users WHERE id = ?").bind(userId).first();
```

### Environment Variables
```
DB - D1 Database binding (configured in wrangler.jsonc)
STRIPE_SECRET_KEY - Stripe API key
STRIPE_WEBHOOK_SECRET - Webhook signing secret
```

### Important NPM Scripts
```bash
npm run db:migrate:local   # Apply migrations locally
npm run db:migrate:prod    # Apply migrations to production
npm run db:seed            # Seed local database
npm run db:reset           # Reset local database
npm run db:console:local   # SQL console for local DB
npm run db:console:prod    # SQL console for production DB
```

---

## Support & Troubleshooting

### Common Issues

**Migration fails with "table already exists"**
- Check if migration already ran: `SELECT * FROM d1_migrations;`
- Use `IF NOT EXISTS` in CREATE TABLE statements

**Slow queries**
- Run `EXPLAIN QUERY PLAN` to check index usage
- Add indexes on commonly queried columns
- Consider denormalization for read-heavy tables

**Foreign key constraint violations**
- Ensure parent records exist before inserting children
- Use transactions for multi-table inserts
- Check cascade rules on deletions

### Getting Help
- Documentation: https://developers.cloudflare.com/d1/
- Schema questions: Review this document
- Migration issues: Check `migrations/` folder for examples

---

**Last Updated**: 2025-12-17
**Schema Version**: 3 migrations (0001-0003)
**Database Engine**: Cloudflare D1 (SQLite 3.x)
