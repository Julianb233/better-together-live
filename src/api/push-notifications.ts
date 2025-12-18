// Better Together: Push Notification Service
// Handles push notifications via FCM (Firebase Cloud Messaging) and APNs (Apple Push Notification service)

import { Hono } from 'hono'
import type { Context } from 'hono'

const pushApi = new Hono()

// FCM API endpoint
const FCM_API = 'https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send'

// APNs configuration
const APNS_PRODUCTION = 'https://api.push.apple.com'
const APNS_DEVELOPMENT = 'https://api.sandbox.push.apple.com'

interface DeviceToken {
  id: string
  user_id: string
  device_token: string
  platform: 'ios' | 'android'
  created_at: string
}

interface PushNotificationPayload {
  title: string
  body: string
  data?: Record<string, any>
  imageUrl?: string
  badge?: number
  sound?: string
}

interface SendPushRequest {
  user_id: string
  notification_type: 'partner_checkin_reminder' | 'partner_activity' | 'milestone_achieved' | 'daily_prompt' | 'gift_received'
  payload: PushNotificationPayload
}

interface BroadcastPushRequest {
  notification_type: string
  payload: PushNotificationPayload
  admin_key?: string
}

// Validate FCM token format (base64url pattern)
function isValidFCMToken(token: string): boolean {
  // FCM tokens are typically 152+ characters, base64url encoded
  return /^[A-Za-z0-9_-]{100,}$/.test(token)
}

// Validate APNs device token format (hex string)
function isValidAPNsToken(token: string): boolean {
  // APNs tokens are 64 hex characters
  return /^[0-9a-fA-F]{64}$/.test(token)
}

// Send push notification via FCM (Android)
async function sendFCMNotification(
  deviceToken: string,
  payload: PushNotificationPayload,
  serverKey: string,
  projectId: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const fcmPayload = {
      message: {
        token: deviceToken,
        notification: {
          title: payload.title,
          body: payload.body,
          ...(payload.imageUrl && { image: payload.imageUrl })
        },
        data: payload.data || {},
        android: {
          priority: 'high',
          notification: {
            sound: payload.sound || 'default',
            ...(payload.badge !== undefined && { notification_count: payload.badge })
          }
        }
      }
    }

    const url = FCM_API.replace('{PROJECT_ID}', projectId)
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serverKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(fcmPayload)
    })

    const data = await response.json() as any

    if (response.ok) {
      return { success: true, messageId: data.name }
    } else {
      return { success: false, error: data.error?.message || 'FCM error' }
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// Send push notification via APNs (iOS)
async function sendAPNsNotification(
  deviceToken: string,
  payload: PushNotificationPayload,
  apnsConfig: { teamId: string; keyId: string; privateKey: string; bundleId: string; production: boolean }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // APNs requires JWT authentication
    const jwt = await generateAPNsJWT(apnsConfig)

    const apnsPayload = {
      aps: {
        alert: {
          title: payload.title,
          body: payload.body
        },
        sound: payload.sound || 'default',
        ...(payload.badge !== undefined && { badge: payload.badge }),
        'mutable-content': 1
      },
      ...(payload.data && { data: payload.data }),
      ...(payload.imageUrl && { imageUrl: payload.imageUrl })
    }

    const url = `${apnsConfig.production ? APNS_PRODUCTION : APNS_DEVELOPMENT}/3/device/${deviceToken}`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'authorization': `bearer ${jwt}`,
        'apns-topic': apnsConfig.bundleId,
        'apns-priority': '10',
        'apns-push-type': 'alert'
      },
      body: JSON.stringify(apnsPayload)
    })

    if (response.ok) {
      const apnsId = response.headers.get('apns-id')
      return { success: true, messageId: apnsId || undefined }
    } else {
      const errorData = await response.json() as any
      return { success: false, error: errorData.reason || 'APNs error' }
    }
  } catch (error) {
    return { success: false, error: String(error) }
  }
}

// Generate JWT for APNs authentication
async function generateAPNsJWT(config: { teamId: string; keyId: string; privateKey: string }): Promise<string> {
  // In production, use a proper JWT library with crypto
  // This is a simplified version - you'll need to implement proper ES256 JWT signing
  const header = {
    alg: 'ES256',
    kid: config.keyId
  }

  const payload = {
    iss: config.teamId,
    iat: Math.floor(Date.now() / 1000)
  }

  // Note: This needs proper implementation with crypto.subtle or a JWT library
  // For now, returning a placeholder. In production, use proper ES256 signing with the private key
  return 'JWT_TOKEN_PLACEHOLDER'
}

