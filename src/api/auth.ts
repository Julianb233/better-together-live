// Better Together: Authentication Module
// JWT-based authentication system for Cloudflare Workers
// Uses jose library for edge-compatible JWT operations

import { SignJWT, jwtVerify, type JWTPayload } from 'jose'
import type { Context, Next } from 'hono'

/**
 * JWT Configuration Constants
 */
const JWT_ACCESS_TOKEN_EXPIRY = '15m'
const JWT_REFRESH_TOKEN_EXPIRY = '7d'
const JWT_RESET_TOKEN_EXPIRY = '1h'

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  path: '/'
}

export interface AuthTokenPayload extends JWTPayload {
  userId: string
  email: string
  type: 'access' | 'refresh' | 'reset'
}

function getJwtSecret(env: any): Uint8Array {
  const secret = env?.JWT_SECRET || 'better-together-secret-key-change-in-production'
  return new TextEncoder().encode(secret)
}

export async function generateAccessToken(userId: string, email: string, env: any): Promise<string> {
  const secret = getJwtSecret(env)
  return await new SignJWT({ userId, email, type: 'access' } as AuthTokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_ACCESS_TOKEN_EXPIRY)
    .setIssuer('better-together')
    .setAudience('better-together-api')
    .sign(secret)
}

export async function generateRefreshToken(userId: string, email: string, env: any): Promise<string> {
  const secret = getJwtSecret(env)
  return await new SignJWT({ userId, email, type: 'refresh' } as AuthTokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_REFRESH_TOKEN_EXPIRY)
    .setIssuer('better-together')
    .setAudience('better-together-api')
    .sign(secret)
}

export async function generateResetToken(userId: string, email: string, env: any): Promise<string> {
  const secret = getJwtSecret(env)
  return await new SignJWT({ userId, email, type: 'reset' } as AuthTokenPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_RESET_TOKEN_EXPIRY)
    .setIssuer('better-together')
    .setAudience('better-together-api')
    .sign(secret)
}

export async function verifyToken(token: string, env: any, expectedType?: 'access' | 'refresh' | 'reset'): Promise<AuthTokenPayload | null> {
  try {
    const secret = getJwtSecret(env)
    const { payload } = await jwtVerify(token, secret, {
      issuer: 'better-together',
      audience: 'better-together-api'
    })
    const authPayload = payload as AuthTokenPayload
    if (expectedType && authPayload.type !== expectedType) return null
    return authPayload
  } catch {
    return null
  }
}

export async function hashPassword(password: string): Promise<string> {
  const data = new TextEncoder().encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return (await hashPassword(password)) === hash
}

export function setAuthCookies(c: Context, accessToken: string, refreshToken: string): void {
  const cookieStr = Object.entries(COOKIE_OPTIONS).map(([k, v]) => `${k}=${v}`).join('; ')
  c.header('Set-Cookie', `bt_access_token=${accessToken}; ${cookieStr}; Max-Age=${15 * 60}`)
  c.header('Set-Cookie', `bt_refresh_token=${refreshToken}; ${cookieStr}; Max-Age=${7 * 24 * 60 * 60}`, { append: true })
}

export function clearAuthCookies(c: Context): void {
  const cookieStr = Object.entries(COOKIE_OPTIONS).map(([k, v]) => `${k}=${v}`).join('; ')
  c.header('Set-Cookie', `bt_access_token=; ${cookieStr}; Max-Age=0`)
  c.header('Set-Cookie', `bt_refresh_token=; ${cookieStr}; Max-Age=0`, { append: true })
}

export function extractToken(c: Context, tokenType: 'access' | 'refresh' = 'access'): string | null {
  const authHeader = c.req.header('Authorization')
  if (authHeader?.startsWith('Bearer ')) return authHeader.substring(7)

  const cookieName = tokenType === 'access' ? 'bt_access_token' : 'bt_refresh_token'
  const cookieHeader = c.req.header('Cookie')
  if (cookieHeader) {
    const cookies = Object.fromEntries(cookieHeader.split(';').map(c => c.trim().split('=')))
    return cookies[cookieName] || null
  }
  return null
}

// Rate limiting
const rateLimitStore = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(identifier: string, maxAttempts = 5, windowMinutes = 15): boolean {
  const now = Date.now()
  const key = `auth:${identifier}`
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMinutes * 60 * 1000 })
    return false
  }
  if (record.count >= maxAttempts) return true
  record.count++
  return false
}

export function resetRateLimit(identifier: string): void {
  rateLimitStore.delete(`auth:${identifier}`)
}

export function validatePasswordStrength(password: string): { valid: boolean; message: string } {
  if (password.length < 8) return { valid: false, message: 'Password must be at least 8 characters' }
  if (!/[a-z]/.test(password)) return { valid: false, message: 'Password must contain lowercase letter' }
  if (!/[A-Z]/.test(password)) return { valid: false, message: 'Password must contain uppercase letter' }
  if (!/[0-9]/.test(password)) return { valid: false, message: 'Password must contain a number' }
  return { valid: true, message: 'Password is strong' }
}

// Auth middleware
export function requireAuth(env: any) {
  return async (c: Context, next: Next) => {
    const token = extractToken(c, 'access')
    if (!token) return c.json({ error: 'Unauthorized' }, 401)

    const payload = await verifyToken(token, env, 'access')
    if (!payload) return c.json({ error: 'Invalid token' }, 401)

    c.set('userId', payload.userId)
    c.set('userEmail', payload.email)
    await next()
  }
}
