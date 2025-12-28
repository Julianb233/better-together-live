// Better Together: Activity Feed API
// Handles personalized feed, trending posts, community feeds, and user feeds

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'

const feedApi = new Hono()

// GET /api/feed - Get personalized feed
feedApi.get('/', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.req.query('userId')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const filter = c.req.query('filter') || 'all' // all, communities, connections

    if (!userId) {
      return c.json({ error: 'User ID required' }, 400)
    }

    const offset = (page - 1) * limit

    // Get user's blocked users to filter out
    const blockedUsers = await db.all<{ blocked_id: string }>(`
      SELECT blocked_id FROM user_blocks WHERE blocker_id = $1
    `, [userId])

    const blockedUserIds = blockedUsers.map(b => b.blocked_id)
    const blockedFilter = blockedUserIds.length > 0
      ? `AND p.author_id NOT IN (${blockedUserIds.map((_, i) => `$${i + 5}`).join(', ')})`
      : ''

    let visibilityConditions = ''
    let queryParams: any[] = [userId, userId, limit, offset]

    if (filter === 'communities') {
      // Only posts from user's communities
      visibilityConditions = `
        AND p.community_id IN (
          SELECT community_id FROM community_members
          WHERE user_id = $1 AND status = 'active'
        )
      `
    } else if (filter === 'connections') {
      // Only posts from connections
      visibilityConditions = `
        AND (
          p.author_id IN (
            SELECT following_id FROM user_connections
            WHERE follower_id = $1 AND status = 'accepted'
          )
          OR p.author_id = $1
        )
        AND (p.visibility = 'public' OR p.visibility = 'connections')
      `
    } else {
      // All: communities + connections + public
      visibilityConditions = `
        AND (
          -- User's own posts
          p.author_id = $1
          -- Public posts
          OR p.visibility = 'public'
          -- Posts from communities user is in
          OR (p.visibility = 'community' AND p.community_id IN (
            SELECT community_id FROM community_members
            WHERE user_id = $1 AND status = 'active'
          ))
          -- Posts from connections
          OR (p.visibility = 'connections' AND p.author_id IN (
            SELECT following_id FROM user_connections
            WHERE follower_id = $1 AND status = 'accepted'
          ))
        )
      `
    }

    // Add blocked users to params if any
    if (blockedUserIds.length > 0) {
      queryParams = [...queryParams, ...blockedUserIds]
    }

    // Fetch posts with engagement-based ranking
    const posts = await db.all<any>(`
      SELECT
        p.*,
        u.name as author_name,
        u.profile_photo_url as author_photo,
        c.name as community_name,
        c.slug as community_slug,
        r.reaction_type as user_reaction,
        -- Engagement score for ranking
        (
          p.like_count * 1.0 +
          p.comment_count * 2.0 +
          p.share_count * 3.0 +
          CASE WHEN p.is_featured THEN 100 ELSE 0 END +
          CASE WHEN p.is_pinned THEN 50 ELSE 0 END
        ) / (EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - p.created_at)) / 3600 + 2) ^ 1.5 as engagement_score
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN communities c ON p.community_id = c.id
      LEFT JOIN reactions r ON r.target_type = 'post' AND r.target_id = p.id AND r.user_id = $2
      WHERE p.deleted_at IS NULL
        ${visibilityConditions}
        ${blockedFilter}
      ORDER BY engagement_score DESC, p.created_at DESC
      LIMIT $3 OFFSET $4
    `, queryParams)

    // Format response
    const formattedPosts = posts.map(post => ({
      id: post.id,
      authorId: post.author_id,
      authorName: post.author_name,
      authorPhoto: post.author_photo,
      relationshipId: post.relationship_id,
      communityId: post.community_id,
      communityName: post.community_name,
      communitySlug: post.community_slug,
      contentType: post.content_type,
      content: post.content,
      mediaUrls: post.media_urls ? JSON.parse(post.media_urls) : [],
      linkedActivityId: post.linked_activity_id,
      linkedChallengeId: post.linked_challenge_id,
      linkedAchievementId: post.linked_achievement_id,
      visibility: post.visibility,
      isPinned: post.is_pinned,
      isFeatured: post.is_featured,
      likeCount: post.like_count,
      commentCount: post.comment_count,
      shareCount: post.share_count,
      userReaction: post.user_reaction,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    }))

    return c.json({
      posts: formattedPosts,
      page,
      limit,
      hasMore: formattedPosts.length === limit
    })
  } catch (error) {
    console.error('Get feed error:', error)
    return c.json({ error: 'Failed to get feed' }, 500)
  }
})

