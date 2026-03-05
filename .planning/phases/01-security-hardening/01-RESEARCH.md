# Phase 1: Security Hardening - Research

**Researched:** 2026-03-05
**Domain:** Web application security (Hono, Supabase Auth, Stripe, edge/serverless)
**Confidence:** HIGH

## Summary

This phase hardens a Hono 4.9 server-rendered app deployed on Vercel. The codebase already has Supabase Auth middleware (`src/lib/supabase/middleware.ts`) with `requireAuth` and `optionalAuth` -- but it is not applied globally. The existing custom JWT auth (`src/api/auth.ts`) uses a hardcoded fallback secret and must coexist during this phase. There are ~25 API route modules mounted in `index.tsx`, nearly all unprotected.

The standard approach is: (1) apply Supabase `requireAuth` middleware globally via Hono's `except` combinator, (2) add IDOR checks in route handlers, (3) verify Stripe webhooks with raw HMAC-SHA256, (4) restrict CORS to production domain(s), (5) use output encoding (not DOM-based sanitization) for XSS in server-rendered TSX, (6) use Upstash Redis for distributed rate limiting, (7) enforce pagination caps.

**Primary recommendation:** Use the existing `src/lib/supabase/middleware.ts` as the global auth layer, applied with `except` from `hono/combine` to exclude public routes. Do NOT build new auth middleware.

## Standard Stack

### Core (already installed)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| hono | ^4.9.2 | Web framework | Already in use, has built-in CORS + middleware combinators |
| @supabase/supabase-js | ^2.89.0 | Auth + DB client | Already in use for auth |
| jose | ^6.1.3 | JWT operations | Already in use for custom JWT (will coexist) |

### To Install
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|-------------|
| @upstash/ratelimit | ^2.0.8 | Distributed rate limiting | Purpose-built for serverless/edge, uses Redis over HTTP |
| @upstash/redis | ^1.x | Redis client for rate limiter | HTTP-based, no TCP needed for Vercel edge |

### Not Needed (use built-in approaches instead)
| Problem | Don't Install | Use Instead |
|---------|--------------|-------------|
| XSS sanitization | DOMPurify, sanitize-html, isomorphic-dompurify | HTML entity encoding function (5 chars: `& < > " '`). Server-rendered TSX auto-escapes. Only sanitize on input for stored content. |
| CORS | Any CORS library | `hono/cors` (built-in) |
| Auth middleware | Any auth library | Existing `src/lib/supabase/middleware.ts` |
| Stripe webhook verification | stripe SDK | Raw `crypto.subtle.importKey` + `crypto.subtle.sign` (Web Crypto API, edge-compatible) |

**Installation:**
```bash
npm install @upstash/ratelimit @upstash/redis
```

## Architecture Patterns

### Recommended Security Middleware Stack (in index.tsx)

```
Request Flow:
  1. CORS middleware (hono/cors, restricted origins)
  2. Rate limiting middleware (Upstash, by IP)
  3. Auth middleware (Supabase requireAuth via except combinator)
  4. Route handler (IDOR check + pagination cap)
```

### Pattern 1: Global Auth with Route Exclusions

**What:** Apply `requireAuth` to all `/api/*` routes, exclude public ones.
**When to use:** Always. This is the primary security gate.

```typescript
// Source: https://hono.dev/docs/middleware/builtin/combine
import { except } from 'hono/combine'
import { requireAuth } from './lib/supabase/middleware'

// Public routes that skip auth
const PUBLIC_ROUTES = [
  '/api/auth/*',              // login, register, supabase auth
  '/api/auth/supabase/*',     // supabase auth routes
  '/api/payments/webhook',    // Stripe webhook (uses signature verification)
  '/api/health',              // health check
]

app.use('/api/*', except(
  PUBLIC_ROUTES,
  requireAuth({ /* env passed dynamically */ })
))
```

**CRITICAL NOTE:** The existing `requireAuth` in `src/lib/supabase/middleware.ts` takes `env: SupabaseEnv` as a parameter and returns a middleware function. This needs to be adapted for global use since `env` is not available at middleware registration time in Hono -- it's only available at request time via `c.env`. The middleware must be refactored to read env from context:

```typescript
// Refactored requireAuth that reads env from context
export function requireAuth() {
  return async (c: Context, next: Next) => {
    const env = {
      SUPABASE_URL: c.env?.SUPABASE_URL || '',
      SUPABASE_ANON_KEY: c.env?.SUPABASE_ANON_KEY || '',
      SUPABASE_SERVICE_ROLE_KEY: c.env?.SUPABASE_SERVICE_ROLE_KEY
    }
    const supabase = createClientWithContext(c, env)
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error || !user) {
      return c.json({ error: 'Unauthorized' }, 401)
    }
    c.set('userId', user.id)
    c.set('userEmail', user.email)
    c.set('user', user)
    c.set('supabase', supabase)
    await next()
  }
}
```

