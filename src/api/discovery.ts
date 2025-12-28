// Better Together: Discovery and Search API
// Handles universal search, user/community discovery, trending content, and recommendations

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import { verifyToken, extractToken } from './auth'

const discoveryApi = new Hono()

/**
 * Helper: Get authenticated user ID (optional - some endpoints are public)
 */
async function getAuthUserId(c: Context): Promise<string | null> {
  const token = extractToken(c, 'access')
  if (!token) return null
  const payload = await verifyToken(token, c.env, 'access')
  return payload?.userId || null
}

/**
 * Helper: Check if user is blocked
 */
async function getBlockedUserIds(db: any, userId: string): Promise<string[]> {
  const blocks = await db.all(
    `SELECT blocked_id FROM user_blocks WHERE blocker_id = $1
     UNION
     SELECT blocker_id FROM user_blocks WHERE blocked_id = $1`,
    [userId]
  )
  return blocks.map((b: { blocked_id: string }) => b.blocked_id)
}

// ============================================================================
// SEARCH ENDPOINTS
// ============================================================================

/**
 * GET /api/search
 * Universal search across users, communities, and posts
 */
discoveryApi.get('/search', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = await getAuthUserId(c)

    const q = c.req.query('q') || ''
    const type = c.req.query('type') || 'all'
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '10')
    const offset = (page - 1) * limit

    if (!q || q.length < 2) {
      return c.json({ error: 'Search query must be at least 2 characters' }, 400)
    }

    const blockedIds = userId ? await getBlockedUserIds(db, userId) : []
    const blockedFilter = blockedIds.length > 0
      ? `AND u.id NOT IN (${blockedIds.map(() => '?').join(', ')})`
      : ''

    const searchPattern = `%${q.toLowerCase()}%`
    const results: any = {}

    // Search Users
    if (type === 'all' || type === 'users') {
      const users = await db.all<any>(`
        SELECT
          u.id,
          u.name,
          u.nickname,
          u.profile_photo_url,
          r.id as relationship_id,
          r.relationship_type,
          ${userId ? `
            CASE
              WHEN uc.status = 'accepted' THEN 'connected'
              WHEN uc.status = 'pending' THEN 'pending'
              ELSE 'none'
            END as connection_status
          ` : `'none' as connection_status`}
        FROM users u
        LEFT JOIN relationships r ON (r.user_1_id = u.id OR r.user_2_id = u.id) AND r.status = 'active'
        ${userId ? `
          LEFT JOIN user_connections uc ON (
            (uc.follower_id = $1 AND uc.following_id = u.id)
            OR (uc.follower_id = u.id AND uc.following_id = $1)
          )
        ` : ''}
        WHERE (LOWER(u.name) LIKE $${userId ? 2 : 1} OR LOWER(u.nickname) LIKE $${userId ? 2 : 1})
        ${blockedFilter}
        ${userId ? `AND u.id != $1` : ''}
        ORDER BY
          CASE
            WHEN LOWER(u.name) = LOWER($${userId ? 3 : 2}) THEN 1
            WHEN LOWER(u.name) LIKE LOWER($${userId ? 3 : 2}) || '%' THEN 2
            ELSE 3
          END,
          u.name
        LIMIT $${userId ? 4 : 3} OFFSET $${userId ? 5 : 4}
      `, userId
        ? [userId, searchPattern, q, limit, offset, ...blockedIds]
        : [searchPattern, q, limit, offset]
      )

      results.users = users.map(u => ({
        id: u.id,
        name: u.name,
        nickname: u.nickname,
        profilePhotoUrl: u.profile_photo_url,
        relationshipType: u.relationship_type,
        connectionStatus: u.connection_status
      }))
    }

    // Search Communities
    if (type === 'all' || type === 'communities') {
      const communities = await db.all<any>(`
        SELECT
          c.id,
          c.name,
          c.slug,
          c.description,
          c.cover_image_url,
          c.category,
          c.privacy_level,
          c.member_count,
          c.is_verified,
          c.is_featured,
          ${userId ? `
            cm.status as membership_status,
            cm.role as membership_role
          ` : `
            NULL as membership_status,
            NULL as membership_role
          `}
        FROM communities c
        ${userId ? `
          LEFT JOIN community_members cm ON cm.community_id = c.id
            AND cm.user_id = $1
            AND cm.status = 'active'
        ` : ''}
        WHERE (LOWER(c.name) LIKE $${userId ? 2 : 1} OR LOWER(c.description) LIKE $${userId ? 2 : 1})
        AND (c.privacy_level = 'public' ${userId ? `OR cm.user_id IS NOT NULL` : ''})
        ORDER BY
          c.is_featured DESC,
          c.is_verified DESC,
          c.member_count DESC,
          CASE
            WHEN LOWER(c.name) = LOWER($${userId ? 3 : 2}) THEN 1
            WHEN LOWER(c.name) LIKE LOWER($${userId ? 3 : 2}) || '%' THEN 2
            ELSE 3
          END
        LIMIT $${userId ? 4 : 3} OFFSET $${userId ? 5 : 4}
      `, userId
        ? [userId, searchPattern, q, limit, offset]
        : [searchPattern, q, limit, offset]
      )

      results.communities = communities.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        coverImageUrl: c.cover_image_url,
        category: c.category,
        privacyLevel: c.privacy_level,
        memberCount: c.member_count,
        isVerified: c.is_verified,
        isFeatured: c.is_featured,
        membershipStatus: c.membership_status,
        membershipRole: c.membership_role
      }))
    }

    // Search Posts (only public posts unless user is authenticated)
    if (type === 'all' || type === 'posts') {
      const visibilityFilter = userId
        ? `AND (
            p.visibility = 'public'
            OR (p.visibility = 'connections' AND EXISTS (
              SELECT 1 FROM user_connections uc
              WHERE (uc.follower_id = $1 AND uc.following_id = p.author_id)
              AND uc.status = 'accepted'
            ))
            OR (p.visibility = 'community' AND EXISTS (
              SELECT 1 FROM community_members cm
              WHERE cm.community_id = p.community_id
              AND cm.user_id = $1
              AND cm.status = 'active'
            ))
          )`
        : `AND p.visibility = 'public'`

      const posts = await db.all<any>(`
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
        WHERE LOWER(p.content) LIKE $${userId ? 2 : 1}
        AND p.deleted_at IS NULL
        AND p.is_hidden = FALSE
        ${visibilityFilter}
        ${blockedIds.length > 0 ? `AND p.author_id NOT IN (${blockedIds.map(() => '?').join(', ')})` : ''}
        ORDER BY p.created_at DESC
        LIMIT $${userId ? 3 : 2} OFFSET $${userId ? 4 : 3}
      `, userId
        ? [userId, searchPattern, limit, offset, ...blockedIds]
        : [searchPattern, limit, offset]
      )

      results.posts = posts.map(p => ({
        id: p.id,
        content: p.content,
        contentType: p.content_type,
        mediaUrls: p.media_urls ? JSON.parse(p.media_urls) : null,
        likeCount: p.like_count,
        commentCount: p.comment_count,
        createdAt: p.created_at,
        author: {
          id: p.author_id,
          name: p.author_name,
          profilePhotoUrl: p.author_photo
        },
        community: p.community_id ? {
          id: p.community_id,
          name: p.community_name
        } : null
      }))
    }

    return c.json({
      query: q,
      type,
      results,
      pagination: {
        page,
        limit,
        hasMore: type === 'all'
          ? Object.values(results).some((arr: any) => arr.length === limit)
          : (results[type] || []).length === limit
      }
    })
  } catch (error) {
    console.error('Universal search error:', error)
    return c.json({ error: 'Failed to perform search' }, 500)
  }
})

