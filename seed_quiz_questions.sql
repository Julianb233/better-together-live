-- Quiz Questions Seed Data
-- Populates quiz_questions table with all quiz questions

-- ============================================
-- INTAKE QUIZ QUESTIONS
-- ============================================

-- Question 1: Relationship Status
INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, is_required) VALUES
('intake-q1', 'intake-quiz-v1', 1, 'Let''s start with where you are in your journey together...', 'single_choice',
'{
  "options": [
    {"id": "just_started", "text": "Just started dating (0-6 months)", "emoji": "🌱"},
    {"id": "dating", "text": "Dating (6+ months)", "emoji": "🌿"},
    {"id": "committed", "text": "In a committed relationship", "emoji": "💑"},
    {"id": "engaged", "text": "Engaged", "emoji": "💍"},
    {"id": "newlyweds", "text": "Newlyweds (married <2 years)", "emoji": "👰‍♀️"},
    {"id": "married_medium", "text": "Married (2-10 years)", "emoji": "💏"},
    {"id": "married_long", "text": "Married (10+ years)", "emoji": "❤️"},
    {"id": "fresh_start", "text": "Starting fresh (reconciling/renewed commitment)", "emoji": "🔄"}
  ]
}', 1);

-- Question 2: Connection Goals
INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, is_required) VALUES
('intake-q2', 'intake-quiz-v1', 2, 'What would make your relationship feel even stronger?', 'multiple_choice',
'{
  "subtitle": "Select up to 3",
  "max_selections": 3,
  "options": [
    {"id": "emotional_intimacy", "text": "Deeper emotional intimacy"},
    {"id": "conflict_communication", "text": "Better communication during conflicts"},
    {"id": "quality_time", "text": "More quality time together"},
    {"id": "romance_passion", "text": "Reigniting romance and passion"},
    {"id": "shared_experiences", "text": "Building shared experiences"},
    {"id": "future_goals", "text": "Aligning on future goals"},
    {"id": "stress_management", "text": "Managing daily stress together"},
    {"id": "fun_playfulness", "text": "Having more fun and playfulness"}
  ]
}', 1);

-- Question 3: Current Challenge
INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, is_required) VALUES
('intake-q3', 'intake-quiz-v1', 3, 'Every relationship has growth areas. What feels most challenging right now?', 'single_choice',
'{
  "options": [
    {"id": "tech_distraction", "text": "We get distracted by technology/work", "emoji": "📱"},
    {"id": "time_finding", "text": "Finding time for just us", "emoji": "⏰"},
    {"id": "expressing_feelings", "text": "Expressing feelings openly", "emoji": "💬"},
    {"id": "stuck_routine", "text": "Stuck in routine/feeling bored", "emoji": "🔄"},
    {"id": "financial_stress", "text": "Financial stress affecting us", "emoji": "💰"},
    {"id": "household_balance", "text": "Balancing household responsibilities", "emoji": "🏠"},
    {"id": "parenting_energy", "text": "Parenting taking all our energy", "emoji": "👨‍👩‍👧"},
    {"id": "different_goals", "text": "Different life goals or priorities", "emoji": "🎯"}
  ]
}', 1);

-- Question 4: Ideal Date Vibe
INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, is_required) VALUES
('intake-q4', 'intake-quiz-v1', 4, 'Picture your perfect time together. What does it look like?', 'single_choice',
'{
  "options": [
    {"id": "adventure_seekers", "text": "Adventure Seekers - Trying something new and exciting", "emoji": "🏔️"},
    {"id": "intimate_connectors", "text": "Intimate Connectors - Deep conversation over wine", "emoji": "🍷"},
    {"id": "playful_partners", "text": "Playful Partners - Games, laughs, and friendly competition", "emoji": "🎮"},
    {"id": "zen_duo", "text": "Zen Duo - Peaceful, relaxing, recharging together", "emoji": "🧘"},
    {"id": "creative_souls", "text": "Creative Souls - Making, building, or learning something", "emoji": "🎨"},
    {"id": "social_butterflies", "text": "Social Butterflies - Out with friends or meeting new people", "emoji": "🌃"},
    {"id": "homebodies", "text": "Homebodies - Cozy night in, just us", "emoji": "🏡"},
    {"id": "culture_enthusiasts", "text": "Culture Enthusiasts - Museums, theater, concerts", "emoji": "🎭"}
  ]
}', 1);

