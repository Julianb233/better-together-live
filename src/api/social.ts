// Better Together: Social Interactions API
// Handles reactions, comments, connections, blocks, and reports
// Migrated from Neon raw SQL to Supabase client

import { Hono } from 'hono'
import type { Context } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createAdminClient } from '../lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { generateId, getCurrentDateTime } from '../utils'
import { getPaginationParams } from '../lib/pagination'
import { sanitizeTextInput } from '../lib/sanitize'
import {
  createReactionSchema,
  createCommentSchema,
  updateCommentSchema,
  friendRequestActionSchema,
  createBlockSchema,
  createReportSchema,
  commentsQuerySchema,
  connectionsQuerySchema
} from '../lib/validation/schemas/social'

function getSupabaseEnv(c: Context) {
  return {
    SUPABASE_URL: c.env?.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: c.env?.SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: c.env?.SUPABASE_SERVICE_ROLE_KEY
  }
}

const socialApi = new Hono()

// ============================================================================
// REACTIONS ENDPOINTS
// ============================================================================

/**
 * POST /api/posts/:postId/reactions
 * React to a post (upsert: create or update reaction)
 */
socialApi.post('/posts/:postId/reactions',
  zValidator('json', createReactionSchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const postId = c.req.param('postId')
    const userId = c.get('userId')
    const { reaction_type } = c.req.valid('json' as never) as any

    // Check if post exists and user isn't blocked
    const { data: post } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', postId)
      .is('deleted_at', null)
      .maybeSingle()

    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    // Check if user is blocked
    const blocked = await checkIfBlocked(supabase, userId, post.author_id)
    if (blocked) {
      return c.json({ error: 'Cannot react to this post' }, 403)
    }

    // Check for existing reaction
    const { data: existingReaction } = await supabase
      .from('reactions')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', 'post')
      .eq('target_id', postId)
      .maybeSingle()

    const now = getCurrentDateTime()

    if (existingReaction) {
      // Update existing reaction
      await supabase
        .from('reactions')
        .update({ reaction_type })
        .eq('id', existingReaction.id)

      return c.json({
        success: true,
        message: 'Reaction updated',
        reaction: { id: existingReaction.id, reaction_type }
      })
    } else {
      // Create new reaction
      const reactionId = generateId()
      await supabase
        .from('reactions')
        .insert({
          id: reactionId,
          user_id: userId,
          target_type: 'post',
          target_id: postId,
          reaction_type,
          created_at: now
        })

      return c.json({
        success: true,
        message: 'Reaction added',
        reaction: { id: reactionId, reaction_type }
      }, 201)
    }
  } catch (error) {
    console.error('Add post reaction error:', error)
    return c.json({ error: 'Failed to add reaction' }, 500)
  }
})

/**
 * DELETE /api/posts/:postId/reactions
 * Remove reaction from post
 */
socialApi.delete('/posts/:postId/reactions', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const postId = c.req.param('postId')
    const userId = c.get('userId')

    await supabase
      .from('reactions')
      .delete()
      .eq('user_id', userId)
      .eq('target_type', 'post')
      .eq('target_id', postId)

    return c.json({ success: true, message: 'Reaction removed' })
  } catch (error) {
    console.error('Remove post reaction error:', error)
    return c.json({ error: 'Failed to remove reaction' }, 500)
  }
})

/**
 * GET /api/posts/:postId/reactions
 * Get reactions on a post with counts and reactor list
 */
