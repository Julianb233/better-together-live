# Coding Conventions

**Analysis Date:** 2026-03-05

## Naming Patterns

**Files:**
- API route modules: `kebab-case.ts` (e.g., `src/api/push-notifications.ts`, `src/api/auth-routes.ts`, `src/api/ai-coach.ts`)
- Page templates: `kebab-case.ts` (e.g., `src/pages/login-system.ts`, `src/pages/user-portal.ts`, `src/pages/challenges-progress.ts`)
- Components: `kebab-case.ts` (e.g., `src/components/navigation.ts`)
- Core modules: `kebab-case.ts` (e.g., `src/db-supabase.ts`, `src/db.ts`)
- SQL migrations: `NNNN_descriptive_name.sql` (e.g., `migrations/0001_initial_relationship_schema.sql`)

**Variables and Functions:**
- Use `camelCase` for all TypeScript variables and functions: `generateId()`, `getCurrentDate()`, `checkDatabase()`
- API route instances: `camelCase` suffixed with `Api` or descriptive name: `checkinsApi`, `goalsApi`, `pushApi`, `authRoutes`
- Helper functions within API files: `camelCase` (e.g., `getAuthUserId()`, `getBlockedUserIds()`, `isDevelopmentMode()`)

**Types and Interfaces:**
- Use `PascalCase` for all types and interfaces: `User`, `Relationship`, `DailyCheckin`, `PushNotificationPayload`
- Enum-like union types: Use string literal unions, not TS enums:
  ```typescript
  export type LoveLanguage =
    | 'words_of_affirmation'
    | 'quality_time'
    | 'physical_touch'
    | 'acts_of_service'
    | 'receiving_gifts'
  ```

**Database Columns:**
- Use `snake_case` for all database column names: `user_id`, `relationship_id`, `created_at`, `love_language_primary`
- ID columns: `id` for primary key, `{entity}_id` for foreign keys
- Timestamp columns: `created_at`, `updated_at`, `last_active_at`, `completed_date`
- Boolean columns: `is_recurring`, `is_template`, `is_active`
- Status columns: string enums like `'active' | 'completed' | 'paused' | 'cancelled'`

**API Response Keys:**
- Use `snake_case` to match database columns: `checkin_id`, `goal_id`, `token_id`, `device_count`
- Success messages: `{ message: 'Human-readable message' }`
- Error messages: `{ error: 'Human-readable error' }`

## Code Style

**Formatting:**
- No linter or formatter configured (no `.eslintrc`, `.prettierrc`, or `biome.json`)
- Indentation: 2 spaces (consistent across all files)
- Semicolons: omitted (no trailing semicolons on statements)
- Quotes: single quotes for strings
- Trailing commas: used in multi-line arrays and objects

**TypeScript:**
- Strict mode enabled in `tsconfig.json`
- `"target": "ESNext"`, `"module": "ESNext"`, `"moduleResolution": "Bundler"`
- JSX configured for Hono: `"jsx": "react-jsx"`, `"jsxImportSource": "hono/jsx"`
- `skipLibCheck: true`

## Import Organization

**Order:**
1. Framework imports (`hono`, `hono/cors`, `hono/jsx-renderer`)
2. Third-party library imports (`jose`, `@supabase/supabase-js`, `@neondatabase/serverless`)
3. Internal module imports (`../db`, `../types`, `../utils`)
4. Relative API imports (`./auth`)

**Pattern:**
```typescript
import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import { generateId, getCurrentDate, getCurrentDateTime } from '../utils'
```

**Path Aliases:**
- No path aliases configured. All imports use relative paths (`../`, `./`).

**Export Pattern:**
- API route modules: create `const xxxApi = new Hono()`, then `export default xxxApi`
- Pages: export named constants with `Html` suffix: `export const dashboardHtml = \`...\``
- Utility functions: named exports from `src/utils.ts`
- Types: named exports from `src/types.ts`

## Error Handling