-- Question 5: Energy & Activity Level
INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, is_required) VALUES
('intake-q5', 'intake-quiz-v1', 5, 'How do you both typically feel at the end of a workday?', 'single_choice',
'{
  "options": [
    {"id": "ready_active", "text": "Ready to go out and do something active", "emoji": "🚀"},
    {"id": "low_key", "text": "Up for something low-key but engaging", "emoji": "😊"},
    {"id": "need_decompress", "text": "Need to relax and decompress first", "emoji": "😴"},
    {"id": "varies_wildly", "text": "It varies wildly day to day", "emoji": "🎲"},
    {"id": "energy_mismatch", "text": "One of us has energy, the other doesn''t", "emoji": "💪"},
    {"id": "night_owls", "text": "We''re night owls - energy comes later", "emoji": "🌙"}
  ]
}', 1);

-- Question 6: Budget Comfort
INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, is_required) VALUES
('intake-q6', 'intake-quiz-v1', 6, 'When it comes to experiences and dates, what feels comfortable?', 'single_choice',
'{
  "options": [
    {"id": "free_creative", "text": "Free & Creative ($0) - Parks, home activities, free events", "emoji": "💚"},
    {"id": "budget_friendly", "text": "Budget-Friendly ($25-50) - Coffee dates, casual outings", "emoji": "💙"},
    {"id": "moderate", "text": "Moderate ($50-100) - Dinner out, local activities", "emoji": "💜"},
    {"id": "flexible", "text": "Flexible ($100-200) - Special experiences when worth it", "emoji": "💛"},
    {"id": "generous", "text": "Generous ($200+) - Premium experiences, no restrictions", "emoji": "❤️"},
    {"id": "varies", "text": "Varies - Depends on the occasion", "emoji": "🎯"}
  ]
}', 1);

-- Question 7: Planning Style
INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, is_required) VALUES
('intake-q7', 'intake-quiz-v1', 7, 'How do you prefer to plan your time together?', 'single_choice',
'{
  "options": [
    {"id": "plan_ahead", "text": "We love planning ahead and anticipating", "emoji": "📅"},
    {"id": "spontaneous", "text": "Spontaneous - best moments are unplanned", "emoji": "⚡"},
    {"id": "mix_both", "text": "Mix of both - some planned, some surprises", "emoji": "🎲"},
    {"id": "need_help", "text": "We struggle with this and need help", "emoji": "🤷"},
    {"id": "one_plans", "text": "One plans, the other goes along", "emoji": "📱"},
    {"id": "take_turns", "text": "We take turns surprising each other", "emoji": "🔄"}
  ]
}', 1);

-- Question 8: Social Preferences
INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, is_required) VALUES
('intake-q8', 'intake-quiz-v1', 8, 'How do you prefer to spend couple time?', 'single_choice',
'{
  "options": [
    {"id": "just_us", "text": "Just Us - Alone time is sacred", "emoji": "👥"},
    {"id": "double_dates", "text": "Double Dates - Love other couple friends", "emoji": "👫"},
    {"id": "family_included", "text": "Family Included - Kids/family often involved", "emoji": "👨‍👩‍👧‍👦"},
    {"id": "group_settings", "text": "Group Settings - The more the merrier", "emoji": "🎉"},
    {"id": "balanced_mix", "text": "Balanced Mix - Variety is key", "emoji": "🔄"},
    {"id": "parallel_play", "text": "Parallel Play - Together but doing own things", "emoji": "🏠"}
  ]
}', 1);