socialApi.get('/posts/:postId/reactions', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const postId = c.req.param('postId')
    const typeFilter = c.req.query('type')

    // Fetch reactions
    let query = supabase
      .from('reactions')
      .select('reaction_type, user_id, created_at')
      .eq('target_type', 'post')
      .eq('target_id', postId)

    if (typeFilter) {
      query = query.eq('reaction_type', typeFilter)
    }

    query = query.order('created_at', { ascending: false })

    const { data: reactionsRaw } = await query

    if (!reactionsRaw || reactionsRaw.length === 0) {
      return c.json({ reactions: {}, total: 0 })
    }

    // Fetch user details for reactors
    const userIds = [...new Set(reactionsRaw.map(r => r.user_id))]
    const { data: users } = await supabase
      .from('users')
      .select('id, name, profile_photo_url')
      .in('id', userIds)

    const usersMap = new Map((users || []).map(u => [u.id, u]))

    // Group by reaction type
    const grouped = reactionsRaw.reduce((acc: any, r: any) => {
      if (!acc[r.reaction_type]) {
        acc[r.reaction_type] = { count: 0, users: [] }
      }
      acc[r.reaction_type].count++
      const user = usersMap.get(r.user_id)
      acc[r.reaction_type].users.push({
        user_id: r.user_id,
        name: user?.name || null,
        profile_photo_url: user?.profile_photo_url || null,
        reacted_at: r.created_at
      })
      return acc
    }, {})

    return c.json({
      reactions: grouped,
      total: reactionsRaw.length
    })
  } catch (error) {
    console.error('Get post reactions error:', error)
    return c.json({ error: 'Failed to get reactions' }, 500)
  }
})

/**
 * POST /api/comments/:commentId/reactions
 * React to a comment
 */
socialApi.post('/comments/:commentId/reactions',
  zValidator('json', createReactionSchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const commentId = c.req.param('commentId')
    const userId = c.get('userId')
    const { reaction_type } = c.req.valid('json' as never) as any

    // Check if comment exists
    const { data: comment } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', commentId)
      .is('deleted_at', null)
      .maybeSingle()

    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404)
    }

    // Check if user is blocked
    const blocked = await checkIfBlocked(supabase, userId, comment.author_id)
    if (blocked) {
      return c.json({ error: 'Cannot react to this comment' }, 403)
    }

    // Upsert reaction
    const { data: existingReaction } = await supabase
      .from('reactions')
      .select('id')
      .eq('user_id', userId)
      .eq('target_type', 'comment')
      .eq('target_id', commentId)
      .maybeSingle()

    const now = getCurrentDateTime()

    if (existingReaction) {
      await supabase
        .from('reactions')
        .update({ reaction_type })
        .eq('id', existingReaction.id)

      return c.json({
        success: true,
        message: 'Reaction updated',
        reaction: { id: existingReaction.id, reaction_type }
      })
    } else {
      const reactionId = generateId()
      await supabase
        .from('reactions')
        .insert({
          id: reactionId,
          user_id: userId,
          target_type: 'comment',
          target_id: commentId,
          reaction_type,
          created_at: now
        })

      return c.json({
        success: true,
        message: 'Reaction added',
        reaction: { id: reactionId, reaction_type }
      }, 201)
    }
  } catch (error) {
    console.error('Add comment reaction error:', error)
    return c.json({ error: 'Failed to add reaction' }, 500)
  }
})

/**
 * DELETE /api/comments/:commentId/reactions
 * Remove reaction from comment
 */
socialApi.delete('/comments/:commentId/reactions', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const commentId = c.req.param('commentId')
    const userId = c.get('userId')

    await supabase
      .from('reactions')
      .delete()
      .eq('user_id', userId)
      .eq('target_type', 'comment')
      .eq('target_id', commentId)

    return c.json({ success: true, message: 'Reaction removed' })
  } catch (error) {
    console.error('Remove comment reaction error:', error)
    return c.json({ error: 'Failed to remove reaction' }, 500)
  }
})

// ============================================================================
// COMMENTS ENDPOINTS
// ============================================================================

/**
 * GET /api/posts/:postId/comments
 * Get comments on a post (with nested replies)
 */
