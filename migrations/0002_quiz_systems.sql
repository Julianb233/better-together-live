-- Quiz Systems Migration
-- Adds tables for Intake Quiz and Connection Compass Assessment

-- Quiz definitions table
CREATE TABLE IF NOT EXISTS quizzes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('intake', 'connection_compass', 'custom')),
    title TEXT NOT NULL,
    description TEXT,
    version INTEGER DEFAULT 1,
    is_active INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

-- Quiz questions table
CREATE TABLE IF NOT EXISTS quiz_questions (
    id TEXT PRIMARY KEY,
    quiz_id TEXT NOT NULL,
    question_number INTEGER NOT NULL,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK(question_type IN ('single_choice', 'multiple_choice', 'likert_scale', 'ranking', 'forced_choice')),
    question_data TEXT NOT NULL, -- JSON data for options, etc.
    scoring_data TEXT, -- JSON data for scoring logic
    is_required INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- User quiz responses table
CREATE TABLE IF NOT EXISTS user_quiz_responses (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    quiz_id TEXT NOT NULL,
    started_at TEXT DEFAULT (datetime('now')),
    completed_at TEXT,
    current_question INTEGER DEFAULT 1,
    is_completed INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Individual question responses
CREATE TABLE IF NOT EXISTS quiz_answer_responses (
    id TEXT PRIMARY KEY,
    user_quiz_response_id TEXT NOT NULL,
    question_id TEXT NOT NULL,
    answer_data TEXT NOT NULL, -- JSON data containing the user's answer
    answered_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_quiz_response_id) REFERENCES user_quiz_responses(id) ON DELETE CASCADE,
    FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
);

-- Quiz results and scoring
CREATE TABLE IF NOT EXISTS quiz_results (
    id TEXT PRIMARY KEY,
    user_quiz_response_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    quiz_id TEXT NOT NULL,
    result_data TEXT NOT NULL, -- JSON data with scores, profile, recommendations
    primary_style TEXT,
    secondary_style TEXT,
    full_breakdown TEXT, -- JSON breakdown of all dimensions
    ai_analysis TEXT, -- AI-generated insights
    is_visible_to_partner INTEGER DEFAULT 1,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_quiz_response_id) REFERENCES user_quiz_responses(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Couple compatibility reports (when both partners complete)
CREATE TABLE IF NOT EXISTS couple_compatibility_reports (
    id TEXT PRIMARY KEY,
    relationship_id TEXT NOT NULL,
    user1_result_id TEXT NOT NULL,
    user2_result_id TEXT NOT NULL,
    compatibility_score REAL,
    compatibility_data TEXT NOT NULL, -- JSON with detailed compatibility analysis
    recommendations TEXT, -- JSON array of recommendations
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE CASCADE,
    FOREIGN KEY (user1_result_id) REFERENCES quiz_results(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_result_id) REFERENCES quiz_results(id) ON DELETE CASCADE
);

-- Add quiz-related fields to users table
ALTER TABLE users ADD COLUMN intake_quiz_completed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN connection_compass_completed INTEGER DEFAULT 0;
ALTER TABLE users ADD COLUMN primary_connection_style TEXT;
ALTER TABLE users ADD COLUMN secondary_connection_style TEXT;

-- Indexes for performance
CREATE INDEX idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX idx_user_quiz_responses_user_id ON user_quiz_responses(user_id);
CREATE INDEX idx_user_quiz_responses_quiz_id ON user_quiz_responses(quiz_id);
CREATE INDEX idx_quiz_answer_responses_response_id ON quiz_answer_responses(user_quiz_response_id);
CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_quiz_id ON quiz_results(quiz_id);
CREATE INDEX idx_couple_compatibility_relationship_id ON couple_compatibility_reports(relationship_id);

-- Insert Intake Quiz definition
INSERT INTO quizzes (id, name, type, title, description) VALUES
('intake-quiz-v1', 'Discover Your Relationship Journey', 'intake', 'Discover Your Relationship Journey', 'Progressive, conversational format with smooth transitions');

-- Insert Connection Compass definition
INSERT INTO quizzes (id, name, type, title, description) VALUES
('connection-compass-v1', 'The Connection Compass', 'connection_compass', 'The Connection Compass', 'An original assessment for understanding how partners express and receive appreciation');
