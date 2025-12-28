// Better Together: Communities API
// Handles community/group management, membership, and invitations

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import {
  generateId,
  getCurrentDateTime
} from '../utils'

const communitiesApi = new Hono()

/**
 * Helper function to generate URL-safe slug from name
 */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Helper function to generate unique invite code
 */
function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

/**
 * Check if user has permission to manage community
 */
async function checkCommunityPermission(
  db: any,
  communityId: string,
  userId: string,
  requiredRole: 'owner' | 'admin' | 'moderator' = 'admin'
): Promise<boolean> {
  const member = await db.first(
    'SELECT role FROM community_members WHERE community_id = $1 AND user_id = $2 AND status = $3',
    [communityId, userId, 'active']
  )

  if (!member) return false

  const roleHierarchy: Record<string, number> = {
    owner: 3,
    admin: 2,
    moderator: 1,
    member: 0
  }

  return roleHierarchy[member.role] >= roleHierarchy[requiredRole]
}

// GET /api/communities
// List communities with filtering and pagination
communitiesApi.get('/', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const category = c.req.query('category')
    const search = c.req.query('search')
    const sort = c.req.query('sort') || 'recent'
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '20')
    const offset = (page - 1) * limit

    // Build base query
    let query = 'SELECT * FROM communities WHERE 1=1'
    const params: any[] = []

    // Filter by category
    if (category) {
      query += ` AND category = $${params.length + 1}`
      params.push(category)
    }

    // Filter by search term
    if (search) {
      query += ` AND (name ILIKE $${params.length + 1} OR description ILIKE $${params.length + 2})`
      params.push(`%${search}%`, `%${search}%`)
    }

    // Apply sorting
    switch (sort) {
      case 'popular':
        query += ' ORDER BY member_count DESC, created_at DESC'
        break
      case 'alphabetical':
        query += ' ORDER BY name ASC'
        break
      case 'recent':
      default:
        query += ' ORDER BY created_at DESC'
        break
    }

    // Add pagination
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const communities = await db.all(query, params)

    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as count FROM communities WHERE 1=1'
    const countParams: any[] = []
    if (category) {
      countQuery += ` AND category = $${countParams.length + 1}`
      countParams.push(category)
    }
    if (search) {
      countQuery += ` AND (name ILIKE $${countParams.length + 1} OR description ILIKE $${countParams.length + 2})`
      countParams.push(`%${search}%`, `%${search}%`)
    }

    const countResult = await db.first<{ count: number }>(countQuery, countParams)
    const total = countResult?.count || 0

    return c.json({
      communities: communities || [],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get communities error:', error)
    return c.json({ error: 'Failed to get communities' }, 500)
  }
})

// GET /api/communities/:id
// Get community details with membership status
communitiesApi.get('/:id', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const communityId = c.req.param('id')
    const userId = c.get('userId') // Optional - may not be authenticated

    // Get community details
    const community = await db.first<any>(
      'SELECT * FROM communities WHERE id = $1',
      [communityId]
    )

    if (!community) {
      return c.json({ error: 'Community not found' }, 404)
    }

    // Check if community is private and user doesn't have access
    let membershipStatus = null
    if (userId) {
      const membership = await db.first<any>(
        'SELECT * FROM community_members WHERE community_id = $1 AND user_id = $2',
        [communityId, userId]
      )
      membershipStatus = membership
    }

    // Hide private community details if user is not a member
    if (community.privacy_level === 'private' && !membershipStatus) {
      return c.json({
        id: community.id,
        name: community.name,
        privacy_level: community.privacy_level,
        member_count: community.member_count,
        message: 'This is a private community'
      })
    }

    // Get recent posts preview (limited to 3)
    const recentPosts = await db.all(
      `SELECT p.*, u.name as author_name, u.profile_photo_url as author_photo
       FROM posts p
       JOIN users u ON p.author_id = u.id
       WHERE p.community_id = $1 AND p.is_hidden = false
       ORDER BY p.created_at DESC
       LIMIT 3`,
      [communityId]
    )

    return c.json({
      ...community,
      membership_status: membershipStatus,
      recent_posts: recentPosts || []
    })
  } catch (error) {
    console.error('Get community error:', error)
    return c.json({ error: 'Failed to get community' }, 500)
  }
})