/**
 * GET /api/search/users
 * Search users with detailed connection status
 */
discoveryApi.get('/search/users', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = await getAuthUserId(c)

    const q = c.req.query('q') || ''
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    if (!q || q.length < 2) {
      return c.json({ error: 'Search query must be at least 2 characters' }, 400)
    }

    const blockedIds = userId ? await getBlockedUserIds(db, userId) : []
    const blockedFilter = blockedIds.length > 0
      ? `AND u.id NOT IN (${blockedIds.map(() => '?').join(', ')})`
      : ''

    const searchPattern = `%${q.toLowerCase()}%`

    const users = await db.all<any>(`
      SELECT
        u.id,
        u.name,
        u.nickname,
        u.profile_photo_url,
        r.id as relationship_id,
        r.relationship_type,
        ${userId ? `
          CASE
            WHEN uc.status = 'accepted' THEN 'connected'
            WHEN uc.status = 'pending' AND uc.follower_id = $1 THEN 'pending_sent'
            WHEN uc.status = 'pending' AND uc.following_id = $1 THEN 'pending_received'
            ELSE 'none'
          END as connection_status,
          (
            SELECT COUNT(*) FROM user_connections uc2
            WHERE uc2.follower_id = u.id AND uc2.status = 'accepted'
          ) as follower_count
        ` : `
          'none' as connection_status,
          0 as follower_count
        `}
      FROM users u
      LEFT JOIN relationships r ON (r.user_1_id = u.id OR r.user_2_id = u.id) AND r.status = 'active'
      ${userId ? `
        LEFT JOIN user_connections uc ON (
          (uc.follower_id = $1 AND uc.following_id = u.id)
          OR (uc.follower_id = u.id AND uc.following_id = $1)
        )
      ` : ''}
      WHERE (LOWER(u.name) LIKE $${userId ? 2 : 1} OR LOWER(u.nickname) LIKE $${userId ? 2 : 1})
      ${blockedFilter}
      ${userId ? `AND u.id != $1` : ''}
      ORDER BY
        CASE
          WHEN LOWER(u.name) = LOWER($${userId ? 3 : 2}) THEN 1
          WHEN LOWER(u.name) LIKE LOWER($${userId ? 3 : 2}) || '%' THEN 2
          ELSE 3
        END,
        ${userId ? 'follower_count DESC,' : ''}
        u.name
      LIMIT $${userId ? 4 : 3} OFFSET $${userId ? 5 : 4}
    `, userId
      ? [userId, searchPattern, q, limit, offset, ...blockedIds]
      : [searchPattern, q, limit, offset]
    )

    return c.json({
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        nickname: u.nickname,
        profilePhotoUrl: u.profile_photo_url,
        relationshipType: u.relationship_type,
        connectionStatus: u.connection_status,
        followerCount: u.follower_count
      })),
      pagination: {
        page,
        limit,
        hasMore: users.length === limit
      }
    })
  } catch (error) {
    console.error('User search error:', error)
    return c.json({ error: 'Failed to search users' }, 500)
  }
})

