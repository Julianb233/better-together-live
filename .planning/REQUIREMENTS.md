# Requirements: Better Together

**Defined:** 2026-03-05
**Core Value:** Secure, tested production app where real couples can safely use AI coaching, payments, and community features

## v1 Requirements

Requirements for production launch. Each maps to roadmap phases.

### Security

- [x] **SEC-01**: All API routes require authentication (except login, register, health check)
- [x] **SEC-02**: Users can only access/modify their own data (IDOR protection on all userId endpoints)
- [x] **SEC-03**: Stripe webhook signatures are verified before processing events
- [x] **SEC-04**: CORS restricted to production domain(s) only
- [x] **SEC-05**: User-generated content is sanitized against XSS before storage/rendering
- [x] **SEC-06**: Admin routes require admin role verification
- [x] **SEC-07**: Video room creation/access requires authenticated relationship membership
- [x] **SEC-08**: Pagination limits enforced (max 100) on all list endpoints
- [x] **SEC-09**: No hardcoded secrets in codebase (JWT fallback removed)
- [x] **SEC-10**: Rate limiting uses distributed store (not in-memory)

### Auth Consolidation

- [ ] **AUTH-01**: All authentication uses Supabase Auth exclusively (custom JWT removed)
- [ ] **AUTH-02**: User can sign up with email and password via Supabase Auth
- [ ] **AUTH-03**: User receives email verification after signup
- [ ] **AUTH-04**: User can reset password via email link (actually sends email via Resend)
- [ ] **AUTH-05**: User session persists across browser refresh (HTTP-only cookies)
- [ ] **AUTH-06**: Login page uses Supabase Auth only (no dual login forms)

### Database Consolidation

- [ ] **DB-01**: All API routes use Supabase client (Neon adapter removed)
- [ ] **DB-02**: Single migration system using Supabase migrations
- [ ] **DB-03**: RLS policies applied and working (column names match, anon key used where appropriate)
- [ ] **DB-04**: No raw SQL string interpolation in any API route
- [ ] **DB-05**: Database connection handled via Supabase client (no per-request instantiation)

### Input Validation

- [ ] **VAL-01**: All API endpoints validate input with Zod schemas
- [ ] **VAL-02**: Zod is listed in package.json dependencies
- [ ] **VAL-03**: Invalid input returns 400 with descriptive error messages

### AI Coach

- [ ] **AI-01**: AI coach uses Claude API for complex relationship questions
- [ ] **AI-02**: AI coach uses OpenAI API for simple/quick responses
- [ ] **AI-03**: Conversation history persisted in database per user
- [ ] **AI-04**: AI requests are rate-limited per user
- [ ] **AI-05**: Common responses cached to reduce API costs

### Payments

- [ ] **PAY-01**: Stripe SDK installed and used (not raw fetch)
- [ ] **PAY-02**: Freemium model: free tier with limited features, premium unlocks AI coach/video/advanced
- [ ] **PAY-03**: Subscription checkout flow works end-to-end (select plan → Stripe → active subscription)
- [ ] **PAY-04**: Subscription cancellation works and revokes premium access
- [ ] **PAY-05**: Webhook properly updates user subscription status on payment events
- [ ] **PAY-06**: Single consistent pricing model across all pages

### Analytics

- [ ] **ANL-01**: Analytics dashboard shows real data from database queries (no mock/hardcoded data)
- [ ] **ANL-02**: User count, engagement metrics, and trends computed from actual records

### Product Integrity

- [ ] **INT-01**: All homepage CTA buttons link to real actions (no fake spinners)
- [ ] **INT-02**: Fake social proof removed or replaced with real metrics
- [ ] **INT-03**: Internal business metrics page (/in-app-purchases.html) removed or protected
- [ ] **INT-04**: Unimplemented features (subscription boxes, human coaching, rewards, surprise credits) marked "coming soon" or removed from navigation
- [ ] **INT-05**: "End-to-end encryption" claim removed (not implemented)
- [ ] **INT-06**: "Watch Demo" buttons either link to real demo or removed
- [ ] **INT-07**: Pricing unified to single consistent freemium model across homepage, paywall, premium page