-- Question 9: Growth Mindset
INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, is_required) VALUES
('intake-q9', 'intake-quiz-v1', 9, 'What''s your attitude toward relationship development?', 'single_choice',
'{
  "options": [
    {"id": "actively_learn", "text": "We actively read/learn about relationships", "emoji": "📚"},
    {"id": "open_coaching", "text": "We''re open to coaching or guidance", "emoji": "💬"},
    {"id": "want_grow", "text": "We want to grow but don''t know how", "emoji": "🌱"},
    {"id": "figure_out", "text": "We figure things out ourselves", "emoji": "💪"},
    {"id": "address_issues", "text": "We address issues as they come up", "emoji": "🎯"},
    {"id": "just_fun", "text": "We''re good - just want fun ideas", "emoji": "❤️"}
  ]
}', 1);

-- Question 10: Communication Check
INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, is_required) VALUES
('intake-q10', 'intake-quiz-v1', 10, 'How would you describe your current communication?', 'single_choice',
'{
  "options": [
    {"id": "excellent", "text": "Excellent - We talk about everything openly", "emoji": "⭐"},
    {"id": "good", "text": "Good - Usually communicate well", "emoji": "👍"},
    {"id": "inconsistent", "text": "Inconsistent - Sometimes great, sometimes not", "emoji": "🔄"},
    {"id": "challenging", "text": "Challenging - Often misunderstand each other", "emoji": "😕"},
    {"id": "needs_work", "text": "Needs Work - Avoid difficult conversations", "emoji": "🚧"},
    {"id": "digital_heavy", "text": "Digital Heavy - Text more than talk", "emoji": "📱"}
  ]
}', 1);

-- Question 11: Love Expression
INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, is_required) VALUES
('intake-q11', 'intake-quiz-v1', 11, 'How do you most naturally show love?', 'single_choice',
'{
  "subtitle": "We''ll explore this more later - just pick your top one for now",
  "options": [
    {"id": "thoughtful_gestures", "text": "Thoughtful gestures and surprises", "emoji": "💝"},
    {"id": "helping_supporting", "text": "Helping and supporting each other", "emoji": "🤝"},
    {"id": "words_appreciation", "text": "Words and verbal appreciation", "emoji": "💬"},
    {"id": "quality_time", "text": "Focused quality time together", "emoji": "⏰"},
    {"id": "physical_affection", "text": "Physical affection and closeness", "emoji": "🤗"},
    {"id": "supporting_goals", "text": "Supporting each other''s goals", "emoji": "🎯"}
  ]
}', 1);

-- Question 12: Availability
INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, is_required) VALUES
('intake-q12', 'intake-quiz-v1', 12, 'When are you typically free for couple time?', 'multiple_choice',
'{
  "subtitle": "Select all that apply",
  "options": [
    {"id": "weekday_mornings", "text": "Weekday mornings"},
    {"id": "weekday_lunch", "text": "Weekday lunch breaks"},
    {"id": "weekday_evenings", "text": "Weekday evenings"},
    {"id": "friday_nights", "text": "Friday nights"},
    {"id": "saturday_days", "text": "Saturday days"},
    {"id": "saturday_nights", "text": "Saturday nights"},
    {"id": "sunday_days", "text": "Sunday days"},
    {"id": "sunday_nights", "text": "Sunday nights"},
    {"id": "changes_weekly", "text": "It changes weekly"}
  ]
}', 1);

-- ============================================
-- CONNECTION COMPASS QUESTIONS
-- ============================================

