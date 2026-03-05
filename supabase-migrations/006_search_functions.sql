-- 006: Search & Discovery RPC Functions
-- Used by src/api/discovery.ts for complex search queries that cannot be
-- expressed with the Supabase query builder alone.

-- Search users with connection status, blocked filtering, relevance ranking
CREATE OR REPLACE FUNCTION search_users_v1(
  p_query TEXT,
  p_user_id TEXT DEFAULT NULL,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  nickname TEXT,
  profile_photo_url TEXT,
  relationship_id TEXT,
  relationship_type TEXT,
  connection_status TEXT,
  follower_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  search_pattern TEXT := '%' || LOWER(p_query) || '%';
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.name,
    u.nickname,
    u.profile_photo_url,
    r.id as relationship_id,
    r.relationship_type,
    CASE
      WHEN p_user_id IS NULL THEN 'none'
      WHEN uc.status = 'accepted' THEN 'connected'
      WHEN uc.status = 'pending' AND uc.follower_id = p_user_id THEN 'pending_sent'
      WHEN uc.status = 'pending' AND uc.following_id = p_user_id THEN 'pending_received'
      ELSE 'none'
    END as connection_status,
    COALESCE((
      SELECT COUNT(*) FROM user_connections uc2
      WHERE uc2.follower_id = u.id AND uc2.status = 'accepted'
    ), 0) as follower_count
  FROM users u
  LEFT JOIN relationships r ON (r.user_1_id = u.id OR r.user_2_id = u.id) AND r.status = 'active'
  LEFT JOIN user_connections uc ON p_user_id IS NOT NULL AND (
    (uc.follower_id = p_user_id AND uc.following_id = u.id)
    OR (uc.follower_id = u.id AND uc.following_id = p_user_id)
  )
  WHERE (LOWER(u.name) LIKE search_pattern OR LOWER(u.nickname) LIKE search_pattern)
    AND (p_user_id IS NULL OR u.id != p_user_id)
    -- Exclude blocked users (bidirectional)
    AND NOT EXISTS (
      SELECT 1 FROM user_blocks ub
      WHERE (ub.blocker_id = p_user_id AND ub.blocked_id = u.id)
         OR (ub.blocker_id = u.id AND ub.blocked_id = p_user_id)
    )
  ORDER BY
    CASE
      WHEN LOWER(u.name) = LOWER(p_query) THEN 1
      WHEN LOWER(u.name) LIKE LOWER(p_query) || '%' THEN 2
      ELSE 3
    END,
    follower_count DESC,
    u.name
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- Search communities with membership status, privacy filtering, relevance ranking
CREATE OR REPLACE FUNCTION search_communities_v1(
  p_query TEXT,
  p_user_id TEXT DEFAULT NULL,
  p_category TEXT DEFAULT NULL,
  p_privacy_level TEXT DEFAULT NULL,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  slug TEXT,
  description TEXT,
  cover_image_url TEXT,
  category TEXT,
  privacy_level TEXT,
  member_count INT,
  post_count INT,
  is_verified BOOLEAN,
  is_featured BOOLEAN,
  membership_status TEXT,
  membership_role TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  search_pattern TEXT := '%' || LOWER(p_query) || '%';
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.slug,
    c.description,
    c.cover_image_url,
    c.category,
    c.privacy_level,
    c.member_count,
    c.post_count,
    c.is_verified,
    c.is_featured,
    cm.status as membership_status,
    cm.role as membership_role
  FROM communities c
  LEFT JOIN community_members cm ON p_user_id IS NOT NULL
    AND cm.community_id = c.id
    AND cm.user_id = p_user_id
    AND cm.status = 'active'
  WHERE (LOWER(c.name) LIKE search_pattern OR LOWER(c.description) LIKE search_pattern)
    AND (p_category IS NULL OR c.category = p_category)
    AND (p_privacy_level IS NULL OR c.privacy_level = p_privacy_level)
    AND (c.privacy_level = 'public' OR (p_user_id IS NOT NULL AND cm.user_id IS NOT NULL))
  ORDER BY
    c.is_featured DESC,
    c.is_verified DESC,
    c.member_count DESC,
    CASE
      WHEN LOWER(c.name) = LOWER(p_query) THEN 1
      WHEN LOWER(c.name) LIKE LOWER(p_query) || '%' THEN 2
      ELSE 3
    END
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- Search posts with visibility filtering and blocked user exclusion
CREATE OR REPLACE FUNCTION search_posts_v1(
  p_query TEXT,
  p_user_id TEXT DEFAULT NULL,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id TEXT,
  content TEXT,
  content_type TEXT,
  media_urls TEXT,
  like_count INT,
  comment_count INT,
  created_at TIMESTAMPTZ,
  author_id TEXT,
  author_name TEXT,
  author_photo TEXT,
  community_id TEXT,
  community_name TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  search_pattern TEXT := '%' || LOWER(p_query) || '%';
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.content,
    p.content_type,
    p.media_urls,
    p.like_count,
    p.comment_count,
    p.created_at,
    u.id as author_id,
    u.name as author_name,
    u.profile_photo_url as author_photo,
    c.id as community_id,
    c.name as community_name
  FROM posts p
  JOIN users u ON u.id = p.author_id
  LEFT JOIN communities c ON c.id = p.community_id
  WHERE LOWER(p.content) LIKE search_pattern
    AND p.deleted_at IS NULL
    AND p.is_hidden = FALSE
    AND (
      p.visibility = 'public'
      OR (p_user_id IS NOT NULL AND p.visibility = 'connections' AND EXISTS (
        SELECT 1 FROM user_connections uc
        WHERE uc.follower_id = p_user_id AND uc.following_id = p.author_id
        AND uc.status = 'accepted'
      ))
      OR (p_user_id IS NOT NULL AND p.visibility = 'community' AND EXISTS (
        SELECT 1 FROM community_members cm
        WHERE cm.community_id = p.community_id
        AND cm.user_id = p_user_id
        AND cm.status = 'active'
      ))
    )
    -- Exclude blocked users
    AND NOT EXISTS (
      SELECT 1 FROM user_blocks ub
      WHERE p_user_id IS NOT NULL
        AND ((ub.blocker_id = p_user_id AND ub.blocked_id = p.author_id)
          OR (ub.blocker_id = p.author_id AND ub.blocked_id = p_user_id))
    )
  ORDER BY p.created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;

-- Discover users based on similarity scoring
CREATE OR REPLACE FUNCTION discover_users_v1(
  p_user_id TEXT,
  p_limit INT DEFAULT 20,
  p_offset INT DEFAULT 0
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  nickname TEXT,
  profile_photo_url TEXT,
  relationship_type TEXT,
  similarity_score BIGINT,
  follower_count BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    u.id,
    u.name,
    u.nickname,
    u.profile_photo_url,
    r.relationship_type,
    (
      -- Mutual connections (weight: 3)
      COALESCE((
        SELECT COUNT(*) * 3 FROM user_connections uc1
        JOIN user_connections uc2 ON uc1.following_id = uc2.following_id
        WHERE uc1.follower_id = p_user_id
        AND uc2.follower_id = u.id
        AND uc1.status = 'accepted'
        AND uc2.status = 'accepted'
      ), 0) +
      -- Shared communities (weight: 2)
      COALESCE((
        SELECT COUNT(*) * 2 FROM community_members cm1
        JOIN community_members cm2 ON cm1.community_id = cm2.community_id
        WHERE cm1.user_id = p_user_id
        AND cm2.user_id = u.id
        AND cm1.status = 'active'
        AND cm2.status = 'active'
      ), 0)
    )::BIGINT as similarity_score,
    COALESCE((SELECT COUNT(*) FROM user_connections WHERE following_id = u.id AND status = 'accepted'), 0)::BIGINT as follower_count
  FROM users u
  LEFT JOIN relationships r ON (r.user_1_id = u.id OR r.user_2_id = u.id) AND r.status = 'active'
  WHERE u.id != p_user_id
    -- Not already following
    AND u.id NOT IN (
      SELECT following_id FROM user_connections
      WHERE follower_id = p_user_id
    )
    -- Not blocked
    AND NOT EXISTS (
      SELECT 1 FROM user_blocks ub
      WHERE (ub.blocker_id = p_user_id AND ub.blocked_id = u.id)
         OR (ub.blocker_id = u.id AND ub.blocked_id = p_user_id)
    )
    -- Has at least one connection factor
    AND (
      EXISTS (
        SELECT 1 FROM user_connections uc1
        JOIN user_connections uc2 ON uc1.following_id = uc2.following_id
        WHERE uc1.follower_id = p_user_id AND uc2.follower_id = u.id
        AND uc1.status = 'accepted' AND uc2.status = 'accepted'
      )
      OR EXISTS (
        SELECT 1 FROM community_members cm1
        JOIN community_members cm2 ON cm1.community_id = cm2.community_id
        WHERE cm1.user_id = p_user_id AND cm2.user_id = u.id
        AND cm1.status = 'active' AND cm2.status = 'active'
      )
    )
  ORDER BY similarity_score DESC, follower_count DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$;