// Get device tokens for a user
async function getUserDeviceTokens(env: any, userId: string): Promise<DeviceToken[]> {
  try {
    const result = await env.DB.prepare(`
      SELECT id, user_id, device_token, platform, created_at
      FROM device_tokens
      WHERE user_id = ?
      ORDER BY created_at DESC
    `).bind(userId).all()

    return result.results as DeviceToken[]
  } catch (error) {
    console.error('Error fetching device tokens:', error)
    return []
  }
}

// Get all device tokens (for broadcast)
async function getAllDeviceTokens(env: any): Promise<DeviceToken[]> {
  try {
    const result = await env.DB.prepare(`
      SELECT id, user_id, device_token, platform, created_at
      FROM device_tokens
      ORDER BY created_at DESC
    `).all()

    return result.results as DeviceToken[]
  } catch (error) {
    console.error('Error fetching all device tokens:', error)
    return []
  }
}

// Notification templates
const templates = {
  partner_checkin_reminder: (partnerName: string) => ({
    title: 'Time for your daily check-in!',
    body: `${partnerName} is waiting to connect with you today.`,
    data: { type: 'partner_checkin_reminder', action: 'open_checkin' },
    sound: 'gentle_reminder.wav'
  }),

  partner_activity: (partnerName: string, activity: string) => ({
    title: `${partnerName} just checked in!`,
    body: `They shared: "${activity}"`,
    data: { type: 'partner_activity', action: 'view_checkin' },
    sound: 'default'
  }),

  milestone_achieved: (milestone: string, emoji: string = '🎉') => ({
    title: `${emoji} Milestone Achieved!`,
    body: `You've reached: ${milestone}`,
    data: { type: 'milestone_achieved', action: 'view_achievements' },
    sound: 'celebration.wav',
    badge: 1
  }),

  daily_prompt: (prompt: string) => ({
    title: 'Your Daily Relationship Prompt',
    body: prompt,
    data: { type: 'daily_prompt', action: 'view_prompt' },
    sound: 'soft_chime.wav'
  }),

  gift_received: (senderName: string, giftType: string) => ({
    title: '🎁 You received a gift!',
    body: `${senderName} sent you a ${giftType}`,
    data: { type: 'gift_received', action: 'view_gifts' },
    sound: 'gift_notification.wav',
    badge: 1
  }),

  anniversary_reminder: (milestone: string, daysUntil: number) => ({
    title: `${milestone} is coming up!`,
    body: daysUntil === 0
      ? `Today is your ${milestone}! 💕`
      : daysUntil === 1
        ? `Tomorrow is your ${milestone}! 💕`
        : `Your ${milestone} is in ${daysUntil} days!`,
    data: { type: 'anniversary_reminder', action: 'view_calendar' },
    sound: 'special_occasion.wav'
  }),

  goal_completed: (goalName: string) => ({
    title: '🎯 Goal Completed!',
    body: `You completed: ${goalName}`,
    data: { type: 'goal_completed', action: 'view_goals' },
    sound: 'achievement.wav',
    badge: 1
  })
}

