---
phase: 05-payment-system
plan: 02
subsystem: payments
tags: [middleware, subscription-gating, freemium, hono-middleware]

requires:
  - phase: 05-payment-system
    provides: "STRIPE_PLANS with plan IDs, subscriptions table structure"
  - phase: 01-security
    provides: "requireAuth middleware sets userId on Hono context"
provides:
  - "requireTier() Hono middleware for premium route gating"
  - "getUserTier() helper for subscription tier lookup"
  - "403 response with upgradeUrl for free-tier users"
affects: [frontend-premium-features, ai-coach, video, intimacy]

tech-stack:
  added: []
  patterns: ["requireTier() middleware applied at route mount in index.tsx"]

key-files:
  created:
    - src/lib/subscription-gate.ts
  modified:
    - src/index.tsx

key-decisions:
  - "Gate at index.tsx route mount level (centralized) rather than per-API-file"
  - "Minimum tier 'try-it-out' for all premium routes (both plans unlock same features)"
  - "403 response includes currentTier, requiredTier, and upgradeUrl for client UX"

patterns-established:
  - "app.use('/api/X/*', requireTier('tier')) before app.route() for premium gating"

duration: 1min
completed: 2026-03-05
---

# Phase 5 Plan 2: Subscription Gating Middleware Summary

**requireTier middleware gating AI coach, video, and intimacy routes with 403 + upgrade URL for free users**

## Performance

- **Duration:** 1 min
- **Started:** 2026-03-05T21:30:30Z
- **Completed:** 2026-03-05T21:31:31Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Created subscription-gate.ts with getUserTier() and requireTier() middleware
- Applied tier gating to 3 premium route groups (ai-coach, video, intimacy)
- Free-tier routes remain ungated (checkins, goals, dashboard, payments, communities, feed, etc.)

## Task Commits

1. **Task 1: Create subscription-gate.ts** - `af4e817` (feat)
2. **Task 2: Apply requireTier to premium routes** - `3199e6c` (feat)

## Files Created/Modified
- `src/lib/subscription-gate.ts` - getUserTier, requireTier, SubscriptionTier type
- `src/index.tsx` - Added import and 3 requireTier middleware lines before premium route mounts

## Decisions Made
- Centralized gating in index.tsx rather than per-API-file (easier to audit which routes are premium)
- Both plans ('try-it-out' and 'better-together') unlock all premium features (no feature differentiation between tiers)
- 403 response includes upgradeUrl: '/paywall' for client-side redirect

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness
- Subscription gating active, ready for frontend pricing updates (05-03)
- Free users will see 403 when accessing /api/ai-coach/*, /api/video/*, /api/intimacy/*

---
*Phase: 05-payment-system*
*Completed: 2026-03-05*
