// Better Together: Posts API
// Handles post creation, retrieval, updates, deletion, and sharing
// Migrated from Neon raw SQL to Supabase query builder

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { zValidator } from '@hono/zod-validator'
import {
  createPostSchema,
  updatePostSchema,
  sharePostSchema,
} from '../lib/validation/schemas/social'
import { sanitizeTextInput } from '../lib/sanitize'

const postsApi = new Hono()

function getSupabaseEnv(c: Context): SupabaseEnv {
  return {
    SUPABASE_URL: c.env?.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: c.env?.SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: c.env?.SUPABASE_SERVICE_ROLE_KEY
  }
}

// POST /api/posts - Create a new post
postsApi.post(
  '/',
  zValidator('json', createPostSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const body = c.req.valid('json' as never) as {
        authorId: string
        content?: string
        mediaUrls?: string[]
        visibility: string
        communityId?: string | null
        contentType?: string
        relationshipId?: string | null
        linkedActivityId?: string | null
        linkedChallengeId?: string | null
        linkedAchievementId?: string | null
      }

      // If posting to a community, verify membership
      if (body.communityId) {
        const { data: membership } = await supabase
          .from('community_members')
          .select('id, status')
          .eq('community_id', body.communityId)
          .eq('user_id', body.authorId)
          .maybeSingle()

        if (!membership || membership.status !== 'active') {
          return c.json({ error: 'Not a member of this community' }, 403)
        }
      }

      // Create post
      const postId = `post_${Date.now()}_${Math.random().toString(36).substring(7)}`
      const now = new Date().toISOString()

      const { error: insertErr } = await supabase
        .from('posts')
        .insert({
          id: postId,
          author_id: body.authorId,
          relationship_id: body.relationshipId || null,
          community_id: body.communityId || null,
          content_type: body.contentType || 'text',
          content: body.content ? sanitizeTextInput(body.content) : null,
          media_urls: body.mediaUrls ? JSON.stringify(body.mediaUrls) : null,
          linked_activity_id: body.linkedActivityId || null,
          linked_challenge_id: body.linkedChallengeId || null,
          linked_achievement_id: body.linkedAchievementId || null,
          visibility: body.visibility,
          like_count: 0,
          comment_count: 0,
          share_count: 0,
          created_at: now,
          updated_at: now,
        })

      if (insertErr) throw insertErr

      // Update community post count
      if (body.communityId) {
        // Use RPC or manual increment
        const { data: comm } = await supabase
          .from('communities')
          .select('post_count')
          .eq('id', body.communityId)
          .single()

        if (comm) {
          await supabase
            .from('communities')
            .update({ post_count: (comm.post_count || 0) + 1, updated_at: now })
            .eq('id', body.communityId)
        }
      }

      // Fetch created post with author info
      const { data: post } = await supabase
        .from('posts')
        .select('*')
        .eq('id', postId)
        .single()

      const { data: author } = await supabase
        .from('users')
        .select('name, profile_photo_url')
        .eq('id', body.authorId)
        .maybeSingle()

      return c.json({
        success: true,
        post: {
          id: post!.id,
          authorId: post!.author_id,
          authorName: author?.name,
          authorPhoto: author?.profile_photo_url,
          relationshipId: post!.relationship_id,
          communityId: post!.community_id,
          contentType: post!.content_type,
          content: post!.content,
          mediaUrls: post!.media_urls ? JSON.parse(post!.media_urls as string) : [],
          visibility: post!.visibility,
          isPinned: post!.is_pinned,
          isFeatured: post!.is_featured,
          likeCount: post!.like_count,
          commentCount: post!.comment_count,
          shareCount: post!.share_count,
          createdAt: post!.created_at,
          updatedAt: post!.updated_at
        }
      }, 201)
    } catch (error) {
      console.error('Create post error:', error)
      return c.json({ error: 'Failed to create post' }, 500)
    }
  }
)