// POST /api/push/register - Register a device token
pushApi.post('/register', async (c: Context) => {
  try {
    const { user_id, device_token, platform } = await c.req.json()

    if (!user_id || !device_token || !platform) {
      return c.json({ error: 'user_id, device_token, and platform are required' }, 400)
    }

    if (!['ios', 'android'].includes(platform)) {
      return c.json({ error: 'platform must be "ios" or "android"' }, 400)
    }

    // Validate token format
    if (platform === 'android' && !isValidFCMToken(device_token)) {
      return c.json({ error: 'Invalid FCM token format' }, 400)
    }

    if (platform === 'ios' && !isValidAPNsToken(device_token)) {
      return c.json({ error: 'Invalid APNs token format' }, 400)
    }

    // Check if token already exists
    const existing = await (c.env as any).DB.prepare(`
      SELECT id FROM device_tokens WHERE device_token = ?
    `).bind(device_token).first()

    if (existing) {
      // Update the user_id if it changed (user logged in on different account)
      await (c.env as any).DB.prepare(`
        UPDATE device_tokens SET user_id = ? WHERE device_token = ?
      `).bind(user_id, device_token).run()

      return c.json({ message: 'Device token updated', token_id: existing.id })
    }

    // Generate token ID
    const tokenId = `dt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()

    await (c.env as any).DB.prepare(`
      INSERT INTO device_tokens (id, user_id, device_token, platform, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(tokenId, user_id, device_token, platform, now).run()

    return c.json({
      message: 'Device token registered successfully',
      token_id: tokenId,
      platform
    }, 201)

  } catch (error) {
    console.error('Register device token error:', error)
    return c.json({ error: 'Failed to register device token' }, 500)
  }
})

// POST /api/push/send - Send push notification to specific user
pushApi.post('/send', async (c: Context) => {
  try {
    const { user_id, notification_type, payload, custom_payload } = await c.req.json() as {
      user_id: string
      notification_type?: keyof typeof templates
      payload?: any
      custom_payload?: PushNotificationPayload
    }

    if (!user_id) {
      return c.json({ error: 'user_id is required' }, 400)
    }

    // Get FCM and APNs configuration from environment
    const fcmServerKey = (c.env as any)?.FCM_SERVER_KEY
    const fcmProjectId = (c.env as any)?.FCM_PROJECT_ID
    const apnsTeamId = (c.env as any)?.APNS_TEAM_ID
    const apnsKeyId = (c.env as any)?.APNS_KEY_ID
    const apnsPrivateKey = (c.env as any)?.APNS_PRIVATE_KEY
    const apnsBundleId = (c.env as any)?.APNS_BUNDLE_ID
    const apnsProduction = (c.env as any)?.APNS_PRODUCTION === 'true'

    // Get user's device tokens
    const deviceTokens = await getUserDeviceTokens(c.env, user_id)

    if (deviceTokens.length === 0) {
      return c.json({
        message: 'No device tokens registered for this user',
        sent: 0
      })
    }

    // Prepare notification payload
    let notificationPayload: PushNotificationPayload

    if (custom_payload) {
      notificationPayload = custom_payload
    } else if (notification_type && templates[notification_type]) {
      // Use template with provided payload data
      notificationPayload = (templates[notification_type] as any)(...(payload || []))
    } else {
      return c.json({ error: 'Either notification_type or custom_payload is required' }, 400)
    }

    // Send to all user's devices
    const results = await Promise.all(
      deviceTokens.map(async (token) => {
        if (token.platform === 'android' && fcmServerKey && fcmProjectId) {
          return await sendFCMNotification(token.device_token, notificationPayload, fcmServerKey, fcmProjectId)
        } else if (token.platform === 'ios' && apnsTeamId && apnsKeyId && apnsPrivateKey && apnsBundleId) {
          return await sendAPNsNotification(
            token.device_token,
            notificationPayload,
            { teamId: apnsTeamId, keyId: apnsKeyId, privateKey: apnsPrivateKey, bundleId: apnsBundleId, production: apnsProduction }
          )
        } else {
          return { success: false, error: 'Push service not configured for this platform' }
        }
      })
    )

    const successful = results.filter(r => r.success).length
    const failed = results.filter(r => !r.success)

    return c.json({
      message: 'Push notifications sent',
      sent: successful,
      failed: failed.length,
      failures: failed.length > 0 ? failed.map(f => f.error) : undefined
    })

  } catch (error) {
    console.error('Send push notification error:', error)
    return c.json({ error: 'Failed to send push notification' }, 500)
  }
})

// POST /api/push/broadcast - Send push to all users (admin only)
pushApi.post('/broadcast', async (c: Context) => {
  try {
    const { notification_type, payload, custom_payload, admin_key } = await c.req.json() as BroadcastPushRequest & {
      custom_payload?: PushNotificationPayload
      payload?: any
    }

    // Verify admin key
    const expectedAdminKey = (c.env as any)?.ADMIN_API_KEY
    if (!expectedAdminKey || admin_key !== expectedAdminKey) {
      return c.json({ error: 'Unauthorized: Invalid admin key' }, 401)
    }

    // Get FCM and APNs configuration
    const fcmServerKey = (c.env as any)?.FCM_SERVER_KEY
    const fcmProjectId = (c.env as any)?.FCM_PROJECT_ID
    const apnsTeamId = (c.env as any)?.APNS_TEAM_ID
    const apnsKeyId = (c.env as any)?.APNS_KEY_ID
    const apnsPrivateKey = (c.env as any)?.APNS_PRIVATE_KEY
    const apnsBundleId = (c.env as any)?.APNS_BUNDLE_ID
    const apnsProduction = (c.env as any)?.APNS_PRODUCTION === 'true'

    // Get all device tokens
    const deviceTokens = await getAllDeviceTokens(c.env)

    if (deviceTokens.length === 0) {
      return c.json({
        message: 'No device tokens registered',
        sent: 0
      })
    }

    // Prepare notification payload
    let notificationPayload: PushNotificationPayload

    if (custom_payload) {
      notificationPayload = custom_payload
    } else if (notification_type && templates[notification_type as keyof typeof templates]) {
      notificationPayload = (templates[notification_type as keyof typeof templates] as any)(...(payload || []))
    } else {
      return c.json({ error: 'Either notification_type or custom_payload is required' }, 400)
    }

    // Send to all devices (batch process to avoid overwhelming the system)
    const batchSize = 100
    let totalSent = 0
    let totalFailed = 0

    for (let i = 0; i < deviceTokens.length; i += batchSize) {
      const batch = deviceTokens.slice(i, i + batchSize)

      const results = await Promise.all(
        batch.map(async (token) => {
          if (token.platform === 'android' && fcmServerKey && fcmProjectId) {
            return await sendFCMNotification(token.device_token, notificationPayload, fcmServerKey, fcmProjectId)
          } else if (token.platform === 'ios' && apnsTeamId && apnsKeyId && apnsPrivateKey && apnsBundleId) {
            return await sendAPNsNotification(
              token.device_token,
              notificationPayload,
              { teamId: apnsTeamId, keyId: apnsKeyId, privateKey: apnsPrivateKey, bundleId: apnsBundleId, production: apnsProduction }
            )
          } else {
            return { success: false, error: 'Push service not configured' }
          }
        })
      )

      totalSent += results.filter(r => r.success).length
      totalFailed += results.filter(r => !r.success).length
    }

    return c.json({
      message: 'Broadcast completed',
      total_devices: deviceTokens.length,
      sent: totalSent,
      failed: totalFailed
    })

  } catch (error) {
    console.error('Broadcast push notification error:', error)
    return c.json({ error: 'Failed to broadcast push notification' }, 500)
  }
})

// DELETE /api/push/unregister - Remove device token
pushApi.delete('/unregister', async (c: Context) => {
  try {
    const { device_token, user_id } = await c.req.json()

    if (!device_token) {
      return c.json({ error: 'device_token is required' }, 400)
    }

    // Build query with optional user_id filter for extra security
    let query = 'DELETE FROM device_tokens WHERE device_token = ?'
    const bindings = [device_token]

    if (user_id) {
      query += ' AND user_id = ?'
      bindings.push(user_id)
    }

    const result = await (c.env as any).DB.prepare(query).bind(...bindings).run()

    if (result.meta.changes === 0) {
      return c.json({ error: 'Device token not found' }, 404)
    }

    return c.json({
      message: 'Device token unregistered successfully',
      deleted: result.meta.changes
    })

  } catch (error) {
    console.error('Unregister device token error:', error)
    return c.json({ error: 'Failed to unregister device token' }, 500)
  }
})

// GET /api/push/tokens/:userId - Get user's registered device tokens (for debugging)
pushApi.get('/tokens/:userId', async (c: Context) => {
  try {
    const userId = c.req.param('userId')
    const tokens = await getUserDeviceTokens(c.env, userId)

    return c.json({
      user_id: userId,
      device_count: tokens.length,
      devices: tokens.map(t => ({
        id: t.id,
        platform: t.platform,
        registered_at: t.created_at,
        // Don't expose full token for security
        token_preview: `${t.device_token.substring(0, 10)}...`
      }))
    })

  } catch (error) {
    console.error('Get device tokens error:', error)
    return c.json({ error: 'Failed to fetch device tokens' }, 500)
  }
})

// Helper: Send template notification (can be called internally)
export async function sendTemplateNotification(
  env: any,
  userId: string,
  notificationType: keyof typeof templates,
  ...templateArgs: any[]
) {
  const deviceTokens = await getUserDeviceTokens(env, userId)
  if (deviceTokens.length === 0) return { sent: 0 }

  const payload = (templates[notificationType] as any)(...templateArgs)

  const fcmServerKey = env?.FCM_SERVER_KEY
  const fcmProjectId = env?.FCM_PROJECT_ID
  const apnsConfig = {
    teamId: env?.APNS_TEAM_ID,
    keyId: env?.APNS_KEY_ID,
    privateKey: env?.APNS_PRIVATE_KEY,
    bundleId: env?.APNS_BUNDLE_ID,
    production: env?.APNS_PRODUCTION === 'true'
  }

  const results = await Promise.all(
    deviceTokens.map(async (token) => {
      if (token.platform === 'android' && fcmServerKey && fcmProjectId) {
        return await sendFCMNotification(token.device_token, payload, fcmServerKey, fcmProjectId)
      } else if (token.platform === 'ios' && apnsConfig.teamId) {
        return await sendAPNsNotification(token.device_token, payload, apnsConfig)
      }
      return { success: false }
    })
  )

  return { sent: results.filter(r => r.success).length }
}

export default pushApi