socialApi.get('/posts/:postId/comments',
  zValidator('query', commentsQuerySchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const postId = c.req.param('postId')
    const { sort } = c.req.valid('query' as never) as any
    const { limit, offset } = getPaginationParams(c)
    const userId = c.get('userId') // May be null if not authenticated

    // Build sort for top-level comments
    let sortColumn = 'created_at'
    let ascending = false
    if (sort === 'oldest') { ascending = true }
    if (sort === 'popular') { sortColumn = 'like_count' }

    // Get top-level comments (no parent)
    let commentsQuery = supabase
      .from('comments')
      .select('*')
      .eq('post_id', postId)
      .is('parent_comment_id', null)
      .is('deleted_at', null)
      .order(sortColumn, { ascending })

    if (sort === 'popular') {
      commentsQuery = commentsQuery.order('created_at', { ascending: false })
    }

    commentsQuery = commentsQuery.range(offset, offset + limit - 1)

    const { data: commentsRaw } = await commentsQuery

    if (!commentsRaw || commentsRaw.length === 0) {
      // Get total count even if no comments on this page
      const { count: totalCount } = await supabase
        .from('comments')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
        .is('parent_comment_id', null)
        .is('deleted_at', null)

      return c.json({
        comments: [],
        pagination: {
          page: Math.floor(offset / limit) + 1,
          limit,
          total: totalCount || 0,
          has_more: false
        }
      })
    }

    // Fetch author details
    const authorIds = [...new Set(commentsRaw.map(c => c.author_id))]
    const { data: authors } = await supabase
      .from('users')
      .select('id, name, profile_photo_url')
      .in('id', authorIds)

    const authorsMap = new Map((authors || []).map(a => [a.id, a]))

    // Get reply counts for each comment
    const commentIds = commentsRaw.map(c => c.id)
    const { data: replyCounts } = await supabase
      .from('comments')
      .select('parent_comment_id')
      .in('parent_comment_id', commentIds)
      .is('deleted_at', null)

    const replyCountMap = new Map<string, number>()
    if (replyCounts) {
      for (const r of replyCounts) {
        const count = replyCountMap.get(r.parent_comment_id) || 0
        replyCountMap.set(r.parent_comment_id, count + 1)
      }
    }

    // Build enriched comments
    let comments: any[] = commentsRaw.map(c => {
      const author = authorsMap.get(c.author_id)
      return {
        ...c,
        author_name: author?.name || null,
        author_photo: author?.profile_photo_url || null,
        reply_count: replyCountMap.get(c.id) || 0,
        user_reaction: null
      }
    })

    // Get user's reactions if authenticated
    if (userId && commentIds.length > 0) {
      const { data: userReactions } = await supabase
        .from('reactions')
        .select('target_id, reaction_type')
        .eq('user_id', userId)
        .eq('target_type', 'comment')
        .in('target_id', commentIds)

      if (userReactions) {
        const reactionsMap = new Map(userReactions.map(r => [r.target_id, r.reaction_type]))
        comments = comments.map(c => ({
          ...c,
          user_reaction: reactionsMap.get(c.id) || null
        }))
      }
    }

    // Get total count
    const { count: totalCount } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('post_id', postId)
      .is('parent_comment_id', null)
      .is('deleted_at', null)

    const total = totalCount || 0

    return c.json({
      comments,
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total,
        has_more: offset + comments.length < total
      }
    })
  } catch (error) {
    console.error('Get comments error:', error)
    return c.json({ error: 'Failed to get comments' }, 500)
  }
})

/**
 * POST /api/posts/:postId/comments
 * Create a new comment or reply
 */
socialApi.post('/posts/:postId/comments',
  zValidator('json', createCommentSchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const postId = c.req.param('postId')
    const userId = c.get('userId')
    const { content, parent_comment_id } = c.req.valid('json' as never) as any

    // Check if post exists
    const { data: post } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', postId)
      .is('deleted_at', null)
      .maybeSingle()

    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    // Check if user is blocked
    const blocked = await checkIfBlocked(supabase, userId, post.author_id)
    if (blocked) {
      return c.json({ error: 'Cannot comment on this post' }, 403)
    }

    // If replying to a comment, check nesting depth
    if (parent_comment_id) {
      const { data: parentComment } = await supabase
        .from('comments')
        .select('parent_comment_id')
        .eq('id', parent_comment_id)
        .eq('post_id', postId)
        .is('deleted_at', null)
        .maybeSingle()

      if (!parentComment) {
        return c.json({ error: 'Parent comment not found' }, 404)
      }

      // Limit nesting to 2 levels (comment -> reply)
      if (parentComment.parent_comment_id !== null) {
        return c.json({ error: 'Cannot reply to a reply (max 2 levels)' }, 400)
      }
    }

    // Create comment
    const commentId = generateId()
    const now = getCurrentDateTime()

    await supabase
      .from('comments')
      .insert({
        id: commentId,
        post_id: postId,
        author_id: userId,
        parent_comment_id: parent_comment_id || null,
        content: sanitizeTextInput(content),
        created_at: now,
        updated_at: now
      })

    // Get comment with author info
    const { data: createdComment } = await supabase
      .from('comments')
      .select('*')
      .eq('id', commentId)
      .single()

    // Fetch author info
    const { data: author } = await supabase
      .from('users')
      .select('name, profile_photo_url')
      .eq('id', userId)
      .maybeSingle()

    return c.json({
      success: true,
      message: 'Comment created',
      comment: {
        ...createdComment,
        author_name: author?.name || null,
        author_photo: author?.profile_photo_url || null
      }
    }, 201)
  } catch (error) {
    console.error('Create comment error:', error)
    return c.json({ error: 'Failed to create comment' }, 500)
  }
})

