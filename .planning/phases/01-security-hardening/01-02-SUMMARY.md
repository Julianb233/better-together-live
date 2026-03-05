---
phase: 01-security-hardening
plan: 02
subsystem: security
tags: [idor, authorization, middleware, security]
dependency-graph:
  requires: ["01-01"]
  provides: ["IDOR protection on all userId-parameterized routes", "Reusable security helper library"]
  affects: ["01-03", "01-04", "01-05", "03-xx"]
tech-stack:
  added: []
  patterns: ["inline ownership check pattern via checkOwnership/forbiddenResponse"]
key-files:
  created:
    - src/lib/security.ts
  modified:
    - src/api/users.ts
    - src/api/dashboard.ts
    - src/api/notifications.ts
    - src/api/experiences.ts
    - src/api/quiz.ts
    - src/api/relationships.ts
    - src/api/push-notifications.ts
    - src/index.tsx
decisions:
  - id: "01-02-D1"
    decision: "Use inline checkOwnership pattern instead of route-level middleware"
    rationale: "Most routes already extract userId before any logic; inline check is simpler and avoids middleware ordering issues with mounted sub-routers"
  - id: "01-02-D2"
    decision: "Exclude social.ts, communities.ts, and feed.ts from IDOR protection"
    rationale: "These use :userId as the TARGET of an action (follow, block, admin role change), not as an identity claim. The authenticated user is always c.get('userId')."
  - id: "01-02-D3"
    decision: "Defer verifyRelationshipMembership to Phase 3"
    rationale: "Relationship membership checks require database queries that vary per route and depend on schema consolidation planned for Phase 3"
metrics:
  duration: "~3 minutes"
  completed: "2026-03-05"
---

# Phase 1 Plan 2: IDOR Protection Summary

**One-liner:** Inline ownership checks on all 17 userId-parameterized routes via checkOwnership/forbiddenResponse helpers from src/lib/security.ts

## What Was Done

### Task 1: Create security helper library
Created `src/lib/security.ts` with three exports:
- `requireOwnership()` -- route-level middleware that compares `c.get('userId')` with `:userId` param
- `checkOwnership(c, requestedUserId)` -- inline boolean check for use inside handlers
- `forbiddenResponse(c)` -- consistent 403 JSON response

### Task 2: Add IDOR checks to all userId-parameterized routes
Added `checkOwnership` + `forbiddenResponse` to 17 route handlers across 8 files:

| File | Routes Protected | Pattern |
|------|-----------------|---------|
| src/api/users.ts | 6 (preferences GET/PUT, love-languages GET/PUT, notification-settings GET/PUT) | Inline check after param extraction |
| src/api/dashboard.ts | 1 (GET /:userId) | Inline check |
| src/api/notifications.ts | 3 (GET /:userId, PUT /:userId/read-all, GET /:userId/unread-count) | Inline check |
| src/api/experiences.ts | 1 (GET /user/:userId) | Inline check |
| src/api/quiz.ts | 1 (GET /history/:userId) | Inline check |
| src/api/relationships.ts | 1 (GET /user/:userId) | Inline check |
| src/api/push-notifications.ts | 1 (GET /tokens/:userId) | Inline check |
| src/index.tsx | 3 (GET/PUT /api/users/:userId, GET /api/relationships/:userId) | Inline check |

**Intentionally excluded:**
- `social.ts` -- :userId is the follow/friend/block TARGET, not identity
- `communities.ts` -- :userId is admin target, already has permission checks
- `feed.ts` -- uses :targetUserId param, public profile view

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

1. **Inline over middleware** -- Used `checkOwnership()` inline in handlers rather than `requireOwnership()` middleware because routes already extract the userId param at the top of their try blocks, making inline checks cleaner.

2. **Excluded 3 files by design** -- social.ts, communities.ts, and feed.ts use `:userId` as the target of an action (not as the requester's identity claim), so adding ownership checks would break legitimate functionality.

3. **Deferred relationship membership** -- Left a TODO in security.ts for `verifyRelationshipMembership()` which requires database queries and varies per route. Planned for Phase 3 database consolidation.

## Commits

| Hash | Message |
|------|---------|
| 8e44dde | feat(01-02): create security helper library with IDOR utilities |
| 320f0d6 | feat(01-02): add IDOR checks to all userId-parameterized API routes |

## Verification

- Build passes: `npm run build` succeeds (389 modules, 2.30s)
- All 8 files with user-identity `:userId` routes have checkOwnership checks
- 3 files with target-action `:userId` routes correctly excluded
- Cross-reference grep confirms complete coverage

## Next Phase Readiness

- No blockers for 01-03 (input validation)
- The `verifyRelationshipMembership` TODO should be addressed in Phase 3
- social.ts and messaging.ts still import the old JWT `requireAuth` from auth.ts (noted in STATE.md from 01-01)