// POST /api/communities
// Create new community
communitiesApi.post('/', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.get('userId')

    // Check authentication
    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const {
      name,
      description,
      category,
      privacy_level,
      cover_image_url
    } = await c.req.json()

    // Validation
    if (!name || !description || !category) {
      return c.json({ error: 'Name, description, and category are required' }, 400)
    }

    const validCategories = ['relationship_stage', 'interests', 'location', 'support', 'lifestyle', 'other']
    if (!validCategories.includes(category)) {
      return c.json({ error: 'Invalid category' }, 400)
    }

    const validPrivacyLevels = ['public', 'private', 'invite_only']
    const finalPrivacyLevel = privacy_level && validPrivacyLevels.includes(privacy_level) ? privacy_level : 'public'

    // Generate unique slug
    let slug = generateSlug(name)
    const existingSlug = await db.first('SELECT id FROM communities WHERE slug = $1', [slug])
    if (existingSlug) {
      slug = `${slug}-${generateId().substring(0, 6)}`
    }

    const communityId = generateId()
    const now = getCurrentDateTime()

    // Create community
    await db.run(`
      INSERT INTO communities (
        id, name, slug, description, cover_image_url, privacy_level, category,
        created_by, member_count, post_count, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 1, 0, $9, $10)
    `, [
      communityId,
      name,
      slug,
      description,
      cover_image_url || null,
      finalPrivacyLevel,
      category,
      userId,
      now,
      now
    ])

    // Add creator as owner
    const memberId = generateId()
    await db.run(`
      INSERT INTO community_members (
        id, community_id, user_id, role, status, joined_at, last_active_at
      )
      VALUES ($1, $2, $3, 'owner', 'active', $4, $5)
    `, [memberId, communityId, userId, now, now])

    return c.json({
      success: true,
      community: {
        id: communityId,
        name,
        slug,
        description,
        privacy_level: finalPrivacyLevel,
        category
      }
    }, 201)
  } catch (error) {
    console.error('Create community error:', error)
    return c.json({ error: 'Failed to create community' }, 500)
  }
})

// PUT /api/communities/:id
// Update community details (owner/admin only)
communitiesApi.put('/:id', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const communityId = c.req.param('id')
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    const {
      name,
      description,
      cover_image_url,
      privacy_level,
      category
    } = await c.req.json()

    // Check permissions
    const hasPermission = await checkCommunityPermission(db, communityId, userId, 'admin')
    if (!hasPermission) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    // Build update query
    const updates: string[] = []
    const params: any[] = []
    let paramIndex = 1

    if (name !== undefined) {
      updates.push(`name = $${paramIndex++}`)
      params.push(name)
    }

    if (description !== undefined) {
      updates.push(`description = $${paramIndex++}`)
      params.push(description)
    }

    if (cover_image_url !== undefined) {
      updates.push(`cover_image_url = $${paramIndex++}`)
      params.push(cover_image_url)
    }

    if (privacy_level !== undefined) {
      const validPrivacyLevels = ['public', 'private', 'invite_only']
      if (!validPrivacyLevels.includes(privacy_level)) {
        return c.json({ error: 'Invalid privacy level' }, 400)
      }
      updates.push(`privacy_level = $${paramIndex++}`)
      params.push(privacy_level)
    }

    if (category !== undefined) {
      const validCategories = ['relationship_stage', 'interests', 'location', 'support', 'lifestyle', 'other']
      if (!validCategories.includes(category)) {
        return c.json({ error: 'Invalid category' }, 400)
      }
      updates.push(`category = $${paramIndex++}`)
      params.push(category)
    }

    if (updates.length === 0) {
      return c.json({ error: 'No fields to update' }, 400)
    }

    updates.push(`updated_at = $${paramIndex++}`)
    params.push(getCurrentDateTime())

    params.push(communityId)

    await db.run(
      `UPDATE communities SET ${updates.join(', ')} WHERE id = $${paramIndex}`,
      params
    )

    return c.json({ success: true, message: 'Community updated successfully' })
  } catch (error) {
    console.error('Update community error:', error)
    return c.json({ error: 'Failed to update community' }, 500)
  }
})

