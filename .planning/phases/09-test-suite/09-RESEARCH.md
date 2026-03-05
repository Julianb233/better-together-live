# Phase 9: Test Suite - Research

**Researched:** 2026-03-05
**Domain:** Vitest testing for Hono + Supabase server-rendered application
**Confidence:** HIGH

## Summary

This phase adds a proper test suite to the Better Together project, which currently has zero automated tests (the `npm test` script just curls localhost). The project is a Hono 4.9 server-rendered TSX app deployed to Vercel/Cloudflare, using Supabase for database and auth, with Vite 6 as the build tool.

Vitest is the clear choice -- it shares Vite's config pipeline, runs natively in ESM, and Hono's official docs recommend it. Hono provides `app.request()` for integration testing (no server required, runs in-memory) and `testClient()` from `hono/testing` for type-safe route testing. Supabase should be mocked at the module level using `vi.mock()` to avoid hitting real databases in CI.

**Primary recommendation:** Use Vitest with `@vitest/coverage-v8`, test Hono routes via `app.request()` with mocked env bindings, and mock Supabase client at the module level.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| vitest | ^3.x | Test runner | Native Vite integration, ESM-first, Hono-recommended |
| @vitest/coverage-v8 | ^3.x | Code coverage | v8 provider is default, fast, accurate since v3.2 AST-based remapping |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| hono/testing | (bundled) | Type-safe test client | For routes defined with chained methods |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @vitest/coverage-v8 | @vitest/coverage-istanbul | Istanbul is slightly more battle-tested but v8 is now equivalent accuracy since v3.2 |
| vi.mock() for Supabase | MSW (Mock Service Worker) | MSW intercepts HTTP but adds complexity; vi.mock is simpler for this codebase since Supabase client is constructed in known locations |
| @cloudflare/vitest-pool-workers | Default Vitest pool | Only needed if testing Cloudflare-specific bindings (D1, KV); this app uses Supabase, not D1 for primary data |

**Installation:**
```bash
npm install -D vitest @vitest/coverage-v8
```

## Architecture Patterns

### Recommended Test Structure
```
tests/
  unit/
    utils.test.ts           # Pure function tests for src/utils.ts
  integration/
    auth.test.ts             # Auth route tests (register, login, logout)
    payments.test.ts         # Payment route tests (checkout, webhooks)
    api/
      checkins.test.ts       # Checkin API route tests
      goals.test.ts          # Goals API route tests
      activities.test.ts     # Activities API route tests
  helpers/
    mock-supabase.ts         # Shared Supabase mock factory
    mock-env.ts              # Shared env bindings mock
    fixtures.ts              # Test data factories
  setup.ts                   # Global test setup
```

### Pattern 1: Hono Route Testing with app.request()
**What:** Test Hono routes by calling `app.request()` which returns a real Response object without starting a server.
**When to use:** All API route integration tests.
**Example:**
```typescript
// Source: https://hono.dev/docs/guides/testing
import { describe, it, expect } from 'vitest'
import app from '../../src/index'

const MOCK_ENV = {
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_ANON_KEY: 'test-anon-key',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
  STRIPE_SECRET_KEY: 'sk_test_xxx',
}

describe('POST /api/auth/register', () => {
  it('returns 400 when email is missing', async () => {
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ password: 'test123', name: 'Test' }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }, MOCK_ENV)
    expect(res.status).toBe(400)
    const body = await res.json()
    expect(body.error).toBeDefined()
  })
})
```

### Pattern 2: Mocking Supabase at Module Level
**What:** Use `vi.mock()` to replace the Supabase client factory with a controlled mock.
**When to use:** Any test that would otherwise hit a real Supabase instance.
**Example:**
```typescript
// tests/helpers/mock-supabase.ts
import { vi } from 'vitest'

export function createMockSupabaseClient(overrides = {}) {
  const mockFrom = vi.fn().mockReturnValue({
    select: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    update: vi.fn().mockReturnThis(),
    delete: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    limit: vi.fn().mockReturnThis(),
    order: vi.fn().mockReturnThis(),
  })

  const mockAuth = {
    signUp: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
  }

  return {
    from: mockFrom,
    auth: mockAuth,
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
    ...overrides,
  }
}

// Usage in test files:
// vi.mock('../../src/lib/supabase', () => ({
//   createServerClient: vi.fn(() => createMockSupabaseClient()),
//   createAdminClient: vi.fn(() => createMockSupabaseClient()),
//   ...other exports with vi.fn()
// }))
```

