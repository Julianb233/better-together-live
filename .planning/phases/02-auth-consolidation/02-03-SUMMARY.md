# Phase 2 Plan 3: Remove Custom JWT Auth & Consolidate Pages Summary

**One-liner:** Deleted custom JWT auth system entirely and migrated all API routes + 5 page files to cookie-based Supabase Auth

## What Was Done

### Task 1: Migrate API files from custom auth to Supabase middleware
- **users.ts**: Removed `extractToken`/`verifyToken` imports, replaced manual token verification in `/me` route with `c.get('userId')` from global Supabase middleware
- **social.ts**: Removed `requireAuth` import from `./auth`, removed inline `requireAuth` middleware from all 15 route handlers (global middleware already protects all `/api/*` routes)
- **discovery.ts**: Removed `verifyToken`/`extractToken` imports, deleted `getAuthUserId` helper function, replaced all 7 calls with `c.get('userId')`

### Task 2: Delete custom JWT files, update route mounts, update all pages
- **Deleted** `src/api/auth.ts` (custom JWT: generateAccessToken, verifyToken, hashPassword, extractToken, requireAuth, checkRateLimit)
- **Deleted** `src/api/auth-routes.ts` (custom JWT routes: /register, /login, /logout, /forgot-password, /reset-password, /refresh)
- **index.tsx**: Removed `authRoutes` import and mount, changed `supabaseAuth` mount from `/api/auth/supabase` to `/api/auth`, removed `/api/auth/supabase/*` from public whitelist
- **login-system.ts**: Login posts to `/api/auth/login` with `credentials: 'include'`, removed `localStorage.setItem('authToken')`. Register posts to `/api/auth/signup` with Supabase-compatible body. Forgot password uses `credentials: 'include'`.
- **login.ts**: Replaced simulated auth (localStorage `bt_authenticated`/`bt_user`) with real Supabase `/api/auth/login` call with `credentials: 'include'`
- **user-portal.ts**: Removed `getAuthToken()` (cookie+localStorage hybrid), removed `refreshAuthToken()` (localStorage token storage), simplified `apiCall()` to cookie-only with `credentials: 'include'`, logout calls `/api/auth/logout`
- **dashboard.ts**: Replaced `localStorage.getItem('bt_authenticated')` check with `fetch('/api/auth/me', { credentials: 'include' })`, logout calls `/api/auth/logout`
- **intimacy-challenges.ts**: Replaced `localStorage.getItem('authToken')` with async `/api/auth/me` check, removed `Authorization: Bearer` headers, added `credentials: 'include'` to all fetch calls, removed `localStorage.removeItem('authToken')` on 401
- **jose**: Kept in package.json (still used by `push-notifications.ts` for APNS JWT signing)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed stale /api/auth/supabase/ URLs after route mount change**
- **Found during:** Task 2 verification
- **Issue:** After mounting supabaseAuth at `/api/auth` instead of `/api/auth/supabase`, fetch calls in `login-system.ts` and `reset-password.ts` still referenced the old `/api/auth/supabase/forgot-password` and `/api/auth/supabase/reset-password` paths, which would 404
- **Fix:** Updated all `/api/auth/supabase/` references to `/api/auth/` in login-system.ts, reset-password.ts, and JSDoc comments in supabase-auth.ts
- **Files modified:** src/pages/login-system.ts, src/pages/reset-password.ts, src/api/supabase-auth.ts
- **Commit:** f30cfaa (included in Task 2 commit)

## Decisions Made

| Decision | Rationale |
|----------|-----------|
| Keep jose in package.json | push-notifications.ts uses it for APNS JWT signing -- not related to custom auth |
| Async checkAuth in intimacy-challenges | Changed from sync localStorage check to async /api/auth/me call since cookie validation requires server roundtrip |
| Demo mode passthrough in dashboard.ts | Kept `?demo=true` query param bypass for dashboard demo functionality |

## Artifacts

| File | Status | Purpose |
|------|--------|---------|
| src/api/auth.ts | DELETED | Custom JWT auth functions |
| src/api/auth-routes.ts | DELETED | Custom JWT route handlers |
| src/index.tsx | MODIFIED | Single supabaseAuth mount at /api/auth |
| src/api/users.ts | MODIFIED | Uses c.get('userId') from global middleware |
| src/api/social.ts | MODIFIED | No inline requireAuth, global middleware handles auth |
| src/api/discovery.ts | MODIFIED | Uses c.get('userId'), no getAuthUserId helper |
| src/pages/login-system.ts | MODIFIED | Cookie-based login/signup, no localStorage tokens |
| src/pages/login.ts | MODIFIED | Real Supabase auth, no localStorage bt_* |
| src/pages/user-portal.ts | MODIFIED | Cookie-only apiCall, no Bearer headers |
| src/pages/dashboard.ts | MODIFIED | /api/auth/me for auth check, cookie-based logout |
| src/pages/intimacy-challenges.ts | MODIFIED | credentials: include, no localStorage tokens |
| src/pages/reset-password.ts | MODIFIED | Fixed /api/auth/supabase/ to /api/auth/ |
| src/api/supabase-auth.ts | MODIFIED | Updated JSDoc comments for new mount path |

## Metrics

- **Duration:** ~4 minutes
- **Completed:** 2026-03-05
- **Lines removed:** ~727 (custom JWT auth system)
- **Lines added:** ~112 (cookie-based replacements)
- **Files deleted:** 2
- **Files modified:** 11
