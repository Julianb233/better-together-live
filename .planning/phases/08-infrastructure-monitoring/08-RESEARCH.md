# Phase 8: Infrastructure & Monitoring - Research

**Researched:** 2026-03-05
**Domain:** CI/CD, error tracking, structured logging, Hono entry point refactoring
**Confidence:** HIGH

## Summary

This phase covers four distinct areas: (1) refactoring the 1856-line `src/index.tsx` into a clean entry point under 500 lines, (2) upgrading the existing GitHub Actions CI/CD pipeline to include linting and type-checking gates, (3) adding Sentry error tracking via `@sentry/node`, and (4) replacing ~200 `console.error` calls across 30+ files with structured logging via `hono-pino`.

The codebase is a Hono server-rendered app using `@hono/vite-build` for Vercel deployment. There is already a `deploy.yml` workflow targeting Cloudflare Pages with staging/production environments, but it lacks lint and proper test steps. No ESLint config exists. No test framework is installed. TypeScript strict mode is enabled but `tsc --noEmit` is run with `|| echo` to swallow errors.

**Primary recommendation:** Extract inline routes and homepage TSX from `index.tsx` first (pure refactor, no behavior change), then layer on ESLint, Sentry, and structured logging as separate tasks.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@sentry/node` | ^9.x | Error tracking + performance monitoring | Official Sentry SDK for Node.js; Sentry docs recommend this for Hono on Node.js runtime |
| `hono-pino` | ^0.10 | Structured logging middleware for Hono | Purpose-built Hono middleware wrapping pino; 144 stars, active maintenance |
| `pino` | ^9.x | JSON structured logger | Industry standard Node.js logger; fastest, lowest overhead |
| `eslint` | ^9.x | Linting | Required for CI gate; flat config is now default |
| `typescript-eslint` | ^8.x | TypeScript lint rules | Standard TypeScript linting integration |
| `vitest` | ^3.x | Test runner | Recommended by Hono docs; works with Vite config |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@hono/eslint-config` | ^2.0 | Hono-specific ESLint preset | Optional; provides sensible defaults for Hono projects |
| `pino-pretty` | ^13.x | Human-readable dev logs | Dev only; do NOT use in production |
| `@sentry/profiling-node` | ^9.x | Performance profiling | Optional; adds CPU profiling to Sentry traces |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `hono-pino` | Hono built-in `logger()` | Built-in only does request/response line logging, no structured JSON, no context binding |
| `@sentry/node` | `@hono/sentry` (toucan-js) | DEPRECATED -- Sentry docs explicitly recommend `@sentry/node` for Node.js runtime |
| `pino` | `winston` | Winston is slower, heavier; pino is the standard for high-perf Node.js |

**Installation:**
```bash
# Error tracking
npm install @sentry/node

# Structured logging
npm install hono-pino pino
npm install -D pino-pretty

# Linting
npm install -D eslint typescript-eslint @hono/eslint-config

# Testing
npm install -D vitest
```

## Architecture Patterns

### Recommended Project Structure (post-refactor)
```
src/
  index.tsx              # App creation, middleware, route mounting ONLY (<500 lines)
  middleware/
    sentry.ts            # Sentry init + error handler middleware
    logging.ts           # hono-pino middleware config
  routes/
    pages.ts             # All HTML page route registrations (extracted from index.tsx)
    users-inline.ts      # User CRUD routes (extracted from index.tsx lines 101-192)
    relationships-inline.ts  # Relationship routes (extracted from index.tsx lines 199-287)
  pages/
    home.tsx             # Homepage TSX (extracted from index.tsx lines 566-1807)
  api/                   # Already modularized (31 files, keep as-is)
  lib/
    logger.ts            # Logger instance factory
```

