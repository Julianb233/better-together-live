-- Better Together: Comprehensive Relationship Platform Database Schema
-- This schema is designed for romantic relationships with advanced tracking and analytics

-- Users table - Core user profiles
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  nickname TEXT, -- What their partner calls them
  profile_photo_url TEXT,
  phone_number TEXT,
  timezone TEXT DEFAULT 'UTC',
  love_language_primary TEXT CHECK(love_language_primary IN ('words_of_affirmation', 'quality_time', 'physical_touch', 'acts_of_service', 'receiving_gifts')),
  love_language_secondary TEXT CHECK(love_language_secondary IN ('words_of_affirmation', 'quality_time', 'physical_touch', 'acts_of_service', 'receiving_gifts')),
  relationship_preferences TEXT, -- JSON for preferences
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_active_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Relationships table - Links two users as partners
CREATE TABLE IF NOT EXISTS relationships (
  id TEXT PRIMARY KEY,
  user_1_id TEXT NOT NULL,
  user_2_id TEXT NOT NULL,
  relationship_type TEXT DEFAULT 'dating' CHECK(relationship_type IN ('dating', 'engaged', 'married', 'partnership')),
  start_date DATE, -- When they started dating
  anniversary_date DATE, -- Primary anniversary (engagement, marriage, etc.)
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'paused', 'ended')),
  privacy_level TEXT DEFAULT 'private' CHECK(privacy_level IN ('private', 'friends', 'public')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_1_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_2_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(user_1_id, user_2_id)
);

