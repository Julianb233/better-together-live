import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { except } from 'hono/combine'
import { requireAuth } from './lib/supabase/middleware'
import { rateLimitMiddleware } from './lib/rate-limit'
import { supabaseCookieRelay, clearLegacyCookies } from './lib/supabase/middleware'
// Static files served by platform (Vercel/Cloudflare)
import { renderer } from './renderer'
import type { Env } from './types'

// Route modules: inline API handlers (extracted from index.tsx)
import inlineApi from './routes/inline-api'
import { pageRoutes } from './routes/pages'

// API route modules
import analyticsApi from './api/analytics'
import emailApi from './api/email'
import pushApi from './api/push-notifications'
import checkinsApi from './api/checkins'
import goalsApi from './api/goals'
import activitiesApi from './api/activities'
import datesApi from './api/dates'
import challengesApi from './api/challenges'
import dashboardApi from './api/dashboard'
import notificationsApi from './api/notifications'
import supabaseAuth from './api/supabase-auth'
import sponsorsApi from './api/sponsors'
import usersApi from './api/users'
import paymentsApi from './api/payments'
import aiCoachApi from './api/ai-coach'
import communitiesApi from './api/communities'
import messagingApi from './api/messaging'
import feedApi from './api/feed'
import postsApi from './api/posts'
import socialApi from './api/social'
import discoveryApi from './api/discovery'
import quizApi from './api/quiz'
import experiencesApi from './api/experiences'
import gamificationApi from './api/gamification'
import recommendationsApi from './api/recommendations'
import intimacyApi from './api/intimacy'
import relationshipsApi from './api/relationships'
import videoApi from './api/video'

const app = new Hono<{ Bindings: Env }>()

// Rate limiting (must be first middleware)
app.use('/api/*', rateLimitMiddleware())

// Enable CORS for API routes (restricted to production domains + localhost in dev)
app.use('/api/*', cors({
  origin: (origin, c) => {
    const allowed = [
      'https://bettertogether.app',
      'https://www.bettertogether.app',
    ]
    // Allow localhost in non-production
    if (c.env?.NODE_ENV !== 'production' || !c.env?.NODE_ENV) {
      allowed.push('http://localhost:3000', 'http://localhost:5173')
    }
    // Allow additional origins from CORS_ORIGINS env var
    const extraOrigins = c.env?.CORS_ORIGINS?.split(',') || []
    allowed.push(...extraOrigins)
    return allowed.includes(origin) ? origin : ''
  },
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400
}))

// Clear legacy bt_* cookies from old custom JWT auth system
app.use('*', clearLegacyCookies())

// Relay @supabase/ssr refreshed token cookies to the browser
app.use('*', supabaseCookieRelay())

// Global auth -- all /api/* routes require auth EXCEPT these public routes
app.use('/api/*', except(
  [
    '/api/auth/*',
    '/api/payments/webhook',
    '/api/health',
  ],
  requireAuth()
))

// Static files served automatically by hosting platform from /public

// Use JSX renderer for HTML pages
app.use(renderer)

// =============================================================================
// INLINE API ROUTES (user CRUD, invite-partner, relationships)
// =============================================================================
app.route('', inlineApi)

// =============================================================================
// API ROUTE MODULES
// =============================================================================

// Analytics API Routes
app.route('/api/analytics', analyticsApi)

// Email API Routes
app.route('/api/email', emailApi)

// Push Notification API Routes
app.route('/api/push', pushApi)

// Check-ins API Routes
app.route('/api/checkins', checkinsApi)

// Goals API Routes
app.route('/api/goals', goalsApi)

// Activities API Routes
app.route('/api/activities', activitiesApi)

// Important Dates API Routes
app.route('/api/important-dates', datesApi)

// Challenges API Routes
app.route('/api/challenges', challengesApi)

// AI Coach API Routes
app.route('/api/ai-coach', aiCoachApi)

// Dashboard API Routes
app.route('/api/dashboard', dashboardApi)

// Notifications API Routes
app.route('/api/notifications', notificationsApi)

// Supabase Auth Routes
app.route('/api/auth', supabaseAuth)

// Sponsors API Routes
app.route('/api/sponsors', sponsorsApi)

// Users API Routes
app.route('/api/users', usersApi)

// Payments API Routes
app.route('/api/payments', paymentsApi)

// Communities API Routes
app.route('/api/communities', communitiesApi)

// Messaging API Routes
app.route('/api/conversations', messagingApi)

// Feed API Routes
app.route('/api/feed', feedApi)

// Posts API Routes
app.route('/api/posts', postsApi)

// Discovery and Search API Routes
app.route('/api', discoveryApi)

// Social Interactions API Routes (reactions, comments, connections, blocks, reports)
app.route('/api', socialApi)

// Quiz API Routes
app.route('/api/quiz', quizApi)

// Experiences API Routes
app.route('/api/experiences', experiencesApi)

// Gamification API Routes (rewards, badges, achievements, points)
app.route('/api', gamificationApi)

// Recommendations API Routes
app.route('/api', recommendationsApi)

// Intimacy API Routes
app.route('/api/intimacy', intimacyApi)

// Relationships API Routes (includes /api/partner/comparison)
app.route('/api', relationshipsApi)

// Video calling routes
app.route('/api/video', videoApi)

// =============================================================================
// PAGE ROUTES (HTML pages, homepage, API docs)
// =============================================================================
app.route('', pageRoutes)

export default app
