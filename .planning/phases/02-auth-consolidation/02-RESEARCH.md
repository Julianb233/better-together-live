# Phase 2: Auth Consolidation - Research

**Researched:** 2026-03-05
**Domain:** Supabase Auth migration, cookie-based sessions, custom JWT removal (Hono 4.9)
**Confidence:** HIGH

## Summary

The codebase currently runs two parallel auth systems: a custom JWT system (`src/api/auth.ts` + `src/api/auth-routes.ts`) using `jose` and SHA-256 password hashing, and a Supabase Auth system (`src/api/supabase-auth.ts` + `src/lib/supabase/`). Both are mounted in `src/index.tsx`. Phase 1 will have already applied the Supabase `requireAuth` middleware globally. This phase removes the custom JWT system entirely and consolidates on Supabase Auth as the sole authentication provider.

The current Supabase client (`src/lib/supabase/server.ts`) uses raw `@supabase/supabase-js` `createClient` with manual cookie handling via `hono/cookie`. Although `@supabase/ssr` is installed (v0.8.0), it is never imported anywhere. The proper approach is to migrate to `@supabase/ssr`'s `createServerClient` with its `getAll`/`setAll` cookie pattern, which handles token refresh and cookie chunking automatically. Additionally, Supabase's built-in SMTP must be configured with Resend for email verification and password reset emails.

**Primary recommendation:** Replace all custom JWT code paths with Supabase Auth equivalents. Migrate `src/lib/supabase/server.ts` to use `@supabase/ssr`'s `createServerClient`. Configure Resend as Supabase's SMTP provider in the Supabase dashboard. Update the login page to call Supabase auth endpoints only.

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | ^2.89.0 | Supabase client (auth + DB) | Already in use, primary auth provider |
| @supabase/ssr | ^0.8.0 | Server-side cookie auth | Installed but NOT used. Handles token refresh, cookie chunking, PKCE flow automatically |
| hono | ^4.9.2 | Web framework | Already in use |
| resend | ^6.6.0 | Transactional email | Already installed, used for partner invites etc. |

### To Remove
| Library | Current File | Reason |
|---------|-------------|--------|
| jose | src/api/auth.ts | Custom JWT replaced by Supabase Auth tokens |

**Note:** `jose` appears only in `src/api/auth.ts`. After consolidation, it can be removed from `package.json` unless other code depends on it. Verify with `grep -r "jose" src/` before removal.

### Not Needed
| Problem | Don't Install | Use Instead |
|---------|--------------|-------------|
| Password hashing | bcrypt, argon2 | Supabase Auth handles password storage internally |
| Token refresh logic | custom code | `@supabase/ssr` handles this via `getAll`/`setAll` cookie pattern |
| Email verification flow | custom email + token DB table | Supabase Auth built-in email verification (configure SMTP) |
| Password reset flow | custom reset token generation | `supabase.auth.resetPasswordForEmail()` + custom SMTP |
| Rate limiting for auth | custom Map-based rate limiter | Supabase Auth has built-in rate limiting (configurable in dashboard) |

**Installation:** No new packages needed. Just use `@supabase/ssr` which is already in `package.json`.

## Architecture Patterns

### Pattern 1: Migrate to @supabase/ssr createServerClient

**What:** Replace the current manual `createClient` + `hono/cookie` approach in `src/lib/supabase/server.ts` with `@supabase/ssr`'s `createServerClient` that manages cookie serialization automatically.

**Why:** The current `createClientWithContext()` manually reads `sb-access-token` and `sb-refresh-token` cookies, then calls `setSession()`. This does NOT handle: (a) token refresh on expiry, (b) cookie chunking for large JWTs, (c) proper PKCE flow. The `@supabase/ssr` package handles all of this.

**Current (broken):**
```typescript
// src/lib/supabase/server.ts - CURRENT
import { createClient } from '@supabase/supabase-js'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'

export function createClientWithContext(c: Context, env: SupabaseEnv) {
  const accessToken = getCookie(c, 'sb-access-token')
  const refreshToken = getCookie(c, 'sb-refresh-token')
  const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  })
  if (accessToken && refreshToken) {
    supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
  }
  return supabase
}
```

