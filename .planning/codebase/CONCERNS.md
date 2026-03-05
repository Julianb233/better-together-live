# Codebase Concerns

**Analysis Date:** 2026-03-05

## Tech Debt

**Dual Database Adapters (Neon + Supabase):**
- Issue: Two completely separate database layers exist side by side, both actively used. `src/db.ts` wraps Neon with raw SQL, while `src/db-supabase.ts` wraps Supabase with a query builder. Most API routes use the Neon adapter via `createDatabase()`, even though Supabase is the stated preferred DB.
- Files: `src/db.ts`, `src/db-supabase.ts`, nearly all `src/api/*.ts` files import from `src/db.ts`
- Impact: Dual maintenance burden, inconsistent data access patterns, RLS policies in Supabase are bypassed when using Neon raw SQL, confusion about which to use for new features.
- Fix approach: Migrate all API routes from `createDatabase()` (Neon) to Supabase client. Remove `src/db.ts` once migration is complete. This is a high-priority structural fix.

**Dual Auth Systems (Custom JWT + Supabase Auth):**
- Issue: Two full authentication systems coexist. `src/api/auth.ts` + `src/api/auth-routes.ts` implement custom JWT auth with `jose`. `src/api/supabase-auth.ts` implements Supabase Auth. Both are mounted: `/api/auth/*` (custom) and `/api/auth/supabase/*` (Supabase). Neither is clearly primary for API route protection.
- Files: `src/api/auth.ts`, `src/api/auth-routes.ts`, `src/api/supabase-auth.ts`
- Impact: Users can create accounts via either system, leading to split user state. Token validation differs between systems. Auth middleware from custom JWT (`requireAuth`) is rarely used.
- Fix approach: Commit to Supabase Auth as the single auth system. Deprecate and remove custom JWT auth. Ensure all API routes use Supabase session validation.

**Mock/Hardcoded Analytics Data:**
- Issue: The analytics API returns hardcoded mock data when no database is available (which is most of the time for the Neon adapter). Values like `totalUsers: 50247` are fabricated with random variance to appear dynamic.
- Files: `src/api/analytics.ts` (lines 30-49, and throughout: ~20 TODO comments for unimplemented calculations)
- Impact: Analytics dashboard shows completely fake data. Business decisions cannot be made from this data. Over 20 TODO comments mark unimplemented metric calculations.
- Fix approach: Implement real database queries for all analytics metrics. Remove mock data fallbacks or clearly mark demo mode in the UI.

**AI Coach is Keyword-Matching Stub:**
- Issue: The AI coach endpoint (`/api/ai-coach/ask`) uses simple `string.includes()` keyword matching against hardcoded responses instead of an actual AI service. Chat history endpoint returns empty array with "coming soon" note.
- Files: `src/api/ai-coach.ts`
- Impact: A core premium feature (AI Relationship Coach) is non-functional. Listed on pricing pages as a feature.
- Fix approach: Integrate with OpenAI or Anthropic API. Implement conversation history storage.

**Massive Entry Point File:**
- Issue: `src/index.tsx` is 1856 lines containing route definitions, inline API handlers (user CRUD, relationship management), page route mappings, and the full homepage HTML/TSX. This is the largest source file.
- Files: `src/index.tsx`
- Impact: Difficult to navigate, high merge conflict risk, mixes concerns (API handlers + page routes + HTML).
- Fix approach: Extract remaining inline API handlers (user CRUD at lines 100-287, invite-partner) to dedicated API modules. Move homepage TSX to `src/pages/home.tsx`.

## Known Bugs

**SQL Parameter Placeholder Mismatch (Discovery API):**
- Symptoms: The discovery/search API builds dynamic SQL with mixed `$N` (PostgreSQL positional) and `?` (SQLite/MySQL) placeholder styles. Blocked user IDs use `?` placeholders while other params use `$N`.
- Files: `src/api/discovery.ts` (lines 60, 217, 283, 640, 766)
- Trigger: Any search/discovery query when the requesting user has blocked other users.
- Workaround: None. Queries will fail or return incorrect results for users with blocks.

**SQL Injection via String Interpolation in Discovery:**
- Symptoms: In `src/api/discovery.ts` line 688, `relationshipType` is directly interpolated into SQL: `` `CASE WHEN r.relationship_type = '${relationshipType}' THEN 2 ELSE 0 END` ``. This value comes from a database query, so risk is indirect, but it violates parameterized query discipline.
- Files: `src/api/discovery.ts` (line 688)
- Trigger: If a relationship_type value in the database contains a SQL injection payload.
- Workaround: The value comes from the database, so exploitation requires prior database compromise. Still must be fixed.

