---
phase: 02-auth-consolidation
plan: 01
subsystem: auth
tags: [supabase-ssr, cookies, middleware, token-refresh]
depends_on:
  requires: [01-01]
  provides: ["@supabase/ssr cookie integration", "cookie relay middleware", "legacy cookie cleanup"]
  affects: [02-02, 02-03]
tech-stack:
  added: []
  patterns: ["@supabase/ssr getAll/setAll cookie pattern", "cookie relay middleware"]
key-files:
  created: []
  modified:
    - src/lib/supabase/server.ts
    - src/lib/supabase/middleware.ts
    - src/lib/supabase/index.ts
    - src/index.tsx
    - src/api/supabase-auth.ts
decisions:
  - id: "02-01-01"
    decision: "Store @supabase/ssr response headers on Hono context via c.set('supabaseResponseHeaders', headers)"
    rationale: "Allows cookie relay middleware to apply Set-Cookie headers after route handler runs"
  - id: "02-01-02"
    decision: "Rename createServerClient to createAnonClient to avoid name collision with @supabase/ssr import"
    rationale: "Both the old plain client and @supabase/ssr export createServerClient; renaming avoids confusion"
metrics:
  duration: "~2 minutes"
  completed: "2026-03-05"
---

# Phase 2 Plan 1: SSR Client Migration Summary

**One-liner:** Migrated Supabase client from manual setSession to @supabase/ssr getAll/setAll with cookie relay middleware for automatic token refresh.

## What Was Done

### Task 1: Migrate server.ts to @supabase/ssr createServerClient
- Rewrote `createClientWithContext` to use `@supabase/ssr`'s `createServerClient` with `getAll`/`setAll` cookie pattern
- `getAll` uses `parseCookieHeader` to read cookies from the request
- `setAll` serializes cookies via `serializeCookieHeader` and appends to a `Headers` object
- Response headers stored on Hono context via `c.set('supabaseResponseHeaders', responseHeaders)`
- Renamed `createServerClient` (plain anon client) to `createAnonClient` to avoid name collision
- Updated `supabase-auth.ts` to import `createAnonClient`
- Removed `setSession()` call -- token refresh is now automatic
- Removed `getCookie` import from hono/cookie (no longer needed in server.ts)
- Kept `setSupabaseAuthCookies` and `clearSupabaseAuthCookies` for backward compatibility (removed in 02-03)

### Task 2: Add cookie relay middleware and legacy cookie cleanup
- Added `supabaseCookieRelay()` middleware that applies @supabase/ssr response cookies to the browser after route handlers run
- Added `clearLegacyCookies()` middleware that removes old `bt_access_token`/`bt_refresh_token` cookies
- Both exported from barrel `index.ts`
- Applied in `index.tsx` with correct ordering: CORS -> clearLegacyCookies -> supabaseCookieRelay -> requireAuth

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

1. `npm run build` -- PASSES (2.56s, 403 modules)
2. `@supabase/ssr` imports present in server.ts (createServerClient as createSSRClient, parseCookieHeader, serializeCookieHeader)
3. No `setSession` calls remain in server.ts
4. `supabaseCookieRelay` applied in index.tsx
5. `clearLegacyCookies` applied in index.tsx
6. `parseCookieHeader` used in server.ts getAll callback

## Next Phase Readiness

Plan 02-02 (consolidate dual requireAuth) can proceed. The @supabase/ssr foundation is in place:
- `createClientWithContext` now handles token refresh automatically
- Cookie relay middleware ensures refreshed tokens reach the browser
- All existing auth middleware (requireAuth, optionalAuth) continues to work via createClientWithContext
