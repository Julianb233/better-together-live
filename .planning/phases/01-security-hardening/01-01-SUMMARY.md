---
phase: 01-security-hardening
plan: 01
subsystem: auth-middleware
tags: [supabase, auth, middleware, hono, security]
dependency_graph:
  requires: []
  provides: [global-auth-middleware, requireAdmin-middleware]
  affects: [01-02, 01-03, 01-04, 01-05]
tech_stack:
  added: []
  patterns: [hono-except-combinator, per-request-env-injection]
key_files:
  created: []
  modified:
    - src/lib/supabase/middleware.ts
    - src/lib/supabase/index.ts
    - src/index.tsx
decisions:
  - id: SEC-01-ENV
    description: "Read Supabase env from c.env at request time instead of at registration time"
    rationale: "Vercel provides env per-request, not at module initialization"
  - id: SEC-01-EXCEPT
    description: "Use hono/combine except() for public route whitelist"
    rationale: "Clean declarative pattern, easy to audit which routes are public"
metrics:
  duration: ~3 minutes
  completed: 2026-03-05
---

# Phase 1 Plan 1: Global Auth Middleware Summary

**One-liner:** Supabase auth middleware reading env from c.env, applied globally via hono/combine except() with public route whitelist

## What Was Done

### Task 1: Refactor requireAuth to read env from request context
**Commit:** fd42d08

- Removed `env: SupabaseEnv` parameter from `requireAuth()` -- now reads `c.env.SUPABASE_URL`, `c.env.SUPABASE_ANON_KEY`, `c.env.SUPABASE_SERVICE_ROLE_KEY` at request time
- Same refactor applied to `optionalAuth()` -- no longer takes env parameter
- Added `requireAdmin()` middleware that checks `user.app_metadata?.role === 'admin'`, returns 403 if not admin
- Exported `requireAdmin` from barrel file `src/lib/supabase/index.ts`
- Removed import of `SupabaseEnv` type from middleware (no longer needed)

### Task 2: Apply global auth middleware with except combinator
**Commit:** e58a6eb

- Added `import { except } from 'hono/combine'` and `import { requireAuth } from './lib/supabase/middleware'` to index.tsx
- Applied `app.use('/api/*', except([...], requireAuth()))` after CORS middleware, before route definitions
- Public route whitelist: `/api/auth/*`, `/api/auth/supabase/*`, `/api/payments/webhook`, `/api/health`
- Build passes successfully (1,930 kB SSR bundle)

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Read env from c.env at request time | Vercel injects env per-request, not at module init |
| Use hono/combine except() pattern | Declarative whitelist, easy to audit public routes |
| Keep existing auth.ts requireAuth untouched | It's a separate JWT-based auth used by social.ts/messaging.ts -- will be consolidated in Phase 2 |

## Verification Results

1. `npm run build` -- passes (1,930.18 kB bundle)
2. All three middleware functions present in middleware.ts (requireAuth, optionalAuth, requireAdmin)
3. `except` combinator used in index.tsx with public route whitelist
4. No remaining `requireAuth(env)` calls with env parameter in src/

## Next Phase Readiness

- requireAdmin() is available for Plan 01-04 (admin route protection)
- The custom JWT `requireAuth` in `src/api/auth.ts` (used by social.ts, messaging.ts) still exists -- should be consolidated with the Supabase version in a future plan
- All subsequent security plans can build on this global middleware foundation
