import { vi } from 'vitest'

export function createMockSupabaseClient(overrides: Record<string, any> = {}) {
  const chainMethods = {
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    upsert: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    neq: vi.fn().mockReturnThis(),
    or: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    like: vi.fn().mockReturnThis(),
    ilike: vi.fn().mockReturnThis(),
    in: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
    limit: vi.fn().mockReturnThis(),
    range: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: undefined, // Important: makes chain awaitable via .single()/.maybeSingle()
  }

  // Make the chain itself resolve when awaited (for queries without .single())
  const mockFrom = vi.fn().mockReturnValue({
    ...chainMethods,
    then: vi.fn((resolve: any) => resolve({ data: [], error: null })),
  })

  const mockAuth = {
    signUp: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id', email: 'test@example.com' }, session: null }, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id', email: 'test@example.com' }, session: { access_token: 'test-token', refresh_token: 'test-refresh' } }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id', email: 'test@example.com' } }, error: null }),
    getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'test-token', user: { id: 'test-user-id' } } }, error: null }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ error: null }),
    updateUser: vi.fn().mockResolvedValue({ data: { user: { id: 'test-user-id' } }, error: null }),
    refreshSession: vi.fn().mockResolvedValue({ data: { session: { access_token: 'new-token' } }, error: null }),
  }

  return {
    from: mockFrom,
    auth: mockAuth,
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    ...overrides,
  }
}
