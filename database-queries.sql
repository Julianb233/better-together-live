-- Better Together: Common Database Queries
-- Quick reference for frequently used queries

-- ============================================
-- USER & RELATIONSHIP QUERIES
-- ============================================

-- Get user with their relationship
SELECT
  u.*,
  r.id as relationship_id,
  r.relationship_type,
  r.start_date,
  r.status as relationship_status
FROM users u
LEFT JOIN relationships r ON (u.id = r.user_1_id OR u.id = r.user_2_id)
WHERE u.id = ?;

-- Get partner for a user
SELECT u2.*
FROM users u1
JOIN relationships r ON (u1.id = r.user_1_id OR u1.id = r.user_2_id)
JOIN users u2 ON (
  CASE
    WHEN r.user_1_id = u1.id THEN r.user_2_id = u2.id
    ELSE r.user_1_id = u2.id
  END
)
WHERE u1.id = ?;

-- Get relationship details with both partners
SELECT
  r.*,
  u1.name as user_1_name,
  u1.email as user_1_email,
  u2.name as user_2_name,
  u2.email as user_2_email,
  julianday('now') - julianday(r.start_date) as days_together
FROM relationships r
JOIN users u1 ON r.user_1_id = u1.id
JOIN users u2 ON r.user_2_id = u2.id
WHERE r.id = ?;

-- ============================================
-- SUBSCRIPTION & PAYMENT QUERIES
-- ============================================

-- Get active subscription for user
SELECT
  s.*,
  sp.plan_name,
  sp.plan_type,
  sp.features
FROM subscriptions s
JOIN subscription_plans sp ON s.plan_id = sp.id
WHERE s.user_id = ?
  AND s.status = 'active'
  AND s.current_period_end > datetime('now');

-- Get subscription with payment history
SELECT
  s.id,
  s.status,
  s.current_period_end,
  COUNT(pt.id) as total_payments,
  SUM(pt.amount_cents) / 100.0 as total_paid_usd,
  MAX(pt.created_at) as last_payment_date
FROM subscriptions s
LEFT JOIN payment_transactions pt ON s.id = pt.subscription_id
WHERE s.id = ?
GROUP BY s.id;

-- Get user's credit balance
SELECT
  relationship_id,
  user_id,
  SUM(credits_amount) as total_credits_balance
FROM ai_credits
WHERE relationship_id = ? AND user_id = ?
GROUP BY relationship_id, user_id;

-- Get recent transactions for user
SELECT
  pt.*,
  CASE
    WHEN pt.transaction_type = 'subscription' THEN sp.plan_name
    ELSE pt.description
  END as item_description
FROM payment_transactions pt
LEFT JOIN subscriptions s ON pt.subscription_id = s.id
LEFT JOIN subscription_plans sp ON s.plan_id = sp.id
WHERE pt.user_id = ?
ORDER BY pt.created_at DESC
LIMIT 10;

-- Calculate Monthly Recurring Revenue (MRR)
SELECT
  COUNT(*) as active_subscriptions,
  SUM(CASE WHEN billing_period = 'monthly' THEN price_cents ELSE price_cents / 12 END) / 100.0 as mrr_usd
FROM subscriptions
WHERE status = 'active'
  AND current_period_end > datetime('now');

-- Calculate churn rate (last 30 days)
SELECT
  COUNT(CASE WHEN status = 'canceled' AND canceled_at > datetime('now', '-30 days') THEN 1 END) as canceled_count,
  COUNT(*) as total_subscriptions,
  ROUND(
    (COUNT(CASE WHEN status = 'canceled' AND canceled_at > datetime('now', '-30 days') THEN 1 END) * 100.0) /
    COUNT(*),
    2
  ) as churn_rate_percentage
FROM subscriptions
WHERE created_at < datetime('now', '-30 days');

-- ============================================
-- ANALYTICS QUERIES
-- ============================================

-- Daily Active Users (last 7 days)
SELECT
  date(created_at) as date,
  COUNT(DISTINCT user_id) as dau
FROM analytics_events
WHERE created_at > datetime('now', '-7 days')
GROUP BY date(created_at)
ORDER BY date DESC;

-- Feature usage stats (last 30 days)
SELECT
  event_name,
  COUNT(*) as event_count,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as unique_sessions
