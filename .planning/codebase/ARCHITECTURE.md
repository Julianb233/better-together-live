# Architecture

**Analysis Date:** 2026-03-05

## Pattern Overview

**Overall:** Server-rendered monolith with REST API

**Key Characteristics:**
- Hono framework serving both server-rendered HTML pages and JSON API endpoints from a single app
- No client-side framework (React, Vue, etc.) -- pages are server-rendered TSX or raw HTML template strings
- Vanilla JavaScript handles client-side interactivity (inline `<script>` tags in page templates)
- Dual database adapters: Supabase (primary) and Neon (legacy fallback)
- Designed for edge deployment on Cloudflare Pages with Vercel as alternative target
- Mobile app directory exists (`mobile/`) but is a separate React Native codebase consuming the same API

## Layers

**Routing Layer (Hono App):**
- Purpose: HTTP request routing, CORS, middleware application
- Location: `src/index.tsx`
- Contains: Route definitions, page route handlers, API sub-router mounts, inline route handlers for users/relationships
- Depends on: All API modules, all page modules, renderer, utils
- Used by: Vite dev server / Cloudflare Pages runtime

**API Layer (Feature Modules):**
- Purpose: REST API endpoints grouped by feature domain
- Location: `src/api/*.ts` (31 files)
- Contains: Hono sub-routers, each exporting a default Hono instance
- Depends on: `src/db.ts`, `src/db-supabase.ts`, `src/types.ts`, `src/utils.ts`, `src/lib/supabase/`
- Used by: `src/index.tsx` via `app.route()` mounting

**Page Layer (Server-Rendered HTML):**
- Purpose: Full HTML page templates for the web application
- Location: `src/pages/*.ts` (33 files)
- Contains: Exported string constants (`export const xyzHtml = \`...\``) containing complete HTML documents
- Depends on: Nothing (self-contained HTML strings with inline CSS/JS)
- Used by: `src/index.tsx` route handlers via `c.html()`

**Renderer Layer (JSX Shell):**
- Purpose: Provides the HTML shell for JSX-rendered pages (only the home page uses this)
- Location: `src/renderer.tsx`
- Contains: Hono JSX renderer with `<html>`, `<head>`, TailwindCSS CDN, Font Awesome, global styles
- Depends on: `hono/jsx-renderer`
- Used by: `src/index.tsx` home page route via `c.render()`

**Database Layer:**
- Purpose: Database connectivity and query execution
- Location: `src/db.ts` (Neon), `src/db-supabase.ts` (Supabase)
- Contains: `Database` / `SupabaseDatabase` wrapper classes with `query()`, `first()`, `all()`, `run()` methods
- Depends on: `@neondatabase/serverless`, `@supabase/supabase-js`
- Used by: API layer, utils layer

**Auth Layer (Supabase):**
- Purpose: Authentication and session management
- Location: `src/lib/supabase/` (5 files), `src/api/supabase-auth.ts`, `src/api/auth-routes.ts`, `src/api/auth.ts`
- Contains: Supabase client factories, auth middleware (`requireAuth`, `optionalAuth`), cookie management, legacy JWT auth
- Depends on: `@supabase/supabase-js`, `@supabase/ssr`, `jose`
- Used by: API route handlers that need authenticated access

**Types Layer:**
- Purpose: Central TypeScript type definitions for all domain entities
- Location: `src/types.ts` (788 lines)
- Contains: Interfaces for User, Relationship, Activity, Challenge, Payment, Community, Messaging, Analytics, and all API request/response types, plus the `Env` interface
- Depends on: Nothing
- Used by: All layers

**Utilities Layer:**
- Purpose: Shared helper functions for common operations
- Location: `src/utils.ts`
- Contains: ID generation, date formatting, email validation, database lookup helpers (`getUserById`, `getUserByEmail`, `getRelationshipByUserId`), analytics calculation
- Depends on: `src/types.ts`, `src/db.ts`
- Used by: `src/index.tsx`, API modules

## Data Flow

**Page Request (e.g., GET /portal):**

1. Hono matches route in `src/index.tsx`
2. Handler calls `c.html(userPortalHtml)` with pre-built HTML string
3. HTML returned to browser with all TailwindCSS/JS inlined or CDN-loaded
4. Browser-side vanilla JS makes `fetch()` calls to `/api/*` endpoints for dynamic data

**API Request (e.g., POST /api/checkins):**

1. Hono matches route via `app.route('/api/checkins', checkinsApi)`
2. Request dispatched to `src/api/checkins.ts` sub-router
3. Handler reads `c.env` for database credentials (Cloudflare bindings pattern)
4. `createDatabase(c.env)` creates a database connection
5. Raw SQL query executed via `db.run()` / `db.first()` / `db.all()`
6. JSON response returned via `c.json()`

**Home Page Request (GET /):**

1. Hono JSX renderer middleware applied globally via `app.use(renderer)`
2. Route handler calls `c.render(<div>...JSX...</div>)`
3. Renderer wraps JSX content in HTML shell from `src/renderer.tsx`
4. Complete HTML document returned

