# Phase 7: Analytics & Performance - Research

**Researched:** 2026-03-05
**Domain:** SQL query optimization, Supabase query builder migration, N+1 elimination
**Confidence:** HIGH

## Summary

This phase has three distinct workstreams: (1) replacing mock/hardcoded analytics data with real database queries, (2) fixing N+1 query patterns in the messaging API, and (3) migrating the discovery API from hand-built dynamic SQL to the Supabase query builder. The codebase currently uses raw SQL via the Neon `@neondatabase/serverless` adapter exclusively -- no file uses the existing `db-supabase.ts` Supabase query builder wrapper despite it being available.

The analytics file (`analytics.ts`, 969 lines) already has real database queries alongside mock fallbacks. The main issues are: hardcoded growth metrics (lines 109-110, 374, 389, 654, 671-672), hardcoded demographic data (lines 227-240), and error catch blocks that return fake numbers instead of zeros. The messaging N+1 is a textbook case at lines 77-106 where each conversation triggers 2 additional queries. The discovery API (956 lines) is the highest-risk migration due to complex dynamic SQL with mixed placeholder styles (`$1` and `?` in the same file).

**Primary recommendation:** Fix N+1 with SQL JOINs first (lowest risk, highest impact), then clean analytics mock data, then incrementally migrate discovery to Supabase query builder starting with simpler endpoints.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@neondatabase/serverless` | ^0.9.5 | Current DB adapter (raw SQL) | Already used everywhere, `createDatabase()` in all API files |
| `@supabase/supabase-js` | ^2.89.0 | Query builder for migration target | Already installed, `db-supabase.ts` wrapper exists but unused |
| `hono` | ^4.9.2 | Web framework | All API routes are Hono handlers |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@supabase/supabase-js` query builder | ^2.89.0 | Type-safe query construction | Discovery API migration -- replaces hand-built SQL |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Supabase query builder | Drizzle ORM | Drizzle would be cleaner but adds a new dependency; Supabase is already installed and has a wrapper |
| Raw SQL optimization | PostgreSQL views/materialized views | Good for analytics aggregations but requires migration files |
| In-app caching | Redis/KV store | Overkill for this phase; optimize queries first |

**Installation:**
No new packages needed. Everything is already in `package.json`.

## Architecture Patterns

### Current Database Architecture
```
src/
  db.ts                  # Neon adapter - createDatabase() -> Database class
  db-supabase.ts         # Supabase adapter - createSupabaseDatabase() -> SupabaseDatabase class
  api/
    analytics.ts         # 969 lines, uses db.ts (Neon raw SQL)
    messaging.ts         # 843 lines, uses db.ts (Neon raw SQL)
    discovery.ts         # 956 lines, uses db.ts (Neon raw SQL)
    analytics-enhanced.ts # Additional analytics, uses db.ts
```

**Critical finding:** Every single API file imports from `db.ts` (Neon). Zero files use `db-supabase.ts`. The Supabase wrapper exists but is dead code.

### Pattern 1: N+1 Fix via SQL JOIN with Subqueries
**What:** Replace per-row async queries with a single query using JOINs and subqueries
**When to use:** Messaging conversations endpoint (lines 53-117)

The current N+1 pattern:
```typescript
// CURRENT (N+1): For each conversation, 2 extra queries
const enriched = await Promise.all(conversations.map(async (conv) => {
  // Query 2: Get participants for THIS conversation
  const participants = await db.all<any>(`
    SELECT u.id, u.name, u.nickname, u.profile_photo_url, cp.role
    FROM conversation_participants cp
    INNER JOIN users u ON cp.user_id = u.id
    WHERE cp.conversation_id = $1 AND cp.left_at IS NULL AND u.id != $2
  `, [conv.id, userId])

  // Query 3: Get unread count for THIS conversation
  const unreadCount = await getUnreadCount(db, conv.id, userId)
  // (getUnreadCount itself does 2 queries!)

  return { ...conv, participants, unread_count: unreadCount }
}))
```

The fix:
```typescript
// FIXED: Single query with lateral joins or two batch queries
// Option A: Batch approach (simpler, more portable)

// 1. Get conversations (same query as before)
const conversations = await db.all<any>(`...`, [userId, limit, offset])

const convIds = conversations.map(c => c.id)
if (convIds.length === 0) return c.json({ conversations: [], page, limit, hasMore: false })

// 2. Batch-fetch all participants for all conversations
const allParticipants = await db.all<any>(`
  SELECT cp.conversation_id, u.id, u.name, u.nickname, u.profile_photo_url, cp.role
  FROM conversation_participants cp
  INNER JOIN users u ON cp.user_id = u.id
  WHERE cp.conversation_id = ANY($1) AND cp.left_at IS NULL AND u.id != $2