FROM analytics_events
WHERE event_category = 'feature_usage'
  AND created_at > datetime('now', '-30 days')
GROUP BY event_name
ORDER BY event_count DESC;

-- User engagement score (today)
SELECT
  u.name,
  es.engagement_score,
  es.checkin_completed,
  es.activities_logged,
  es.features_used,
  es.session_duration_seconds / 60.0 as session_minutes
FROM engagement_scores es
JOIN users u ON es.user_id = u.id
WHERE es.score_date = date('now')
ORDER BY es.engagement_score DESC
LIMIT 10;

-- Conversion funnel analysis
SELECT
  funnel_name,
  step_name,
  COUNT(*) as users_reached,
  SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) as users_completed,
  ROUND(
    (SUM(CASE WHEN completed = 1 THEN 1 ELSE 0 END) * 100.0) / COUNT(*),
    2
  ) as completion_rate_percentage
FROM conversion_funnels
WHERE created_at > datetime('now', '-30 days')
GROUP BY funnel_name, step_name, step_order
ORDER BY funnel_name, step_order;

-- Revenue breakdown (last 30 days)
SELECT
  SUM(subscription_revenue_cents) / 100.0 as subscription_revenue_usd,
  SUM(credits_revenue_cents) / 100.0 as credits_revenue_usd,
  SUM(addons_revenue_cents) / 100.0 as addons_revenue_usd,
  SUM(total_revenue_cents) / 100.0 as total_revenue_usd,
  AVG(mrr_cents) / 100.0 as avg_mrr_usd
FROM revenue_analytics
WHERE analytics_date > date('now', '-30 days');

-- ============================================
-- RELATIONSHIP ACTIVITY QUERIES
-- ============================================

-- Get dashboard data for relationship
SELECT
  -- Recent check-ins
  (SELECT COUNT(*) FROM daily_checkins WHERE relationship_id = ? AND checkin_date > date('now', '-7 days')) as checkins_this_week,

  -- Upcoming dates
  (SELECT COUNT(*) FROM important_dates WHERE relationship_id = ? AND date_value > date('now')) as upcoming_dates,

  -- Active goals
  (SELECT COUNT(*) FROM shared_goals WHERE relationship_id = ? AND status = 'active') as active_goals,

  -- Activities this month
  (SELECT COUNT(*) FROM activities WHERE relationship_id = ? AND completed_date > date('now', 'start of month')) as activities_this_month,

  -- Check-in streak
  (SELECT checkin_streak FROM relationship_analytics WHERE relationship_id = ? ORDER BY analytics_date DESC LIMIT 1) as current_streak;

-- Get recent check-ins with both partners
SELECT
  dc.checkin_date,
  dc.connection_score,
  dc.mood_score,
  dc.relationship_satisfaction,
  dc.gratitude_note,
  u.name as checked_in_by
FROM daily_checkins dc
JOIN users u ON dc.user_id = u.id
WHERE dc.relationship_id = ?
ORDER BY dc.checkin_date DESC
LIMIT 14;

-- Get upcoming important dates
SELECT
  id.date_value,
  id.event_name,
  id.event_type,
  id.description,
  julianday(id.date_value) - julianday('now') as days_until,
  u.name as created_by
FROM important_dates id
JOIN users u ON id.created_by_user_id = u.id
WHERE id.relationship_id = ?
  AND id.date_value >= date('now')
ORDER BY id.date_value ASC
LIMIT 10;

-- Get active goals with progress
SELECT
  sg.goal_name,
  sg.goal_type,
  sg.target_count,
  sg.current_progress,
  sg.target_date,
  ROUND((sg.current_progress * 100.0) / sg.target_count, 1) as progress_percentage,
  u.name as created_by
FROM shared_goals sg
JOIN users u ON sg.created_by_user_id = u.id
WHERE sg.relationship_id = ?
  AND sg.status = 'active'
ORDER BY sg.created_at DESC;

-- Get recent activities with ratings
SELECT
  a.activity_name,
  a.activity_type,
  a.completed_date,
  a.duration_minutes,
  a.location,
  (a.satisfaction_rating_user1 + a.satisfaction_rating_user2) / 2.0 as avg_rating,
  a.notes
