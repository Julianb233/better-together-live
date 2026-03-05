// Better Together: Auth Validation Schemas
// Matches fields from src/api/supabase-auth.ts

import { z } from 'zod'

/** POST /api/auth/signup */
export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  name: z.string().trim().min(1, 'Name is required').max(200),
  phone: z.string().max(30).optional(),
  metadata: z.record(z.unknown()).optional(),
})

/** POST /api/auth/login */
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required').max(128),
})

/** POST /api/auth/forgot-password */
export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
})

/** POST /api/auth/reset-password */
export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8, 'Password must be at least 8 characters').max(128),
  accessToken: z.string().min(1, 'Access token is required'),
  refreshToken: z.string().min(1, 'Refresh token is required'),
})

/** POST /api/auth/refresh */
export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
})

/** POST /api/auth/update-profile */
export const updateProfileSchema = z.object({
  name: z.string().trim().max(200).optional(),
  phone: z.string().max(30).optional(),
  avatar_url: z.string().url().optional().nullable(),
  metadata: z.record(z.unknown()).optional(),
})
