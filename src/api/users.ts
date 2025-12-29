// Better Together: User Preferences API
// Handles user settings, love languages, and notification preferences

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import { extractToken, verifyToken } from './auth'

const usersApi = new Hono()

// GET /api/users/me - Get current user (mobile compatibility alias for /api/auth/me)
usersApi.get('/me', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const accessToken = extractToken(c, 'access')

    if (!accessToken) {
      return c.json({ error: 'Not authenticated' }, 401)
    }

    const payload = await verifyToken(accessToken, c.env, 'access')
    if (!payload) {
      return c.json({ error: 'Invalid or expired token' }, 401)
    }

    const user = await db.first<{
      id: string
      email: string
      name: string
      nickname: string | null
      profile_photo_url: string | null
      timezone: string
      primary_love_language: string | null
      secondary_love_language: string | null
    }>(
      `SELECT id, email, name, nickname, profile_photo_url, timezone,
              primary_love_language, secondary_love_language
       FROM users WHERE id = $1`,
      [payload.userId]
    )

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        nickname: user.nickname,
        profilePhotoUrl: user.profile_photo_url,
        timezone: user.timezone,
        primaryLoveLanguage: user.primary_love_language,
        secondaryLoveLanguage: user.secondary_love_language
      }
    })
  } catch (error) {
    console.error('Get current user error:', error)
    return c.json({ error: 'Failed to get user info' }, 500)
  }
})

// GET /api/users/:userId/preferences
usersApi.get('/:userId/preferences', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.req.param('userId')

    const user = await db.first<any>(`
      SELECT id, name, email, primary_love_language, secondary_love_language,
             communication_style, date_preferences, budget_range, interests
      FROM users WHERE id = $1
    `, [userId])

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    return c.json({
      userId: user.id,
      name: user.name,
      email: user.email,
      preferences: {
        primaryLoveLanguage: user.primary_love_language,
        secondaryLoveLanguage: user.secondary_love_language,
        communicationStyle: user.communication_style,
        datePreferences: user.date_preferences ? JSON.parse(user.date_preferences) : null,
        budgetRange: user.budget_range,
        interests: user.interests ? JSON.parse(user.interests) : []
      }
    })
  } catch (error) {
    console.error('Get preferences error:', error)
    return c.json({ error: 'Failed to get preferences' }, 500)
  }
})

// PUT /api/users/:userId/preferences
usersApi.put('/:userId/preferences', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.req.param('userId')
    const body = await c.req.json()

    const { communicationStyle, datePreferences, budgetRange, interests } = body

    await db.run(`
      UPDATE users SET
        communication_style = COALESCE($1, communication_style),
        date_preferences = COALESCE($2, date_preferences),
        budget_range = COALESCE($3, budget_range),
        interests = COALESCE($4, interests),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
    `, [
      communicationStyle,
      datePreferences ? JSON.stringify(datePreferences) : null,
      budgetRange,
      interests ? JSON.stringify(interests) : null,
      userId
    ])

    return c.json({ success: true, message: 'Preferences updated' })
  } catch (error) {
    console.error('Update preferences error:', error)
    return c.json({ error: 'Failed to update preferences' }, 500)
  }
})

// GET /api/users/:userId/love-languages
usersApi.get('/:userId/love-languages', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.req.param('userId')

    const user = await db.first<{
      primary_love_language: string | null
      secondary_love_language: string | null
    }>(`
      SELECT primary_love_language, secondary_love_language FROM users WHERE id = $1
    `, [userId])

    if (!user) {
      return c.json({ error: 'User not found' }, 404)
    }

    const loveLanguages = [
      { id: 'words_of_affirmation', name: 'Words of Affirmation', description: 'Verbal compliments and expressions of appreciation' },
      { id: 'quality_time', name: 'Quality Time', description: 'Undivided attention and meaningful time together' },
      { id: 'receiving_gifts', name: 'Receiving Gifts', description: 'Thoughtful presents and symbols of love' },
      { id: 'acts_of_service', name: 'Acts of Service', description: 'Helpful actions that ease responsibilities' },
      { id: 'physical_touch', name: 'Physical Touch', description: 'Physical expressions of love and affection' }
    ]

    return c.json({
      primary: user.primary_love_language,
      secondary: user.secondary_love_language,
      availableLanguages: loveLanguages
    })
  } catch (error) {
    console.error('Get love languages error:', error)
    return c.json({ error: 'Failed to get love languages' }, 500)
  }
})

// PUT /api/users/:userId/love-languages
usersApi.put('/:userId/love-languages', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.req.param('userId')
    const { primary, secondary } = await c.req.json()

    const validLanguages = ['words_of_affirmation', 'quality_time', 'receiving_gifts', 'acts_of_service', 'physical_touch']

    if (primary && !validLanguages.includes(primary)) {
      return c.json({ error: 'Invalid primary love language' }, 400)
    }
    if (secondary && !validLanguages.includes(secondary)) {
      return c.json({ error: 'Invalid secondary love language' }, 400)
    }

    await db.run(`
      UPDATE users SET
        primary_love_language = COALESCE($1, primary_love_language),
        secondary_love_language = COALESCE($2, secondary_love_language),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [primary, secondary, userId])

    return c.json({ success: true, message: 'Love languages updated' })
  } catch (error) {
    console.error('Update love languages error:', error)
    return c.json({ error: 'Failed to update love languages' }, 500)
  }
})

// GET /api/users/:userId/notification-settings
usersApi.get('/:userId/notification-settings', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.req.param('userId')

    const settings = await db.first<{ notification_settings: string | null }>(`
      SELECT notification_settings FROM users WHERE id = $1
    `, [userId])

    if (!settings) {
      return c.json({ error: 'User not found' }, 404)
    }

    const parsed = settings.notification_settings ? JSON.parse(settings.notification_settings) : {
      email: { dailyCheckins: true, weeklyDigest: true, milestoneReminders: true, partnerActivity: true, promotions: false },
      push: { dailyCheckins: true, partnerMessages: true, challenges: true, achievements: true },
      sms: { urgentReminders: false, anniversaryAlerts: true }
    }

    return c.json(parsed)
  } catch (error) {
    console.error('Get notification settings error:', error)
    return c.json({ error: 'Failed to get notification settings' }, 500)
  }
})

// PUT /api/users/:userId/notification-settings
usersApi.put('/:userId/notification-settings', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.req.param('userId')
    const settings = await c.req.json()

    await db.run(`
      UPDATE users SET
        notification_settings = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
    `, [JSON.stringify(settings), userId])

    return c.json({ success: true, message: 'Notification settings updated' })
  } catch (error) {
    console.error('Update notification settings error:', error)
    return c.json({ error: 'Failed to update notification settings' }, 500)
  }
})

export default usersApi