/**
 * PUT /api/comments/:id
 * Update a comment (only author can update)
 */
socialApi.put('/comments/:id',
  zValidator('json', updateCommentSchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const commentId = c.req.param('id')
    const userId = c.get('userId')
    const { content } = c.req.valid('json' as never) as any

    // Check if comment exists and user is author
    const { data: comment } = await supabase
      .from('comments')
      .select('author_id')
      .eq('id', commentId)
      .is('deleted_at', null)
      .maybeSingle()

    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404)
    }

    if (comment.author_id !== userId) {
      return c.json({ error: 'Only the author can edit this comment' }, 403)
    }

    // Update comment
    const now = getCurrentDateTime()
    const sanitizedContent = sanitizeTextInput(content)

    await supabase
      .from('comments')
      .update({ content: sanitizedContent, updated_at: now })
      .eq('id', commentId)

    return c.json({
      success: true,
      message: 'Comment updated',
      comment: { id: commentId, content: sanitizedContent, updated_at: now }
    })
  } catch (error) {
    console.error('Update comment error:', error)
    return c.json({ error: 'Failed to update comment' }, 500)
  }
})

/**
 * DELETE /api/comments/:id
 * Delete a comment (soft delete - author or post author can delete)
 */
socialApi.delete('/comments/:id', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const commentId = c.req.param('id')
    const userId = c.get('userId')

    // Get comment with post info
    const { data: comment } = await supabase
      .from('comments')
      .select('author_id, post_id')
      .eq('id', commentId)
      .is('deleted_at', null)
      .maybeSingle()

    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404)
    }

    // Check if user is comment author or post author
    const { data: post } = await supabase
      .from('posts')
      .select('author_id')
      .eq('id', comment.post_id)
      .maybeSingle()

    const canDelete = comment.author_id === userId || post?.author_id === userId

    if (!canDelete) {
      return c.json({ error: 'Only the comment author or post author can delete this comment' }, 403)
    }

    // Soft delete
    const now = getCurrentDateTime()
    await supabase
      .from('comments')
      .update({ deleted_at: now })
      .eq('id', commentId)

    return c.json({
      success: true,
      message: 'Comment deleted'
    })
  } catch (error) {
    console.error('Delete comment error:', error)
    return c.json({ error: 'Failed to delete comment' }, 500)
  }
})

// ============================================================================
// CONNECTIONS ENDPOINTS
// ============================================================================

/**
 * GET /api/connections
 * Get user's connections (followers, following, friends)
 */
