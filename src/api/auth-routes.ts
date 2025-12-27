// Better Together: Authentication Route Handlers
// Handles login, register, forgot-password, and token refresh

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import { generateId, getCurrentDateTime, isValidEmail } from '../utils'
import {
  generateAccessToken,
  generateRefreshToken,
  generateResetToken,
  verifyToken,
  hashPassword,
  verifyPassword,
  setAuthCookies,
  clearAuthCookies,
  extractToken,
  checkRateLimit,
  resetRateLimit,
  validatePasswordStrength
} from './auth'

const authRoutes = new Hono()

// POST /api/auth/register
authRoutes.post('/register', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const { email, password, name, nickname, timezone } = await c.req.json()

    // Validate required fields
    if (!email || !password || !name) {
      return c.json({ error: 'Email, password, and name are required' }, 400)
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return c.json({ error: 'Invalid email format' }, 400)
    }

    // Check rate limiting
    if (checkRateLimit(email, 5, 15)) {
      return c.json({ error: 'Too many registration attempts. Please try again later.' }, 429)
    }

    // Validate password strength
    const passwordCheck = validatePasswordStrength(password)
    if (!passwordCheck.valid) {
      return c.json({ error: passwordCheck.message }, 400)
    }

    // Check if user already exists
    const existingUser = await db.first<{ id: string }>(
      'SELECT id FROM users WHERE email = $1',
      [email.toLowerCase()]
    )

    if (existingUser) {
      return c.json({ error: 'An account with this email already exists' }, 409)
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password)
    const userId = generateId()
    const now = getCurrentDateTime()

    await db.run(`
      INSERT INTO users (id, email, name, nickname, password_hash, timezone, created_at, updated_at, last_active_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    `, [
      userId,
      email.toLowerCase(),
      name,
      nickname || null,
      hashedPassword,
      timezone || 'UTC',
      now,
      now,
      now
    ])

    // Generate tokens
    const accessToken = await generateAccessToken(userId, email, c.env)
    const refreshToken = await generateRefreshToken(userId, email, c.env)

    // Set auth cookies
    setAuthCookies(c, accessToken, refreshToken)

    // Reset rate limit on success
    resetRateLimit(email)

    return c.json({
      success: true,
      message: 'Account created successfully',
      user: {
        id: userId,
        email: email.toLowerCase(),
        name
      },
      accessToken,
      refreshToken
    }, 201)
  } catch (error) {
    console.error('Registration error:', error)
    return c.json({ error: 'Failed to create account' }, 500)
  }
})

// POST /api/auth/login
authRoutes.post('/login', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const { email, password } = await c.req.json()

    // Validate required fields
    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    // Check rate limiting
    if (checkRateLimit(email, 5, 15)) {
      return c.json({ error: 'Too many login attempts. Please try again later.' }, 429)
    }

    // Find user
    const user = await db.first<{
      id: string
      email: string
      name: string
      password_hash: string
      profile_photo_url: string | null
    }>(
      'SELECT id, email, name, password_hash, profile_photo_url FROM users WHERE email = $1',
      [email.toLowerCase()]
    )

    if (!user) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    // Verify password
    const validPassword = await verifyPassword(password, user.password_hash)
    if (!validPassword) {
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    // Update last active timestamp
    await db.run(
      'UPDATE users SET last_active_at = $1 WHERE id = $2',
      [getCurrentDateTime(), user.id]
    )

    // Generate tokens
    const accessToken = await generateAccessToken(user.id, user.email, c.env)
    const refreshToken = await generateRefreshToken(user.id, user.email, c.env)

    // Set auth cookies
    setAuthCookies(c, accessToken, refreshToken)

    // Reset rate limit on success
    resetRateLimit(email)

    return c.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        profilePhotoUrl: user.profile_photo_url
      },
      accessToken,
      refreshToken
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Failed to login' }, 500)
  }
})

// POST /api/auth/logout
authRoutes.post('/logout', async (c: Context) => {
  clearAuthCookies(c)
  return c.json({ success: true, message: 'Logged out successfully' })
})