## Security Considerations

**Hardcoded JWT Secret Fallback:**
- Risk: `src/api/auth.ts` line 29 contains a hardcoded fallback JWT secret: `'better-together-secret-key-change-in-production'`. If `JWT_SECRET` env var is not set, all tokens are signed with this publicly-visible key. Any attacker can forge valid JWTs.
- Files: `src/api/auth.ts` (line 29)
- Current mitigation: None. The fallback is always used if env var is missing.
- Recommendations: Remove the fallback. Throw an error at startup if `JWT_SECRET` is not configured. Require a cryptographically random secret of at least 256 bits.

**Password Hashing Uses Bare SHA-256:**
- Risk: Passwords are hashed with a single round of SHA-256 via `crypto.subtle.digest('SHA-256', data)`. No salt, no key stretching. SHA-256 is not designed for password hashing and is trivially brute-forceable with modern GPUs.
- Files: `src/api/auth.ts` (lines 81-89)
- Current mitigation: None.
- Recommendations: Switch to bcrypt, scrypt, or Argon2id. For Cloudflare Workers compatibility, use the `@noble/hashes` package for scrypt/argon2, or migrate to Supabase Auth which handles password hashing properly.

**Stripe Webhook Signature Not Verified:**
- Risk: The Stripe webhook endpoint at `/api/payments/webhook` receives the `stripe-signature` header and `STRIPE_WEBHOOK_SECRET` from env but never verifies the signature. The comment says "In production, verify webhook signature / For now, parse the event directly." Any attacker can POST fabricated webhook events to grant themselves subscriptions.
- Files: `src/api/payments.ts` (lines 101-109)
- Current mitigation: None. The webhook blindly trusts the JSON body.
- Recommendations: Implement Stripe signature verification using `stripe.webhooks.constructEvent()` or manual HMAC verification.

**Wildcard CORS on All API Routes:**
- Risk: Both Hono middleware (`app.use('/api/*', cors())`) in `src/index.tsx` line 76 and `vercel.json` set `Access-Control-Allow-Origin: *` on all API routes. This allows any website to make authenticated requests to the API if cookies are used (though `SameSite: lax` mitigates some of this).
- Files: `src/index.tsx` (line 76), `vercel.json` (lines 9-10)
- Current mitigation: Cookie `SameSite: lax` prevents cross-origin cookie sending for non-GET requests.
- Recommendations: Restrict CORS to the actual deployment domain(s). Use an allowlist: `['https://better-together.app', 'https://www.better-together.app']`.

**No Auth Middleware on Most API Routes:**
- Risk: The `requireAuth` middleware exists in `src/api/auth.ts` but is never applied as global middleware in `src/index.tsx`. Most API route files do manual `c.get('userId')` checks, but many routes that should require auth are completely unprotected. Examples: user creation (`POST /api/users`), user profile retrieval (`GET /api/users/:userId`), user preferences (`GET /api/users/:userId/preferences`), all analytics endpoints, all payment endpoints, all video room endpoints, admin analytics dashboard.
- Files: `src/index.tsx` (no auth middleware applied), `src/api/users.ts` (preferences exposed without auth), `src/api/payments.ts` (subscription status queryable by userId), `src/api/video.ts` (room creation/listing/deletion without auth), `src/api/analytics.ts` (all endpoints public)
- Current mitigation: Some API modules like `src/api/messaging.ts` do `c.get('userId')` checks, but this depends on middleware being applied upstream, which it is not.
- Recommendations: Apply `requireAuth` middleware globally to `/api/*` routes. Whitelist specific public endpoints (login, register, health check). Add authorization checks (users can only access their own data).

**No Authorization (IDOR Vulnerabilities):**
- Risk: Even where authentication exists, there are no authorization checks. Any authenticated user can access any other user's data by changing the `userId` parameter. Examples: `GET /api/users/:userId/preferences` returns any user's email, interests, and preferences. `PUT /api/users/:userId/preferences` allows updating any user's preferences. `PUT /api/users/:userId/love-languages` allows changing any user's love languages. `GET /api/users/:userId/notification-settings` returns any user's settings. `POST /api/payments/cancel-subscription` accepts any `userId` in the body.
- Files: `src/api/users.ts`, `src/api/payments.ts`, `src/index.tsx` (user CRUD routes)
- Current mitigation: None.
- Recommendations: For every endpoint that takes a `userId` parameter, verify the authenticated user matches the requested userId (or has admin privileges).

