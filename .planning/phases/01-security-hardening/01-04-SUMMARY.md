---
phase: 01-security-hardening
plan: 04
subsystem: security
tags: [cors, admin, jwt, video, livekit]
dependency_graph:
  requires: ["01-01"]
  provides: ["restricted-cors", "admin-protected-analytics", "authenticated-video", "no-hardcoded-secrets"]
  affects: ["01-05", "02-*"]
tech_stack:
  added: []
  patterns: ["origin-allowlist-cors", "admin-middleware-guard", "authenticated-identity-enforcement"]
key_files:
  created: []
  modified:
    - src/index.tsx
    - vercel.json
    - src/api/auth.ts
    - src/api/analytics.ts
    - src/api/video.ts
decisions:
  - id: "01-04-01"
    decision: "CORS origin callback reads NODE_ENV and CORS_ORIGINS from c.env for Vercel per-request injection"
    context: "Hono cors middleware origin callback receives (origin, c) -- use c.env not process.env"
  - id: "01-04-02"
    decision: "Empty string returned for disallowed origins instead of null/undefined"
    context: "Hono cors expects string return; empty string effectively blocks the origin"
  - id: "01-04-03"
    decision: "Admin analytics page route (/admin/analytics) also protected with requireAuth + requireAdmin"
    context: "Page route was outside /api/* global auth scope -- added inline middleware"
metrics:
  duration: "~1.5 minutes"
  completed: "2026-03-05"
---

# Phase 1 Plan 4: CORS Admin Secrets Lockdown Summary

**One-liner:** Restricted CORS to production domains, admin-gated analytics, authenticated video tokens, removed hardcoded JWT fallback.

## What Was Done

### Task 1: Restrict CORS and remove hardcoded JWT secret
- Replaced wildcard `cors()` in `src/index.tsx` with origin allowlist: `bettertogether.app`, `www.bettertogether.app`, plus localhost in non-production
- Added `CORS_ORIGINS` env var support for additional origins
- Removed entire `headers` array from `vercel.json` (CORS now handled solely by Hono middleware)
- Replaced hardcoded JWT secret fallback `'better-together-secret-key-change-in-production'` with a throw if `JWT_SECRET` is missing
- **Commit:** `f6c0109`

### Task 2: Protect admin routes and video endpoints
- Added `requireAdmin()` middleware to all analytics API routes via `analyticsApi.use('/*', requireAdmin())`
- Added `requireAuth()` + `requireAdmin()` inline middleware to `/admin/analytics` page route (was unprotected since it's outside `/api/*`)
- Added participant ID validation in video `/token` endpoint -- rejects if `participantId` doesn't match authenticated user
- Changed LiveKit `AccessToken` identity from client-provided value to authenticated `userId`
- **Commit:** `7173b5b`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Admin analytics page route unprotected**
- **Found during:** Task 2
- **Issue:** `/admin/analytics` is a page route (not under `/api/*`), so the global auth middleware from Plan 01-01 did not cover it. Anyone could access the admin dashboard HTML.
- **Fix:** Added `requireAuth()` and `requireAdmin()` as inline middleware on the route handler.
- **Files modified:** `src/index.tsx`
- **Commit:** `7173b5b`

## Decisions Made

| ID | Decision | Context |
|----|----------|---------|
| 01-04-01 | CORS origin callback uses c.env for env vars | Hono cors middleware passes Context as second arg |
| 01-04-02 | Empty string for disallowed origins | Hono expects string return from origin callback |
| 01-04-03 | Admin page route also protected | /admin/analytics was outside /api/* auth scope |

## Verification Results

| Check | Result |
|-------|--------|
| `npm run build` | PASS (1,932 kB bundle) |
| No wildcard CORS in codebase | PASS |
| No hardcoded JWT secret | PASS |
| requireAdmin on analytics API | PASS |
| userId validation on video token | PASS |

## Next Phase Readiness

- CORS is locked down; `CORS_ORIGINS` env var allows adding Vercel preview URLs without code changes
- JWT_SECRET must be set in all environments or auth will throw
- Analytics routes now require admin role -- ensure admin users have `app_metadata.role = 'admin'` in Supabase
- Video token identity is now always the authenticated user ID -- frontend must not rely on custom participantId
