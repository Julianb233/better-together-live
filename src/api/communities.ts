// Better Together: Communities API
// Handles community/group management, membership, and invitations
// Migrated from Neon raw SQL to Supabase client

import { Hono } from 'hono'
import type { Context } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createAdminClient } from '../lib/supabase/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import {
  generateId,
  getCurrentDateTime
} from '../utils'
import { getPaginationParams } from '../lib/pagination'
import { sanitizeTextInput } from '../lib/sanitize'
import {
  createCommunitySchema,
  updateCommunitySchema,
  communityQuerySchema,
  joinCommunitySchema,
  updateMemberRoleSchema,
  removeMemberSchema,
  createInviteSchema,
  memberQuerySchema
} from '../lib/validation/schemas/communities'

function getSupabaseEnv(c: Context) {
  return {
    SUPABASE_URL: c.env?.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: c.env?.SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: c.env?.SUPABASE_SERVICE_ROLE_KEY
  }
}

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
  supabase: SupabaseClient,
  communityId: string,
  userId: string,
  requiredRole: 'owner' | 'admin' | 'moderator' = 'admin'
): Promise<boolean> {
  const { data: member } = await supabase
    .from('community_members')
    .select('role')
    .eq('community_id', communityId)
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()

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
communitiesApi.get('/',
  zValidator('query', communityQuerySchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const { category, search, sort, limit: qLimit, page: qPage } = c.req.valid('query' as never) as any
    const { limit, offset } = getPaginationParams(c)

    // Build query
    let query = supabase.from('communities').select('*')

    if (category) {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Apply sorting
    switch (sort) {
      case 'popular':
        query = query.order('member_count', { ascending: false }).order('created_at', { ascending: false })
        break
      case 'alphabetical':
        query = query.order('name', { ascending: true })
        break
      case 'recent':
      default:
        query = query.order('created_at', { ascending: false })
        break
    }

    // Add pagination
    query = query.range(offset, offset + limit - 1)

    const { data: communities, error } = await query

    if (error) {
      c.var.logger.error({ err: error }, 'Get communities query error')
      return c.json({ error: 'Failed to get communities' }, 500)
    }

    // Get total count
    let countQuery = supabase.from('communities').select('*', { count: 'exact', head: true })
    if (category) {
      countQuery = countQuery.eq('category', category)
    }
    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    const { count: total } = await countQuery
    const totalCount = total || 0

    return c.json({
      communities: communities || [],
      pagination: {
        page: Math.floor(offset / limit) + 1,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    })
  } catch (error) {
    c.var.logger.error({ err: error }, 'Get communities error')
    return c.json({ error: 'Failed to get communities' }, 500)
  }
})

// GET /api/communities/:id
// Get community details with membership status
communitiesApi.get('/:id', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const communityId = c.req.param('id')
    const userId = c.get('userId') // Optional - may not be authenticated

    // Get community details
    const { data: community } = await supabase
      .from('communities')
      .select('*')
      .eq('id', communityId)
      .maybeSingle()

    if (!community) {
      return c.json({ error: 'Community not found' }, 404)
    }

    // Check membership status
    let membershipStatus = null
    if (userId) {
      const { data: membership } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId)
        .eq('user_id', userId)
        .maybeSingle()
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

    // Get recent posts preview (limited to 3) with author info
    const { data: recentPostsRaw } = await supabase
      .from('posts')
      .select('*')
      .eq('community_id', communityId)
      .eq('is_hidden', false)
      .order('created_at', { ascending: false })
      .limit(3)

    // Enrich posts with author info
    let recentPosts: any[] = []
    if (recentPostsRaw && recentPostsRaw.length > 0) {
      const authorIds = [...new Set(recentPostsRaw.map(p => p.author_id))]
      const { data: authors } = await supabase
        .from('users')
        .select('id, name, profile_photo_url')
        .in('id', authorIds)

      const authorsMap = new Map((authors || []).map(a => [a.id, a]))
      recentPosts = recentPostsRaw.map(p => {
        const author = authorsMap.get(p.author_id)
        return {
          ...p,
          author_name: author?.name || null,
          author_photo: author?.profile_photo_url || null
        }
      })
    }

    return c.json({
      ...community,
      membership_status: membershipStatus,
      recent_posts: recentPosts
    })
  } catch (error) {
    c.var.logger.error({ err: error }, 'Get community error')
    return c.json({ error: 'Failed to get community' }, 500)
  }
})