### Pattern 1: Entry Point as Pure Composition
**What:** `index.tsx` does ONLY: create app, attach middleware, mount routes, export.
**When to use:** Always -- this is the target architecture.
**Example:**
```typescript
// src/index.tsx -- TARGET state (<500 lines)
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { renderer } from './renderer'
import { sentryMiddleware } from './middleware/sentry'
import { loggingMiddleware } from './middleware/logging'
import type { Env } from './types'

// API route modules
import analyticsApi from './api/analytics'
import emailApi from './api/email'
// ... other imports ...

// Page routes
import { pageRoutes } from './routes/pages'
import { userRoutes } from './routes/users-inline'
import { relationshipRoutes } from './routes/relationships-inline'

const app = new Hono<{ Bindings: Env }>()

// Global middleware
app.use('*', sentryMiddleware())
app.use('*', loggingMiddleware())
app.use('/api/*', cors())
app.use(renderer)

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// Mount inline routes (extracted from index.tsx)
app.route('', userRoutes)
app.route('', relationshipRoutes)

// Mount modular API routes
app.route('/api/analytics', analyticsApi)
// ... mount all 28 API route modules ...

// Mount page routes
app.route('', pageRoutes)

export default app
```

### Pattern 2: Sentry Initialization for Vercel Serverless
**What:** Initialize Sentry at module load time (top of entry), not in middleware.
**When to use:** Vercel serverless functions where `--import` flag is not available.
**Example:**
```typescript
// src/middleware/sentry.ts
import * as Sentry from '@sentry/node'
import type { MiddlewareHandler } from 'hono'

// Initialize at module scope -- runs once per cold start
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.VERCEL_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    sendDefaultPii: false,
  })
}

export const sentryMiddleware = (): MiddlewareHandler => {
  return async (c, next) => {
    try {
      await next()
    } catch (error) {
      Sentry.captureException(error, {
        extra: {
          method: c.req.method,
          url: c.req.url,
          path: c.req.path,
        }
      })
      throw error // Re-throw so Hono's error handler still works
    }
  }
}
```

### Pattern 3: Structured Logging Replacing console.error
**What:** Replace `console.error('Something:', error)` with `c.var.logger.error({ err: error }, 'Something')`.
**When to use:** Every catch block and error path in every API route.
**Example:**
```typescript
// src/middleware/logging.ts
import { pinoLogger } from 'hono-pino'
import pino from 'pino'

export const loggingMiddleware = () => pinoLogger({
  pino: pino({
    level: process.env.LOG_LEVEL || 'info',
    ...(process.env.NODE_ENV !== 'production' && {
      transport: { target: 'pino-pretty' }
    })
  })
})

// In route handlers, replace:
//   console.error('Create user error:', error)
// With:
//   c.var.logger.error({ err: error, userId }, 'Failed to create user')
```

### Pattern 4: Health Check Endpoint
**What:** Simple `/health` route returning JSON with status and metadata.
**When to use:** Required for uptime monitoring, load balancer checks.
**Example:**
```typescript
app.get('/health', async (c) => {
  const health: Record<string, unknown> = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) || 'dev',
    environment: process.env.VERCEL_ENV || 'development',
  }

  // Optional: check database connectivity
  try {
    const db = createDatabase(c.env as Env)
    await db.run('SELECT 1')
    health.database = 'connected'
  } catch {
    health.database = 'disconnected'
    health.status = 'degraded'
  }

  return c.json(health, health.status === 'ok' ? 200 : 503)
})
```

### Anti-Patterns to Avoid
- **Sentry in Edge Runtime:** `@sentry/node` does NOT work in Vercel Edge Runtime. The Hono vite-build plugin deploys to Node.js serverless functions, which is correct -- do NOT switch to edge runtime.
- **console.log in production:** After adding pino, ALL logging must go through the logger. Do not mix `console.*` and pino.
- **Sentry catching 4xx errors:** Sentry should only capture 5xx. Status codes 3xx/4xx are user errors, not application errors. The default Sentry Hono integration already excludes these.
- **Fat middleware file:** Do not put Sentry init, pino config, CORS, and auth all in one middleware file. Separate concerns.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Error tracking | Custom error webhook/email system | `@sentry/node` | Stack traces, breadcrumbs, release tracking, source maps, alerting |
| Structured logging | Custom JSON logger wrapper | `hono-pino` + `pino` | Request correlation, child loggers, serializers, high performance |
| Request ID tracking | Custom header middleware | `hono-pino` (auto-assigns request context) | Already handled by pino's child logger per request |
| CI lint/typecheck | Custom shell scripts | ESLint + `tsc --noEmit` in GitHub Actions | Standard tooling, cacheable, well-documented |
| Health check | Custom monitoring page | Simple JSON endpoint + external uptime service | JSON is parseable by monitoring tools (UptimeRobot, Vercel checks) |