/**
 * GET /api/search/communities
 * Search communities with filters
 */
discoveryApi.get('/search/communities', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = await getAuthUserId(c)

    const q = c.req.query('q') || ''
    const category = c.req.query('category')
    const privacyLevel = c.req.query('privacy_level')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    if (!q || q.length < 2) {
      return c.json({ error: 'Search query must be at least 2 characters' }, 400)
    }

    const searchPattern = `%${q.toLowerCase()}%`
    let conditions = [`(LOWER(c.name) LIKE ? OR LOWER(c.description) LIKE ?)`]
    let params: any[] = userId ? [userId, searchPattern, searchPattern] : [searchPattern, searchPattern]

    if (category) {
      conditions.push(`c.category = ?`)
      params.push(category)
    }

    if (privacyLevel) {
      conditions.push(`c.privacy_level = ?`)
      params.push(privacyLevel)
    } else {
      // Default: only show public communities unless user is a member
      conditions.push(`(c.privacy_level = 'public' ${userId ? 'OR cm.user_id IS NOT NULL' : ''})`)
    }

    const communities = await db.all<any>(`
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
        ${userId ? `
          cm.status as membership_status,
          cm.role as membership_role
        ` : `
          NULL as membership_status,
          NULL as membership_role
        `}
      FROM communities c
      ${userId ? `
        LEFT JOIN community_members cm ON cm.community_id = c.id
          AND cm.user_id = $1
          AND cm.status = 'active'
      ` : ''}
      WHERE ${conditions.join(' AND ')}
      ORDER BY
        c.is_featured DESC,
        c.is_verified DESC,
        c.member_count DESC,
        CASE
          WHEN LOWER(c.name) = LOWER($${userId ? params.length + 1 : params.length}) THEN 1
          WHEN LOWER(c.name) LIKE LOWER($${userId ? params.length + 1 : params.length}) || '%' THEN 2
          ELSE 3
        END
      LIMIT $${userId ? params.length + 2 : params.length + 1}
      OFFSET $${userId ? params.length + 3 : params.length + 2}
    `, [...params, q, limit, offset])

    return c.json({
      communities: communities.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        coverImageUrl: c.cover_image_url,
        category: c.category,
        privacyLevel: c.privacy_level,
        memberCount: c.member_count,
        postCount: c.post_count,
        isVerified: c.is_verified,
        isFeatured: c.is_featured,
        membershipStatus: c.membership_status,
        membershipRole: c.membership_role
      })),
      pagination: {
        page,
        limit,
        hasMore: communities.length === limit
      }
    })
  } catch (error) {
    console.error('Community search error:', error)
    return c.json({ error: 'Failed to search communities' }, 500)
  }
})

