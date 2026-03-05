// Better Together: In-App Notifications API
// Handles notification fetching and status management

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { checkOwnership, forbiddenResponse } from '../lib/security'
import { getPaginationParams } from '../lib/pagination'

const notificationsApi = new Hono()

// GET /api/notifications/:userId
// Get notifications for user
notificationsApi.get('/:userId', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const userId = c.req.param('userId')

    if (!checkOwnership(c, userId)) {
      return forbiddenResponse(c)
    }

    const { limit } = getPaginationParams(c)
    const unread_only = c.req.query('unread_only') === 'true'

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (unread_only) {
      query = query.eq('is_read', false)
    }

    const { data: results, error } = await query

    if (error) throw error

    return c.json({ notifications: results || [] })
  } catch (error) {
    console.error('Get notifications error:', error)
    return c.json({ error: 'Failed to get notifications' }, 500)
  }
})

// PUT /api/notifications/:notificationId/read
// Mark notification as read
notificationsApi.put('/:notificationId/read', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const notificationId = c.req.param('notificationId')

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)

    if (error) throw error

    return c.json({ message: 'Notification marked as read' })
  } catch (error) {
    console.error('Mark notification read error:', error)
    return c.json({ error: 'Failed to mark notification as read' }, 500)
  }
})

// PUT /api/notifications/:userId/read-all
// Mark all notifications as read for a user
notificationsApi.put('/:userId/read-all', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const userId = c.req.param('userId')

    if (!checkOwnership(c, userId)) {
      return forbiddenResponse(c)
    }

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error

    return c.json({ message: 'All notifications marked as read' })
  } catch (error) {
    console.error('Mark all read error:', error)
    return c.json({ error: 'Failed to mark all notifications as read' }, 500)
  }
})

// GET /api/notifications/:userId/unread-count
// Get unread notification count
notificationsApi.get('/:userId/unread-count', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const userId = c.req.param('userId')

    if (!checkOwnership(c, userId)) {
      return forbiddenResponse(c)
    }

    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false)

    if (error) throw error

    return c.json({ unread_count: count || 0 })
  } catch (error) {
    console.error('Get unread count error:', error)
    return c.json({ error: 'Failed to get unread count' }, 500)
  }
})

export default notificationsApi
