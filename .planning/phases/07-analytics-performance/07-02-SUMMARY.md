---
phase: 07
plan: 02
subsystem: performance
tags: [messaging, discovery, n+1, rpc, postgresql, performance]
completed: 2026-03-05
duration: ~2m
dependency_graph:
  requires: [phase-03]
  provides: [optimized-messaging, db-trending-topics]
  affects: [messaging-api, discovery-api]
tech_stack:
  added: []
  patterns: [batch-in-queries, supabase-rpc, js-fallback-for-missing-rpc]
key_files:
  created: [migrations/0010_extract_trending_topics.sql]
  modified: [src/api/messaging.ts, src/api/discovery.ts]
decisions:
  - id: "07-02-01"
    decision: "Use oldest last_read_at as floor for batch unread message query"
    rationale: "Fetches superset of potentially unread messages in 1 query, filters per-conversation in memory"
  - id: "07-02-02"
    decision: "Keep JS fallback for trending topics if RPC function not deployed yet"
    rationale: "Migration needs to be run on Supabase -- graceful degradation until then"
  - id: "07-02-03"
    decision: "Reduce fallback hashtag fetch limit from 1000 to 500 rows"
    rationale: "500 is sufficient for hashtag extraction while reducing memory/bandwidth"
  - id: "07-02-04"
    decision: "Rename response field from postCount to post_count for RPC consistency"
    rationale: "RPC returns snake_case -- keeping consistent across primary and fallback paths"
---

# Phase 7 Plan 2: Fix N+1 Queries and Trending Topics Summary

**One-liner:** Messaging conversations endpoint reduced from 1+N*3 queries to 5 fixed batch queries; trending topics now uses PostgreSQL regexp_matches RPC with JS fallback.

## What Was Done

### Task 1: Fix N+1 query pattern in messaging conversations

- Replaced `Promise.all(...map(async ...))` block with batch-fetch approach
- Query 3: Batch-fetch all participants across all conversations via `.in('conversation_id', convIds)`
- Query 4: Batch-fetch all participant user details via `.in('id', participantUserIds)`
- Query 5: Batch-fetch all unread message candidates via `.in('conversation_id', convIds)` with `gte('created_at', oldestReadAt)`
- In-memory: Build participant maps and unread counts per conversation
- Removed unused `getUnreadCount` helper function (was doing 2 queries per call)
- For 20 conversations: reduced from 61-81 queries to exactly 5

### Task 2: Replace in-memory hashtag extraction with Supabase RPC

- Created `migrations/0010_extract_trending_topics.sql` with PostgreSQL function using `regexp_matches` + `LATERAL` + `GROUP BY`
- Updated `/explore/topics` endpoint to call `extract_trending_topics` RPC as primary path
- Added JS fallback (500-row limit, down from 1000) if RPC function not deployed yet
- Response field standardized to `post_count` (was `postCount`)

## Deviations from Plan

None -- plan executed exactly as written.

## Verification Results

- `grep -n "Promise.all.*map|\.map(async"` -- no N+1 in conversations listing
- `grep -n ".in('conversation_id'"` -- batch queries present (lines 94, 129)
- `grep -n "rpc.*trending"` -- RPC call on line 639
- `grep -n "limit(1000)"` -- zero matches
- `npm run build` -- passes successfully

## Pending Actions

- Run migration `migrations/0010_extract_trending_topics.sql` on Supabase to enable RPC path (JS fallback works until then)

## Commits

| Commit | Description |
|--------|-------------|
| b0ec2cc | perf(07-02): fix N+1 query pattern in messaging conversations endpoint |
| 606ac04 | perf(07-02): replace in-memory hashtag extraction with Supabase RPC |