-- Round 1: Initial Preferences

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q1', 'connection-compass-v1', 1, 'Question 1', 'forced_choice',
'{
  "options": [
    {"id": "a", "text": "When my partner remembers something specific I mentioned wanting and surprises me with it"},
    {"id": "b", "text": "When my partner puts away their phone and gives me their complete attention"}
  ]
}',
'{
  "points_map": {
    "a": {"thoughtful_gestures": 1},
    "b": {"focused_presence": 1}
  }
}', 1);

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q2', 'connection-compass-v1', 2, 'Question 2', 'forced_choice',
'{
  "options": [
    {"id": "a", "text": "When my partner handles a task I usually do, giving me time to relax"},
    {"id": "b", "text": "When my partner tells me specifically what they appreciate about me"}
  ]
}',
'{
  "points_map": {
    "a": {"supportive_partnership": 1},
    "b": {"verbal_appreciation": 1}
  }
}', 1);

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q3', 'connection-compass-v1', 3, 'Question 3', 'forced_choice',
'{
  "options": [
    {"id": "a", "text": "When my partner holds my hand or puts their arm around me in public"},
    {"id": "b", "text": "When my partner actively encourages me to pursue my personal goals"}
  ]
}',
'{
  "points_map": {
    "a": {"physical_connection": 1},
    "b": {"growth_championing": 1}
  }
}', 1);

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q4', 'connection-compass-v1', 4, 'Question 4', 'forced_choice',
'{
  "options": [
    {"id": "a", "text": "When my partner plans a special activity based on my interests"},
    {"id": "b", "text": "When my partner helps me solve a problem I''m struggling with"}
  ]
}',
'{
  "points_map": {
    "a": {"thoughtful_gestures": 1},
    "b": {"supportive_partnership": 1}
  }
}', 1);

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q5', 'connection-compass-v1', 5, 'Question 5', 'forced_choice',
'{
  "options": [
    {"id": "a", "text": "When my partner sends me a thoughtful message during the day"},
    {"id": "b", "text": "When my partner initiates physical closeness while watching TV"}
  ]
}',
'{
  "points_map": {
    "a": {"verbal_appreciation": 1},
    "b": {"physical_connection": 1}
  }
}', 1);

-- Round 2: Scenario Preferences

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q6', 'connection-compass-v1', 6, 'After a stressful day, what would help you feel most supported?', 'forced_choice',
'{
  "options": [
    {"id": "a", "text": "Your partner listening without judgment while you vent"},
    {"id": "b", "text": "Your partner taking care of dinner and evening chores"}
  ]
}',
'{
  "points_map": {
    "a": {"focused_presence": 1},
    "b": {"supportive_partnership": 1}
  }
}', 1);

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q7', 'connection-compass-v1', 7, 'For your birthday, what would mean the most?', 'forced_choice',
'{
  "options": [
    {"id": "a", "text": "A heartfelt letter describing your impact on their life"},
    {"id": "b", "text": "A carefully planned day doing your favorite activities together"}
  ]
}',
'{
  "points_map": {
    "a": {"verbal_appreciation": 1},
    "b": {"focused_presence": 1}
  }
}', 1);

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q8', 'connection-compass-v1', 8, 'When you achieve something important, how would you want your partner to celebrate?', 'forced_choice',
'{
  "options": [
    {"id": "a", "text": "Bragging about you to friends and family"},
    {"id": "b", "text": "Planning a special experience to mark the achievement"}
  ]
}',
'{
  "points_map": {
    "a": {"verbal_appreciation": 1},
    "b": {"thoughtful_gestures": 1}
  }
}', 1);

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q9', 'connection-compass-v1', 9, 'During a regular weekday, what would make you smile most?', 'forced_choice',
'{
  "options": [
    {"id": "a", "text": "An unexpected hug from behind while you''re doing dishes"},
    {"id": "b", "text": "Your partner handling an errand you were dreading"}
  ]
}',
'{
  "points_map": {
    "a": {"physical_connection": 1},
    "b": {"supportive_partnership": 1}
  }
}', 1);

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q10', 'connection-compass-v1', 10, 'When you''re doubting yourself, what helps most?', 'forced_choice',
'{
  "options": [
    {"id": "a", "text": "Your partner reminding you of your strengths and past successes"},
    {"id": "b", "text": "Your partner researching solutions and resources to help you"}
  ]
}',
'{
  "points_map": {
    "a": {"verbal_appreciation": 1},
    "b": {"growth_championing": 1}
  }
}', 1);

