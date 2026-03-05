---
phase: 08-infrastructure-monitoring
plan: 02
subsystem: monitoring
tags: [sentry, pino, logging, health-check, error-tracking]
dependency-graph:
  requires: [08-01]
  provides: [error-tracking, structured-logging, health-check-endpoint]
  affects: [08-03]
tech-stack:
  added: ["@sentry/node", "hono-pino", "pino", "pino-pretty"]
  patterns: [sentry-middleware, pino-structured-logging, health-check]
key-files:
  created:
    - src/middleware/sentry.ts
    - src/middleware/logging.ts
    - src/lib/logger.ts
  modified:
    - src/index.tsx
    - src/routes/inline-api.ts
    - src/api/supabase-auth.ts
    - src/api/email.ts
    - src/api/communities.ts
    - src/api/payments.ts
    - package.json
decisions:
  - id: "08-02-01"
    decision: "Standalone logger (src/lib/logger.ts) for code outside request context"
    rationale: "email.ts simulateEmail() is a utility function without Hono context - can't use c.var.logger"
  - id: "08-02-02"
    decision: "Used sed batch replacement for console.error migration (21+ calls per file)"
    rationale: "All calls follow same pattern: console.error('message:', error) -> c.var.logger.error({ err: error }, 'message')"
metrics:
  duration: "~4.5m"
  completed: "2026-03-05"
---

# Phase 8 Plan 2: Sentry, Pino Logging, and Health Check Summary

**One-liner:** Added @sentry/node error tracking, hono-pino structured JSON logging, /health endpoint with DB check, and migrated 61 console.error calls across 5 critical API files.

## What Was Done

### Task 1: Dependencies and middleware creation
- Installed @sentry/node, hono-pino, pino (runtime), pino-pretty (dev)
- Created `src/middleware/sentry.ts`: Sentry init at module scope with env-based config, graceful skip when DSN missing
- Created `src/middleware/logging.ts`: hono-pino middleware with pino-pretty in dev, raw JSON in prod
- Created `src/lib/logger.ts`: Standalone pino instance for use outside request context

### Task 2: Wiring and health check
- Added sentryMiddleware and loggingMiddleware as first two middleware in chain
- Added `/health` endpoint returning 200/503 with database connectivity status
- Added `app.onError` handler for consistent 500 JSON responses
- Added `lint` and `typecheck` npm scripts to package.json

### Task 3: console.error migration
- `src/routes/inline-api.ts`: 5 calls migrated
- `src/api/supabase-auth.ts`: 21 calls migrated
- `src/api/email.ts`: 13 console.log calls replaced with standalone logger.info (single structured log)
- `src/api/communities.ts`: 16 calls migrated
- `src/api/payments.ts`: 6 calls migrated
- Total: 61 console.error/log calls replaced with structured pino logging

## Verification Results
- `npm run build` succeeds (4.72s, 1548 modules)
- Sentry, logging, and /health all present in index.tsx
- 0 console.error/log remaining in all 5 migrated files
- All dependencies present in package.json

## Commits
| Commit | Description |
|--------|-------------|
| 22f1f12 | feat(08-02): add Sentry error tracking, pino logging, and health check |
| a278d99 | refactor(08-02): replace console.error with structured pino logging |

## Deviations from Plan

None - plan executed exactly as written.

## Next Phase Readiness
- lint and typecheck scripts ready for CI pipeline (Plan 08-03)
- No blockers for 08-03
