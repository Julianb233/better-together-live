---
phase: 10-mobile-readiness
plan: 01
subsystem: mobile-auth
tags: [supabase, react-native, auth, mobile]
dependencies:
  requires: [phase-2-auth-consolidation]
  provides: [supabase-mobile-client, bearer-token-api, useAuth-hook]
  affects: [10-02-screens-build]
tech-stack:
  added: ["@supabase/supabase-js@2.98.0", "react-native-url-polyfill@3.0.0"]
  patterns: ["Supabase client with AsyncStorage adapter", "Bearer token interceptor", "onAuthStateChange reactive auth"]
key-files:
  created:
    - mobile/src/lib/supabase.ts
  modified:
    - mobile/package.json
    - mobile/app.json
    - mobile/src/hooks/useAuth.ts
    - mobile/src/api/client.ts
    - mobile/src/types/index.ts
decisions:
  - id: "10-01-01"
    decision: "expo-constants for Supabase config (app.json extra)"
    reason: "Standard Expo pattern for runtime config, avoids dotenv in RN"
  - id: "10-01-02"
    decision: "Map Supabase User to app User type in useAuth"
    reason: "Screens expect app User shape; mapping in hook keeps screens unchanged"
  - id: "10-01-03"
    decision: "Remove createUser, storeUserId, getUserId from API client"
    reason: "Registration goes through Supabase Auth directly; token storage handled by Supabase SDK"
metrics:
  duration: ~2m
  completed: 2026-03-05
---

# Phase 10 Plan 01: Supabase Auth + API Client Summary

**One-liner:** Supabase JS client with AsyncStorage persistence, password-based useAuth hook, and Bearer token API interceptor replacing X-User-ID pattern.

## What Was Done

### Task 1: Install Supabase and create client
- Installed `@supabase/supabase-js` and `react-native-url-polyfill` (with --legacy-peer-deps for Expo 51 compatibility)
- Created `mobile/src/lib/supabase.ts` with AsyncStorage adapter, autoRefreshToken, persistSession, and detectSessionInUrl:false (critical for React Native)
- Added supabaseUrl and supabaseAnonKey placeholders in app.json expo.extra
- Config sourced via expo-constants at runtime

### Task 2: Rewrite useAuth hook and API client
- **useAuth hook:** Complete rewrite using Supabase Auth
  - `login(email, password)` via `signInWithPassword`
  - `register(email, password, name)` via `signUp` with user_metadata
  - `logout()` via `signOut`
  - `onAuthStateChange` listener for reactive state updates
  - Maps Supabase User to app User type (id, email, name from metadata)
  - Returns session field for JWT access
- **API client:** Bearer token interceptor
  - Gets session from `supabase.auth.getSession()` on every request
  - Sets `Authorization: Bearer {access_token}` header
  - Removed X-User-ID header pattern entirely
  - Removed `createUser`, `storeUserId`, `getUserId` methods
  - Kept profile cache helpers (storeUserData, getUserData, clearAuth)
- **AuthState type:** Added `session: Session | null` field

## Decisions Made

| ID | Decision | Rationale |
|----|----------|-----------|
| 10-01-01 | expo-constants for Supabase config | Standard Expo pattern, avoids dotenv complexity in RN |
| 10-01-02 | Map Supabase User to app User in useAuth | Screens expect app User shape; centralized mapping |
| 10-01-03 | Remove createUser/storeUserId/getUserId | Supabase SDK handles registration and token storage |

## Deviations from Plan

None - plan executed exactly as written.

## Commits

| Hash | Message |
|------|---------|
| 68db21b | feat(10-01): install Supabase client with AsyncStorage adapter |
| 78f04ef | feat(10-01): rewrite useAuth hook and API client for Supabase Auth |

## Next Phase Readiness

Plan 10-02 can proceed immediately. Screens need updating to use new `login(email, password)` and `register(email, password, name)` signatures.