// GET /api/feed/trending - Get trending posts
feedApi.get('/trending', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const timeframe = c.req.query('timeframe') || '24h' // 24h, week, month
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const userId = c.req.query('userId') // Optional for user reactions

    const offset = (page - 1) * limit

    // Calculate time threshold
    let timeThreshold = 'CURRENT_TIMESTAMP - INTERVAL \'24 hours\''
    if (timeframe === 'week') {
      timeThreshold = 'CURRENT_TIMESTAMP - INTERVAL \'7 days\''
    } else if (timeframe === 'month') {
      timeThreshold = 'CURRENT_TIMESTAMP - INTERVAL \'30 days\''
    }

    // Get blocked users if userId provided
    let blockedUserIds: string[] = []
    if (userId) {
      const blockedUsers = await db.all<{ blocked_id: string }>(`
        SELECT blocked_id FROM user_blocks WHERE blocker_id = $1
      `, [userId])
      blockedUserIds = blockedUsers.map(b => b.blocked_id)
    }

    const blockedFilter = blockedUserIds.length > 0
      ? `AND p.author_id NOT IN (${blockedUserIds.map((_, i) => `$${i + 3}`).join(', ')})`
      : ''

    const queryParams = userId
      ? [limit, offset, userId, ...blockedUserIds]
      : [limit, offset, ...blockedUserIds]

    // Trending algorithm: weighted by recency + engagement
    const posts = await db.all<any>(`
      SELECT
        p.*,
        u.name as author_name,
        u.profile_photo_url as author_photo,
        c.name as community_name,
        c.slug as community_slug,
        ${userId ? 'r.reaction_type as user_reaction,' : ''}
        -- Trending score: engagement weighted by recency
        (
          p.like_count * 1.0 +
          p.comment_count * 3.0 +
          p.share_count * 5.0
        ) / POWER(
          GREATEST(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - p.created_at)) / 3600, 1),
          1.8
        ) as trending_score
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN communities c ON p.community_id = c.id
      ${userId ? 'LEFT JOIN reactions r ON r.target_type = \'post\' AND r.target_id = p.id AND r.user_id = $3' : ''}
      WHERE p.deleted_at IS NULL
        AND p.visibility = 'public'
        AND p.created_at >= ${timeThreshold}
        ${blockedFilter}
      ORDER BY trending_score DESC, p.created_at DESC
      LIMIT $1 OFFSET $2
    `, queryParams)

    const formattedPosts = posts.map(post => ({
      id: post.id,
      authorId: post.author_id,
      authorName: post.author_name,
      authorPhoto: post.author_photo,
      relationshipId: post.relationship_id,
      communityId: post.community_id,
      communityName: post.community_name,
      communitySlug: post.community_slug,
      contentType: post.content_type,
      content: post.content,
      mediaUrls: post.media_urls ? JSON.parse(post.media_urls) : [],
      linkedActivityId: post.linked_activity_id,
      linkedChallengeId: post.linked_challenge_id,
      linkedAchievementId: post.linked_achievement_id,
      visibility: post.visibility,
      isPinned: post.is_pinned,
      isFeatured: post.is_featured,
      likeCount: post.like_count,
      commentCount: post.comment_count,
      shareCount: post.share_count,
      userReaction: post.user_reaction || null,
      trendingScore: post.trending_score,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    }))

    return c.json({
      posts: formattedPosts,
      timeframe,
      page,
      limit,
      hasMore: formattedPosts.length === limit
    })
  } catch (error) {
    console.error('Get trending feed error:', error)
    return c.json({ error: 'Failed to get trending feed' }, 500)
  }
})

