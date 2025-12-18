-- Better Together: Seed Data for Relationship Platform
-- Pre-built challenges, achievements, and sample data

-- Insert pre-built relationship challenges
INSERT OR IGNORE INTO challenges (id, challenge_name, challenge_description, challenge_type, duration_days, difficulty_level, category, instructions) VALUES 
  ('daily_gratitude_7', '7-Day Gratitude Challenge', 'Share something you appreciate about your partner every day for a week', 'daily', 7, 'beginner', 'gratitude', 'Each day, tell your partner one specific thing you appreciate about them. Write it down and share it out loud.'),
  ('quality_time_30', '30-Day Quality Time Challenge', 'Spend 30 minutes of undivided attention together each day', 'daily', 30, 'intermediate', 'quality_time', 'Set aside 30 minutes daily with no phones, TV, or distractions. Talk, play games, or just be present together.'),
  ('date_night_weekly', 'Weekly Date Night Challenge', 'Plan and execute one special date night each week for a month', 'weekly', 28, 'intermediate', 'adventure', 'Take turns planning a special date night each week. Can be at home or out - focus on creating memorable experiences.'),
  ('deep_conversations', '10 Deep Conversation Starters', 'Have meaningful conversations using guided prompts', 'weekly', 14, 'advanced', 'communication', 'Use conversation starters to explore deeper topics about dreams, values, and relationship goals.'),
  ('acts_of_service', 'Acts of Service Week', 'Perform daily acts of service for your partner', 'daily', 7, 'beginner', 'support', 'Each day, do something helpful for your partner without being asked. Focus on what would make their day easier.'),
  ('adventure_month', 'Monthly Adventure Challenge', 'Try something new together each week', 'weekly', 28, 'intermediate', 'adventure', 'Step out of your comfort zone together with new activities, places, or experiences each week.'),
  ('communication_boost', 'Communication Booster', 'Practice active listening and sharing techniques', 'daily', 14, 'intermediate', 'communication', 'Focus on listening without interrupting and sharing feelings using "I" statements.'),
  ('intimacy_builder', 'Intimacy Building Challenge', 'Increase emotional and physical closeness through guided activities', 'daily', 21, 'advanced', 'intimacy', 'Engage in activities designed to increase emotional and physical intimacy in your relationship.');

-- Insert achievements system
INSERT OR IGNORE INTO achievements (id, achievement_name, achievement_description, achievement_type, category, point_value, requirements) VALUES 
  ('first_checkin', 'First Steps', 'Completed your first daily check-in together', 'milestone', 'consistency', 10, '{"checkins": 1}'),
  ('week_streak', 'Week Warrior', 'Completed daily check-ins for 7 consecutive days', 'streak', 'consistency', 25, '{"checkin_streak": 7}'),
  ('month_streak', 'Monthly Master', 'Completed daily check-ins for 30 consecutive days', 'streak', 'consistency', 100, '{"checkin_streak": 30}'),
  ('goal_setter', 'Goal Getter', 'Set your first shared relationship goal', 'milestone', 'goals', 15, '{"goals_created": 1}'),
  ('goal_achiever', 'Achievement Unlocked', 'Completed your first shared goal', 'completion', 'goals', 50, '{"goals_completed": 1}'),
  ('date_planner', 'Date Night Pro', 'Planned and completed 5 date nights', 'milestone', 'activities', 75, '{"date_nights_completed": 5}'),
  ('challenge_starter', 'Challenge Accepted', 'Started your first relationship challenge', 'milestone', 'challenges', 20, '{"challenges_started": 1}'),
  ('challenge_finisher', 'Challenge Champion', 'Completed your first relationship challenge', 'completion', 'challenges', 100, '{"challenges_completed": 1}'),
  ('communicator', 'Great Communicator', 'Logged 10 meaningful conversations', 'milestone', 'communication', 60, '{"deep_conversations": 10}'),
  ('anniversary_keeper', 'Memory Keeper', 'Remembered and celebrated an important date', 'special', 'milestone', 30, '{"anniversaries_celebrated": 1}'),
  ('perfect_week', 'Perfect Week', 'Completed all daily activities for a full week', 'streak', 'consistency', 150, '{"perfect_days": 7}'),
  ('adventure_seeker', 'Adventure Seeker', 'Tried 3 new activities together', 'milestone', 'activities', 80, '{"new_activities": 3}'),
  ('gratitude_master', 'Gratitude Master', 'Shared gratitude notes for 30 days', 'streak', 'gratitude', 120, '{"gratitude_entries": 30}');

-- Sample relationship types and statuses for reference
-- These will be used in the application logic

-- Sample conversation starters for deep conversations challenge
-- This data would typically be stored in a separate table or configuration

-- Sample notification templates
-- These would be used to generate personalized notifications