// GET /api/posts/:id - Get a single post
postsApi.get('/:id', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const postId = c.req.param('id')
    const userId = c.req.query('userId')

    // Fetch post
    const { data: post, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .is('deleted_at', null)
      .maybeSingle()

    if (error) throw error
    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    // Get author info
    const { data: author } = await supabase
      .from('users')
      .select('name, profile_photo_url, email')
      .eq('id', post.author_id)
      .maybeSingle()

    // Check visibility permissions
    if (userId) {
      // Check if user is blocked
      const { data: isBlocked } = await supabase
        .from('user_blocks')
        .select('id')
        .eq('blocker_id', post.author_id)
        .eq('blocked_id', userId)
        .maybeSingle()

      if (isBlocked) {
        return c.json({ error: 'Post not found' }, 404)
      }

      // Check visibility access
      if (post.visibility === 'private' && post.author_id !== userId) {
        return c.json({ error: 'Access denied' }, 403)
      }

      if (post.visibility === 'community' && post.community_id) {
        const { data: membership } = await supabase
          .from('community_members')
          .select('id')
          .eq('community_id', post.community_id)
          .eq('user_id', userId)
          .eq('status', 'active')
          .maybeSingle()

        if (!membership) {
          return c.json({ error: 'Access denied' }, 403)
        }
      }

      if (post.visibility === 'connections') {
        const { data: isConnected } = await supabase
          .from('user_connections')
          .select('id')
          .eq('follower_id', userId)
          .eq('following_id', post.author_id)
          .eq('status', 'accepted')
          .maybeSingle()

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
      const { data: reaction } = await supabase
        .from('reactions')
        .select('reaction_type')
        .eq('user_id', userId)
        .eq('target_type', 'post')
        .eq('target_id', postId)
        .maybeSingle()

      userReaction = reaction?.reaction_type || null
    }

    return c.json({
      id: post.id,
      authorId: post.author_id,
      authorName: author?.name,
      authorPhoto: author?.profile_photo_url,
      relationshipId: post.relationship_id,
      communityId: post.community_id,
      contentType: post.content_type,
      content: post.content,
      mediaUrls: post.media_urls ? JSON.parse(post.media_urls as string) : [],
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
postsApi.put(
  '/:id',
  zValidator('json', updatePostSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const postId = c.req.param('id')
      const { userId, content, mediaUrls, visibility } = c.req.valid('json' as never) as {
        userId: string
        content?: string
        mediaUrls?: string[]
        visibility?: string
      }

      // Check if user is the author
      const { data: post } = await supabase
        .from('posts')
        .select('author_id')
        .eq('id', postId)
        .is('deleted_at', null)
        .maybeSingle()

      if (!post) {
        return c.json({ error: 'Post not found' }, 404)
      }

      if (post.author_id !== userId) {
        return c.json({ error: 'Only the author can update this post' }, 403)
      }

      // Update post
      const updates: Record<string, any> = { updated_at: new Date().toISOString() }
      if (content !== undefined) updates.content = content ? sanitizeTextInput(content) : null
      if (mediaUrls !== undefined) updates.media_urls = mediaUrls ? JSON.stringify(mediaUrls) : null
      if (visibility !== undefined) updates.visibility = visibility

      const { error } = await supabase
        .from('posts')
        .update(updates)
        .eq('id', postId)

      if (error) throw error

      return c.json({ success: true, message: 'Post updated' })
    } catch (error) {
      console.error('Update post error:', error)
      return c.json({ error: 'Failed to update post' }, 500)
    }
  }
)

// DELETE /api/posts/:id - Delete a post (soft delete)
postsApi.delete('/:id', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const postId = c.req.param('id')
    const userId = c.req.query('userId')

    if (!userId) {
      return c.json({ error: 'User ID required' }, 400)
    }

    // Check if user is the author or community moderator
    const { data: post } = await supabase
      .from('posts')
      .select('author_id, community_id')
      .eq('id', postId)
      .is('deleted_at', null)
      .maybeSingle()

    if (!post) {
      return c.json({ error: 'Post not found' }, 404)
    }

    let canDelete = post.author_id === userId

    // Check if user is community moderator
    if (!canDelete && post.community_id) {
      const { data: moderator } = await supabase
        .from('community_members')
        .select('role')
        .eq('community_id', post.community_id)
        .eq('user_id', userId)
        .eq('status', 'active')
        .maybeSingle()

      if (moderator && ['owner', 'admin', 'moderator'].includes(moderator.role)) {
        canDelete = true
      }
    }

    if (!canDelete) {
      return c.json({ error: 'Insufficient permissions to delete this post' }, 403)
    }

    // Soft delete
    const { error } = await supabase
      .from('posts')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', postId)

    if (error) throw error

    // Update community post count
    if (post.community_id) {
      const { data: comm } = await supabase
        .from('communities')
        .select('post_count')
        .eq('id', post.community_id)
        .single()

      if (comm) {
        await supabase
          .from('communities')
          .update({
            post_count: Math.max((comm.post_count || 0) - 1, 0),
            updated_at: new Date().toISOString()
          })
          .eq('id', post.community_id)
      }
    }

    return c.json({ success: true, message: 'Post deleted' })
  } catch (error) {
    console.error('Delete post error:', error)
    return c.json({ error: 'Failed to delete post' }, 500)
  }
})

// POST /api/posts/:id/share - Share a post
postsApi.post(
  '/:id/share',
  zValidator('json', sharePostSchema),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(getSupabaseEnv(c))
      const postId = c.req.param('id')
      const { userId, content, visibility, communityId } = c.req.valid('json' as never) as {
        userId: string
        content?: string
        visibility?: string
        communityId?: string | null
      }

      // Check if original post exists and is accessible
      const { data: originalPost } = await supabase
        .from('posts')
        .select('id, visibility, author_id')
        .eq('id', postId)
        .is('deleted_at', null)
        .maybeSingle()

      if (!originalPost) {
        return c.json({ error: 'Original post not found' }, 404)
      }

      // Create share post
      const sharePostId = `post_${Date.now()}_${Math.random().toString(36).substring(7)}`
      const now = new Date().toISOString()

      const { error: insertErr } = await supabase
        .from('posts')
        .insert({
          id: sharePostId,
          author_id: userId,
          community_id: communityId || null,
          content_type: 'text',
          content: content ? sanitizeTextInput(content) : `Shared a post from ${originalPost.author_id}`,
          visibility: visibility || 'connections',
          like_count: 0,
          comment_count: 0,
          share_count: 0,
          created_at: now,
          updated_at: now,
        })

      if (insertErr) throw insertErr

      // Increment share count on original post
      const { data: orig } = await supabase
        .from('posts')
        .select('share_count')
        .eq('id', postId)
        .single()

      if (orig) {
        await supabase
          .from('posts')
          .update({ share_count: (orig.share_count || 0) + 1 })
          .eq('id', postId)
      }

      return c.json({
        success: true,
        sharePostId,
        message: 'Post shared successfully'
      })
    } catch (error) {
      console.error('Share post error:', error)
      return c.json({ error: 'Failed to share post' }, 500)
    }
  }
)

export default postsApi
