---
phase: 03-database-consolidation
verified: 2026-03-05T14:00:00Z
status: gaps_found
score: 4/5 must-haves verified
gaps:
  - truth: "All API endpoints validate input with Zod schemas"
    status: partial
    reason: "5 API files with 22 mutating (POST/PUT/DELETE) endpoints have zero Zod validation; they use raw c.req.json() with no schema enforcement"
    artifacts:
      - path: "src/api/supabase-auth.ts"
        issue: "9 POST endpoints (signup, login, logout, forgot-password, reset-password, refresh, oauth/google, oauth/facebook, update-profile) with no Zod validation"
      - path: "src/api/email.ts"
        issue: "5 POST endpoints (invite-partner, subscription-confirmation, password-reset, notify-gift, milestone-reminder) with no Zod validation"
      - path: "src/api/video.ts"
        issue: "4 POST/DELETE endpoints (token, rooms, rooms/:roomName, date-room) with no Zod validation"
      - path: "src/api/quiz.ts"
        issue: "2 POST endpoints (responses, responses/bulk) with no Zod validation; also uses hardcoded mock data instead of DB"
      - path: "src/api/notifications.ts"
        issue: "2 PUT endpoints (read, read-all) with no Zod validation"
    missing:
      - "Zod schemas for supabase-auth.ts endpoints (signup, login, forgot-password, reset-password, update-profile body fields)"
      - "Zod schemas for email.ts endpoints (all 5 POST bodies)"
      - "Zod schemas for video.ts endpoints (token, rooms, date-room bodies)"
      - "Zod schemas for quiz.ts endpoints (responses, responses/bulk bodies)"
      - "zValidator middleware wired into all 22 unvalidated endpoints"
---

# Phase 3: Database Consolidation & Validation Verification Report

**Phase Goal:** Single database layer -- Supabase client only, with input validation on all endpoints
**Verified:** 2026-03-05T14:00:00Z
**Status:** gaps_found
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | No imports from src/db.ts remain in any API route | VERIFIED | grep for `from.*db` across src/ returns zero matches; `createDatabase` has zero references |
| 2 | src/db.ts (Neon adapter) is deleted | VERIFIED | File does not exist; src/db-supabase.ts also deleted; @neondatabase/serverless removed from package.json |
| 3 | All API endpoints validate input with Zod schemas | FAILED | 5 API files (supabase-auth.ts, email.ts, video.ts, quiz.ts, notifications.ts) totaling 22 mutating endpoints have zero Zod validation; they use raw `c.req.json()` |
| 4 | RLS policies work correctly (column names match) | VERIFIED | RLS migration uses `user1_id`/`user2_id` matching schema migration's column definitions; all policies reference correct column names |
| 5 | Supabase migrations are the single source of truth for schema | VERIFIED | `migrations/` directory (6 D1 SQL files) deleted; `scripts/` directory deleted; only `supabase-migrations/` remains with 6 migration files |

