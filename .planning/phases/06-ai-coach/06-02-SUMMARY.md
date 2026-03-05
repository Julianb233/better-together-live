---
phase: 06-ai-coach
plan: 02
subsystem: ai-coach
tags: [ai, routing, openai, claude, fallback, cost-optimization]
dependency-graph:
  requires: [06-01]
  provides: [tiered-routing, model-fallback]
  affects: [06-03]
tech-stack:
  added: []
  patterns: [heuristic-classification, provider-fallback-chain]
key-files:
  created: [src/lib/ai/coach-router.ts]
  modified: [src/api/ai-coach.ts]
decisions:
  - id: "06-02-01"
    decision: "Word count > 15 OR complex keyword match = complex tier"
    reason: "Free heuristic avoids LLM classification cost"
  - id: "06-02-02"
    decision: "Static fallback message when both providers fail"
    reason: "Never expose raw errors to users"
metrics:
  duration: ~2m
  completed: 2026-03-05
---

# Phase 06 Plan 02: Tiered Model Routing Summary

**One-liner:** Heuristic question classifier routes simple questions to gpt-4o-mini and complex to Claude, with cross-provider fallback.

## What Was Done

### Task 1: Create tiered model routing module
- Created `src/lib/ai/coach-router.ts` with classifyQuestion, getModel, generateCoachResponse
- 30+ complex indicator keywords/phrases for classification
- Primary/fallback pattern: try primary model, on failure try alternate, on both fail return static message
- **Commit:** a218bdb

### Task 2: Update ai-coach.ts to use tiered routing
- Replaced direct generateText/anthropic imports with generateCoachResponse
- Response JSON now includes dynamic tier and model from router
- model_used in saved messages reflects actual model used
- **Commit:** b4d2b3d

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

- `npm run build` succeeds (3.08s, 727 modules)
- generateCoachResponse confirmed in ai-coach.ts
- Zero direct anthropic() calls in ai-coach.ts (moved to coach-router)
- Both anthropic and openai imports in coach-router.ts
- Fallback try/catch logic confirmed