### Pattern 3: Env Bindings via app.request 3rd Parameter
**What:** Pass mock environment bindings as the 3rd parameter to `app.request()`.
**When to use:** Every integration test to provide `c.env` values.
**Example:**
```typescript
// Source: https://hono.dev/docs/guides/testing
const res = await app.request('/api/checkins', {}, {
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_ANON_KEY: 'test-key',
})
```

### Pattern 4: Vitest Config Extending Vite Config
**What:** Use `vitest/config` defineConfig which merges with existing Vite config.
**When to use:** Project setup.
**Example:**
```typescript
// vitest.config.ts (separate file, not merged into vite.config.ts)
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: ['src/pages/**', 'src/components/**', 'src/renderer.tsx'],
    },
  },
})
```

### Anti-Patterns to Avoid
- **Testing against real Supabase in CI:** Leads to flaky tests, rate limits, and data pollution. Always mock.
- **Testing server-rendered HTML output:** The TSX pages generate HTML strings -- testing exact HTML is brittle. Test API routes and utility functions instead.
- **Putting test config in vite.config.ts:** The existing vite.config.ts has Hono build plugins that conflict with Vitest. Use a separate `vitest.config.ts`.
- **Using testClient() with this codebase:** The `testClient()` helper requires routes defined via chained methods (`new Hono().get().post()`). This codebase uses `app.route()` to mount sub-routers, so `app.request()` is the correct approach.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| HTTP request simulation | Custom fetch wrappers | `app.request()` from Hono | Built-in, returns real Response, no server needed |
| Test coverage | Manual tracking | `@vitest/coverage-v8` | Automatic instrumentation, CI-ready reporters |
| Coverage reporting in PRs | Custom scripts | `davelosert/vitest-coverage-report-action` | Mature GH Action, posts coverage to PR comments |
| Supabase mock chains | Manual mock objects | Shared mock factory (see Pattern 2) | Supabase's fluent API has deep chains (.from().select().eq().single()) that need consistent mocking |
| Test data generation | Inline test data | Fixture factory functions | Reusable across tests, single source of truth for shape |

**Key insight:** Hono's `app.request()` eliminates the need for supertest, axios, or any HTTP client library for testing. It runs entirely in-memory with zero network overhead.

## Common Pitfalls

### Pitfall 1: Vitest Config Conflicting with Vite Build Plugins
**What goes wrong:** Adding `test` config to `vite.config.ts` causes `@hono/vite-build` and `@hono/vite-dev-server` plugins to interfere with test execution.
**Why it happens:** Hono's Vite plugins transform the entry point for deployment targets (Vercel, Cloudflare) which breaks Vitest's module resolution.
**How to avoid:** Use a separate `vitest.config.ts` file. Vitest automatically picks it up if present.
**Warning signs:** Tests fail with module resolution errors or "cannot find entry" errors.

### Pitfall 2: Supabase Client Created Inside Route Handlers
**What goes wrong:** Mocking `@supabase/supabase-js` globally doesn't work because `createServerClient` or `createClient` is called at import time or inside middleware.
**Why it happens:** The Supabase client factory (`src/lib/supabase/server.ts`, `src/db-supabase.ts`) constructs clients from env vars passed at request time.
**How to avoid:** Mock at the module boundary -- mock `src/lib/supabase` or `src/db-supabase` rather than `@supabase/supabase-js` directly. This gives control over what the route handlers receive.
**Warning signs:** Mocks don't take effect, tests hit real Supabase.

### Pitfall 3: Forgetting to Pass Env Bindings in app.request()
**What goes wrong:** Tests crash with "SUPABASE_URL environment variable is required" or similar.
**Why it happens:** Hono routes access `c.env` which is undefined unless the 3rd parameter of `app.request()` provides it.
**How to avoid:** Create a shared `MOCK_ENV` object in `tests/helpers/mock-env.ts` and always pass it.
**Warning signs:** "Cannot read property of undefined" errors from env access.

