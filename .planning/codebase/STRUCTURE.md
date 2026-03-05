# Codebase Structure

**Analysis Date:** 2026-03-05

## Directory Layout

```
better-together-live/
├── src/                        # Application source code
│   ├── index.tsx               # Main Hono app entry point (1856 lines)
│   ├── renderer.tsx            # JSX HTML shell renderer
│   ├── types.ts                # All TypeScript type definitions (788 lines)
│   ├── utils.ts                # Shared utility functions
│   ├── db.ts                   # Neon database adapter (legacy)
│   ├── db-supabase.ts          # Supabase database adapter (primary)
│   ├── api/                    # API route modules (31 files)
│   ├── components/             # Shared HTML components (1 file)
│   ├── lib/                    # Library code
│   │   └── supabase/           # Supabase client library (5 files)
│   └── pages/                  # Server-rendered HTML page templates (33 files)
├── mobile/                     # React Native mobile app (separate codebase)
│   ├── src/
│   │   ├── api/                # API client functions
│   │   ├── components/         # React Native components
│   │   ├── hooks/              # React hooks
│   │   ├── navigation/         # Navigation configuration
│   │   ├── screens/            # Screen components (20 files)
│   │   ├── types/              # Mobile-specific types
│   │   └── utils/              # Mobile utilities
│   ├── hooks/                  # Additional hooks
│   ├── assets/                 # Mobile assets
│   └── __mocks__/              # Test mocks
├── migrations/                 # SQL migration files (numbered)
├── supabase-migrations/        # Supabase-specific migrations
├── scripts/                    # Database migration runner & utilities
├── tests/                      # Test files (minimal)
├── public/                     # Static assets served by platform
│   ├── images/                 # Image assets
│   │   └── generated/          # Generated images
│   └── static/                 # Static CSS/JS files
│       ├── app.js              # Client-side JavaScript
│       └── styles.css          # Global stylesheet
├── docs/                       # Project documentation
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
├── vercel.json                 # Vercel deployment config
├── wrangler.jsonc              # Cloudflare Workers/Pages config
├── ecosystem.config.cjs        # PM2 process manager config
├── seed.sql                    # Database seed data
└── database-queries.sql        # Reference SQL queries
```

## Directory Purposes

**`src/`:**
- Purpose: All server-side application code
- Contains: Hono app, API routes, page templates, database adapters, types, utilities
- Key files: `index.tsx` (main entry), `types.ts` (all interfaces), `utils.ts` (shared helpers)

**`src/api/`:**
- Purpose: REST API endpoint handlers, one file per feature domain
- Contains: 31 Hono sub-router files
- Key files:
  - `src/api/supabase-auth.ts` -- Primary auth (signup, login, logout, password reset)
  - `src/api/auth-routes.ts` -- Legacy JWT auth (register, login, refresh)
  - `src/api/auth.ts` -- Auth utility functions (hashing, tokens, rate limiting)
  - `src/api/checkins.ts` -- Daily check-in CRUD
  - `src/api/goals.ts` -- Shared goals CRUD
  - `src/api/activities.ts` -- Activities CRUD
  - `src/api/challenges.ts` -- Relationship challenges
  - `src/api/dashboard.ts` -- Dashboard data aggregation
  - `src/api/communities.ts` -- Community features
  - `src/api/messaging.ts` -- In-app messaging / conversations
  - `src/api/feed.ts` -- Social feed
  - `src/api/posts.ts` -- Post CRUD
  - `src/api/social.ts` -- Reactions, comments, connections, blocks, reports
  - `src/api/discovery.ts` -- User/couple search and discovery
  - `src/api/payments.ts` -- Stripe payment processing
  - `src/api/video.ts` -- LiveKit video calling
  - `src/api/ai-coach.ts` -- AI relationship coaching (mock responses)
  - `src/api/email.ts` -- Resend transactional email
  - `src/api/push-notifications.ts` -- Push notification service
  - `src/api/gamification.ts` -- Badges, achievements, points
  - `src/api/quiz.ts` -- Personality/compatibility quizzes
  - `src/api/experiences.ts` -- Curated experiences
  - `src/api/recommendations.ts` -- AI-powered recommendations
  - `src/api/intimacy.ts` -- Intimacy challenges (premium)
  - `src/api/relationships.ts` -- Relationship management
  - `src/api/analytics.ts` -- Analytics event tracking
  - `src/api/analytics-enhanced.ts` -- Enhanced analytics
  - `src/api/sponsors.ts` -- Sponsor/partner management
  - `src/api/users.ts` -- User profile management
  - `src/api/notifications.ts` -- Notification system
  - `src/api/dates.ts` -- Important dates CRUD