**Target (correct):**
```typescript
// src/lib/supabase/server.ts - TARGET
import { createServerClient, parseCookieHeader } from '@supabase/ssr'

export function createClientWithContext(c: Context, env: SupabaseEnv) {
  const headers = new Headers()

  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(c.req.header('Cookie') ?? '')
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          // Serialize and append to response headers
          const cookieStr = `${name}=${value}; Path=${options?.path ?? '/'}; HttpOnly; Secure; SameSite=Lax; Max-Age=${options?.maxAge ?? 3600}`
          headers.append('Set-Cookie', cookieStr)
        })
      }
    }
  })

  // Store headers ref so middleware can apply them to response
  c.set('supabaseHeaders', headers)
  return supabase
}
```

**Source:** [Supabase SSR creating-a-client docs](https://supabase.com/docs/guides/auth/server-side/creating-a-client)

### Pattern 2: Unified Auth Routes (Remove Dual Mount)

**What:** Collapse `/api/auth/*` (custom JWT) and `/api/auth/supabase/*` into a single `/api/auth/*` mount using only Supabase Auth.

**Current mount in index.tsx:**
```typescript
app.route('/api/auth', authRoutes)           // Legacy JWT-based
app.route('/api/auth/supabase', supabaseAuth) // Supabase Auth
```

**Target mount:**
```typescript
app.route('/api/auth', supabaseAuth)  // Supabase Auth only
// authRoutes import REMOVED
```

**Endpoints to consolidate:**
| Old Custom JWT Route | New Supabase Route | Notes |
|---------------------|-------------------|-------|
| POST /api/auth/register | POST /api/auth/signup | Supabase handles user creation |
| POST /api/auth/login | POST /api/auth/login | Already exists in supabase-auth.ts |
| POST /api/auth/logout | POST /api/auth/logout | Already exists in supabase-auth.ts |
| POST /api/auth/forgot-password | POST /api/auth/forgot-password | Already exists, uses resetPasswordForEmail |
| POST /api/auth/reset-password | POST /api/auth/reset-password | Already exists, uses updateUser |
| POST /api/auth/refresh | POST /api/auth/refresh | Already exists, uses refreshSession |
| GET /api/auth/me | GET /api/auth/me | Already exists in supabase-auth.ts |
| POST /api/auth/signup (alias) | REMOVED | Covered by /signup |

### Pattern 3: Login Page Consolidation

**What:** Update `src/pages/login-system.ts` to call Supabase auth endpoints exclusively.

**Current state:** The login page calls `/api/auth/login` and `/api/auth/register` (custom JWT endpoints). It also stores `authToken` in `localStorage`.

**Required changes:**
1. Change `handleLogin()` to POST to `/api/auth/login` (Supabase route, same path after consolidation)
2. Change `handleRegister()` to POST to `/api/auth/signup` with Supabase-expected fields
3. Remove `localStorage.setItem('authToken', ...)` -- sessions are in HTTP-only cookies
4. Remove `localStorage.getItem('authToken')` checks in `user-portal.ts`, `intimacy-challenges.ts`
5. Auth state check: use `/api/auth/me` endpoint instead of localStorage

### Pattern 4: Update Downstream Consumers of Custom Auth

**What:** Files that import from `./auth` (the custom JWT module) must switch to Supabase middleware.

**Files importing custom auth:**
| File | Imports | Migration |
|------|---------|-----------|
| `src/api/auth-routes.ts` | Everything from `./auth` | DELETE entire file |
| `src/api/users.ts` | `extractToken`, `verifyToken` | Use `c.get('userId')` from Supabase middleware |
| `src/api/social.ts` | `requireAuth` | Use `requireAuth` from `../lib/supabase/middleware` |
| `src/api/discovery.ts` | `verifyToken`, `extractToken` | Use `c.get('userId')` from Supabase middleware |
| `src/api/messaging.ts` | `requireAuth`, `checkRateLimit` | Use Supabase `requireAuth`; remove custom rate limiting |

**Pages storing auth in localStorage:**
| Page | Current Pattern | Migration |
|------|----------------|-----------|
| `src/pages/login-system.ts` | `localStorage.setItem('authToken', data.token)` | Remove; cookies handle session |
| `src/pages/user-portal.ts` | `localStorage.getItem('authToken')` for API calls | Remove Bearer header; cookies sent automatically |
| `src/pages/intimacy-challenges.ts` | `localStorage.getItem('authToken')` | Remove; use cookie-based auth |
| `src/pages/login.ts` | `localStorage.setItem('bt_authenticated', 'true')` | Remove; check session via /api/auth/me |
| `src/pages/dashboard.ts` | `localStorage.getItem('bt_authenticated')` | Remove; redirect via server-side session check |

### Anti-Patterns to Avoid
- **Using `getSession()` for authorization:** `getSession()` reads cookies without verification. Use `getUser()` which contacts the Auth server. The existing middleware already does this correctly.
- **Storing tokens in localStorage:** The whole point of HTTP-only cookies is preventing XSS from accessing tokens. Never store Supabase tokens in localStorage.
- **Using `setSession()` to restore from cookies:** This is what the current code does. It's fragile and doesn't handle refresh. Use `@supabase/ssr` instead.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Password hashing | SHA-256 (current `hashPassword()`) | Supabase Auth internal bcrypt | SHA-256 is NOT a password hash. It's a fast hash. Supabase uses bcrypt with salting. |
| Token refresh | Manual cookie read + setSession | `@supabase/ssr` createServerClient | Handles refresh, chunking, PKCE automatically |
| Email verification | Custom token + DB table + manual email | Supabase Auth email verification | Built-in flow with configurable templates |
| Password reset | Custom reset token + DB storage | `supabase.auth.resetPasswordForEmail()` | Supabase manages token lifecycle, expiry |
| Rate limiting on auth | In-memory Map (current `checkRateLimit()`) | Supabase Auth built-in rate limits | Current implementation doesn't survive server restart; Supabase rate limiting is persistent |
| Cookie management | Manual setCookie/getCookie for tokens | `@supabase/ssr` cookie handlers | Handles chunking for large JWTs, proper serialization |

**Key insight:** The current custom auth system has a critical security flaw: `hashPassword()` uses SHA-256 without salt, which is trivially crackable. Supabase Auth uses bcrypt. Migration eliminates this vulnerability.

## Common Pitfalls

### Pitfall 1: Forgetting to Remove localStorage Auth Checks
**What goes wrong:** After moving to HTTP-only cookies, pages still check `localStorage.getItem('authToken')` and fail to authenticate.
**Why it happens:** The login page and portal have hardcoded localStorage patterns across 5+ files.
**How to avoid:** Search for ALL localStorage auth references: `bt_access_token`, `bt_refresh_token`, `authToken`, `bt_authenticated`. Replace with server-side session checks or `/api/auth/me` calls.
**Warning signs:** Users can't stay logged in after page refresh, or see "Not authenticated" despite being logged in.

### Pitfall 2: Not Applying Response Cookies from @supabase/ssr
**What goes wrong:** Token refresh works internally but the refreshed cookies never reach the browser.
**Why it happens:** `@supabase/ssr`'s `setAll` callback writes cookies, but in Hono you must explicitly merge those headers into the response.
**How to avoid:** Create middleware that captures `setAll` cookies and applies them to the Hono response after the route handler runs.
**Warning signs:** Sessions expire after exactly 1 hour (access token TTL) instead of refreshing.

### Pitfall 3: Breaking the /api/auth/* Route Path
**What goes wrong:** Frontend calls `/api/auth/login` but the Supabase routes are still mounted at `/api/auth/supabase/login`.
**Why it happens:** Changing the route mount without updating all frontend fetch calls.
**How to avoid:** Mount supabaseAuth at `/api/auth` (replacing authRoutes), then verify all frontend fetch URLs match.
**Warning signs:** 404 errors on login/signup.

### Pitfall 4: Dual Cookie Cleanup
**What goes wrong:** Old custom JWT cookies (`bt_access_token`, `bt_refresh_token`) persist alongside new Supabase cookies (`sb-access-token`, `sb-refresh-token`), causing confused auth state.
**Why it happens:** Existing users have old cookies that are never cleared.
**How to avoid:** Add a one-time cleanup middleware that clears `bt_access_token` and `bt_refresh_token` cookies on any request. Remove after a reasonable rollover period.
**Warning signs:** Auth middleware reads old cookies and fails.

### Pitfall 5: Supabase SMTP Not Configured
**What goes wrong:** Email verification and password reset silently fail because Supabase's default email provider has strict rate limits (30/hour for custom SMTP, much less for built-in).
**Why it happens:** Supabase dashboard SMTP configuration is a manual step outside the codebase.
**How to avoid:** Configure Resend SMTP in the Supabase dashboard BEFORE deploying this phase. SMTP settings: host=`smtp.resend.com`, port=`465`, username=`resend`, password=`<RESEND_API_KEY>`.
**Warning signs:** Users sign up but never receive verification email.

### Pitfall 6: User ID Format Mismatch
**What goes wrong:** The custom auth system generates user IDs with `generateId()` (likely nanoid/ulid), but Supabase Auth uses UUIDs. Existing `users` table rows have non-UUID IDs.
**Why it happens:** Supabase Auth creates users with UUID primary keys in `auth.users`. The app's `users` table may have different ID formats.
**How to avoid:** Check how `users` table IDs correlate with `auth.users` IDs. New Supabase signups create entries in `auth.users` with UUID. The app `users` table may need a migration to link `auth.users.id` or a trigger to sync.
**Warning signs:** `c.get('userId')` returns a UUID but the `users` table lookup by ID fails.

## Code Examples

### Example 1: Supabase SSR Client for Hono
```typescript
// src/lib/supabase/server.ts (replacement)
import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr'
import type { Context } from 'hono'

export interface SupabaseEnv {
  SUPABASE_URL: string
  SUPABASE_ANON_KEY: string
  SUPABASE_SERVICE_ROLE_KEY?: string
}

export function createClientWithContext(c: Context, env: SupabaseEnv) {
  const responseHeaders = new Headers()

  const supabase = createServerClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return parseCookieHeader(c.req.header('Cookie') ?? '')
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          responseHeaders.append(
            'Set-Cookie',
            serializeCookieHeader(name, value, {
              ...options,
              httpOnly: true,
              secure: true,
              sameSite: 'lax',
              path: '/'
            })
          )
        })
      }
    }
  })

  // Store for middleware to apply to response
  c.set('supabaseResponseHeaders', responseHeaders)
  return supabase
}
```

### Example 2: Middleware to Apply Supabase Response Cookies
```typescript
// Middleware to ensure Supabase cookie refreshes reach the browser
export function supabaseCookieMiddleware() {
  return async (c: Context, next: Next) => {
    await next()

    // Apply any cookies that Supabase set during the request
    const headers = c.get('supabaseResponseHeaders') as Headers | undefined
    if (headers) {
      headers.forEach((value, key) => {
        c.header(key, value, { append: true })
      })
    }
  }
}
```

### Example 3: Cleaning Up Old Cookies
```typescript
// One-time migration middleware - remove after rollover
function clearLegacyCookies() {
  return async (c: Context, next: Next) => {
    const hasBtCookies = c.req.header('Cookie')?.includes('bt_access_token')
    if (hasBtCookies) {
      deleteCookie(c, 'bt_access_token', { path: '/' })
      deleteCookie(c, 'bt_refresh_token', { path: '/' })
    }
    await next()
  }
}
```

### Example 4: Auth State Check Without localStorage
```typescript
// In server-rendered page JS (replaces localStorage check)
async function checkAuthState() {
  try {
    const response = await fetch('/api/auth/me', { credentials: 'include' })
    if (response.ok) {
      const data = await response.json()
      return data.user
    }
    return null
  } catch {
    return null
  }
}

// On page load
const user = await checkAuthState()
if (!user) {
  window.location.href = '/login'
}
```

### Example 5: Supabase SMTP Configuration (Dashboard)
```
# Supabase Dashboard > Project Settings > Authentication > SMTP Settings
Host:        smtp.resend.com
Port:        465
Username:    resend
Password:    <RESEND_API_KEY from env/1Password>
Sender email: noreply@better-together.app  (must be verified domain in Resend)
Sender name:  Better Together
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@supabase/auth-helpers-*` | `@supabase/ssr` | Mid 2024 | Unified SSR package for all frameworks |
| `getSession()` for auth checks | `getUser()` for auth checks | 2024 | `getSession()` reads unverified cookies; `getUser()` validates with server |
| Manual cookie set/get | `getAll`/`setAll` cookie pattern | `@supabase/ssr` v0.3+ | Handles chunking for large tokens automatically |
| `parseCookieHeader`/`serializeCookieHeader` | Available in `@supabase/ssr` | v0.5+ | Framework-agnostic cookie utilities |

**Deprecated/outdated:**
- `supabase.auth.setSession()` for server-side: Use `@supabase/ssr` `createServerClient` instead
- `@supabase/auth-helpers-nextjs` etc.: Replaced by unified `@supabase/ssr`
- `getSession()` for authorization: Use `getUser()` -- `getSession()` is unverified

## Open Questions

1. **User ID migration:**
   - What we know: Custom auth uses `generateId()` for user IDs in the `users` table. Supabase Auth uses UUIDs in `auth.users`.
   - What's unclear: Are existing users in the `users` table linked to `auth.users`? Or are they completely separate?
   - Recommendation: Audit the `users` table ID format. If existing users need to be migrated, a database migration creating entries in `auth.users` (via admin API) and updating `users.id` may be needed. This may be deferred to Phase 3 (Database Consolidation).

2. **`serializeCookieHeader` availability:**
   - What we know: `@supabase/ssr` v0.5+ exports `parseCookieHeader` and `serializeCookieHeader`.
   - What's unclear: The installed version is `^0.8.0` which should include it, but verify after `npm install`.
   - Recommendation: Import and test. If not available, use manual cookie serialization as shown in Example 1 fallback.

3. **Resend domain verification:**
   - What we know: Supabase SMTP needs a verified sender domain in Resend.
   - What's unclear: Is `better-together.app` or similar domain verified in Resend?
   - Recommendation: Check Resend dashboard for verified domains before configuring SMTP.

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `src/api/auth.ts`, `src/api/auth-routes.ts`, `src/api/supabase-auth.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`, `src/pages/login-system.ts`
- [Supabase SSR creating-a-client docs](https://supabase.com/docs/guides/auth/server-side/creating-a-client) - createServerClient pattern with getAll/setAll
- [Supabase SMTP configuration](https://supabase.com/docs/guides/auth/auth-smtp) - Custom SMTP setup
- [Resend + Supabase SMTP](https://resend.com/docs/send-with-supabase-smtp) - Exact SMTP credentials: host=smtp.resend.com, port=465, user=resend

### Secondary (MEDIUM confidence)
- [Supabase SSR advanced guide](https://supabase.com/docs/guides/auth/server-side/advanced-guide) - Cookie storage pattern, session refresh
- [Supabase Send Email Hook](https://supabase.com/docs/guides/auth/auth-hooks/send-email-hook) - Alternative to SMTP for custom email templates
- [Supabase + Hono quickstart](https://supabase.com/docs/guides/getting-started/quickstarts/hono) - Official Hono integration reference

### Tertiary (LOW confidence)
- `@supabase/ssr` v0.8.0 specific API surface -- verify `serializeCookieHeader` export exists at runtime

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Already installed, just needs correct usage of @supabase/ssr
- Architecture: HIGH - Clear migration path from current dual system to single Supabase Auth
- Pitfalls: HIGH - Identified from direct codebase analysis (localStorage refs, cookie naming, ID format)
- Email/SMTP: MEDIUM - Resend SMTP credentials verified, but dashboard configuration is manual and domain verification status unknown

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable - Supabase Auth and @supabase/ssr are mature)
