/**
 * Supabase Authentication Routes
 *
 * Handles authentication using Supabase Auth.
 * Replaces the custom JWT-based auth with Supabase's built-in auth.
 */

import { Hono } from 'hono'
import type { Context } from 'hono'
import {
  createServerClient,
  createAdminClient,
  setSupabaseAuthCookies,
  clearSupabaseAuthCookies,
  type SupabaseEnv
} from '../lib/supabase'

const supabaseAuth = new Hono()

// Helper to get Supabase env from Hono context
function getSupabaseEnv(c: Context): SupabaseEnv {
  return {
    SUPABASE_URL: c.env?.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: c.env?.SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: c.env?.SUPABASE_SERVICE_ROLE_KEY
  }
}

/**
 * POST /api/auth/supabase/signup
 * Register a new user with Supabase Auth
 */
supabaseAuth.post('/signup', async (c: Context) => {
  try {
    const { email, password, name, phone, metadata } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    if (!name) {
      return c.json({ error: 'Name is required' }, 400)
    }

    const env = getSupabaseEnv(c)
    const supabase = createServerClient(env)

    // Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      phone: phone || undefined,
      options: {
        data: {
          name,
          full_name: name,
          ...metadata
        },
        emailRedirectTo: `${c.req.url.split('/api')[0]}/auth/callback`
      }
    })

    if (error) {
      console.error('Supabase signup error:', error)
      return c.json({ error: error.message }, 400)
    }

    if (!data.user) {
      return c.json({ error: 'Failed to create user' }, 500)
    }

    // If email confirmation is disabled, we'll have a session
    if (data.session) {
      setSupabaseAuthCookies(
        c,
        data.session.access_token,
        data.session.refresh_token,
        data.session.expires_in
      )

      return c.json({
        success: true,
        message: 'Account created successfully',
        user: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.name || name
        },
        session: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresIn: data.session.expires_in
        }
      }, 201)
    }

    // Email confirmation required
    return c.json({
      success: true,
      message: 'Please check your email to confirm your account',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || name
      },
      confirmationRequired: true
    }, 201)
  } catch (error) {
    console.error('Signup error:', error)
    return c.json({ error: 'Failed to create account' }, 500)
  }
})

/**
 * POST /api/auth/supabase/login
 * Login with email and password
 */
supabaseAuth.post('/login', async (c: Context) => {
  try {
    const { email, password } = await c.req.json()

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400)
    }

    const env = getSupabaseEnv(c)
    const supabase = createServerClient(env)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      console.error('Supabase login error:', error)
      return c.json({ error: 'Invalid email or password' }, 401)
    }

    if (!data.session) {
      return c.json({ error: 'Login failed' }, 401)
    }

    // Set auth cookies
    setSupabaseAuthCookies(
      c,
      data.session.access_token,
      data.session.refresh_token,
      data.session.expires_in
    )

    return c.json({
      success: true,
      message: 'Login successful',
      user: {
        id: data.user.id,
        email: data.user.email,
        name: data.user.user_metadata?.name || data.user.user_metadata?.full_name,
        profilePhotoUrl: data.user.user_metadata?.avatar_url
      },
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in
      },
      // Mobile compatibility
      token: data.session.access_token
    })
  } catch (error) {
    console.error('Login error:', error)
    return c.json({ error: 'Failed to login' }, 500)
  }
})

/**
 * POST /api/auth/supabase/logout
 * Sign out the current user
 */
supabaseAuth.post('/logout', async (c: Context) => {
  try {
    const env = getSupabaseEnv(c)
    const supabase = createServerClient(env)

    await supabase.auth.signOut()
    clearSupabaseAuthCookies(c)

    return c.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('Logout error:', error)
    // Clear cookies anyway
    clearSupabaseAuthCookies(c)
    return c.json({ success: true, message: 'Logged out' })
  }
})

/**
 * POST /api/auth/supabase/forgot-password
 * Send password reset email
 */
