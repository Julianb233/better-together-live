// Better Together: Activity Feed API
// Handles personalized feed, trending posts, community feeds, and user feeds
// Migrated from Neon raw SQL to Supabase query builder

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { getPaginationParams } from '../lib/pagination'

const feedApi = new Hono()

function getSupabaseEnv(c: Context): SupabaseEnv {
  return {
    SUPABASE_URL: c.env?.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: c.env?.SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: c.env?.SUPABASE_SERVICE_ROLE_KEY
  }
}

/**
 * Helper: Get IDs of users blocked by or blocking the given user
 */
async function getBlockedUserIds(supabase: any, userId: string): Promise<string[]> {
  const { data: blocks } = await supabase
    .from('user_blocks')
    .select('blocker_id, blocked_id')
    .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`)

  if (!blocks || blocks.length === 0) return []

  const ids = new Set<string>()
  for (const b of blocks) {
    if (b.blocker_id === userId) ids.add(b.blocked_id)
    else ids.add(b.blocker_id)
  }
  return Array.from(ids)
}

/**
 * Helper: Format a post row for response
 */
function formatPost(post: any) {
  return {
    id: post.id,
    authorId: post.author_id,
    authorName: post.author_name || post.users?.name,
    authorPhoto: post.author_photo || post.users?.profile_photo_url,
    relationshipId: post.relationship_id,
    communityId: post.community_id,
    communityName: post.community_name || post.communities?.name,
    communitySlug: post.community_slug || post.communities?.slug,
    contentType: post.content_type,
    content: post.content,
    mediaUrls: post.media_urls ? (typeof post.media_urls === 'string' ? JSON.parse(post.media_urls) : post.media_urls) : [],
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
    trendingScore: post.trending_score || undefined,
    createdAt: post.created_at,
    updatedAt: post.updated_at
  }
}

// GET /api/feed - Get personalized feed
feedApi.get('/', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.req.query('userId')
    const { limit, offset } = getPaginationParams(c)
    const filter = c.req.query('filter') || 'all'

    if (!userId) {
      return c.json({ error: 'User ID required' }, 400)
    }

    // Get blocked users
    const blockedUserIds = await getBlockedUserIds(supabase, userId)

    // Get user's communities for visibility filtering
    const { data: userCommunities } = await supabase
      .from('community_members')
      .select('community_id')
      .eq('user_id', userId)
      .eq('status', 'active')

    const communityIds = (userCommunities || []).map((m: any) => m.community_id)

    // Get user's connections
    const { data: userConnections } = await supabase
      .from('user_connections')
      .select('following_id')
      .eq('follower_id', userId)
      .eq('status', 'accepted')

    const connectionIds = (userConnections || []).map((uc: any) => uc.following_id)

    // Build the feed query based on filter
    let query = supabase
      .from('posts')
      .select('*')
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filter out blocked users
    if (blockedUserIds.length > 0) {
      query = query.not('author_id', 'in', `(${blockedUserIds.join(',')})`)
    }

    if (filter === 'communities') {
      // Only posts from user's communities
      if (communityIds.length > 0) {
        query = query.in('community_id', communityIds)
      } else {
        return c.json({ posts: [], page: 1, limit, hasMore: false })
      }
    } else if (filter === 'connections') {
      // Only posts from connections + self
      const allowedAuthors = [...connectionIds, userId]
      query = query.in('author_id', allowedAuthors)
        .in('visibility', ['public', 'connections'])
    } else {
      // All: user's own + public + community + connections
      // This is complex - use OR filter approach
      // For simplicity, fetch public posts + user's own + community posts + connection posts
      query = query.or(
        `author_id.eq.${userId},` +
        `visibility.eq.public` +
        (communityIds.length > 0
          ? `,and(visibility.eq.community,community_id.in.(${communityIds.join(',')}))`
          : '') +
        (connectionIds.length > 0
          ? `,and(visibility.eq.connections,author_id.in.(${connectionIds.join(',')}))`
          : '')
      )
    }

    const { data: posts, error } = await query

    if (error) throw error

    // Enrich posts with author + community info
    const authorIds = [...new Set((posts || []).map((p: any) => p.author_id))]
    const postCommunityIds = [...new Set((posts || []).filter((p: any) => p.community_id).map((p: any) => p.community_id))]

    const [{ data: authors }, { data: communities }] = await Promise.all([
      authorIds.length > 0
        ? supabase.from('users').select('id, name, profile_photo_url').in('id', authorIds)
        : { data: [] },
      postCommunityIds.length > 0
        ? supabase.from('communities').select('id, name, slug').in('id', postCommunityIds)
        : { data: [] }
    ])

    // Get user reactions
    const postIds = (posts || []).map((p: any) => p.id)
    const reactionsMap = new Map()
    if (postIds.length > 0) {
      const { data: reactions } = await supabase
        .from('reactions')
        .select('target_id, reaction_type')
        .eq('user_id', userId)
        .eq('target_type', 'post')
        .in('target_id', postIds)

      for (const r of (reactions || [])) {
        reactionsMap.set(r.target_id, r.reaction_type)
      }
    }

    const authorsMap = new Map((authors || []).map((a: any) => [a.id, a]))
    const communitiesMap = new Map((communities || []).map((c: any) => [c.id, c]))

    const formattedPosts = (posts || []).map((post: any) => {
      const author = authorsMap.get(post.author_id)
      const community = post.community_id ? communitiesMap.get(post.community_id) : null
      return formatPost({
        ...post,
        author_name: author?.name,
        author_photo: author?.profile_photo_url,
        community_name: community?.name,
        community_slug: community?.slug,
        user_reaction: reactionsMap.get(post.id) || null,
      })
    })

    return c.json({
      posts: formattedPosts,
      page: Math.floor(offset / limit) + 1,
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
    const supabase = createAdminClient(getSupabaseEnv(c))
    const timeframe = c.req.query('timeframe') || '24h'
    const { limit, offset } = getPaginationParams(c)
    const userId = c.req.query('userId')

    // Calculate time threshold
    const now = new Date()
    if (timeframe === 'week') {
      now.setDate(now.getDate() - 7)
    } else if (timeframe === 'month') {
      now.setDate(now.getDate() - 30)
    } else {
      now.setHours(now.getHours() - 24)
    }
    const timeThreshold = now.toISOString()

    // Get blocked users if userId provided
    const blockedUserIds = userId ? await getBlockedUserIds(supabase, userId) : []

    // Fetch public posts created after threshold, ordered by engagement
    let query = supabase
      .from('posts')
      .select('*')
      .is('deleted_at', null)
      .eq('visibility', 'public')
      .gte('created_at', timeThreshold)
      .order('like_count', { ascending: false })
      .order('comment_count', { ascending: false })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (blockedUserIds.length > 0) {
      query = query.not('author_id', 'in', `(${blockedUserIds.join(',')})`)
    }

    const { data: posts, error } = await query

    if (error) throw error

    // Enrich with author and community info
    const authorIds = [...new Set((posts || []).map((p: any) => p.author_id))]
    const communityIds = [...new Set((posts || []).filter((p: any) => p.community_id).map((p: any) => p.community_id))]

    const [{ data: authors }, { data: communities }] = await Promise.all([
      authorIds.length > 0
        ? supabase.from('users').select('id, name, profile_photo_url').in('id', authorIds)
        : { data: [] },
      communityIds.length > 0
        ? supabase.from('communities').select('id, name, slug').in('id', communityIds)
        : { data: [] }
    ])

    // Get user reactions
    const reactionsMap = new Map()
    if (userId && posts && posts.length > 0) {
      const postIds = posts.map((p: any) => p.id)
      const { data: reactions } = await supabase
        .from('reactions')
        .select('target_id, reaction_type')
        .eq('user_id', userId)
        .eq('target_type', 'post')
        .in('target_id', postIds)

      for (const r of (reactions || [])) {
        reactionsMap.set(r.target_id, r.reaction_type)
      }
    }

    const authorsMap = new Map((authors || []).map((a: any) => [a.id, a]))
    const communitiesMap = new Map((communities || []).map((c: any) => [c.id, c]))

    const formattedPosts = (posts || []).map((post: any) => {
      const author = authorsMap.get(post.author_id)
      const community = post.community_id ? communitiesMap.get(post.community_id) : null
      // Simple trending score calculation
      const ageHours = Math.max((Date.now() - new Date(post.created_at).getTime()) / 3600000, 1)
      const trendingScore = (
        (post.like_count || 0) * 1.0 +
        (post.comment_count || 0) * 3.0 +
        (post.share_count || 0) * 5.0
      ) / Math.pow(ageHours, 1.8)

      return formatPost({
        ...post,
        author_name: author?.name,
        author_photo: author?.profile_photo_url,
        community_name: community?.name,
        community_slug: community?.slug,
        user_reaction: reactionsMap.get(post.id) || null,
        trending_score: trendingScore,
      })
    })

    // Re-sort by trending score
    formattedPosts.sort((a: any, b: any) => (b.trendingScore || 0) - (a.trendingScore || 0))

    return c.json({
      posts: formattedPosts,
      timeframe,
      page: Math.floor(offset / limit) + 1,
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
    const supabase = createAdminClient(getSupabaseEnv(c))
    const communityId = c.req.param('communityId')
    const userId = c.req.query('userId')
    const { limit, offset } = getPaginationParams(c)
    const pinnedFirst = c.req.query('pinnedFirst') === 'true'

    // Check if community exists
    const { data: community } = await supabase
      .from('communities')
      .select('id, privacy_level')
      .eq('id', communityId)
      .maybeSingle()

    if (!community) {
      return c.json({ error: 'Community not found' }, 404)
    }

    // Check user access
    if (community.privacy_level !== 'public') {
      if (!userId) {
        return c.json({ error: 'Access denied' }, 403)
      }

      const { data: membership } = await supabase
        .from('community_members')
        .select('status')
        .eq('community_id', communityId)
        .eq('user_id', userId)
        .maybeSingle()

      if (!membership || membership.status !== 'active') {
        return c.json({ error: 'Access denied - not a member' }, 403)
      }
    }

    // Get blocked users
    const blockedUserIds = userId ? await getBlockedUserIds(supabase, userId) : []

    // Build query
    let query = supabase
      .from('posts')
      .select('*')
      .eq('community_id', communityId)
      .is('deleted_at', null)
      .range(offset, offset + limit - 1)

    if (pinnedFirst) {
      query = query.order('is_pinned', { ascending: false }).order('created_at', { ascending: false })
    } else {
      query = query.order('created_at', { ascending: false })
    }

    if (blockedUserIds.length > 0) {
      query = query.not('author_id', 'in', `(${blockedUserIds.join(',')})`)
    }

    const { data: posts, error } = await query

    if (error) throw error

    // Enrich with author info
    const authorIds = [...new Set((posts || []).map((p: any) => p.author_id))]
    const { data: authors } = authorIds.length > 0
      ? await supabase.from('users').select('id, name, profile_photo_url').in('id', authorIds)
      : { data: [] }

    // Get user reactions
    const reactionsMap = new Map()
    if (userId && posts && posts.length > 0) {
      const postIds = posts.map((p: any) => p.id)
      const { data: reactions } = await supabase
        .from('reactions')
        .select('target_id, reaction_type')
        .eq('user_id', userId)
        .eq('target_type', 'post')
        .in('target_id', postIds)

      for (const r of (reactions || [])) {
        reactionsMap.set(r.target_id, r.reaction_type)
      }
    }

    const authorsMap = new Map((authors || []).map((a: any) => [a.id, a]))

    const formattedPosts = (posts || []).map((post: any) => {
      const author = authorsMap.get(post.author_id)
      return formatPost({
        ...post,
        author_name: author?.name,
        author_photo: author?.profile_photo_url,
        user_reaction: reactionsMap.get(post.id) || null,
      })
    })

    return c.json({
      posts: formattedPosts,
      communityId,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: formattedPosts.length === limit
    })
  } catch (error) {
    console.error('Get community feed error:', error)
    return c.json({ error: 'Failed to get community feed' }, 500)
  }
})

// GET /api/feed/user/:targetUserId - User-specific feed (their posts)
feedApi.get('/user/:targetUserId', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const targetUserId = c.req.param('targetUserId')
    const viewerUserId = c.req.query('viewerId')
    const { limit, offset } = getPaginationParams(c)

    // Check if target user exists
    const { data: targetUser } = await supabase
      .from('users')
      .select('id, name')
      .eq('id', targetUserId)
      .maybeSingle()

    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404)
    }

    // Check if viewer is blocked
    if (viewerUserId) {
      const { data: isBlocked } = await supabase
        .from('user_blocks')
        .select('id')
        .eq('blocker_id', targetUserId)
        .eq('blocked_id', viewerUserId)
        .maybeSingle()

      if (isBlocked) {
        return c.json({ error: 'Access denied' }, 403)
      }
    }

    // Determine visibility filter
    let visibilityFilter: string[] = ['public']

    if (viewerUserId && viewerUserId === targetUserId) {
      // Viewing own profile - show all
      visibilityFilter = ['public', 'community', 'connections', 'private']
    } else if (viewerUserId) {
      // Check if connected
      const { data: isConnected } = await supabase
        .from('user_connections')
        .select('id')
        .eq('follower_id', viewerUserId)
        .eq('following_id', targetUserId)
        .eq('status', 'accepted')
        .maybeSingle()

      if (isConnected) {
        visibilityFilter = ['public', 'connections']
      }
    }

    const query = supabase
      .from('posts')
      .select('*')
      .eq('author_id', targetUserId)
      .is('deleted_at', null)
      .in('visibility', visibilityFilter)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    const { data: posts, error } = await query

    if (error) throw error

    // Get community info for posts
    const communityIds = [...new Set((posts || []).filter((p: any) => p.community_id).map((p: any) => p.community_id))]
    const { data: communities } = communityIds.length > 0
      ? await supabase.from('communities').select('id, name, slug').in('id', communityIds)
      : { data: [] }

    // Get user reactions
    const reactionsMap = new Map()
    if (viewerUserId && posts && posts.length > 0) {
      const postIds = posts.map((p: any) => p.id)
      const { data: reactions } = await supabase
        .from('reactions')
        .select('target_id, reaction_type')
        .eq('user_id', viewerUserId)
        .eq('target_type', 'post')
        .in('target_id', postIds)

      for (const r of (reactions || [])) {
        reactionsMap.set(r.target_id, r.reaction_type)
      }
    }

    const communitiesMap = new Map((communities || []).map((c: any) => [c.id, c]))

    const formattedPosts = (posts || []).map((post: any) => {
      const community = post.community_id ? communitiesMap.get(post.community_id) : null
      return formatPost({
        ...post,
        author_name: targetUser.name,
        author_photo: null, // Could fetch but targetUser already loaded
        community_name: community?.name,
        community_slug: community?.slug,
        user_reaction: reactionsMap.get(post.id) || null,
      })
    })

    return c.json({
      posts: formattedPosts,
      userId: targetUserId,
      userName: targetUser.name,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: formattedPosts.length === limit
    })
  } catch (error) {
    console.error('Get user feed error:', error)
    return c.json({ error: 'Failed to get user feed' }, 500)
  }
})

export default feedApi
