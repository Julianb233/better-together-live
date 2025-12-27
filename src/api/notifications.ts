// Better Together: In-App Notifications API
// Handles notification fetching and status management

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'

const notificationsApi = new Hono()

// GET /api/notifications/:userId
// Get notifications for user
notificationsApi.get('/:userId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.req.param('userId')
    const limit = c.req.query('limit') || '20'
    const unread_only = c.req.query('unread_only') === 'true'

    let query = 'SELECT * FROM notifications WHERE user_id = $1'
    const params: any[] = [userId]

    if (unread_only) {
      query += ' AND is_read = false'
    }

    query += ` ORDER BY created_at DESC LIMIT $${params.length + 1}`
    params.push(parseInt(limit))

    const results = await db.all(query, params)

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
    const db = createDatabase(c.env as Env)
    const notificationId = c.req.param('notificationId')

    await db.run(
      'UPDATE notifications SET is_read = true WHERE id = $1',
      [notificationId]
    )

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
    const db = createDatabase(c.env as Env)
    const userId = c.req.param('userId')

    await db.run(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
      [userId]
    )

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
    const db = createDatabase(c.env as Env)
    const userId = c.req.param('userId')

    const result = await db.first<{ count: number }>(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false',
      [userId]
    )

    return c.json({ unread_count: result?.count || 0 })
  } catch (error) {
    console.error('Get unread count error:', error)
    return c.json({ error: 'Failed to get unread count' }, 500)
  }
})

export default notificationsApi