socialApi.get('/connections',
  zValidator('query', connectionsQuerySchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')
    const { type, status } = c.req.valid('query' as never) as any
    const { limit, offset } = getPaginationParams(c)

    let connectionsRaw: any[] = []

    if (type === 'followers') {
      // Users who follow me
      const { data } = await supabase
        .from('user_connections')
        .select('*, follower_id')
        .eq('following_id', userId)
        .eq('status', status)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      connectionsRaw = data || []

      // Fetch user details for followers
      if (connectionsRaw.length > 0) {
        const userIds = connectionsRaw.map(c => c.follower_id)
        const { data: users } = await supabase
          .from('users')
          .select('id, name, nickname, profile_photo_url')
          .in('id', userIds)

        const usersMap = new Map((users || []).map(u => [u.id, u]))
        connectionsRaw = connectionsRaw.map(c => {
          const user = usersMap.get(c.follower_id)
          return {
            ...c,
            user_id: c.follower_id,
            name: user?.name || null,
            nickname: user?.nickname || null,
            profile_photo_url: user?.profile_photo_url || null,
            connected_at: c.created_at
          }
        })
      }
    } else if (type === 'following') {
      // Users I follow
      const { data } = await supabase
        .from('user_connections')
        .select('*, following_id')
        .eq('follower_id', userId)
        .eq('status', status)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      connectionsRaw = data || []

      if (connectionsRaw.length > 0) {
        const userIds = connectionsRaw.map(c => c.following_id)
        const { data: users } = await supabase
          .from('users')
          .select('id, name, nickname, profile_photo_url')
          .in('id', userIds)

        const usersMap = new Map((users || []).map(u => [u.id, u]))
        connectionsRaw = connectionsRaw.map(c => {
          const user = usersMap.get(c.following_id)
          return {
            ...c,
            user_id: c.following_id,
            name: user?.name || null,
            nickname: user?.nickname || null,
            profile_photo_url: user?.profile_photo_url || null,
            connected_at: c.created_at
          }
        })
      }
    } else if (type === 'friends') {
      // My friends
      const { data } = await supabase
        .from('user_connections')
        .select('*, following_id')
        .eq('follower_id', userId)
        .eq('connection_type', 'friend')
        .eq('status', status)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      connectionsRaw = data || []

      if (connectionsRaw.length > 0) {
        const userIds = connectionsRaw.map(c => c.following_id)
        const { data: users } = await supabase
          .from('users')
          .select('id, name, nickname, profile_photo_url')
          .in('id', userIds)

        const usersMap = new Map((users || []).map(u => [u.id, u]))
        connectionsRaw = connectionsRaw.map(c => {
          const user = usersMap.get(c.following_id)
          return {
            ...c,
            user_id: c.following_id,
            name: user?.name || null,
            nickname: user?.nickname || null,
            profile_photo_url: user?.profile_photo_url || null,
            connected_at: c.created_at
          }
        })
      }
    }

    return c.json({ connections: connectionsRaw })
  } catch (error) {
    console.error('Get connections error:', error)
    return c.json({ error: 'Failed to get connections' }, 500)
  }
})

/**
 * POST /api/connections/:userId/follow
 * Follow a user
 */
socialApi.post('/connections/:userId/follow', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const currentUserId = c.get('userId')
    const targetUserId = c.req.param('userId')

    if (currentUserId === targetUserId) {
      return c.json({ error: 'Cannot follow yourself' }, 400)
    }

    // Check if target user exists
    const { data: targetUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', targetUserId)
      .maybeSingle()

    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404)
    }

    // Check if blocked
    const blocked = await checkIfBlocked(supabase, currentUserId, targetUserId)
    if (blocked) {
      return c.json({ error: 'Cannot follow this user' }, 403)
    }

    // Check if already following
    const { data: existing } = await supabase
      .from('user_connections')
      .select('id, status')
      .eq('follower_id', currentUserId)
      .eq('following_id', targetUserId)
      .maybeSingle()

    if (existing && existing.status === 'accepted') {
      return c.json({ error: 'Already following this user' }, 400)
    }

    const now = getCurrentDateTime()

    if (existing) {
      // Update existing connection
      await supabase
        .from('user_connections')
        .update({ status: 'accepted', connection_type: 'follow', updated_at: now })
        .eq('id', existing.id)
    } else {
      // Create new connection
      const connectionId = generateId()
      await supabase
        .from('user_connections')
        .insert({
          id: connectionId,
          follower_id: currentUserId,
          following_id: targetUserId,
          connection_type: 'follow',
          status: 'accepted',
          created_at: now,
          updated_at: now
        })
    }

    return c.json({
      success: true,
      message: 'Now following user'
    }, 201)
  } catch (error) {
    console.error('Follow user error:', error)
    return c.json({ error: 'Failed to follow user' }, 500)
  }
})

/**
 * DELETE /api/connections/:userId/unfollow
 * Unfollow a user
 */
socialApi.delete('/connections/:userId/unfollow', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const currentUserId = c.get('userId')
    const targetUserId = c.req.param('userId')

    await supabase
      .from('user_connections')
      .delete()
      .eq('follower_id', currentUserId)
      .eq('following_id', targetUserId)

    return c.json({
      success: true,
      message: 'Unfollowed user'
    })
  } catch (error) {
    console.error('Unfollow user error:', error)
    return c.json({ error: 'Failed to unfollow user' }, 500)
  }
})

