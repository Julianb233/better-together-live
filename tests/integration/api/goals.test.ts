import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'
import { createMockSupabaseClient } from '../../helpers/mock-supabase'
import { MOCK_ENV } from '../../helpers/mock-env'

const mockClient = createMockSupabaseClient()

vi.mock('../../../src/lib/supabase', () => ({
  createAnonClient: vi.fn(() => mockClient),
  createAdminClient: vi.fn(() => mockClient),
}))
vi.mock('../../../src/lib/supabase/server', () => ({
  createAnonClient: vi.fn(() => mockClient),
  createAdminClient: vi.fn(() => mockClient),
}))

const { default: goalsApi } = await import('../../../src/api/goals')

function createTestApp() {
  const app = new Hono()
  app.route('/api/goals', goalsApi)
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

const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000'
const VALID_UUID_2 = '550e8400-e29b-41d4-a716-446655440001'

describe('Goals Integration Tests', () => {
  let app: ReturnType<typeof createTestApp>

  beforeEach(() => {
    vi.clearAllMocks()
    app = createTestApp()
  })

  describe('POST /api/goals', () => {
    it('returns 400 when required fields are missing', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/goals', {}),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 400 for invalid relationship_id format', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/goals', {
          relationship_id: 'not-a-uuid',
          goal_name: 'Test Goal',
          created_by_user_id: VALID_UUID,
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 200 on valid goal creation', async () => {
      mockClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      })

      const res = await app.request(
        jsonRequest('POST', '/api/goals', {
          relationship_id: VALID_UUID,
          goal_name: 'Exercise together 3x/week',
          goal_description: 'Stay healthy as a couple',
          goal_type: 'weekly',
          created_by_user_id: VALID_UUID_2,
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.message).toContain('Goal created')
      expect(json.goal_id).toBeDefined()
    })
  })

  describe('GET /api/goals/:relationshipId', () => {
    it('returns 200 with array of goals', async () => {
      const goalsData = [
        { id: 'goal-1', title: 'Exercise together', description: 'Stay healthy', status: 'active', progress_percentage: 50, created_at: '2025-01-01' },
        { id: 'goal-2', title: 'Save for vacation', description: null, status: 'active', progress_percentage: 20, created_at: '2025-02-01' },
      ]

      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: goalsData, error: null }),
          }),
        }),
      })

      const res = await app.request(
        new Request(`http://localhost/api/goals/${VALID_UUID}`),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.goals).toBeInstanceOf(Array)
      expect(json.goals.length).toBe(2)
      // Verify field mapping
      expect(json.goals[0].goal_name).toBe('Exercise together')
    })

    it('returns 200 with empty array when no goals exist', async () => {
      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      })

      const res = await app.request(
        new Request(`http://localhost/api/goals/${VALID_UUID}`),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.goals).toEqual([])
    })
  })
})
