import { Hono } from 'hono'
import type { Env } from '../types'
import { requireAuth, requireAdmin } from '../lib/supabase/middleware'

// Page HTML imports
import { dashboardHtml } from '../pages/dashboard'
import { analyticsDashboardHtml } from '../pages/analytics-dashboard'
import { loginHtml } from '../pages/login'
import { paywallHtml } from '../pages/paywall'
import { loginSystemHtml } from '../pages/login-system'
import { userPortalHtml } from '../pages/user-portal'
import { notificationSettingsHtml } from '../pages/notification-settings'
import { loveLanguagesHtml } from '../pages/love-languages'
import { passwordResetHtml } from '../pages/password-reset'
import { resetPasswordHtml } from '../pages/reset-password'
import { partnerInviteHtml } from '../pages/partner-invite'
import { relationshipStatusHtml } from '../pages/relationship-status'
import { checkinsPageHtml } from '../pages/checkins'
import { goalsHtml } from '../pages/goals'
import { activitiesHtml } from '../pages/activities'
import { importantDatesHtml } from '../pages/important-dates'
import { challengesProgressHtml } from '../pages/challenges-progress'
import { giftSubscriptionHtml } from '../pages/gift-subscription'
import { subscriptionManagementHtml } from '../pages/subscription-management'
import { emailPreferencesHtml } from '../pages/email-preferences'
import { bundlesHtml } from '../pages/bundles'
import { aiCoachHtml } from '../pages/ai-coach'
import { mobileUIHtml } from '../pages/mobile-ui'
import { smartSchedulingHtml } from '../pages/smart-scheduling'
import { intelligentSuggestionsHtml } from '../pages/intelligent-suggestions'
import { iphoneExamplesHtml } from '../pages/iphone-examples'
import { memberRewardsHtml } from '../pages/member-rewards'
import { becomeSponsorHtml } from '../pages/become-sponsor'
import { sponsorDashboardHtml } from '../pages/sponsor-dashboard'
import { discoverVenuesHtml } from '../pages/discover-venues'
import { termsPage } from '../pages/terms'
import { privacyPage } from '../pages/privacy'
import { HomePage } from '../pages/home'

export const pageRoutes = new Hono<{ Bindings: Env }>()

// =============================================================================
// FEATURE PAGES (HTML)
// =============================================================================

pageRoutes.get('/ai-coach.html', (c) => {
  return c.html(aiCoachHtml)
})

pageRoutes.get('/mobile-ui.html', (c) => {
  return c.html(mobileUIHtml)
})

pageRoutes.get('/smart-scheduling.html', (c) => {
  return c.html(smartSchedulingHtml)
})

pageRoutes.get('/intelligent-suggestions.html', (c) => {
  return c.html(intelligentSuggestionsHtml)
})

pageRoutes.get('/iphone-examples.html', (c) => {
  return c.html(iphoneExamplesHtml)
})

pageRoutes.get('/member-rewards.html', (c) => {
  return c.html(memberRewardsHtml)
})

pageRoutes.get('/become-sponsor.html', (c) => {
  return c.html(becomeSponsorHtml)
})

pageRoutes.get('/sponsor-dashboard', (c) => {
  return c.html(sponsorDashboardHtml)
})

pageRoutes.get('/discover-venues', (c) => {
  return c.html(discoverVenuesHtml)
})

// Analytics Login
pageRoutes.get('/login.html', (c) => {
  return c.html(loginHtml)
})

// Analytics Dashboard
pageRoutes.get('/dashboard.html', (c) => {
  return c.html(dashboardHtml)
})

// Admin Analytics Dashboard (requires auth + admin role)
pageRoutes.get('/admin/analytics', requireAuth(), requireAdmin(), (c) => {
  return c.html(analyticsDashboardHtml)
})

// Subscription Boxes
pageRoutes.get('/subscription-boxes.html', async (c) => {
  const { subscriptionBoxesHtml } = await import('../pages/subscription-boxes')
  return c.html(subscriptionBoxesHtml)
})

// In-App Purchases route removed (exposed internal business metrics)

// Intimacy Challenges (Adult Content - Age Verified)
pageRoutes.get('/intimacy-challenges.html', async (c) => {
  const { intimacyChallengesHtml } = await import('../pages/intimacy-challenges')
  return c.html(intimacyChallengesHtml)
})

