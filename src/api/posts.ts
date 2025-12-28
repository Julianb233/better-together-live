// Better Together: Posts API
// Handles post creation, retrieval, updates, deletion, and sharing

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'

const postsApi = new Hono()

// POST /api/posts - Create a new post
postsApi.post('/', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const {
      authorId,
      content,
      mediaUrls,
      visibility,
      communityId,
      contentType,
      relationshipId,
      linkedActivityId,
      linkedChallengeId,
      linkedAchievementId
    } = await c.req.json()

    // Validation
    if (!authorId) {
      return c.json({ error: 'Author ID required' }, 400)
    }

    if (!content && (!mediaUrls || mediaUrls.length === 0)) {
      return c.json({ error: 'Either content or media URLs required' }, 400)
    }

    if (!visibility) {
      return c.json({ error: 'Visibility setting required' }, 400)
    }

    const validVisibilities = ['public', 'community', 'connections', 'private']
    if (!validVisibilities.includes(visibility)) {
      return c.json({ error: 'Invalid visibility setting' }, 400)
    }

    // If posting to a community, verify membership
    if (communityId) {
      const membership = await db.first<{ id: string; status: string }>(`
        SELECT id, status FROM community_members
        WHERE community_id = $1 AND user_id = $2
      `, [communityId, authorId])

      if (!membership || membership.status !== 'active') {
        return c.json({ error: 'Not a member of this community' }, 403)
      }
    }

    // Create post
    const postId = `post_${Date.now()}_${Math.random().toString(36).substring(7)}`

    await db.run(`
      INSERT INTO posts (
        id, author_id, relationship_id, community_id,
        content_type, content, media_urls,
        linked_activity_id, linked_challenge_id, linked_achievement_id,
        visibility,
        like_count, comment_count, share_count,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `, [
      postId,
      authorId,
      relationshipId || null,
      communityId || null,
      contentType || 'text',
      content || null,
      mediaUrls ? JSON.stringify(mediaUrls) : null,
      linkedActivityId || null,
      linkedChallengeId || null,
      linkedAchievementId || null,
      visibility
    ])

    // Update community post count
    if (communityId) {
      await db.run(`
        UPDATE communities
        SET post_count = post_count + 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [communityId])
    }

    // Fetch created post with author info
    const post = await db.first<any>(`
      SELECT
        p.*,
        u.name as author_name,
        u.profile_photo_url as author_photo
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = $1
    `, [postId])

    return c.json({
      success: true,
      post: {
        id: post.id,
        authorId: post.author_id,
        authorName: post.author_name,
        authorPhoto: post.author_photo,
        relationshipId: post.relationship_id,
        communityId: post.community_id,
        contentType: post.content_type,
        content: post.content,
        mediaUrls: post.media_urls ? JSON.parse(post.media_urls) : [],
        visibility: post.visibility,
        isPinned: post.is_pinned,
        isFeatured: post.is_featured,
        likeCount: post.like_count,
        commentCount: post.comment_count,
        shareCount: post.share_count,
        createdAt: post.created_at,
        updatedAt: post.updated_at
      }
    }, 201)
  } catch (error) {
    console.error('Create post error:', error)
    return c.json({ error: 'Failed to create post' }, 500)
  }
})

// GET /api/posts/:id - Get a single post
postsApi.get('/:id', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const postId = c.req.param('id')
    const userId = c.req.query('userId') // For permission checking

    // Fetch post with author info
    const post = await db.first<any>(`
      SELECT
        p.*,
        u.name as author_name,
        u.profile_photo_url as author_photo,
        u.email as author_email
      FROM posts p
      LEFT JOIN users u ON p.author_id = u.id
      WHERE p.id = $1 AND p.deleted_at IS NULL
    `, [postId])

    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    // Check visibility permissions
    if (userId) {
      // Check if user is blocked
      const isBlocked = await db.first<{ id: string }>(`
        SELECT id FROM user_blocks
        WHERE blocker_id = $1 AND blocked_id = $2
      `, [post.author_id, userId])

      if (isBlocked) {
        return c.json({ error: 'Post not found' }, 404)
      }

      // Check visibility access
      if (post.visibility === 'private' && post.author_id !== userId) {
        return c.json({ error: 'Access denied' }, 403)
      }

      if (post.visibility === 'community' && post.community_id) {
        const membership = await db.first<{ id: string }>(`
          SELECT id FROM community_members
          WHERE community_id = $1 AND user_id = $2 AND status = 'active'
        `, [post.community_id, userId])

        if (!membership) {
          return c.json({ error: 'Access denied' }, 403)
        }
      }

      if (post.visibility === 'connections') {
        const isConnected = await db.first<{ id: string }>(`
          SELECT id FROM user_connections
          WHERE follower_id = $1 AND following_id = $2 AND status = 'accepted'
        `, [userId, post.author_id])

        if (!isConnected && post.author_id !== userId) {
          return c.json({ error: 'Access denied' }, 403)
        }
      }
    } else if (post.visibility !== 'public') {
      return c.json({ error: 'Access denied' }, 403)
    }

    // Get user's reaction if logged in
    let userReaction = null
    if (userId) {
      const reaction = await db.first<{ reaction_type: string }>(`
        SELECT reaction_type FROM reactions
        WHERE user_id = $1 AND target_type = 'post' AND target_id = $2
      `, [userId, postId])

      userReaction = reaction?.reaction_type || null
    }

    return c.json({
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
      userReaction,
      createdAt: post.created_at,
      updatedAt: post.updated_at
    })
  } catch (error) {
    console.error('Get post error:', error)
    return c.json({ error: 'Failed to get post' }, 500)
  }
})

// PUT /api/posts/:id - Update a post
postsApi.put('/:id', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const postId = c.req.param('id')
    const { userId, content, mediaUrls, visibility } = await c.req.json()

    if (!userId) {
      return c.json({ error: 'User ID required' }, 400)
    }

    // Check if user is the author
    const post = await db.first<{ author_id: string }>(`
      SELECT author_id FROM posts WHERE id = $1 AND deleted_at IS NULL
    `, [postId])

    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    if (post.author_id !== userId) {
      return c.json({ error: 'Only the author can update this post' }, 403)
    }

    // Validate visibility if provided
    if (visibility) {
      const validVisibilities = ['public', 'community', 'connections', 'private']
      if (!validVisibilities.includes(visibility)) {
        return c.json({ error: 'Invalid visibility setting' }, 400)
      }
    }

    // Update post
    await db.run(`
      UPDATE posts SET
        content = COALESCE($1, content),
        media_urls = COALESCE($2, media_urls),
        visibility = COALESCE($3, visibility),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4
    `, [
      content || null,
      mediaUrls ? JSON.stringify(mediaUrls) : null,
      visibility || null,
      postId
    ])

    return c.json({ success: true, message: 'Post updated' })
  } catch (error) {
    console.error('Update post error:', error)
    return c.json({ error: 'Failed to update post' }, 500)
  }
})

// DELETE /api/posts/:id - Delete a post (soft delete)
postsApi.delete('/:id', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const postId = c.req.param('id')
    const userId = c.req.query('userId')

    if (!userId) {
      return c.json({ error: 'User ID required' }, 400)
    }

    // Check if user is the author or community moderator
    const post = await db.first<any>(`
      SELECT p.author_id, p.community_id
      FROM posts p
      WHERE p.id = $1 AND p.deleted_at IS NULL
    `, [postId])

    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    let canDelete = post.author_id === userId

    // Check if user is community moderator
    if (!canDelete && post.community_id) {
      const moderator = await db.first<{ role: string }>(`
        SELECT role FROM community_members
        WHERE community_id = $1 AND user_id = $2 AND status = 'active'
      `, [post.community_id, userId])

      if (moderator && ['owner', 'admin', 'moderator'].includes(moderator.role)) {
        canDelete = true
      }
    }

    if (!canDelete) {
      return c.json({ error: 'Insufficient permissions to delete this post' }, 403)
    }

    // Soft delete
    await db.run(`
      UPDATE posts SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1
    `, [postId])

    // Update community post count
    if (post.community_id) {
      await db.run(`
        UPDATE communities
        SET post_count = GREATEST(post_count - 1, 0), updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [post.community_id])
    }

    return c.json({ success: true, message: 'Post deleted' })
  } catch (error) {
    console.error('Delete post error:', error)
    return c.json({ error: 'Failed to delete post' }, 500)
  }
})

