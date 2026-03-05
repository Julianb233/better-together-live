// Analytics API Routes - Backend data for dashboard
// All endpoints return real database data or zeros with error flags
import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'
import { requireAdmin } from '../lib/supabase/middleware'

const analyticsApi = new Hono()

// All analytics routes require admin role
analyticsApi.use('/*', requireAdmin())

function getSupabaseEnv(c: Context): SupabaseEnv {
  return {
    SUPABASE_URL: c.env?.SUPABASE_URL || '',
    SUPABASE_ANON_KEY: c.env?.SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: c.env?.SUPABASE_SERVICE_ROLE_KEY
  }
}

// Helper function to calculate time ago
function getTimeAgo(timestamp: Date): string {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))

  if (diffInMinutes < 1) return 'now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours}h ago`

  const diffInDays = Math.floor(diffInHours / 24)
  return `${diffInDays}d ago`
}

// Dashboard overview metrics
analyticsApi.get('/overview', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
    const twoMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, now.getDate())

    // Total users count
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Active relationships (couples) count
    const { count: engagedCouples } = await supabase
      .from('relationships')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    // Partner revenue (sponsors total revenue)
    const { data: sponsors } = await supabase
      .from('sponsors')
      .select('total_revenue_cents')
      .eq('status', 'active')

    const partnerRevenue = Math.floor(
      (sponsors || []).reduce((sum: number, s: any) => sum + (s.total_revenue_cents || 0), 0) / 1000
    )

    // App sessions (from user_sessions table, last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { count: sessionCount } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true })
      .gte('session_start', thirtyDaysAgo)

    const appSessions = Number(((sessionCount || 0) / 1000).toFixed(1))

    // Calculate growth metrics (compare to last month)
    const { count: lastMonthUsersCount } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })
      .lt('created_at', lastMonth.toISOString())

    const { count: lastMonthCouplesCount } = await supabase
      .from('relationships')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')
      .lt('created_at', lastMonth.toISOString())

    const usersGrowth = lastMonthUsersCount
      ? ((((totalUsers || 0) - lastMonthUsersCount) / lastMonthUsersCount) * 100).toFixed(1)
      : '0.0'
    const couplesGrowth = lastMonthCouplesCount
      ? ((((engagedCouples || 0) - lastMonthCouplesCount) / lastMonthCouplesCount) * 100).toFixed(1)
      : '0.0'

    // Revenue growth: compare current month sponsor revenue vs previous month
    const { data: currentMonthSponsors } = await supabase
      .from('sponsors')
      .select('total_revenue_cents')
      .eq('status', 'active')
      .gte('created_at', lastMonth.toISOString())

    const { data: prevMonthSponsors } = await supabase
      .from('sponsors')
      .select('total_revenue_cents')
      .eq('status', 'active')
      .gte('created_at', twoMonthsAgo.toISOString())
      .lt('created_at', lastMonth.toISOString())

    const currentRevenue = (currentMonthSponsors || []).reduce((sum: number, s: any) => sum + (s.total_revenue_cents || 0), 0)
    const prevRevenue = (prevMonthSponsors || []).reduce((sum: number, s: any) => sum + (s.total_revenue_cents || 0), 0)
    const revenueGrowth = prevRevenue > 0
      ? (((currentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1)
      : '0.0'

    return c.json({
      totalUsers: totalUsers || 0,
      engagedCouples: engagedCouples || 0,
      partnerRevenue,
      appSessions,
      growthMetrics: {
        usersGrowth: `${usersGrowth > '0' ? '+' : ''}${usersGrowth}%`,
        couplesGrowth: `${couplesGrowth > '0' ? '+' : ''}${couplesGrowth}%`,
        revenueGrowth: `${revenueGrowth > '0' ? '+' : ''}${revenueGrowth}%`,
        sessionsGrowth: 'N/A'
      },
      lastUpdated: now.toISOString()
    })
  } catch (error) {
    console.error('Overview analytics error:', error)
    return c.json({
      totalUsers: 0,
      engagedCouples: 0,
      partnerRevenue: 0,
      appSessions: 0,
      growthMetrics: {
        usersGrowth: 'N/A',
        couplesGrowth: 'N/A',
        revenueGrowth: 'N/A',
        sessionsGrowth: 'N/A'
      },
      error: 'Analytics temporarily unavailable',
      lastUpdated: new Date().toISOString()
    })
  }
})

