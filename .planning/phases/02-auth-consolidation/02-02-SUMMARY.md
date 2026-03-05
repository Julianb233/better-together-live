---
phase: 02-auth-consolidation
plan: 02
subsystem: auth
tags: [password-reset, supabase-auth, email, pkce]
dependency-graph:
  requires: [02-01]
  provides: [password-reset-flow, auth-callback-endpoint, reset-password-page]
  affects: [02-03]
tech-stack:
  added: []
  patterns: [pkce-code-exchange, recovery-session-tokens]
key-files:
  created:
    - src/pages/reset-password.ts
  modified:
    - src/api/supabase-auth.ts
    - src/pages/login-system.ts
    - src/index.tsx
decisions:
  - id: 02-02-01
    decision: "Use PKCE code exchange via /callback endpoint rather than direct token in URL hash"
    reason: "Server-rendered pages cannot read URL hash fragments; PKCE is the recommended Supabase SSR flow"
  - id: 02-02-02
    decision: "Pass access_token and refresh_token as query params from callback to reset page"
    reason: "Server-rendered page needs tokens accessible via URL to establish recovery session"
  - id: 02-02-03
    decision: "Set auth cookies after successful password reset"
    reason: "User should stay logged in after resetting their password without needing to log in again"
metrics:
  duration: ~4m
  completed: 2026-03-05
---

# Phase 2 Plan 2: Password Reset Email Flow Summary

**One-liner:** End-to-end password reset via Supabase Auth PKCE flow with callback endpoint, recovery session management, and reset password page

## What Was Done

### Task 1: Fix password reset endpoints and add auth callback route
- Added GET `/api/auth/supabase/callback` endpoint that exchanges PKCE codes from email links for sessions
- Updated `forgot-password` endpoint `redirectTo` to point to the callback endpoint instead of the reset page directly
- Updated `reset-password` endpoint to accept `accessToken` and `refreshToken` in the request body, establish a recovery session via `setSession()`, then call `updateUser()` to change the password
- Set auth cookies after successful password reset so the user stays logged in
- Created `/auth/reset-password` page (`src/pages/reset-password.ts`) with new password form, confirm password validation, loading states, and error/success messages
- Added `/auth/reset-password` route in `src/index.tsx`

### Task 2: Improve forgot password UI on login page
- Pre-fill forgot password email field from login form email value
- Replaced `alert()` with inline success message in green notification box
- Fixed fetch URL from `/api/auth/forgot-password` to `/api/auth/supabase/forgot-password`
- Added loading spinner state to submit button during request
- Always shows generic success message to prevent email enumeration

## Flow Diagram

```
1. User clicks "Forgot password?" on login page
2. User enters email, submits form
3. POST /api/auth/supabase/forgot-password -> calls resetPasswordForEmail()
4. Supabase sends email with link to /api/auth/supabase/callback?code=...
5. GET /api/auth/supabase/callback -> exchangeCodeForSession(code)
6. If recovery: redirect to /auth/reset-password?access_token=...&refresh_token=...
7. User enters new password on reset page
8. POST /api/auth/supabase/reset-password with { newPassword, accessToken, refreshToken }
9. Server: setSession() -> updateUser({ password }) -> set auth cookies
10. User redirected to login page (already authenticated via cookies)
```

## Deviations from Plan

### Auto-added (Rule 2 - Missing Critical)

**1. Created reset password page (src/pages/reset-password.ts)**
- **Found during:** Task 1
- **Issue:** The callback endpoint redirects to `/auth/reset-password` but no such page existed. The existing `password-reset.ts` page uses a code-based flow incompatible with Supabase PKCE.
- **Fix:** Created new `reset-password.ts` with proper token-based flow, confirm password validation, and error handling
- **Files created:** src/pages/reset-password.ts
- **Files modified:** src/index.tsx (added import and route)
- **Commit:** bb0e0f6

**2. Fixed forgot-password fetch URL in login page**
- **Found during:** Task 2
- **Issue:** Login page called `/api/auth/forgot-password` but the endpoint is at `/api/auth/supabase/forgot-password`
- **Fix:** Updated fetch URL to correct path
- **Commit:** c6be8be

## Pending Manual Steps

### Supabase SMTP Configuration (Required for emails to send)

The code changes are complete, but Supabase needs to be configured to use Resend as its SMTP provider. Without this, password reset emails will not be delivered.

**Steps:**
1. Go to **Supabase Dashboard > Project Settings > Authentication > SMTP Settings**
2. Enable custom SMTP
3. Configure:
   - Host: `smtp.resend.com`
   - Port: `465`
   - Username: `resend`
   - Password: RESEND_API_KEY (from 1Password or environment)
   - Sender email: `noreply@<verified-domain>` (must be verified in Resend)
   - Sender name: `Better Together`

4. In **Resend Dashboard > Domains**: Ensure the sender domain is verified

**Note:** Without SMTP configured, the API endpoints work correctly (Supabase accepts the request) but no email is actually delivered.

## Decisions Made

| ID | Decision | Reason |
|----|----------|--------|
| 02-02-01 | PKCE code exchange via /callback | Server-rendered pages cannot read URL hash fragments |
| 02-02-02 | Tokens as query params to reset page | Recovery session needs tokens accessible to page JS |
| 02-02-03 | Set cookies after password reset | User should stay logged in after resetting password |

## Next Phase Readiness

- Password reset flow is code-complete
- Blocked on manual Supabase SMTP configuration for actual email delivery
- 02-03 (auth route consolidation) can proceed independently
