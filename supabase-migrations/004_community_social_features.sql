-- Better Together: Community & Social Features
-- Date: 2025-12-28
-- Social networking, communities, messaging, and content sharing for couples

-- ============================================================================
-- COMMUNITIES & GROUPS
-- ============================================================================

-- Communities table - Groups for couples with shared interests
CREATE TABLE IF NOT EXISTS communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  cover_image_url TEXT,

  -- Privacy & Access
  privacy_level VARCHAR(50) DEFAULT 'public' CHECK(privacy_level IN ('public', 'private', 'invite_only')),

  -- Categorization
  category VARCHAR(50) CHECK(category IN (
    'relationship_stage',    -- Newlyweds, Long-distance, etc.
    'interests',             -- Travel, Fitness, Cooking, etc.
    'location',              -- City/Region based
    'support',               -- Therapy, Challenges, etc.
    'lifestyle',             -- DINK, Parents, etc.
    'other'
  )),

  -- Ownership & Stats
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,

  -- Featured & Verification
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Community Members table - Track membership and roles
CREATE TABLE IF NOT EXISTS community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  relationship_id UUID REFERENCES relationships(id) ON DELETE SET NULL,

  -- Role & Permissions
  role VARCHAR(50) DEFAULT 'member' CHECK(role IN ('owner', 'admin', 'moderator', 'member')),

  -- Status
  status VARCHAR(50) DEFAULT 'active' CHECK(status IN ('pending', 'active', 'banned', 'left')),

  -- Invitation tracking
  invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  invited_at TIMESTAMPTZ,

  -- Activity
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW(),

  -- Preferences
  notification_preferences JSONB DEFAULT '{}',

  UNIQUE(community_id, user_id)
);

-- Community Invites table - Track invite codes
CREATE TABLE IF NOT EXISTS community_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  invited_email VARCHAR(255),

  -- Invite Code
  invite_code VARCHAR(100) UNIQUE NOT NULL,

  -- Status
  status VARCHAR(50) DEFAULT 'pending' CHECK(status IN ('pending', 'accepted', 'expired', 'revoked')),

  -- Expiration
  expires_at TIMESTAMPTZ NOT NULL,
  accepted_at TIMESTAMPTZ,
  accepted_by UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- POSTS & CONTENT (Additional - posts table already exists)
-- ============================================================================

-- Comments table - Nested comment system
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,

  -- Content
  content TEXT NOT NULL,

  -- Denormalized counts
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- Reactions table - Multi-type reactions for posts and comments
CREATE TABLE IF NOT EXISTS reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Polymorphic target
  target_type VARCHAR(50) NOT NULL CHECK(target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,

  -- Reaction type
  reaction_type VARCHAR(50) DEFAULT 'like' CHECK(reaction_type IN (
    'like',                  -- Basic like
    'love',                  -- Heart/love
    'celebrate',             -- Party/celebration
    'support',               -- Hug/support
    'insightful'             -- Lightbulb/helpful
  )),

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- One reaction per user per target
  UNIQUE(user_id, target_type, target_id)
);

-- ============================================================================
-- CONNECTIONS & SOCIAL GRAPH
-- ============================================================================

-- User Connections table - Follow/friend relationships
CREATE TABLE IF NOT EXISTS user_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Connection type
  connection_type VARCHAR(50) DEFAULT 'follow' CHECK(connection_type IN ('follow', 'friend')),

  -- Status (for friend requests)
  status VARCHAR(50) DEFAULT 'accepted' CHECK(status IN ('pending', 'accepted', 'rejected', 'blocked')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Can't follow yourself
  CHECK (follower_id != following_id),

  -- One connection per pair
  UNIQUE(follower_id, following_id)
);