// POST /api/communities
// Create new community
communitiesApi.post('/',
  zValidator('json', createCommunitySchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { name, description, category, privacy_level, cover_image_url } = c.req.valid('json' as never) as any

    const finalPrivacyLevel = privacy_level || 'public'

    // Generate unique slug
    let slug = generateSlug(name)
    const { data: existingSlug } = await supabase
      .from('communities')
      .select('id')
      .eq('slug', slug)
      .maybeSingle()

    if (existingSlug) {
      slug = `${slug}-${generateId().substring(0, 6)}`
    }

    const communityId = generateId()
    const now = getCurrentDateTime()

    // Create community
    const { error: insertError } = await supabase
      .from('communities')
      .insert({
        id: communityId,
        name: sanitizeTextInput(name),
        slug,
        description: sanitizeTextInput(description),
        cover_image_url: cover_image_url || null,
        privacy_level: finalPrivacyLevel,
        category,
        created_by: userId,
        member_count: 1,
        post_count: 0,
        created_at: now,
        updated_at: now
      })

    if (insertError) {
      c.var.logger.error({ err: insertError }, 'Create community insert error')
      return c.json({ error: 'Failed to create community' }, 500)
    }

    // Add creator as owner
    const memberId = generateId()
    await supabase
      .from('community_members')
      .insert({
        id: memberId,
        community_id: communityId,
        user_id: userId,
        role: 'owner',
        status: 'active',
        joined_at: now,
        last_active_at: now
      })

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
    c.var.logger.error({ err: error }, 'Create community error')
    return c.json({ error: 'Failed to create community' }, 500)
  }
})

// PUT /api/communities/:id
// Update community details (owner/admin only)
communitiesApi.put('/:id',
  zValidator('json', updateCommunitySchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const communityId = c.req.param('id')
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const body = c.req.valid('json' as never) as any

    // Check permissions
    const hasPermission = await checkCommunityPermission(supabase, communityId, userId, 'admin')
    if (!hasPermission) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    // Build update object
    const updates: Record<string, any> = {}

    if (body.name !== undefined) {
      updates.name = sanitizeTextInput(body.name)
    }
    if (body.description !== undefined) {
      updates.description = sanitizeTextInput(body.description)
    }
    if (body.cover_image_url !== undefined) {
      updates.cover_image_url = body.cover_image_url
    }
    if (body.privacy_level !== undefined) {
      updates.privacy_level = body.privacy_level
    }
    if (body.category !== undefined) {
      updates.category = body.category
    }

    if (Object.keys(updates).length === 0) {
      return c.json({ error: 'No fields to update' }, 400)
    }

    updates.updated_at = getCurrentDateTime()

    const { error: updateError } = await supabase
      .from('communities')
      .update(updates)
      .eq('id', communityId)

    if (updateError) {
      c.var.logger.error({ err: updateError }, 'Update community error')
      return c.json({ error: 'Failed to update community' }, 500)
    }

    return c.json({ success: true, message: 'Community updated successfully' })
  } catch (error) {
    c.var.logger.error({ err: error }, 'Update community error')
    return c.json({ error: 'Failed to update community' }, 500)
  }
})

// DELETE /api/communities/:id
// Soft delete community (owner only)
communitiesApi.delete('/:id', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const communityId = c.req.param('id')
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Check if user is owner
    const hasPermission = await checkCommunityPermission(supabase, communityId, userId, 'owner')
    if (!hasPermission) {
      return c.json({ error: 'Only the community owner can delete' }, 403)
    }

    // Delete community (CASCADE will handle members)
    const { error: deleteError } = await supabase
      .from('communities')
      .delete()
      .eq('id', communityId)

    if (deleteError) {
      c.var.logger.error({ err: deleteError }, 'Delete community error')
      return c.json({ error: 'Failed to delete community' }, 500)
    }

    return c.json({ success: true, message: 'Community deleted successfully' })
  } catch (error) {
    c.var.logger.error({ err: error }, 'Delete community error')
    return c.json({ error: 'Failed to delete community' }, 500)
  }
})

