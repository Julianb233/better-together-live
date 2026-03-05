---
phase: 08-infrastructure-monitoring
plan: 01
subsystem: core-architecture
tags: [refactor, hono, routing, code-organization]
dependency-graph:
  requires: []
  provides: [clean-entry-point, route-extraction, page-extraction]
  affects: [08-02, 08-03]
tech-stack:
  added: []
  patterns: [hono-sub-app-routing, component-extraction]
key-files:
  created:
    - src/routes/inline-api.ts
    - src/routes/pages.tsx
    - src/pages/home.tsx
  modified:
    - src/index.tsx
decisions:
  - id: "08-01-01"
    decision: "pages.ts renamed to pages.tsx for JSX support (HomePage component rendering)"
    rationale: "esbuild requires .tsx extension for files containing JSX syntax"
metrics:
  duration: "~4m"
  completed: "2026-03-05"
---

# Phase 8 Plan 1: Extract Inline Handlers from index.tsx Summary

**One-liner:** Refactored index.tsx from 1890 to 191 lines by extracting inline API handlers, page routes, and homepage JSX into separate modules.

## What Was Done

### Task 1-2: Extract and slim index.tsx (combined)
- **Created `src/routes/inline-api.ts` (255 lines):** Extracted checkDatabase helper, POST/GET/PUT /api/users, POST /api/invite-partner, GET /api/relationships/:userId into a Hono sub-app
- **Created `src/routes/pages.tsx` (271 lines):** Extracted all 30+ page route registrations (.html pages, clean URL pages, homepage, API docs page) into a Hono sub-app with all page imports
- **Created `src/pages/home.tsx` (1184 lines):** Extracted the entire homepage JSX verbatim into an exported component function
- **Slimmed `src/index.tsx` to 191 lines:** Now contains only imports, app creation, middleware registration, and route mounting (30 app.route calls)

## Verification Results
- `wc -l src/index.tsx` = 191 (target: under 500)
- `grep -c "app\.\(get\|post\|put\|delete\)" src/index.tsx` = 0 (no inline handlers)
- `grep "app.route" src/index.tsx | wc -l` = 30 (28 API + 2 new route modules)
- `npm run build` succeeds (2.80s, 730 modules)

## Commits
| Commit | Description |
|--------|-------------|
| f985258 | feat(08-01): extract inline handlers and pages from index.tsx |

## Deviations from Plan

### Auto-fixed Issues
**1. [Rule 3 - Blocking] Renamed pages.ts to pages.tsx**
- **Found during:** Task 2 (build verification)
- **Issue:** pages.ts contained JSX for HomePage rendering and API docs page, but esbuild requires .tsx extension for JSX
- **Fix:** Renamed src/routes/pages.ts to src/routes/pages.tsx
- **Files modified:** src/routes/pages.tsx (renamed)

## Next Phase Readiness
- Clean entry point ready for Sentry middleware, logging middleware, and health check (Plan 08-02)
- No blockers for 08-02