**API Route Pattern (consistent across all routes):**
```typescript
checkinsApi.post('/', async (c: Context) => {
  try {
    // Validation first
    if (!required_field) {
      return c.json({ error: 'Human-readable error message' }, 400)
    }

    // Business logic
    // ...

    // Success response
    return c.json({ message: 'Success message', data_field: value })
  } catch (error) {
    console.error('Descriptive context error:', error)
    return c.json({ error: 'Failed to <action>' }, 500)
  }
})
```

**HTTP Status Codes Used:**
- `200` - Success (GET, PUT, DELETE)
- `201` - Created (POST creating new resource)
- `400` - Validation error (missing/invalid fields)
- `401` - Unauthorized (invalid admin key, missing auth)
- `404` - Resource not found
- `409` - Conflict (duplicate email, already checked in today)
- `429` - Rate limited
- `500` - Internal server error (catch-all)
- `503` - Service unavailable (database not configured)

**Validation Pattern:**
- Check required fields first, return `400` with descriptive `error` string
- Check for existence of resources, return `404` if missing
- Check for duplicates/conflicts, return `409`
- All validation happens at the route handler level, not in middleware

**Database Error Handling:**
- Database wrapper methods catch and re-throw with `console.error`
- API routes wrap all DB calls in try/catch
- Silent error handling for non-critical operations (e.g., `awardAchievement` catches and logs but does not throw)

## Logging

**Framework:** `console` (no structured logging library)

**Patterns:**
- `console.error('Context description error:', error)` for caught exceptions in API routes
- `console.error('Database query error:', error)` in database wrapper classes
- `console.warn('...')` for deprecation/migration warnings (e.g., raw SQL usage with Supabase)
- `console.log(...)` with decorative formatting for development mode simulation output (push notifications)
- Client-side pages use `console.error('Short context error:', error)` in catch blocks

**When to Log:**
- Always log in catch blocks before returning error response
- Use descriptive prefix: `'Create checkin error:'`, `'Get goals error:'`, `'Send push notification error:'`
- Pattern: `console.error('<Action> <entity> error:', error)`

## Comments

**File Headers:**
- Every API file starts with a two-line comment:
  ```typescript
  // Better Together: <Module Name>
  // <Brief description of purpose>
  ```

**JSDoc:**
- Used on utility functions in `src/utils.ts` and `src/db.ts`:
  ```typescript
  /**
   * Generate a unique ID for database records
   */
  export function generateId(): string {
  ```
- Used on helper functions within larger API files:
  ```typescript
  /**
   * Helper: Get authenticated user ID (optional - some endpoints are public)
   */
  ```

**Inline Comments:**
- Route comments above each handler: `// POST /api/checkins` and `// Submit daily check-in`
- Section separators for grouping: `// =============================================================================`
- Inline explanations for non-obvious logic: `// PGRST116 is "no rows returned" which is expected`

## Function Design

**API Route Handlers:**
- One handler per HTTP method + path combination
- All handlers receive `(c: Context)` parameter
- Cast `c.env` to `Env` type: `c.env as Env`
- Extract body with `await c.req.json()`
- Extract params with `c.req.param('name')`, query with `c.req.query('name')`
- Return `c.json(...)` with appropriate status code

**Utility Functions:**
- Pure functions where possible (no side effects)
- Functions that need DB access take `env: Env` as first parameter
- Async functions for DB operations, sync for pure computation
- Functions return `null` (not `undefined`) when nothing found

**Parameter Patterns:**
- Positional parameters for simple functions: `daysBetween(date1, date2)`
- Object destructuring for complex inputs: `const { email, password, name } = await c.req.json()`

## Module Design

**API Route Modules (`src/api/*.ts`):**
```typescript
// File header comment
import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import { generateId, getCurrentDateTime } from '../utils'

const featureApi = new Hono()

// POST /api/feature - Create
featureApi.post('/', async (c: Context) => { ... })

// GET /api/feature/:id - Read
featureApi.get('/:id', async (c: Context) => { ... })

// PUT /api/feature/:id - Update
featureApi.put('/:id', async (c: Context) => { ... })

export default featureApi
```