// DELETE /api/communities/:id
// Soft delete community (owner only)
communitiesApi.delete('/:id', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const communityId = c.req.param('id')
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Check if user is owner
    const hasPermission = await checkCommunityPermission(db, communityId, userId, 'owner')
    if (!hasPermission) {
      return c.json({ error: 'Only the community owner can delete' }, 403)
    }

    // Soft delete by removing the community (CASCADE will handle members)
    // For true soft delete, add deleted_at column to schema
    await db.run('DELETE FROM communities WHERE id = $1', [communityId])

    return c.json({ success: true, message: 'Community deleted successfully' })
  } catch (error) {
    console.error('Delete community error:', error)
    return c.json({ error: 'Failed to delete community' }, 500)
  }
})

// POST /api/communities/:id/join
// Join a community
communitiesApi.post('/:id/join', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const communityId = c.req.param('id')
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { invite_code } = await c.req.json()

    // Get community details
    const community = await db.first<{ privacy_level: string }>(
      'SELECT privacy_level FROM communities WHERE id = $1',
      [communityId]
    )

    if (!community) {
      return c.json({ error: 'Community not found' }, 404)
    }

    // Check if already a member
    const existingMember = await db.first(
      'SELECT id, status FROM community_members WHERE community_id = $1 AND user_id = $2',
      [communityId, userId]
    )

    if (existingMember) {
      return c.json({ error: 'Already a member of this community' }, 400)
    }

    let status = 'active'
    let invitedBy = null

    // Handle privacy level logic
    if (community.privacy_level === 'private' || community.privacy_level === 'invite_only') {
      if (!invite_code) {
        return c.json({ error: 'Invite code required for this community' }, 400)
      }

      // Validate invite code
      const invite = await db.first<any>(
        `SELECT * FROM community_invites
         WHERE community_id = $1 AND invite_code = $2 AND status = 'pending' AND expires_at > CURRENT_TIMESTAMP`,
        [communityId, invite_code]
      )

      if (!invite) {
        return c.json({ error: 'Invalid or expired invite code' }, 400)
      }

      invitedBy = invite.invited_by

      // Mark invite as accepted
      await db.run(
        `UPDATE community_invites
         SET status = 'accepted', accepted_at = $1, accepted_by = $2
         WHERE id = $3`,
        [getCurrentDateTime(), userId, invite.id]
      )
    }

    // Add user as member
    const memberId = generateId()
    const now = getCurrentDateTime()

    await db.run(`
      INSERT INTO community_members (
        id, community_id, user_id, role, status, invited_by, joined_at, last_active_at
      )
      VALUES ($1, $2, $3, 'member', $4, $5, $6, $7)
    `, [memberId, communityId, userId, status, invitedBy, now, now])

    // Update member count
    await db.run(
      'UPDATE communities SET member_count = member_count + 1 WHERE id = $1',
      [communityId]
    )

    return c.json({
      success: true,
      message: 'Successfully joined community',
      membership_id: memberId
    })
  } catch (error) {
    console.error('Join community error:', error)
    return c.json({ error: 'Failed to join community' }, 500)
  }
})

// POST /api/communities/:id/leave
// Leave a community
communitiesApi.post('/:id/leave', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const communityId = c.req.param('id')
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Check membership
    const membership = await db.first<{ role: string }>(
      'SELECT role FROM community_members WHERE community_id = $1 AND user_id = $2',
      [communityId, userId]
    )

    if (!membership) {
      return c.json({ error: 'Not a member of this community' }, 400)
    }

    // Owner cannot leave without transferring ownership
    if (membership.role === 'owner') {
      return c.json({
        error: 'Community owner cannot leave. Transfer ownership first or delete the community.'
      }, 400)
    }

    // Remove membership
    await db.run(
      'DELETE FROM community_members WHERE community_id = $1 AND user_id = $2',
      [communityId, userId]
    )

    // Update member count
    await db.run(
      'UPDATE communities SET member_count = GREATEST(0, member_count - 1) WHERE id = $1',
      [communityId]
    )

    return c.json({ success: true, message: 'Successfully left community' })
  } catch (error) {
    console.error('Leave community error:', error)
    return c.json({ error: 'Failed to leave community' }, 500)
  }
})

