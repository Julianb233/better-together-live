# External Integrations

**Analysis Date:** 2026-03-05

## APIs & External Services

**Database & Auth -- Supabase:**
- Primary database and authentication provider
- SDK: `@supabase/supabase-js` `^2.89.0`, `@supabase/ssr` `^0.8.0`
- Client library: `src/lib/supabase/` (barrel export at `src/lib/supabase/index.ts`)
  - `src/lib/supabase/client.ts` - Browser client creation
  - `src/lib/supabase/server.ts` - Server client, admin client, cookie-based auth
  - `src/lib/supabase/middleware.ts` - Auth middleware (`requireAuth`, `optionalAuth`)
  - `src/lib/supabase/types.ts` - Generated database types
- DB wrapper: `src/db-supabase.ts` - `SupabaseDatabase` class with D1-compatible API
- Auth routes: `src/api/supabase-auth.ts` - Signup, login, logout via Supabase Auth
- Auth: Cookie-based sessions via `@supabase/ssr`
- Env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`

**Database -- Neon (Legacy/Fallback):**
- Serverless PostgreSQL, used as alternate database adapter
- SDK: `@neondatabase/serverless` `^0.9.5`
- Client: `src/db.ts` - `Database` class wrapping Neon query function
- Connection caching enabled (`neonConfig.fetchConnectionCache = true`)
- Env var: `DATABASE_URL` (PostgreSQL connection string)
- Note: Legacy adapter; new features should use Supabase (`src/db-supabase.ts`)

**Database -- Cloudflare D1 (Configured but not active):**
- D1 bindings configured in `wrangler.jsonc` (binding name: `DB`)
- Database IDs are placeholder values (`"local"`, `"REPLACE_WITH_PRODUCTION_DB_ID"`)
- Not currently wired to application code

**Payments -- Stripe:**
- Subscription billing and checkout
- Implementation: Raw `fetch` calls to `https://api.stripe.com/v1` (no Stripe SDK)
- API version: `2023-10-16`
- Routes: `src/api/payments.ts`
- Features: Checkout session creation, subscription management, webhook handling
- Subscription tiers: Growing Together ($39/mo), Growing Together+ ($69/mo), Annual ($240/yr)
- Env vars: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

**Video/Audio -- LiveKit:**
- Real-time video and audio for couples sessions and community events
- SDK: `livekit-server-sdk` `^2.15.0`
- Classes used: `AccessToken`, `RoomServiceClient`
- Routes: `src/api/video.ts`
- Features: Token generation (2h TTL), room creation, participant management
- Default URL: `wss://better-togther-app-ior6zkzv.livekit.cloud` (note: typo in URL)
- Env vars: `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET`

**Email -- Resend:**
- Transactional email (partner invites, notifications, gift receipts)
- SDK: `resend` `^6.6.0` (also raw fetch to `https://api.resend.com/emails`)
- Routes: `src/api/email.ts`
- Development mode: Simulates emails to console when API key missing
- Default from: `noreply@better-together.app`
- Env vars: `RESEND_API_KEY`, `FROM_EMAIL`

**Push Notifications -- Firebase Cloud Messaging (Android):**
- FCM v1 HTTP API (`https://fcm.googleapis.com/v1/projects/{PROJECT_ID}/messages:send`)
- Routes: `src/api/push-notifications.ts`
- Development mode: Simulates notifications when keys missing
- Env vars: `FCM_SERVER_KEY`, `FCM_PROJECT_ID`

**Push Notifications -- Apple Push Notification service (iOS):**
- APNs HTTP/2 API
- Production: `https://api.push.apple.com`
- Sandbox: `https://api.sandbox.push.apple.com`
- Routes: `src/api/push-notifications.ts`
- Env vars: `APNS_TEAM_ID`, `APNS_KEY_ID`, `APNS_PRIVATE_KEY`, `APNS_BUNDLE_ID`, `APNS_PRODUCTION`

**AI Coach:**
- Routes: `src/api/ai-coach.ts`
- Current state: Mock keyword-based responses (no actual AI integration)
- Planned: OpenAI or Anthropic integration (noted in TODO comment)
- No external API calls or env vars currently required

## Authentication & Identity

**Dual Auth System:**

1. **Supabase Auth (Primary/New):**
   - Implementation: `src/api/supabase-auth.ts`, `src/lib/supabase/server.ts`
   - Features: Email/password signup, login, logout, session management
   - Cookie-based sessions via `@supabase/ssr`
   - Middleware: `src/lib/supabase/middleware.ts` (`requireAuth`, `optionalAuth`)

2. **Custom JWT Auth (Legacy):**
   - Implementation: `src/api/auth.ts`, `src/api/auth-routes.ts`
   - Library: `jose` `^6.1.3` (edge-compatible JWT)
   - Algorithm: HS256
   - Token types: Access (15m), Refresh (7d), Reset (1h)
   - Cookie-based with `httpOnly`, `secure`, `sameSite: lax`
   - Features: Register, login, forgot password, token refresh, rate limiting
   - Default secret: `better-together-secret-key-change-in-production` (WARNING: change in production)
   - Env var: `JWT_SECRET`

