-- Better Together: Community Features
-- Social networking, communities, messaging, and content sharing for couples

-- ============================================================================
-- COMMUNITIES & GROUPS
-- ============================================================================

-- Communities table - Groups for couples with shared interests
CREATE TABLE IF NOT EXISTS communities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,

  -- Privacy & Access
  privacy_level TEXT DEFAULT 'public' CHECK(privacy_level IN ('public', 'private', 'invite_only')),

  -- Categorization
  category TEXT CHECK(category IN (
    'relationship_stage',    -- Newlyweds, Long-distance, etc.
    'interests',             -- Travel, Fitness, Cooking, etc.
    'location',              -- City/Region based
    'support',               -- Therapy, Challenges, etc.
    'lifestyle',             -- DINK, Parents, etc.
    'other'
  )),

  -- Ownership & Stats
  created_by TEXT NOT NULL,
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,

  -- Featured & Verification
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Community Members table - Track membership and roles
CREATE TABLE IF NOT EXISTS community_members (
  id TEXT PRIMARY KEY,
  community_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  relationship_id TEXT, -- Optional - for couple membership

  -- Role & Permissions
  role TEXT DEFAULT 'member' CHECK(role IN ('owner', 'admin', 'moderator', 'member')),

  -- Status
  status TEXT DEFAULT 'active' CHECK(status IN ('pending', 'active', 'banned', 'left')),

  -- Invitation tracking
  invited_by TEXT,
  invited_at TIMESTAMPTZ,

  -- Activity
  joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  last_active_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  -- Preferences (JSONB for Postgres/Neon)
  notification_preferences TEXT, -- JSON: {new_posts, comments, announcements}

  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE SET NULL,
  FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE SET NULL,

  UNIQUE(community_id, user_id)
);

-- Community Invites table - Track invite codes
CREATE TABLE IF NOT EXISTS community_invites (
  id TEXT PRIMARY KEY,
  community_id TEXT NOT NULL,
  invited_by TEXT NOT NULL,
  invited_email TEXT,

  -- Invite Code
  invite_code TEXT UNIQUE NOT NULL,

  -- Status
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'expired', 'revoked')),

  -- Expiration
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  accepted_by TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
  FOREIGN KEY (invited_by) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (accepted_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- POSTS & CONTENT
-- ============================================================================

-- Posts table - Activity feed content
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  author_id TEXT NOT NULL,
  relationship_id TEXT, -- Optional - posted as couple
  community_id TEXT, -- NULL = personal feed

  -- Content
  content_type TEXT DEFAULT 'text' CHECK(content_type IN (
    'text',                  -- Regular post
    'photo',                 -- Photo post
    'activity',              -- Shared activity from activities table
    'milestone',             -- Relationship milestone
    'challenge_complete',    -- Challenge completion
    'achievement'            -- Achievement unlocked
  )),
  content TEXT,
  media_urls TEXT, -- JSON array of image/video URLs

  -- Linked Content
  linked_activity_id TEXT,
  linked_challenge_id TEXT,
  linked_achievement_id TEXT,

  -- Visibility
  visibility TEXT DEFAULT 'public' CHECK(visibility IN (
    'public',                -- Everyone can see
    'community',             -- Community members only
    'connections',           -- Friends/followers only
    'private'                -- Only author(s)
  )),

  -- Moderation
  is_pinned BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,

  -- Denormalized counts (for performance)
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ,

  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (relationship_id) REFERENCES relationships(id) ON DELETE SET NULL,
  FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
  FOREIGN KEY (linked_activity_id) REFERENCES activities(id) ON DELETE SET NULL,
  FOREIGN KEY (linked_challenge_id) REFERENCES challenges(id) ON DELETE SET NULL,
  FOREIGN KEY (linked_achievement_id) REFERENCES achievements(id) ON DELETE SET NULL
);

-- Comments table - Nested comment system
CREATE TABLE IF NOT EXISTS comments (
  id TEXT PRIMARY KEY,
  post_id TEXT NOT NULL,
  author_id TEXT NOT NULL,
  parent_comment_id TEXT, -- For nested replies

  -- Content
  content TEXT NOT NULL,

  -- Denormalized counts
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ,

  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE
);

-- Reactions table - Multi-type reactions for posts and comments
CREATE TABLE IF NOT EXISTS reactions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,

  -- Polymorphic target
  target_type TEXT NOT NULL CHECK(target_type IN ('post', 'comment')),
  target_id TEXT NOT NULL,

  -- Reaction type
  reaction_type TEXT DEFAULT 'like' CHECK(reaction_type IN (
    'like',                  -- Basic like
    'love',                  -- Heart/love
    'celebrate',             -- Party/celebration
    'support',               -- Hug/support
    'insightful'             -- Lightbulb/helpful
  )),

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  -- One reaction per user per target
  UNIQUE(user_id, target_type, target_id)
);

-- ============================================================================
-- CONNECTIONS & SOCIAL GRAPH
-- ============================================================================

