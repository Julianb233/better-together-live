# Phase 3: Database Consolidation & Validation - Research

**Researched:** 2026-03-05
**Domain:** Supabase JS client migration, Zod input validation, Hono API routes
**Confidence:** HIGH

## Summary

This phase migrates 26 API route files from Neon raw SQL (`createDatabase` from `src/db.ts`) to the Supabase JS client (`@supabase/supabase-js`), and adds Zod input validation to all endpoints.

The codebase already has a fully-built Supabase infrastructure: `src/db-supabase.ts` (SupabaseDatabase wrapper), `src/lib/supabase/` (server client, admin client, middleware, typed Database interface), and `supabase-auth.ts` as a working reference. The migration is **mechanical for 25 of 26 files** -- replace `createDatabase(c.env)` with Supabase client calls, convert raw SQL to query builder. The exception is `discovery.ts` (956 lines) which has dynamic SQL with mixed placeholder styles (`$N` and `?`) and conditional query building that requires careful decomposition.

Zod is not yet a dependency. It needs to be added and validation middleware created for Hono.

**Primary recommendation:** Use Supabase query builder (`.from().select()`) for all simple CRUD, use Supabase RPC functions for the few complex queries that cannot be expressed with the query builder (discovery search with dynamic joins and conditional ordering).

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| @supabase/supabase-js | ^2.89.0 | Database client + auth | Already in package.json, typed Database interface exists |
| zod | ^3.24 | Input validation | Industry standard, works with TypeScript, Hono has built-in support |
| hono | ^4.9.2 | Web framework | Already the framework, has Zod validator middleware |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @hono/zod-validator | ^0.4 | Zod middleware for Hono | Every route that accepts input (body, query, params) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Supabase query builder | Supabase RPC (raw SQL) | RPC needed ONLY for complex discovery queries with dynamic joins; query builder preferred for everything else |
| @hono/zod-validator | Manual Zod in handlers | Validator middleware is cleaner, but manual parse is fine for complex cases |

### Do NOT Use
- `src/db.ts` (Neon) -- this is what we are removing
- `src/db-supabase.ts` SupabaseDatabase wrapper's `.query()` method -- it calls an `execute_sql` RPC that does not exist; use the query builder or typed RPC instead

**Installation:**
```bash
npm install zod @hono/zod-validator
```

## Architecture Patterns

### Migration Pattern (Simple CRUD -- 80% of routes)

**Before (Neon raw SQL):**
```typescript
import { createDatabase } from '../db'

const db = createDatabase(c.env as Env)
const user = await db.first<any>(
  `SELECT id, name, email FROM users WHERE id = $1`,
  [userId]
)
```

**After (Supabase query builder):**
```typescript
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'

const supabase = createAdminClient(c.env as SupabaseEnv)
const { data: user, error } = await supabase
  .from('users')
  .select('id, name, email')
  .eq('id', userId)
  .single()

if (error && error.code !== 'PGRST116') throw error
```

### Migration Pattern (INSERT)

**Before:**
```typescript
await db.run(`
  INSERT INTO daily_checkins (id, relationship_id, user_id, ...)
  VALUES ($1, $2, $3, ...)
`, [checkinId, relationshipId, userId, ...])
```

**After:**
```typescript
const { data, error } = await supabase
  .from('daily_checkins')
  .insert({
    id: checkinId,
    relationship_id: relationshipId,
    user_id: userId,
    ...
  })
  .select()
  .single()
```

### Migration Pattern (Complex Queries -- discovery.ts)

For queries with dynamic WHERE clauses, conditional JOINs, and CASE expressions, use Supabase Database Functions (RPC):

```sql
-- Create in supabase-migrations/006_search_functions.sql
CREATE OR REPLACE FUNCTION search_users(
  search_query text,
  search_pattern text,
  current_user_id uuid DEFAULT NULL,
  blocked_ids uuid[] DEFAULT '{}',
  result_limit int DEFAULT 20,
  result_offset int DEFAULT 0
) RETURNS TABLE (
  id uuid, name text, nickname text, profile_photo_url text,
  relationship_type text, connection_status text, follower_count bigint
) AS $$
BEGIN
  RETURN QUERY
  SELECT ... -- complex query here with proper parameterization
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

```typescript
// Call from TypeScript
const { data, error } = await supabase.rpc('search_users', {
  search_query: q,
  search_pattern: `%${q.toLowerCase()}%`,
  current_user_id: userId,
  blocked_ids: blockedIds,
  result_limit: limit,
  result_offset: offset
})
```

### Zod Validation Pattern

**With @hono/zod-validator:**
```typescript
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const checkinSchema = z.object({
  relationship_id: z.string().uuid(),
  user_id: z.string().uuid(),
  connection_score: z.number().min(1).max(10).optional(),
  mood_score: z.number().min(1).max(10).optional(),
  gratitude_note: z.string().max(500).optional(),
})

