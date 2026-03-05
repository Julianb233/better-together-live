---
phase: 09-test-suite
plan: 02
subsystem: testing
tags: [integration-tests, auth, supabase-auth, mocking]
completed: 2026-03-05
duration: ~2m
requires: [09-01]
provides: [auth-integration-tests]
affects: [09-04]
tech-stack:
  added: []
  patterns: [module-level-vi-mock, mock-logger-middleware, app-request-integration]
key-files:
  created:
    - tests/integration/auth.test.ts
  modified: []
decisions:
  - id: "09-02-01"
    decision: "Mock c.var.logger via Hono middleware in test app"
    reason: "Auth routes use c.var.logger (from hono-pino) which is not available in test context"
  - id: "09-02-02"
    decision: "Use top-level await import for route module after vi.mock()"
    reason: "Vitest hoists vi.mock() but dynamic import ensures mocks are in place before route code executes"
metrics:
  tasks: 1/1
  tests-added: 17
  commits: 1
---

# Phase 9 Plan 2: Auth Integration Tests Summary

**One-liner:** 17 integration tests for signup/login/logout/forgot-password flows with mocked Supabase and logger middleware.

## What Was Done

### Task 1: Auth Integration Tests
- Created tests/integration/auth.test.ts with 17 tests across 4 route groups
- **POST /api/auth/signup** (6 tests): missing email/password/name validation, invalid email format, short password, successful signup with confirmation, Supabase error handling
- **POST /api/auth/login** (4 tests): missing email/password validation, successful login with session/token, wrong credentials returns 401
- **POST /api/auth/logout** (2 tests): successful logout, graceful handling when signOut throws
- **POST /api/auth/forgot-password** (4 tests): missing email, invalid format, successful reset, email enumeration prevention (returns 200 even for non-existent emails)
- Mock strategy: vi.mock() at module level for src/lib/supabase and src/lib/supabase/server, mock logger middleware injected into test app

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added mock logger middleware**
- **Found during:** Task 1
- **Issue:** Auth routes call c.var.logger.error() which is undefined without hono-pino middleware
- **Fix:** Added a middleware in createTestApp() that sets c.var.logger to mock functions
- **Files modified:** tests/integration/auth.test.ts

## Decisions Made

1. **[09-02-01] Mock logger via middleware** - Routes rely on c.var.logger from hono-pino. Rather than mocking the pino module, a simple middleware sets mock logger functions on the Hono context.
2. **[09-02-02] Top-level await import** - Used `await import()` for route module after `vi.mock()` to ensure mocks are established before route code loads.

## Verification Results

1. `npx vitest run tests/integration/auth.test.ts` passes all 17 tests
2. `npm test` passes (34 total: 17 unit + 17 auth integration)
3. Tests cover signup, login, logout, and password reset flows
4. No real Supabase calls made

## Commits

| Hash | Message |
|------|---------|
| 7ab2800 | test(09-02): add auth integration tests for signup, login, logout, forgot-password |

## Next Phase Readiness

Auth tests established. Pattern of mock-supabase + mock-logger + app.request() is reusable for 09-03 payment and API tests.