// POST /api/posts/:id/share - Share a post
postsApi.post('/:id/share', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const postId = c.req.param('id')
    const { userId, content, visibility, communityId } = await c.req.json()

    if (!userId) {
      return c.json({ error: 'User ID required' }, 400)
    }

    // Check if original post exists and is accessible
    const originalPost = await db.first<{ id: string; visibility: string; author_id: string }>(`
      SELECT id, visibility, author_id FROM posts WHERE id = $1 AND deleted_at IS NULL
    `, [postId])

    if (!originalPost) {
      return c.json({ error: 'Original post not found' }, 404)
    }

    // Create share post
    const sharePostId = `post_${Date.now()}_${Math.random().toString(36).substring(7)}`

    await db.run(`
      INSERT INTO posts (
        id, author_id, community_id,
        content_type, content,
        visibility,
        like_count, comment_count, share_count,
        created_at, updated_at
      ) VALUES (
        $1, $2, $3, 'text', $4, $5, 0, 0, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
      )
    `, [
      sharePostId,
      userId,
      communityId || null,
      content || `Shared a post from ${originalPost.author_id}`,
      visibility || 'connections'
    ])

    // Increment share count on original post
    await db.run(`
      UPDATE posts SET share_count = share_count + 1 WHERE id = $1
    `, [postId])

    return c.json({
      success: true,
      sharePostId,
      message: 'Post shared successfully'
    })
  } catch (error) {
    console.error('Share post error:', error)
    return c.json({ error: 'Failed to share post' }, 500)
  }
})

export default postsApi