// POST /api/communities/:id/join
// Join a community
communitiesApi.post('/:id/join',
  zValidator('json', joinCommunitySchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const communityId = c.req.param('id')
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { invite_code } = c.req.valid('json' as never) as any

    // Get community details
    const { data: community } = await supabase
      .from('communities')
      .select('privacy_level')
      .eq('id', communityId)
      .maybeSingle()

    if (!community) {
      return c.json({ error: 'Community not found' }, 404)
    }

    // Check if already a member
    const { data: existingMember } = await supabase
      .from('community_members')
      .select('id, status')
      .eq('community_id', communityId)
      .eq('user_id', userId)
      .maybeSingle()

    if (existingMember) {
      return c.json({ error: 'Already a member of this community' }, 400)
    }

    let invitedBy = null

    // Handle privacy level logic
    if (community.privacy_level === 'private' || community.privacy_level === 'invite_only') {
      if (!invite_code) {
        return c.json({ error: 'Invite code required for this community' }, 400)
      }

      // Validate invite code
      const { data: invite } = await supabase
        .from('community_invites')
        .select('*')
        .eq('community_id', communityId)
        .eq('invite_code', invite_code)
        .eq('status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .maybeSingle()

      if (!invite) {
        return c.json({ error: 'Invalid or expired invite code' }, 400)
      }

      invitedBy = invite.invited_by

      // Mark invite as accepted
      await supabase
        .from('community_invites')
        .update({
          status: 'accepted',
          accepted_at: getCurrentDateTime(),
          accepted_by: userId
        })
        .eq('id', invite.id)
    }

    // Add user as member
    const memberId = generateId()
    const now = getCurrentDateTime()

    await supabase
      .from('community_members')
      .insert({
        id: memberId,
        community_id: communityId,
        user_id: userId,
        role: 'member',
        status: 'active',
        invited_by: invitedBy,
        joined_at: now,
        last_active_at: now
      })

    // Update member count (read + write since Supabase doesn't support increment directly)
    const { data: currentCommunity } = await supabase
      .from('communities')
      .select('member_count')
      .eq('id', communityId)
      .single()

    await supabase
      .from('communities')
      .update({ member_count: (currentCommunity?.member_count || 0) + 1 })
      .eq('id', communityId)

    return c.json({
      success: true,
      message: 'Successfully joined community',
      membership_id: memberId
    })
  } catch (error) {
    c.var.logger.error({ err: error }, 'Join community error')
    return c.json({ error: 'Failed to join community' }, 500)
  }
})

// POST /api/communities/:id/leave
// Leave a community
communitiesApi.post('/:id/leave', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const communityId = c.req.param('id')
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Check membership
    const { data: membership } = await supabase
      .from('community_members')
      .select('role')
      .eq('community_id', communityId)
      .eq('user_id', userId)
      .maybeSingle()

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
    await supabase
      .from('community_members')
      .delete()
      .eq('community_id', communityId)
      .eq('user_id', userId)

    // Update member count
    const { data: currentCommunity } = await supabase
      .from('communities')
      .select('member_count')
      .eq('id', communityId)
      .single()

    await supabase
      .from('communities')
      .update({ member_count: Math.max(0, (currentCommunity?.member_count || 1) - 1) })
      .eq('id', communityId)

    return c.json({ success: true, message: 'Successfully left community' })
  } catch (error) {
    c.var.logger.error({ err: error }, 'Leave community error')
    return c.json({ error: 'Failed to leave community' }, 500)
  }
})