### Pattern 2: IDOR Protection

**What:** Compare authenticated user ID against the resource's userId parameter.
**When to use:** Every route with `:userId` param or user-scoped data.

```typescript
// In route handler, after auth middleware has set userId
app.get('/api/users/:userId', async (c) => {
  const authUserId = c.get('userId')       // From auth middleware
  const requestedUserId = c.req.param('userId')

  if (authUserId !== requestedUserId) {
    return c.json({ error: 'Forbidden' }, 403)
  }
  // ... proceed with handler
})
```

For relationship-scoped data (checkins, goals, etc.), the check is:
```typescript
// Verify user belongs to the relationship
const relationship = await getRelationshipByUserId(env, authUserId)
if (!relationship || relationship.id !== requestedRelationshipId) {
  return c.json({ error: 'Forbidden' }, 403)
}
```

### Pattern 3: Admin Role Verification

**What:** Check Supabase user metadata or a database role field for admin access.
**When to use:** Admin dashboard routes, analytics routes.

```typescript
export function requireAdmin() {
  return async (c: Context, next: Next) => {
    const user = c.get('user')
    if (!user) return c.json({ error: 'Unauthorized' }, 401)

    // Option A: Check Supabase user metadata
    const isAdmin = user.app_metadata?.role === 'admin'
    // Option B: Check database users table
    // const dbUser = await getUserById(env, user.id)
    // const isAdmin = dbUser?.role === 'admin'

    if (!isAdmin) return c.json({ error: 'Forbidden' }, 403)
    await next()
  }
}
```

### Pattern 4: Stripe Webhook Signature Verification (No SDK)

**What:** Verify Stripe webhook HMAC-SHA256 signature using Web Crypto API.
**When to use:** The `/api/payments/webhook` endpoint.

```typescript
// Source: https://docs.stripe.com/webhooks#verify-manually
async function verifyStripeSignature(
  payload: string,
  sigHeader: string,
  secret: string,
  toleranceSec: number = 300 // 5 minutes
): Promise<boolean> {
  // Step 1: Extract timestamp and signatures
  const parts = sigHeader.split(',')
  const timestamp = parts.find(p => p.startsWith('t='))?.slice(2)
  const signature = parts.find(p => p.startsWith('v1='))?.slice(3)

  if (!timestamp || !signature) return false

  // Check timestamp tolerance (prevent replay attacks)
  const now = Math.floor(Date.now() / 1000)
  if (Math.abs(now - parseInt(timestamp)) > toleranceSec) return false

  // Step 2: Construct signed payload
  const signedPayload = `${timestamp}.${payload}`

  // Step 3: Compute HMAC-SHA256 using Web Crypto API (edge-compatible)
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signedPayload))
  const expected = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  // Step 4: Timing-safe comparison
  return timingSafeEqual(expected, signature)
}

// Timing-safe string comparison
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let result = 0
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return result === 0
}
```

### Pattern 5: Pagination Cap

**What:** Enforce maximum limit on all list endpoints.
**When to use:** Every endpoint that accepts `?limit=` query parameter.

```typescript
const MAX_PAGE_SIZE = 100
const DEFAULT_PAGE_SIZE = 20

function getPaginationParams(c: Context) {
  const limit = Math.min(
    parseInt(c.req.query('limit') || String(DEFAULT_PAGE_SIZE)),
    MAX_PAGE_SIZE
  )
  const offset = Math.max(parseInt(c.req.query('offset') || '0'), 0)
  return { limit: Math.max(limit, 1), offset }
}
```

### Anti-Patterns to Avoid
- **Checking `getSession()` instead of `getUser()`:** `getSession()` only validates locally. `getUser()` contacts Supabase Auth server to verify the token is still valid. Always use `getUser()` for security.
- **Per-route auth middleware instead of global:** Easy to forget a route. Use global + exceptions.
- **String comparison for signature verification:** Always use timing-safe comparison to prevent side-channel attacks.
- **Trusting client-provided userId without IDOR check:** Every userId in a request must match the authenticated user.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Rate limiting state | In-memory Map (current approach) | @upstash/ratelimit + @upstash/redis | Serverless functions are ephemeral; Map resets on every cold start |
| Stripe signature verification | String split + basic comparison | Web Crypto HMAC-SHA256 + timing-safe compare | Must prevent timing attacks and replay attacks |
| CORS handling | Manual header setting | `hono/cors` middleware | Handles preflight, credentialed requests, origin validation |
| Auth middleware combinator | If/else route checking | `except` from `hono/combine` | Pattern-matched exclusions, composable |
| HTML entity encoding | Regex replacements | Dedicated escape function (below) | Regex approaches miss edge cases |

