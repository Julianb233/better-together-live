# Roadmap: Better Together

## Overview

Take Better Together from a feature-rich but insecure prototype to a production-ready relationship intelligence platform. The journey follows a security-first approach: lock down vulnerabilities, consolidate conflicting systems (dual auth, dual DB), fix product integrity issues (fake data, broken CTAs, leaked metrics), then build the missing real functionality (AI coach, payments, analytics), add testing/monitoring, and prepare mobile for launch.

## Phases

- [x] **Phase 1: Security Hardening** - Fix critical security vulnerabilities before any other work
- [x] **Phase 2: Auth Consolidation** - Migrate to Supabase Auth as sole auth system
- [x] **Phase 3: Database Consolidation** - Migrate all routes from Neon to Supabase client, add input validation
- [x] **Phase 4: Product Integrity** - Fix fake CTAs, remove fake social proof, unify pricing, hide unimplemented features
- [x] **Phase 5: Payment System** - Implement real Stripe subscriptions with freemium gating
- [x] **Phase 6: AI Coach** - Build tiered AI coach with Claude + OpenAI
- [x] **Phase 7: Analytics & Performance** - Replace mock analytics, fix N+1 queries, optimize discovery
- [x] **Phase 8: Infrastructure & Monitoring** - CI/CD pipeline, Sentry, structured logging, entry point refactor
- [ ] **Phase 9: Test Suite** - Vitest setup, unit tests, integration tests, CI test gates
- [ ] **Phase 10: Mobile Production Readiness** - Align mobile app with consolidated backend

## Phase Details

### Phase 1: Security Hardening
**Goal**: Eliminate all critical security vulnerabilities so the app is safe to expose to users
**Depends on**: Nothing (first phase — highest priority)
**Requirements**: SEC-01, SEC-02, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-08, SEC-09, SEC-10
**Success Criteria** (what must be TRUE):
  1. No API endpoint returns another user's data when accessed with a different userId
  2. Stripe webhook rejects requests without valid signature
  3. CORS headers only allow production domain(s)
  4. Admin dashboard returns 401/403 for unauthenticated requests
  5. Hardcoded JWT secret fallback removed from codebase
**Plans**: 5 plans

