-- AI Coach Messages table
-- Stores conversation history between users and the AI relationship coach

CREATE TABLE IF NOT EXISTS ai_coach_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship_id UUID NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  model_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for efficient history queries (user + relationship + time ordering)
CREATE INDEX IF NOT EXISTS idx_ai_coach_messages_history
  ON ai_coach_messages (user_id, relationship_id, created_at);

-- AI Coach Rate Limits table
-- Tracks per-user request counts for server-side rate limiting

CREATE TABLE IF NOT EXISTS ai_coach_rate_limits (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  window_start TIMESTAMPTZ NOT NULL,
  request_count INTEGER DEFAULT 1,
  PRIMARY KEY (user_id, window_start)
);