checkinsApi.post('/',
  zValidator('json', checkinSchema, (result, c) => {
    if (!result.success) {
      return c.json({
        error: 'Invalid input',
        details: result.error.flatten().fieldErrors
      }, 400)
    }
  }),
  async (c) => {
    const data = c.req.valid('json')
    // data is fully typed
  }
)
```

**For query parameters:**
```typescript
const searchQuerySchema = z.object({
  q: z.string().min(2),
  type: z.enum(['all', 'users', 'communities', 'posts']).default('all'),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

discoveryApi.get('/search',
  zValidator('query', searchQuerySchema),
  async (c) => {
    const { q, type, page, limit } = c.req.valid('query')
  }
)
```

### Recommended Project Structure Changes

```
src/
  db.ts                     # DELETE (Neon -- being removed)
  db-supabase.ts            # KEEP but refactor (remove raw SQL method)
  lib/
    supabase/
      types.ts              # KEEP (already typed)
      server.ts             # KEEP (createAdminClient, createServerClient)
      middleware.ts          # KEEP (requireAuth, optionalAuth)
    validation/
      schemas/              # NEW - Zod schemas per domain
        users.ts
        checkins.ts
        discovery.ts
        ...
      index.ts              # NEW - shared validators and error formatter
  api/
    *.ts                    # MODIFY - replace Neon with Supabase + add Zod
```

### Anti-Patterns to Avoid
- **Raw SQL via SupabaseDatabase.query():** The current `db-supabase.ts` has a `.query()` method that calls `rpc('execute_sql')` which does not exist. Never use this method.
- **Service role key for user-scoped queries:** Use `createAdminClient` only for server-side operations. For RLS-respecting queries, use `createClientWithContext` with the user's session.
- **Mixing `?` and `$N` placeholders:** discovery.ts currently does this. Supabase query builder eliminates this entire class of bugs.
- **String interpolation in SQL:** `blockedIds.map(() => '?').join(', ')` pattern must be eliminated entirely.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Input validation | Manual if/else checks | Zod + @hono/zod-validator | Type inference, consistent errors, composable schemas |
| Query building | String concatenation with conditionals | Supabase query builder | SQL injection, parameter counting bugs, unmaintainable |
| Pagination | Manual LIMIT/OFFSET SQL | Supabase `.range(from, to)` | Cleaner, integrates with `.count()` |
| Error formatting | Ad-hoc error objects | Zod `.flatten()` or `.format()` | Consistent 400 responses across all endpoints |
| Complex search queries | Dynamic SQL string building | PostgreSQL functions via RPC | Parameterized, testable, no injection risk |
| UUID validation | Regex or no validation | `z.string().uuid()` | Catches invalid IDs before DB round-trip |

**Key insight:** The current codebase has ~400 instances of `db.all()`, `db.first()`, `db.run()` using raw SQL strings. Every one is a potential SQL injection vector (especially with the `?` placeholder bugs in discovery.ts). The Supabase query builder eliminates this entirely for CRUD operations.

## Common Pitfalls

### Pitfall 1: PGRST116 "No rows returned" from .single()
**What goes wrong:** Supabase `.single()` returns an error with code `PGRST116` when no rows match, instead of returning null.
**Why it happens:** PostgREST considers zero results an error for `.single()`.
**How to avoid:** Always check `error.code !== 'PGRST116'` before throwing, or use `.maybeSingle()` instead.
**Warning signs:** Endpoints returning 500 instead of 404 for missing resources.

### Pitfall 2: RLS blocking service-role queries
**What goes wrong:** Using `createServerClient` (anon key) for admin operations that need to bypass RLS.
**Why it happens:** The anon key respects RLS policies. The current API uses no RLS (Neon has no RLS concept).
**How to avoid:** Use `createAdminClient` (service role key) for all current API routes during migration. Add RLS-aware queries later as a separate concern.
**Warning signs:** Queries returning empty results that should have data.

### Pitfall 3: discovery.ts mixed placeholder styles
**What goes wrong:** The file uses `$N` for Neon positional params AND `?` for dynamic blocked-user filters. These are DIFFERENT placeholder systems. Neon only supports `$N`.
**Why it happens:** The code was written with mixed SQL dialects. The `?` placeholders in the blocked filter likely never worked correctly.
**How to avoid:** Convert ALL discovery queries to either Supabase query builder or RPC functions. Do not attempt to "fix" the SQL strings.
**Warning signs:** The `blockedIds.map(() => '?').join(', ')` pattern on lines 60, 217, 283, 640, 766.

### Pitfall 4: Type mismatch after migration
**What goes wrong:** Supabase query builder returns typed data based on `Database` types. The current code uses `any` everywhere.
**Why it happens:** Raw SQL has no type information; developers used `<any>` generics.
**How to avoid:** Use the existing `Database` types from `src/lib/supabase/types.ts`. Replace `<any>` with proper table types.
**Warning signs:** TypeScript errors after switching from `db.all<any>()` to typed Supabase queries.

### Pitfall 5: Forgetting to remove Neon import chains
**What goes wrong:** `@neondatabase/serverless` stays in package.json; `src/db.ts` still exists; some files still import from it.
**Why it happens:** Incremental migration leaves behind dead imports.
**How to avoid:** After all 26 files are migrated, delete `src/db.ts`, remove `@neondatabase/serverless` from package.json, and run `tsc --noEmit` to verify no remaining imports.
**Warning signs:** `grep -r "from.*db'" src/api/` returns results after migration.

### Pitfall 6: parseInt without validation
**What goes wrong:** `parseInt(c.req.query('limit') || '20')` can return NaN or negative numbers.
**Why it happens:** No validation on query params currently.
**How to avoid:** Zod `z.coerce.number().int().positive().default(20)` handles this completely.
**Warning signs:** NaN in SQL LIMIT clauses causing Postgres errors.

## Code Examples

### Example 1: Full route migration (checkins.ts)

```typescript
// BEFORE
import { createDatabase } from '../db'
import type { Env } from '../types'

checkinsApi.post('/', async (c: Context) => {
  const db = createDatabase(c.env as Env)
  const { relationship_id, user_id, connection_score } = await c.req.json()
  if (!relationship_id || !user_id) {
    return c.json({ error: 'Relationship ID and User ID are required' }, 400)
  }
  await db.run(`INSERT INTO daily_checkins (...) VALUES ($1, $2, ...)`, [...])
})

// AFTER
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'

const createCheckinSchema = z.object({
  relationship_id: z.string().uuid(),
  user_id: z.string().uuid(),
  connection_score: z.number().min(1).max(10).optional(),
  mood_score: z.number().min(1).max(10).optional(),
  relationship_satisfaction: z.number().min(1).max(10).optional(),
  gratitude_note: z.string().max(500).optional(),
  support_needed: z.string().max(500).optional(),
  highlight_of_day: z.string().max(500).optional(),
})

checkinsApi.post('/',
  zValidator('json', createCheckinSchema, (result, c) => {
    if (!result.success) {
      return c.json({ error: 'Invalid input', details: result.error.flatten().fieldErrors }, 400)
    }
  }),
  async (c) => {
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const data = c.req.valid('json')
    const { data: checkin, error } = await supabase
      .from('daily_checkins')
      .insert({
        id: generateId(),
        ...data,
        checkin_date: getCurrentDate(),
        created_at: getCurrentDateTime(),
      })
      .select()
      .single()
    if (error) throw error
    return c.json({ message: 'Check-in completed', checkin_id: checkin.id })
  }
)
```

### Example 2: Zod error handler (shared)

```typescript
// src/lib/validation/index.ts
import { z } from 'zod'
import type { Context } from 'hono'

export function zodErrorHandler(result: { success: boolean; error?: z.ZodError }, c: Context) {
  if (!result.success) {
    return c.json({
      error: 'Invalid input',
      details: result.error!.flatten().fieldErrors
    }, 400)
  }
}

// Common reusable schemas
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export const uuidParam = z.string().uuid()
```

### Example 3: Discovery search as RPC function

```sql
-- supabase-migrations/006_search_functions.sql
CREATE OR REPLACE FUNCTION search_users_v1(
  p_query text,
  p_user_id uuid DEFAULT NULL,
  p_limit int DEFAULT 20,
  p_offset int DEFAULT 0
) RETURNS json AS $$
DECLARE
  result json;
  blocked uuid[];
BEGIN
  -- Get blocked IDs
  IF p_user_id IS NOT NULL THEN
    SELECT array_agg(blocked_id) INTO blocked
    FROM (
      SELECT blocked_id FROM user_blocks WHERE blocker_id = p_user_id
      UNION
      SELECT blocker_id FROM user_blocks WHERE blocked_id = p_user_id
    ) b;
  END IF;

  blocked := COALESCE(blocked, '{}');

  SELECT json_agg(row_to_json(t)) INTO result
  FROM (
    SELECT
      u.id, u.name, u.nickname, u.profile_photo_url
    FROM users u
    WHERE (LOWER(u.name) LIKE '%' || LOWER(p_query) || '%'
           OR LOWER(u.nickname) LIKE '%' || LOWER(p_query) || '%')
      AND (p_user_id IS NULL OR u.id != p_user_id)
      AND u.id != ALL(blocked)
    ORDER BY
      CASE
        WHEN LOWER(u.name) = LOWER(p_query) THEN 1
        WHEN LOWER(u.name) LIKE LOWER(p_query) || '%' THEN 2
        ELSE 3
      END,
      u.name
    LIMIT p_limit OFFSET p_offset
  ) t;

  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

```typescript
// TypeScript call
const { data, error } = await supabase.rpc('search_users_v1', {
  p_query: q,
  p_user_id: userId,
  p_limit: limit,
  p_offset: offset
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Neon raw SQL with `$N` params | Supabase query builder | Already set up in codebase | Type safety, no SQL injection |
| Manual if/else validation | Zod schemas with @hono/zod-validator | Hono v4+ | Typed validation, consistent errors |
| `db.first<any>()` generics | Typed Database interface | Already in `src/lib/supabase/types.ts` | Full type safety on queries |
| `.single()` error handling | `.maybeSingle()` | supabase-js v2.x | Returns null instead of error for no rows |

**Deprecated/outdated:**
- `@neondatabase/serverless` in this project: Being fully replaced by Supabase
- `src/db.ts` Database class: Will be deleted
- `src/db-supabase.ts` SupabaseDatabase.query() method: Uses nonexistent RPC, never worked

## Migration Complexity by File

Files ordered by estimated migration effort:

### Tier 1 - Trivial (simple CRUD, <5 DB calls)
- checkins.ts (3 calls)
- dates.ts (3 calls)
- experiences.ts (3 calls)
- intimacy.ts (2 calls)
- gamification.ts (4 calls)
- goals.ts (5 calls)
- activities.ts (5 calls)
- dashboard.ts (5 calls)

### Tier 2 - Moderate (straightforward but more calls)
- users.ts (7 calls)
- notifications.ts (6 calls)
- recommendations.ts (6 calls)
- payments.ts (6 calls)
- sponsors.ts (9 calls)
- push-notifications.ts (9 calls)
- analytics-enhanced.ts (9 calls)
- auth-routes.ts (10 calls)

### Tier 3 - Complex (many calls, some complex queries)
- challenges.ts (17 calls)
- relationships.ts (18 calls)
- posts.ts (20 calls)
- feed.ts (28 calls)

### Tier 4 - Hard (complex dynamic SQL)
- discovery.ts (37 calls, dynamic SQL, mixed placeholders, conditional JOINs)
- analytics.ts (38 calls, complex aggregation queries)
- messaging.ts (44 calls)
- communities.ts (45 calls)
- social.ts (56 calls, largest file at 1048 lines)

### Files that need NO migration (already use Supabase or no DB)
- supabase-auth.ts (already Supabase)
- auth.ts (no DB calls)
- email.ts (no DB calls)
- ai-coach.ts (no DB calls)
- video.ts (1 call - minimal)
- quiz.ts (uses createDatabase but could be simple)

## Open Questions

1. **RLS with service role key during migration**
   - What we know: Current API uses no RLS. The `002_row_level_security.sql` migration exists but may not be applied.
   - What's unclear: Should we use `createAdminClient` (bypasses RLS) or `createClientWithContext` (respects RLS) for migrated routes?
   - Recommendation: Use `createAdminClient` for all routes initially to maintain current behavior. Add RLS enforcement as a separate task after migration is verified working.

2. **Database types completeness**
   - What we know: `src/lib/supabase/types.ts` has 349 lines of types.
   - What's unclear: Whether all 30+ tables referenced in API routes are typed.
   - Recommendation: Run `supabase gen types` to regenerate types from live database before starting migration.

3. **discovery.ts `?` placeholders -- are they bugs?**
   - What we know: Neon only supports `$N` positional params. The `?` placeholders in blocked-user filters are likely silently failing.
   - What's unclear: Whether blocked-user filtering ever worked in production.
   - Recommendation: Treat as known bugs. The Supabase migration fixes them by design.

## Sources

### Primary (HIGH confidence)
- Codebase analysis: `src/db.ts`, `src/db-supabase.ts`, `src/lib/supabase/`, all 31 `src/api/*.ts` files
- `src/lib/supabase/types.ts` - Existing typed Database interface
- `supabase-migrations/002_row_level_security.sql` - RLS policies already written
- `package.json` - Current dependency versions

### Secondary (MEDIUM confidence)
- Supabase JS client v2 API patterns (from training data, consistent with codebase usage in supabase-auth.ts)
- Zod v3 API (stable, well-known)
- @hono/zod-validator usage patterns (from Hono ecosystem)

### Tertiary (LOW confidence)
- `.maybeSingle()` availability in supabase-js 2.89 (should be verified against Context7 or docs)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All libraries already in use or well-established
- Architecture: HIGH - Existing Supabase infrastructure in codebase provides clear patterns
- Pitfalls: HIGH - Identified from direct codebase analysis
- Discovery migration strategy: MEDIUM - RPC approach is sound but specific function signatures need validation

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable libraries, no fast-moving concerns)