// POST /api/auth/forgot-password
authRoutes.post('/forgot-password', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const { email } = await c.req.json()

    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }

    // Check rate limiting
    if (checkRateLimit(`reset:${email}`, 3, 60)) {
      return c.json({ error: 'Too many reset requests. Please try again later.' }, 429)
    }

    // Find user
    const user = await db.first<{ id: string; email: string; name: string }>(
      'SELECT id, email, name FROM users WHERE email = $1',
      [email.toLowerCase()]
    )

    // Always return success to prevent email enumeration
    if (!user) {
      return c.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      })
    }

    // Generate reset token
    const resetToken = await generateResetToken(user.id, user.email, c.env)

    // Store reset token in database
    const resetId = generateId()
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString() // 1 hour

    await db.run(`
      INSERT INTO password_resets (id, user_id, token_hash, expires_at, created_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (user_id) DO UPDATE SET
        token_hash = EXCLUDED.token_hash,
        expires_at = EXCLUDED.expires_at,
        created_at = EXCLUDED.created_at,
        used_at = NULL
    `, [resetId, user.id, await hashPassword(resetToken), expiresAt, getCurrentDateTime()])

    // In production, send email with reset link
    // For now, we'll return the token in development
    const resetUrl = `${c.req.url.split('/api')[0]}/password-reset?token=${resetToken}`

    // TODO: Integrate with email API
    // await emailApi.sendPasswordReset(user.email, user.name, resetUrl)

    console.log(`Password reset link for ${user.email}: ${resetUrl}`)

    return c.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
      // Only include in development
      ...(c.env?.ENVIRONMENT === 'development' ? { resetUrl } : {})
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return c.json({ error: 'Failed to process password reset request' }, 500)
  }
})

// POST /api/auth/reset-password
authRoutes.post('/reset-password', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const { token, newPassword } = await c.req.json()

    if (!token || !newPassword) {
      return c.json({ error: 'Token and new password are required' }, 400)
    }

    // Validate new password strength
    const passwordCheck = validatePasswordStrength(newPassword)
    if (!passwordCheck.valid) {
      return c.json({ error: passwordCheck.message }, 400)
    }

    // Verify reset token
    const payload = await verifyToken(token, c.env, 'reset')
    if (!payload) {
      return c.json({ error: 'Invalid or expired reset token' }, 400)
    }

    // Check if token exists in database and hasn't been used
    const resetRecord = await db.first<{ id: string; user_id: string; used_at: string | null }>(
      'SELECT id, user_id, used_at FROM password_resets WHERE user_id = $1 AND expires_at > $2',
      [payload.userId, getCurrentDateTime()]
    )

    if (!resetRecord || resetRecord.used_at) {
      return c.json({ error: 'Invalid or expired reset token' }, 400)
    }

    // Hash new password and update user
    const hashedPassword = await hashPassword(newPassword)

    await db.run(
      'UPDATE users SET password_hash = $1, updated_at = $2 WHERE id = $3',
      [hashedPassword, getCurrentDateTime(), payload.userId]
    )

    // Mark token as used
    await db.run(
      'UPDATE password_resets SET used_at = $1 WHERE id = $2',
      [getCurrentDateTime(), resetRecord.id]
    )

    return c.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return c.json({ error: 'Failed to reset password' }, 500)
  }
})

// POST /api/auth/refresh
authRoutes.post('/refresh', async (c: Context) => {
  try {
    const refreshToken = extractToken(c, 'refresh')

    if (!refreshToken) {
      return c.json({ error: 'Refresh token is required' }, 401)
    }

    // Verify refresh token
    const payload = await verifyToken(refreshToken, c.env, 'refresh')
    if (!payload) {
      clearAuthCookies(c)
      return c.json({ error: 'Invalid or expired refresh token' }, 401)
    }

    // Generate new access token
    const newAccessToken = await generateAccessToken(payload.userId, payload.email, c.env)
    const newRefreshToken = await generateRefreshToken(payload.userId, payload.email, c.env)

    // Set new cookies
    setAuthCookies(c, newAccessToken, newRefreshToken)

    return c.json({
      success: true,
      accessToken: newAccessToken,
      refreshToken: newRefreshToken
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return c.json({ error: 'Failed to refresh token' }, 500)
  }
})

// GET /api/auth/me
authRoutes.get('/me', async (c: Context) => {
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

export default authRoutes