// Premium Pricing redirects to canonical paywall
pageRoutes.get('/premium-pricing.html', (c) => {
  return c.redirect('/paywall', 301)
})

// =============================================================================
// AUTHENTICATION & USER PORTAL
// =============================================================================

// Login System
pageRoutes.get('/login', (c) => {
  return c.html(loginSystemHtml)
})

// Reset Password (Supabase PKCE callback flow)
pageRoutes.get('/auth/reset-password', (c) => {
  return c.html(resetPasswordHtml)
})

// User Portal/Dashboard
pageRoutes.get('/portal', (c) => {
  return c.html(userPortalHtml)
})

// Paywall with new pricing tiers
pageRoutes.get('/paywall', (c) => {
  return c.html(paywallHtml)
})

// Notification Settings
pageRoutes.get('/notification-settings', (c) => {
  return c.html(notificationSettingsHtml)
})

// Love Languages
pageRoutes.get('/love-languages', (c) => {
  return c.html(loveLanguagesHtml)
})

// Password Reset
pageRoutes.get('/password-reset', (c) => {
  return c.html(passwordResetHtml)
})

// Partner Invite
pageRoutes.get('/partner-invite', (c) => {
  return c.html(partnerInviteHtml)
})

// Relationship Status
pageRoutes.get('/relationship-status', (c) => {
  return c.html(relationshipStatusHtml)
})

// Daily Check-ins
pageRoutes.get('/checkins', (c) => {
  return c.html(checkinsPageHtml)
})

// Goals
pageRoutes.get('/goals', (c) => {
  return c.html(goalsHtml)
})

// Activities
pageRoutes.get('/activities', (c) => {
  return c.html(activitiesHtml)
})

// Important Dates
pageRoutes.get('/important-dates', (c) => {
  return c.html(importantDatesHtml)
})

// Challenges Progress
pageRoutes.get('/challenges', (c) => {
  return c.html(challengesProgressHtml)
})

// Gift Subscription
pageRoutes.get('/gift-subscription', (c) => {
  return c.html(giftSubscriptionHtml)
})

// Subscription Management
pageRoutes.get('/subscription', (c) => {
  return c.html(subscriptionManagementHtml)
})

// Email Preferences
pageRoutes.get('/email-preferences', (c) => {
  return c.html(emailPreferencesHtml)
})

// Bundles Shop
pageRoutes.get('/bundles', (c) => {
  return c.html(bundlesHtml)
})

pageRoutes.get('/shop', (c) => {
  return c.html(bundlesHtml)
})

// =============================================================================
// LEGAL PAGES
// =============================================================================

pageRoutes.get('/terms', (c) => {
  return c.html(termsPage())
})

pageRoutes.get('/privacy', (c) => {
  return c.html(privacyPage())
})

// =============================================================================
// HOME PAGE
// =============================================================================

pageRoutes.get('/', (c) => {
  return c.render(<HomePage />)
})

// =============================================================================
// API DOCUMENTATION PAGE
// =============================================================================

pageRoutes.get('/api', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Better Together API</h1>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Available Endpoints</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-3 text-green-600">Authentication & Users</h3>
              <ul className="space-y-2 text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/users</code> - Create user account</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/users/:userId</code> - Get user profile</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">PUT /api/users/:userId</code> - Update user profile</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-blue-600">Relationships</h3>
              <ul className="space-y-2 text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/invite-partner</code> - Invite partner to relationship</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/relationships/:userId</code> - Get relationship details</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-purple-600">Daily Check-ins</h3>
              <ul className="space-y-2 text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/checkins</code> - Submit daily check-in</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/checkins/:relationshipId</code> - Get recent check-ins</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-orange-600">Goals & Activities</h3>
              <ul className="space-y-2 text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/goals</code> - Create shared goal</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/goals/:relationshipId</code> - Get relationship goals</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">POST /api/activities</code> - Create activity</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/activities/:relationshipId</code> - Get activities</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3 text-red-600">Dashboard & Analytics</h3>
              <ul className="space-y-2 text-gray-600">
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/dashboard/:userId</code> - Get complete dashboard data</li>
                <li><code className="bg-gray-100 px-2 py-1 rounded">GET /api/analytics/:relationshipId</code> - Get relationship analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
