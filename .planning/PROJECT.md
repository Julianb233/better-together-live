# Better Together — Production Readiness

## Vision

Take the existing Better Together relationship intelligence platform from prototype to production-ready application. The app combines AI-powered coaching, smart scheduling, and personalized suggestions for couples — featuring daily check-ins, shared goals, date activities, gamified challenges, community features, live video, and a freemium revenue model.

**Current State:** Feature-rich prototype with 31 API modules, 33 page templates, and a React Native mobile app — but critical production blockers in security, testing, data integrity, and infrastructure.

**Target State:** Secure, tested, monitored production application ready for real users and real payments on Vercel.

## Context

- **Type:** Brownfield production hardening
- **Owner:** Julian (solo, agent-driven execution)
- **Timeline:** ASAP — ship fast, cut scope where needed
- **Deployment:** Vercel (primary), web + mobile (React Native)
- **Domain:** better-together.app

## Requirements

### Validated

- ✓ Server-rendered HTML pages via Hono TSX (33 page templates) — existing
- ✓ REST API with modular sub-routers (31 API modules) — existing
- ✓ User registration and login flows — existing (needs consolidation)
- ✓ Daily check-in system with mood/gratitude tracking — existing
- ✓ Shared goals with milestones and progress tracking — existing
- ✓ Date activity suggestions and booking — existing
- ✓ Relationship challenges with gamification — existing
- ✓ Community features (groups, feeds, discovery) — existing
- ✓ In-app messaging between partners — existing
- ✓ LiveKit video call integration — existing
- ✓ Push notification infrastructure (FCM + APNS) — existing
- ✓ Stripe payment integration (basic) — existing (needs hardening)
- ✓ Email sending via Resend — existing
- ✓ Mobile app screens (React Native) — existing (needs API alignment)
- ✓ Social feed with posts and interactions — existing
- ✓ User discovery and compatibility matching — existing
- ✓ Analytics dashboard — existing (fake data, needs real implementation)
- ✓ Supabase database schema and RLS policies — existing (needs fixing)

### Active

- [ ] **Consolidate to Supabase Auth** — Remove custom JWT auth system, use Supabase Auth exclusively
- [ ] **Consolidate to Supabase DB** — Remove Neon adapter, use Supabase client everywhere
- [ ] **Fix critical security vulnerabilities** — Auth on all routes, IDOR protection, Stripe webhook verification, CORS lockdown, XSS prevention
- [ ] **Implement tiered AI Coach** — Claude API for complex requests, OpenAI for simple ones, with conversation history
- [ ] **Real analytics** — Replace hardcoded mock data with actual database queries
- [ ] **Automated test suite** — Vitest unit tests, API integration tests, E2E tests
- [ ] **Error tracking and monitoring** — Sentry or equivalent, structured logging
- [ ] **Freemium payment flow** — Working Stripe subscriptions with free tier + premium gating
- [ ] **Database migration consolidation** — Single migration system (Supabase), fix schema drift
- [ ] **Production deployment pipeline** — Vercel with proper CI/CD, env var management, staging
- [ ] **Input validation** — Zod schemas on all API endpoints, request sanitization
- [ ] **Rate limiting** — Distributed rate limiting (not in-memory)
- [ ] **Mobile app production readiness** — API alignment, auth flow, app store prep
- [ ] **Password reset email flow** — Actually send reset emails via Resend
- [ ] **Admin dashboard auth** — Protect admin routes with role-based access
- [ ] **Performance optimization** — Fix N+1 queries, add connection pooling, pagination limits

### Critical Product Gaps (Advertised but Not Implemented)

- [ ] **Calendar integration** — Smart Scheduling advertised but no Google/Apple Calendar API exists
- [ ] **Physical subscription boxes** — Full e-commerce page exists but no fulfillment/shipping API
- [ ] **Personal human coaching** — Advertised at $89-$149/session but no booking/therapist API
- [ ] **Member rewards/savings** — Promises "up to 50% savings" but no rewards redemption API
- [ ] **Surprise credits ($50)** — Part of premium plan but no credit/wallet system
- [ ] **Pricing consistency** — THREE conflicting pricing structures across homepage, paywall, premium page
- [ ] **Fake social proof** — "50,000+ couples", "4.9/5 rating" hardcoded with no real users
- [ ] **Non-functional CTAs** — Most homepage buttons show a 2-second spinner then do nothing
- [ ] **Internal metrics exposed** — In-app purchases page leaks ARPU targets, conversion rates, margins publicly
- [ ] **"End-to-end encryption" claimed** — No E2E encryption exists in the codebase
- [ ] **"Watch Demo" buttons** — Simulate loading for 2 seconds and do nothing

