// Better Together: Social Interactions API
// Handles reactions, comments, connections, blocks, and reports

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import { generateId, getCurrentDateTime } from '../utils'
import { requireAuth } from './auth'

const socialApi = new Hono()

// ============================================================================
// REACTIONS ENDPOINTS
// ============================================================================

/**
 * POST /api/posts/:postId/reactions
 * React to a post (upsert: create or update reaction)
 */
socialApi.post('/posts/:postId/reactions', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const postId = c.req.param('postId')
    const userId = c.get('userId')
    const { reaction_type } = await c.req.json()

    // Validate reaction type
    const validReactions = ['like', 'love', 'celebrate', 'support', 'insightful']
    if (!reaction_type || !validReactions.includes(reaction_type)) {
      return c.json({ error: 'Invalid reaction type' }, 400)
    }

    // Check if post exists and user isn't blocked
    const post = await db.first<{ author_id: string }>(
      'SELECT author_id FROM posts WHERE id = $1 AND deleted_at IS NULL',
      [postId]
    )

    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    // Check if user is blocked
    const isBlocked = await checkIfBlocked(db, userId, post.author_id)
    if (isBlocked) {
      return c.json({ error: 'Cannot react to this post' }, 403)
    }

    // Check for existing reaction
    const existingReaction = await db.first<{ id: string }>(
      'SELECT id FROM reactions WHERE user_id = $1 AND target_type = $2 AND target_id = $3',
      [userId, 'post', postId]
    )

    const now = getCurrentDateTime()

    if (existingReaction) {
      // Update existing reaction
      await db.run(
        'UPDATE reactions SET reaction_type = $1 WHERE id = $2',
        [reaction_type, existingReaction.id]
      )

      return c.json({
        success: true,
        message: 'Reaction updated',
        reaction: { id: existingReaction.id, reaction_type }
      })
    } else {
      // Create new reaction
      const reactionId = generateId()
      await db.run(`
        INSERT INTO reactions (id, user_id, target_type, target_id, reaction_type, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [reactionId, userId, 'post', postId, reaction_type, now])

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
socialApi.delete('/posts/:postId/reactions', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const postId = c.req.param('postId')
    const userId = c.get('userId')

    await db.run(
      'DELETE FROM reactions WHERE user_id = $1 AND target_type = $2 AND target_id = $3',
      [userId, 'post', postId]
    )

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
    const db = createDatabase(c.env as Env)
    const postId = c.req.param('postId')
    const typeFilter = c.req.query('type')

    let query = `
      SELECT r.reaction_type, r.user_id, r.created_at,
             u.name, u.profile_photo_url
      FROM reactions r
      JOIN users u ON r.user_id = u.id
      WHERE r.target_type = 'post' AND r.target_id = $1
    `
    const params: any[] = [postId]

    if (typeFilter) {
      query += ' AND r.reaction_type = $2'
      params.push(typeFilter)
    }

    query += ' ORDER BY r.created_at DESC'

    const reactions = await db.all<any>(query, params)

    // Group by reaction type
    const grouped = reactions.reduce((acc: any, r: any) => {
      if (!acc[r.reaction_type]) {
        acc[r.reaction_type] = { count: 0, users: [] }
      }
      acc[r.reaction_type].count++
      acc[r.reaction_type].users.push({
        user_id: r.user_id,
        name: r.name,
        profile_photo_url: r.profile_photo_url,
        reacted_at: r.created_at
      })
      return acc
    }, {})

    return c.json({
      reactions: grouped,
      total: reactions.length
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
socialApi.post('/comments/:commentId/reactions', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const commentId = c.req.param('commentId')
    const userId = c.get('userId')
    const { reaction_type } = await c.req.json()

    const validReactions = ['like', 'love', 'celebrate', 'support', 'insightful']
    if (!reaction_type || !validReactions.includes(reaction_type)) {
      return c.json({ error: 'Invalid reaction type' }, 400)
    }

    // Check if comment exists
    const comment = await db.first<{ author_id: string }>(
      'SELECT author_id FROM comments WHERE id = $1 AND deleted_at IS NULL',
      [commentId]
    )

    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404)
    }

    // Check if user is blocked
    const isBlocked = await checkIfBlocked(db, userId, comment.author_id)
    if (isBlocked) {
      return c.json({ error: 'Cannot react to this comment' }, 403)
    }

    // Upsert reaction
    const existingReaction = await db.first<{ id: string }>(
      'SELECT id FROM reactions WHERE user_id = $1 AND target_type = $2 AND target_id = $3',
      [userId, 'comment', commentId]
    )

    const now = getCurrentDateTime()

    if (existingReaction) {
      await db.run(
        'UPDATE reactions SET reaction_type = $1 WHERE id = $2',
        [reaction_type, existingReaction.id]
      )

      return c.json({
        success: true,
        message: 'Reaction updated',
        reaction: { id: existingReaction.id, reaction_type }
      })
    } else {
      const reactionId = generateId()
      await db.run(`
        INSERT INTO reactions (id, user_id, target_type, target_id, reaction_type, created_at)
        VALUES ($1, $2, $3, $4, $5, $6)
      `, [reactionId, userId, 'comment', commentId, reaction_type, now])

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
socialApi.delete('/comments/:commentId/reactions', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const commentId = c.req.param('commentId')
    const userId = c.get('userId')

    await db.run(
      'DELETE FROM reactions WHERE user_id = $1 AND target_type = $2 AND target_id = $3',
      [userId, 'comment', commentId]
    )

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
socialApi.get('/posts/:postId/comments', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const postId = c.req.param('postId')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const sort = c.req.query('sort') || 'newest' // newest, oldest, popular
    const userId = c.get('userId') // May be null if not authenticated

    const offset = (page - 1) * limit

    // Build sort clause
    let sortClause = 'c.created_at DESC'
    if (sort === 'oldest') sortClause = 'c.created_at ASC'
    if (sort === 'popular') sortClause = 'c.like_count DESC, c.created_at DESC'

    // Get top-level comments (no parent)
    const comments = await db.all<any>(`
      SELECT c.*,
             u.name as author_name,
             u.profile_photo_url as author_photo,
             (SELECT COUNT(*) FROM comments WHERE parent_comment_id = c.id AND deleted_at IS NULL) as reply_count
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.post_id = $1
        AND c.parent_comment_id IS NULL
        AND c.deleted_at IS NULL
      ORDER BY ${sortClause}
      LIMIT $2 OFFSET $3
    `, [postId, limit, offset])

    // Get user's reactions if authenticated
    if (userId) {
      const commentIds = comments.map(c => c.id)
      if (commentIds.length > 0) {
        const userReactions = await db.all<any>(
          `SELECT target_id, reaction_type
           FROM reactions
           WHERE user_id = $1 AND target_type = 'comment' AND target_id = ANY($2)`,
          [userId, commentIds]
        )

        const reactionsMap = new Map(userReactions.map(r => [r.target_id, r.reaction_type]))
        comments.forEach(c => {
          c.user_reaction = reactionsMap.get(c.id) || null
        })
      }
    }

    // Get total count
    const countResult = await db.first<{ count: number }>(
      'SELECT COUNT(*) as count FROM comments WHERE post_id = $1 AND parent_comment_id IS NULL AND deleted_at IS NULL',
      [postId]
    )

    return c.json({
      comments,
      pagination: {
        page,
        limit,
        total: countResult?.count || 0,
        has_more: offset + comments.length < (countResult?.count || 0)
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
socialApi.post('/posts/:postId/comments', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const postId = c.req.param('postId')
    const userId = c.get('userId')
    const { content, parent_comment_id } = await c.req.json()

    // Validate content
    if (!content || content.trim().length === 0) {
      return c.json({ error: 'Comment content is required' }, 400)
    }

    if (content.length > 2000) {
      return c.json({ error: 'Comment is too long (max 2000 characters)' }, 400)
    }

    // Check if post exists
    const post = await db.first<{ author_id: string }>(
      'SELECT author_id FROM posts WHERE id = $1 AND deleted_at IS NULL',
      [postId]
    )

    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    // Check if user is blocked
    const isBlocked = await checkIfBlocked(db, userId, post.author_id)
    if (isBlocked) {
      return c.json({ error: 'Cannot comment on this post' }, 403)
    }

    // If replying to a comment, check nesting depth
    if (parent_comment_id) {
      const parentComment = await db.first<{ parent_comment_id: string | null }>(
        'SELECT parent_comment_id FROM comments WHERE id = $1 AND post_id = $2 AND deleted_at IS NULL',
        [parent_comment_id, postId]
      )

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

    await db.run(`
      INSERT INTO comments (id, post_id, author_id, parent_comment_id, content, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [commentId, postId, userId, parent_comment_id || null, content.trim(), now, now])

    // Get comment with author info
    const comment = await db.first<any>(`
      SELECT c.*, u.name as author_name, u.profile_photo_url as author_photo
      FROM comments c
      JOIN users u ON c.author_id = u.id
      WHERE c.id = $1
    `, [commentId])

    return c.json({
      success: true,
      message: 'Comment created',
      comment
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
socialApi.put('/comments/:id', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const commentId = c.req.param('id')
    const userId = c.get('userId')
    const { content } = await c.req.json()

    if (!content || content.trim().length === 0) {
      return c.json({ error: 'Comment content is required' }, 400)
    }

    if (content.length > 2000) {
      return c.json({ error: 'Comment is too long (max 2000 characters)' }, 400)
    }

    // Check if comment exists and user is author
    const comment = await db.first<{ author_id: string }>(
      'SELECT author_id FROM comments WHERE id = $1 AND deleted_at IS NULL',
      [commentId]
    )

    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404)
    }

    if (comment.author_id !== userId) {
      return c.json({ error: 'Only the author can edit this comment' }, 403)
    }

    // Update comment
    const now = getCurrentDateTime()
    await db.run(
      'UPDATE comments SET content = $1, updated_at = $2 WHERE id = $3',
      [content.trim(), now, commentId]
    )

    return c.json({
      success: true,
      message: 'Comment updated',
      comment: { id: commentId, content: content.trim(), updated_at: now }
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
socialApi.delete('/comments/:id', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const commentId = c.req.param('id')
    const userId = c.get('userId')

    // Get comment with post info
    const comment = await db.first<{ author_id: string; post_id: string }>(
      'SELECT author_id, post_id FROM comments WHERE id = $1 AND deleted_at IS NULL',
      [commentId]
    )

    if (!comment) {
      return c.json({ error: 'Comment not found' }, 404)
    }

    // Check if user is comment author or post author
    const post = await db.first<{ author_id: string }>(
      'SELECT author_id FROM posts WHERE id = $1',
      [comment.post_id]
    )

    const canDelete = comment.author_id === userId || post?.author_id === userId

    if (!canDelete) {
      return c.json({ error: 'Only the comment author or post author can delete this comment' }, 403)
    }

    // Soft delete
    const now = getCurrentDateTime()
    await db.run(
      'UPDATE comments SET deleted_at = $1 WHERE id = $2',
      [now, commentId]
    )

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
socialApi.get('/connections', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    const type = c.req.query('type') // followers, following, friends
    const status = c.req.query('status') || 'accepted'
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    let query = ''
    let params: any[] = []

    if (type === 'followers') {
      query = `
        SELECT uc.*, u.id as user_id, u.name, u.nickname, u.profile_photo_url, uc.created_at as connected_at
        FROM user_connections uc
        JOIN users u ON uc.follower_id = u.id
        WHERE uc.following_id = $1 AND uc.status = $2
        ORDER BY uc.created_at DESC
        LIMIT $3 OFFSET $4
      `
      params = [userId, status, limit, offset]
    } else if (type === 'following') {
      query = `
        SELECT uc.*, u.id as user_id, u.name, u.nickname, u.profile_photo_url, uc.created_at as connected_at
        FROM user_connections uc
        JOIN users u ON uc.following_id = u.id
        WHERE uc.follower_id = $1 AND uc.status = $2
        ORDER BY uc.created_at DESC
        LIMIT $3 OFFSET $4
      `
      params = [userId, status, limit, offset]
    } else if (type === 'friends') {
      query = `
        SELECT uc.*, u.id as user_id, u.name, u.nickname, u.profile_photo_url, uc.created_at as connected_at
        FROM user_connections uc
        JOIN users u ON uc.following_id = u.id
        WHERE uc.follower_id = $1 AND uc.connection_type = 'friend' AND uc.status = $2
        ORDER BY uc.created_at DESC
        LIMIT $3 OFFSET $4
      `
      params = [userId, status, limit, offset]
    } else {
      return c.json({ error: 'Invalid type. Use: followers, following, or friends' }, 400)
    }

    const connections = await db.all<any>(query, params)

    return c.json({ connections })
  } catch (error) {
    console.error('Get connections error:', error)
    return c.json({ error: 'Failed to get connections' }, 500)
  }
})

/**
 * POST /api/connections/:userId/follow
 * Follow a user
 */
socialApi.post('/connections/:userId/follow', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const currentUserId = c.get('userId')
    const targetUserId = c.req.param('userId')

    if (currentUserId === targetUserId) {
      return c.json({ error: 'Cannot follow yourself' }, 400)
    }

    // Check if target user exists
    const targetUser = await db.first<{ id: string }>(
      'SELECT id FROM users WHERE id = $1',
      [targetUserId]
    )

    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404)
    }

    // Check if blocked
    const isBlocked = await checkIfBlocked(db, currentUserId, targetUserId)
    if (isBlocked) {
      return c.json({ error: 'Cannot follow this user' }, 403)
    }

    // Check if already following
    const existing = await db.first<{ id: string, status: string }>(
      'SELECT id, status FROM user_connections WHERE follower_id = $1 AND following_id = $2',
      [currentUserId, targetUserId]
    )

    if (existing && existing.status === 'accepted') {
      return c.json({ error: 'Already following this user' }, 400)
    }

    const connectionId = generateId()
    const now = getCurrentDateTime()

    if (existing) {
      // Update existing connection
      await db.run(
        'UPDATE user_connections SET status = $1, connection_type = $2, updated_at = $3 WHERE id = $4',
        ['accepted', 'follow', now, existing.id]
      )
    } else {
      // Create new connection
      await db.run(`
        INSERT INTO user_connections (id, follower_id, following_id, connection_type, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [connectionId, currentUserId, targetUserId, 'follow', 'accepted', now, now])
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
socialApi.delete('/connections/:userId/unfollow', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const currentUserId = c.get('userId')
    const targetUserId = c.req.param('userId')

    await db.run(
      'DELETE FROM user_connections WHERE follower_id = $1 AND following_id = $2',
      [currentUserId, targetUserId]
    )

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
socialApi.post('/connections/:userId/friend', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const currentUserId = c.get('userId')
    const targetUserId = c.req.param('userId')

    if (currentUserId === targetUserId) {
      return c.json({ error: 'Cannot friend yourself' }, 400)
    }

    // Check if target user exists
    const targetUser = await db.first<{ id: string }>(
      'SELECT id FROM users WHERE id = $1',
      [targetUserId]
    )

    if (!targetUser) {
      return c.json({ error: 'User not found' }, 404)
    }

    // Check if blocked
    const isBlocked = await checkIfBlocked(db, currentUserId, targetUserId)
    if (isBlocked) {
      return c.json({ error: 'Cannot send friend request to this user' }, 403)
    }

    // Check for existing connection
    const existing = await db.first<{ id: string, status: string }>(
      'SELECT id, status FROM user_connections WHERE follower_id = $1 AND following_id = $2',
      [currentUserId, targetUserId]
    )

    if (existing && existing.status === 'accepted') {
      return c.json({ error: 'Already friends with this user' }, 400)
    }

    if (existing && existing.status === 'pending') {
      return c.json({ error: 'Friend request already pending' }, 400)
    }

    const connectionId = generateId()
    const now = getCurrentDateTime()

    if (existing) {
      // Update existing
      await db.run(
        'UPDATE user_connections SET status = $1, connection_type = $2, updated_at = $3 WHERE id = $4',
        ['pending', 'friend', now, existing.id]
      )
    } else {
      // Create new friend request
      await db.run(`
        INSERT INTO user_connections (id, follower_id, following_id, connection_type, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [connectionId, currentUserId, targetUserId, 'friend', 'pending', now, now])
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
socialApi.put('/connections/:userId/friend', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const currentUserId = c.get('userId')
    const requesterId = c.req.param('userId')
    const { action } = await c.req.json() // 'accept' or 'reject'

    if (!action || !['accept', 'reject'].includes(action)) {
      return c.json({ error: 'Invalid action. Use: accept or reject' }, 400)
    }

    // Find the friend request
    const request = await db.first<{ id: string }>(
      `SELECT id FROM user_connections
       WHERE follower_id = $1 AND following_id = $2
       AND connection_type = 'friend' AND status = 'pending'`,
      [requesterId, currentUserId]
    )

    if (!request) {
      return c.json({ error: 'Friend request not found' }, 404)
    }

    const now = getCurrentDateTime()

    if (action === 'accept') {
      // Accept request
      await db.run(
        'UPDATE user_connections SET status = $1, updated_at = $2 WHERE id = $3',
        ['accepted', now, request.id]
      )

      // Create reciprocal connection
      const reciprocalId = generateId()
      await db.run(`
        INSERT INTO user_connections (id, follower_id, following_id, connection_type, status, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [reciprocalId, currentUserId, requesterId, 'friend', 'accepted', now, now])

      return c.json({
        success: true,
        message: 'Friend request accepted'
      })
    } else {
      // Reject request
      await db.run(
        'UPDATE user_connections SET status = $1, updated_at = $2 WHERE id = $3',
        ['rejected', now, request.id]
      )

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
socialApi.get('/connections/suggestions', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    const limit = parseInt(c.req.query('limit') || '10')

    // Get users with mutual connections, excluding already connected and blocked users
    const suggestions = await db.all<any>(`
      SELECT DISTINCT u.id, u.name, u.nickname, u.profile_photo_url,
             COUNT(DISTINCT uc2.follower_id) as mutual_connections
      FROM users u
      LEFT JOIN user_connections uc2 ON uc2.following_id = u.id
      WHERE u.id != $1
        AND u.id NOT IN (
          SELECT following_id FROM user_connections WHERE follower_id = $1
        )
        AND u.id NOT IN (
          SELECT blocked_id FROM user_blocks WHERE blocker_id = $1
        )
        AND u.id NOT IN (
          SELECT blocker_id FROM user_blocks WHERE blocked_id = $1
        )
        AND uc2.follower_id IN (
          SELECT following_id FROM user_connections WHERE follower_id = $1 AND status = 'accepted'
        )
      GROUP BY u.id, u.name, u.nickname, u.profile_photo_url
      ORDER BY mutual_connections DESC, RANDOM()
      LIMIT $2
    `, [userId, limit])

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
socialApi.post('/blocks/:userId', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const currentUserId = c.get('userId')
    const targetUserId = c.req.param('userId')
    const { reason, notes } = await c.req.json()

    if (currentUserId === targetUserId) {
      return c.json({ error: 'Cannot block yourself' }, 400)
    }

    // Check if already blocked
    const existing = await db.first<{ id: string }>(
      'SELECT id FROM user_blocks WHERE blocker_id = $1 AND blocked_id = $2',
      [currentUserId, targetUserId]
    )

    if (existing) {
      return c.json({ error: 'User already blocked' }, 400)
    }

    const blockId = generateId()
    const now = getCurrentDateTime()

    // Create block
    await db.run(`
      INSERT INTO user_blocks (id, blocker_id, blocked_id, reason, notes, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [blockId, currentUserId, targetUserId, reason || null, notes || null, now])

    // Remove connections in both directions
    await db.run(
      'DELETE FROM user_connections WHERE (follower_id = $1 AND following_id = $2) OR (follower_id = $2 AND following_id = $1)',
      [currentUserId, targetUserId]
    )

    // Remove from conversations (mark as left)
    await db.run(`
      UPDATE conversation_participants
      SET left_at = $1
      WHERE user_id = $2
        AND conversation_id IN (
          SELECT conversation_id FROM conversation_participants WHERE user_id = $3
        )
    `, [now, currentUserId, targetUserId])

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
socialApi.delete('/blocks/:userId', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const currentUserId = c.get('userId')
    const targetUserId = c.req.param('userId')

    await db.run(
      'DELETE FROM user_blocks WHERE blocker_id = $1 AND blocked_id = $2',
      [currentUserId, targetUserId]
    )

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
socialApi.get('/blocks', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')

    const blocked = await db.all<any>(`
      SELECT ub.id, ub.blocked_id, ub.reason, ub.created_at,
             u.name, u.nickname, u.profile_photo_url
      FROM user_blocks ub
      JOIN users u ON ub.blocked_id = u.id
      WHERE ub.blocker_id = $1
      ORDER BY ub.created_at DESC
    `, [userId])

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
socialApi.post('/reports', requireAuth, async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')
    const { target_type, target_id, reason, description } = await c.req.json()

    // Validate target_type
    const validTargetTypes = ['post', 'comment', 'message', 'user', 'community']
    if (!target_type || !validTargetTypes.includes(target_type)) {
      return c.json({ error: 'Invalid target type' }, 400)
    }

    // Validate reason
    const validReasons = ['spam', 'harassment', 'hate_speech', 'violence', 'inappropriate', 'misinformation', 'copyright', 'other']
    if (!reason || !validReasons.includes(reason)) {
      return c.json({ error: 'Invalid reason' }, 400)
    }

    if (!target_id) {
      return c.json({ error: 'Target ID is required' }, 400)
    }

    // Check for duplicate reports (same user, same target, within 24 hours)
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    const existingReport = await db.first<{ id: string }>(
      `SELECT id FROM content_reports
       WHERE reporter_id = $1 AND target_type = $2 AND target_id = $3
       AND created_at > $4`,
      [userId, target_type, target_id, twentyFourHoursAgo]
    )

    if (existingReport) {
      return c.json({ error: 'You have already reported this content recently' }, 400)
    }

    // Create report
    const reportId = generateId()
    const now = getCurrentDateTime()

    await db.run(`
      INSERT INTO content_reports (
        id, reporter_id, target_type, target_id, reason, description,
        status, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [reportId, userId, target_type, target_id, reason, description || null, 'pending', now, now])

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
async function checkIfBlocked(db: any, userId1: string, userId2: string): Promise<boolean> {
  const block = await db.first<{ id: string }>(
    `SELECT id FROM user_blocks
     WHERE (blocker_id = $1 AND blocked_id = $2)
        OR (blocker_id = $2 AND blocked_id = $1)`,
    [userId1, userId2]
  )

  return block !== null
}

export default socialApi
