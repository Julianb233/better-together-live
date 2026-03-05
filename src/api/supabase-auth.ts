/**
 * Supabase Authentication Routes
 *
 * Handles authentication using Supabase Auth.
 * Replaces the custom JWT-based auth with Supabase's built-in auth.
 */

import { Hono } from 'hono'
import type { Context } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { zodErrorHandler } from '../lib/validation'
import {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  updateProfileSchema,
} from '../lib/validation/schemas/auth'
import {
  createAnonClient,
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
 * POST /api/auth/signup
 * Register a new user with Supabase Auth
 */
supabaseAuth.post('/signup', zValidator('json', signupSchema, zodErrorHandler), async (c: Context) => {
  try {
    const { email, password, name, phone, metadata } = c.req.valid('json' as never)

    const env = getSupabaseEnv(c)
    const supabase = createAnonClient(env)

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
 * POST /api/auth/login
 * Login with email and password
 */
supabaseAuth.post('/login', zValidator('json', loginSchema, zodErrorHandler), async (c: Context) => {
  try {
    const { email, password } = c.req.valid('json' as never)

    const env = getSupabaseEnv(c)
    const supabase = createAnonClient(env)

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
 * POST /api/auth/logout
 * Sign out the current user
 */
supabaseAuth.post('/logout', async (c: Context) => {
  try {
    const env = getSupabaseEnv(c)
    const supabase = createAnonClient(env)

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
 * POST /api/auth/forgot-password
 * Send password reset email
 */
supabaseAuth.post('/forgot-password', zValidator('json', forgotPasswordSchema, zodErrorHandler), async (c: Context) => {
  try {
    const { email } = c.req.valid('json' as never)

    const env = getSupabaseEnv(c)
    const supabase = createAnonClient(env)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${c.req.url.split('/api')[0]}/api/auth/callback`
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
 * GET /api/auth/callback
 * Handle redirect from Supabase password reset / email verification links.
 *
 * Supabase emails contain a link with a PKCE `code` query param.
 * We exchange the code for a session, then redirect:
 *   - recovery type  -> /auth/reset-password page with tokens as query params
 *   - signup/other   -> /login?verified=true
 *   - error          -> /login?error=invalid_link
 */
supabaseAuth.get('/callback', async (c: Context) => {
  try {
    const code = c.req.query('code')

    if (!code) {
      return c.redirect('/login?error=invalid_link')
    }

    const env = getSupabaseEnv(c)
    const supabase = createAnonClient(env)

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data.session) {
      console.error('Code exchange error:', error)
      return c.redirect('/login?error=invalid_link')
    }

    // Check if this is a recovery (password reset) flow
    if (data.session.user?.recovery_sent_at || data.user?.recovery_sent_at) {
      // Redirect to the reset password page with tokens so the page can call updateUser
      const params = new URLSearchParams({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token
      })
      return c.redirect(`/auth/reset-password?${params.toString()}`)
    }

    // For email verification / signup confirmation
    setSupabaseAuthCookies(
      c,
      data.session.access_token,
      data.session.refresh_token,
      data.session.expires_in ?? 3600
    )

    return c.redirect('/login?verified=true')
  } catch (error) {
    console.error('Auth callback error:', error)
    return c.redirect('/login?error=invalid_link')
  }
})

/**
 * POST /api/auth/reset-password
 * Reset password with recovery session tokens
 *
 * The frontend passes accessToken and refreshToken obtained from the
 * /callback route (which exchanged the PKCE code). We establish the
 * recovery session first, then update the password.
 */
supabaseAuth.post('/reset-password', zValidator('json', resetPasswordSchema, zodErrorHandler), async (c: Context) => {
  try {
    const { newPassword, accessToken, refreshToken } = c.req.valid('json' as never)

    const env = getSupabaseEnv(c)
    const supabase = createAnonClient(env)

    // Establish the recovery session from the tokens
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken
    })

    if (sessionError) {
      console.error('Session restoration error:', sessionError)
      return c.json({ error: 'Invalid or expired reset link. Please request a new one.' }, 400)
    }

    // Now update the password with the active session
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      console.error('Password update error:', error)
      return c.json({ error: 'Failed to update password' }, 400)
    }

    // Set auth cookies so user stays logged in after reset
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      setSupabaseAuthCookies(
        c,
        session.access_token,
        session.refresh_token,
        session.expires_in ?? 3600
      )
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
 * POST /api/auth/refresh
 * Refresh the access token
 */
supabaseAuth.post('/refresh', zValidator('json', refreshTokenSchema, zodErrorHandler), async (c: Context) => {
  try {
    const { refreshToken } = c.req.valid('json' as never)

    const env = getSupabaseEnv(c)
    const supabase = createAnonClient(env)

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
 * GET /api/auth/me
 * Get current user info
 */
supabaseAuth.get('/me', async (c: Context) => {
  try {
    const env = getSupabaseEnv(c)
    const supabase = createAnonClient(env)

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
 * POST /api/auth/oauth/google
 * Initiate Google OAuth flow
 */
supabaseAuth.post('/oauth/google', async (c: Context) => {
  try {
    const env = getSupabaseEnv(c)
    const supabase = createAnonClient(env)

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
 * POST /api/auth/oauth/facebook
 * Initiate Facebook OAuth flow
 */
supabaseAuth.post('/oauth/facebook', async (c: Context) => {
  try {
    const env = getSupabaseEnv(c)
    const supabase = createAnonClient(env)

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
 * POST /api/auth/update-profile
 * Update user profile
 */
supabaseAuth.post('/update-profile', zValidator('json', updateProfileSchema, zodErrorHandler), async (c: Context) => {
  try {
    const { name, phone, avatar_url, metadata } = c.req.valid('json' as never)

    const env = getSupabaseEnv(c)
    const supabase = createAnonClient(env)

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
