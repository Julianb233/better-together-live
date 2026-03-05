---
phase: 07
plan: 01
subsystem: analytics
tags: [analytics, mock-data-removal, supabase]
completed: 2026-03-05
duration: ~2m
dependency_graph:
  requires: [phase-03]
  provides: [real-analytics-data]
  affects: [admin-dashboard]
tech_stack:
  added: []
  patterns: [zeros-with-error-flag, null-for-unknown-metrics]
key_files:
  created: []
  modified: [src/api/analytics.ts]
decisions:
  - id: "07-01-01"
    decision: "Return null for metrics with no data source (CLV, repeat rate, session duration)"
    rationale: "null is semantically correct -- distinguishes 'no data' from 'zero value'"
  - id: "07-01-02"
    decision: "Calculate real revenue growth by comparing current vs previous month sponsor revenue"
    rationale: "Replaces hardcoded +34.2% with actual computed growth"
  - id: "07-01-03"
    decision: "Query real top challenges from challenge_participation table"
    rationale: "Replaces hardcoded ['Date Night Planning', 'Communication Skills', 'Shared Goals']"
  - id: "07-01-04"
    decision: "Return sessionsGrowth as N/A since no session tracking comparison exists"
    rationale: "No historical session data to compare against"
---

# Phase 7 Plan 1: Remove Mock Analytics Data Summary

**One-liner:** Purged all fake numbers, mock generators, and isSupabaseAvailable fallbacks from analytics.ts -- every endpoint now returns real DB data or zeros with error flags.

## What Was Done

### Task 1: Remove all mock data fallbacks and fake numbers

- Removed all 7 `isSupabaseAvailable` guard blocks that returned fake data (50247 users, 25124 couples, etc.)
- Removed `isSupabaseAvailable` function itself
- Fixed all error catch blocks to return zeros + `error: 'Analytics temporarily unavailable'`
- Replaced hardcoded growth strings (`+34.2%`, `+19.3%`) with real revenue growth calculation and `N/A` for sessions
- Replaced hardcoded demographics (age groups, locations) with empty arrays
- Removed fallback-to-mock ternaries (`growthData.length > 0 ? growthData : generateMockUserGrowth()`)
- Replaced hardcoded values: `averageSessionDuration: null`, `sessionsPerUser: null`, `customerLifetimeValue: null`, `repeatPurchaseRate: null`, `averageTimeSpent: null`, `churnRate: null`, `bookingConversion: null`, `repeatBookingRate: null`, `customerSatisfaction: null`
- Removed 3 mock generator functions: `generateMockUserGrowth()`, `generateMockRevenueData()`, `generateActivityHeatmap()`
- Replaced `/system` endpoint fake metrics with real Supabase health check
- Removed `/export` isSupabaseAvailable fallback
- Replaced heatmap with `null`
- Added real top challenges query from `challenge_participation` + `challenges` tables

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

- `grep -n "50247|25124|847|Mock|mock|generateMock|isSupabaseAvailable|generateActivity"` -- zero matches
- `grep -rn "mock|Mock|FAKE|fake"` -- zero matches
- `grep -c "error:"` -- 16 matches (error flags in catch blocks)
- `npm run build` -- passes successfully
- Net change: 98 insertions, 227 deletions (129 fewer lines)

## Commits

| Commit | Description |
|--------|-------------|
| 6ec5baf | feat(07-01): remove all mock data from analytics endpoints |