-- User Connections table - Follow/friend relationships
CREATE TABLE IF NOT EXISTS user_connections (
  id TEXT PRIMARY KEY,
  follower_id TEXT NOT NULL,
  following_id TEXT NOT NULL,

  -- Connection type
  connection_type TEXT DEFAULT 'follow' CHECK(connection_type IN ('follow', 'friend')),

  -- Status (for friend requests)
  status TEXT DEFAULT 'accepted' CHECK(status IN ('pending', 'accepted', 'rejected', 'blocked')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (follower_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (following_id) REFERENCES users(id) ON DELETE CASCADE,

  -- Can't follow yourself
  CHECK (follower_id != following_id),

  -- One connection per pair
  UNIQUE(follower_id, following_id)
);

-- User Blocks table - Block unwanted interactions
CREATE TABLE IF NOT EXISTS user_blocks (
  id TEXT PRIMARY KEY,
  blocker_id TEXT NOT NULL,
  blocked_id TEXT NOT NULL,

  -- Optional reason
  reason TEXT CHECK(reason IN ('spam', 'harassment', 'inappropriate', 'other')),
  notes TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE,

  -- Can't block yourself
  CHECK (blocker_id != blocked_id),

  -- One block per pair
  UNIQUE(blocker_id, blocked_id)
);

-- ============================================================================
-- MESSAGING SYSTEM
-- ============================================================================

-- Conversations table - DM threads (direct and group)
CREATE TABLE IF NOT EXISTS conversations (
  id TEXT PRIMARY KEY,

  -- Type
  type TEXT DEFAULT 'direct' CHECK(type IN ('direct', 'group')),

  -- Group chat details
  name TEXT, -- For group chats
  avatar_url TEXT, -- For group chats

  -- Creator
  created_by TEXT NOT NULL,

  -- Activity
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

-- Conversation Participants table - Who's in each conversation
CREATE TABLE IF NOT EXISTS conversation_participants (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  user_id TEXT NOT NULL,

  -- Role (for group chats)
  role TEXT DEFAULT 'member' CHECK(role IN ('owner', 'admin', 'member')),

  -- Activity
  joined_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  left_at TIMESTAMPTZ,
  last_read_at TIMESTAMPTZ,

  -- Settings
  is_muted BOOLEAN DEFAULT FALSE,

  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  UNIQUE(conversation_id, user_id)
);

-- Messages table - Individual messages in conversations
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  sender_id TEXT NOT NULL,

  -- Content
  message_type TEXT DEFAULT 'text' CHECK(message_type IN (
    'text',
    'image',
    'activity_share',        -- Share an activity
    'post_share',            -- Share a post
    'challenge_share'        -- Share a challenge
  )),
  content TEXT,
  media_url TEXT,

  -- Shared content IDs
  shared_activity_id TEXT,
  shared_post_id TEXT,
  shared_challenge_id TEXT,

  -- Editing
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMPTZ,

  FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (shared_activity_id) REFERENCES activities(id) ON DELETE SET NULL,
  FOREIGN KEY (shared_post_id) REFERENCES posts(id) ON DELETE SET NULL,
  FOREIGN KEY (shared_challenge_id) REFERENCES challenges(id) ON DELETE SET NULL
);

-- ============================================================================
-- MODERATION & REPORTING
-- ============================================================================

-- Content Reports table - User-generated reports for moderation
CREATE TABLE IF NOT EXISTS content_reports (
  id TEXT PRIMARY KEY,
  reporter_id TEXT NOT NULL,

  -- Target (polymorphic)
  target_type TEXT NOT NULL CHECK(target_type IN (
    'post',
    'comment',
    'message',
    'user',
    'community'
  )),
  target_id TEXT NOT NULL,

  -- Report details
  reason TEXT NOT NULL CHECK(reason IN (
    'spam',
    'harassment',
    'hate_speech',
    'violence',
    'inappropriate',
    'misinformation',
    'copyright',
    'other'
  )),
  description TEXT,

  -- Moderation
  status TEXT DEFAULT 'pending' CHECK(status IN (
    'pending',
    'under_review',
    'action_taken',
    'dismissed',
    'duplicate'
  )),

  -- Review tracking
  reviewed_by TEXT,
  reviewed_at TIMESTAMPTZ,
  moderator_notes TEXT,
  action_taken TEXT, -- What action was taken

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Communities
CREATE INDEX IF NOT EXISTS idx_communities_slug ON communities(slug);
CREATE INDEX IF NOT EXISTS idx_communities_category ON communities(category);
CREATE INDEX IF NOT EXISTS idx_communities_privacy ON communities(privacy_level);
CREATE INDEX IF NOT EXISTS idx_communities_featured ON communities(is_featured, member_count DESC);
CREATE INDEX IF NOT EXISTS idx_communities_created_by ON communities(created_by);

-- Community Members
CREATE INDEX IF NOT EXISTS idx_community_members_community_status ON community_members(community_id, status);
CREATE INDEX IF NOT EXISTS idx_community_members_user ON community_members(user_id);
CREATE INDEX IF NOT EXISTS idx_community_members_relationship ON community_members(relationship_id);

-- Community Invites
CREATE INDEX IF NOT EXISTS idx_community_invites_code ON community_invites(invite_code);
CREATE INDEX IF NOT EXISTS idx_community_invites_email ON community_invites(invited_email);
CREATE INDEX IF NOT EXISTS idx_community_invites_status ON community_invites(community_id, status);

-- Posts
CREATE INDEX IF NOT EXISTS idx_posts_community_created ON posts(community_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_author_created ON posts(author_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_visibility_created ON posts(visibility, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_posts_relationship ON posts(relationship_id);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(is_featured, created_at DESC) WHERE deleted_at IS NULL;

-- Comments
CREATE INDEX IF NOT EXISTS idx_comments_post_created ON comments(post_id, created_at) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_comments_author ON comments(author_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON comments(parent_comment_id);

-- Reactions
CREATE INDEX IF NOT EXISTS idx_reactions_target ON reactions(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_type ON reactions(target_type, target_id, reaction_type);

-- User Connections
CREATE INDEX IF NOT EXISTS idx_user_connections_follower ON user_connections(follower_id, status);
CREATE INDEX IF NOT EXISTS idx_user_connections_following ON user_connections(following_id, status);
CREATE INDEX IF NOT EXISTS idx_user_connections_type ON user_connections(connection_type, status);

-- User Blocks
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocker ON user_blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_user_blocks_blocked ON user_blocks(blocked_id);

-- Conversations
CREATE INDEX IF NOT EXISTS idx_conversations_created_by ON conversations(created_by);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_type ON conversations(type);

-- Conversation Participants
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user ON conversation_participants(user_id) WHERE left_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation ON conversation_participants(conversation_id);

-- Messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation_created ON messages(conversation_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);

-- Content Reports
CREATE INDEX IF NOT EXISTS idx_content_reports_target ON content_reports(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_reporter ON content_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_reports_reviewed_by ON content_reports(reviewed_by);

-- ============================================================================
-- TRIGGERS FOR DENORMALIZED COUNTS (Optional - can be handled in app)
-- ============================================================================

-- Note: These are PostgreSQL-style triggers. Adjust syntax if using different DB.

-- Update community member_count
CREATE OR REPLACE FUNCTION update_community_member_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
    UPDATE communities
    SET member_count = member_count + 1
    WHERE id = NEW.community_id;
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status != 'active' AND NEW.status = 'active' THEN
      UPDATE communities
      SET member_count = member_count + 1
      WHERE id = NEW.community_id;
    ELSIF OLD.status = 'active' AND NEW.status != 'active' THEN
      UPDATE communities
      SET member_count = GREATEST(member_count - 1, 0)
      WHERE id = NEW.community_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'active' THEN
    UPDATE communities
    SET member_count = GREATEST(member_count - 1, 0)
    WHERE id = OLD.community_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_community_member_count
AFTER INSERT OR UPDATE OR DELETE ON community_members
FOR EACH ROW EXECUTE FUNCTION update_community_member_count();

-- Update post like_count from reactions
CREATE OR REPLACE FUNCTION update_post_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.target_type = 'post' THEN
    UPDATE posts
    SET like_count = like_count + 1
    WHERE id = NEW.target_id;
  ELSIF TG_OP = 'DELETE' AND OLD.target_type = 'post' THEN
    UPDATE posts
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE id = OLD.target_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_like_count
AFTER INSERT OR DELETE ON reactions
FOR EACH ROW EXECUTE FUNCTION update_post_like_count();

-- Update comment like_count from reactions
CREATE OR REPLACE FUNCTION update_comment_like_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.target_type = 'comment' THEN
    UPDATE comments
    SET like_count = like_count + 1
    WHERE id = NEW.target_id;
  ELSIF TG_OP = 'DELETE' AND OLD.target_type = 'comment' THEN
    UPDATE comments
    SET like_count = GREATEST(like_count - 1, 0)
    WHERE id = OLD.target_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_comment_like_count
AFTER INSERT OR DELETE ON reactions
FOR EACH ROW EXECUTE FUNCTION update_comment_like_count();

-- Update post comment_count
CREATE OR REPLACE FUNCTION update_post_comment_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts
    SET comment_count = comment_count + 1
    WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts
    SET comment_count = GREATEST(comment_count - 1, 0)
    WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_post_comment_count
AFTER INSERT OR DELETE ON comments
FOR EACH ROW EXECUTE FUNCTION update_post_comment_count();

-- Update conversation last_message_at and preview
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE conversations
    SET
      last_message_at = NEW.created_at,
      last_message_preview = LEFT(NEW.content, 100)
    WHERE id = NEW.conversation_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_conversation_last_message
AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION update_conversation_last_message();
