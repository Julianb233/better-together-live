---
phase: 10-mobile-readiness
plan: 02
subsystem: mobile-screens
tags: [react-native, auth-screens, websocket, typescript]
dependencies:
  requires: [10-01-supabase-auth]
  provides: [password-auth-screens, jwt-websocket, clean-build]
  affects: []
tech-stack:
  added: []
  patterns: ["Password-based auth screens", "JWT WebSocket authentication", "Auth-state-driven navigation"]
key-files:
  created: []
  modified:
    - mobile/src/screens/LoginScreen.tsx
    - mobile/src/screens/RegisterScreen.tsx
    - mobile/src/utils/websocket.ts
    - mobile/src/api/client.ts
    - mobile/src/screens/OnboardingScreen.tsx
decisions:
  - id: "10-02-01"
    decision: "Forgot Password redirects to web app"
    reason: "Full mobile password reset flow is v2 scope"
  - id: "10-02-02"
    decision: "Restore getUserId() as Supabase session wrapper"
    reason: "9 screens use getUserId() -- wrapping Supabase session is cleaner than updating all screens"
  - id: "10-02-03"
    decision: "OnboardingScreen uses updateUser instead of createUser"
    reason: "User is already authenticated via Supabase Auth before reaching onboarding"
metrics:
  duration: ~2m
  completed: 2026-03-05
---

# Phase 10 Plan 02: Screen Updates + Build Verification Summary

**One-liner:** Password-based Login/Register screens with email confirmation handling, JWT-authenticated WebSocket, and clean TypeScript build (3 pre-existing LiveKit errors only).

## What Was Done

### Task 1: Update LoginScreen and RegisterScreen
- **LoginScreen:** Replaced name field with password field (secureTextEntry), calls `login(email, password)`, added Forgot Password link (redirects to web app)
- **RegisterScreen:** Added password field, removed phone field, calls `register(email, password, name)`, handles `confirmationRequired` with email alert, removed `navigation.replace('MainTabs')` (auth state drives navigation via AppNavigator)

### Task 2: Fix WebSocket auth and verify build
- **WebSocket:** Replaced AsyncStorage userId lookup with `supabase.auth.getSession()`, sends JWT access_token as `?token=` query param instead of `?userId=`
- **Build verification:** `tsc --noEmit` passes with only 3 pre-existing LiveKit type errors (AudioTrack, TrackToggle exports and livekit-client module -- unrelated to auth)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Restored getUserId() as Supabase session wrapper**
- **Found during:** Task 2 (build verification)
- **Issue:** 9 screens across the app call `apiClient.getUserId()` which was removed in Plan 10-01
- **Fix:** Added `getUserId()` back to ApiClient that reads from `supabase.auth.getSession()` instead of AsyncStorage
- **Files modified:** mobile/src/api/client.ts

**2. [Rule 3 - Blocking] Fixed OnboardingScreen createUser/storeUserId**
- **Found during:** Task 2 (build verification)
- **Issue:** OnboardingScreen called removed `createUser()` and `storeUserId()` methods
- **Fix:** Replaced with `getUserId()` + `updateUser()` pattern (user is already authenticated before onboarding)
- **Files modified:** mobile/src/screens/OnboardingScreen.tsx

## Commits

| Hash | Message |
|------|---------|
| 95c7c20 | feat(10-02): update Login and Register screens for password-based auth |
| 013450c | feat(10-02): fix WebSocket auth, restore getUserId helper, fix onboarding |

## Pre-existing Issues (Not Fixed)

- 3 TypeScript errors in VideoCallScreen.tsx: LiveKit type exports (AudioTrack, TrackToggle, livekit-client module) -- requires LiveKit package version alignment, not auth-related

## Next Phase Readiness

Phase 10 complete. Mobile app has:
- Supabase Auth with real password-based login/registration
- Bearer token API interceptor (replaces X-User-ID)
- JWT-authenticated WebSocket (replaces raw userId)
- Clean TypeScript build (auth-related files all compile)