### Pitfall 4: Testing the Entire App vs. Individual Route Modules
**What goes wrong:** Importing the full `src/index.tsx` pulls in all route modules, making mocking difficult and tests slow.
**Why it happens:** The main app file imports and mounts 25+ API route modules.
**How to avoid:** For focused integration tests, import the sub-router directly (e.g., `import authRoutes from '../../src/api/auth-routes'`) and test it in isolation with a minimal Hono app wrapper.
**Warning signs:** Tests are slow, mock setup is complex, unrelated tests affect each other.

### Pitfall 5: CI Coverage Thresholds Too Aggressive Initially
**What goes wrong:** CI blocks all merges because coverage is below threshold on first introduction.
**Why it happens:** Setting 80%+ threshold on a codebase with zero prior tests means no PR can pass.
**How to avoid:** Start with no threshold or a very low one (e.g., 20%). Increase gradually as coverage grows. Use `coverage.thresholds` in vitest config.
**Warning signs:** Every PR fails CI after test suite introduction.

## Code Examples

### Complete vitest.config.ts
```typescript
// Source: https://vitest.dev/guide/coverage.html
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
    setupFiles: ['tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json', 'lcov'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        'src/pages/**',
        'src/components/**',
        'src/renderer.tsx',
        'src/types.ts',
        'src/lib/supabase/types.ts',
      ],
      thresholds: {
        // Start low, increase as coverage grows
        statements: 20,
        branches: 20,
        functions: 20,
        lines: 20,
      },
    },
  },
})
```

### Unit Test for utils.ts (Pure Functions)
```typescript
// tests/unit/utils.test.ts
import { describe, it, expect } from 'vitest'
import {
  generateId,
  daysBetween,
  getCurrentDate,
  isValidEmail,
  getPartnerId,
  calculateHealthScore,
} from '../../src/utils'

describe('generateId', () => {
  it('returns a valid UUID', () => {
    const id = generateId()
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
  })

  it('generates unique IDs', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generateId()))
    expect(ids.size).toBe(100)
  })
})

describe('daysBetween', () => {
  it('calculates days between two dates', () => {
    expect(daysBetween('2025-01-01', '2025-01-10')).toBe(9)
  })

  it('returns 0 for same date', () => {
    expect(daysBetween('2025-06-15', '2025-06-15')).toBe(0)
  })

  it('works regardless of order', () => {
    expect(daysBetween('2025-01-10', '2025-01-01')).toBe(9)
  })
})

describe('isValidEmail', () => {
  it('accepts valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true)
    expect(isValidEmail('name+tag@domain.co')).toBe(true)
  })

  it('rejects invalid emails', () => {
    expect(isValidEmail('notanemail')).toBe(false)
    expect(isValidEmail('@missing.com')).toBe(false)
    expect(isValidEmail('spaces here@test.com')).toBe(false)
    expect(isValidEmail('')).toBe(false)
  })
})

describe('getPartnerId', () => {
  const relationship = {
    user_1_id: 'user-a',
    user_2_id: 'user-b',
  } as any

  it('returns user_2 when current user is user_1', () => {
    expect(getPartnerId(relationship, 'user-a')).toBe('user-b')
  })

  it('returns user_1 when current user is user_2', () => {
    expect(getPartnerId(relationship, 'user-b')).toBe('user-a')
  })
})

describe('calculateHealthScore', () => {
  it('returns 0 for all-zero inputs', () => {
    expect(calculateHealthScore(0, 0, 0, 0)).toBe(0)
  })

  it('returns 100 for perfect inputs', () => {
    expect(calculateHealthScore(10, 10, 10, 1)).toBe(100)
  })

  it('returns a value between 0 and 100', () => {
    const score = calculateHealthScore(5, 7, 3, 0.5)
    expect(score).toBeGreaterThanOrEqual(0)
    expect(score).toBeLessThanOrEqual(100)
  })
})

describe('getCurrentDate', () => {
  it('returns YYYY-MM-DD format', () => {
    const date = getCurrentDate()
    expect(date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})
```

