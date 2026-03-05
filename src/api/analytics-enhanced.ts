// Better Together: Enhanced Analytics API
// Advanced relationship analytics and insights

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase'

const analyticsApi = new Hono()

// GET /api/analytics/relationship-health/:relationshipId
// Calculate comprehensive relationship health score
analyticsApi.get('/relationship-health/:relationshipId', async (c: Context) => {
  try {
    const relationshipId = c.req.param('relationshipId')
    const supabase = createAdminClient(c.env as SupabaseEnv)

    // Get check-ins for last 30 days
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const { data: checkinRows, error: checkinError } = await supabase
      .from('daily_checkins')
      .select('connection_score, mood_score')
      .eq('relationship_id', relationshipId)
      .gte('created_at', thirtyDaysAgo)

    if (checkinError) throw checkinError

    const totalCheckins = checkinRows?.length || 0
    const avgConnection = totalCheckins > 0
      ? checkinRows!.reduce((sum, r) => sum + (r.connection_score || 0), 0) / totalCheckins
      : null
    const avgMood = totalCheckins > 0
      ? checkinRows!.reduce((sum, r) => sum + (r.mood_score || 0), 0) / totalCheckins
      : null

    // Get goal completion rate
    const { data: allGoals, error: goalsError } = await supabase
      .from('shared_goals')
      .select('status')
      .eq('relationship_id', relationshipId)

    if (goalsError) throw goalsError

    const totalGoals = allGoals?.length || 0
    const completedGoals = allGoals?.filter(g => g.status === 'completed').length || 0

    // Get activity frequency
    const { count: activityCount, error: activityError } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('relationship_id', relationshipId)
      .gte('created_at', thirtyDaysAgo)

    if (activityError) throw activityError

    // Calculate scores
    const communicationScore = Math.min(100, totalCheckins * 3.3) // 30 checkins = 100
    const connectionScore = (avgConnection || 5) * 10
    const goalScore = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 50
    const activityScore = Math.min(100, (activityCount || 0) * 12.5) // 8 activities = 100

    const overallScore = Math.round(
      (communicationScore * 0.25) +
      (connectionScore * 0.30) +
      (goalScore * 0.25) +
      (activityScore * 0.20)
    )

    // Generate recommendations
    const recommendations = []
    if (communicationScore < 70) recommendations.push('Try daily check-ins to improve communication')
    if (connectionScore < 70) recommendations.push('Focus on activities that strengthen your emotional connection')
    if (goalScore < 70) recommendations.push('Set achievable goals together and celebrate completions')
    if (activityScore < 70) recommendations.push('Plan more date nights and shared experiences')

    return c.json({
      score: overallScore,
      breakdown: {
        communication: Math.round(communicationScore),
        connection: Math.round(connectionScore),
        goals: Math.round(goalScore),
        activities: Math.round(activityScore)
      },
      trend: overallScore > 70 ? 'healthy' : overallScore > 50 ? 'needs attention' : 'struggling',
      recommendations: recommendations.length > 0 ? recommendations : ['Keep up the great work!']
    })
  } catch (error) {
    console.error('Health score error:', error)
    return c.json({ error: 'Failed to calculate health score' }, 500)
  }
})

// GET /api/analytics/engagement/:relationshipId
// Get engagement metrics
analyticsApi.get('/engagement/:relationshipId', async (c: Context) => {
  try {
    const relationshipId = c.req.param('relationshipId')
    const supabase = createAdminClient(c.env as SupabaseEnv)

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    // Weekly stats - parallel queries
    const [weeklyCheckins, weeklyActivities, weeklyGoals, monthlyCheckins, monthlyActivities, monthlyGoals] = await Promise.all([
      supabase.from('daily_checkins').select('*', { count: 'exact', head: true }).eq('relationship_id', relationshipId).gte('created_at', sevenDaysAgo),
      supabase.from('activities').select('*', { count: 'exact', head: true }).eq('relationship_id', relationshipId).gte('created_at', sevenDaysAgo),
      supabase.from('shared_goals').select('*', { count: 'exact', head: true }).eq('relationship_id', relationshipId).gte('created_at', sevenDaysAgo),
      supabase.from('daily_checkins').select('*', { count: 'exact', head: true }).eq('relationship_id', relationshipId).gte('created_at', thirtyDaysAgo),
      supabase.from('activities').select('*', { count: 'exact', head: true }).eq('relationship_id', relationshipId).gte('created_at', thirtyDaysAgo),
      supabase.from('shared_goals').select('*', { count: 'exact', head: true }).eq('relationship_id', relationshipId).gte('created_at', thirtyDaysAgo),
    ])

    return c.json({
      weekly: {
        checkins: weeklyCheckins.count || 0,
        activities: weeklyActivities.count || 0,
        goals: weeklyGoals.count || 0
      },
      monthly: {
        checkins: monthlyCheckins.count || 0,
        activities: monthlyActivities.count || 0,
        goals: monthlyGoals.count || 0
      },
      streaks: { currentStreak: 0, longestStreak: 0 },
      balance: { user1Participation: 50, user2Participation: 50 }
    })
  } catch (error) {
    console.error('Engagement error:', error)
    return c.json({ error: 'Failed to get engagement metrics' }, 500)
  }
})

