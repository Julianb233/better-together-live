/**
 * Better Together - PostgreSQL Migration Script
 *
 * Run this script to create all database tables in Neon PostgreSQL.
 * Usage: DATABASE_URL=your_connection_string node scripts/migrate.js
 */

import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is required');
  process.exit(1);
}

const sql = neon(DATABASE_URL);

// Drop and recreate tables for fresh start
const dropTables = [
  `DROP TABLE IF EXISTS push_notification_logs CASCADE`,
  `DROP TABLE IF EXISTS device_tokens CASCADE`,
  `DROP TABLE IF EXISTS analytics_events CASCADE`,
  `DROP TABLE IF EXISTS partner_invitations CASCADE`,
  `DROP TABLE IF EXISTS payment_transactions CASCADE`,
  `DROP TABLE IF EXISTS subscriptions CASCADE`,
  `DROP TABLE IF EXISTS subscription_plans CASCADE`,
  `DROP TABLE IF EXISTS relationship_analytics CASCADE`,
  `DROP TABLE IF EXISTS notifications CASCADE`,
  `DROP TABLE IF EXISTS user_achievements CASCADE`,
  `DROP TABLE IF EXISTS achievements CASCADE`,
  `DROP TABLE IF EXISTS challenge_entries CASCADE`,
  `DROP TABLE IF EXISTS challenge_participation CASCADE`,
  `DROP TABLE IF EXISTS challenges CASCADE`,
  `DROP TABLE IF EXISTS communication_log CASCADE`,
  `DROP TABLE IF EXISTS activities CASCADE`,
  `DROP TABLE IF EXISTS daily_checkins CASCADE`,
  `DROP TABLE IF EXISTS shared_goals CASCADE`,
  `DROP TABLE IF EXISTS important_dates CASCADE`,
  `DROP TABLE IF EXISTS relationships CASCADE`,
  `DROP TABLE IF EXISTS users CASCADE`,
];

