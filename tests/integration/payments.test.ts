import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Hono } from 'hono'
import { createMockSupabaseClient } from '../helpers/mock-supabase'
import { MOCK_ENV } from '../helpers/mock-env'

// Create mock clients
const mockClient = createMockSupabaseClient()

// Mock Stripe constructor and instance
const mockStripeInstance = {
  checkout: {
    sessions: { create: vi.fn() },
  },
  webhooks: {
    constructEventAsync: vi.fn(),
  },
  subscriptions: {
    update: vi.fn(),
  },
  billingPortal: {
    sessions: { create: vi.fn() },
  },
}

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
vi.mock('../../src/lib/stripe', async (importOriginal) => {
  const actual = await importOriginal() as any
  return {
    ...actual,
    createStripeClient: vi.fn(() => mockStripeInstance),
  }
})

const { default: paymentsApi } = await import('../../src/api/payments')

function createTestApp() {
  const app = new Hono()
  app.use('*', async (c, next) => {
    c.set('logger', {
      info: vi.fn(),
      error: vi.fn(),
      warn: vi.fn(),
      debug: vi.fn(),
    })
    await next()
  })
  app.route('/api/payments', paymentsApi)
  return app
}

function jsonRequest(method: string, path: string, body?: Record<string, unknown>, headers?: Record<string, string>) {
  const init: RequestInit = {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
  }
  if (body) {
    init.body = JSON.stringify(body)
  }
  return new Request(`http://localhost${path}`, init)
}

describe('Payments Integration Tests', () => {
  let app: ReturnType<typeof createTestApp>

  beforeEach(() => {
    vi.clearAllMocks()
    app = createTestApp()
  })

  describe('POST /api/payments/create-checkout-session', () => {
    it('returns 400 when planId is missing', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/payments/create-checkout-session', {
          userId: 'user-1',
          email: 'test@example.com',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 400 for invalid planId', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/payments/create-checkout-session', {
          planId: 'invalid-plan',
          userId: 'user-1',
          email: 'test@example.com',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 200 with checkout URL for valid request', async () => {
      // Mock Supabase user lookup (no existing stripe_customer_id)
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      })

      mockStripeInstance.checkout.sessions.create.mockResolvedValueOnce({
        id: 'cs_test_123',
        url: 'https://checkout.stripe.com/session/cs_test_123',
      })

      const res = await app.request(
        jsonRequest('POST', '/api/payments/create-checkout-session', {
          planId: 'try-it-out',
          userId: 'user-1',
          email: 'test@example.com',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.sessionId).toBe('cs_test_123')
      expect(json.url).toContain('stripe.com')
    })
  })

  describe('POST /api/payments/webhook', () => {
    it('returns 400 when stripe-signature header is missing', async () => {
      const res = await app.request(
        new Request('http://localhost/api/payments/webhook', {
          method: 'POST',
          body: '{}',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 400 when signature verification fails', async () => {
      mockStripeInstance.webhooks.constructEventAsync.mockRejectedValueOnce(
        new Error('Invalid signature')
      )

      const res = await app.request(
        new Request('http://localhost/api/payments/webhook', {
          method: 'POST',
          headers: { 'stripe-signature': 'invalid_sig' },
          body: '{}',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 200 when signature is valid and event is processed', async () => {
      mockStripeInstance.webhooks.constructEventAsync.mockResolvedValueOnce({
        type: 'checkout.session.completed',
        data: {
          object: {
            client_reference_id: 'user-1',
            subscription: 'sub_123',
            customer: 'cus_123',
            metadata: { planId: 'try-it-out' },
            subscription_data: { metadata: {} },
          },
        },
      })

      // Mock Supabase upsert and update chains
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        upsert: vi.fn().mockResolvedValue({ data: null, error: null }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
        eq: vi.fn().mockReturnThis(),
      }
      mockClient.from.mockReturnValue(mockChain)

      const res = await app.request(
        new Request('http://localhost/api/payments/webhook', {
          method: 'POST',
          headers: { 'stripe-signature': 'valid_sig_123' },
          body: JSON.stringify({ type: 'checkout.session.completed' }),
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.received).toBe(true)
    })
  })

  describe('POST /api/payments/cancel-subscription', () => {
    it('returns 400 when userId is missing', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/payments/cancel-subscription', {}),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 404 when no active subscription found', async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        }),
      })

      const res = await app.request(
        jsonRequest('POST', '/api/payments/cancel-subscription', {
          userId: 'user-1',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(404)
    })

    it('returns 200 on successful cancellation', async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({
                data: { stripe_subscription_id: 'sub_123' },
                error: null,
              }),
            }),
          }),
        }),
      })

      mockStripeInstance.subscriptions.update.mockResolvedValueOnce({
        cancel_at: 1700000000,
        cancel_at_period_end: true,
      })

      const res = await app.request(
        jsonRequest('POST', '/api/payments/cancel-subscription', {
          userId: 'user-1',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.success).toBe(true)
    })
  })

  describe('GET /api/payments/tiers', () => {
    it('returns available subscription plans', async () => {
      const res = await app.request(
        new Request('http://localhost/api/payments/tiers'),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.plans).toBeInstanceOf(Array)
      expect(json.plans.length).toBe(2)
      expect(json.plans[0].id).toBe('try-it-out')
      expect(json.plans[1].id).toBe('better-together')
    })
  })
})