**Unauthenticated Video Room Management:**
- Risk: Anyone can create LiveKit video rooms, generate access tokens, list all active rooms, view room participants, and delete rooms without any authentication. The `/api/video/token` endpoint generates LiveKit tokens for arbitrary room names and identities.
- Files: `src/api/video.ts` (all endpoints)
- Current mitigation: None. LiveKit API keys are the only barrier.
- Recommendations: Require authentication for all video endpoints. Validate that the requesting user is a participant of the couple/relationship for date rooms.

**Admin Dashboard Publicly Accessible:**
- Risk: The admin analytics dashboard at `/admin/analytics` and `/dashboard.html` are served without any authentication check.
- Files: `src/index.tsx` (lines 354-356)
- Current mitigation: None.
- Recommendations: Add admin auth check before serving admin pages.

## Performance Bottlenecks

**N+1 Query Pattern in Messaging:**
- Problem: Listing conversations (`GET /api/conversations`) fetches conversations, then for each conversation runs two additional queries (get participants + get unread count). For 20 conversations, this is 41 database queries.
- Files: `src/api/messaging.ts` (lines 53-117)
- Cause: Sequential `Promise.all` with per-conversation queries inside a `.map()`.
- Improvement path: Join participants and unread counts into the main query using subqueries or CTEs. Reduce to 1-2 queries total.

**Discovery Queries with Complex Subqueries:**
- Problem: The user discovery endpoint (`GET /api/discover/users`) includes correlated subqueries for mutual connections, shared communities, and follower counts, all computed per-row. The recommendation scoring logic in `GET /api/discover/communities?category=for_you` similarly uses correlated subqueries.
- Files: `src/api/discovery.ts` (lines 660-717, 557-585)
- Cause: Recommendation scoring computed inline in SQL without materialized views or pre-computed scores.
- Improvement path: Pre-compute recommendation scores in a background job or materialized view. Add database indexes on `user_connections(follower_id, status)`, `community_members(user_id, status)`.

**Topic Extraction Fetches 1000 Posts Into Memory:**
- Problem: The trending topics endpoint (`GET /api/explore/topics`) fetches up to 1000 full post contents into application memory, then parses hashtags with regex in a JavaScript loop.
- Files: `src/api/discovery.ts` (lines 918-928)
- Cause: Hashtag extraction done in application code instead of SQL or a dedicated hashtags table.
- Improvement path: Create a `post_hashtags` table populated via trigger. Query hashtag counts directly from the database.

**New Database Instance Per Request:**
- Problem: `createDatabase(c.env as Env)` creates a new `Database` instance (and Neon connection) on every request. There is no connection pooling or reuse.
- Files: `src/db.ts` (line 87-92), every API handler that calls `createDatabase()`
- Cause: Neon serverless SDK does support connection caching (`neonConfig.fetchConnectionCache = true`), but new `Database` wrapper objects are still created per request.
- Improvement path: Use a singleton pattern or request-scoped middleware to share database instances. Better yet, migrate to Supabase client which handles connection management.

## Fragile Areas

**Discovery API Dynamic SQL Construction:**
- Files: `src/api/discovery.ts` (entire file, 956 lines)
- Why fragile: Builds SQL dynamically with conditional fragments, mixed placeholder styles (`$N` and `?`), and string interpolation. Parameter indexing is manually calculated with expressions like `$${userId ? 4 : 3}`. Any change to query parameters requires careful re-indexing of all subsequent placeholders.
- Safe modification: Add comprehensive integration tests before modifying. Consider migrating to Supabase query builder for type-safe query construction.
- Test coverage: None.

**Rate Limiting Is In-Memory Only:**
- Files: `src/api/auth.ts` (lines 117-135)
- Why fragile: Rate limiting uses a local `Map<string, ...>` that resets on every deployment or server restart. In serverless (Cloudflare Workers, Vercel), each invocation may be a fresh instance, making rate limiting ineffective. Multiple instances will have independent rate limit stores.
- Safe modification: Replace with Redis/KV-based rate limiting (Cloudflare KV, Upstash Redis).
- Test coverage: None.

## Scaling Limits