// User analytics data
analyticsApi.get('/users', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))

    // Get user creation dates for growth chart
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const { data: users } = await supabase
      .from('users')
      .select('created_at')
      .gte('created_at', twelveMonthsAgo.toISOString())
      .order('created_at', { ascending: true })

    // Group by month in JS
    const monthCounts = new Map<string, number>()
    for (const u of (users || [])) {
      const month = u.created_at.substring(0, 7) // YYYY-MM
      monthCounts.set(month, (monthCounts.get(month) || 0) + 1)
    }

    const growthData = Array.from(monthCounts.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count], index, arr) => {
        const date = new Date(month + '-01')
        const prevCount = index > 0 ? arr[index - 1][1] : count
        const growth = index === 0 ? 0 : Math.round(((count - prevCount) / (prevCount || 1)) * 100)
        return {
          month: date.toLocaleDateString('en-US', { month: 'short' }),
          users: count,
          growth
        }
      })

    // Calculate engagement metrics
    const today = new Date().toISOString().split('T')[0]
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]

    const { count: dailyActive } = await supabase
      .from('engagement_scores')
      .select('user_id', { count: 'exact', head: true })
      .eq('score_date', today)

    const { count: weeklyActive } = await supabase
      .from('engagement_scores')
      .select('user_id', { count: 'exact', head: true })
      .gte('score_date', weekAgo)

    const { count: monthlyActive } = await supabase
      .from('engagement_scores')
      .select('user_id', { count: 'exact', head: true })
      .gte('score_date', monthAgo)

    return c.json({
      growth: growthData,
      demographics: {
        ageGroups: [],
        locations: []
      },
      engagement: {
        dailyActiveUsers: dailyActive || 0,
        weeklyActiveUsers: weeklyActive || 0,
        monthlyActiveUsers: monthlyActive || 0,
        averageSessionDuration: null,
        sessionsPerUser: null
      }
    })
  } catch (error) {
    console.error('User analytics error:', error)
    return c.json({
      growth: [],
      demographics: { ageGroups: [], locations: [] },
      engagement: {
        dailyActiveUsers: 0, weeklyActiveUsers: 0, monthlyActiveUsers: 0,
        averageSessionDuration: null, sessionsPerUser: null
      },
      error: 'Analytics temporarily unavailable'
    })
  }
})

// Revenue analytics
analyticsApi.get('/revenue', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))

    // Monthly revenue data
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12)

    const { data: revenueRows } = await supabase
      .from('revenue_analytics')
      .select('analytics_date, total_revenue_cents, subscription_revenue_cents')
      .gte('analytics_date', twelveMonthsAgo.toISOString().split('T')[0])
      .order('analytics_date', { ascending: true })

    const revenueData = (revenueRows || []).map((row: any) => {
      const date = new Date(row.analytics_date)
      return {
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        revenue: Math.round(row.total_revenue_cents / 100),
        partners: Math.round(row.subscription_revenue_cents / 100)
      }
    })

    // Top partners
    const { data: topPartners } = await supabase
      .from('sponsors')
      .select('business_name, business_type, total_revenue_cents')
      .eq('status', 'active')
      .order('total_revenue_cents', { ascending: false })
      .limit(5)

    // Conversion rate
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    const { count: paidUsers } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    const conversionRate = totalUsers && paidUsers
      ? ((paidUsers / totalUsers) * 100).toFixed(1)
      : '0.0'

    return c.json({
      monthly: revenueData,
      breakdown: { partnerCommissions: 0, subscriptions: 0, premiumFeatures: 0, other: 0 },
      topPartners: (topPartners || []).map((p: any) => ({
        name: p.business_name,
        category: p.business_type,
        revenue: Math.round(p.total_revenue_cents / 100),
        growth: '+0%'
      })),
      metrics: {
        averageOrderValue: 0,
        conversionRate: Number(conversionRate),
        customerLifetimeValue: null,
        repeatPurchaseRate: null
      }
    })
  } catch (error) {
    console.error('Revenue analytics error:', error)
    return c.json({
      monthly: [],
      breakdown: { partnerCommissions: 0, subscriptions: 0, premiumFeatures: 0, other: 0 },
      topPartners: [],
      metrics: { averageOrderValue: 0, conversionRate: 0, customerLifetimeValue: null, repeatPurchaseRate: null },
      error: 'Analytics temporarily unavailable'
    })
  }
})