const migrations = [
  // Users table - Use users to avoid conflict with existing users table
  `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    nickname TEXT,
    profile_photo_url TEXT,
    phone_number TEXT,
    timezone TEXT DEFAULT 'UTC',
    love_language_primary TEXT CHECK(love_language_primary IN ('words_of_affirmation', 'quality_time', 'physical_touch', 'acts_of_service', 'receiving_gifts')),
    love_language_secondary TEXT CHECK(love_language_secondary IN ('words_of_affirmation', 'quality_time', 'physical_touch', 'acts_of_service', 'receiving_gifts')),
    relationship_preferences TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS relationships (
    id TEXT PRIMARY KEY,
    user_1_id TEXT NOT NULL,
    user_2_id TEXT NOT NULL,
    relationship_type TEXT DEFAULT 'dating' CHECK(relationship_type IN ('dating', 'engaged', 'married', 'partnership')),
    start_date DATE,
    anniversary_date DATE,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paused', 'ended')),
    privacy_level TEXT DEFAULT 'private' CHECK(privacy_level IN ('private', 'friends', 'public')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_1_id, user_2_id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS important_dates (
    id TEXT PRIMARY KEY,
    relationship_id TEXT NOT NULL,
    date_value DATE NOT NULL,
    event_name TEXT NOT NULL,
    event_type TEXT CHECK(event_type IN ('anniversary', 'milestone', 'birthday', 'holiday', 'custom')),
    description TEXT,
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern TEXT,
    reminder_days_before INTEGER DEFAULT 7,
    created_by_user_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS shared_goals (
    id TEXT PRIMARY KEY,
    relationship_id TEXT NOT NULL,
    goal_name TEXT NOT NULL,
    goal_description TEXT,
    goal_type TEXT CHECK(goal_type IN ('weekly', 'monthly', 'milestone', 'custom')),
    target_count INTEGER,
    current_progress INTEGER DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'paused', 'cancelled')),
    start_date DATE,
    target_date DATE,
    completion_date DATE,
    created_by_user_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS daily_checkins (
    id TEXT PRIMARY KEY,
    relationship_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    checkin_date DATE NOT NULL,
    connection_score INTEGER CHECK(connection_score BETWEEN 1 AND 10),
    mood_score INTEGER CHECK(mood_score BETWEEN 1 AND 10),
    relationship_satisfaction INTEGER CHECK(relationship_satisfaction BETWEEN 1 AND 10),
    gratitude_note TEXT,
    support_needed TEXT,
    highlight_of_day TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(relationship_id, user_id, checkin_date)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS activities (
    id TEXT PRIMARY KEY,
    relationship_id TEXT NOT NULL,
    activity_name TEXT NOT NULL,
    activity_type TEXT CHECK(activity_type IN ('date_night', 'quality_time', 'adventure', 'relaxation', 'learning', 'exercise', 'social', 'custom')),
    description TEXT,
    location TEXT,
    planned_date TIMESTAMP,
    completed_date TIMESTAMP,
    duration_minutes INTEGER,
    cost_amount NUMERIC(10,2),
    satisfaction_rating_user1 INTEGER CHECK(satisfaction_rating_user1 BETWEEN 1 AND 10),
    satisfaction_rating_user2 INTEGER CHECK(satisfaction_rating_user2 BETWEEN 1 AND 10),
    notes TEXT,
    photos TEXT,
    status TEXT DEFAULT 'planned' CHECK(status IN ('planned', 'completed', 'cancelled')),
    created_by_user_id TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS communication_log (
    id TEXT PRIMARY KEY,
    relationship_id TEXT NOT NULL,
    communication_type TEXT CHECK(communication_type IN ('deep_talk', 'conflict_resolution', 'planning', 'appreciation', 'check_in', 'custom')),
    topic TEXT,
    description TEXT,
    outcome TEXT CHECK(outcome IN ('positive', 'neutral', 'needs_follow_up')),
    duration_minutes INTEGER,
    initiated_by_user_id TEXT NOT NULL,
    communication_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    follow_up_needed BOOLEAN DEFAULT FALSE,
    follow_up_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS challenges (
    id TEXT PRIMARY KEY,
    challenge_name TEXT NOT NULL,
    challenge_description TEXT,
    challenge_type TEXT CHECK(challenge_type IN ('daily', 'weekly', 'monthly', 'milestone')),
    duration_days INTEGER,
    difficulty_level TEXT CHECK(difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    category TEXT CHECK(category IN ('communication', 'intimacy', 'adventure', 'gratitude', 'quality_time', 'support')),
    instructions TEXT,
    is_template BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS challenge_participation (
    id TEXT PRIMARY KEY,
    relationship_id TEXT NOT NULL,
    challenge_id TEXT NOT NULL,
    start_date DATE NOT NULL,
    target_end_date DATE,
    actual_end_date DATE,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'paused', 'abandoned')),
    progress_percentage INTEGER DEFAULT 0 CHECK(progress_percentage BETWEEN 0 AND 100),
    completion_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(relationship_id, challenge_id, start_date)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS challenge_entries (
    id TEXT PRIMARY KEY,
    participation_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    entry_date DATE NOT NULL,
    entry_content TEXT,
    reflection TEXT,
    completion_status BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(participation_id, user_id, entry_date)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS achievements (
    id TEXT PRIMARY KEY,
    achievement_name TEXT NOT NULL,
    achievement_description TEXT,
    achievement_type TEXT CHECK(achievement_type IN ('milestone', 'streak', 'completion', 'special')),
    category TEXT CHECK(category IN ('communication', 'activities', 'goals', 'challenges', 'consistency')),
    icon_url TEXT,
    requirements TEXT,
    point_value INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS user_achievements (
    id TEXT PRIMARY KEY,
    relationship_id TEXT NOT NULL,
    achievement_id TEXT NOT NULL,
    earned_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    earned_by_user_id TEXT,
    notes TEXT,
    UNIQUE(relationship_id, achievement_id)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS notifications (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    relationship_id TEXT,
    notification_type TEXT CHECK(notification_type IN ('reminder', 'achievement', 'checkin', 'anniversary', 'goal_progress', 'partner_activity')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    priority TEXT DEFAULT 'normal' CHECK(priority IN ('low', 'normal', 'high', 'urgent')),
    scheduled_for TIMESTAMP,
    sent_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS relationship_analytics (
    id TEXT PRIMARY KEY,
    relationship_id TEXT NOT NULL,
    analytics_date DATE NOT NULL,
    days_together INTEGER,
    average_connection_score NUMERIC(3,1),
    average_satisfaction_score NUMERIC(3,1),
    checkin_streak INTEGER,
    activities_completed_this_month INTEGER,
    goals_completed_this_month INTEGER,
    communication_frequency_score NUMERIC(3,1),
    overall_health_score NUMERIC(3,1),
    trends TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(relationship_id, analytics_date)
  )
  `,
  // Payment & Subscription tables
  `
  CREATE TABLE IF NOT EXISTS subscription_plans (
    id TEXT PRIMARY KEY,
    plan_name TEXT NOT NULL,
    plan_type TEXT NOT NULL CHECK(plan_type IN ('try_it_out', 'better_together', 'premium_plus', 'custom')),
    billing_period TEXT NOT NULL CHECK(billing_period IN ('monthly', 'annual')),
    price_cents INTEGER NOT NULL,
    price_display TEXT NOT NULL,
    currency TEXT DEFAULT 'USD',
    stripe_price_id TEXT,
    stripe_product_id TEXT,
    features TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS subscriptions (
    id TEXT PRIMARY KEY,
    relationship_id TEXT NOT NULL,
    plan_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    stripe_customer_id TEXT,
    stripe_subscription_id TEXT,
    status TEXT DEFAULT 'active' CHECK(status IN ('active', 'past_due', 'canceled', 'trialing', 'paused', 'incomplete')),
    billing_period TEXT NOT NULL CHECK(billing_period IN ('monthly', 'annual')),
    price_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    trial_end_date TIMESTAMP,
    current_period_start TIMESTAMP NOT NULL,
    current_period_end TIMESTAMP NOT NULL,
    canceled_at TIMESTAMP,
    cancel_reason TEXT,
    is_gift BOOLEAN DEFAULT FALSE,
    gift_from_user_id TEXT,
    gift_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS payment_transactions (
    id TEXT PRIMARY KEY,
    subscription_id TEXT,
    user_id TEXT NOT NULL,
    relationship_id TEXT,
    stripe_payment_intent_id TEXT,
    stripe_charge_id TEXT,
    transaction_type TEXT NOT NULL CHECK(transaction_type IN ('subscription', 'credits', 'add_on', 'gift', 'box', 'coaching', 'refund')),
    amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT NOT NULL CHECK(status IN ('succeeded', 'pending', 'failed', 'refunded', 'canceled')),
    payment_method TEXT CHECK(payment_method IN ('card', 'bank_account', 'apple_pay', 'google_pay')),
    description TEXT,
    metadata TEXT,
    failure_reason TEXT,
    refund_amount_cents INTEGER,
    refunded_at TIMESTAMP,
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  // Push notification tables
  `
  CREATE TABLE IF NOT EXISTS device_tokens (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    device_token TEXT NOT NULL,
    platform TEXT NOT NULL CHECK(platform IN ('ios', 'android', 'web')),
    device_name TEXT,
    app_version TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    last_used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, device_token)
  )
  `,
  `
  CREATE TABLE IF NOT EXISTS push_notification_logs (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    device_token_id TEXT,
    notification_type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT,
    data TEXT,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'sent', 'delivered', 'failed', 'clicked')),
    error_message TEXT,
    sent_at TIMESTAMP,
    delivered_at TIMESTAMP,
    clicked_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  // Analytics events tables
  `
  CREATE TABLE IF NOT EXISTS analytics_events (
    id TEXT PRIMARY KEY,
    event_name TEXT NOT NULL,
    event_category TEXT NOT NULL CHECK(event_category IN ('user_action', 'feature_usage', 'conversion', 'engagement', 'system', 'error', 'payment', 'partner')),
    user_id TEXT,
    relationship_id TEXT,
    session_id TEXT,
    event_data TEXT,
    page_url TEXT,
    referrer_url TEXT,
    device_type TEXT CHECK(device_type IN ('desktop', 'mobile', 'tablet', 'unknown')),
    browser TEXT,
    os TEXT,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  // Partner invitations table
  `
  CREATE TABLE IF NOT EXISTS partner_invitations (
    id TEXT PRIMARY KEY,
    inviter_id TEXT NOT NULL,
    invitee_email TEXT NOT NULL,
    relationship_type TEXT DEFAULT 'dating',
    invite_code TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'expired', 'cancelled')),
    expires_at TIMESTAMP NOT NULL,
    accepted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
  `,
  // Create a view for backward compatibility - maps users to users
  `CREATE OR REPLACE VIEW users AS SELECT * FROM users`,
  // Indexes
  `CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`,
  `CREATE INDEX IF NOT EXISTS idx_relationships_users ON relationships(user_1_id, user_2_id)`,
  `CREATE INDEX IF NOT EXISTS idx_relationships_status ON relationships(status)`,
  `CREATE INDEX IF NOT EXISTS idx_important_dates_relationship ON important_dates(relationship_id)`,
  `CREATE INDEX IF NOT EXISTS idx_important_dates_date ON important_dates(date_value)`,
  `CREATE INDEX IF NOT EXISTS idx_shared_goals_relationship ON shared_goals(relationship_id)`,
  `CREATE INDEX IF NOT EXISTS idx_shared_goals_status ON shared_goals(status)`,
  `CREATE INDEX IF NOT EXISTS idx_daily_checkins_relationship_date ON daily_checkins(relationship_id, checkin_date)`,
  `CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON daily_checkins(user_id, checkin_date)`,
  `CREATE INDEX IF NOT EXISTS idx_activities_relationship ON activities(relationship_id)`,
  `CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(planned_date)`,
  `CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status)`,
  `CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read)`,
  `CREATE INDEX IF NOT EXISTS idx_relationship_analytics_date ON relationship_analytics(relationship_id, analytics_date)`,
  `CREATE INDEX IF NOT EXISTS idx_subscriptions_relationship ON subscriptions(relationship_id)`,
  `CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe ON subscriptions(stripe_subscription_id)`,
  `CREATE INDEX IF NOT EXISTS idx_payment_transactions_user ON payment_transactions(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_device_tokens_user ON device_tokens(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON analytics_events(user_id)`,
  `CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON analytics_events(event_category)`,
  `CREATE INDEX IF NOT EXISTS idx_partner_invitations_code ON partner_invitations(invite_code)`,
  `CREATE INDEX IF NOT EXISTS idx_partner_invitations_email ON partner_invitations(invitee_email)`,
];

async function runMigrations() {
  console.log('Starting database migrations...\n');

  // First drop existing tables to ensure clean state
  console.log('Dropping existing Better Together tables...\n');
  for (let i = 0; i < dropTables.length; i++) {
    try {
      await sql(dropTables[i]);
      console.log(`[DROP ${i + 1}/${dropTables.length}] ✓`);
    } catch (error) {
      // Ignore errors on drop
    }
  }

  console.log('\nCreating tables...\n');
  for (let i = 0; i < migrations.length; i++) {
    const migration = migrations[i];
    const preview = migration.trim().substring(0, 60).replace(/\n/g, ' ');

    try {
      await sql(migration);
      console.log(`[${i + 1}/${migrations.length}] ✓ ${preview}...`);
    } catch (error) {
      // Ignore "already exists" errors
      if (error.message?.includes('already exists')) {
        console.log(`[${i + 1}/${migrations.length}] ○ Already exists: ${preview}...`);
      } else {
        console.error(`[${i + 1}/${migrations.length}] ✗ Failed: ${preview}...`);
        console.error(`   Error: ${error.message}`);
      }
    }
  }

  console.log('\nMigrations completed!');
}

runMigrations().catch(console.error);