-- Important Dates table - Anniversaries, milestones, special events
CREATE TABLE IF NOT EXISTS important_dates (
  id TEXT PRIMARY KEY,
  relationship_id TEXT NOT NULL,
  date_value DATE NOT NULL,
  event_name TEXT NOT NULL,
  event_type TEXT CHECK(event_type IN ('anniversary', 'milestone', 'birthday', 'holiday', 'custom')),
  description TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT, -- 'yearly', 'monthly', etc.
  reminder_days_before INTEGER DEFAULT 7,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Shared Goals table - Relationship goals and challenges
CREATE TABLE IF NOT EXISTS shared_goals (
  id TEXT PRIMARY KEY,
  relationship_id TEXT NOT NULL,
  goal_name TEXT NOT NULL,
  goal_description TEXT,
  goal_type TEXT CHECK(goal_type IN ('weekly', 'monthly', 'milestone', 'custom')),
  target_count INTEGER, -- For goals like "5 date nights"
  current_progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK(status IN ('active', 'completed', 'paused', 'cancelled')),
  start_date DATE,
  target_date DATE,
  completion_date DATE,
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Daily Check-ins table - Track relationship wellness
CREATE TABLE IF NOT EXISTS daily_checkins (
  id TEXT PRIMARY KEY,
  relationship_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  checkin_date DATE NOT NULL,
  connection_score INTEGER CHECK(connection_score BETWEEN 1 AND 10), -- How connected they feel (1-10)
  mood_score INTEGER CHECK(mood_score BETWEEN 1 AND 10), -- General mood (1-10)
  relationship_satisfaction INTEGER CHECK(relationship_satisfaction BETWEEN 1 AND 10), -- Relationship satisfaction (1-10)
  gratitude_note TEXT, -- What they're grateful for about their partner
  support_needed TEXT, -- What support they need
  highlight_of_day TEXT, -- Best part of their day with partner
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(relationship_id, user_id, checkin_date)
);

-- Activities table - Shared activities and date nights
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  relationship_id TEXT NOT NULL,
  activity_name TEXT NOT NULL,
  activity_type TEXT CHECK(activity_type IN ('date_night', 'quality_time', 'adventure', 'relaxation', 'learning', 'exercise', 'social', 'custom')),
  description TEXT,
  location TEXT,
  planned_date TIMESTAMPTZ,
  completed_date TIMESTAMPTZ,
  duration_minutes INTEGER,
  cost_amount DECIMAL(10,2),
  satisfaction_rating_user1 INTEGER CHECK(satisfaction_rating_user1 BETWEEN 1 AND 10),
  satisfaction_rating_user2 INTEGER CHECK(satisfaction_rating_user2 BETWEEN 1 AND 10),
  notes TEXT,
  photos TEXT, -- JSON array of photo URLs
  status TEXT DEFAULT 'planned' CHECK(status IN ('planned', 'completed', 'cancelled')),
  created_by_user_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Communication Log table - Track meaningful conversations
CREATE TABLE IF NOT EXISTS communication_log (
  id TEXT PRIMARY KEY,
  relationship_id TEXT NOT NULL,
  communication_type TEXT CHECK(communication_type IN ('deep_talk', 'conflict_resolution', 'planning', 'appreciation', 'check_in', 'custom')),
  topic TEXT,
  description TEXT,
  outcome TEXT CHECK(outcome IN ('positive', 'neutral', 'needs_follow_up')),
  duration_minutes INTEGER,
  initiated_by_user_id TEXT NOT NULL,
  communication_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  follow_up_needed BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
  FOREIGN KEY (initiated_by_user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Challenges table - Relationship building challenges
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
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Challenge Participation table - Track couples participating in challenges
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
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
  FOREIGN KEY (challenge_id) REFERENCES challenges(id) ON DELETE CASCADE,
  UNIQUE(relationship_id, challenge_id, start_date)
);

-- Challenge Entries table - Daily/weekly entries for challenge progress
CREATE TABLE IF NOT EXISTS challenge_entries (
  id TEXT PRIMARY KEY,
  participation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  entry_date DATE NOT NULL,
  entry_content TEXT,
  reflection TEXT,
  completion_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (participation_id) REFERENCES challenge_participation(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(participation_id, user_id, entry_date)
);

-- Achievements table - Gamification system
CREATE TABLE IF NOT EXISTS achievements (
  id TEXT PRIMARY KEY,
  achievement_name TEXT NOT NULL,
  achievement_description TEXT,
  achievement_type TEXT CHECK(achievement_type IN ('milestone', 'streak', 'completion', 'special')),
  category TEXT CHECK(category IN ('communication', 'activities', 'goals', 'challenges', 'consistency')),
  icon_url TEXT,
  requirements TEXT, -- JSON describing requirements
  point_value INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- User Achievements table - Track earned achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id TEXT PRIMARY KEY,
  relationship_id TEXT NOT NULL,
  achievement_id TEXT NOT NULL,
  earned_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  earned_by_user_id TEXT, -- NULL if earned by both partners
  notes TEXT,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
  FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
  FOREIGN KEY (earned_by_user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE(relationship_id, achievement_id)
);

-- Notifications table - System notifications and reminders
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
  scheduled_for TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE
);

-- Relationship Analytics table - Store computed analytics
CREATE TABLE IF NOT EXISTS relationship_analytics (
  id TEXT PRIMARY KEY,
  relationship_id TEXT NOT NULL,
  analytics_date DATE NOT NULL,
  days_together INTEGER,
  average_connection_score DECIMAL(3,1),
  average_satisfaction_score DECIMAL(3,1),
  checkin_streak INTEGER,
  activities_completed_this_month INTEGER,
  goals_completed_this_month INTEGER,
  communication_frequency_score DECIMAL(3,1),
  overall_health_score DECIMAL(3,1),
  trends TEXT, -- JSON with trend analysis
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
  UNIQUE(relationship_id, analytics_date)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_relationships_users ON relationships(user_1_id, user_2_id);
CREATE INDEX IF NOT EXISTS idx_relationships_status ON relationships(status);
CREATE INDEX IF NOT EXISTS idx_important_dates_relationship ON important_dates(relationship_id);
CREATE INDEX IF NOT EXISTS idx_important_dates_date ON important_dates(date_value);
CREATE INDEX IF NOT EXISTS idx_shared_goals_relationship ON shared_goals(relationship_id);
CREATE INDEX IF NOT EXISTS idx_shared_goals_status ON shared_goals(status);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_relationship_date ON daily_checkins(relationship_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_daily_checkins_user_date ON daily_checkins(user_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_activities_relationship ON activities(relationship_id);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(planned_date);
CREATE INDEX IF NOT EXISTS idx_activities_status ON activities(status);
CREATE INDEX IF NOT EXISTS idx_communication_log_relationship ON communication_log(relationship_id);
CREATE INDEX IF NOT EXISTS idx_communication_log_date ON communication_log(communication_date);
CREATE INDEX IF NOT EXISTS idx_challenge_participation_relationship ON challenge_participation(relationship_id);
CREATE INDEX IF NOT EXISTS idx_challenge_entries_participation ON challenge_entries(participation_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_relationship_analytics_relationship_date ON relationship_analytics(relationship_id, analytics_date);