// ============================================================================
// DISCOVERY ENDPOINTS
// ============================================================================

/**
 * GET /api/discover/communities
 * Discover communities based on different categories
 */
discoveryApi.get('/discover/communities', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = await getAuthUserId(c)

    const category = c.req.query('category') || 'featured'
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    let communities: any[] = []

    switch (category) {
      case 'featured':
        // Show featured and verified communities
        communities = await db.all<any>(`
          SELECT
            c.id, c.name, c.slug, c.description, c.cover_image_url,
            c.category, c.privacy_level, c.member_count, c.post_count,
            c.is_verified, c.is_featured,
            ${userId ? `cm.status as membership_status, cm.role as membership_role` : `NULL as membership_status, NULL as membership_role`}
          FROM communities c
          ${userId ? `LEFT JOIN community_members cm ON cm.community_id = c.id AND cm.user_id = $1 AND cm.status = 'active'` : ''}
          WHERE c.is_featured = TRUE OR c.is_verified = TRUE
          AND c.privacy_level = 'public'
          ORDER BY c.is_featured DESC, c.is_verified DESC, c.member_count DESC
          LIMIT $${userId ? 2 : 1} OFFSET $${userId ? 3 : 2}
        `, userId ? [userId, limit, offset] : [limit, offset])
        break

      case 'popular':
        // Most popular communities by member count
        communities = await db.all<any>(`
          SELECT
            c.id, c.name, c.slug, c.description, c.cover_image_url,
            c.category, c.privacy_level, c.member_count, c.post_count,
            c.is_verified, c.is_featured,
            ${userId ? `cm.status as membership_status, cm.role as membership_role` : `NULL as membership_status, NULL as membership_role`}
          FROM communities c
          ${userId ? `LEFT JOIN community_members cm ON cm.community_id = c.id AND cm.user_id = $1 AND cm.status = 'active'` : ''}
          WHERE c.privacy_level = 'public'
          AND c.member_count > 0
          ORDER BY c.member_count DESC, c.post_count DESC
          LIMIT $${userId ? 2 : 1} OFFSET $${userId ? 3 : 2}
        `, userId ? [userId, limit, offset] : [limit, offset])
        break

      case 'new':
        // Newest communities
        communities = await db.all<any>(`
          SELECT
            c.id, c.name, c.slug, c.description, c.cover_image_url,
            c.category, c.privacy_level, c.member_count, c.post_count,
            c.is_verified, c.is_featured, c.created_at,
            ${userId ? `cm.status as membership_status, cm.role as membership_role` : `NULL as membership_status, NULL as membership_role`}
          FROM communities c
          ${userId ? `LEFT JOIN community_members cm ON cm.community_id = c.id AND cm.user_id = $1 AND cm.status = 'active'` : ''}
          WHERE c.privacy_level = 'public'
          ORDER BY c.created_at DESC
          LIMIT $${userId ? 2 : 1} OFFSET $${userId ? 3 : 2}
        `, userId ? [userId, limit, offset] : [limit, offset])
        break

      case 'for_you':
        // Personalized recommendations (requires auth)
        if (!userId) {
          return c.json({ error: 'Authentication required for personalized recommendations' }, 401)
        }

        // Get user's relationship type and existing community memberships
        const userContext = await db.first<any>(`
          SELECT
            r.relationship_type,
            u.interests
          FROM users u
          LEFT JOIN relationships r ON (r.user_1_id = u.id OR r.user_2_id = u.id) AND r.status = 'active'
          WHERE u.id = $1
        `, [userId])

        const relationshipType = userContext?.relationship_type
        const userInterests = userContext?.interests ? JSON.parse(userContext.interests) : []

        // Recommend communities based on:
        // 1. Similar relationship stage
        // 2. Communities joined by connections
        // 3. Popular communities in same categories as user's interests
        communities = await db.all<any>(`
          SELECT DISTINCT
            c.id, c.name, c.slug, c.description, c.cover_image_url,
            c.category, c.privacy_level, c.member_count, c.post_count,
            c.is_verified, c.is_featured,
            cm_user.status as membership_status,
            cm_user.role as membership_role,
            -- Recommendation score
            (
              -- Communities joined by connections (weight: 3)
              (SELECT COUNT(*) * 3 FROM community_members cm_conn
               JOIN user_connections uc ON uc.following_id = cm_conn.user_id
               WHERE uc.follower_id = $1
               AND uc.status = 'accepted'
               AND cm_conn.community_id = c.id
               AND cm_conn.status = 'active'
              ) +
              -- Popular communities (weight: 1)
              (c.member_count / 10)
            ) as rec_score
          FROM communities c
          LEFT JOIN community_members cm_user ON cm_user.community_id = c.id
            AND cm_user.user_id = $1
            AND cm_user.status = 'active'
          WHERE c.privacy_level = 'public'
          AND cm_user.user_id IS NULL -- Not already a member
          ORDER BY rec_score DESC, c.member_count DESC
          LIMIT $2 OFFSET $3
        `, [userId, limit, offset])
        break

      default:
        return c.json({ error: 'Invalid category. Use: featured, popular, new, for_you' }, 400)
    }

    return c.json({
      category,
      communities: communities.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        coverImageUrl: c.cover_image_url,
        category: c.category,
        privacyLevel: c.privacy_level,
        memberCount: c.member_count,
        postCount: c.post_count,
        isVerified: c.is_verified,
        isFeatured: c.is_featured,
        membershipStatus: c.membership_status,
        membershipRole: c.membership_role
      })),
      pagination: {
        page,
        limit,
        hasMore: communities.length === limit
      }
    })
  } catch (error) {
    console.error('Discover communities error:', error)
    return c.json({ error: 'Failed to discover communities' }, 500)
  }
})

