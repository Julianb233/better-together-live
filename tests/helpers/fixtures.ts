export function makeUser(overrides: Record<string, any> = {}) {
  return {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    phone: null,
    avatar_url: null,
    subscription_tier: 'free',
    is_admin: false,
    created_at: '2025-01-01T00:00:00Z',
    updated_at: '2025-01-01T00:00:00Z',
    ...overrides,
  }
}

export function makeRelationship(overrides: Record<string, any> = {}) {
  return {
    id: 'rel-1',
    user_1_id: 'user-1',
    user_2_id: 'user-2',
    status: 'active',
    start_date: '2025-01-01',
    created_at: '2025-01-01T00:00:00Z',
    ...overrides,
  }
}

export function makeCheckin(overrides: Record<string, any> = {}) {
  return {
    id: 'checkin-1',
    relationship_id: 'rel-1',
    user_id: 'user-1',
    checkin_date: '2025-06-15',
    connection_score: 8,
    mood_score: 7,
    satisfaction: 9,
    gratitude_note: 'Great day together',
    created_at: '2025-06-15T10:00:00Z',
    ...overrides,
  }
}