`, [convIds, userId])

// 3. Batch-fetch all unread counts
const allUnreads = await db.all<any>(`
  SELECT cp.conversation_id, COUNT(m.id) as unread_count
  FROM conversation_participants cp
  LEFT JOIN messages m ON m.conversation_id = cp.conversation_id
    AND m.sender_id != $2
    AND m.deleted_at IS NULL
    AND m.created_at > COALESCE(cp.last_read_at, '1970-01-01')
  WHERE cp.conversation_id = ANY($1) AND cp.user_id = $2
  GROUP BY cp.conversation_id
`, [convIds, userId])

// 4. Combine in-memory
const participantMap = new Map()
const unreadMap = new Map()
for (const p of allParticipants) {
  if (!participantMap.has(p.conversation_id)) participantMap.set(p.conversation_id, [])
  participantMap.get(p.conversation_id).push(p)
}
for (const u of allUnreads) unreadMap.set(u.conversation_id, u.unread_count)

const enriched = conversations.map(conv => ({
  ...conv,
  participants: participantMap.get(conv.id) || [],
  unread_count: unreadMap.get(conv.id) || 0
}))
```

**Result:** Goes from 1 + (N * 3-4) queries down to 3 queries total.

### Pattern 2: Remove Mock Data Fallbacks
**What:** Replace hardcoded mock numbers with zeros or calculated values
**When to use:** Analytics endpoints that still have fake data

Current anti-pattern (repeated 6+ times):
```typescript
// BAD: Error handler returns fake data
catch (error) {
  return c.json({
    totalUsers: 50247,        // FAKE
    engagedCouples: 25124,    // FAKE
    partnerRevenue: 847,      // FAKE
  })
}
```

Correct pattern:
```typescript
// GOOD: Error handler returns zeros with error flag
catch (error) {
  console.error('Overview analytics error:', error)
  return c.json({
    totalUsers: 0,
    engagedCouples: 0,
    partnerRevenue: 0,
    error: 'Analytics temporarily unavailable',
    lastUpdated: new Date().toISOString()
  })
}
```

### Pattern 3: Supabase Query Builder for Dynamic Filters
**What:** Use Supabase's chaining API instead of string-concatenated SQL
**When to use:** Discovery API where filters are conditionally applied

Current anti-pattern (discovery.ts, throughout):
```typescript
// BAD: Mixed placeholder styles, string concatenation, SQL injection risk
let conditions = [`(LOWER(c.name) LIKE ? OR LOWER(c.description) LIKE ?)`]  // ? style
let params: any[] = userId ? [userId, searchPattern, searchPattern] : [searchPattern, searchPattern]

if (category) {
  conditions.push(`c.category = ?`)  // ? style
  params.push(category)
}

// Then later uses $1 style in the same query template...
// LIMIT $${userId ? params.length + 2 : params.length + 1}
```

Correct pattern with Supabase query builder:
```typescript
// GOOD: Type-safe, no SQL injection, clear logic
const supabase = getSupabaseClient(c.env as SupabaseDbEnv)

let query = supabase
  .from('communities')
  .select(`
    id, name, slug, description, cover_image_url,
    category, privacy_level, member_count, post_count,
    is_verified, is_featured
  `)
  .or(`name.ilike.%${q}%,description.ilike.%${q}%`)

if (category) {
  query = query.eq('category', category)
}

if (privacyLevel) {
  query = query.eq('privacy_level', privacyLevel)
} else {
  query = query.eq('privacy_level', 'public')
}

query = query
  .order('is_featured', { ascending: false })
  .order('member_count', { ascending: false })
  .range(offset, offset + limit - 1)

const { data, error } = await query
```

### Pattern 4: Trending Topics via Database Query
**What:** Replace in-memory hashtag extraction with a SQL query
**When to use:** `explore/topics` endpoint (lines 911-954)

Current approach fetches 1000 posts and extracts hashtags in JavaScript:
```typescript
// BAD: Fetches 1000 rows, processes in JS
const recentPosts = await db.all<{ content: string }>(`
  SELECT content FROM posts
  WHERE created_at >= datetime('now', '-7 days')
  AND content LIKE '%#%'
  LIMIT 1000
`)
// Then loops with regex...
```