## Data Storage

**Databases:**
- Supabase PostgreSQL (primary) - `src/db-supabase.ts`
  - Connection: `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
  - Client: Supabase JS client with query builder interface
- Neon PostgreSQL (legacy) - `src/db.ts`
  - Connection: `DATABASE_URL`
  - Client: `@neondatabase/serverless` with raw SQL

**Migrations:**
- Location: `migrations/`
- Format: Numbered SQL files (`0001_initial_relationship_schema.sql` through `0005_community_features.sql`)
- Runner: `scripts/migrate.js` (`npm run db:migrate`)
- Supabase-specific migrations: `supabase-migrations/`

**File Storage:**
- No dedicated file storage integration detected
- Profile photos referenced in types (`profile_photo_url`) but no upload implementation found

**Caching:**
- None (no Redis, KV, or caching layer)

## Monitoring & Observability

**Error Tracking:**
- Sentry DSN env var defined in `.env.example` (`SENTRY_DSN`) but no Sentry SDK installed
- Errors logged to `console.error` throughout API routes

**Analytics:**
- Custom analytics module: `src/api/analytics.ts`, `src/api/analytics-enhanced.ts`
- Google Analytics ID env var defined (`GOOGLE_ANALYTICS_ID`) but no GA SDK installed
- Analytics dashboard page: `src/pages/analytics-dashboard.tsx`

**Logs:**
- `console.log` / `console.error` / `console.warn` throughout
- No structured logging framework

## CI/CD & Deployment

**Primary Hosting -- Vercel:**
- Config: `vercel.json`
- Build: Vite with `@hono/vite-build/vercel` plugin
- Output: `.vercel/output`
- Deploy command: `npm run deploy` (`npm run build && vercel --prod`)
- OIDC token present in `.env.vercel` (team: `ai-acrobatics`, project: `better-together-live`)

**Secondary Hosting -- Cloudflare Pages:**
- Config: `wrangler.jsonc`
- Build output: `dist/`
- D1 database bindings configured (but with placeholder IDs)
- PM2 runs `wrangler pages dev` for local development

**CI Pipeline:**
- None detected (no `.github/workflows/`, no CI config files)

**Process Management:**
- PM2 via `ecosystem.config.cjs` (development only)

## CDN & Asset Hosting

**External CDNs:**
- TailwindCSS v2.2.19: `https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css`
- Font Awesome 6.4.0: `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css`
- Google Fonts (Inter): `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap`

**Static Assets:**
- Served from `public/` directory by hosting platform
- Custom CSS: `public/static/styles.css`

## Environment Configuration

**Required env vars (minimum for development):**
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ENVIRONMENT=development
APP_URL=http://localhost:3000
```

**Required env vars (full production):**
```bash
# Supabase (required)
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Stripe (required for payments)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Resend (required for email)
RESEND_API_KEY=
FROM_EMAIL=noreply@better-together.app

# LiveKit (required for video)
LIVEKIT_URL=
LIVEKIT_API_KEY=
LIVEKIT_API_SECRET=

# Push Notifications (optional)
FCM_SERVER_KEY=
FCM_PROJECT_ID=
APNS_TEAM_ID=
APNS_KEY_ID=
APNS_PRIVATE_KEY=
APNS_BUNDLE_ID=com.bettertogether.app
APNS_PRODUCTION=false

# App Settings
ENVIRONMENT=production
APP_URL=https://better-together.app
JWT_SECRET=<strong-random-secret>
ADMIN_API_KEY=<strong-random-key>

# Analytics (optional)
GOOGLE_ANALYTICS_ID=
SENTRY_DSN=

# Feature Flags
ENABLE_AI_COACH=true
ENABLE_SUBSCRIPTION_BOXES=true
ENABLE_PARTNER_INTEGRATIONS=false
ENABLE_ANALYTICS_TRACKING=true

# Rate Limiting
RATE_LIMIT_PER_MINUTE=60
RATE_LIMIT_PER_HOUR=1000
```

**Secrets location:**
- Development: `.env.local` (gitignored)
- Vercel: Vercel environment variables dashboard
- Cloudflare: `wrangler secret put <KEY>`

## Webhooks & Callbacks

**Incoming:**
- Stripe webhooks: `POST /api/payments/webhook` (in `src/api/payments.ts`)
  - Verified via `STRIPE_WEBHOOK_SECRET`

**Outgoing:**
- None detected

## Feature Flags

Four feature flags defined in `.env.example`:
- `ENABLE_AI_COACH` - Toggle AI coaching feature
- `ENABLE_SUBSCRIPTION_BOXES` - Toggle subscription box feature
- `ENABLE_PARTNER_INTEGRATIONS` - Toggle partner integrations
- `ENABLE_ANALYTICS_TRACKING` - Toggle analytics event tracking

---

*Integration audit: 2026-03-05*
