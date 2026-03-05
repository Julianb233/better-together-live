// Better Together: Discovery and Search API
// Handles universal search, user/community discovery, trending content, and recommendations
// Migrated from Neon raw SQL to Supabase query builder + RPC functions
// NOTE: Mixed placeholder bugs ($N and ?) from the original are eliminated

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { zValidator } from '@hono/zod-validator'
import {
  searchQuerySchema,
  searchUsersQuerySchema,
  searchCommunitiesQuerySchema,
  discoverCommunitiesQuerySchema,
  discoverUsersQuerySchema,
  trendingQuerySchema,
} from '../lib/validation/schemas/discovery'
import { getPaginationParams } from '../lib/pagination'

const discoveryApi = new Hono()

function getSupabaseEnv(c: Context): SupabaseEnv {
  return {
    SUPABASE_URL: c.env?.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: c.env?.SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: c.env?.SUPABASE_SERVICE_ROLE_KEY
  }
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
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')

    const q = c.req.query('q') || ''
    const type = c.req.query('type') || 'all'
    const { limit, offset } = getPaginationParams(c)

    if (!q || q.length < 2) {
      return c.json({ error: 'Search query must be at least 2 characters' }, 400)
    }

    const results: any = {}

    // Search Users via RPC
    if (type === 'all' || type === 'users') {
      const { data: users, error } = await supabase.rpc('search_users_v1', {
        p_query: q,
        p_user_id: userId || null,
        p_limit: limit,
        p_offset: offset,
      })

      if (error) throw error

      results.users = (users || []).map((u: any) => ({
        id: u.id,
        name: u.name,
        nickname: u.nickname,
        profilePhotoUrl: u.profile_photo_url,
        relationshipType: u.relationship_type,
        connectionStatus: u.connection_status
      }))
    }

    // Search Communities via RPC
    if (type === 'all' || type === 'communities') {
      const { data: communities, error } = await supabase.rpc('search_communities_v1', {
        p_query: q,
        p_user_id: userId || null,
        p_limit: limit,
        p_offset: offset,
      })

      if (error) throw error

      results.communities = (communities || []).map((c: any) => ({
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

    // Search Posts via RPC
    if (type === 'all' || type === 'posts') {
      const { data: posts, error } = await supabase.rpc('search_posts_v1', {
        p_query: q,
        p_user_id: userId || null,
        p_limit: limit,
        p_offset: offset,
      })

      if (error) throw error

      results.posts = (posts || []).map((p: any) => ({
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
        page: Math.floor(offset / limit) + 1,
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
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')

    const q = c.req.query('q') || ''
    const { limit, offset } = getPaginationParams(c)

    if (!q || q.length < 2) {
      return c.json({ error: 'Search query must be at least 2 characters' }, 400)
    }

    const { data: users, error } = await supabase.rpc('search_users_v1', {
      p_query: q,
      p_user_id: userId || null,
      p_limit: limit,
      p_offset: offset,
    })

    if (error) throw error

    return c.json({
      users: (users || []).map((u: any) => ({
        id: u.id,
        name: u.name,
        nickname: u.nickname,
        profilePhotoUrl: u.profile_photo_url,
        relationshipType: u.relationship_type,
        connectionStatus: u.connection_status,
        followerCount: u.follower_count
      })),
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        hasMore: (users || []).length === limit
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
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')

    const q = c.req.query('q') || ''
    const category = c.req.query('category') || null
    const privacyLevel = c.req.query('privacy_level') || null
    const { limit, offset } = getPaginationParams(c)

    if (!q || q.length < 2) {
      return c.json({ error: 'Search query must be at least 2 characters' }, 400)
    }

    const { data: communities, error } = await supabase.rpc('search_communities_v1', {
      p_query: q,
      p_user_id: userId || null,
      p_category: category,
      p_privacy_level: privacyLevel,
      p_limit: limit,
      p_offset: offset,
    })

    if (error) throw error

    return c.json({
      communities: (communities || []).map((c: any) => ({
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
        page: Math.floor(offset / limit) + 1,
        limit,
        hasMore: (communities || []).length === limit
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
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')

    const category = c.req.query('category') || 'featured'
    const { limit, offset } = getPaginationParams(c)

    let communities: any[] = []

    switch (category) {
      case 'featured': {
        let query = supabase
          .from('communities')
          .select('*')
          .eq('privacy_level', 'public')
          .or('is_featured.eq.true,is_verified.eq.true')
          .order('is_featured', { ascending: false })
          .order('is_verified', { ascending: false })
          .order('member_count', { ascending: false })
          .range(offset, offset + limit - 1)

        const { data, error } = await query
        if (error) throw error
        communities = data || []
        break
      }

      case 'popular': {
        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .eq('privacy_level', 'public')
          .gt('member_count', 0)
          .order('member_count', { ascending: false })
          .order('post_count', { ascending: false })
          .range(offset, offset + limit - 1)

        if (error) throw error
        communities = data || []
        break
      }

      case 'new': {
        const { data, error } = await supabase
          .from('communities')
          .select('*')
          .eq('privacy_level', 'public')
          .order('created_at', { ascending: false })
          .range(offset, offset + limit - 1)

        if (error) throw error
        communities = data || []
        break
      }

      case 'for_you': {
        if (!userId) {
          return c.json({ error: 'Authentication required for personalized recommendations' }, 401)
        }

        // Get communities the user is NOT already in, weighted by connections' communities
        const { data: userMemberships } = await supabase
          .from('community_members')
          .select('community_id')
          .eq('user_id', userId)
          .eq('status', 'active')

        const memberCommunityIds = (userMemberships || []).map((m: any) => m.community_id)

        let query = supabase
          .from('communities')
          .select('*')
          .eq('privacy_level', 'public')
          .order('member_count', { ascending: false })
          .range(offset, offset + limit - 1)

        if (memberCommunityIds.length > 0) {
          query = query.not('id', 'in', `(${memberCommunityIds.join(',')})`)
        }

        const { data, error } = await query
        if (error) throw error
        communities = data || []
        break
      }

      default:
        return c.json({ error: 'Invalid category. Use: featured, popular, new, for_you' }, 400)
    }

    // Enrich with membership status if user is authenticated
    let membershipMap = new Map()
    if (userId && communities.length > 0) {
      const communityIds = communities.map(c => c.id)
      const { data: memberships } = await supabase
        .from('community_members')
        .select('community_id, status, role')
        .eq('user_id', userId)
        .eq('status', 'active')
        .in('community_id', communityIds)

      for (const m of (memberships || [])) {
        membershipMap.set(m.community_id, m)
      }
    }

    return c.json({
      category,
      communities: communities.map(c => {
        const membership = membershipMap.get(c.id)
        return {
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
          membershipStatus: membership?.status || null,
          membershipRole: membership?.role || null
        }
      }),
      pagination: {
        page: Math.floor(offset / limit) + 1,
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
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Authentication required' }, 401)
    }

    const { limit, offset } = getPaginationParams(c)

    const { data: users, error } = await supabase.rpc('discover_users_v1', {
      p_user_id: userId,
      p_limit: limit,
      p_offset: offset,
    })

    if (error) throw error

    return c.json({
      users: (users || []).map((u: any) => ({
        id: u.id,
        name: u.name,
        nickname: u.nickname,
        profilePhotoUrl: u.profile_photo_url,
        relationshipType: u.relationship_type,
        similarityScore: u.similarity_score,
        followerCount: u.follower_count
      })),
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        hasMore: (users || []).length === limit
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
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')

    const timeframe = c.req.query('timeframe') || '24h'
    const { limit } = getPaginationParams(c)

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

    const thresholdStr = threshold.toISOString()

    // Get blocked users
    let blockedUserIds: string[] = []
    if (userId) {
      const { data: blocks } = await supabase
        .from('user_blocks')
        .select('blocker_id, blocked_id')
        .or(`blocker_id.eq.${userId},blocked_id.eq.${userId}`)

      for (const b of (blocks || [])) {
        if (b.blocker_id === userId) blockedUserIds.push(b.blocked_id)
        else blockedUserIds.push(b.blocker_id)
      }
    }

    // Trending Posts
    let postsQuery = supabase
      .from('posts')
      .select('*')
      .is('deleted_at', null)
      .eq('is_hidden', false)
      .eq('visibility', 'public')
      .gte('created_at', thresholdStr)
      .order('like_count', { ascending: false })
      .order('comment_count', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (blockedUserIds.length > 0) {
      postsQuery = postsQuery.not('author_id', 'in', `(${blockedUserIds.join(',')})`)
    }

    const { data: trendingPosts, error: postsErr } = await postsQuery
    if (postsErr) throw postsErr

    // Enrich posts with author/community info
    const authorIds = [...new Set((trendingPosts || []).map((p: any) => p.author_id))]
    const communityIds = [...new Set((trendingPosts || []).filter((p: any) => p.community_id).map((p: any) => p.community_id))]

    const [{ data: authors }, { data: communities }] = await Promise.all([
      authorIds.length > 0
        ? supabase.from('users').select('id, name, profile_photo_url').in('id', authorIds)
        : { data: [] },
      communityIds.length > 0
        ? supabase.from('communities').select('id, name').in('id', communityIds)
        : { data: [] }
    ])

    const authorsMap = new Map((authors || []).map((a: any) => [a.id, a]))
    const communitiesMap = new Map((communities || []).map((c: any) => [c.id, c]))

    // Trending Communities (by recent growth)
    const { data: trendingCommunities, error: commErr } = await supabase
      .from('communities')
      .select('id, name, slug, description, cover_image_url, member_count, post_count, is_verified')
      .eq('privacy_level', 'public')
      .order('member_count', { ascending: false })
      .limit(limit)

    if (commErr) throw commErr

    return c.json({
      timeframe,
      posts: (trendingPosts || []).map((p: any) => {
        const author = authorsMap.get(p.author_id)
        const community = p.community_id ? communitiesMap.get(p.community_id) : null
        return {
          id: p.id,
          content: p.content,
          contentType: p.content_type,
          mediaUrls: p.media_urls ? JSON.parse(p.media_urls) : null,
          likeCount: p.like_count,
          commentCount: p.comment_count,
          engagementScore: (p.like_count || 0) + (p.comment_count || 0) * 2,
          createdAt: p.created_at,
          author: {
            id: p.author_id,
            name: author?.name,
            profilePhotoUrl: author?.profile_photo_url
          },
          community: community ? {
            id: community.id,
            name: community.name
          } : null
        }
      }),
      communities: (trendingCommunities || []).map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        coverImageUrl: c.cover_image_url,
        memberCount: c.member_count,
        postCount: c.post_count,
        isVerified: c.is_verified,
        recentJoins: 0 // Would need a separate query for recent joins count
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
    const supabase = createAdminClient(getSupabaseEnv(c))

    // Get all public communities grouped by category
    const { data: communities, error } = await supabase
      .from('communities')
      .select('category, member_count')
      .eq('privacy_level', 'public')
      .not('category', 'is', null)

    if (error) throw error

    // Aggregate in JS since Supabase doesn't support GROUP BY + aggregate in query builder
    const categoryStats = new Map<string, { count: number; members: number }>()
    for (const c of (communities || [])) {
      const existing = categoryStats.get(c.category) || { count: 0, members: 0 }
      existing.count++
      existing.members += c.member_count || 0
      categoryStats.set(c.category, existing)
    }

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
        const stats = categoryStats.get(info.id)
        return {
          ...info,
          communityCount: stats?.count || 0,
          totalMembers: stats?.members || 0
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
    const supabase = createAdminClient(getSupabaseEnv(c))
    const { limit } = getPaginationParams(c)

    // Get recent public posts with hashtags
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { data: recentPosts, error } = await supabase
      .from('posts')
      .select('content')
      .is('deleted_at', null)
      .eq('is_hidden', false)
      .eq('visibility', 'public')
      .gte('created_at', weekAgo)
      .like('content', '%#%')
      .order('created_at', { ascending: false })
      .limit(1000)

    if (error) throw error

    // Extract and count hashtags
    const hashtagCounts = new Map<string, number>()
    const hashtagRegex = /#(\w+)/g

    for (const post of (recentPosts || [])) {
      if (!post.content) continue
      let match
      while ((match = hashtagRegex.exec(post.content)) !== null) {
        const tag = match[1].toLowerCase()
        hashtagCounts.set(tag, (hashtagCounts.get(tag) || 0) + 1)
      }
      hashtagRegex.lastIndex = 0
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