// GET /api/feed/community/:communityId - Community-specific feed
feedApi.get('/community/:communityId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const communityId = c.req.param('communityId')
    const userId = c.req.query('userId')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const pinnedFirst = c.req.query('pinnedFirst') === 'true'

    const offset = (page - 1) * limit

    // Check if community exists
    const community = await db.first<{ id: string; privacy_level: string }>(`
      SELECT id, privacy_level FROM communities WHERE id = $1
    `, [communityId])

    if (!community) {
      return c.json({ error: 'Community not found' }, 404)
    }

    // Check user access
    if (community.privacy_level !== 'public') {
      if (!userId) {
        return c.json({ error: 'Access denied' }, 403)
      }

      const membership = await db.first<{ status: string }>(`
        SELECT status FROM community_members
        WHERE community_id = $1 AND user_id = $2
      `, [communityId, userId])

      if (!membership || membership.status !== 'active') {
        return c.json({ error: 'Access denied - not a member' }, 403)
      }
    }

    // Get blocked users if userId provided
    let blockedUserIds: string[] = []
    if (userId) {
      const blockedUsers = await db.all<{ blocked_id: string }>(`
        SELECT blocked_id FROM user_blocks WHERE blocker_id = $1
      `, [userId])
      blockedUserIds = blockedUsers.map(b => b.blocked_id)
    }

    const blockedFilter = blockedUserIds.length > 0
      ? `AND p.author_id NOT IN (${blockedUserIds.map((_, i) => `$${i + 4}`).join(', ')})`
      : ''

    const orderBy = pinnedFirst
      ? 'p.is_pinned DESC, p.created_at DESC'
      : 'p.created_at DESC'

    const queryParams = userId
      ? [communityId, userId, limit, offset, ...blockedUserIds]
      : [communityId, limit, offset, ...blockedUserIds]

    const posts = await db.all<any>(`
      SELECT
        p.*,
        u.name as author_name,
        u.profile_photo_url as author_photo,
        ${userId ? 'r.reaction_type as user_reaction' : 'NULL as user_reaction'}
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      ${userId ? 'LEFT JOIN reactions r ON r.target_type = \'post\' AND r.target_id = p.id AND r.user_id = $2' : ''}
      WHERE p.community_id = $1
        AND p.deleted_at IS NULL
        ${blockedFilter}
      ORDER BY ${orderBy}
      LIMIT ${userId ? '$3' : '$2'} OFFSET ${userId ? '$4' : '$3'}
    `, queryParams)

    const formattedPosts = posts.map(post => ({
      id: post.id,
      authorId: post.author_id,
      authorName: post.author_name,
      authorPhoto: post.author_photo,
      relationshipId: post.relationship_id,
      communityId: post.community_id,
      contentType: post.content_type,
      content: post.content,
      mediaUrls: post.media_urls ? JSON.parse(post.media_urls) : [],
      linkedActivityId: post.linked_activity_id,
      linkedChallengeId: post.linked_challenge_id,
      linkedAchievementId: post.linked_achievement_id,
      visibility: post.visibility,
      isPinned: post.is_pinned,
      isFeatured: post.is_featured,
      likeCount: post.like_count,
      commentCount: post.comment_count,
      shareCount: post.share_count,
      userReaction: post.user_reaction,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    }))

    return c.json({
      posts: formattedPosts,
      communityId,
      page,
      limit,
      hasMore: formattedPosts.length === limit
    })
  } catch (error) {
    console.error('Get community feed error:', error)
    return c.json({ error: 'Failed to get community feed' }, 500)
  }
})