**Key insight:** The codebase already has 31 modularized API route files. The `index.tsx` refactor is mostly extraction of the remaining ~5 inline route handlers and the ~1200-line homepage TSX, not a full rewrite.

## Common Pitfalls

### Pitfall 1: Sentry Init Timing in Serverless
**What goes wrong:** Sentry is initialized inside a request handler or middleware instead of at module scope, causing it to re-init on every request.
**Why it happens:** Developers follow traditional app patterns, not serverless patterns.
**How to avoid:** Put `Sentry.init()` at the top level of the module (outside any function). In Vercel serverless, each cold start loads the module once, so top-level init runs once per instance.
**Warning signs:** Sentry dashboard shows duplicate events or missing transactions.

### Pitfall 2: Breaking the Homepage During Extraction
**What goes wrong:** Extracting the 1200-line homepage TSX breaks layouts, script tags, or styles.
**Why it happens:** The homepage has inline `<script>` and `<style>` blocks with template literals that are sensitive to extraction.
**How to avoid:** Extract to `src/pages/home.tsx` as a single function that returns the full JSX. Do not restructure the JSX itself -- just move it. Verify with `npm run build` and visual inspection.
**Warning signs:** Build errors related to JSX, or the homepage looks different after deployment.

### Pitfall 3: ESLint Flat Config vs Legacy Config
**What goes wrong:** Creating `.eslintrc.json` (legacy format) instead of `eslint.config.mjs` (flat config).
**Why it happens:** Tutorials and training data still reference the old format.
**How to avoid:** Use `eslint.config.mjs` (flat config). ESLint v9 made flat config the default. The `@hono/eslint-config` package supports flat config.
**Warning signs:** ESLint errors about unrecognized config format.

### Pitfall 4: Type-Check Swallowing Errors
**What goes wrong:** The current CI runs `npx tsc --noEmit || echo "Type checking completed with warnings"` which ALWAYS passes.
**Why it happens:** Quick fix to get CI green without fixing type errors.
**How to avoid:** Remove the `|| echo` fallback. Fix actual type errors. If too many errors exist, use `// @ts-expect-error` with explanations for known issues and track them.
**Warning signs:** CI is green but production has runtime type errors.

### Pitfall 5: pino in Vercel Serverless Startup Time
**What goes wrong:** pino-pretty imported in production, adding cold start latency.
**Why it happens:** Conditional import done incorrectly.
**How to avoid:** Use `process.env.NODE_ENV !== 'production'` check. pino-pretty should be a devDependency only. In production, use raw JSON output -- pipe to a log aggregator.
**Warning signs:** Cold start times increase by 200-500ms.

## Code Examples

### ESLint Flat Config for This Project
```javascript
// eslint.config.mjs
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist/', 'node_modules/', '.vercel/']
  },
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',  // Too many to fix at once
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: [] }],  // Flag all console.* for migration to pino
    }
  }
)
```

### Updated package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "deploy": "npm run build && vercel --prod"
  }
}
```

### Updated CI Pipeline (deploy.yml)
```yaml
# Key changes to lint-and-test job:
- name: Run linting
  run: npm run lint

- name: Run type checking
  run: npx tsc --noEmit  # NO fallback || echo

- name: Run tests
  run: npm test

- name: Build application
  run: npm run build
```

### Extracting Inline User Routes
```typescript
// src/routes/users-inline.ts
import { Hono } from 'hono'
import type { Env } from '../types'
import { createDatabase } from '../db'
import {
  generateId, getCurrentDateTime, isValidEmail,
  getUserByEmail, getUserById
} from '../utils'

const users = new Hono<{ Bindings: Env }>()

users.post('/api/users', async (c) => {
  // ... exact same handler code from index.tsx lines 101-136 ...
})

