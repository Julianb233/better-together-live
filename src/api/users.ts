// Better Together: User Preferences API
// Handles user settings, love languages, and notification preferences

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { checkOwnership, forbiddenResponse } from '../lib/security'
import { zValidator, zodErrorHandler } from '../lib/validation'
import { updatePreferencesSchema, updateLoveLanguagesSchema, updateNotificationSettingsSchema } from '../lib/validation/schemas/users'

const usersApi = new Hono()

// GET /api/users/me - Get current user (mobile compatibility alias for /api/auth/me)
usersApi.get('/me', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const userId = c.get('userId')

    if (!userId) {
      return c.json({ error: 'Not authenticated' }, 401)
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, name, nickname, profile_photo_url, timezone, primary_love_language, secondary_love_language')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error

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
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const userId = c.req.param('userId')

    if (!checkOwnership(c, userId)) {
      return forbiddenResponse(c)
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('id, name, email, primary_love_language, secondary_love_language, communication_style, date_preferences, budget_range, interests')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error

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
usersApi.put('/:userId/preferences',
  zValidator('json', updatePreferencesSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const userId = c.req.param('userId')

      if (!checkOwnership(c, userId)) {
        return forbiddenResponse(c)
      }

      const { communicationStyle, datePreferences, budgetRange, interests } = c.req.valid('json' as never)

      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (communicationStyle !== undefined) updateData.communication_style = communicationStyle
      if (datePreferences !== undefined) updateData.date_preferences = JSON.stringify(datePreferences)
      if (budgetRange !== undefined) updateData.budget_range = budgetRange
      if (interests !== undefined) updateData.interests = JSON.stringify(interests)

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)

      if (error) throw error

      return c.json({ success: true, message: 'Preferences updated' })
    } catch (error) {
      console.error('Update preferences error:', error)
      return c.json({ error: 'Failed to update preferences' }, 500)
    }
  }
)

// GET /api/users/:userId/love-languages
usersApi.get('/:userId/love-languages', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const userId = c.req.param('userId')

    if (!checkOwnership(c, userId)) {
      return forbiddenResponse(c)
    }

    const { data: user, error } = await supabase
      .from('users')
      .select('primary_love_language, secondary_love_language')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error

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
usersApi.put('/:userId/love-languages',
  zValidator('json', updateLoveLanguagesSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const userId = c.req.param('userId')

      if (!checkOwnership(c, userId)) {
        return forbiddenResponse(c)
      }

      const { primary, secondary } = c.req.valid('json' as never)

      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() }
      if (primary !== undefined) updateData.primary_love_language = primary
      if (secondary !== undefined) updateData.secondary_love_language = secondary

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', userId)

      if (error) throw error

      return c.json({ success: true, message: 'Love languages updated' })
    } catch (error) {
      console.error('Update love languages error:', error)
      return c.json({ error: 'Failed to update love languages' }, 500)
    }
  }
)

// GET /api/users/:userId/notification-settings
usersApi.get('/:userId/notification-settings', async (c: Context) => {
  try {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const userId = c.req.param('userId')

    if (!checkOwnership(c, userId)) {
      return forbiddenResponse(c)
    }

    const { data: settings, error } = await supabase
      .from('users')
      .select('notification_settings')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error

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
usersApi.put('/:userId/notification-settings',
  zValidator('json', updateNotificationSettingsSchema, zodErrorHandler),
  async (c: Context) => {
    try {
      const supabase = createAdminClient(c.env as SupabaseEnv)
      const userId = c.req.param('userId')

      if (!checkOwnership(c, userId)) {
        return forbiddenResponse(c)
      }

      const settings = c.req.valid('json' as never)

      const { error } = await supabase
        .from('users')
        .update({
          notification_settings: JSON.stringify(settings),
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (error) throw error

      return c.json({ success: true, message: 'Notification settings updated' })
    } catch (error) {
      console.error('Update notification settings error:', error)
      return c.json({ error: 'Failed to update notification settings' }, 500)
    }
  }
)

export default usersApi
