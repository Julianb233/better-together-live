---
phase: 04-product-integrity
plan: 03
subsystem: pricing-integrity
tags: [pricing, coming-soon, paywall, consistency]
depends_on:
  requires: ["04-01", "04-02"]
  provides: ["unified-pricing-model", "coming-soon-badges"]
  affects: ["05-xx", "06-xx"]
tech_stack:
  added: []
  patterns: ["canonical-pricing-source-of-truth"]
key_files:
  created: []
  modified:
    - src/index.tsx
    - src/pages/subscription-boxes.ts
    - src/pages/member-rewards.ts
    - src/api/payments.ts
decisions:
  - id: "04-03-01"
    description: "Paywall ($39/$69) is canonical pricing source of truth"
  - id: "04-03-02"
    description: "Subscription box prices kept as aspirational (Coming Soon), not removed"
  - id: "04-03-03"
    description: "Annual tier updated to $390/year (~17% savings vs $39/mo)"
metrics:
  duration: "4m 9s"
  completed: "2026-03-05"
---

# Phase 4 Plan 3: Unify Pricing & Mark Unimplemented Features Summary

**One-liner:** Unified all pricing to canonical $39/$69 Growing Together model, marked subscription boxes and rewards as Coming Soon with disabled CTAs.

## What Was Done

### Task 1: Unify Homepage Pricing to Match Paywall
- Replaced "Better Together Plan $240/year" card with "Growing Together $39/month" card
- Replaced "Try It Out $30/month" card with "Growing Together+ $69/month" card
- Updated hero badge from "$240/year" to "$39/mo for Couples"
- Updated feature lists to match paywall tier descriptions exactly
- Removed all old pricing references ($240, $20/mo, $30) from homepage

### Task 2: Mark Unimplemented Features & Audit Pricing
- Added prominent Coming Soon banners to subscription-boxes.ts and member-rewards.ts
- Disabled all Subscribe Now, Purchase Credits, and action buttons on both pages
- Replaced CTAs with "View Current Plans" links pointing to /paywall
- Added "(Coming Soon)" label to Rewards nav link on homepage
- Updated payments API annual tier from $240/year to $390/year (consistent with $39/mo base)
- Removed misleading "$240 avg monthly savings" claim from member-rewards
- Final audit confirmed zero conflicting prices in active pages

## Decisions Made

| ID | Decision | Rationale |
|----|----------|-----------|
| 04-03-01 | Paywall is canonical pricing source of truth | Only page with Stripe integration |
| 04-03-02 | Keep subscription box prices as aspirational | They're for a separate product, marked Coming Soon |
| 04-03-03 | Annual tier = $390/year (~17% savings) | Proportional to new $39/mo base price |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Updated payments API annual tier pricing**
- **Found during:** Task 2 pricing audit
- **Issue:** payments.ts had `price: 24000` ($240/year) based on old $20/mo pricing model
- **Fix:** Updated to `price: 39000` ($390/year, ~17% savings vs $39/mo)
- **Files modified:** src/api/payments.ts
- **Commit:** 4eb214c

## Verification Results

1. `npm run build` -- passes
2. `grep -rn '$240|$289|$30/mo|$20/mo' src/` -- zero results (excluding already-redirected premium-pricing.ts)
3. Homepage pricing shows $39/mo and $69/mo matching paywall
4. Subscription boxes page has Coming Soon banner + disabled buttons
5. Member rewards page has Coming Soon banner + disabled buttons
6. No conflicting pricing across active pages
7. Paywall Stripe checkout integration untouched

## Next Phase Readiness

Phase 4 (Product Integrity) is now complete. All 3 plans executed:
- 04-01: Fixed CTA buttons, removed fake spinners, cleaned dead links
- 04-02: Removed fake social proof, false claims, exposed metrics
- 04-03: Unified pricing, marked unimplemented features

Ready for Phase 5.