supabaseAuth.post('/forgot-password', async (c: Context) => {
  try {
    const { email } = await c.req.json()

    if (!email) {
      return c.json({ error: 'Email is required' }, 400)
    }

    const env = getSupabaseEnv(c)
    const supabase = createServerClient(env)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${c.req.url.split('/api')[0]}/auth/reset-password`
    })

    // Always return success to prevent email enumeration
    if (error) {
      console.error('Password reset error:', error)
    }

    return c.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return c.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.'
    })
  }
})

/**
 * POST /api/auth/supabase/reset-password
 * Reset password with token
 */
supabaseAuth.post('/reset-password', async (c: Context) => {
  try {
    const { newPassword } = await c.req.json()

    if (!newPassword) {
      return c.json({ error: 'New password is required' }, 400)
    }

    if (newPassword.length < 8) {
      return c.json({ error: 'Password must be at least 8 characters' }, 400)
    }

    const env = getSupabaseEnv(c)
    const supabase = createServerClient(env)

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      console.error('Password update error:', error)
      return c.json({ error: 'Failed to update password' }, 400)
    }

    return c.json({
      success: true,
      message: 'Password has been reset successfully'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return c.json({ error: 'Failed to reset password' }, 500)
  }
})

/**
 * POST /api/auth/supabase/refresh
 * Refresh the access token
 */
supabaseAuth.post('/refresh', async (c: Context) => {
  try {
    const { refreshToken } = await c.req.json()

    const env = getSupabaseEnv(c)
    const supabase = createServerClient(env)

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    })

    if (error || !data.session) {
      clearSupabaseAuthCookies(c)
      return c.json({ error: 'Invalid or expired refresh token' }, 401)
    }

    setSupabaseAuthCookies(
      c,
      data.session.access_token,
      data.session.refresh_token,
      data.session.expires_in
    )

    return c.json({
      success: true,
      session: {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token,
        expiresIn: data.session.expires_in
      }
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return c.json({ error: 'Failed to refresh token' }, 500)
  }
})

/**
 * GET /api/auth/supabase/me
 * Get current user info
 */
supabaseAuth.get('/me', async (c: Context) => {
  try {
    const env = getSupabaseEnv(c)
    const supabase = createServerClient(env)

    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
      return c.json({ error: 'Not authenticated' }, 401)
    }

    // Fetch additional user data from database
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    return c.json({
      user: {
        id: user.id,
        email: user.email,
        emailConfirmed: user.email_confirmed_at !== null,
        phone: user.phone,
        name: user.user_metadata?.name || user.user_metadata?.full_name,
        profilePhotoUrl: user.user_metadata?.avatar_url,
        createdAt: user.created_at,
        lastSignInAt: user.last_sign_in_at,
        // Include profile data if available
        profile: profile || null
      }
    })
  } catch (error) {
    console.error('Get user error:', error)
    return c.json({ error: 'Failed to get user info' }, 500)
  }
})

/**
 * POST /api/auth/supabase/oauth/google
 * Initiate Google OAuth flow
 */
supabaseAuth.post('/oauth/google', async (c: Context) => {
  try {
    const env = getSupabaseEnv(c)
    const supabase = createServerClient(env)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${c.req.url.split('/api')[0]}/auth/callback`
      }
    })

    if (error) {
      console.error('Google OAuth error:', error)
      return c.json({ error: 'Failed to initiate Google login' }, 500)
    }

    return c.json({
      success: true,
      url: data.url
    })
  } catch (error) {
    console.error('Google OAuth error:', error)
    return c.json({ error: 'Failed to initiate Google login' }, 500)
  }
})

/**
 * POST /api/auth/supabase/oauth/facebook
 * Initiate Facebook OAuth flow
 */
supabaseAuth.post('/oauth/facebook', async (c: Context) => {
  try {
    const env = getSupabaseEnv(c)
    const supabase = createServerClient(env)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'facebook',
      options: {
        redirectTo: `${c.req.url.split('/api')[0]}/auth/callback`
      }
    })

    if (error) {
      console.error('Facebook OAuth error:', error)
      return c.json({ error: 'Failed to initiate Facebook login' }, 500)
    }

    return c.json({
      success: true,
      url: data.url
    })
  } catch (error) {
    console.error('Facebook OAuth error:', error)
    return c.json({ error: 'Failed to initiate Facebook login' }, 500)
  }
})

/**
 * POST /api/auth/supabase/update-profile
 * Update user profile
 */
supabaseAuth.post('/update-profile', async (c: Context) => {
  try {
    const { name, phone, avatar_url, metadata } = await c.req.json()

    const env = getSupabaseEnv(c)
    const supabase = createServerClient(env)

    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return c.json({ error: 'Not authenticated' }, 401)
    }

    // Update auth metadata
    const { error: updateError } = await supabase.auth.updateUser({
      phone: phone || undefined,
      data: {
        name,
        full_name: name,
        avatar_url,
        ...metadata
      }
    })

    if (updateError) {
      console.error('Profile update error:', updateError)
      return c.json({ error: 'Failed to update profile' }, 500)
    }

    // Also update the users table
    const { error: dbError } = await supabase
      .from('users')
      .update({
        name,
        photo_url: avatar_url,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (dbError) {
      console.error('Database profile update error:', dbError)
      // Don't fail the request, auth metadata was updated
    }

    return c.json({
      success: true,
      message: 'Profile updated successfully'
    })
  } catch (error) {
    console.error('Update profile error:', error)
    return c.json({ error: 'Failed to update profile' }, 500)
  }
})

export default supabaseAuth