**Score:** 4/5 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/db.ts` | Deleted | VERIFIED (deleted) | File does not exist |
| `src/db-supabase.ts` | Deleted | VERIFIED (deleted) | File does not exist |
| `migrations/` | Deleted | VERIFIED (deleted) | Directory does not exist |
| `scripts/` | Deleted | VERIFIED (deleted) | Directory does not exist |
| `supabase-migrations/` | Exists as sole migration source | VERIFIED | 6 SQL files present (001-006) |
| `src/lib/validation/` | Zod schemas for all domains | PARTIAL | 15 schema files exist covering most domains; missing schemas for auth, email, video, quiz, notifications |
| `src/lib/validation/index.ts` | Validation infrastructure | VERIFIED | Exports zodErrorHandler, z, zValidator, common schemas |
| `package.json` | zod dependency | VERIFIED | `zod ^4.3.6` and `@hono/zod-validator ^0.7.6` present |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| All src/api/*.ts | Supabase | createAdminClient | VERIFIED | 24 API files import/use Supabase; 5 files (ai-coach, email, quiz, recommendations, video) don't use any DB (acceptable -- they use external services or mock data) |
| src/utils.ts | Supabase | createAdminClient | VERIFIED | 9 createAdminClient calls; all 10 utility functions migrated from raw SQL |
| src/index.tsx | Supabase | createAdminClient | VERIFIED | 3 inline routes use createAdminClient |
| Validation schemas | API routes | zValidator middleware | PARTIAL | 82 zValidator usages across 18 API files; 5 API files with mutating endpoints have zero zValidator |
| src/api/*.ts | src/db.ts | import | VERIFIED (severed) | Zero imports from db.ts; zero references to createDatabase |
| @neondatabase/serverless | package.json | dependency | VERIFIED (removed) | Dependency no longer in package.json |

### Requirements Coverage

| Requirement | Status | Blocking Issue |
|-------------|--------|----------------|
| DB-01: All API routes use Supabase client | SATISFIED | Neon adapter fully removed |
| DB-02: Single migration system using Supabase migrations | SATISFIED | D1 migrations and scripts deleted |
| DB-03: RLS policies applied and working | SATISFIED | Column names match; audit confirms correctness |
| DB-04: No raw SQL string interpolation | SATISFIED | All routes use Supabase query builder |
| DB-05: Database connection via Supabase client | SATISFIED | createAdminClient is sole DB accessor |
| VAL-01: All API endpoints validate input with Zod | BLOCKED | 22 mutating endpoints in 5 files lack validation |
| VAL-02: Zod in package.json | SATISFIED | zod ^4.3.6 installed |
| VAL-03: Invalid input returns 400 with descriptive errors | PARTIAL | zodErrorHandler configured for validated routes; unvalidated routes have ad-hoc or no error handling |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| src/api/ai-coach.ts | 15 | TODO: Integrate with actual AI service | Info | Expected -- Phase 6 scope |
| src/api/ai-coach.ts | 69 | TODO: Implement chat history | Info | Expected -- Phase 6 scope |
| src/api/quiz.ts | 97 | Comment: "would go to quiz_responses table in production" | Warning | Quiz POST returns mock success without DB persistence |
| src/api/quiz.ts | 175 | Comment: "In production, this would query the database" + returns hardcoded mock | Warning | Quiz history returns fake data |
| src/api/supabase-auth.ts | 33-503 | 9 POST endpoints with raw c.req.json() | Blocker | Auth endpoints accept unvalidated input |
| src/api/email.ts | 177-255 | 5 POST endpoints with raw c.req.json() | Blocker | Email endpoints accept unvalidated input |
| src/api/video.ts | 17-200 | 4 POST endpoints with raw c.req.json() | Blocker | Video endpoints accept unvalidated input |

### Human Verification Required

### 1. RLS Policy Enforcement
**Test:** Using a Supabase anon key (not service role), attempt to query another user's check-ins
**Expected:** Query returns empty result or error (RLS blocks access)
**Why human:** All current routes use createAdminClient (service role) which bypasses RLS; cannot verify RLS enforcement without a live database test with anon key

### 2. Build and Runtime Smoke Test
**Test:** Run `npm run dev`, hit a migrated endpoint (e.g., GET /api/checkins/:relationshipId)
**Expected:** Returns data from Supabase (not Neon errors)
**Why human:** Structural verification confirms wiring but cannot verify runtime Supabase connectivity

### 3. Zod Error Response Format
**Test:** POST to /api/checkins with invalid data (e.g., missing required fields)
**Expected:** 400 response with descriptive Zod error message
**Why human:** Need to verify zodErrorHandler produces user-friendly error format at runtime

## Gaps Summary

The database consolidation (Neon removal, Supabase migration) is fully complete. All DB-* requirements are satisfied. The gap is in validation coverage (VAL-01): 5 API files containing 22 mutating endpoints have no Zod validation at all. These files are:

1. **supabase-auth.ts** (9 endpoints) -- highest risk, handles signup/login/password-reset with raw JSON parsing
2. **email.ts** (5 endpoints) -- accepts email addresses and user data without validation
3. **video.ts** (4 endpoints) -- accepts room names and participant data without validation
4. **quiz.ts** (2 endpoints) -- accepts quiz responses without validation
5. **notifications.ts** (2 endpoints) -- accepts notification IDs without validation

Additionally, many GET endpoints across multiple files (discovery.ts, feed.ts, etc.) read query params via `c.req.query()` without Zod validation, though these are lower risk since query params are strings by nature.

The `ai-coach.ts` file is a special case: it has inline Zod validation via `askCoachSchema.parse(body)` rather than zValidator middleware, which provides equivalent protection.

---

_Verified: 2026-03-05T14:00:00Z_
_Verifier: Claude (gsd-verifier)_