**Page Templates (`src/pages/*.ts`):**
- Export a named constant containing a full HTML document as template literal string
- Pages are self-contained HTML with inline `<script>` and `<style>` tags
- Include TailwindCSS via CDN (`https://cdn.tailwindcss.com`)
- Include Font Awesome via CDN
- Include Inter font from Google Fonts
- No external JS bundles; all interactivity via vanilla JavaScript in `<script>` tags

**Route Mounting (`src/index.tsx`):**
- Feature-specific routes: `app.route('/api/<feature>', featureApi)`
- Some routes mount at `/api` base (discovery, social, gamification, recommendations, relationships)
- Pages mounted as individual GET handlers returning HTML strings

## Database Query Patterns

**Raw SQL via Neon adapter (`src/db.ts`):**
- All API routes use the Neon `Database` class via `createDatabase(c.env as Env)`
- Parameterized queries with `$1, $2, ...` positional placeholders
- Three query methods: `db.run()` (INSERT/UPDATE/DELETE), `db.first<T>()` (single row), `db.all<T>()` (multiple rows)
- Pattern for writes:
  ```typescript
  const id = generateId()
  const now = getCurrentDateTime()
  await db.run(`INSERT INTO table (id, ..., created_at) VALUES ($1, ..., $N)`, [id, ..., now])
  ```

**ID Generation:**
- Use `crypto.randomUUID()` via `generateId()` from `src/utils.ts`
- Some push notification IDs use custom format: `dt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

**Supabase adapter (`src/db-supabase.ts`):**
- Provides query-builder API (`first`, `all`, `insert`, `update`, `delete`) and raw SQL fallback
- Not actively used by API routes (they use the Neon adapter)
- Supabase client configured with `autoRefreshToken: false, persistSession: false, detectSessionInUrl: false`

## Component Patterns (Server-Rendered TSX)

**Renderer (`src/renderer.tsx`):**
- Uses `jsxRenderer` from `hono/jsx-renderer`
- Provides HTML shell with `<head>` (meta, CSS CDNs, fonts, custom animations) and `<body>`
- Children rendered inside `<body class="antialiased">`

**Page Templates vs Renderer:**
- Some pages use the Hono JSX renderer (via `src/renderer.tsx`)
- Most pages are raw HTML template literal strings exported from `src/pages/*.ts`
- Page HTML strings are returned directly from route handlers, bypassing the JSX renderer

**Navigation:**
- Shared navigation HTML exported from `src/components/navigation.ts` as `navigationHtml` template literal
- Included in pages by string interpolation or embedded directly

## API Route Patterns

**RESTful Conventions:**
- POST for creation, GET for reading, PUT for updates, DELETE for removal
- Route patterns: `/api/<resource>`, `/api/<resource>/:id`, `/api/<resource>/:id/<action>`
- Example: `PUT /api/goals/:goalId/progress`

**Request Body Parsing:**
- Always destructure from `await c.req.json()`
- Optional fields default to `null` (for database insertion): `nickname || null`

**Response Format:**
- Success: `c.json({ message: '...', entity_id: '...' })` or `c.json({ entities: results || [] })`
- Error: `c.json({ error: '...' }, statusCode)`
- List responses wrap array in named key: `{ checkins: results || [] }`, `{ goals: results || [] }`
- Empty results return empty array, not 404

**Authentication:**
- JWT-based via `jose` library (HS256)
- Tokens: access (15m), refresh (7d), reset (1h)
- Auth cookies: httpOnly, secure, sameSite=lax
- Token extraction from cookies or Authorization header
- Rate limiting via in-memory store (not distributed)
- Most API routes do NOT enforce authentication (early stage)

---

*Convention analysis: 2026-03-05*