/**
 * POST /api/connections/:userId/friend
 * Send friend request
 */
socialApi.post('/connections/:userId/friend', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const currentUserId = c.get('userId')
    const targetUserId = c.req.param('userId')

    if (currentUserId === targetUserId) {
      return c.json({ error: 'Cannot friend yourself' }, 400)
    }

    // Check if target user exists
    const { data: targetUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', targetUserId)
      .maybeSingle()

    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404)
    }

    // Check if blocked
    const blocked = await checkIfBlocked(supabase, currentUserId, targetUserId)
    if (blocked) {
      return c.json({ error: 'Cannot send friend request to this user' }, 403)
    }

    // Check for existing connection
    const { data: existing } = await supabase
      .from('user_connections')
      .select('id, status')
      .eq('follower_id', currentUserId)
      .eq('following_id', targetUserId)
      .maybeSingle()

    if (existing && existing.status === 'accepted') {
      return c.json({ error: 'Already friends with this user' }, 400)
    }

    if (existing && existing.status === 'pending') {
      return c.json({ error: 'Friend request already pending' }, 400)
    }

    const now = getCurrentDateTime()

    if (existing) {
      // Update existing
      await supabase
        .from('user_connections')
        .update({ status: 'pending', connection_type: 'friend', updated_at: now })
        .eq('id', existing.id)
    } else {
      // Create new friend request
      const connectionId = generateId()
      await supabase
        .from('user_connections')
        .insert({
          id: connectionId,
          follower_id: currentUserId,
          following_id: targetUserId,
          connection_type: 'friend',
          status: 'pending',
          created_at: now,
          updated_at: now
        })
    }

    return c.json({
      success: true,
      message: 'Friend request sent'
    }, 201)
  } catch (error) {
    console.error('Send friend request error:', error)
    return c.json({ error: 'Failed to send friend request' }, 500)
  }
})

/**
 * PUT /api/connections/:userId/friend
 * Accept or reject friend request
 */
socialApi.put('/connections/:userId/friend',
  zValidator('json', friendRequestActionSchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const currentUserId = c.get('userId')
    const requesterId = c.req.param('userId')
    const { action } = c.req.valid('json' as never) as any

    // Find the friend request
    const { data: request } = await supabase
      .from('user_connections')
      .select('id')
      .eq('follower_id', requesterId)
      .eq('following_id', currentUserId)
      .eq('connection_type', 'friend')
      .eq('status', 'pending')
      .maybeSingle()

    if (!request) {
      return c.json({ error: 'Friend request not found' }, 404)
    }

    const now = getCurrentDateTime()

    if (action === 'accept') {
      // Accept request
      await supabase
        .from('user_connections')
        .update({ status: 'accepted', updated_at: now })
        .eq('id', request.id)

      // Create reciprocal connection
      const reciprocalId = generateId()
      // Check if reciprocal already exists
      const { data: existingReciprocal } = await supabase
        .from('user_connections')
        .select('id')
        .eq('follower_id', currentUserId)
        .eq('following_id', requesterId)
        .maybeSingle()

      if (!existingReciprocal) {
        await supabase
          .from('user_connections')
          .insert({
            id: reciprocalId,
            follower_id: currentUserId,
            following_id: requesterId,
            connection_type: 'friend',
            status: 'accepted',
            created_at: now,
            updated_at: now
          })
      }

      return c.json({
        success: true,
        message: 'Friend request accepted'
      })
    } else {
      // Reject request
      await supabase
        .from('user_connections')
        .update({ status: 'rejected', updated_at: now })
        .eq('id', request.id)

      return c.json({
        success: true,
        message: 'Friend request rejected'
      })
    }
  } catch (error) {
    console.error('Handle friend request error:', error)
    return c.json({ error: 'Failed to handle friend request' }, 500)
  }
})

/**
 * GET /api/connections/suggestions
 * Get follow suggestions based on mutual connections and interests
 */