**State Management:**
- No client-side state management framework
- Pages use `localStorage` and `sessionStorage` for auth tokens and user preferences
- Server state is the database (Supabase PostgreSQL)
- Supabase Auth session stored in HTTP-only cookies via `@supabase/ssr`

## Key Abstractions

**Database Wrapper (`Database` / `SupabaseDatabase`):**
- Purpose: Provides a D1-compatible interface regardless of backing database
- Examples: `src/db.ts`, `src/db-supabase.ts`
- Pattern: Adapter pattern -- both classes expose `query()`, `first()`, `all()`, `run()` with parameterized SQL

**API Sub-Router:**
- Purpose: Each feature domain is an independent Hono router mounted on the main app
- Examples: `src/api/checkins.ts`, `src/api/goals.ts`, `src/api/communities.ts`
- Pattern: Each file creates `new Hono()`, defines routes, exports default. Mounted in `src/index.tsx` via `app.route('/api/prefix', subRouter)`

**Page Template:**
- Purpose: Self-contained HTML page as a TypeScript string constant
- Examples: `src/pages/user-portal.ts`, `src/pages/login-system.ts`, `src/pages/dashboard.ts`
- Pattern: `export const pageNameHtml = \`<!DOCTYPE html>...\`` -- complete HTML documents with embedded `<style>` and `<script>` tags

**Supabase Client Library:**
- Purpose: Centralized Supabase client creation for browser, server, and admin contexts
- Examples: `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`
- Pattern: Factory functions (`createServerClient`, `createAdminClient`, `createBrowserClient`) with barrel export from `src/lib/supabase/index.ts`

## Entry Points

**Application Entry (`src/index.tsx`):**
- Location: `src/index.tsx` (1856 lines)
- Triggers: Vite dev server, Cloudflare Pages Functions, Vercel Serverless Functions
- Responsibilities: Creates Hono app, applies CORS middleware, registers JSX renderer, defines inline routes for users/relationships, mounts all API sub-routers, defines all page routes, renders home page JSX

**Vite Config (`vite.config.ts`):**
- Location: `vite.config.ts`
- Triggers: `npm run dev`, `npm run build`
- Responsibilities: Configures `@hono/vite-build/vercel` for Vercel output format, `@hono/vite-dev-server` pointing to `src/index.tsx`

**CI/CD Entry (`.github/workflows/deploy.yml`):**
- Location: `.github/workflows/deploy.yml`
- Triggers: Push to `main` (production), push to `staging`, pull requests
- Responsibilities: Type-check, build, deploy to Cloudflare Pages, run D1 migrations

## Error Handling

**Strategy:** Try-catch with console.error logging and generic JSON error responses

**Patterns:**
- Every API handler wraps logic in `try { ... } catch (error) { console.error('...:', error); return c.json({ error: 'Failed to ...' }, 500) }`
- Input validation returns early with 400 status: `if (!field) return c.json({ error: '...' }, 400)`
- Database availability checked via `checkDatabase(c)` helper returning 503 if no database configured
- No centralized error middleware or structured error types
- Auth errors return 401 from Supabase middleware

## Cross-Cutting Concerns

**Logging:** `console.error()` for errors in catch blocks. No structured logging framework.

**Validation:** Manual field checks in handlers (`if (!email || !name)`). Zod used in `src/api/ai-coach.ts` but not consistently across other API modules.

**Authentication:** Dual auth systems:
- **Primary (Supabase Auth):** `src/api/supabase-auth.ts` handles signup/login/logout, `src/lib/supabase/middleware.ts` provides `requireAuth`/`optionalAuth` middleware. Session via HTTP-only cookies.
- **Legacy (Custom JWT):** `src/api/auth-routes.ts` and `src/api/auth.ts` handle register/login with bcrypt passwords stored in DB, JWT tokens via `jose`. Rate limiting built in.
- Most API routes do NOT apply auth middleware -- they accept `user_id` in request body on trust.

**CORS:** Applied globally to `/api/*` routes via `app.use('/api/*', cors())` with permissive `*` origin in `vercel.json`.

## Deployment Architecture

**Primary Target:** Cloudflare Pages
- Build output: `dist/` directory
- CI/CD: GitHub Actions (`.github/workflows/deploy.yml`)
- Database: Cloudflare D1 (configured in `wrangler.jsonc`) or Supabase PostgreSQL
- Environments: production (`main` branch), staging (`staging` branch), preview (PRs)
- Domain: `better-together.app`

**Secondary Target:** Vercel
- Build plugin: `@hono/vite-build/vercel`
- Output: `.vercel/output/`
- Deploy command: `npm run deploy` (`vite build && vercel --prod`)

**Development:**
- `npm run dev` runs Vite dev server with Hono plugin
- PM2 config in `ecosystem.config.cjs` for persistent dev server (uses `wrangler pages dev dist`)
- Environment variables via Cloudflare bindings (`c.env`) or Supabase env vars

---

*Architecture analysis: 2026-03-05*
