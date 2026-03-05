# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-05)

**Core value:** Secure, tested production app for real couples with AI coaching, payments, and community
**Current focus:** Phase 4 (Product Integrity) -- fixing broken UI elements

## Current Position

Phase: 4 of 10 (Product Integrity)
Plan: 1 of 3 in current phase
Status: In progress
Last activity: 2026-03-05 -- Completed 04-01-PLAN.md (Fix Homepage CTA Buttons)

Progress: [██████████████░] 40% (14/35)

## Performance Metrics

**Velocity:**
- Total plans completed: 14
- Average duration: ~4.0 minutes
- Total execution time: ~59.5 minutes

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| 1 - Security | 5/5 | ~17.5m | ~3.5m |
| 2 - Auth Consolidation | 3/3 | ~10m | ~3.3m |
| 3 - Database Consolidation | 5/5 | ~29.5m | ~5.9m |
| 4 - Product Integrity | 1/3 | ~2.5m | ~2.5m |

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

### Pending Todos

- Configure Upstash Redis credentials in Vercel (UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN)
- Configure Resend SMTP in Supabase dashboard (host: smtp.resend.com, port: 465, user: resend, password: RESEND_API_KEY)
- Regenerate Supabase Database types from live schema (to eliminate `as any` casts in API files)
- Reconcile TypeScript type column names (user_1_id) with actual DB schema (user1_id)

### Blockers/Concerns

- 58 v1 requirements across 10 phases -- aggressive scope for ASAP timeline
- Zero existing tests means refactoring has high regression risk
- Phase 1 (security) complete -- all 5 plans executed
- Phase 2 (auth consolidation) complete -- all 3 plans executed, custom JWT fully removed
- Phase 3 (database consolidation) complete -- all 5 plans executed, Neon fully removed, 25 API files migrated
- Phase 4 plan 1 complete -- all homepage CTA buttons fixed, fake spinner removed, dead links cleaned up
- Supabase SMTP not yet configured -- password reset emails won't deliver until manual dashboard setup is done
- Supabase Database types file has fewer columns than actual DB schema -- causes type errors requiring `as any` casts

## Session Continuity

Last session: 2026-03-05
Stopped at: Completed 04-01-PLAN.md (Fix Homepage CTA Buttons)
Resume file: None