socialApi.get('/connections/suggestions', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')
    const { limit } = getPaginationParams(c)

    // Get user's current connections
    const { data: myConnections } = await supabase
      .from('user_connections')
      .select('following_id')
      .eq('follower_id', userId)
      .eq('status', 'accepted')

    const connectedIds = (myConnections || []).map(c => c.following_id)

    // Get blocked users (both directions)
    const { data: blockedOut } = await supabase
      .from('user_blocks')
      .select('blocked_id')
      .eq('blocker_id', userId)

    const { data: blockedIn } = await supabase
      .from('user_blocks')
      .select('blocker_id')
      .eq('blocked_id', userId)

    const blockedIds = [
      ...(blockedOut || []).map(b => b.blocked_id),
      ...(blockedIn || []).map(b => b.blocker_id)
    ]

    const excludeIds = [...new Set([userId, ...connectedIds, ...blockedIds])]

    if (connectedIds.length === 0) {
      // No connections yet - return empty suggestions
      return c.json({ suggestions: [] })
    }

    // Find users followed by people I follow (mutual connections approach)
    const { data: mutualFollows } = await supabase
      .from('user_connections')
      .select('following_id, follower_id')
      .in('follower_id', connectedIds)
      .eq('status', 'accepted')
      .not('following_id', 'in', `(${excludeIds.join(',')})`)

    if (!mutualFollows || mutualFollows.length === 0) {
      return c.json({ suggestions: [] })
    }

    // Count mutual connections per suggested user
    const mutualCountMap = new Map<string, number>()
    for (const f of mutualFollows) {
      const count = mutualCountMap.get(f.following_id) || 0
      mutualCountMap.set(f.following_id, count + 1)
    }

    // Sort by mutual count descending and take top N
    const sortedSuggestionIds = [...mutualCountMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([id]) => id)

    if (sortedSuggestionIds.length === 0) {
      return c.json({ suggestions: [] })
    }

    // Fetch user details
    const { data: users } = await supabase
      .from('users')
      .select('id, name, nickname, profile_photo_url')
      .in('id', sortedSuggestionIds)

    const usersMap = new Map((users || []).map(u => [u.id, u]))

    const suggestions = sortedSuggestionIds
      .map(id => {
        const user = usersMap.get(id)
        if (!user) return null
        return {
          ...user,
          mutual_connections: mutualCountMap.get(id) || 0
        }
      })
      .filter(Boolean)

    return c.json({ suggestions })
  } catch (error) {
    console.error('Get suggestions error:', error)
    return c.json({ error: 'Failed to get suggestions' }, 500)
  }
})

// ============================================================================
// BLOCKS ENDPOINTS
// ============================================================================

/**
 * POST /api/blocks/:userId
 * Block a user
 */
socialApi.post('/blocks/:userId',
  zValidator('json', createBlockSchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const currentUserId = c.get('userId')
    const targetUserId = c.req.param('userId')
    const { reason, notes } = c.req.valid('json' as never) as any

    if (currentUserId === targetUserId) {
      return c.json({ error: 'Cannot block yourself' }, 400)
    }

    // Check if already blocked
    const { data: existing } = await supabase
      .from('user_blocks')
      .select('id')
      .eq('blocker_id', currentUserId)
      .eq('blocked_id', targetUserId)
      .maybeSingle()

    if (existing) {
      return c.json({ error: 'User already blocked' }, 400)
    }

    const blockId = generateId()
    const now = getCurrentDateTime()

    // Create block
    await supabase
      .from('user_blocks')
      .insert({
        id: blockId,
        blocker_id: currentUserId,
        blocked_id: targetUserId,
        reason: reason || null,
        notes: notes || null,
        created_at: now
      })

    // Remove connections in both directions
    await supabase
      .from('user_connections')
      .delete()
      .or(`and(follower_id.eq.${currentUserId},following_id.eq.${targetUserId}),and(follower_id.eq.${targetUserId},following_id.eq.${currentUserId})`)

    // Remove from conversations (mark as left)
    // First get shared conversations
    const { data: myConvs } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', currentUserId)
      .is('left_at', null)

    if (myConvs && myConvs.length > 0) {
      const myConvIds = myConvs.map(c => c.conversation_id)

      // Find conversations where the blocked user also participates
      const { data: sharedConvs } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', targetUserId)
        .in('conversation_id', myConvIds)
        .is('left_at', null)

      if (sharedConvs && sharedConvs.length > 0) {
        const sharedConvIds = sharedConvs.map(c => c.conversation_id)

        // Mark current user as left from shared conversations
        await supabase
          .from('conversation_participants')
          .update({ left_at: now })
          .eq('user_id', currentUserId)
          .in('conversation_id', sharedConvIds)
      }
    }

    return c.json({
      success: true,
      message: 'User blocked'
    }, 201)
  } catch (error) {
    console.error('Block user error:', error)
    return c.json({ error: 'Failed to block user' }, 500)
  }
})

