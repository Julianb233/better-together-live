-- Better Together: Analytics Events Schema
-- Comprehensive event tracking for user behavior, feature usage, and business metrics

-- Analytics Events table - Track all user interactions and system events
CREATE TABLE IF NOT EXISTS analytics_events (
  id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_category TEXT NOT NULL CHECK(event_category IN ('user_action', 'feature_usage', 'conversion', 'engagement', 'system', 'error', 'payment', 'partner')),
  user_id TEXT,
  relationship_id TEXT,
  session_id TEXT,
  event_data TEXT, -- JSON with event-specific data
  page_url TEXT,
  referrer_url TEXT,
  device_type TEXT CHECK(device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE SET NULL
);

-- Page Views table - Track page navigation
CREATE TABLE IF NOT EXISTS page_views (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  relationship_id TEXT,
  session_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  duration_seconds INTEGER,
  bounce BOOLEAN DEFAULT FALSE,
  device_type TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE SET NULL
);

-- User Sessions table - Track user sessions
CREATE TABLE IF NOT EXISTS user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  relationship_id TEXT,
  session_start TIMESTAMPTZ NOT NULL,
  session_end TIMESTAMPTZ,
  duration_seconds INTEGER,
  pages_viewed INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  device_type TEXT,
  browser TEXT,
  os TEXT,
  ip_address TEXT,
  entry_page TEXT,
  exit_page TEXT,
  converted BOOLEAN DEFAULT FALSE,
  conversion_value_cents INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE SET NULL
);

-- Feature Usage Metrics table - Aggregate feature usage statistics
CREATE TABLE IF NOT EXISTS feature_usage_metrics (
  id TEXT PRIMARY KEY,
  feature_name TEXT NOT NULL,
  metric_date DATE NOT NULL,
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  total_interactions INTEGER DEFAULT 0,
  average_time_spent_seconds DECIMAL(10,2),
  completion_rate DECIMAL(5,2), -- Percentage
  satisfaction_score DECIMAL(3,2), -- 1-5 rating
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(feature_name, metric_date)
);

-- Conversion Funnels table - Track conversion funnel progress
CREATE TABLE IF NOT EXISTS conversion_funnels (
  id TEXT PRIMARY KEY,
  funnel_name TEXT NOT NULL,
  user_id TEXT,
  relationship_id TEXT,
  session_id TEXT,
  step_name TEXT NOT NULL,
  step_order INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  dropped_off BOOLEAN DEFAULT FALSE,
  time_to_complete_seconds INTEGER,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE SET NULL
);

-- A/B Test Variants table - Track experiments
CREATE TABLE IF NOT EXISTS ab_test_variants (
  id TEXT PRIMARY KEY,
  test_name TEXT NOT NULL,
  variant_name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  traffic_percentage INTEGER DEFAULT 50 CHECK(traffic_percentage BETWEEN 0 AND 100),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(test_name, variant_name)
);