Plans:
- [x] 01-01: Apply global auth middleware to all /api/* routes with public endpoint whitelist
- [x] 01-02: Add IDOR protection — verify authenticated user matches requested userId on all endpoints
- [x] 01-03: Implement Stripe webhook signature verification
- [x] 01-04: Lock down CORS, admin routes, video endpoints, and remove hardcoded secrets
- [x] 01-05: Add XSS sanitization, pagination limits, and distributed rate limiting (Upstash Redis)

### Phase 2: Auth Consolidation
**Goal**: Single auth system — Supabase Auth only, custom JWT removed entirely
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06
**Success Criteria** (what must be TRUE):
  1. User can sign up, log in, and log out using Supabase Auth
  2. Password reset sends real email via Resend and works end-to-end
  3. Custom JWT auth files (auth.ts, auth-routes.ts) are deleted
  4. Login page shows single Supabase Auth form (no dual options)
  5. All existing API routes use Supabase session validation
**Plans**: 3 plans

Plans:
- [x] 02-01: Migrate all auth middleware to Supabase session validation
- [x] 02-02: Implement password reset email flow via Resend
- [x] 02-03: Remove custom JWT auth system (auth.ts, auth-routes.ts), update login page

### Phase 3: Database Consolidation & Validation
**Goal**: Single database layer — Supabase client only, with input validation on all endpoints
**Depends on**: Phase 2
**Requirements**: DB-01, DB-02, DB-03, DB-04, DB-05, VAL-01, VAL-02, VAL-03
**Success Criteria** (what must be TRUE):
  1. No imports from src/db.ts remain in any API route
  2. src/db.ts (Neon adapter) is deleted
  3. All API endpoints validate input with Zod schemas
  4. RLS policies work correctly (column names match, tested)
  5. Supabase migrations are the single source of truth for schema
**Plans**: 5 plans

Plans:
- [x] 03-01: Install Zod, create shared validation schemas for all API endpoints
- [x] 03-02: Migrate API routes A-G (activities, ai-coach, analytics, auth, challenges, checkins, communities) from Neon to Supabase
- [x] 03-03: Migrate API routes D-M (dashboard, discovery, email, experiences, feed, gamification, goals, intimacy, messaging) from Neon to Supabase
- [x] 03-04: Migrate API routes N-V (notifications, payments, posts, push-notifications, quiz, recommendations, relationships, social, sponsors, users, video) from Neon to Supabase
- [x] 03-05: Fix RLS policies, consolidate migrations, delete Neon adapter and D1 migration files

### Phase 4: Product Integrity
**Goal**: Remove all fake/broken/leaked content — every page and button works honestly
**Depends on**: Phase 1
**Requirements**: INT-01, INT-02, INT-03, INT-04, INT-05, INT-06, INT-07
**Success Criteria** (what must be TRUE):
  1. Every CTA button on homepage navigates to a real destination
  2. No hardcoded user counts or ratings appear on any page
  3. /in-app-purchases.html returns 404 or requires admin auth
  4. Unimplemented features show "coming soon" badges or are removed from navigation
  5. Single pricing model displayed consistently across homepage, paywall, and premium page
**Plans**: 3 plans

Plans:
- [x] 04-01: Fix all homepage CTAs — link buttons to real pages (signup, login, pricing)
- [x] 04-02: Remove fake social proof, leaked business metrics, false encryption claims
- [x] 04-03: Unify pricing model across homepage, paywall, and premium pricing pages; mark unimplemented features as "coming soon"

### Phase 5: Payment System
**Goal**: Working freemium Stripe subscription flow — users can upgrade, downgrade, and cancel
**Depends on**: Phase 3, Phase 4
**Requirements**: PAY-01, PAY-02, PAY-03, PAY-04, PAY-05, PAY-06
**Success Criteria** (what must be TRUE):
  1. User can select a plan and complete Stripe Checkout
  2. Successful payment activates premium features for the user
  3. User can cancel subscription and premium access is revoked
  4. Stripe SDK used (not raw fetch) with proper error handling
  5. Premium-gated features return 403 for free-tier users
**Plans**: 3 plans

Plans:
- [x] 05-01: Install Stripe SDK, implement checkout session creation and success/cancel callbacks
- [x] 05-02: Build premium feature gating middleware and update protected routes
- [x] 05-03: Implement subscription management (cancel, upgrade, billing portal)

### Phase 6: AI Coach
**Goal**: Real AI-powered relationship coaching with tiered Claude/OpenAI and conversation history
**Depends on**: Phase 3
**Requirements**: AI-01, AI-02, AI-03, AI-04, AI-05
**Success Criteria** (what must be TRUE):
  1. User sends message and receives AI-generated relationship coaching response
  2. Complex questions routed to Claude, simple ones to OpenAI
  3. Conversation history persists and is loaded on return visits
  4. AI requests are rate-limited per user (e.g., 50/day free, 200/day premium)
  5. Repeated/common questions return cached responses
**Plans**: 3 plans

Plans:
- [x] 06-01: Replace keyword-matching stub with Claude API integration and system prompt
- [x] 06-02: Add OpenAI tier for simple responses, implement routing logic
- [x] 06-03: Add conversation history storage, rate limiting, and response caching

### Phase 7: Analytics & Performance
**Goal**: Real analytics data and optimized database queries
**Depends on**: Phase 3
**Requirements**: ANL-01, ANL-02, PERF-01, PERF-02, PERF-03
**Success Criteria** (what must be TRUE):
  1. Analytics dashboard shows real user counts and engagement metrics from database
  2. Messaging conversations endpoint uses ≤3 queries (not 41)
  3. Discovery API uses Supabase query builder (no dynamic SQL string construction)
  4. Trending topics computed via database query (not in-memory scan)
**Plans**: 3 plans

Plans:
- [x] 07-01: Replace mock analytics with real Supabase queries for all dashboard metrics
- [x] 07-02: Fix N+1 queries in messaging, add CTEs/joins for conversation listing
- [x] 07-03: Rewrite discovery API with Supabase query builder, add hashtags table for trending topics

### Phase 8: Infrastructure & Monitoring
**Goal**: Production-grade deployment pipeline with error tracking and observability
**Depends on**: Phase 1
**Requirements**: INF-01, INF-02, INF-03, INF-04, MON-01, MON-02, MON-03
**Success Criteria** (what must be TRUE):
  1. Vercel deployment succeeds with all required env vars configured
  2. CI pipeline runs type-check → test → build and blocks on failure
  3. Errors captured in Sentry with stack traces and request context
  4. Health check endpoint returns 200 with database connectivity status
  5. index.tsx is under 500 lines with handlers extracted to API modules
**Plans**: 4 plans

Plans:
- [x] 08-01: Refactor index.tsx — extract inline handlers to API modules, move homepage to pages/
- [x] 08-02: Set up Sentry error tracking and structured logging
- [x] 08-03: Update CI/CD pipeline — add test step, env var management, staging environment (health check merged into 08-02)

### Phase 9: Test Suite
**Goal**: Automated test coverage for critical paths with CI integration
**Depends on**: Phase 2, Phase 3, Phase 5
**Requirements**: TST-01, TST-02, TST-03, TST-04, TST-05, TST-06, TST-07
**Success Criteria** (what must be TRUE):
  1. `npm test` runs Vitest and passes
  2. Auth flows (signup, login, password reset) have passing integration tests
  3. Payment flows (checkout, webhook, cancellation) have passing integration tests
  4. Core API routes (check-ins, goals, activities) have passing integration tests
  5. CI pipeline runs tests and blocks merge on failure
**Plans**: 4 plans

Plans:
- [ ] 09-01: Install and configure Vitest, write unit tests for utils.ts
- [ ] 09-02: Write integration tests for auth flows (Supabase Auth)
- [ ] 09-03: Write integration tests for payments and core API routes
- [ ] 09-04: Add test step to CI pipeline, configure coverage reporting

### Phase 10: Mobile Production Readiness
**Goal**: Mobile app aligned with consolidated backend, builds cleanly
**Depends on**: Phase 2, Phase 3
**Requirements**: MOB-01, MOB-02, MOB-03
**Success Criteria** (what must be TRUE):
  1. Mobile app authenticates via Supabase Auth (not custom JWT)
  2. Mobile API client configured to hit production Vercel URL
  3. Mobile app builds without TypeScript or runtime errors
**Plans**: 2 plans

Plans:
- [ ] 10-01: Update mobile auth to use Supabase Auth, configure API base URL
- [ ] 10-02: Fix build errors, verify all screens work with consolidated API

## Progress

**Execution Order:**
Phases execute in dependency order: 1 → 2 → 3 → 4 (parallel with 2) → 5 → 6 (parallel with 5) → 7 (parallel with 5) → 8 (parallel with 2) → 9 → 10

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Security Hardening | 5/5 | Complete | 2026-03-05 |
| 2. Auth Consolidation | 3/3 | Complete | 2026-03-05 |
| 3. Database Consolidation & Validation | 5/5 | Complete | 2026-03-05 |
| 4. Product Integrity | 3/3 | Complete | 2026-03-05 |
| 5. Payment System | 3/3 | Complete | 2026-03-05 |
| 6. AI Coach | 3/3 | Complete | 2026-03-05 |
| 7. Analytics & Performance | 2/2 | Complete | 2026-03-05 |
| 8. Infrastructure & Monitoring | 3/3 | Complete | 2026-03-05 |
| 9. Test Suite | 0/4 | Not started | - |
| 10. Mobile Production Readiness | 0/2 | Not started | - |

**Total:** 27/33 plans complete