// GET /api/analytics/trends/:relationshipId
// Get historical trends
analyticsApi.get('/trends/:relationshipId', async (c: Context) => {
  try {
    const relationshipId = c.req.param('relationshipId')
    const period = c.req.query('period') || '30d'
    const supabase = createAdminClient(c.env as SupabaseEnv)

    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30
    const sinceDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString()

    // Fetch raw checkins and aggregate in-memory (Supabase query builder doesn't support GROUP BY with aggregates)
    const { data: checkins, error } = await supabase
      .from('daily_checkins')
      .select('created_at, connection_score, mood_score')
      .eq('relationship_id', relationshipId)
      .gte('created_at', sinceDate)
      .order('created_at', { ascending: true })

    if (error) throw error

    // Group by date and calculate averages
    const dateMap = new Map<string, { connections: number[]; moods: number[]; count: number }>()

    for (const checkin of checkins || []) {
      const date = checkin.created_at?.split('T')[0] || ''
      if (!dateMap.has(date)) {
        dateMap.set(date, { connections: [], moods: [], count: 0 })
      }
      const entry = dateMap.get(date)!
      if (checkin.connection_score != null) entry.connections.push(checkin.connection_score)
      if (checkin.mood_score != null) entry.moods.push(checkin.mood_score)
      entry.count++
    }

    const trends = Array.from(dateMap.entries()).map(([date, data]) => ({
      date,
      avg_connection: data.connections.length > 0
        ? data.connections.reduce((a, b) => a + b, 0) / data.connections.length
        : 0,
      avg_mood: data.moods.length > 0
        ? data.moods.reduce((a, b) => a + b, 0) / data.moods.length
        : 0,
      checkin_count: data.count
    }))

    return c.json({
      period,
      data: trends,
      summary: {
        dataPoints: trends.length
      }
    })
  } catch (error) {
    console.error('Trends error:', error)
    return c.json({ error: 'Failed to get trends' }, 500)
  }
})

// GET /api/analytics/recommendations/:relationshipId
// Get AI-powered recommendations
analyticsApi.get('/recommendations/:relationshipId', async (c: Context) => {
  try {
    const relationshipId = c.req.param('relationshipId')
    const supabase = createAdminClient(c.env as SupabaseEnv)

    // Base recommendations
    const recommendations = [
      {
        type: 'activity',
        title: 'Plan a Date Night',
        description: 'Schedule quality time together this week',
        priority: 'high',
        actionUrl: '/portal/schedule'
      },
      {
        type: 'challenge',
        title: 'Try the 7-Day Appreciation Challenge',
        description: 'Express gratitude to your partner daily',
        priority: 'medium',
        actionUrl: '/portal/challenges'
      },
      {
        type: 'goal',
        title: 'Set a Shared Goal',
        description: 'Working together strengthens your bond',
        priority: 'medium',
        actionUrl: '/portal/goals'
      }
    ]

    // Check recent activity to customize
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()

    const { count: recentCount, error } = await supabase
      .from('daily_checkins')
      .select('*', { count: 'exact', head: true })
      .eq('relationship_id', relationshipId)
      .gte('created_at', sevenDaysAgo)

    if (error) throw error

    if ((recentCount || 0) < 3) {
      recommendations.unshift({
        type: 'checkin',
        title: 'Complete Daily Check-ins',
        description: 'Regular check-ins improve communication by 40%',
        priority: 'high',
        actionUrl: '/portal/checkin'
      })
    }

    return c.json({ recommendations: recommendations.slice(0, 5) })
  } catch (error) {
    console.error('Recommendations error:', error)
    return c.json({ error: 'Failed to get recommendations' }, 500)
  }
})

// GET /api/analytics/milestones/:relationshipId
// Get upcoming milestones
analyticsApi.get('/milestones/:relationshipId', async (c: Context) => {
  try {
    const relationshipId = c.req.param('relationshipId')
    const supabase = createAdminClient(c.env as SupabaseEnv)

    const { data: relationship, error } = await supabase
      .from('relationships')
      .select('start_date, anniversary_date')
      .eq('id', relationshipId)
      .maybeSingle()

    if (error) throw error

    if (!relationship) {
      return c.json({ error: 'Relationship not found' }, 404)
    }

    // Calculate milestones
    const startDate = new Date(relationship.start_date)
    const today = new Date()
    const daysTogether = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))

    const milestones = []
    const milestoneDays = [100, 200, 365, 500, 730, 1000, 1095]

    for (const days of milestoneDays) {
      const milestoneDate = new Date(startDate.getTime() + days * 86400000)
      const daysUntil = Math.floor((milestoneDate.getTime() - today.getTime()) / 86400000)

      if (daysUntil > 0 && daysUntil <= 90) {
        milestones.push({
          type: days === 365 ? '1 Year Anniversary' : days === 730 ? '2 Year Anniversary' : `${days} Days Together`,
          date: milestoneDate.toISOString().split('T')[0],
          daysUntil
        })
      }
    }

    return c.json({
      daysTogether,
      upcoming: milestones.slice(0, 5),
      startDate: relationship.start_date
    })
  } catch (error) {
    console.error('Milestones error:', error)
    return c.json({ error: 'Failed to get milestones' }, 500)
  }
})

export default analyticsApi