### Out of Scope

- Cloudflare Pages deployment — consolidating on Vercel
- D1/SQLite support — consolidating on Supabase PostgreSQL
- Custom JWT auth system — removing in favor of Supabase Auth
- Neon database adapter — removing in favor of Supabase client
- Native app store submission — web + mobile dev only, not app store review process
- Internationalization (i18n) — English only for launch
- Physical subscription box fulfillment — remove or mark "coming soon" (no logistics infrastructure)
- Personal human coaching marketplace — remove or mark "coming soon" (no therapist network)
- Member rewards partner network — remove or mark "coming soon" (no affiliate partnerships)

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Hono 4.9 | Server-rendered TSX + REST API |
| Language | TypeScript (ESNext) | Strict mode |
| Build | Vite 6 | @hono/vite-build for Vercel output |
| Database | Supabase (PostgreSQL) | Consolidating from dual Neon+Supabase |
| Auth | Supabase Auth | Consolidating from dual custom JWT+Supabase |
| Payments | Stripe | Raw fetch (no SDK) — needs stripe package |
| Email | Resend | Transactional email |
| Video | LiveKit | Server SDK for room management |
| AI Coach | Claude API + OpenAI | Tiered: Claude=complex, OpenAI=simple |
| Mobile | React Native | Separate codebase in mobile/ |
| Hosting | Vercel | Primary deployment target |
| Styling | TailwindCSS via CDN | No build-time processing |
| Testing | Vitest (to add) | Currently zero test coverage |
| Monitoring | Sentry (to add) | Currently console.error only |

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Supabase Auth as sole auth system | Eliminates dual auth confusion, proper password hashing, built-in email verification, OAuth support | Pending |
| Supabase as sole database | Eliminates dual DB adapters, enables RLS, removes raw SQL injection risks | Pending |
| Tiered AI Coach (Claude + OpenAI) | Claude for complex relationship coaching, OpenAI for quick/simple responses — balances quality vs cost | Pending |
| Vercel as sole deployment target | Already configured, simpler than maintaining Cloudflare Pages dual-target | Pending |
| Vitest for testing | Native Vite integration, fast, modern — natural fit for the build system | Pending |
| Freemium model | Free tier for engagement, premium for AI coach/video/advanced features | Pending |
| Unify pricing to one model | Three conflicting pricing structures must become one consistent freemium model | Pending |
| Remove/hide unimplemented features | Subscription boxes, human coaching, rewards, surprise credits — mark as "coming soon" or remove | Pending |
| Remove fake social proof | Replace "50,000+ couples" with real metrics or remove entirely | Pending |
| Fix non-functional CTAs | Homepage buttons that spin and do nothing must link to real actions | Pending |
| Remove leaked business metrics | In-app purchases page exposes internal ARPU/LTV targets publicly | Pending |

## Constraints

- **Solo execution** — All work done by AI agents, Julian reviews
- **ASAP timeline** — Prioritize critical security and core functionality over polish
- **Existing users** — May have users on current system; migrations must be non-destructive
- **Budget** — Minimize new service costs; use free tiers where possible
- **Edge compatibility** — Hono designed for edge runtimes; libraries must be edge-compatible

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Auth migration breaks existing sessions | Medium | High | Run both systems briefly, migrate users, then remove legacy |
| Database consolidation causes data loss | Low | Critical | Backup before migration, test thoroughly |
| Zero test coverage means refactoring introduces bugs | High | High | Add tests for critical paths BEFORE refactoring |
| Stripe webhook exploitation before fix | High | Medium | Fix webhook verification in first phase |
| AI coach costs spiral | Medium | Medium | Rate limit AI requests, cache common responses |

---

*Last updated: 2026-03-05 after initialization*