-- User Blocks table - Block unwanted interactions
CREATE TABLE IF NOT EXISTS user_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Optional reason
  reason VARCHAR(50) CHECK(reason IN ('spam', 'harassment', 'inappropriate', 'other')),
  notes TEXT,

  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW(),

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
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Type
  type VARCHAR(50) DEFAULT 'direct' CHECK(type IN ('direct', 'group')),

  -- Group chat details
  name VARCHAR(255),
  avatar_url TEXT,

  -- Creator
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Activity
  last_message_at TIMESTAMPTZ,
  last_message_preview TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversation Participants table - Who's in each conversation
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Role (for group chats)
  role VARCHAR(50) DEFAULT 'member' CHECK(role IN ('owner', 'admin', 'member')),

  -- Activity
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  left_at TIMESTAMPTZ,
  last_read_at TIMESTAMPTZ,

  -- Settings
  is_muted BOOLEAN DEFAULT FALSE,

  UNIQUE(conversation_id, user_id)
);

-- Messages table - Individual messages in conversations
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Content
  message_type VARCHAR(50) DEFAULT 'text' CHECK(message_type IN (
    'text',
    'image',
    'activity_share',        -- Share an activity
    'post_share',            -- Share a post
    'challenge_share'        -- Share a challenge
  )),
  content TEXT,
  media_url TEXT,

  -- Shared content IDs
  shared_activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  shared_post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  shared_challenge_id UUID REFERENCES challenges(id) ON DELETE SET NULL,

  -- Editing
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================================
-- MODERATION & REPORTING
-- ============================================================================

-- Content Reports table - User-generated reports for moderation
CREATE TABLE IF NOT EXISTS content_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  -- Target (polymorphic)
  target_type VARCHAR(50) NOT NULL CHECK(target_type IN (
    'post',
    'comment',
    'message',
    'user',
    'community'
  )),
  target_id UUID NOT NULL,

  -- Report details
  reason VARCHAR(50) NOT NULL CHECK(reason IN (
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
  status VARCHAR(50) DEFAULT 'pending' CHECK(status IN (
    'pending',
    'under_review',
    'action_taken',
    'dismissed',
    'duplicate'
  )),

  -- Review tracking
  reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  moderator_notes TEXT,
  action_taken TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Communities
CREATE INDEX idx_communities_slug ON communities(slug);
CREATE INDEX idx_communities_category ON communities(category);
CREATE INDEX idx_communities_privacy ON communities(privacy_level);
CREATE INDEX idx_communities_featured ON communities(is_featured, member_count DESC);
CREATE INDEX idx_communities_created_by ON communities(created_by);

-- Community Members
CREATE INDEX idx_community_members_community_status ON community_members(community_id, status);
CREATE INDEX idx_community_members_user ON community_members(user_id);
CREATE INDEX idx_community_members_relationship ON community_members(relationship_id);

-- Community Invites
CREATE INDEX idx_community_invites_code ON community_invites(invite_code);
CREATE INDEX idx_community_invites_email ON community_invites(invited_email);
CREATE INDEX idx_community_invites_status ON community_invites(community_id, status);

-- Comments
CREATE INDEX idx_comments_post_created ON comments(post_id, created_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_comments_author ON comments(author_id);
CREATE INDEX idx_comments_parent ON comments(parent_comment_id);

-- Reactions
CREATE INDEX idx_reactions_target ON reactions(target_type, target_id);
CREATE INDEX idx_reactions_user ON reactions(user_id);
CREATE INDEX idx_reactions_type ON reactions(target_type, target_id, reaction_type);

-- User Connections
CREATE INDEX idx_user_connections_follower ON user_connections(follower_id, status);
CREATE INDEX idx_user_connections_following ON user_connections(following_id, status);
CREATE INDEX idx_user_connections_type ON user_connections(connection_type, status);

-- User Blocks
CREATE INDEX idx_user_blocks_blocker ON user_blocks(blocker_id);
CREATE INDEX idx_user_blocks_blocked ON user_blocks(blocked_id);

-- Conversations
CREATE INDEX idx_conversations_created_by ON conversations(created_by);
CREATE INDEX idx_conversations_last_message ON conversations(last_message_at DESC);
CREATE INDEX idx_conversations_type ON conversations(type);

-- Conversation Participants
CREATE INDEX idx_conversation_participants_user ON conversation_participants(user_id) WHERE left_at IS NULL;
CREATE INDEX idx_conversation_participants_conversation ON conversation_participants(conversation_id);

-- Messages
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_messages_sender ON messages(sender_id);

-- Content Reports
CREATE INDEX idx_content_reports_target ON content_reports(target_type, target_id);
CREATE INDEX idx_content_reports_reporter ON content_reports(reporter_id);
CREATE INDEX idx_content_reports_status ON content_reports(status, created_at DESC);
CREATE INDEX idx_content_reports_reviewed_by ON content_reports(reviewed_by);

-- ============================================================================
-- TRIGGERS FOR DENORMALIZED COUNTS
-- ============================================================================

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

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Communities
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public communities are viewable by everyone"
ON communities FOR SELECT
USING (privacy_level = 'public');

CREATE POLICY "Users can view communities they're members of"
ON communities FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM community_members
    WHERE community_members.community_id = communities.id
    AND community_members.user_id = auth.uid()
    AND community_members.status = 'active'
  )
);

CREATE POLICY "Users can create communities"
ON communities FOR INSERT
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Community owners/admins can update communities"
ON communities FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM community_members
    WHERE community_members.community_id = communities.id
    AND community_members.user_id = auth.uid()
    AND community_members.role IN ('owner', 'admin')
  )
);

