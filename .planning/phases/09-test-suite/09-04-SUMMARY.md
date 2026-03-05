---
phase: 09-test-suite
plan: 04
subsystem: ci-cd
tags: [ci, github-actions, coverage, vitest]
completed: 2026-03-05
duration: ~1m
requires: [09-02, 09-03]
provides: [ci-test-gate, coverage-artifacts]
affects: []
tech-stack:
  added: []
  patterns: [fail-fast-test-gate, coverage-artifact-upload]
key-files:
  created: []
  modified:
    - .github/workflows/deploy.yml
decisions:
  - id: "09-04-01"
    decision: "Place test step before lint (not just before build)"
    reason: "Tests are the real gate; lint is less likely to catch regressions"
metrics:
  tasks: 1/1
  commits: 1
---

# Phase 9 Plan 4: CI Pipeline Integration Summary

**One-liner:** Vitest test step added to CI pipeline before lint/typecheck/build, with coverage uploaded as 14-day artifact.

## What Was Done

### Task 1: Add Test and Coverage Steps to CI Pipeline
- Added "Run tests with coverage" step (`npx vitest run --coverage`) after "Install dependencies"
- Added "Upload coverage report" step using `actions/upload-artifact@v4` with 14-day retention
- Upload step uses `if: always()` to capture coverage even if tests fail
- Pipeline order is now: checkout -> node setup -> install -> **test** -> **upload coverage** -> lint -> typecheck -> build
- All deploy jobs (preview, staging, production) depend on `lint-and-test` job, so test failures block deployment

## Deviations from Plan

None - plan executed exactly as written.

## Decisions Made

1. **[09-04-01] Tests before lint** - Positioned test step before linting step since tests are the primary regression gate and should fail first.

## Verification Results

1. `.github/workflows/deploy.yml` contains `vitest run --coverage` step
2. Coverage upload step uses `actions/upload-artifact@v4` with `coverage/` path
3. Test step is positioned before lint and build (fails fast)
4. Existing deploy/notify jobs unchanged
5. `npx vitest run --coverage` locally produces `coverage/` directory with lcov, json-summary, json, and lcov-report

## Commits

| Hash | Message |
|------|---------|
| d2230d3 | feat(09-04): add Vitest test step and coverage upload to CI pipeline |