**`src/pages/`:**
- Purpose: Full HTML page templates as exported string constants
- Contains: 33 `.ts` files, each exporting a `const xyzHtml` string
- Key files:
  - `src/pages/user-portal.ts` -- Main user dashboard (post-login)
  - `src/pages/login-system.ts` -- Login/register page
  - `src/pages/dashboard.ts` -- Analytics dashboard
  - `src/pages/analytics-dashboard.ts` -- Admin analytics
  - `src/pages/paywall.ts` -- Subscription paywall
  - `src/pages/premium-pricing.ts` -- Pricing page
  - `src/pages/checkins.ts` -- Daily check-in page
  - `src/pages/goals.ts` -- Goals page
  - `src/pages/activities.ts` -- Activities page
  - `src/pages/mobile-ui.ts` -- Mobile UI showcase
  - `src/pages/iphone-examples.ts` -- iPhone design examples

**`src/components/`:**
- Purpose: Reusable HTML component strings
- Contains: 1 file
- Key files: `src/components/navigation.ts` -- Shared navigation bar HTML string

**`src/lib/supabase/`:**
- Purpose: Supabase client creation and auth utilities
- Contains: 5 files forming a complete Supabase integration library
- Key files:
  - `src/lib/supabase/index.ts` -- Barrel export
  - `src/lib/supabase/client.ts` -- Browser client factory
  - `src/lib/supabase/server.ts` -- Server client factory, cookie helpers, admin client
  - `src/lib/supabase/middleware.ts` -- `requireAuth()` and `optionalAuth()` Hono middleware
  - `src/lib/supabase/types.ts` -- Supabase Database type definitions

**`mobile/`:**
- Purpose: React Native mobile app (separate from web server)
- Contains: Screens, components, API clients, navigation, hooks
- Key files:
  - `mobile/src/screens/DashboardScreen.tsx` -- Main dashboard
  - `mobile/src/screens/LoginScreen.tsx` -- Login
  - `mobile/src/screens/AICoachScreen.tsx` -- AI coach chat
  - `mobile/src/screens/VideoCallScreen.tsx` -- Video calling
  - `mobile/src/api/client.ts` -- API client connecting to the Hono backend
  - `mobile/src/screens/__tests__/` -- Screen tests

**`migrations/`:**
- Purpose: Numbered SQL migration files for database schema
- Contains: 6 SQL files
- Key files:
  - `migrations/0001_initial_relationship_schema.sql` -- Core tables (users, relationships, checkins, goals, activities, challenges, achievements, analytics)
  - `migrations/0002_payment_subscription_schema.sql` -- Payments and subscriptions
  - `migrations/0003_analytics_events.sql` -- Analytics event tables
  - `migrations/0004_auth_and_sponsors.sql` -- Auth fields and sponsors
  - `migrations/0004_push_notifications.sql` -- Push notification tables
  - `migrations/0005_community_features.sql` -- Communities, posts, messaging

**`scripts/`:**
- Purpose: Database migration runner and verification scripts
- Contains: `migrate.js`, `init-production-db.sh`, `verify-database.sh`
- Key files: `scripts/migrate.js` -- Runs numbered SQL migrations in order

**`public/`:**
- Purpose: Static assets served directly by hosting platform
- Contains: HTML files, images, CSS, JS
- Key files: `public/static/styles.css`, `public/static/app.js`

## Key File Locations

**Entry Points:**
- `src/index.tsx`: Main Hono application -- all routes defined or mounted here
- `vite.config.ts`: Build configuration pointing to `src/index.tsx`