// GET /api/communities/:id/members
// List community members
communitiesApi.get('/:id/members',
  zValidator('query', memberQuerySchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const communityId = c.req.param('id')
    const { role, search } = c.req.valid('query' as never) as any
    const { limit, offset } = getPaginationParams(c)

    // Fetch community members
    let membersQuery = supabase
      .from('community_members')
      .select('id, role, status, joined_at, user_id')
      .eq('community_id', communityId)

    if (role) {
      membersQuery = membersQuery.eq('role', role)
    }

    // Order by role hierarchy then joined_at
    membersQuery = membersQuery
      .order('joined_at', { ascending: true })
      .range(offset, offset + limit - 1)

    const { data: membersRaw } = await membersQuery

    if (!membersRaw || membersRaw.length === 0) {
      return c.json({ members: [] })
    }

    // Fetch user details for members
    const userIds = membersRaw.map(m => m.user_id)
    let usersQuery = supabase
      .from('users')
      .select('id, name, nickname, profile_photo_url')
      .in('id', userIds)

    if (search) {
      usersQuery = usersQuery.or(`name.ilike.%${search}%,nickname.ilike.%${search}%`)
    }

    const { data: users } = await usersQuery
    const usersMap = new Map((users || []).map(u => [u.id, u]))

    // Combine members with user info
    const members = membersRaw
      .map(m => {
        const user = usersMap.get(m.user_id)
        if (!user) return null // user was filtered out by search
        return {
          id: m.id,
          role: m.role,
          status: m.status,
          joined_at: m.joined_at,
          user_id: user.id,
          name: user.name,
          nickname: user.nickname,
          profile_photo_url: user.profile_photo_url
        }
      })
      .filter(Boolean)

    // Sort by role hierarchy
    const roleOrder: Record<string, number> = { owner: 1, admin: 2, moderator: 3, member: 4 }
    members.sort((a: any, b: any) => (roleOrder[a.role] || 4) - (roleOrder[b.role] || 4))

    return c.json({ members })
  } catch (error) {
    c.var.logger.error({ err: error }, 'Get community members error')
    return c.json({ error: 'Failed to get members' }, 500)
  }
})

// PUT /api/communities/:id/members/:userId
// Update member role (admin/owner only)
communitiesApi.put('/:id/members/:userId',
  zValidator('json', updateMemberRoleSchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const communityId = c.req.param('id')
    const targetUserId = c.req.param('userId')
    const currentUserId = c.get('userId')

    if (!currentUserId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { role } = c.req.valid('json' as never) as any

    // Check permissions
    const hasPermission = await checkCommunityPermission(supabase, communityId, currentUserId, 'admin')
    if (!hasPermission) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    // Check if target user is a member
    const { data: targetMember } = await supabase
      .from('community_members')
      .select('role')
      .eq('community_id', communityId)
      .eq('user_id', targetUserId)
      .maybeSingle()

    if (!targetMember) {
      return c.json({ error: 'User is not a member of this community' }, 404)
    }

    // Cannot change owner role
    if (targetMember.role === 'owner') {
      return c.json({ error: 'Cannot change owner role' }, 400)
    }

    // Update role
    await supabase
      .from('community_members')
      .update({ role })
      .eq('community_id', communityId)
      .eq('user_id', targetUserId)

    return c.json({ success: true, message: 'Member role updated successfully' })
  } catch (error) {
    c.var.logger.error({ err: error }, 'Update member role error')
    return c.json({ error: 'Failed to update member role' }, 500)
  }
})

// DELETE /api/communities/:id/members/:userId
// Remove or ban member (moderator/admin/owner only)
communitiesApi.delete('/:id/members/:userId',
  zValidator('json', removeMemberSchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const communityId = c.req.param('id')
    const targetUserId = c.req.param('userId')
    const currentUserId = c.get('userId')

    if (!currentUserId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { ban } = c.req.valid('json' as never) as any

    // Check permissions
    const hasPermission = await checkCommunityPermission(supabase, communityId, currentUserId, 'moderator')
    if (!hasPermission) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    // Cannot remove owner
    const { data: targetMember } = await supabase
      .from('community_members')
      .select('role')
      .eq('community_id', communityId)
      .eq('user_id', targetUserId)
      .maybeSingle()

    if (targetMember?.role === 'owner') {
      return c.json({ error: 'Cannot remove community owner' }, 400)
    }

    if (ban) {
      // Ban member (set status to banned)
      await supabase
        .from('community_members')
        .update({ status: 'banned' })
        .eq('community_id', communityId)
        .eq('user_id', targetUserId)
    } else {
      // Remove member completely
      await supabase
        .from('community_members')
        .delete()
        .eq('community_id', communityId)
        .eq('user_id', targetUserId)
    }

    // Update member count
    const { data: currentCommunity } = await supabase
      .from('communities')
      .select('member_count')
      .eq('id', communityId)
      .single()

    await supabase
      .from('communities')
      .update({ member_count: Math.max(0, (currentCommunity?.member_count || 1) - 1) })
      .eq('id', communityId)

    return c.json({
      success: true,
      message: ban ? 'Member banned successfully' : 'Member removed successfully'
    })
  } catch (error) {
    c.var.logger.error({ err: error }, 'Remove member error')
    return c.json({ error: 'Failed to remove member' }, 500)
  }
})