### Testing

- [ ] **TST-01**: Vitest installed and configured with Vite
- [ ] **TST-02**: Unit tests for utility functions (src/utils.ts)
- [ ] **TST-03**: Integration tests for auth flows (signup, login, logout, password reset)
- [ ] **TST-04**: Integration tests for payment flows (checkout, webhook, cancellation)
- [ ] **TST-05**: Integration tests for core API routes (check-ins, goals, activities, challenges)
- [ ] **TST-06**: CI pipeline runs tests on PR and blocks merge on failure
- [ ] **TST-07**: Test coverage reported (no minimum threshold for v1)

### Monitoring

- [ ] **MON-01**: Error tracking service integrated (Sentry or equivalent)
- [ ] **MON-02**: Structured logging replaces console.error in API routes
- [ ] **MON-03**: Health check endpoint exists and is monitored

### Infrastructure

- [ ] **INF-01**: Vercel deployment works with proper env vars
- [ ] **INF-02**: CI/CD pipeline: lint → type-check → test → build → deploy
- [ ] **INF-03**: Staging environment available for pre-production testing
- [ ] **INF-04**: Entry point refactored (index.tsx under 500 lines, inline handlers extracted)

### Performance

- [ ] **PERF-01**: N+1 queries fixed in messaging (conversations endpoint)
- [ ] **PERF-02**: Discovery API migrated from raw SQL to Supabase query builder
- [ ] **PERF-03**: Trending topics computed via database (not 1000-row in-memory scan)

### Mobile

- [ ] **MOB-01**: Mobile app uses Supabase Auth (aligned with web)
- [ ] **MOB-02**: Mobile API client points to production Vercel URL
- [ ] **MOB-03**: Mobile app builds without errors

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Calendar Integration

- **CAL-01**: Google Calendar integration for smart scheduling
- **CAL-02**: Apple Calendar integration for smart scheduling

### Physical Products

- **PROD-01**: Subscription box ordering and fulfillment
- **PROD-02**: Surprise credits wallet system

### Marketplace

- **MKT-01**: Personal human coaching booking and scheduling
- **MKT-02**: Member rewards/savings redemption system
- **MKT-03**: Partner/sponsor marketplace

### Advanced Features

- **ADV-01**: End-to-end encryption for messages
- **ADV-02**: OAuth login (Google, Apple)
- **ADV-03**: Real-time notifications via WebSocket

## Out of Scope

| Feature | Reason |
|---------|--------|
| Cloudflare Pages deployment | Consolidating on Vercel |
| D1/SQLite database support | Consolidating on Supabase PostgreSQL |
| Custom JWT auth system | Removing in favor of Supabase Auth |
| Neon database adapter | Removing in favor of Supabase client |
| App store submission | Web + mobile dev, not app store review |
| Internationalization (i18n) | English only for launch |
| Physical subscription box fulfillment | No logistics infrastructure |
| Personal coaching marketplace | No therapist network |
| Member rewards partner network | No affiliate partnerships |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SEC-01 thru SEC-10 | Phase 1 | Complete |
| AUTH-01 thru AUTH-06 | Phase 2 | Pending |
| DB-01 thru DB-05 | Phase 3 | Pending |
| VAL-01 thru VAL-03 | Phase 3 | Pending |
| INT-01 thru INT-07 | Phase 4 | Pending |
| PAY-01 thru PAY-06 | Phase 5 | Pending |
| AI-01 thru AI-05 | Phase 6 | Pending |
| ANL-01 thru ANL-02 | Phase 7 | Pending |
| PERF-01 thru PERF-03 | Phase 7 | Pending |
| INF-01 thru INF-04 | Phase 8 | Pending |
| MON-01 thru MON-03 | Phase 8 | Pending |
| TST-01 thru TST-07 | Phase 9 | Pending |
| MOB-01 thru MOB-03 | Phase 10 | Pending |

**Coverage:**
- v1 requirements: 58 total
- Mapped to phases: 58
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-05*
*Last updated: 2026-03-05 after initial definition*
