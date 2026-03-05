import { describe, it, expect } from 'vitest'
import {
  generateId,
  daysBetween,
  getCurrentDate,
  getCurrentDateTime,
  isValidEmail,
  getPartnerId,
  calculateHealthScore,
} from '../../src/utils'

describe('generateId', () => {
  it('returns a UUID v4 format string', () => {
    const id = generateId()
    const uuidV4Regex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    expect(id).toMatch(uuidV4Regex)
  })

  it('generates unique IDs across 100 calls', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})

describe('daysBetween', () => {
  it('returns 0 for the same date', () => {
    expect(daysBetween('2025-01-01', '2025-01-01')).toBe(0)
  })

  it('returns correct days for a known date pair', () => {
    expect(daysBetween('2025-01-01', '2025-01-10')).toBe(9)
  })

  it('returns absolute difference regardless of order', () => {
    expect(daysBetween('2025-01-10', '2025-01-01')).toBe(9)
  })

  it('handles month boundaries', () => {
    expect(daysBetween('2025-01-30', '2025-02-01')).toBe(2)
  })
})

describe('getCurrentDate', () => {
  it('returns YYYY-MM-DD format', () => {
    const date = getCurrentDate()
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('getCurrentDateTime', () => {
  it('returns ISO format string with T and Z', () => {
    const dt = getCurrentDateTime()
    expect(dt).toContain('T')
    expect(dt).toContain('Z')
  })

  it('is a valid date string', () => {
    const dt = getCurrentDateTime()
    const parsed = new Date(dt)
    expect(parsed.getTime()).not.toBeNaN()
  })
})

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('name+tag@domain.co')).toBe(true)
    expect(isValidEmail('test.user@sub.domain.org')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(isValidEmail('notanemail')).toBe(false)
    expect(isValidEmail('@missing.com')).toBe(false)
    expect(isValidEmail('')).toBe(false)
    expect(isValidEmail('spaces here@test.com')).toBe(false)
  })
})

describe('getPartnerId', () => {
  const relationship = {
    id: 'rel-1',
    user_1_id: 'alice',
    user_2_id: 'bob',
    status: 'active' as const,
    start_date: '2025-01-01',
    created_at: '2025-01-01T00:00:00Z',
  }

  it('returns user_2_id when current user is user_1_id', () => {
    expect(getPartnerId(relationship as any, 'alice')).toBe('bob')
  })

  it('returns user_1_id when current user is user_2_id', () => {
    expect(getPartnerId(relationship as any, 'bob')).toBe('alice')
  })
})

describe('calculateHealthScore', () => {
  it('returns 0 for all-zero inputs', () => {
    expect(calculateHealthScore(0, 0, 0, 0)).toBe(0)
  })

  it('returns value between 0 and 100 for typical inputs', () => {
    const score = calculateHealthScore(7, 8, 5, 0.6)
    expect(score).toBeGreaterThan(0)
    expect(score).toBeLessThanOrEqual(100)
  })

  it('returns 100 for perfect inputs', () => {
    // 10/10 connection, 10/10 satisfaction, 10+ checkins, 100% goal rate
    expect(calculateHealthScore(10, 10, 10, 1)).toBe(100)
  })

  it('weights connection and satisfaction higher than consistency and goals', () => {
    // High connection/satisfaction, low consistency/goals
    const highCS = calculateHealthScore(10, 10, 0, 0)
    // Low connection/satisfaction, high consistency/goals
    const highCG = calculateHealthScore(0, 0, 10, 1)
    expect(highCS).toBeGreaterThan(highCG)
  })
})
