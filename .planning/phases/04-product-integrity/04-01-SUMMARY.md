---
phase: 04-product-integrity
plan: 01
subsystem: frontend
tags: [homepage, cta, navigation, ux]
dependency-graph:
  requires: []
  provides: [homepage-real-ctas, no-dead-links]
  affects: [04-02, 04-03]
tech-stack:
  added: []
  patterns: [anchor-links-over-buttons-for-navigation]
key-files:
  created: []
  modified: [src/index.tsx]
decisions:
  - id: "04-01-01"
    description: "Replace dead footer nav links with real app routes instead of removing footer columns entirely"
    rationale: "Keeps footer useful for navigation while eliminating all dead links"
metrics:
  duration: "2m 28s"
  completed: "2026-03-05"
---

# Phase 4 Plan 1: Fix Homepage CTA Buttons Summary

**One-liner:** Converted all fake CTA buttons to real `<a href="/paywall">` links, deleted fake spinner script, removed all dead footer links

## What Was Done

### Task 1: Convert all fake CTA buttons to real navigation links
- Converted 5 `<button>` elements to `<a href="/paywall">` links (desktop nav, mobile nav, hero, pricing x2, final CTA)
- Deleted 2 buttons entirely: "Watch 2-Min Demo" and "Watch How It Works" (no demo video exists)
- Changed 3 `premium-pricing.html` nav links to `/paywall` (desktop nav, mobile nav, footer pricing link)
- All converted links use `inline-flex items-center justify-center` for proper button-like layout
- **Commit:** e61bb0e

### Task 2: Delete fake loading spinner script and fix footer links
- Deleted the entire fake CTA spinner script (the `ctaButtons.forEach` with `setTimeout` 2-second fake loading)
- Removed 3 dead social media icon links (`href="#"` for Twitter, Facebook, Instagram)
- Removed 8 dead footer navigation links (Changelog, Help Center, Contact Us, Privacy Policy, Terms of Service, Partner Portal, About Us, Contact)
- Added 7 real footer links pointing to existing routes (/paywall, /login, /portal, /subscription, /email-preferences, /gift-subscription, /bundles)
- Renamed "Support" footer column to "Account" for accuracy
- **Commit:** 51f1612

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

| Check | Result |
|-------|--------|
| `npm run build` | Succeeds (1,921.53 kB) |
| `grep -c 'href="#"'` | 0 (no dead links) |
| `grep 'premium-pricing.html'` | Only in route handler (not in any link) |
| `grep 'ctaButtons'` | None |
| `grep 'Watch.*Demo'` | None |
| Remaining `<button>` tags | Only mobile menu hamburger (legitimate) |

## Key Metrics

- **Dead links removed:** 11 (`href="#"`)
- **Fake buttons converted:** 5 (to real `<a>` links)
- **Fake buttons deleted:** 2 (Watch Demo / Watch How It Works)
- **Nav links fixed:** 3 (`premium-pricing.html` -> `/paywall`)
- **Real footer links added:** 7

## Next Phase Readiness

No blockers. Homepage CTA buttons all navigate to real destinations. Ready for 04-02 (additional product integrity fixes).
