---
phase: 03-database-consolidation
plan: 04
subsystem: api-database
tags: [supabase, migration, neon-removal, rpc, zod-validation]
dependency-graph:
  requires: ["03-01"]
  provides: ["Tier 3+4 API files fully on Supabase", "RPC functions for complex search"]
  affects: ["03-05"]
tech-stack:
  added: []
  patterns: ["supabase.rpc() for complex SQL", "fetch-then-enrich for JOINs", "zValidator middleware"]
key-files:
  created:
    - supabase-migrations/006_search_functions.sql
    - src/lib/validation/schemas/challenges.ts
    - src/lib/validation/schemas/feed.ts
  modified:
    - src/api/challenges.ts
    - src/api/relationships.ts
    - src/api/posts.ts
    - src/api/feed.ts
    - src/api/discovery.ts
    - src/api/analytics.ts
    - src/api/messaging.ts
    - src/api/communities.ts
    - src/api/social.ts
decisions:
  - id: "03-04-01"
    decision: "Use supabase.rpc() for discovery search queries instead of query builder"
    rationale: "Complex search with blocked-user filtering, relevance ranking, and conditional joins cannot be expressed in Supabase query builder"
  - id: "03-04-02"
    decision: "Fetch-then-enrich pattern for all JOIN queries"
    rationale: "Supabase query builder handles single-table queries well; multi-table JOINs are done by fetching main data then batch-fetching related data via .in()"
  - id: "03-04-03"
    decision: "Read-then-update pattern for counter increments"
    rationale: "Supabase query builder lacks SQL increment syntax; read current value then update with new value"
  - id: "03-04-04"
    decision: "JS aggregation replaces SQL GROUP BY in analytics"
    rationale: "Supabase query builder cannot express GROUP BY; fetch raw rows and aggregate with Map in JavaScript"
metrics:
  duration: "~8 minutes"
  completed: "2026-03-05"
---

# Phase 3 Plan 4: Tier 3+4 API Migration Summary

**One-liner:** Migrated 9 complex API files (220+ DB calls total) from Neon raw SQL to Supabase client with Zod validation and RPC functions for search.

## What Was Done

### Task 1: Tier 3 Migration (challenges, relationships, posts, feed)
**Commit:** `ac36ca0`

Migrated 4 API files with 83 combined DB calls:
- **challenges.ts** (17 calls): Challenge CRUD, participation tracking, progress updates. Created new validation schema file.
- **relationships.ts** (18 calls): Bidirectional relationship queries using `.or()` filter. Partner lookups via `.in('id', [user1, user2])`.
- **posts.ts** (20 calls): Post CRUD with visibility checks. Post count increment via read-then-update.
- **feed.ts** (28 calls): Most complex Tier 3 file. Enrichment pattern -- fetch posts, batch-fetch authors/communities/reactions, join via Maps. Blocked user filtering via helper. Created new validation schema file.

### Task 2: Tier 4 Migration (discovery, analytics, messaging, communities, social)
**Commit:** `b0f89d2`

Migrated 5 API files with 220 combined DB calls plus created RPC migration:
- **discovery.ts** (37 calls): Uses `supabase.rpc()` for 4 search functions. Mixed placeholder bugs (`$N` and `?` coexisting) completely eliminated.
- **analytics.ts** (38 calls): Admin-only routes. Uses `{ count: 'exact', head: true }` for counts. GROUP BY replaced with fetch-all + Map aggregation.
- **messaging.ts** (44 calls): Helper functions converted. Direct conversation existence check uses multi-step query.
- **communities.ts** (45 calls): Community CRUD, membership, invitations. zValidator on all input-accepting endpoints.
- **social.ts** (56 calls): Reactions, comments, connections, blocks, reports. `checkIfBlocked` helper uses `.or()` for bidirectional block check.
- **006_search_functions.sql**: 4 PostgreSQL RPC functions (search_users_v1, search_communities_v1, search_posts_v1, discover_users_v1) with SECURITY DEFINER.

## Verification Results

- `grep -r "createDatabase" src/api/` -- **0 matches** (zero Neon imports in entire API directory)
- `grep -r "blockedIds.map.*join" src/api/discovery.ts` -- **0 matches** (placeholder bug eliminated)
- `grep "rpc(" src/api/discovery.ts` -- **5 RPC calls** confirmed
- `ls supabase-migrations/006_search_functions.sql` -- exists

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Created validation schemas for challenges.ts and feed.ts**
- **Found during:** Task 1
- **Issue:** challenges.ts and feed.ts had no corresponding validation schema files (03-01 only created schemas for files that existed at that time)
- **Fix:** Created `src/lib/validation/schemas/challenges.ts` and `src/lib/validation/schemas/feed.ts` with schemas matching all endpoint inputs
- **Commit:** ac36ca0

**2. [Rule 1 - Bug] Fixed `page` variable reference in communities.ts and social.ts**
- **Found during:** Task 1 and Task 2
- **Issue:** Original code referenced undeclared `page` variable in pagination responses
- **Fix:** Computed page from offset/limit: `Math.floor(offset / limit) + 1`
- **Commit:** ac36ca0, b0f89d2

## Key Patterns Established

1. **Fetch-then-enrich**: Main data fetched first, related entities batch-fetched via `.in('id', [...ids])`, joined in JavaScript using Maps
2. **RPC for complex SQL**: Queries with dynamic conditions, blocked-user filtering, and relevance ranking use PostgreSQL functions called via `supabase.rpc()`
3. **Counter increment**: Read current value, compute new value, update (no SQL `column = column + 1`)
4. **Bidirectional checks**: `.or()` filter for checking both directions of blocks/connections

## Next Phase Readiness

**03-05 (Remove Neon adapter):** Ready. Zero `createDatabase` imports remain in src/api/. The `src/db.ts` Neon adapter can now be safely removed along with the `@neondatabase/serverless` dependency.