/**
 * DELETE /api/blocks/:userId
 * Unblock a user
 */
socialApi.delete('/blocks/:userId', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const currentUserId = c.get('userId')
    const targetUserId = c.req.param('userId')

    await supabase
      .from('user_blocks')
      .delete()
      .eq('blocker_id', currentUserId)
      .eq('blocked_id', targetUserId)

    return c.json({
      success: true,
      message: 'User unblocked'
    })
  } catch (error) {
    console.error('Unblock user error:', error)
    return c.json({ error: 'Failed to unblock user' }, 500)
  }
})

/**
 * GET /api/blocks
 * List blocked users
 */
socialApi.get('/blocks', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')

    // Fetch blocks
    const { data: blocksRaw } = await supabase
      .from('user_blocks')
      .select('id, blocked_id, reason, created_at')
      .eq('blocker_id', userId)
      .order('created_at', { ascending: false })

    if (!blocksRaw || blocksRaw.length === 0) {
      return c.json({ blocked: [] })
    }

    // Fetch user details
    const blockedIds = blocksRaw.map(b => b.blocked_id)
    const { data: users } = await supabase
      .from('users')
      .select('id, name, nickname, profile_photo_url')
      .in('id', blockedIds)

    const usersMap = new Map((users || []).map(u => [u.id, u]))

    const blocked = blocksRaw.map(b => {
      const user = usersMap.get(b.blocked_id)
      return {
        id: b.id,
        blocked_id: b.blocked_id,
        reason: b.reason,
        created_at: b.created_at,
        name: user?.name || null,
        nickname: user?.nickname || null,
        profile_photo_url: user?.profile_photo_url || null
      }
    })

    return c.json({ blocked })
  } catch (error) {
    console.error('Get blocked users error:', error)
    return c.json({ error: 'Failed to get blocked users' }, 500)
  }
})

// ============================================================================
// REPORTS ENDPOINTS
// ============================================================================

/**
 * POST /api/reports
 * Report content for moderation
 */
socialApi.post('/reports',
  zValidator('json', createReportSchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')
    const { target_type, target_id, reason, description } = c.req.valid('json' as never) as any

    // Check for duplicate reports (same user, same target, within 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    const { data: existingReport } = await supabase
      .from('content_reports')
      .select('id')
      .eq('reporter_id', userId)
      .eq('target_type', target_type)
      .eq('target_id', target_id)
      .gt('created_at', twentyFourHoursAgo)
      .maybeSingle()

    if (existingReport) {
      return c.json({ error: 'You have already reported this content recently' }, 400)
    }

    // Create report
    const reportId = generateId()
    const now = getCurrentDateTime()

    await supabase
      .from('content_reports')
      .insert({
        id: reportId,
        reporter_id: userId,
        target_type,
        target_id,
        reason,
        description: description ? sanitizeTextInput(description) : null,
        status: 'pending',
        created_at: now,
        updated_at: now
      })

    return c.json({
      success: true,
      message: 'Report submitted successfully',
      report_id: reportId
    }, 201)
  } catch (error) {
    console.error('Create report error:', error)
    return c.json({ error: 'Failed to create report' }, 500)
  }
})

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if one user has blocked another (in either direction)
 */
async function checkIfBlocked(supabase: SupabaseClient, userId1: string, userId2: string): Promise<boolean> {
  const { data: block } = await supabase
    .from('user_blocks')
    .select('id')
    .or(`and(blocker_id.eq.${userId1},blocked_id.eq.${userId2}),and(blocker_id.eq.${userId2},blocked_id.eq.${userId1})`)
    .maybeSingle()

  return block !== null
}

export default socialApi