-- Community Members
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view community members"
ON community_members FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM community_members cm
    WHERE cm.community_id = community_members.community_id
    AND cm.user_id = auth.uid()
    AND cm.status = 'active'
  )
);

CREATE POLICY "Users can join communities"
ON community_members FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own membership"
ON community_members FOR UPDATE
USING (user_id = auth.uid());

-- Comments
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comments on visible posts"
ON comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM posts
    WHERE posts.id = comments.post_id
    AND deleted_at IS NULL
  )
);

CREATE POLICY "Users can create comments"
ON comments FOR INSERT
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own comments"
ON comments FOR UPDATE
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own comments"
ON comments FOR DELETE
USING (auth.uid() = author_id);

-- Reactions
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all reactions"
ON reactions FOR SELECT
USING (true);

CREATE POLICY "Users can create own reactions"
ON reactions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reactions"
ON reactions FOR DELETE
USING (auth.uid() = user_id);

-- User Connections
ALTER TABLE user_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own connections"
ON user_connections FOR SELECT
USING (follower_id = auth.uid() OR following_id = auth.uid());

CREATE POLICY "Users can create connections"
ON user_connections FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can update own connections"
ON user_connections FOR UPDATE
USING (follower_id = auth.uid() OR following_id = auth.uid());

CREATE POLICY "Users can delete own connections"
ON user_connections FOR DELETE
USING (follower_id = auth.uid());

-- User Blocks
ALTER TABLE user_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own blocks"
ON user_blocks FOR SELECT
USING (blocker_id = auth.uid());

CREATE POLICY "Users can create blocks"
ON user_blocks FOR INSERT
WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can delete own blocks"
ON user_blocks FOR DELETE
USING (blocker_id = auth.uid());

-- Conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view conversations they're part of"
ON conversations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = conversations.id
    AND conversation_participants.user_id = auth.uid()
    AND conversation_participants.left_at IS NULL
  )
);

CREATE POLICY "Users can create conversations"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = created_by);

-- Conversation Participants
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view conversation participants"
ON conversation_participants FOR SELECT
USING (
  user_id = auth.uid() OR
  EXISTS (
    SELECT 1 FROM conversation_participants cp
    WHERE cp.conversation_id = conversation_participants.conversation_id
    AND cp.user_id = auth.uid()
    AND cp.left_at IS NULL
  )
);

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = messages.conversation_id
    AND conversation_participants.user_id = auth.uid()
    AND conversation_participants.left_at IS NULL
  )
);

CREATE POLICY "Users can create messages in their conversations"
ON messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_participants.conversation_id = messages.conversation_id
    AND conversation_participants.user_id = auth.uid()
    AND conversation_participants.left_at IS NULL
  )
);

-- Content Reports
ALTER TABLE content_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reports"
ON content_reports FOR SELECT
USING (reporter_id = auth.uid());

CREATE POLICY "Users can create reports"
ON content_reports FOR INSERT
WITH CHECK (auth.uid() = reporter_id);