### Integration Test for Auth Routes
```typescript
// tests/integration/auth.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Hono } from 'hono'

// Mock the database module before importing routes
vi.mock('../../src/db', () => ({
  createDatabase: vi.fn(() => ({
    first: vi.fn().mockResolvedValue(null),
    all: vi.fn().mockResolvedValue([]),
    run: vi.fn().mockResolvedValue(undefined),
  })),
}))

// Import after mocking
import authRoutes from '../../src/api/auth-routes'

const app = new Hono()
app.route('/api/auth', authRoutes)

const MOCK_ENV = {
  SUPABASE_URL: 'https://test.supabase.co',
  SUPABASE_ANON_KEY: 'test-anon-key',
  JWT_SECRET: 'test-jwt-secret-key-at-least-32-chars-long',
}

describe('POST /api/auth/register', () => {
  it('returns 400 when required fields are missing', async () => {
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }, MOCK_ENV)
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid email', async () => {
    const res = await app.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: 'notvalid', password: 'Test1234!', name: 'Test' }),
      headers: new Headers({ 'Content-Type': 'application/json' }),
    }, MOCK_ENV)
    expect(res.status).toBe(400)
  })
})
```

### CI Workflow Step (Add to deploy.yml)
```yaml
# Add to the lint-and-test job steps
- name: Run tests with coverage
  run: npx vitest run --coverage

- name: Upload coverage report
  if: always()
  uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: coverage/
```

### Package.json Scripts
```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:ui": "vitest --ui"
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Istanbul-only coverage | v8 coverage with AST remapping | Vitest v3.2 | v8 now produces identical reports to Istanbul, faster |
| supertest for HTTP testing | app.request() built into Hono | Hono v3+ | No external HTTP test library needed |
| Jest for Vite projects | Vitest | 2022+ | Native ESM, shared Vite pipeline, faster |
| Separate test + build configs | Vitest extends Vite config | Vitest v1+ | Single tool handles both |

**Deprecated/outdated:**
- **Jest with Vite:** Requires babel transforms and workarounds for ESM. Vitest is the standard for Vite projects.
- **supertest:** Requires a running server. Hono's `app.request()` eliminates this need.
- **testClient() for mounted sub-routers:** Only works with chained route definitions. This codebase uses `app.route()` for mounting, so `app.request()` is correct.

## Open Questions

1. **How much of the DB layer uses `db.ts` (Neon) vs `db-supabase.ts` (Supabase)?**
   - What we know: Both adapters exist. `auth-routes.ts` uses `createDatabase` from `db.ts`. `supabase-auth.ts` uses Supabase client from `lib/supabase`.
   - What's unclear: Which routes use which DB adapter.
   - Recommendation: Mock both `src/db` and `src/lib/supabase` modules. Check each route file's imports before writing its test.

2. **Should auth tests use the custom JWT auth (`auth-routes.ts`) or Supabase auth (`supabase-auth.ts`)?**
   - What we know: Both exist as separate route modules.
   - What's unclear: Which is the primary auth path in production.
   - Recommendation: Test both. They are separate route modules mounted at different paths.

3. **Coverage threshold target**
   - What we know: Starting from zero coverage.
   - Recommendation: Begin at 20% threshold, raise to 50% after initial test suite, target 70% long-term. Never block merges on aggressive thresholds during initial rollout.

## Sources

### Primary (HIGH confidence)
- [Hono Testing Guide](https://hono.dev/docs/guides/testing) - app.request() API, env bindings passing
- [Hono Testing Helper](https://hono.dev/docs/helpers/testing) - testClient() usage and limitations
- [Vitest Coverage Guide](https://vitest.dev/guide/coverage.html) - v8 provider setup, configuration

### Secondary (MEDIUM confidence)
- [vitest-coverage-report-action](https://github.com/davelosert/vitest-coverage-report-action) - CI coverage reporting
- [Vitest Config Reference](https://vitest.dev/config/coverage) - Coverage configuration options

### Tertiary (LOW confidence)
- WebSearch results on Supabase mocking patterns - community approaches, not official guidance

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Vitest is officially recommended by both Hono and Vite ecosystems
- Architecture: HIGH - app.request() pattern is from official Hono docs, verified
- Pitfalls: HIGH - Based on examining actual codebase structure (two DB adapters, Vite plugin conflicts, 25+ route modules)
- Supabase mocking: MEDIUM - Community patterns, no official "how to mock" guide from Supabase for Vitest

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (30 days - stable ecosystem)