**Key insight:** The existing codebase has TWO problems to avoid: (1) the wildcard CORS in both `hono/cors` call AND `vercel.json` headers -- both must be fixed, and (2) the in-memory rate limiting Map that provides zero protection in serverless.

## Common Pitfalls

### Pitfall 1: Dual CORS Configuration
**What goes wrong:** CORS is set in both Hono middleware (line 76 of index.tsx) AND vercel.json headers. Even if you fix the Hono middleware, vercel.json still sends `Access-Control-Allow-Origin: *`.
**Why it happens:** Vercel applies its own headers from vercel.json before/alongside the application.
**How to avoid:** Fix BOTH locations. Remove the wildcard headers block from vercel.json or scope it to specific production domains.
**Warning signs:** Browser shows `Access-Control-Allow-Origin: *` in response headers even after Hono middleware change.

### Pitfall 2: Auth Middleware Env Access in Hono
**What goes wrong:** Middleware registered at app startup (e.g., `app.use('/api/*', requireAuth(env))`) cannot access `c.env` because Hono provides env per-request, not at startup time.
**Why it happens:** Hono on Vercel/Cloudflare passes env through the request context, not as global state.
**How to avoid:** The middleware function must read `c.env` inside the handler, not accept env as a parameter at registration time.
**Warning signs:** `env.SUPABASE_URL` is undefined inside middleware.

### Pitfall 3: Webhook Route Must Skip Auth
**What goes wrong:** If global auth middleware covers `/api/payments/webhook`, Stripe's webhook requests (which have no auth cookie) get 401'd.
**Why it happens:** Stripe sends server-to-server POST requests with its own signature, not user auth.
**How to avoid:** Explicitly exclude `/api/payments/webhook` from the auth middleware using `except`. Verify via Stripe signature instead.
**Warning signs:** Stripe Dashboard shows webhook delivery failures with 401 status.

### Pitfall 4: XSS in Server-Rendered TSX
**What goes wrong:** Developers assume TSX auto-escapes everything. It does for JSX expressions `{variable}` but NOT for `dangerouslySetInnerHTML` or when constructing HTML strings manually.
**Why it happens:** The app uses server-rendered TSX (Hono JSX), which auto-escapes JSX interpolation. But raw HTML string templates in page files may not escape.
**How to avoid:** Sanitize user content on INPUT (before database storage). Use the built-in JSX escaping for output. Audit for any `dangerouslySetInnerHTML` or string template HTML construction.
**Warning signs:** User-generated content containing `<script>` tags renders in pages.

### Pitfall 5: Supabase getUser() Performance
**What goes wrong:** `getUser()` makes a network call to Supabase Auth server on EVERY request. With global auth middleware, this adds latency to every API call.
**Why it happens:** `getUser()` is the only secure way to validate sessions server-side (unlike `getSession()` which only validates locally).
**How to avoid:** Accept the latency as the security cost. Supabase Auth is fast (typically <50ms). Cache user data in context for the duration of the request. Do NOT cache across requests in serverless.
**Warning signs:** API response times increase by 30-80ms after adding global auth.

### Pitfall 6: SQL Injection in discovery.ts
**What goes wrong:** String interpolation in SQL queries at line 688+ of discovery.ts.
**Why it happens:** Developer used template literals instead of parameterized queries.
**How to avoid:** Replace ALL string-interpolated SQL with parameterized queries (`$1, $2` placeholders). The existing pattern in the codebase uses `$N` placeholders correctly elsewhere.
**Warning signs:** Search queries with `'; DROP TABLE--` cause errors or unexpected behavior.

## Code Examples

### CORS Configuration (Restricted)
```typescript
// Source: https://hono.dev/docs/middleware/builtin/cors
import { cors } from 'hono/cors'

app.use('/api/*', cors({
  origin: (origin) => {
    const allowed = [
      'https://bettertogether.app',        // production
      'https://www.bettertogether.app',     // www
    ]
    // In development, also allow localhost
    if (process.env.NODE_ENV !== 'production') {
      allowed.push('http://localhost:3000', 'http://localhost:5173')
    }
    return allowed.includes(origin) ? origin : ''
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}))
```

### Distributed Rate Limiting
```typescript
// Source: https://github.com/upstash/ratelimit-js
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create rate limiter (singleton per cold start, that's fine)
function createRateLimiter(env: any) {
  const redis = new Redis({
    url: env.UPSTASH_REDIS_REST_URL,
    token: env.UPSTASH_REDIS_REST_TOKEN
  })

  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(60, '1 m'), // 60 requests per minute
    prefix: 'bt-ratelimit',
  })
}

// Middleware
function rateLimitMiddleware() {
  return async (c: Context, next: Next) => {
    const limiter = createRateLimiter(c.env)
    const ip = c.req.header('x-forwarded-for')?.split(',')[0] || 'unknown'
    const { success, remaining } = await limiter.limit(ip)

    c.header('X-RateLimit-Remaining', String(remaining))

    if (!success) {
      return c.json({ error: 'Too many requests' }, 429)
    }
    await next()
  }
}
```