Better approach uses PostgreSQL regex:
```typescript
// GOOD: Let the database do the work
const topics = await db.all<{ topic: string, post_count: number }>(`
  SELECT
    LOWER(match[1]) as topic,
    COUNT(*) as post_count
  FROM posts,
    LATERAL regexp_matches(content, '#(\w+)', 'g') AS match
  WHERE created_at >= NOW() - INTERVAL '7 days'
    AND deleted_at IS NULL
    AND is_hidden = FALSE
    AND visibility = 'public'
  GROUP BY LOWER(match[1])
  ORDER BY post_count DESC
  LIMIT $1
`, [limit])
```

### Anti-Patterns to Avoid
- **Mixed placeholder styles:** Discovery API uses both `?` (lines 59-60, 379-380) and `$1` (lines 91, 102) in the same file. Pick one -- Neon uses `$1` style.
- **Hardcoded TODO values:** Many analytics fields are `'+34.2%'` or `68` with a TODO comment. Either calculate them or explicitly return `null` with a flag.
- **Error handlers returning fake data:** Error catch blocks in analytics.ts return realistic-looking fake numbers, making it impossible to distinguish real data from errors on the frontend.
- **SQL string interpolation for user input:** Discovery API line 688 interpolates `relationshipType` directly into SQL: `` `CASE WHEN r.relationship_type = '${relationshipType}' THEN 2 ELSE 0 END` ``. This is a SQL injection vulnerability.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Dynamic query filters | String-concatenated SQL with placeholder arithmetic | Supabase query builder `.eq()`, `.or()`, `.ilike()` chains | Mixed placeholder styles cause bugs; builder is type-safe |
| Batch data loading | `Promise.all(items.map(async item => db.query(...)))` | `WHERE id = ANY($1)` with array parameter, or Supabase `.in()` | N+1 queries scale linearly; batch is O(1) |
| Hashtag extraction | `regex.exec()` loop in JS over fetched rows | PostgreSQL `regexp_matches()` with `LATERAL` | Database does it faster, uses less memory, returns only aggregates |
| Pagination with dynamic params | Manual `$${params.length + 1}` arithmetic | Supabase `.range(offset, offset + limit - 1)` | Parameter index math is the #1 source of bugs in discovery.ts |
| Growth percentage calculation | Inline formula in every endpoint | Shared utility: `calcGrowth(current, previous)` | Same formula repeated 4+ times with slight variations |

## Common Pitfalls

### Pitfall 1: Mixed Placeholder Styles
**What goes wrong:** Queries fail at runtime with wrong parameter binding
**Why it happens:** Discovery API was likely written by multiple authors or copied from different sources. Lines 59-60 use `?` style, lines 91-102 use `$N` style. The Neon driver uses `$N` style.
**How to avoid:** When migrating to Supabase query builder, this goes away entirely. For any remaining raw SQL, use only `$N` style.
**Warning signs:** Queries that work for unauthenticated users but fail for authenticated ones (because auth adds more parameters).

### Pitfall 2: N+1 in Promise.all Looks Fast But Isn't
**What goes wrong:** `Promise.all` runs N queries concurrently, which saturates the connection pool and increases total latency under load
**Why it happens:** Developers see `Promise.all` and assume parallel = fast. In reality, each query competes for connections.
**How to avoid:** Batch-fetch with `ANY($1)` or `IN (...)` clauses, then join data in-memory.
**Warning signs:** Messaging endpoint is slow when user has 20+ conversations.

### Pitfall 3: Mock Data in Error Handlers
**What goes wrong:** Frontend shows "50,247 users" even when the database is down. Team can't tell if data is real.
**Why it happens:** Early development used mocks; error handlers copied them for "graceful degradation."
**How to avoid:** Error handlers return zeros + an error flag. Frontend checks the flag and shows "Data unavailable" instead of fake numbers.
**Warning signs:** Dashboard always shows positive metrics even after DB credential rotation.

### Pitfall 4: Supabase Query Builder `ilike` with User Input
**What goes wrong:** Special characters in search queries (`%`, `_`) are LIKE wildcards
**Why it happens:** Direct interpolation of user input into `.ilike()` patterns
**How to avoid:** Escape special characters before passing to `.ilike()`: `q.replace(/%/g, '\\%').replace(/_/g, '\\_')`
**Warning signs:** Searching for literal `%` returns all results.

### Pitfall 5: Discovery API SQL Injection
**What goes wrong:** Line 688 of discovery.ts interpolates `relationshipType` directly into SQL string
**Why it happens:** Complex dynamic SQL made parameterization feel difficult
**How to avoid:** Always use parameterized queries: `CASE WHEN r.relationship_type = $N THEN 2 ELSE 0 END`
**Warning signs:** A user with a crafted relationship type could execute arbitrary SQL.

