-- Better Together - Row Level Security Policies
-- Date: 2025-12-28

-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE important_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE communication_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_addons ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE engagement_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_notification_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_followers ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON users FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- ============================================================================
-- RELATIONSHIPS TABLE POLICIES
-- ============================================================================

-- Users can view relationships they're part of
CREATE POLICY "Users can view own relationships"
ON relationships FOR SELECT
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can create relationships involving themselves
CREATE POLICY "Users can create relationships"
ON relationships FOR INSERT
WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Users can update relationships they're part of
CREATE POLICY "Users can update own relationships"
ON relationships FOR UPDATE
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- ============================================================================
-- RELATIONSHIP DATA POLICIES (dates, checkins, goals, activities)
-- ============================================================================

-- Important dates - users can view/manage dates for their relationships
CREATE POLICY "Users can view relationship dates"
ON important_dates FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM relationships r
    WHERE r.id = relationship_id
    AND (r.user1_id = auth.uid() OR r.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can manage relationship dates"
ON important_dates FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM relationships r
    WHERE r.id = relationship_id
    AND (r.user1_id = auth.uid() OR r.user2_id = auth.uid())
  )
);

-- Daily checkins - users can view/create their own checkins
CREATE POLICY "Users can view relationship checkins"
ON daily_checkins FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM relationships r
    WHERE r.id = relationship_id
    AND (r.user1_id = auth.uid() OR r.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can create own checkins"
ON daily_checkins FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own checkins"
ON daily_checkins FOR UPDATE
USING (auth.uid() = user_id);

-- Shared goals - both partners can view/manage
CREATE POLICY "Users can view relationship goals"
ON shared_goals FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM relationships r
    WHERE r.id = relationship_id
    AND (r.user1_id = auth.uid() OR r.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can manage relationship goals"
ON shared_goals FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM relationships r
    WHERE r.id = relationship_id
    AND (r.user1_id = auth.uid() OR r.user2_id = auth.uid())
  )
);

-- Activities - both partners can view/manage
CREATE POLICY "Users can view relationship activities"
ON activities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM relationships r
    WHERE r.id = relationship_id
    AND (r.user1_id = auth.uid() OR r.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can manage relationship activities"
ON activities FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM relationships r
    WHERE r.id = relationship_id
    AND (r.user1_id = auth.uid() OR r.user2_id = auth.uid())
  )
);

-- Communication log
CREATE POLICY "Users can view relationship communication"
ON communication_log FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM relationships r
    WHERE r.id = relationship_id
    AND (r.user1_id = auth.uid() OR r.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can create own communication logs"
ON communication_log FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- GAMIFICATION POLICIES
-- ============================================================================

-- User challenges
CREATE POLICY "Users can view relationship challenges"
ON user_challenges FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM relationships r
    WHERE r.id = relationship_id
    AND (r.user1_id = auth.uid() OR r.user2_id = auth.uid())
  )
);

CREATE POLICY "Users can manage relationship challenges"
ON user_challenges FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM relationships r
    WHERE r.id = relationship_id
    AND (r.user1_id = auth.uid() OR r.user2_id = auth.uid())
  )
);

-- User achievements
CREATE POLICY "Users can view own achievements"
ON user_achievements FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can earn achievements"
ON user_achievements FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);

-- ============================================================================
-- SUBSCRIPTION & PAYMENT POLICIES
-- ============================================================================

-- Subscriptions
CREATE POLICY "Users can view own subscriptions"
ON subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own subscriptions"
ON subscriptions FOR ALL
USING (auth.uid() = user_id);

-- Payment transactions
CREATE POLICY "Users can view own transactions"
ON payment_transactions FOR SELECT
USING (auth.uid() = user_id);

-- AI Credits
CREATE POLICY "Users can view relationship credits"
ON ai_credits FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM relationships r
    WHERE r.id = relationship_id
    AND (r.user1_id = auth.uid() OR r.user2_id = auth.uid())
  )
);

-- User add-ons
CREATE POLICY "Users can view own addons"
ON user_addons FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own addons"
ON user_addons FOR ALL
USING (auth.uid() = user_id);

-- Discount usage
CREATE POLICY "Users can view own discount usage"
ON discount_usage FOR SELECT
USING (auth.uid() = user_id);

-- ============================================================================
-- ANALYTICS POLICIES (read-only for users)
-- ============================================================================

CREATE POLICY "Users can view own analytics events"
ON analytics_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create own analytics events"
ON analytics_events FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view own page views"
ON page_views FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view own sessions"
ON user_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view own engagement scores"
ON engagement_scores FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can view own cohort data"
ON user_cohorts FOR SELECT
USING (auth.uid() = user_id);

-- ============================================================================
-- AUTH SESSIONS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own auth sessions"
ON auth_sessions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own auth sessions"
ON auth_sessions FOR ALL
USING (auth.uid() = user_id);

-- ============================================================================
-- PUSH NOTIFICATIONS POLICIES
-- ============================================================================

CREATE POLICY "Users can view own push subscriptions"
ON push_subscriptions FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own push subscriptions"
ON push_subscriptions FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Users can view own push notification log"
ON push_notification_log FOR SELECT
USING (auth.uid() = user_id);

-- ============================================================================
-- COMMUNITY FEATURES POLICIES
-- ============================================================================

-- Posts - users can view public posts or their own posts
CREATE POLICY "Users can view posts"
ON posts FOR SELECT
USING (
  visibility = 'public'
  OR auth.uid() = user_id
  OR EXISTS (
    SELECT 1 FROM user_followers
    WHERE following_id = posts.user_id
    AND follower_id = auth.uid()
  )
);

CREATE POLICY "Users can create own posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);

-- Post likes
CREATE POLICY "Users can view post likes"
ON post_likes FOR SELECT
USING (true);

CREATE POLICY "Users can create own likes"
ON post_likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own likes"
ON post_likes FOR DELETE
USING (auth.uid() = user_id);

-- Post comments
CREATE POLICY "Users can view post comments"
ON post_comments FOR SELECT
USING (true);

CREATE POLICY "Users can create comments"
ON post_comments FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own comments"
ON post_comments FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
ON post_comments FOR DELETE
USING (auth.uid() = user_id);

-- User followers
CREATE POLICY "Users can view followers"
ON user_followers FOR SELECT
USING (true);

CREATE POLICY "Users can follow others"
ON user_followers FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
ON user_followers FOR DELETE
USING (auth.uid() = follower_id);

-- ============================================================================
-- PUBLIC READ-ONLY TABLES (no RLS needed)
-- ============================================================================

-- These tables are reference data and can be read by all authenticated users:
-- - challenges
-- - achievements
-- - subscription_plans
-- - subscription_addons
-- - discount_codes
-- - sponsors
