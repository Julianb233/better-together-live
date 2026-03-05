# Technology Stack

**Analysis Date:** 2026-03-05

## Languages

**Primary:**
- TypeScript (ESNext target) - All application code (`src/**/*.ts`, `src/**/*.tsx`)

**Secondary:**
- SQL - Database migrations (`migrations/*.sql`)
- Shell (Bash) - Deployment and utility scripts (`scripts/*.sh`)

## Runtime

**Environment:**
- Node.js (no `.nvmrc` or `.node-version` detected; compatible with Cloudflare Workers runtime)
- Cloudflare Workers (via Wrangler, compatibility_date `2025-08-15`, `nodejs_compat` flag enabled)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` present (lockfileVersion 3)

## Frameworks

**Core:**
- Hono `^4.9.2` - HTTP framework, routing, middleware, JSX server rendering
  - Entry point: `src/index.tsx`
  - JSX source: `hono/jsx` (configured in `tsconfig.json` via `jsxImportSource`)
  - Renderer: `src/renderer.tsx` using `hono/jsx-renderer`
  - CORS middleware: `hono/cors`

**Testing:**
- No test framework installed. `npm run test` is a `curl` smoke test only.

**Build/Dev:**
- Vite `^6.3.5` - Build tool and dev server
  - Config: `vite.config.ts`
- `@hono/vite-build` `^1.8.0` - Vite plugin for Hono builds (Vercel output target)
- `@hono/vite-dev-server` `^0.18.2` - Vite plugin for Hono dev server with HMR

## Key Dependencies

**Critical (Production):**
- `hono` `^4.9.2` - Core web framework, handles all routing and rendering
- `@supabase/supabase-js` `^2.89.0` - Primary database client and auth provider
- `@supabase/ssr` `^0.8.0` - Supabase server-side rendering helpers (cookie-based auth)
- `jose` `^6.1.3` - Edge-compatible JWT operations (custom auth system)
- `livekit-server-sdk` `^2.15.0` - LiveKit video/audio room management and token generation
- `resend` `^6.6.0` - Transactional email service SDK
- `@neondatabase/serverless` `^0.9.5` - Legacy/fallback serverless PostgreSQL client

**Infrastructure (Dev):**
- `vite` `^6.3.5` - Build toolchain
- `@hono/vite-build` `^1.8.0` - Vercel-targeted build output
- `@hono/vite-dev-server` `^0.18.2` - Local development server

**Notable Absent Dependencies:**
- No React (client-side) - This is a server-rendered app with vanilla JS for interactivity
- No ORM (Drizzle, Prisma, etc.) - Raw SQL via Neon client or Supabase query builder
- No Stripe SDK - Stripe API called via raw `fetch` to `api.stripe.com`
- No test framework (Vitest, Jest, etc.)
- No linter or formatter configured (no ESLint, Prettier, Biome)
- No `zod` in `package.json`, but it is imported in `src/api/ai-coach.ts` (likely available transitively or missing from manifest)

## Configuration

**TypeScript:**
- Config: `tsconfig.json`
- Target: `ESNext`
- Module: `ESNext` with `Bundler` resolution
- Strict mode: enabled
- JSX: `react-jsx` with `jsxImportSource: "hono/jsx"`
- Types: `vite/client`

**Vite:**
- Config: `vite.config.ts`
- Plugins: `@hono/vite-build/vercel` (Vercel output), `@hono/vite-dev-server` (entry: `src/index.tsx`)
- Output: `.vercel/output` (for Vercel deployment), `dist/` (for Cloudflare Pages)

**Cloudflare (Wrangler):**
- Config: `wrangler.jsonc`
- Project name: `better-together`
- D1 database binding: `DB` (database IDs are placeholder values)
- Environments: `production`, `preview`
- `nodejs_compat` flag enabled
- Pages build output: `./dist`

**Vercel:**
- Config: `vercel.json`
- Build command: `npm run build`
- Output: `.vercel/output`
- Framework: `null` (custom)
- CORS headers configured for `/api/*` routes

**PM2:**
- Config: `ecosystem.config.cjs`
- Runs `wrangler pages dev dist` on port 3000
- Single fork-mode instance for development

**Module System:**
- ESM (`"type": "module"` in `package.json`)

## Environment Configuration

**Required Variables (from `.env.example`):**

| Variable | Purpose | Required |
|----------|---------|----------|
| `SUPABASE_URL` | Supabase project URL | Yes |
| `SUPABASE_ANON_KEY` | Supabase public/anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase admin key (server-side) | Yes (production) |
| `STRIPE_SECRET_KEY` | Stripe payments | Yes (payments) |
| `STRIPE_PUBLISHABLE_KEY` | Stripe client-side | Yes (payments) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook verification | Yes (payments) |
| `RESEND_API_KEY` | Email sending | Yes (email) |
| `LIVEKIT_URL` | LiveKit server URL | Yes (video) |
| `LIVEKIT_API_KEY` | LiveKit auth | Yes (video) |
| `LIVEKIT_API_SECRET` | LiveKit auth | Yes (video) |
| `FCM_SERVER_KEY` | Firebase push (Android) | Optional |
| `FCM_PROJECT_ID` | Firebase project ID | Optional |
| `APNS_TEAM_ID` | Apple push (iOS) | Optional |
| `APNS_KEY_ID` | Apple push (iOS) | Optional |
| `APNS_PRIVATE_KEY` | Apple push (iOS) | Optional |
| `ENVIRONMENT` | `development` or `production` | Optional |
| `APP_URL` | Application base URL | Optional |
| `JWT_SECRET` | Custom JWT signing key | Optional (has default) |
| `ADMIN_API_KEY` | Admin broadcast auth | Optional |

**Build Commands:**
```bash
npm run dev          # Vite dev server with Hono plugin (port 3000)
npm run build        # Vite production build
npm run preview      # Preview production build locally
npm run deploy       # Build + deploy to Vercel (vercel --prod)
npm run db:migrate   # Run SQL migrations (node scripts/migrate.js)
npm run clean-port   # Kill process on port 3000
```

## Platform Requirements

**Development:**
- Node.js (ESNext compatible, likely 18+)
- npm
- Port 3000 available
- Wrangler CLI (for Cloudflare Pages dev via PM2)

**Production (Dual Deployment Targets):**
- Vercel (primary) - Configured via `vercel.json` and `@hono/vite-build/vercel`
- Cloudflare Pages (secondary) - Configured via `wrangler.jsonc` with D1 database bindings
- Domain: `better-together.app` (configured in Wrangler)

## Frontend/Styling

**CSS Framework:**
- TailwindCSS v2.2.19 via CDN (`https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css`)
- No build-time Tailwind processing

**Icons:**
- Font Awesome 6.4.0 via CDN (`https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`)

**Fonts:**
- Google Fonts: Inter (weights 300-700)

**Custom Styles:**
- Inline CSS in `src/renderer.tsx` (animations, hover effects, scrollbar)
- Static stylesheet: `public/static/styles.css`

---

*Stack analysis: 2026-03-05*