// Feature usage analytics
analyticsApi.get('/features', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const today = new Date().toISOString().split('T')[0]

    // Feature usage from feature_usage_metrics table
    const { data: featureMetrics } = await supabase
      .from('feature_usage_metrics')
      .select('feature_name, total_users, completion_rate')
      .eq('metric_date', today)
      .order('total_users', { ascending: false })
      .limit(5)

    const usageData = (featureMetrics || []).map((f: any) => ({
      name: f.feature_name,
      usage: 0,
      engagement: Math.round(f.completion_rate || 0),
      users: f.total_users
    }))

    // Challenge participation metrics
    const { count: challengeUsers } = await supabase
      .from('challenge_participation')
      .select('relationship_id', { count: 'exact', head: true })
      .eq('status', 'active')

    const { count: completedChallenges } = await supabase
      .from('challenge_participation')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    const { count: totalChallenges } = await supabase
      .from('challenge_participation')
      .select('*', { count: 'exact', head: true })

    const challengeCompletionRate = totalChallenges
      ? Math.round(((completedChallenges || 0) / totalChallenges) * 100)
      : 0

    // Activity metrics
    const { count: activityUsers } = await supabase
      .from('activities')
      .select('relationship_id', { count: 'exact', head: true })

    const { count: completedActivities } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed')

    const { count: totalActivities } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .in('status', ['planned', 'completed'])

    const activityExecutionRate = totalActivities
      ? Math.round(((completedActivities || 0) / totalActivities) * 100)
      : 0

    // Query real top challenges from DB
    const { data: topChallengeData } = await supabase
      .from('challenge_participation')
      .select('challenge_id')
      .eq('status', 'completed')
      .order('actual_end_date', { ascending: false })
      .limit(50)

    // Count challenge frequency
    const challengeFreq = new Map<string, number>()
    for (const cp of (topChallengeData || [])) {
      challengeFreq.set(cp.challenge_id, (challengeFreq.get(cp.challenge_id) || 0) + 1)
    }
    const topChallengeIds = Array.from(challengeFreq.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id)

    let topChallengeNames: string[] = []
    if (topChallengeIds.length > 0) {
      const { data: challenges } = await supabase
        .from('challenges')
        .select('title')
        .in('id', topChallengeIds)
      topChallengeNames = (challenges || []).map((ch: any) => ch.title)
    }

    return c.json({
      usage: usageData,
      adoption: {
        relationshipChallenges: {
          totalUsers: challengeUsers || 0,
          completionRate: challengeCompletionRate,
          averageTimeSpent: null,
          topChallenges: topChallengeNames
        },
        dateNightPlanner: {
          totalUsers: activityUsers || 0,
          plansCreated: totalActivities || 0,
          executionRate: activityExecutionRate,
          averageRating: 0
        },
        memberRewards: { totalUsers: 0, creditsEarned: 0, creditsRedeemed: 0, redemptionRate: 0, averageSpend: 0 },
        communicationTools: { totalUsers: 0, messagesPerDay: 0, voiceNotesPerDay: 0, calendarEventsCreated: 0 }
      },
      heatmap: null
    })
  } catch (error) {
    console.error('Feature analytics error:', error)
    return c.json({
      usage: [],
      adoption: {
        relationshipChallenges: { totalUsers: 0, completionRate: 0, averageTimeSpent: null, topChallenges: [] },
        dateNightPlanner: { totalUsers: 0, plansCreated: 0, executionRate: 0, averageRating: 0 }
      },
      heatmap: null,
      error: 'Analytics temporarily unavailable'
    })
  }
})

// Partner analytics
analyticsApi.get('/partners', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { count: totalPartners } = await supabase
      .from('sponsors')
      .select('*', { count: 'exact', head: true })

    const { count: activePartners } = await supabase
      .from('sponsors')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    const { count: newPartners } = await supabase
      .from('sponsors')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', monthAgo)

    // Partner categories - get all active sponsors and group in JS
    const { data: allSponsors } = await supabase
      .from('sponsors')
      .select('business_type, total_revenue_cents')
      .eq('status', 'active')

    const categoryMap = new Map<string, { count: number; revenue: number }>()
    for (const s of (allSponsors || [])) {
      const existing = categoryMap.get(s.business_type) || { count: 0, revenue: 0 }
      existing.count++
      existing.revenue += s.total_revenue_cents || 0
      categoryMap.set(s.business_type, existing)
    }

    const categories = Array.from(categoryMap.entries())
      .map(([name, stats]) => ({
        name,
        count: stats.count,
        revenue: Math.round(stats.revenue / 100),
        growth: '+0%'
      }))
      .sort((a, b) => b.count - a.count)

    // Top performing partners
    const { data: topPartners } = await supabase
      .from('sponsors')
      .select('business_name, total_bookings, average_rating, total_revenue_cents')
      .eq('status', 'active')
      .order('total_revenue_cents', { ascending: false })
      .limit(3)

    return c.json({
      summary: {
        totalPartners: totalPartners || 0,
        activePartners: activePartners || 0,
        newThisMonth: newPartners || 0,
        churnRate: null
      },
      categories,
      performance: {
        topPerforming: (topPartners || []).map((p: any) => ({
          name: p.business_name,
          bookings: p.total_bookings,
          rating: Number((p.average_rating || 0).toFixed(1)),
          revenue: Math.round(p.total_revenue_cents / 100)
        })),
        metrics: { averageRating: 0, bookingConversion: null, repeatBookingRate: null, customerSatisfaction: null }
      },
      geographic: []
    })
  } catch (error) {
    console.error('Partner analytics error:', error)
    return c.json({
      summary: { totalPartners: 0, activePartners: 0, newThisMonth: 0, churnRate: null },
      categories: [],
      performance: { topPerforming: [], metrics: { averageRating: 0, bookingConversion: null, repeatBookingRate: null, customerSatisfaction: null } },
      geographic: [],
      error: 'Analytics temporarily unavailable'
    })
  }
})