### HTML Entity Encoding (XSS Prevention for Stored Content)
```typescript
// For sanitizing user input BEFORE storage
// Note: Hono JSX auto-escapes on output, but stored content
// should also be sanitized on input as defense-in-depth
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

// For fields that should never contain HTML (names, bios, etc.)
function sanitizeTextInput(input: string): string {
  return escapeHtml(input.trim())
}

// For fields that might contain limited formatting
// Strip ALL tags, keep only text content
function stripHtml(input: string): string {
  return input.replace(/<[^>]*>/g, '').trim()
}
```

### IDOR Helper Middleware
```typescript
// Reusable IDOR check for userId routes
function requireOwnership() {
  return async (c: Context, next: Next) => {
    const authUserId = c.get('userId')
    const paramUserId = c.req.param('userId')

    if (paramUserId && authUserId !== paramUserId) {
      return c.json({ error: 'Forbidden' }, 403)
    }
    await next()
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `getSession()` for auth | `getUser()` for auth | Supabase SSR v0.5+ | Must call Supabase Auth server every time |
| Hono per-route middleware | `except` combinator from `hono/combine` | Hono 4.x | Cleaner global auth with exclusions |
| In-memory rate limiting | Upstash Redis rate limiting | Serverless adoption | Required for any multi-instance deployment |
| DOMPurify for sanitization | Output encoding + input validation | Server-rendered TSX | No DOM available in edge; auto-escaping handles output |

**Deprecated/outdated:**
- `supabase.auth.getSession()` for server-side auth validation -- insecure, only validates locally
- Custom JWT auth (`src/api/auth.ts`) -- will be removed in Phase 2, but must coexist now

## Open Questions

1. **Admin role storage location**
   - What we know: Supabase Auth supports `app_metadata.role` for admin roles. The database `users` table may also have a role field.
   - What's unclear: Where admin roles are currently stored for this app (metadata vs database).
   - Recommendation: Check Supabase user metadata first. If no `role` field exists, add one to `app_metadata` via Supabase dashboard for admin users.

2. **Production domain for CORS**
   - What we know: App deploys to Vercel. Domain is likely `bettertogether.app` or similar.
   - What's unclear: Exact production domain(s) and whether preview deployments need CORS access.
   - Recommendation: Use environment variable `CORS_ORIGINS` to configure allowed origins. For preview deployments, consider allowing `*.vercel.app` in non-production.

3. **Upstash Redis provisioning**
   - What we know: @upstash/ratelimit requires Upstash Redis. Vercel has native Upstash integration.
   - What's unclear: Whether an Upstash account/database already exists for this project.
   - Recommendation: Create Upstash Redis via Vercel integration (free tier: 10,000 requests/day). Set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` env vars.

4. **Existing rate limiting code location**
   - What we know: Current rate limiting uses in-memory Map (useless in serverless).
   - What's unclear: Exact file location of current rate limiting implementation.
   - Recommendation: Search for `Map` or `rateLimit` in codebase during implementation to find and replace.

## Sources

### Primary (HIGH confidence)
- Hono official docs: CORS middleware, `except` combinator, middleware guide
  - https://hono.dev/docs/middleware/builtin/cors
  - https://hono.dev/docs/middleware/builtin/combine
- Stripe official docs: webhook signature verification algorithm
  - https://docs.stripe.com/webhooks#verify-manually
- Supabase official docs: `getUser()` vs `getSession()`, server-side auth
  - https://supabase.com/docs/guides/auth/server-side/creating-a-client
- Existing codebase: `src/lib/supabase/middleware.ts` (already has requireAuth)
- Existing codebase: `src/lib/supabase/server.ts` (has createClientWithContext, getCurrentUser)

### Secondary (MEDIUM confidence)
- @upstash/ratelimit GitHub README (v2.0.8, verified install + API)
  - https://github.com/upstash/ratelimit-js
- Hono GitHub discussion on JWT middleware exclusions
  - https://github.com/orgs/honojs/discussions/3537

### Tertiary (LOW confidence)
- XSS sanitization approach for edge runtimes (based on OWASP guidance + framework behavior analysis, not tested)
  - https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Verified existing codebase has Supabase Auth middleware, Hono combine docs confirmed
- Architecture: HIGH - Patterns verified against official Hono and Supabase documentation
- Pitfalls: HIGH - Dual CORS issue verified by reading both index.tsx and vercel.json; env access pattern confirmed
- Rate limiting: MEDIUM - Upstash API verified, but integration with this specific Hono setup not tested
- XSS approach: MEDIUM - Server-rendered TSX auto-escaping is standard, but manual string templates in pages need audit

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable domain, 30-day validity)