// GET /api/feed/user/:userId - User-specific feed (their posts)
feedApi.get('/user/:targetUserId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const targetUserId = c.req.param('targetUserId')
    const viewerUserId = c.req.query('viewerId') // User viewing the feed
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')

    const offset = (page - 1) * limit

    // Check if target user exists
    const targetUser = await db.first<{ id: string; name: string }>(`
      SELECT id, name FROM users WHERE id = $1
    `, [targetUserId])

    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404)
    }

    // Check if viewer is blocked
    if (viewerUserId) {
      const isBlocked = await db.first<{ id: string }>(`
        SELECT id FROM user_blocks
        WHERE blocker_id = $1 AND blocked_id = $2
      `, [targetUserId, viewerUserId])

      if (isBlocked) {
        return c.json({ error: 'Access denied' }, 403)
      }
    }

    // Determine visibility filter
    let visibilityConditions = ''
    if (!viewerUserId || viewerUserId !== targetUserId) {
      // Not logged in or viewing someone else's profile
      if (viewerUserId) {
        // Check if connected
        const isConnected = await db.first<{ id: string }>(`
          SELECT id FROM user_connections
          WHERE follower_id = $1 AND following_id = $2 AND status = 'accepted'
        `, [viewerUserId, targetUserId])

        if (isConnected) {
          visibilityConditions = `AND p.visibility IN ('public', 'connections')`
        } else {
          visibilityConditions = `AND p.visibility = 'public'`
        }
      } else {
        visibilityConditions = `AND p.visibility = 'public'`
      }
    }
    // If viewing own profile, show all posts (no visibility filter)

    const queryParams = viewerUserId
      ? [targetUserId, viewerUserId, limit, offset]
      : [targetUserId, limit, offset]

    const posts = await db.all<any>(`
      SELECT
        p.*,
        u.name as author_name,
        u.profile_photo_url as author_photo,
        c.name as community_name,
        c.slug as community_slug,
        ${viewerUserId ? 'r.reaction_type as user_reaction' : 'NULL as user_reaction'}
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      LEFT JOIN communities c ON p.community_id = c.id
      ${viewerUserId ? 'LEFT JOIN reactions r ON r.target_type = \'post\' AND r.target_id = p.id AND r.user_id = $2' : ''}
      WHERE p.author_id = $1
        AND p.deleted_at IS NULL
        ${visibilityConditions}
      ORDER BY p.created_at DESC
      LIMIT ${viewerUserId ? '$3' : '$2'} OFFSET ${viewerUserId ? '$4' : '$3'}
    `, queryParams)

    const formattedPosts = posts.map(post => ({
      id: post.id,
      authorId: post.author_id,
      authorName: post.author_name,
      authorPhoto: post.author_photo,
      relationshipId: post.relationship_id,
      communityId: post.community_id,
      communityName: post.community_name,
      communitySlug: post.community_slug,
      contentType: post.content_type,
      content: post.content,
      mediaUrls: post.media_urls ? JSON.parse(post.media_urls) : [],
      linkedActivityId: post.linked_activity_id,
      linkedChallengeId: post.linked_challenge_id,
      linkedAchievementId: post.linked_achievement_id,
      visibility: post.visibility,
      isPinned: post.is_pinned,
      isFeatured: post.is_featured,
      likeCount: post.like_count,
      commentCount: post.comment_count,
      shareCount: post.share_count,
      userReaction: post.user_reaction,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    }))

    return c.json({
      posts: formattedPosts,
      userId: targetUserId,
      userName: targetUser.name,
      page,
      limit,
      hasMore: formattedPosts.length === limit
    })
  } catch (error) {
    console.error('Get user feed error:', error)
    return c.json({ error: 'Failed to get user feed' }, 500)
  }
})

export default feedApi