// GET /api/communities/:id/members
// List community members
communitiesApi.get('/:id/members', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const communityId = c.req.param('id')
    const role = c.req.query('role')
    const search = c.req.query('search')
    const page = parseInt(c.req.query('page') || '1')
    const limit = parseInt(c.req.query('limit') || '50')
    const offset = (page - 1) * limit

    // Build query
    let query = `
      SELECT
        cm.id, cm.role, cm.status, cm.joined_at,
        u.id as user_id, u.name, u.nickname, u.profile_photo_url
      FROM community_members cm
      JOIN users u ON cm.user_id = u.id
      WHERE cm.community_id = $1
    `
    const params: any[] = [communityId]

    if (role) {
      query += ` AND cm.role = $${params.length + 1}`
      params.push(role)
    }

    if (search) {
      query += ` AND (u.name ILIKE $${params.length + 1} OR u.nickname ILIKE $${params.length + 2})`
      params.push(`%${search}%`, `%${search}%`)
    }

    query += ` ORDER BY
      CASE cm.role
        WHEN 'owner' THEN 1
        WHEN 'admin' THEN 2
        WHEN 'moderator' THEN 3
        ELSE 4
      END,
      cm.joined_at ASC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}`
    params.push(limit, offset)

    const members = await db.all(query, params)

    return c.json({ members: members || [] })
  } catch (error) {
    console.error('Get community members error:', error)
    return c.json({ error: 'Failed to get members' }, 500)
  }
})

// PUT /api/communities/:id/members/:userId
// Update member role (admin/owner only)
communitiesApi.put('/:id/members/:userId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const communityId = c.req.param('id')
    const targetUserId = c.req.param('userId')
    const currentUserId = c.get('userId')

    if (!currentUserId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { role } = await c.req.json()

    // Check permissions
    const hasPermission = await checkCommunityPermission(db, communityId, currentUserId, 'admin')
    if (!hasPermission) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    // Validate role
    const validRoles = ['member', 'moderator', 'admin']
    if (!validRoles.includes(role)) {
      return c.json({ error: 'Invalid role. Valid roles: member, moderator, admin' }, 400)
    }

    // Check if target user is a member
    const targetMember = await db.first<{ role: string }>(
      'SELECT role FROM community_members WHERE community_id = $1 AND user_id = $2',
      [communityId, targetUserId]
    )

    if (!targetMember) {
      return c.json({ error: 'User is not a member of this community' }, 404)
    }

    // Cannot change owner role
    if (targetMember.role === 'owner') {
      return c.json({ error: 'Cannot change owner role' }, 400)
    }

    // Update role
    await db.run(
      'UPDATE community_members SET role = $1 WHERE community_id = $2 AND user_id = $3',
      [role, communityId, targetUserId]
    )

    return c.json({ success: true, message: 'Member role updated successfully' })
  } catch (error) {
    console.error('Update member role error:', error)
    return c.json({ error: 'Failed to update member role' }, 500)
  }
})

// DELETE /api/communities/:id/members/:userId
// Remove or ban member (moderator/admin/owner only)
communitiesApi.delete('/:id/members/:userId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const communityId = c.req.param('id')
    const targetUserId = c.req.param('userId')
    const currentUserId = c.get('userId')

    if (!currentUserId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { ban } = await c.req.json()

    // Check permissions
    const hasPermission = await checkCommunityPermission(db, communityId, currentUserId, 'moderator')
    if (!hasPermission) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    // Cannot remove owner
    const targetMember = await db.first<{ role: string }>(
      'SELECT role FROM community_members WHERE community_id = $1 AND user_id = $2',
      [communityId, targetUserId]
    )

    if (targetMember?.role === 'owner') {
      return c.json({ error: 'Cannot remove community owner' }, 400)
    }

    if (ban) {
      // Ban member (set status to banned)
      await db.run(
        'UPDATE community_members SET status = $1 WHERE community_id = $2 AND user_id = $3',
        ['banned', communityId, targetUserId]
      )
    } else {
      // Remove member completely
      await db.run(
        'DELETE FROM community_members WHERE community_id = $1 AND user_id = $2',
        [communityId, targetUserId]
      )
    }

    // Update member count
    await db.run(
      'UPDATE communities SET member_count = GREATEST(0, member_count - 1) WHERE id = $1',
      [communityId]
    )

    return c.json({
      success: true,
      message: ban ? 'Member banned successfully' : 'Member removed successfully'
    })
  } catch (error) {
    console.error('Remove member error:', error)
    return c.json({ error: 'Failed to remove member' }, 500)
  }
})