/**
 * GET /api/discover/users
 * Discover users/couples based on similarity
 */
discoveryApi.get('/discover/users', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = await getAuthUserId(c)

    if (!userId) {
      return c.json({ error: 'Authentication required' }, 401)
    }

    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    const blockedIds = await getBlockedUserIds(db, userId)
    const blockedFilter = blockedIds.length > 0
      ? `AND u.id NOT IN (${blockedIds.map(() => '?').join(', ')})`
      : ''

    // Get user's context for recommendations
    const userContext = await db.first<any>(`
      SELECT
        r.relationship_type,
        u.interests
      FROM users u
      LEFT JOIN relationships r ON (r.user_1_id = u.id OR r.user_2_id = u.id) AND r.status = 'active'
      WHERE u.id = $1
    `, [userId])

    const relationshipType = userContext?.relationship_type

    // Recommendation algorithm:
    // - Mutual connections: 3 points
    // - Shared communities: 2 points
    // - Same relationship stage: 2 points
    // - Interest overlap: 1 point per shared interest
    const users = await db.all<any>(`
      SELECT
        u.id,
        u.name,
        u.nickname,
        u.profile_photo_url,
        r.relationship_type,
        -- Similarity score calculation
        (
          -- Mutual connections (weight: 3)
          (SELECT COUNT(*) * 3 FROM user_connections uc1
           JOIN user_connections uc2 ON uc1.following_id = uc2.following_id
           WHERE uc1.follower_id = $1
           AND uc2.follower_id = u.id
           AND uc1.status = 'accepted'
           AND uc2.status = 'accepted'
          ) +
          -- Shared communities (weight: 2)
          (SELECT COUNT(*) * 2 FROM community_members cm1
           JOIN community_members cm2 ON cm1.community_id = cm2.community_id
           WHERE cm1.user_id = $1
           AND cm2.user_id = u.id
           AND cm1.status = 'active'
           AND cm2.status = 'active'
          ) +
          -- Same relationship stage (weight: 2)
          ${relationshipType ? `
            CASE WHEN r.relationship_type = '${relationshipType}' THEN 2 ELSE 0 END
          ` : '0'}
        ) as similarity_score,
        (SELECT COUNT(*) FROM user_connections WHERE following_id = u.id AND status = 'accepted') as follower_count
      FROM users u
      LEFT JOIN relationships r ON (r.user_1_id = u.id OR r.user_2_id = u.id) AND r.status = 'active'
      WHERE u.id != $1
      AND u.id NOT IN (
        SELECT following_id FROM user_connections
        WHERE follower_id = $1
      )
      ${blockedFilter}
      AND EXISTS (
        -- Has at least one connection factor
        SELECT 1 FROM (
          SELECT COUNT(*) as mutual FROM user_connections uc1
          JOIN user_connections uc2 ON uc1.following_id = uc2.following_id
          WHERE uc1.follower_id = $1 AND uc2.follower_id = u.id
          AND uc1.status = 'accepted' AND uc2.status = 'accepted'
        ) mutual_check WHERE mutual > 0
        UNION
        SELECT 1 FROM (
          SELECT COUNT(*) as shared FROM community_members cm1
          JOIN community_members cm2 ON cm1.community_id = cm2.community_id
          WHERE cm1.user_id = $1 AND cm2.user_id = u.id
          AND cm1.status = 'active' AND cm2.status = 'active'
        ) shared_check WHERE shared > 0
      )
      ORDER BY similarity_score DESC, follower_count DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset, ...blockedIds])

    return c.json({
      users: users.map(u => ({
        id: u.id,
        name: u.name,
        nickname: u.nickname,
        profilePhotoUrl: u.profile_photo_url,
        relationshipType: u.relationship_type,
        similarityScore: u.similarity_score,
        followerCount: u.follower_count
      })),
      pagination: {
        page,
        limit,
        hasMore: users.length === limit
      }
    })
  } catch (error) {
    console.error('Discover users error:', error)
    return c.json({ error: 'Failed to discover users' }, 500)
  }
})

/**
 * GET /api/discover/trending
 * Get trending posts, communities, and topics
 */
discoveryApi.get('/discover/trending', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = await getAuthUserId(c)

    const timeframe = c.req.query('timeframe') || '24h'
    const limit = parseInt(c.req.query('limit') || '10')

    // Calculate time threshold
    const now = new Date()
    const threshold = new Date()
    if (timeframe === '24h') {
      threshold.setHours(now.getHours() - 24)
    } else if (timeframe === 'week') {
      threshold.setDate(now.getDate() - 7)
    } else {
      return c.json({ error: 'Invalid timeframe. Use: 24h, week' }, 400)
    }

    const blockedIds = userId ? await getBlockedUserIds(db, userId) : []
    const blockedFilter = blockedIds.length > 0
      ? `AND p.author_id NOT IN (${blockedIds.map(() => '?').join(', ')})`
      : ''

    // Trending Posts (by engagement: likes + comments)
    const visibilityFilter = userId
      ? `AND (
          p.visibility = 'public'
          OR (p.visibility = 'connections' AND EXISTS (
            SELECT 1 FROM user_connections uc
            WHERE uc.follower_id = $1 AND uc.following_id = p.author_id
            AND uc.status = 'accepted'
          ))
        )`
      : `AND p.visibility = 'public'`

    const trendingPosts = await db.all<any>(`
      SELECT
        p.id, p.content, p.content_type, p.media_urls,
        p.like_count, p.comment_count, p.created_at,
        u.id as author_id, u.name as author_name, u.profile_photo_url,
        c.id as community_id, c.name as community_name,
        (p.like_count + p.comment_count * 2) as engagement_score
      FROM posts p
      JOIN users u ON u.id = p.author_id
      LEFT JOIN communities c ON c.id = p.community_id
      WHERE p.created_at >= $${userId ? 2 : 1}
      AND p.deleted_at IS NULL
      AND p.is_hidden = FALSE
      ${visibilityFilter}
      ${blockedFilter}
      ORDER BY engagement_score DESC, p.created_at DESC
      LIMIT $${userId ? 3 : 2}
    `, userId
      ? [userId, threshold.toISOString(), limit, ...blockedIds]
      : [threshold.toISOString(), limit]
    )

    // Trending Communities (by recent growth)
    const trendingCommunities = await db.all<any>(`
      SELECT
        c.id, c.name, c.slug, c.description, c.cover_image_url,
        c.member_count, c.post_count, c.is_verified,
        COUNT(cm.id) as recent_joins
      FROM communities c
      LEFT JOIN community_members cm ON cm.community_id = c.id
        AND cm.joined_at >= $1
        AND cm.status = 'active'
      WHERE c.privacy_level = 'public'
      GROUP BY c.id
      ORDER BY recent_joins DESC, c.member_count DESC
      LIMIT $2
    `, [threshold.toISOString(), limit])

    return c.json({
      timeframe,
      posts: trendingPosts.map(p => ({
        id: p.id,
        content: p.content,
        contentType: p.content_type,
        mediaUrls: p.media_urls ? JSON.parse(p.media_urls) : null,
        likeCount: p.like_count,
        commentCount: p.comment_count,
        engagementScore: p.engagement_score,
        createdAt: p.created_at,
        author: {
          id: p.author_id,
          name: p.author_name,
          profilePhotoUrl: p.profile_photo_url
        },
        community: p.community_id ? {
          id: p.community_id,
          name: p.community_name
        } : null
      })),
      communities: trendingCommunities.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        coverImageUrl: c.cover_image_url,
        memberCount: c.member_count,
        postCount: c.post_count,
        isVerified: c.is_verified,
        recentJoins: c.recent_joins
      }))
    })
  } catch (error) {
    console.error('Trending discovery error:', error)
    return c.json({ error: 'Failed to get trending content' }, 500)
  }
})

// ============================================================================
// EXPLORE ENDPOINTS
// ============================================================================

/**
 * GET /api/explore/categories
 * Get community categories with counts
 */
discoveryApi.get('/explore/categories', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)

    const categories = await db.all<any>(`
      SELECT
        category,
        COUNT(*) as community_count,
        SUM(member_count) as total_members
      FROM communities
      WHERE privacy_level = 'public'
      AND category IS NOT NULL
      GROUP BY category
      ORDER BY community_count DESC
    `)

    const categoryInfo = [
      { id: 'relationship_stage', name: 'Relationship Stage', description: 'Groups by relationship phase: newlyweds, long-distance, etc.' },
      { id: 'interests', name: 'Interests', description: 'Shared hobbies: travel, fitness, cooking, etc.' },
      { id: 'location', name: 'Location', description: 'City or region-based communities' },
      { id: 'support', name: 'Support', description: 'Therapy, challenges, and support groups' },
      { id: 'lifestyle', name: 'Lifestyle', description: 'DINK, parents, and lifestyle choices' },
      { id: 'other', name: 'Other', description: 'Miscellaneous communities' }
    ]

    return c.json({
      categories: categoryInfo.map(info => {
        const stats = categories.find(c => c.category === info.id)
        return {
          ...info,
          communityCount: stats?.community_count || 0,
          totalMembers: stats?.total_members || 0
        }
      })
    })
  } catch (error) {
    console.error('Categories error:', error)
    return c.json({ error: 'Failed to get categories' }, 500)
  }
})

/**
 * GET /api/explore/topics
 * Get trending hashtags/topics from recent posts
 */
discoveryApi.get('/explore/topics', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const limit = parseInt(c.req.query('limit') || '20')

    // Extract hashtags from recent posts
    // This is a simplified version - in production, you'd want a dedicated hashtags table
    const recentPosts = await db.all<{ content: string }>(`
      SELECT content
      FROM posts
      WHERE created_at >= datetime('now', '-7 days')
      AND deleted_at IS NULL
      AND is_hidden = FALSE
      AND visibility = 'public'
      AND content LIKE '%#%'
      ORDER BY created_at DESC
      LIMIT 1000
    `)

    // Extract and count hashtags
    const hashtagCounts = new Map<string, number>()
    const hashtagRegex = /#(\w+)/g

    for (const post of recentPosts) {
      let match
      while ((match = hashtagRegex.exec(post.content)) !== null) {
        const tag = match[1].toLowerCase()
        hashtagCounts.set(tag, (hashtagCounts.get(tag) || 0) + 1)
      }
      hashtagRegex.lastIndex = 0 // Reset regex for next iteration
    }

    // Convert to array and sort by count
    const topics = Array.from(hashtagCounts.entries())
      .map(([topic, count]) => ({ topic, postCount: count }))
      .sort((a, b) => b.postCount - a.postCount)
      .slice(0, limit)

    return c.json({ topics })
  } catch (error) {
    console.error('Topics error:', error)
    return c.json({ error: 'Failed to get topics' }, 500)
  }
})

export default discoveryApi