-- A/B Test Assignments table - Track user assignments to variants
CREATE TABLE IF NOT EXISTS ab_test_assignments (
  id TEXT PRIMARY KEY,
  test_name TEXT NOT NULL,
  variant_id TEXT NOT NULL,
  user_id TEXT,
  relationship_id TEXT,
  session_id TEXT,
  assigned_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  converted BOOLEAN DEFAULT FALSE,
  conversion_value_cents INTEGER,
  FOREIGN KEY (variant_id) REFERENCES ab_test_variants(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE SET NULL
);

-- Revenue Analytics table - Daily revenue aggregations
CREATE TABLE IF NOT EXISTS revenue_analytics (
  id TEXT PRIMARY KEY,
  analytics_date DATE NOT NULL UNIQUE,
  subscription_revenue_cents INTEGER DEFAULT 0,
  credits_revenue_cents INTEGER DEFAULT 0,
  addons_revenue_cents INTEGER DEFAULT 0,
  gift_revenue_cents INTEGER DEFAULT 0,
  total_revenue_cents INTEGER DEFAULT 0,
  new_subscriptions INTEGER DEFAULT 0,
  canceled_subscriptions INTEGER DEFAULT 0,
  refunds_cents INTEGER DEFAULT 0,
  mrr_cents INTEGER DEFAULT 0, -- Monthly Recurring Revenue
  arr_cents INTEGER DEFAULT 0, -- Annual Recurring Revenue
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User Cohorts table - Track user cohorts for retention analysis
CREATE TABLE IF NOT EXISTS user_cohorts (
  id TEXT PRIMARY KEY,
  cohort_name TEXT NOT NULL,
  cohort_date DATE NOT NULL,
  user_id TEXT NOT NULL,
  relationship_id TEXT,
  joined_via TEXT CHECK(joined_via IN ('organic', 'referral', 'paid_ad', 'social', 'partner', 'gift')),
  first_subscription_date DATE,
  total_revenue_cents INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE SET NULL
);

-- Engagement Scores table - Daily engagement scoring
CREATE TABLE IF NOT EXISTS engagement_scores (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  relationship_id TEXT NOT NULL,
  score_date DATE NOT NULL,
  engagement_score INTEGER CHECK(engagement_score BETWEEN 0 AND 100),
  checkin_completed BOOLEAN DEFAULT FALSE,
  activities_logged INTEGER DEFAULT 0,
  messages_sent INTEGER DEFAULT 0,
  features_used INTEGER DEFAULT 0,
  session_duration_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
  UNIQUE(user_id, score_date)
);

-- Partner Analytics table - Track partner performance metrics
CREATE TABLE IF NOT EXISTS partner_analytics (
  id TEXT PRIMARY KEY,
  partner_name TEXT NOT NULL,
  partner_category TEXT NOT NULL,
  analytics_date DATE NOT NULL,
  total_bookings INTEGER DEFAULT 0,
  total_revenue_cents INTEGER DEFAULT 0,
  commission_cents INTEGER DEFAULT 0,
  average_rating DECIMAL(3,2),
  repeat_bookings INTEGER DEFAULT 0,
  cancellations INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(partner_name, analytics_date)
);

-- Error Logs table - Track application errors for debugging
CREATE TABLE IF NOT EXISTS error_logs (
  id TEXT PRIMARY KEY,
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  user_id TEXT,
  relationship_id TEXT,
  session_id TEXT,
  page_url TEXT,
  user_agent TEXT,
  severity TEXT CHECK(severity IN ('low', 'medium', 'high', 'critical')),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE SET NULL
);

-- Email Campaign Analytics table - Track email performance
CREATE TABLE IF NOT EXISTS email_campaign_analytics (
  id TEXT PRIMARY KEY,
  campaign_name TEXT NOT NULL,
  campaign_type TEXT CHECK(campaign_type IN ('welcome', 'engagement', 'retention', 'promotional', 'transactional')),
  sent_date DATE NOT NULL,
  total_sent INTEGER DEFAULT 0,
  total_delivered INTEGER DEFAULT 0,
  total_opened INTEGER DEFAULT 0,
  total_clicked INTEGER DEFAULT 0,
  total_bounced INTEGER DEFAULT 0,
  total_unsubscribed INTEGER DEFAULT 0,
  open_rate DECIMAL(5,2),
  click_rate DECIMAL(5,2),
  conversion_count INTEGER DEFAULT 0,
  conversion_value_cents INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for analytics tables
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_relationship ON analytics_events(relationship_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON analytics_events(created_at);

CREATE INDEX IF NOT EXISTS idx_page_views_user ON page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views(page_path);
CREATE INDEX IF NOT EXISTS idx_page_views_created ON page_views(created_at);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_relationship ON user_sessions(relationship_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_start ON user_sessions(session_start);
CREATE INDEX IF NOT EXISTS idx_user_sessions_converted ON user_sessions(converted);

CREATE INDEX IF NOT EXISTS idx_feature_usage_metrics_feature ON feature_usage_metrics(feature_name);
CREATE INDEX IF NOT EXISTS idx_feature_usage_metrics_date ON feature_usage_metrics(metric_date);

CREATE INDEX IF NOT EXISTS idx_conversion_funnels_funnel ON conversion_funnels(funnel_name);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_user ON conversion_funnels(user_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_session ON conversion_funnels(session_id);
CREATE INDEX IF NOT EXISTS idx_conversion_funnels_step ON conversion_funnels(step_order);

CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_test ON ab_test_assignments(test_name);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_user ON ab_test_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_ab_test_assignments_converted ON ab_test_assignments(converted);

CREATE INDEX IF NOT EXISTS idx_revenue_analytics_date ON revenue_analytics(analytics_date);

CREATE INDEX IF NOT EXISTS idx_user_cohorts_date ON user_cohorts(cohort_date);
CREATE INDEX IF NOT EXISTS idx_user_cohorts_user ON user_cohorts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cohorts_active ON user_cohorts(is_active);

CREATE INDEX IF NOT EXISTS idx_engagement_scores_user ON engagement_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_engagement_scores_relationship ON engagement_scores(relationship_id);
CREATE INDEX IF NOT EXISTS idx_engagement_scores_date ON engagement_scores(score_date);

CREATE INDEX IF NOT EXISTS idx_partner_analytics_partner ON partner_analytics(partner_name);
CREATE INDEX IF NOT EXISTS idx_partner_analytics_date ON partner_analytics(analytics_date);

CREATE INDEX IF NOT EXISTS idx_error_logs_severity ON error_logs(severity);
CREATE INDEX IF NOT EXISTS idx_error_logs_resolved ON error_logs(resolved);
CREATE INDEX IF NOT EXISTS idx_error_logs_created ON error_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_email_campaign_analytics_name ON email_campaign_analytics(campaign_name);
CREATE INDEX IF NOT EXISTS idx_email_campaign_analytics_date ON email_campaign_analytics(sent_date);