// POST /api/communities/:id/invite
// Create invite code (admin/owner only)
communitiesApi.post('/:id/invite', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const communityId = c.req.param('id')
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { invited_email, expires_in_days } = await c.req.json()

    // Check permissions
    const hasPermission = await checkCommunityPermission(db, communityId, userId, 'admin')
    if (!hasPermission) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    // Generate unique invite code
    let inviteCode = generateInviteCode()
    let existingCode = await db.first('SELECT id FROM community_invites WHERE invite_code = $1', [inviteCode])

    while (existingCode) {
      inviteCode = generateInviteCode()
      existingCode = await db.first('SELECT id FROM community_invites WHERE invite_code = $1', [inviteCode])
    }

    // Calculate expiration date
    const expiresInDays = expires_in_days || 7
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    const inviteId = generateId()
    const now = getCurrentDateTime()

    await db.run(`
      INSERT INTO community_invites (
        id, community_id, invited_by, invited_email, invite_code, status, expires_at, created_at
      )
      VALUES ($1, $2, $3, $4, $5, 'pending', $6, $7)
    `, [
      inviteId,
      communityId,
      userId,
      invited_email || null,
      inviteCode,
      expiresAt.toISOString(),
      now
    ])

    return c.json({
      success: true,
      invite_code: inviteCode,
      expires_at: expiresAt.toISOString(),
      invite_id: inviteId
    })
  } catch (error) {
    console.error('Create invite error:', error)
    return c.json({ error: 'Failed to create invite' }, 500)
  }
})

// POST /api/communities/join/:inviteCode
// Join community via invite code
communitiesApi.post('/join/:inviteCode', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const inviteCode = c.req.param('inviteCode')
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Validate invite code
    const invite = await db.first<any>(
      `SELECT * FROM community_invites
       WHERE invite_code = $1 AND status = 'pending' AND expires_at > CURRENT_TIMESTAMP`,
      [inviteCode]
    )

    if (!invite) {
      return c.json({ error: 'Invalid or expired invite code' }, 400)
    }

    const communityId = invite.community_id

    // Check if already a member
    const existingMember = await db.first(
      'SELECT id FROM community_members WHERE community_id = $1 AND user_id = $2',
      [communityId, userId]
    )

    if (existingMember) {
      return c.json({ error: 'Already a member of this community' }, 400)
    }

    // Add user as member
    const memberId = generateId()
    const now = getCurrentDateTime()

    await db.run(`
      INSERT INTO community_members (
        id, community_id, user_id, role, status, invited_by, joined_at, last_active_at
      )
      VALUES ($1, $2, $3, 'member', 'active', $4, $5, $6)
    `, [memberId, communityId, userId, invite.invited_by, now, now])

    // Update member count
    await db.run(
      'UPDATE communities SET member_count = member_count + 1 WHERE id = $1',
      [communityId]
    )

    // Mark invite as accepted
    await db.run(
      `UPDATE community_invites
       SET status = 'accepted', accepted_at = $1, accepted_by = $2
       WHERE id = $3`,
      [now, userId, invite.id]
    )

    // Get community info to return
    const community = await db.first<{ name: string; slug: string }>(
      'SELECT name, slug FROM communities WHERE id = $1',
      [communityId]
    )

    return c.json({
      success: true,
      message: 'Successfully joined community',
      community: {
        id: communityId,
        name: community?.name,
        slug: community?.slug
      }
    })
  } catch (error) {
    console.error('Join via invite error:', error)
    return c.json({ error: 'Failed to join community' }, 500)
  }
})

export default communitiesApi
