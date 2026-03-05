---
phase: 03-database-consolidation
plan: 02
subsystem: api-migration
tags: [supabase, neon-removal, zod-validation, query-builder]

dependency-graph:
  requires: [03-01]
  provides: [tier1-api-migration, supabase-crud-pattern]
  affects: [03-03, 03-04, 03-05]

tech-stack:
  added: []
  patterns: [createAdminClient-for-crud, as-any-insert-for-schema-drift, column-name-mapping, zValidator-middleware]

key-files:
  created: []
  modified:
    - src/api/checkins.ts
    - src/api/dates.ts
    - src/api/experiences.ts
    - src/api/intimacy.ts
    - src/api/gamification.ts
    - src/api/goals.ts
    - src/api/activities.ts
    - src/api/dashboard.ts
    - src/lib/validation/index.ts

decisions:
  - id: "03-02-01"
    decision: "Use `as any` casts on Supabase insert/update objects where DB types diverge from actual schema"
    reasoning: "Supabase Database types file has fewer columns than actual DB (e.g., daily_checkins types lack support_needed, highlight_of_day). Casting allows migration to proceed; types file should be regenerated from live schema in a future plan."
  - id: "03-02-02"
    decision: "Map Supabase column names to frontend-expected response shapes in GET handlers"
    reasoning: "Supabase schema uses normalized names (title, date, cost) while frontend expects original names (goal_name, planned_date, cost_amount). Mapping in the API layer preserves backward compatibility."
  - id: "03-02-03"
    decision: "Fixed zodErrorHandler to use `any` type instead of `ZodError` for Zod v4 compatibility"
    reasoning: "Zod v4 uses `$ZodError` with different method signatures than v3's `ZodError`. Using `any` with runtime `flatten()` check ensures compatibility across versions."
  - id: "03-02-04"
    decision: "Inline Zod schemas for dates, experiences, intimacy, gamification (no pre-existing schema files)"
    reasoning: "03-01 created schemas only for API files with complex validation needs. These 4 files had simpler schemas defined inline to avoid creating additional schema files for mock/stub endpoints."

metrics:
  duration: "~6.4 minutes"
  completed: "2026-03-05"
---

# Phase 3 Plan 2: Tier 1 API Migration (Neon to Supabase) Summary

**One-liner:** All 8 Tier 1 API files migrated from Neon raw SQL to Supabase query builder with Zod validation on all input endpoints.

## What Was Done

### Task 1: Migrate checkins.ts, dates.ts, experiences.ts, intimacy.ts

**checkins.ts** -- Real DB migration. Replaced `db.run()` INSERT with `supabase.from('daily_checkins').insert()`, replaced `db.all()` SELECT+JOIN with `supabase.from('daily_checkins').select('*, users!...(name)')`. Added `createCheckinSchema` and `checkinQuerySchema` validators. Mapped Supabase column names (mood, satisfaction, gratitude, notes) from API field names (mood_score, relationship_satisfaction, gratitude_note, highlight_of_day).

**dates.ts** -- Real DB migration. Replaced INSERT/SELECT with Supabase query builder. Added inline `createDateSchema` and `datesQuerySchema` validators. Mapped columns: name<->event_name, date<->date_value.

**experiences.ts** -- Mostly mock data. Removed unused `createDatabase` import, added `createAdminClient` import. Added `saveExperienceSchema`, `completeExperienceSchema`, `experienceFilterSchema` validators. No actual DB calls changed (endpoints return sample data).

**intimacy.ts** -- Entirely mock data. Removed `createDatabase`, added `createAdminClient` import. Added `trackIntimacySchema` and `intimacyStatsQuerySchema` validators with proper `eventType` enum validation.

- **Commit:** 6d454d3

### Task 2: Migrate gamification.ts, goals.ts, activities.ts, dashboard.ts

**gamification.ts** -- Mostly mock data. Removed `createDatabase`, added `createAdminClient` import. Added `redeemRewardSchema`, `rewardsQuerySchema`, `userQuerySchema` validators. Removed manual userId check (now handled by Zod).

**goals.ts** -- Real DB migration. Replaced INSERT, SELECT, UPDATE with Supabase query builder. Added `createGoalSchema`, `updateGoalProgressSchema`, `goalQuerySchema` validators. Mapped: title<->goal_name, description<->goal_description, progress_percentage<->current_progress.

**activities.ts** -- Real DB migration. Replaced INSERT, SELECT, UPDATE with Supabase query builder. Added `createActivitySchema`, `completeActivitySchema`, `activityQuerySchema` validators. Mapped: title<->activity_name, date<->planned_date, cost<->cost_amount.

**dashboard.ts** -- Real DB migration (5 queries). Replaced all `db.all()` calls with Supabase queries. Added graceful try/catch for `challenge_participation` and `user_achievements` tables (not in Supabase types yet). Maps column names for goals and activities in response.

**Also fixed:** `zodErrorHandler` in `src/lib/validation/index.ts` -- changed `ZodError` type to `any` for Zod v4 compatibility.

- **Commit:** 00744dd

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] zodErrorHandler Zod v4 type incompatibility**
- **Found during:** Task 2 (TypeScript compilation check)
- **Issue:** `zodErrorHandler` typed its parameter as `ZodError` from Zod v3, but Zod v4 uses `$ZodError` with different method signatures, causing TS2345 errors across all files using `zValidator`
- **Fix:** Changed error parameter type to `any` with runtime `flatten()` check
- **Files modified:** src/lib/validation/index.ts
- **Commit:** 00744dd

**2. [Rule 3 - Blocking] Supabase Database types missing columns for actual schema**
- **Found during:** Task 1/2 (TypeScript compilation)
- **Issue:** Supabase `Database` types have fewer columns than the actual Neon schema (e.g., `daily_checkins` lacks `support_needed`, `highlight_of_day`). Strict typing caused `never` type errors on inserts/updates.
- **Fix:** Added `as any` casts on insert/update objects; cast `from()` calls for update chains. This is a known migration artifact -- types should be regenerated from live Supabase schema.
- **Files modified:** checkins.ts, dates.ts, goals.ts, activities.ts
- **Commit:** 00744dd

**3. [Rule 2 - Missing Critical] Inline Zod schemas for files without pre-existing schemas**
- **Found during:** Task 1
- **Issue:** 03-01 only created schema files for checkins, goals, activities. No schemas existed for dates, experiences, intimacy, gamification.
- **Fix:** Created inline Zod schemas in each file for input validation
- **Files modified:** dates.ts, experiences.ts, intimacy.ts, gamification.ts
- **Commit:** 6d454d3

## Verification Results

- `grep -r "createDatabase|from.*'../db'"` across all 8 files: **empty** (zero Neon imports)
- `grep -c "createAdminClient"` across all 8 files: **all have 1+ matches**
- `grep -c "zValidator"` in checkins, goals, activities: **3, 4, 4 matches**
- `npx tsc --noEmit`: **no new errors** in any of the 8 migrated files (pre-existing mobile/ and other non-migrated file errors only)

## Next Phase Readiness

Plans 03-03 and 03-04 (Tier 2 and Tier 3 migrations) can follow the exact same pattern established here:
1. Import `createAdminClient` from `../lib/supabase/server`
2. Import or define Zod schemas, wire with `zValidator`
3. Map Supabase column names to frontend-expected response shapes
4. Use `as any` casts where Supabase types diverge from actual schema
5. Regenerating Supabase types from live schema (recommended before 03-05) would eliminate the need for `as any` casts