**In-Memory Rate Limiting:**
- Current capacity: Works only within a single server instance for its lifetime.
- Limit: Completely ineffective in serverless or multi-instance deployments.
- Scaling path: Use Cloudflare KV, Upstash Redis, or Supabase for distributed rate limiting state.

**No Pagination Limits Enforced:**
- Current capacity: The `limit` query parameter is parsed from user input with no maximum cap: `parseInt(c.req.query('limit') || '20')`. A client can request `?limit=999999` and fetch the entire table.
- Limit: Large limit values will cause memory exhaustion and slow responses.
- Scaling path: Enforce a maximum limit (e.g., 100) on all paginated endpoints. Cap `parseInt` results: `Math.min(parseInt(c.req.query('limit') || '20'), 100)`.

## Dependencies at Risk

**`z` from `zod` Imported but Not in package.json:**
- Risk: `src/api/ai-coach.ts` imports `{ z } from 'zod'` but `zod` is not listed in `package.json` dependencies. This will fail at runtime unless zod is a transitive dependency.
- Files: `src/api/ai-coach.ts` (line 2), `package.json`
- Impact: AI coach endpoint will crash with import error.
- Migration plan: Add `zod` to `package.json` dependencies, or remove the import and use manual validation.

**No Lock on Specific Versions:**
- Risk: All dependencies use caret ranges (`^`). While `package-lock.json` exists, CI/CD without `npm ci` could install different versions.
- Files: `package.json`
- Impact: Potential breakage from minor version updates.
- Migration plan: Use `npm ci` in CI/CD. Consider pinning critical dependencies.

## Missing Critical Features

**No Test Suite:**
- Problem: The only "test" is `npm run test` which runs `curl http://localhost:3000`. No unit tests, no integration tests, no E2E tests. The `tests/` directory contains only a bash script `push-notifications.test.sh`.
- Blocks: Cannot safely refactor, cannot validate that changes don't break functionality, no regression protection.

**No Email Sending for Password Reset:**
- Problem: The forgot-password flow generates a reset token but does not send an email. The code has a TODO comment and just logs the reset URL to console.
- Files: `src/api/auth-routes.ts` (lines 250-253)
- Blocks: Users cannot recover their accounts if they forget their password.

**No Input Sanitization for XSS:**
- Problem: User-generated content (messages, posts, community descriptions, gratitude notes) is stored raw and likely rendered in server-side HTML templates. There is basic `content.trim().substring(0, 5000)` in messaging but no HTML entity escaping or sanitization.
- Files: `src/api/messaging.ts` (line 469), all endpoints accepting user text
- Blocks: Stored XSS attacks if user content is rendered in server-side HTML without escaping.

**No Monitoring or Error Tracking:**
- Problem: All errors are logged to `console.error()` only. No external error tracking (Sentry, etc.), no structured logging, no alerting on error rate spikes.
- Files: All `src/api/*.ts` files use `console.error()`
- Blocks: Production issues will go undetected until users report them.

**Migration Systems Are Disconnected:**
- Problem: Two separate migration directories exist: `migrations/` (6 files for D1/SQLite) and `supabase-migrations/` (5 files for Supabase/PostgreSQL). They define overlapping but not identical schemas. No automated migration runner for Supabase.
- Files: `migrations/` (D1), `supabase-migrations/` (Supabase)
- Blocks: Schema drift between environments. No single source of truth for database schema.

**RLS Policies Defined but Likely Not Applied:**
- Problem: Supabase RLS policies are defined in `supabase-migrations/002_row_level_security.sql` but the API uses `SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS) or raw Neon SQL (no RLS at all). RLS column names in policies (`user1_id`, `user2_id`) don't match the column names used in API queries (`user_1_id`, `user_2_id`).
- Files: `supabase-migrations/002_row_level_security.sql`, `src/db-supabase.ts` (line 256 - prefers service role key)
- Blocks: Row-level security is effectively non-functional. Data access control depends entirely on application-level checks, which are largely missing.

## Test Coverage Gaps

**Zero Automated Test Coverage:**
- What's not tested: Everything. No unit tests, no integration tests, no E2E tests exist.
- Files: `tests/push-notifications.test.sh` (only file, and it's a bash curl script)
- Risk: Any change can introduce regressions undetected. Auth flows, payment processing, data access, and message handling are all untested.
- Priority: High. At minimum, add integration tests for auth flows and payment webhook processing.

---

*Concerns audit: 2026-03-05*