FROM activities a
WHERE a.relationship_id = ?
  AND a.status = 'completed'
ORDER BY a.completed_date DESC
LIMIT 10;

-- ============================================
-- ADMIN & MONITORING QUERIES
-- ============================================

-- System health overview
SELECT
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM relationships WHERE status = 'active') as active_relationships,
  (SELECT COUNT(*) FROM subscriptions WHERE status = 'active') as active_subscriptions,
  (SELECT COUNT(*) FROM analytics_events WHERE created_at > datetime('now', '-1 hour')) as events_last_hour,
  (SELECT COUNT(*) FROM error_logs WHERE severity = 'critical' AND resolved = 0) as critical_errors;

-- Recent errors
SELECT
  error_type,
  error_message,
  severity,
  COUNT(*) as occurrence_count,
  MAX(created_at) as last_occurred
FROM error_logs
WHERE created_at > datetime('now', '-24 hours')
GROUP BY error_type, error_message, severity
ORDER BY occurrence_count DESC
LIMIT 10;

-- Unprocessed Stripe webhooks
SELECT
  event_type,
  COUNT(*) as pending_count,
  MIN(created_at) as oldest_event,
  MAX(retry_count) as max_retries
FROM stripe_webhooks
WHERE processed = 0
GROUP BY event_type
ORDER BY pending_count DESC;

-- User cohort retention (30-day)
SELECT
  cohort_date,
  COUNT(*) as cohort_size,
  SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as still_active,
  ROUND(
    (SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) * 100.0) / COUNT(*),
    2
  ) as retention_rate_percentage
FROM user_cohorts
WHERE cohort_date > date('now', '-90 days')
GROUP BY cohort_date
ORDER BY cohort_date DESC;

-- Top spending users
SELECT
  u.name,
  u.email,
  COUNT(DISTINCT pt.id) as transaction_count,
  SUM(pt.amount_cents) / 100.0 as lifetime_value_usd,
  MAX(pt.created_at) as last_transaction
FROM users u
JOIN payment_transactions pt ON u.id = pt.user_id
WHERE pt.status = 'succeeded'
GROUP BY u.id
ORDER BY lifetime_value_usd DESC
LIMIT 20;

-- ============================================
-- DATA CLEANUP QUERIES (Use with caution!)
-- ============================================

-- Delete old analytics events (older than 2 years)
-- DELETE FROM analytics_events WHERE created_at < datetime('now', '-2 years');

-- Delete processed webhook logs (older than 90 days)
-- DELETE FROM stripe_webhooks WHERE processed = 1 AND created_at < datetime('now', '-90 days');

-- Delete resolved error logs (older than 90 days)
-- DELETE FROM error_logs WHERE resolved = 1 AND created_at < datetime('now', '-90 days');

-- Archive old page views (older than 1 year)
-- DELETE FROM page_views WHERE created_at < datetime('now', '-1 year');

-- ============================================
-- PERFORMANCE ANALYSIS
-- ============================================

-- Table sizes (row counts)
SELECT
  'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'relationships', COUNT(*) FROM relationships
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions
UNION ALL
SELECT 'payment_transactions', COUNT(*) FROM payment_transactions
UNION ALL
SELECT 'analytics_events', COUNT(*) FROM analytics_events
UNION ALL
SELECT 'page_views', COUNT(*) FROM page_views
UNION ALL
SELECT 'daily_checkins', COUNT(*) FROM daily_checkins
UNION ALL
SELECT 'activities', COUNT(*) FROM activities
ORDER BY row_count DESC;

-- Index usage (requires EXPLAIN QUERY PLAN on specific queries)
-- Example:
-- EXPLAIN QUERY PLAN SELECT * FROM subscriptions WHERE user_id = 'test' AND status = 'active';

-- Check for missing indexes (tables without indexes on foreign keys)
SELECT
  m.name as table_name,
  COUNT(DISTINCT ii.name) as index_count
FROM sqlite_master m
LEFT JOIN sqlite_master ii ON ii.tbl_name = m.name AND ii.type = 'index'
WHERE m.type = 'table'
  AND m.name NOT LIKE 'sqlite_%'
GROUP BY m.name
HAVING index_count < 2
ORDER BY index_count ASC;