users.get('/api/users/:userId', async (c) => {
  // ... exact same handler code from index.tsx lines 140-153 ...
})

users.put('/api/users/:userId', async (c) => {
  // ... exact same handler code from index.tsx lines 157-191 ...
})

export default users
```

### Extracting Homepage TSX
```typescript
// src/pages/home.tsx
// Move the ENTIRE JSX block from index.tsx lines 566-1807 here
export const homeHtml = (
  <div className="min-h-screen overflow-x-hidden">
    {/* ... all existing JSX unchanged ... */}
  </div>
)

// Then in index.tsx:
import { homeHtml } from './pages/home'
app.get('/', (c) => c.render(homeHtml))
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `@hono/sentry` (toucan-js) | `@sentry/node` official SDK | 2024 | Deprecated community middleware; use official SDK |
| `.eslintrc.json` | `eslint.config.mjs` (flat config) | ESLint v9 (2024) | Old format deprecated; flat config is default |
| `console.error` everywhere | Structured JSON logging (pino) | Industry standard | Machine-parseable logs, log levels, request correlation |
| Manual Vercel deploy | GitHub Actions CI/CD | Already partially done | Need to strengthen gates (lint, typecheck, test) |

**Deprecated/outdated:**
- `@hono/sentry`: Deprecated, use `@sentry/node` directly
- `.eslintrc.*`: Legacy ESLint config format, use flat config
- `@sentry/serverless`: Discontinued in Sentry v8, use `@sentry/node`

## Open Questions

1. **Sentry DSN provisioning**
   - What we know: Need a Sentry DSN for the project
   - What's unclear: Whether a Sentry project already exists for Better Together
   - Recommendation: Check 1Password for existing Sentry credentials; create new Sentry project if needed

2. **Vercel environment variables**
   - What we know: Vercel deployment is configured via `vercel.json`; env vars needed for SENTRY_DSN, LOG_LEVEL
   - What's unclear: Whether Vercel project is set up with staging env vars separately from production
   - Recommendation: Set env vars via Vercel dashboard or `vercel env` CLI for both production and preview

3. **TypeScript strictness**
   - What we know: `tsconfig.json` has `"strict": true` but current CI swallows tsc errors
   - What's unclear: How many type errors exist when running `tsc --noEmit` without fallback
   - Recommendation: Run `tsc --noEmit 2>&1 | tail -5` to assess scope before making CI strict

4. **Log aggregation**
   - What we know: pino outputs JSON; Vercel captures function logs
   - What's unclear: Whether Vercel's built-in log viewer is sufficient or if a log aggregator (Axiom, Datadog) is needed
   - Recommendation: Start with Vercel's built-in logs; add Axiom integration later if needed (Vercel has native Axiom integration)

## Sources

### Primary (HIGH confidence)
- [Sentry Hono Guide](https://docs.sentry.io/platforms/javascript/guides/hono/) - Official setup docs, verified via WebFetch
- [Hono Testing Guide](https://hono.dev/docs/guides/testing) - Official testing docs
- [Hono Vercel Guide](https://hono.dev/docs/getting-started/vercel) - Official Vercel deployment docs

### Secondary (MEDIUM confidence)
- [hono-pino GitHub](https://github.com/maou-shonen/hono-pino) - v0.10.3, verified via WebFetch
- [typescript-eslint Getting Started](https://typescript-eslint.io/getting-started/) - Flat config setup
- [@hono/eslint-config npm](https://www.npmjs.com/package/@hono/eslint-config) - v2.0.6

### Tertiary (LOW confidence)
- Sentry in Vercel serverless Node.js functions -- community discussions confirm it works but no official Vercel+Sentry+Hono guide exists

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Official Sentry docs explicitly cover Hono; hono-pino is purpose-built
- Architecture: HIGH - Based on direct analysis of the 1856-line index.tsx; refactor pattern is straightforward extraction
- Pitfalls: HIGH - Based on codebase analysis (swallowed tsc errors, console.error usage counted across files)
- CI/CD: MEDIUM - Existing deploy.yml provides foundation; lint/test gates are standard but untested in this codebase

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (30 days -- all tools are stable/mature)