### Pitfall 6: `strftime` vs PostgreSQL Date Functions
**What goes wrong:** Analytics queries use `strftime('%Y-%m', created_at)` and `datetime('now', '-7 days')` which are SQLite syntax
**Why it happens:** Development may have started with SQLite/D1 before migrating to PostgreSQL
**How to avoid:** Use PostgreSQL functions: `TO_CHAR(created_at, 'YYYY-MM')` and `NOW() - INTERVAL '7 days'`
**Warning signs:** Queries fail silently or return NULLs when run against Neon PostgreSQL. Some already use `date('now', '-12 months')` (SQLite) while others use `NOW() - INTERVAL` (PostgreSQL).

## Code Examples

### Example 1: Fixed Conversations Endpoint (N+1 Elimination)
```typescript
// 3 queries total instead of 1 + N*4
messagingApi.get('/', async (c: Context) => {
  const db = createDatabase(c.env as Env)
  const userId = c.get('userId')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const offset = (page - 1) * limit

  // Query 1: Get user's conversations
  const conversations = await db.all<any>(`
    SELECT c.*, cp.last_read_at, cp.is_muted
    FROM conversations c
    INNER JOIN conversation_participants cp ON c.id = cp.conversation_id
    WHERE cp.user_id = $1 AND cp.left_at IS NULL
    ORDER BY c.last_message_at DESC NULLS LAST
    LIMIT $2 OFFSET $3
  `, [userId, limit, offset])

  if (conversations.length === 0) {
    return c.json({ conversations: [], page, limit, hasMore: false })
  }

  const convIds = conversations.map(c => c.id)

  // Query 2: Batch-fetch participants
  const participants = await db.all<any>(`
    SELECT cp.conversation_id, u.id, u.name, u.nickname, u.profile_photo_url, cp.role
    FROM conversation_participants cp
    INNER JOIN users u ON cp.user_id = u.id
    WHERE cp.conversation_id = ANY($1) AND cp.left_at IS NULL AND u.id != $2
  `, [convIds, userId])

  // Query 3: Batch-fetch unread counts
  const unreads = await db.all<any>(`
    SELECT cp.conversation_id, COUNT(m.id) as unread_count
    FROM conversation_participants cp
    LEFT JOIN messages m ON m.conversation_id = cp.conversation_id
      AND m.sender_id != cp.user_id
      AND m.deleted_at IS NULL
      AND m.created_at > COALESCE(cp.last_read_at, '1970-01-01')
    WHERE cp.conversation_id = ANY($1) AND cp.user_id = $2
    GROUP BY cp.conversation_id
  `, [convIds, userId])

  // In-memory join
  const partMap = new Map<string, any[]>()
  for (const p of participants) {
    if (!partMap.has(p.conversation_id)) partMap.set(p.conversation_id, [])
    partMap.get(p.conversation_id)!.push(p)
  }
  const unreadMap = new Map<string, number>()
  for (const u of unreads) unreadMap.set(u.conversation_id, u.unread_count)

  const enriched = conversations.map(conv => ({
    id: conv.id,
    type: conv.type,
    name: conv.name,
    participants: partMap.get(conv.id) || [],
    last_message_at: conv.last_message_at,
    last_message_preview: conv.last_message_preview,
    unread_count: unreadMap.get(conv.id) || 0,
    is_muted: conv.is_muted,
    created_at: conv.created_at
  }))

  return c.json({ conversations: enriched, page, limit, hasMore: conversations.length === limit })
})
```

### Example 2: Analytics Overview Without Mock Fallbacks
```typescript
analyticsApi.get('/overview', async (c: Context) => {
  const db = createDatabase(c.env as Env)

  try {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

    // Single query for all counts
    const metrics = await db.first<{
      total_users: number
      engaged_couples: number
      partner_revenue: number
      app_sessions: number
      prev_users: number
      prev_couples: number
    }>(`
      SELECT
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM relationships WHERE status = 'active') as engaged_couples,
        (SELECT COALESCE(SUM(total_revenue_cents), 0) / 1000 FROM sponsors WHERE status = 'active') as partner_revenue,
        (SELECT COUNT(*) / 1000.0 FROM user_sessions WHERE session_start >= $1) as app_sessions,
        (SELECT COUNT(*) FROM users WHERE created_at < $2) as prev_users,
        (SELECT COUNT(*) FROM relationships WHERE status = 'active' AND created_at < $2) as prev_couples
    `, [new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), lastMonth.toISOString()])

    // ... calculate growth from metrics
  } catch (error) {
    console.error('Overview analytics error:', error)
    return c.json({
      totalUsers: 0, engagedCouples: 0, partnerRevenue: 0, appSessions: 0,
      growthMetrics: { usersGrowth: 'N/A', couplesGrowth: 'N/A', revenueGrowth: 'N/A', sessionsGrowth: 'N/A' },
      error: 'Analytics temporarily unavailable',
      lastUpdated: new Date().toISOString()
    })
  }
})
```

