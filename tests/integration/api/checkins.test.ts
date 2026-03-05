import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'
import { createMockSupabaseClient } from '../../helpers/mock-supabase'
import { MOCK_ENV } from '../../helpers/mock-env'
import { makeCheckin } from '../../helpers/fixtures'

const mockClient = createMockSupabaseClient()

vi.mock('../../../src/lib/supabase', () => ({
  createAnonClient: vi.fn(() => mockClient),
  createAdminClient: vi.fn(() => mockClient),
}))
vi.mock('../../../src/lib/supabase/server', () => ({
  createAnonClient: vi.fn(() => mockClient),
  createAdminClient: vi.fn(() => mockClient),
}))

// Mock utils to control hasTodayCheckin and checkAchievements
vi.mock('../../../src/utils', async (importOriginal) => {
  const actual = await importOriginal() as any
  return {
    ...actual,
    hasTodayCheckin: vi.fn().mockResolvedValue(false),
    checkAchievements: vi.fn().mockResolvedValue([]),
  }
})

const { default: checkinsApi } = await import('../../../src/api/checkins')
const { hasTodayCheckin } = await import('../../../src/utils')

function createTestApp() {
  const app = new Hono()
  app.route('/api/checkins', checkinsApi)
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

describe('Checkins Integration Tests', () => {
  let app: ReturnType<typeof createTestApp>

  beforeEach(() => {
    vi.clearAllMocks()
    app = createTestApp()
    // Reset hasTodayCheckin to false by default
    vi.mocked(hasTodayCheckin).mockResolvedValue(false)
  })

  describe('POST /api/checkins', () => {
    it('returns 400 when required fields are missing', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/checkins', {}),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 400 for invalid UUID in relationship_id', async () => {
      const res = await app.request(
        jsonRequest('POST', '/api/checkins', {
          relationship_id: 'not-a-uuid',
          user_id: VALID_UUID,
          connection_score: 8,
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(400)
    })

    it('returns 409 when user already checked in today', async () => {
      vi.mocked(hasTodayCheckin).mockResolvedValueOnce(true)

      const res = await app.request(
        jsonRequest('POST', '/api/checkins', {
          relationship_id: VALID_UUID,
          user_id: VALID_UUID_2,
          connection_score: 8,
          mood_score: 7,
          relationship_satisfaction: 9,
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(409)
      const json = await res.json()
      expect(json.error).toContain('Already checked in')
    })

    it('returns 200 on valid checkin submission', async () => {
      // Mock Supabase insert chain
      mockClient.from.mockReturnValue({
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      })

      const res = await app.request(
        jsonRequest('POST', '/api/checkins', {
          relationship_id: VALID_UUID,
          user_id: VALID_UUID_2,
          connection_score: 8,
          mood_score: 7,
          relationship_satisfaction: 9,
          gratitude_note: 'Great day together',
        }),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.message).toContain('Check-in completed')
      expect(json.checkin_id).toBeDefined()
    })
  })

  describe('GET /api/checkins/:relationshipId', () => {
    it('returns 200 with array of checkins', async () => {
      const checkinData = [makeCheckin(), makeCheckin({ id: 'checkin-2', user_id: 'user-2' })]

      mockClient.from.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
              order: vi.fn().mockReturnValue({
                limit: vi.fn().mockResolvedValue({ data: checkinData, error: null }),
              }),
            }),
          }),
        }),
      })

      const res = await app.request(
        new Request(`http://localhost/api/checkins/${VALID_UUID}`),
        undefined,
        MOCK_ENV,
      )
      expect(res.status).toBe(200)
      const json = await res.json()
      expect(json.checkins).toBeInstanceOf(Array)
      expect(json.checkins.length).toBe(2)
    })
  })
})
