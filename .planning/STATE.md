# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-05)

**Core value:** Secure, tested production app for real couples with AI coaching, payments, and community
**Current focus:** Phase 8 (Infrastructure & Monitoring) -- COMPLETE

## Current Position

Phase: 8 of 10 (Infrastructure & Monitoring)
Plan: 3 of 3 in current phase
Status: Phase complete
Last activity: 2026-03-05 -- Completed 08-03-PLAN.md (ESLint & CI/CD Pipeline)

Progress: [█████████████████████████████░] 77% (27/35)

## Performance Metrics

**Velocity:**
- Total plans completed: 27
- Average duration: ~3.5 minutes
- Total execution time: ~98.5 minutes

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 - Security | 5/5 | ~17.5m | ~3.5m |
| 2 - Auth Consolidation | 3/3 | ~10m | ~3.3m |
| 3 - Database Consolidation | 5/5 | ~29.5m | ~5.9m |
| 4 - Product Integrity | 3/3 | ~13.6m | ~4.5m |
| 5 - Payment System | 3/3 | ~6m | ~2m |
| 6 - AI Coach | 3/3 | ~7m | ~2.3m |
| 7 - Analytics & Performance | 2/2 | ~3.8m | ~1.9m |
| 8 - Infrastructure & Monitoring | 3/3 | ~11m | ~3.7m |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Supabase Auth as sole auth system (remove custom JWT)
- Supabase as sole database (remove Neon adapter)
- Tiered AI Coach: Claude for complex, OpenAI for simple
- Vercel as sole deployment target
- Freemium model with unified pricing
- [01-01] Read Supabase env from c.env at request time (Vercel per-request injection)
- [01-01] Use hono/combine except() for public route whitelist
- [01-03] Web Crypto API for Stripe signature verification (no SDK needed)
- [01-04] CORS origin allowlist with CORS_ORIGINS env var for flexibility
- [01-02] Inline checkOwnership pattern for IDOR protection (over route middleware)
- [01-02] Excluded social/communities/feed from IDOR (target-action, not identity)
- [01-02] Deferred verifyRelationshipMembership to Phase 3
- [01-04] Admin analytics page route protected with inline requireAuth + requireAdmin
- [01-05] Rate limiting gracefully skips when Upstash not configured (dev mode passthrough)
- [01-05] Kept auth-specific in-memory rate limiting separate from global API rate limiting
- [01-05] Sanitize-on-input for all UGC (defense-in-depth with Hono TSX auto-escape)
- [02-01] Store @supabase/ssr response headers on Hono context for cookie relay
- [02-01] Rename createServerClient to createAnonClient to avoid @supabase/ssr name collision
- [02-02] PKCE code exchange via /callback endpoint for password reset flow
- [02-02] Pass tokens as query params from callback to reset page (server-rendered pages can't read hash)
- [02-02] Set auth cookies after password reset so user stays logged in
- [02-03] Keep jose in package.json (push-notifications.ts uses it for APNS)
- [02-03] Async checkAuth in intimacy-challenges (cookie validation requires server roundtrip)
- [03-01] Zod v4 with @hono/zod-validator for middleware-level validation
- [03-01] z.coerce for query param schemas (strings auto-convert to numbers)
- [03-01] One schema file per API domain, matching src/api/ structure
- [03-01] Schemas match actual API field usage (camelCase vs snake_case preserved per route)
- [03-02] Use `as any` casts on Supabase insert/update where DB types diverge from actual schema
- [03-02] Map Supabase column names to frontend-expected response shapes in GET handlers
- [03-02] Fixed zodErrorHandler to use `any` type for Zod v4 compatibility
- [03-02] Inline Zod schemas for files without pre-existing schema files
- [03-03] Fetch-then-aggregate for analytics (Supabase query builder lacks GROUP BY/AVG)
- [03-03] Created validation schemas for sponsors and push-notifications (missing from 03-01)
- [03-04] Use supabase.rpc() for discovery search queries (complex SQL not expressible in query builder)
- [03-04] Fetch-then-enrich pattern for all JOIN queries across API files
- [03-04] Read-then-update for counter increments (Supabase lacks SQL increment)
- [03-04] JS aggregation replaces SQL GROUP BY in analytics
- [03-05] Delete db-supabase.ts entirely (unused wrapper with broken rpc query method)
- [03-05] RLS policies use user1_id/user2_id matching DB schema (TypeScript types differ but service role bypasses RLS)
- [04-01] Replace dead footer nav links with real app routes instead of removing footer columns entirely
- [04-03] Paywall pricing updated to $30/mo and $240/yr (was $39/$69)
- [05-01] Stripe SDK replaces raw fetch; per-request client via createStripeClient()
- [05-01] SDK constructEventAsync replaces manual Web Crypto HMAC for webhooks
- [05-01] Pre-created Price IDs from env vars (STRIPE_PRICE_TRY_IT_OUT, STRIPE_PRICE_BETTER_TOGETHER)
- [05-01] Plan IDs: 'try-it-out' ($30/mo) and 'better-together' ($240/yr) replace growing-together variants
- [05-02] requireTier middleware gates ai-coach, video, intimacy routes at index.tsx level
- [05-02] Both plans unlock identical features (no differentiation between tiers)
- [05-03] Subscription management delegates to Stripe Customer Portal
- [06-01] claude-haiku-4-5 as primary AI coach model via Vercel AI SDK
- [06-01] Fetch newest-first then reverse for chronological conversation history
- [06-02] Heuristic question classification (word count + keywords, no LLM call)
- [06-02] Static fallback message when both AI providers fail
- [06-03] In-memory rate limiting and caching (not Redis) -- acceptable for serverless cold starts
- [07-01] Return null for metrics with no data source (CLV, repeat rate, session duration)
- [07-01] Calculate real revenue growth from current vs previous month sponsor data
- [07-01] sessionsGrowth returns N/A (no historical session data to compare)
- [07-02] Batch unread counts using oldest last_read_at as floor + in-memory filtering
- [07-02] JS fallback for trending topics RPC with reduced 500-row limit
- [07-02] Response field renamed from postCount to post_count for RPC consistency
- [08-01] pages.ts renamed to pages.tsx for JSX support (HomePage component rendering)
- [08-02] Standalone logger for code outside request context (email.ts simulateEmail utility)
- [08-03] no-unused-vars set to warn (51 pre-existing violations)
- [08-03] typecheck CI step uses continue-on-error (1121 pre-existing type errors)

### Pending Todos

- Configure Upstash Redis credentials in Vercel (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)
- Configure Resend SMTP in Supabase dashboard (host: smtp.resend.com, port: 465, user: resend, password: RESEND_API_KEY)
- Regenerate Supabase Database types from live schema (to eliminate `as any` casts in API files)
- Reconcile TypeScript type column names (user_1_id) with actual DB schema (user1_id)
- Run migration 0006_ai_coach_messages.sql against Supabase (creates ai_coach_messages + ai_coach_rate_limits tables)
- Set ANTHROPIC_API_KEY and OPENAI_API_KEY in Vercel dashboard
- Run migration `migrations/0010_extract_trending_topics.sql` on Supabase to enable trending topics RPC
- Configure Stripe env vars in Vercel: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_TRY_IT_OUT, STRIPE_PRICE_BETTER_TOGETHER
- Create Stripe Products/Prices in dashboard and enable Customer Portal
- Configure Sentry DSN in Vercel (SENTRY_DSN)
- Configure Vercel CI secrets in GitHub: VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID
- Fix 1121 TypeScript type errors to make typecheck CI step strict
- Fix 51 unused variable warnings to promote no-unused-vars to error

### Blockers/Concerns

- 58 v1 requirements across 10 phases -- aggressive scope for ASAP timeline
- Zero existing tests means refactoring has high regression risk
- Phase 1 (security) complete -- all 5 plans executed
- Phase 2 (auth consolidation) complete -- all 3 plans executed, custom JWT fully removed
- Phase 3 (database consolidation) complete -- all 5 plans executed, Neon fully removed, 25 API files migrated
- Phase 4 COMPLETE -- all 3 plans executed: CTA fixes, fake content removal, pricing unification
- Phase 5 COMPLETE -- all 3 plans executed: Stripe SDK, subscription gating, pricing unification
- Phase 6 COMPLETE -- all 3 plans executed: Claude integration, tiered routing, rate limiting + caching
- Phase 7 COMPLETE -- all 2 plans executed: mock analytics removed, N+1 fixed, trending topics RPC created
- Phase 8 COMPLETE -- all 3 plans executed: index.tsx refactored 1890->191 lines, Sentry + pino logging, Vercel CI pipeline
- Supabase SMTP not yet configured -- password reset emails won't deliver until manual dashboard setup is done
- Supabase Database types file has fewer columns than actual DB schema -- causes type errors requiring `as any` casts
- Trending topics RPC function needs migration run on Supabase (JS fallback active until then)
- 1121 TypeScript type errors prevent strict typecheck in CI

## Session Continuity

Last session: 2026-03-05
Stopped at: Completed 08-03-PLAN.md (ESLint & CI/CD Pipeline) -- Phase 8 complete
Resume file: None