### Example 3: Supabase Query Builder for Community Search
```typescript
import { getSupabaseClient, type SupabaseDbEnv } from '../db-supabase'

// Replace discovery.ts search/communities endpoint
discoveryApi.get('/search/communities', async (c: Context) => {
  const supabase = getSupabaseClient(c.env as SupabaseDbEnv)
  const userId = await getAuthUserId(c)
  const q = c.req.query('q') || ''
  const category = c.req.query('category')
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const offset = (page - 1) * limit

  // Escape LIKE wildcards
  const escaped = q.replace(/%/g, '\\%').replace(/_/g, '\\_')

  let query = supabase
    .from('communities')
    .select('id, name, slug, description, cover_image_url, category, privacy_level, member_count, post_count, is_verified, is_featured')
    .or(`name.ilike.%${escaped}%,description.ilike.%${escaped}%`)
    .eq('privacy_level', 'public')

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
    .order('is_featured', { ascending: false })
    .order('member_count', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error

  return c.json({
    communities: data || [],
    pagination: { page, limit, hasMore: (data?.length || 0) === limit }
  })
})
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| SQLite `strftime()` | PostgreSQL `TO_CHAR()` / `date_trunc()` | When Neon replaced D1 | Several queries may still use SQLite syntax |
| `?` placeholders | `$1` numbered placeholders | Neon adapter requirement | Discovery API has both styles mixed |
| `db.ts` raw SQL | `db-supabase.ts` query builder | Available but unused | Migration target for discovery API |

**Deprecated/outdated:**
- `isDatabaseAvailable()` check in analytics.ts: served a purpose when database was optional, but should be removed -- database is now required infrastructure
- `generateMockUserGrowth()` and `generateMockRevenueData()` functions: only used by fallback paths that should return zeros
- `strftime()` / `datetime()` calls in SQL: SQLite syntax, should be PostgreSQL equivalents

## Open Questions

1. **Neon `ANY($1)` array support**
   - What we know: Neon uses the `@neondatabase/serverless` driver which wraps pg-compatible queries
   - What's unclear: Whether `ANY($1)` with a JS array works directly or needs `= ANY($1::text[])` casting
   - Recommendation: Test with a simple query first; if casting needed, use `WHERE id IN (${convIds.map((_, i) => '$' + (i + 1)).join(',')})`

2. **Supabase query builder for complex JOINs in discovery**
   - What we know: Simple queries (filter, sort, paginate) work well with the builder
   - What's unclear: Whether the `for_you` recommendation query with subquery scoring can be expressed in the builder
   - Recommendation: Migrate simple endpoints first; keep complex recommendation queries as raw SQL via `.rpc()` or keep using Neon adapter

3. **Demographics data source**
   - What we know: analytics.ts lines 227-240 have hardcoded demographics (age groups, locations)
   - What's unclear: Whether the users table has age/location columns or if this data doesn't exist
   - Recommendation: Check user schema; if columns don't exist, return empty arrays rather than fake data

## Sources

### Primary (HIGH confidence)
- Direct code analysis of `src/api/analytics.ts` (969 lines), `src/api/messaging.ts` (843 lines), `src/api/discovery.ts` (956 lines)
- Direct code analysis of `src/db.ts` (Neon adapter) and `src/db-supabase.ts` (Supabase adapter)
- Migration file `migrations/0003_analytics_events.sql` for schema understanding
- `package.json` for dependency versions

### Secondary (MEDIUM confidence)
- Supabase JS v2 query builder API (from training data, verified against installed version ^2.89.0)
- PostgreSQL `regexp_matches` and `LATERAL` join syntax (standard PostgreSQL)

### Tertiary (LOW confidence)
- Neon driver `ANY()` array parameter support (needs runtime verification)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - all libraries already installed and analyzed
- Architecture patterns: HIGH - N+1 fix is textbook; Supabase builder API is well-documented
- Pitfalls: HIGH - identified directly from code analysis (mixed placeholders, SQL injection, mock data)
- Discovery migration complexity: MEDIUM - simple endpoints are straightforward, complex recommendation queries may need to stay as raw SQL

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable -- no fast-moving dependencies)
