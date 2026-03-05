---
phase: 06-ai-coach
plan: 01
subsystem: ai-coach
tags: [ai, claude, vercel-ai-sdk, conversation-history, supabase]
dependency-graph:
  requires: [04-product-integrity]
  provides: [claude-integration, conversation-persistence, ai-coach-migration]
  affects: [06-02, 06-03]
tech-stack:
  added: [ai@6.0.116, "@ai-sdk/anthropic@3.0.58", "@ai-sdk/openai@3.0.41"]
  patterns: [vercel-ai-sdk-generateText, supabase-conversation-storage]
key-files:
  created: [src/lib/ai/prompts.ts, src/lib/ai/conversation.ts, migrations/0006_ai_coach_messages.sql]
  modified: [package.json, src/api/ai-coach.ts]
decisions:
  - id: "06-01-01"
    decision: "Use anthropic('claude-haiku-4-5') as the primary model for AI coaching"
    reason: "Cost-effective yet capable model for relationship advice"
  - id: "06-01-02"
    decision: "Fetch newest-first then reverse for chronological conversation history"
    reason: "Ensures LIMIT applies to most recent messages while returning them in order"
  - id: "06-01-03"
    decision: "Use as any cast for Supabase insert (ai_coach_messages)"
    reason: "DB types file doesn't include new table yet -- consistent with existing pattern"
metrics:
  duration: ~3m
  completed: 2026-03-05
---

# Phase 06 Plan 01: Claude API Integration Summary

**One-liner:** Real Claude coaching via Vercel AI SDK with conversation persistence in Supabase ai_coach_messages table.

## What Was Done

### Task 1: Install Vercel AI SDK and create supporting modules
- Installed `ai`, `@ai-sdk/anthropic`, `@ai-sdk/openai` packages
- Created `src/lib/ai/prompts.ts` with comprehensive COACH_SYSTEM_PROMPT including safety guardrails (crisis resources, no medical/legal/financial advice, stay on topic)
- Created `src/lib/ai/conversation.ts` with `getConversationHistory` and `saveMessages` functions using SupabaseClient parameter pattern
- Created `migrations/0006_ai_coach_messages.sql` with ai_coach_messages table (UUID PK, user_id, relationship_id, role, content, model_used, created_at) plus ai_coach_rate_limits table
- **Commit:** f0c06c3

### Task 2: Replace keyword-matching stub with Claude API integration
- Rewrote `src/api/ai-coach.ts` completely: removed all keyword-matching logic
- POST /ask now: loads conversation history, calls `generateText` with Claude, saves both messages
- GET /history/:relationship_id now returns real messages from database
- Applied `requireAuth()` middleware to all routes
- Error handling: ZodError -> 400, LLM errors -> 500 with friendly message
- **Commit:** 35cbb3d

## Deviations from Plan

None -- plan executed exactly as written.

## Decisions Made

| ID | Decision | Reason |
|----|----------|--------|
| 06-01-01 | claude-haiku-4-5 as primary model | Cost-effective yet capable for relationship coaching |
| 06-01-02 | Fetch newest-first then reverse | LIMIT applies to recent messages, returned chronologically |
| 06-01-03 | `as any` for Supabase insert | DB types file doesn't include new table (consistent pattern) |

## Verification Results

- `npm run build` succeeds (2.80s, 725 modules)
- No keyword-matching code remains (`grep -r "generateAIResponse"` returns nothing)
- `generateText` import confirmed in ai-coach.ts
- All 3 new files exist with correct exports
- requireAuth, getConversationHistory, saveMessages all wired up

## Next Phase Readiness

- Plan 06-02 (tiered routing) can proceed -- ai-coach.ts is ready for coach-router integration
- Plan 06-03 (rate limiting + caching) can proceed -- endpoint structure supports middleware addition
- ANTHROPIC_API_KEY and OPENAI_API_KEY must be set in Vercel dashboard for production use