**Configuration:**
- `package.json`: Dependencies, scripts
- `tsconfig.json`: TypeScript compiler options
- `vite.config.ts`: Vite + Hono build plugins
- `vercel.json`: Vercel deployment headers and CORS config
- `wrangler.jsonc`: Cloudflare Pages config, D1 database bindings
- `ecosystem.config.cjs`: PM2 development process config

**Core Logic:**
- `src/types.ts`: All domain model interfaces and API request types
- `src/utils.ts`: Shared utility functions (ID generation, validation, DB lookups)
- `src/db.ts`: Neon PostgreSQL adapter
- `src/db-supabase.ts`: Supabase PostgreSQL adapter
- `src/lib/supabase/`: Complete Supabase client library

**Testing:**
- `tests/push-notifications.test.sh`: Shell-based push notification test
- `mobile/src/screens/__tests__/`: Mobile screen tests
- `mobile/src/api/__tests__/`: Mobile API client tests

## Naming Conventions

**Files:**
- API modules: `kebab-case.ts` (e.g., `ai-coach.ts`, `push-notifications.ts`, `auth-routes.ts`)
- Page templates: `kebab-case.ts` (e.g., `user-portal.ts`, `login-system.ts`)
- Lib modules: `kebab-case.ts` or `camelCase.ts`
- Mobile screens: `PascalCaseScreen.tsx` (e.g., `DashboardScreen.tsx`, `AICoachScreen.tsx`)

**Directories:**
- Lowercase, hyphenated where needed (e.g., `src/api/`, `src/lib/supabase/`)

**Exports:**
- API modules: `export default` a Hono instance (e.g., `const checkinsApi = new Hono(); ... export default checkinsApi`)
- Page modules: Named export of HTML string (e.g., `export const userPortalHtml = \`...\``)
- Types: Named exports of interfaces and types

## Where to Add New Code

**New API Feature:**
1. Create `src/api/{feature-name}.ts`
2. Create a `new Hono()` sub-router, define routes, `export default`
3. Import and mount in `src/index.tsx`: `import featureApi from './api/{feature-name}'` then `app.route('/api/{feature-name}', featureApi)`
4. Add relevant types to `src/types.ts`
5. Add SQL migration to `migrations/` with next sequence number

**New Page:**
1. Create `src/pages/{page-name}.ts`
2. Export an HTML string constant: `export const pageNameHtml = \`<!DOCTYPE html>...\``
3. Import and add route in `src/index.tsx`: `app.get('/page-name', (c) => c.html(pageNameHtml))`
4. Include TailwindCSS CDN, Font Awesome, and inline `<script>` for interactivity

**New Component (shared HTML):**
- Add to `src/components/` as a TypeScript file exporting an HTML string
- Import in page templates that need it

**New Utility Function:**
- Add to `src/utils.ts` with JSDoc comment and proper typing

**New Database Migration:**
- Add `migrations/NNNN_description.sql` with the next sequential number
- Run via `npm run db:migrate`

**New Supabase Integration:**
- Add client utilities to `src/lib/supabase/`
- Export from `src/lib/supabase/index.ts` barrel

**New Mobile Screen:**
- Add to `mobile/src/screens/{ScreenName}Screen.tsx`
- Register in `mobile/src/navigation/`

## Special Directories

**`migrations/`:**
- Purpose: Sequential SQL schema migrations
- Generated: No (hand-written)
- Committed: Yes

**`supabase-migrations/`:**
- Purpose: Supabase-specific migration files
- Generated: No
- Committed: Yes

**`public/`:**
- Purpose: Static assets served directly by CDN/hosting platform
- Generated: Some images in `public/images/generated/`
- Committed: Yes

**`dist/` (not committed):**
- Purpose: Vite build output
- Generated: Yes, by `npm run build`
- Committed: No (in `.gitignore`)

**`.vercel/` (not committed):**
- Purpose: Vercel build output
- Generated: Yes, by Vite Vercel plugin
- Committed: No

**`mobile/`:**
- Purpose: React Native mobile app (separate from web)
- Generated: No
- Committed: Yes

**`docs/`:**
- Purpose: Project documentation and design docs
- Generated: No
- Committed: Yes

---

*Structure analysis: 2026-03-05*