-- Round 3: Depth Questions (Likert Scale)

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q11', 'connection-compass-v1', 11, 'I feel most connected when we''re doing separate activities in the same room', 'likert_scale',
'{
  "scale_min": 1,
  "scale_max": 5,
  "scale_labels": {"min": "Strongly Disagree", "max": "Strongly Agree"}
}',
'{
  "style_weights": {
    "focused_presence": 0.5
  }
}', 1);

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q12', 'connection-compass-v1', 12, 'Small daily gestures mean more to me than grand occasional ones', 'likert_scale',
'{
  "scale_min": 1,
  "scale_max": 5,
  "scale_labels": {"min": "Strongly Disagree", "max": "Strongly Agree"}
}',
'{
  "style_weights": {
    "thoughtful_gestures": 0.5
  }
}', 1);

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q13', 'connection-compass-v1', 13, 'I need physical touch to feel emotionally connected', 'likert_scale',
'{
  "scale_min": 1,
  "scale_max": 5,
  "scale_labels": {"min": "Strongly Disagree", "max": "Strongly Agree"}
}',
'{
  "style_weights": {
    "physical_connection": 0.5
  }
}', 1);

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q14', 'connection-compass-v1', 14, 'I feel loved when my partner takes interest in my hobbies', 'likert_scale',
'{
  "scale_min": 1,
  "scale_max": 5,
  "scale_labels": {"min": "Strongly Disagree", "max": "Strongly Agree"}
}',
'{
  "style_weights": {
    "growth_championing": 0.5
  }
}', 1);

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q15', 'connection-compass-v1', 15, 'Actions speak louder than words in relationships', 'likert_scale',
'{
  "scale_min": 1,
  "scale_max": 5,
  "scale_labels": {"min": "Strongly Disagree", "max": "Strongly Agree"}
}',
'{
  "style_weights": {
    "supportive_partnership": 0.5
  }
}', 1);

-- Round 4: Expression Preferences

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q16', 'connection-compass-v1', 16, 'How do you most naturally express love?', 'ranking',
'{
  "subtitle": "Rank these from 1-6 (1 being most natural)",
  "items_to_rank": [
    "Saying encouraging and appreciative things",
    "Planning special experiences together",
    "Buying or making meaningful gifts",
    "Taking care of practical needs",
    "Being physically affectionate",
    "Supporting their independence and growth"
  ]
}',
'{
  "style_weights": {
    "verbal_appreciation": 1,
    "focused_presence": 1,
    "thoughtful_gestures": 1,
    "supportive_partnership": 1,
    "physical_connection": 1,
    "growth_championing": 1
  }
}', 1);

INSERT INTO quiz_questions (id, quiz_id, question_number, question_text, question_type, question_data, scoring_data, is_required) VALUES
('compass-q17', 'connection-compass-v1', 17, 'What makes you feel most disconnected?', 'single_choice',
'{
  "options": [
    {"id": "lack_conversation", "text": "Lack of meaningful conversation"},
    {"id": "no_quality_time", "text": "No quality time together"},
    {"id": "no_gestures", "text": "Absence of thoughtful gestures"},
    {"id": "unshared_responsibilities", "text": "Unshared responsibilities"},
    {"id": "limited_affection", "text": "Limited physical affection"},
    {"id": "unsupported_goals", "text": "Feeling unsupported in personal goals"}
  ]
}',
'{
  "points_map": {
    "lack_conversation": {"verbal_appreciation": 2},
    "no_quality_time": {"focused_presence": 2},
    "no_gestures": {"thoughtful_gestures": 2},
    "unshared_responsibilities": {"supportive_partnership": 2},
    "limited_affection": {"physical_connection": 2},
    "unsupported_goals": {"growth_championing": 2}
  }
}', 1);