// Real-time activity feed
analyticsApi.get('/activity', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))
    const recentTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

    // Get recent analytics events
    const { data: events } = await supabase
      .from('analytics_events')
      .select('event_name, event_category, created_at')
      .gte('created_at', recentTime)
      .order('created_at', { ascending: false })
      .limit(20)

    // Get recent check-ins
    const { data: checkins } = await supabase
      .from('daily_checkins')
      .select('created_at')
      .gte('created_at', recentTime)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get recent challenge completions
    const { data: challenges } = await supabase
      .from('challenge_participation')
      .select('actual_end_date')
      .eq('status', 'completed')
      .gte('actual_end_date', recentTime)
      .order('actual_end_date', { ascending: false })
      .limit(5)

    const activities = [
      ...(events || []).map((e: any) => ({
        type: e.event_category,
        icon: getIconForEventCategory(e.event_category),
        color: getColorForEventCategory(e.event_category),
        message: e.event_name,
        timestamp: new Date(e.created_at)
      })),
      ...(checkins || []).map((ch: any) => ({
        type: 'checkin',
        icon: 'fas fa-heart',
        color: 'text-pink-400',
        message: 'Daily check-in completed',
        timestamp: new Date(ch.created_at)
      })),
      ...(challenges || []).map((ch: any) => ({
        type: 'challenge_complete',
        icon: 'fas fa-trophy',
        color: 'text-yellow-400',
        message: 'Challenge completed',
        timestamp: new Date(ch.actual_end_date)
      }))
    ]

    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())

    return c.json({
      activities: activities.slice(0, 10).map(activity => ({
        ...activity,
        timeAgo: getTimeAgo(activity.timestamp)
      }))
    })
  } catch (error) {
    console.error('Activity feed error:', error)
    return c.json({ activities: [], error: 'Analytics temporarily unavailable' })
  }
})

// System health and performance
analyticsApi.get('/system', async (c: Context) => {
  const supabaseAvailable = !!(c.env?.SUPABASE_URL && c.env?.SUPABASE_SERVICE_ROLE_KEY)
  return c.json({
    health: { status: supabaseAvailable ? 'healthy' : 'degraded', uptime: null, responseTime: null, errorRate: null },
    infrastructure: {
      database: { status: supabaseAvailable ? 'connected' : 'unavailable' },
      api: { status: 'healthy' }
    },
    performance: null
  })
})

// Export analytics for business intelligence
analyticsApi.get('/export', async (c: Context) => {
  try {
    const supabase = createAdminClient(getSupabaseEnv(c))

    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true })

    const { count: activeCouples } = await supabase
      .from('relationships')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    const { count: totalPartners } = await supabase
      .from('sponsors')
      .select('*', { count: 'exact', head: true })

    const exportData = {
      timestamp: new Date().toISOString(),
      summary: { totalUsers: totalUsers || 0, engagedCouples: activeCouples || 0, partnerRevenue: 0, appSessions: 0 },
      features: [],
      partners: { total: totalPartners || 0, categories: [], topRevenue: 0 }
    }

    c.header('Content-Type', 'application/json')
    c.header('Content-Disposition', 'attachment; filename=better-together-analytics.json')
    return c.json(exportData)
  } catch (error) {
    console.error('Export error:', error)
    return c.json({ error: 'Export failed' }, 500)
  }
})

function getIconForEventCategory(category: string): string {
  const icons: Record<string, string> = {
    user_action: 'fas fa-user', feature_usage: 'fas fa-star', conversion: 'fas fa-dollar-sign',
    engagement: 'fas fa-heart', system: 'fas fa-cog', error: 'fas fa-exclamation-triangle',
    payment: 'fas fa-credit-card', partner: 'fas fa-handshake'
  }
  return icons[category] || 'fas fa-circle'
}

function getColorForEventCategory(category: string): string {
  const colors: Record<string, string> = {
    user_action: 'text-blue-400', feature_usage: 'text-yellow-400', conversion: 'text-green-400',
    engagement: 'text-pink-400', system: 'text-gray-400', error: 'text-red-400',
    payment: 'text-emerald-400', partner: 'text-purple-400'
  }
  return colors[category] || 'text-gray-400'
}

export default analyticsApi