// POST /api/communities/:id/invite
// Create invite code (admin/owner only)
communitiesApi.post('/:id/invite',
  zValidator('json', createInviteSchema),
  async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const communityId = c.req.param('id')
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { invited_email, expires_in_days } = c.req.valid('json' as never) as any

    // Check permissions
    const hasPermission = await checkCommunityPermission(supabase, communityId, userId, 'admin')
    if (!hasPermission) {
      return c.json({ error: 'Unauthorized' }, 403)
    }

    // Generate unique invite code
    let inviteCode = generateInviteCode()
    let { data: existingCode } = await supabase
      .from('community_invites')
      .select('id')
      .eq('invite_code', inviteCode)
      .maybeSingle()

    while (existingCode) {
      inviteCode = generateInviteCode()
      const result = await supabase
        .from('community_invites')
        .select('id')
        .eq('invite_code', inviteCode)
        .maybeSingle()
      existingCode = result.data
    }

    // Calculate expiration date
    const expiresInDays = expires_in_days || 7
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expiresInDays)

    const inviteId = generateId()
    const now = getCurrentDateTime()

    await supabase
      .from('community_invites')
      .insert({
        id: inviteId,
        community_id: communityId,
        invited_by: userId,
        invited_email: invited_email || null,
        invite_code: inviteCode,
        status: 'pending',
        expires_at: expiresAt.toISOString(),
        created_at: now
      })

    return c.json({
      success: true,
      invite_code: inviteCode,
      expires_at: expiresAt.toISOString(),
      invite_id: inviteId
    })
  } catch (error) {
    c.var.logger.error({ err: error }, 'Create invite error')
    return c.json({ error: 'Failed to create invite' }, 500)
  }
})

// POST /api/communities/join/:inviteCode
// Join community via invite code
communitiesApi.post('/join/:inviteCode', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const inviteCode = c.req.param('inviteCode')
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    // Validate invite code
    const { data: invite } = await supabase
      .from('community_invites')
      .select('*')
      .eq('invite_code', inviteCode)
      .eq('status', 'pending')
      .gt('expires_at', new Date().toISOString())
      .maybeSingle()

    if (!invite) {
      return c.json({ error: 'Invalid or expired invite code' }, 400)
    }

    const communityId = invite.community_id

    // Check if already a member
    const { data: existingMember } = await supabase
      .from('community_members')
      .select('id')
      .eq('community_id', communityId)
      .eq('user_id', userId)
      .maybeSingle()

    if (existingMember) {
      return c.json({ error: 'Already a member of this community' }, 400)
    }

    // Add user as member
    const memberId = generateId()
    const now = getCurrentDateTime()

    await supabase
      .from('community_members')
      .insert({
        id: memberId,
        community_id: communityId,
        user_id: userId,
        role: 'member',
        status: 'active',
        invited_by: invite.invited_by,
        joined_at: now,
        last_active_at: now
      })

    // Update member count
    const { data: currentCommunity } = await supabase
      .from('communities')
      .select('member_count')
      .eq('id', communityId)
      .single()

    await supabase
      .from('communities')
      .update({ member_count: (currentCommunity?.member_count || 0) + 1 })
      .eq('id', communityId)

    // Mark invite as accepted
    await supabase
      .from('community_invites')
      .update({
        status: 'accepted',
        accepted_at: now,
        accepted_by: userId
      })
      .eq('id', invite.id)

    // Get community info to return
    const { data: community } = await supabase
      .from('communities')
      .select('name, slug')
      .eq('id', communityId)
      .maybeSingle()

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
    c.var.logger.error({ err: error }, 'Join via invite error')
    return c.json({ error: 'Failed to join community' }, 500)
  }
})

export default communitiesApi
