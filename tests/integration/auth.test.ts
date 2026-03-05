import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'
import { createMockSupabaseClient } from '../helpers/mock-supabase'
import { MOCK_ENV } from '../helpers/mock-env'

// Create mock client before mocking modules
const mockClient = createMockSupabaseClient()

// Mock Supabase modules BEFORE importing routes
vi.mock('../../src/lib/supabase', () => ({
  createAnonClient: vi.fn(() => mockClient),
  createAdminClient: vi.fn(() => mockClient),
  setSupabaseAuthCookies: vi.fn(),
  clearSupabaseAuthCookies: vi.fn(),
}))
vi.mock('../../src/lib/supabase/server', () => ({
  createAnonClient: vi.fn(() => mockClient),
  createAdminClient: vi.fn(() => mockClient),
}))

// Import route module AFTER mocks are set up
const { default: supabaseAuth } = await import('../../src/api/supabase-auth')

// Create a test app with the auth routes and a mock logger
function createTestApp() {
  const app = new Hono()
  // Add mock logger middleware (routes use c.var.logger)
  app.use('*', async (c, next) => {
    c.set('logger', {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    })
    await next()
  })
  app.route('/api/auth', supabaseAuth)
  return app
}

function jsonRequest(method: string, path: string, body?: Record<string, unknown>) {
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json' },
  }
  if (body) {
    init.body = JSON.stringify(body)
  }
  return new Request(`http://localhost${path}`, init)
}

describe('Auth Integration Tests', () => {
  let app: ReturnType<typeof createTestApp>

  beforeEach(() => {
    vi.clearAllMocks()
    app = createTestApp()
  })

  describe('POST /api/auth/signup', () => {
    it('returns 400 when email is missing', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/auth/signup', {
          password: 'password123',
          name: 'Test User',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
      const json = await res.json()
      expect(json.error).toBeDefined()
    })

    it('returns 400 when password is missing', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/auth/signup', {
          email: 'test@example.com',
          name: 'Test User',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 400 when name is missing', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/auth/signup', {
          email: 'test@example.com',
          password: 'password123',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 400 for invalid email format', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/auth/signup', {
          email: 'notanemail',
          password: 'password123',
          name: 'Test User',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 400 for short password', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/auth/signup', {
          email: 'test@example.com',
          password: 'short',
          name: 'Test User',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 201 on valid signup (confirmation required)', async () => {
      mockClient.auth.signUp.mockResolvedValueOnce({
        data: {
          user: {
            id: 'new-user-id',
            email: 'test@example.com',
            user_metadata: { name: 'Test User' },
          },
          session: null,
        },
        error: null,
      })

      const res = await app.request(
        jsonRequest('POST', '/api/auth/signup', {
          email: 'test@example.com',
          password: 'password123',
          name: 'Test User',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(201)
      const json = await res.json()
      expect(json.success).toBe(true)
      expect(json.user.id).toBe('new-user-id')
      expect(json.confirmationRequired).toBe(true)
    })

    it('returns 400 when Supabase signUp fails', async () => {
      mockClient.auth.signUp.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'User already exists', status: 400 },
      })

      const res = await app.request(
        jsonRequest('POST', '/api/auth/signup', {
          email: 'existing@example.com',
          password: 'password123',
          name: 'Test User',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
      const json = await res.json()
      expect(json.error).toBe('User already exists')
    })
  })

  describe('POST /api/auth/login', () => {
    it('returns 400 when email is missing', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/auth/login', {
          password: 'password123',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 400 when password is missing', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/auth/login', {
          email: 'test@example.com',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 200 on valid login with session', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          user: {
            id: 'user-1',
            email: 'test@example.com',
            user_metadata: { name: 'Test User' },
          },
          session: {
            access_token: 'access-token',
            refresh_token: 'refresh-token',
            expires_in: 3600,
          },
        },
        error: null,
      })

      const res = await app.request(
        jsonRequest('POST', '/api/auth/login', {
          email: 'test@example.com',
          password: 'password123',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
      expect(json.user.id).toBe('user-1')
      expect(json.session.accessToken).toBe('access-token')
      expect(json.token).toBe('access-token')
    })

    it('returns 401 when credentials are wrong', async () => {
      mockClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null, session: null },
        error: { message: 'Invalid login credentials', status: 400 },
      })

      const res = await app.request(
        jsonRequest('POST', '/api/auth/login', {
          email: 'test@example.com',
          password: 'wrongpassword',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(401)
      const json = await res.json()
      expect(json.error).toBe('Invalid email or password')
    })
  })

  describe('POST /api/auth/logout', () => {
    it('returns 200 on logout', async () => {
      mockClient.auth.signOut.mockResolvedValueOnce({ error: null })

      const res = await app.request(
        jsonRequest('POST', '/api/auth/logout'),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
    })

    it('returns 200 even when signOut errors (clears cookies anyway)', async () => {
      mockClient.auth.signOut.mockRejectedValueOnce(new Error('Network error'))

      const res = await app.request(
        jsonRequest('POST', '/api/auth/logout'),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
    })
  })

  describe('POST /api/auth/forgot-password', () => {
    it('returns 400 when email is missing', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/auth/forgot-password', {}),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 400 for invalid email format', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/auth/forgot-password', {
          email: 'notanemail',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 200 on valid email (prevents email enumeration)', async () => {
      mockClient.auth.resetPasswordForEmail.mockResolvedValueOnce({ error: null })

      const res = await app.request(
        jsonRequest('POST', '/api/auth/forgot-password', {
          email: 'test@example.com',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
      expect(json.message).toContain('password reset link')
    })

    it('returns 200 even when email does not exist (prevents enumeration)', async () => {
      mockClient.auth.resetPasswordForEmail.mockResolvedValueOnce({
        error: { message: 'User not found' },
      })

      const res = await app.request(
        jsonRequest('POST', '/api/auth/forgot-password', {
          email: 'nonexistent@example.com',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
    })
  })
})
