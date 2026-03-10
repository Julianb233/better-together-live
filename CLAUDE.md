# Claude Code Project Instructions

## Project Overview

**Better Together** -- A relationship intelligence platform that combines AI-powered coaching, smart scheduling, and personalized suggestions for couples. Features include daily check-ins, shared goals, date activities, gamified challenges, community features, live video, and a multi-stream revenue model. Built as a Hono server-rendered app deployed on Vercel/Cloudflare.

## Credential Lookup Policy

When credentials, API keys, or secrets are needed:

1. **First choice: Shared credentials file**
   - Source the shared credentials: `source /opt/agency-workspace/.shared-credentials`
   - Contains: GEMINI_API_KEY, HUME_API_KEY, HUME_SECRET_KEY, OP_SERVICE_ACCOUNT_TOKEN

2. **Second choice: Environment variables**
   - Check `.env`, `.env.local`, or system environment variables
   - Use `printenv | grep -i <service_name>` to search

3. **Third choice: 1Password CLI**
   - Use `op item list` to search for credentials
   - Use `op item get "<item_name>" --fields label=<field>` to retrieve specific values

4. **Last resort: Ask the user**

## Tech Stack

- **Framework**: Hono (TypeScript, server-rendered TSX)
- **Build**: Vite 6 with `@hono/vite-build` and `@hono/vite-dev-server`
- **Database**: Supabase (PostgreSQL) via `@supabase/supabase-js` + `@supabase/ssr`; also Neon serverless support
- **Auth**: Supabase Auth + JWT (jose) + custom auth routes
- **Email**: Resend for transactional email
- **Video**: LiveKit server SDK for live video features
- **Deployment**: Vercel + Cloudflare Pages
- **Module system**: ESM (`"type": "module"`)

## Directory Structure

```
src/
  index.tsx                 # Hono app entry -- route definitions, middleware, API mounts
  renderer.tsx              # TSX renderer for server-side HTML
  types.ts                  # TypeScript type definitions (User, Relationship, etc.)
  utils.ts                  # Utility functions
  db.ts                     # Neon database connection (D1/SQLite)
  db-supabase.ts            # Supabase database connection
  api/                      # API route modules
    auth.ts, auth-routes.ts # Authentication
    supabase-auth.ts        # Supabase auth integration
    analytics.ts            # Analytics events
    checkins.ts             # Daily check-ins
    goals.ts                # Shared goals
    activities.ts           # Date activities
    challenges.ts           # Relationship challenges
    dashboard.ts            # Dashboard data
    communities.ts          # Community features
    messaging.ts            # In-app messaging
    feed.ts, posts.ts       # Social feed
    social.ts               # Social interactions
    discovery.ts            # User/couple discovery
    quiz.ts                 # Personality/compatibility quizzes
    experiences.ts          # Curated experiences
    gamification.ts         # Badges, streaks, achievements
    recommendations.ts      # AI recommendations
    intimacy.ts             # Intimacy challenges (premium)
    relationships.ts        # Relationship management
    video.ts                # LiveKit video integration
    email.ts                # Resend email
    push-notifications.ts   # Push notification service
    payments.ts             # Payment processing
    sponsors.ts             # Sponsor/partner management
    users.ts                # User profiles
    notifications.ts        # Notification system
    ai-coach.ts             # AI relationship coaching
  components/               # Server-rendered TSX components
  pages/                    # Full-page TSX templates (dashboard, login, portal, etc.)
  lib/                      # Shared utilities
migrations/                 # SQL migration files (numbered)
scripts/                    # Database migration runner, utilities
public/                     # Static assets
mobile/                     # Mobile app considerations
ecosystem.config.cjs        # PM2 process config
```

## Development Commands

```bash
# Dev server
npm run dev                    # Vite dev server with Hono plugin
npm run preview                # Preview production build

# Build & deploy
npm run build                  # Vite production build (output: /dist)
npm run deploy                 # Build + deploy to Vercel

# Database
npm run db:migrate             # Run SQL migrations (node scripts/migrate.js)

# Utility
npm run clean-port             # Kill process on port 3000
npm run test                   # curl localhost:3000 (basic smoke test)
```

## Coding Conventions

- **Server-rendered TSX**: Pages are Hono handler functions returning TSX (not React client components)
- **API modular routes**: Each feature has its own file in `src/api/`, mounted via `app.route()` in `index.tsx`
- **Type definitions**: Central types in `src/types.ts` (User, Relationship, LoveLanguage, etc.)
- **Utility functions**: Shared helpers (generateId, date formatting, validation) in `src/utils.ts`
- **Database**: Two DB adapters -- `db.ts` for Neon/D1/SQLite, `db-supabase.ts` for Supabase; prefer Supabase for new features
- **Pages**: Full HTML page templates in `src/pages/`, using TailwindCSS via CDN
- **No frontend framework**: The frontend is server-rendered HTML with vanilla JavaScript for interactivity -- there is no React client bundle
- **Naming**: snake_case for database columns, camelCase for TypeScript variables

## Key API Integrations

- **Supabase**: Auth, PostgreSQL database, realtime
- **LiveKit**: Live video for couples sessions and community events
- **Resend**: Transactional email (partner invites, notifications, gift receipts)
- **Neon**: Serverless PostgreSQL (alternate DB adapter)
- **AI Coach**: Relationship coaching AI endpoint

## PR Workflow

1. Create a feature branch: `git checkout -b feature/<short-description>`
2. Commit with descriptive messages: `feat: add couples video call scheduling`
3. Prefix commits: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`
4. Push and open PR against `main`
5. Review checklist:
   - Build succeeds (`npm run build`)
   - No secrets committed
   - SQL migrations included for DB changes (add to `migrations/`)
   - New API routes mounted in `src/index.tsx`
   - Types updated in `src/types.ts`

## Common Gotchas

- **No React on client**: This is NOT a React SPA. Pages are server-rendered HTML via Hono TSX. Do not add React client-side code or hooks.
- **Two database adapters**: `db.ts` (Neon/D1) and `db-supabase.ts` (Supabase) exist side by side. Check which one is being used before making DB calls.
- **Vite + Hono**: The `@hono/vite-build` plugin handles the dev server and build. Do not add a separate Express or Node server.
- **Migrations are raw SQL**: No ORM migration tool -- migrations are numbered `.sql` files run by `scripts/migrate.js`
- **PM2 available**: `ecosystem.config.cjs` is configured for PM2 process management in development
- **TailwindCSS via CDN**: Styling uses TailwindCSS loaded from CDN in server-rendered pages, not a build-time Tailwind setup
- **Static assets**: Place in `public/` -- served by the deployment platform (Vercel/Cloudflare)
- **Port 3000**: Default dev port; use `npm run clean-port` if port is occupied
- **No real test suite**: `npm run test` just curls localhost -- add vitest if proper testing is needed

## GitHub

- **Owner**: Julianb233
- **Repo**: better-together-live
