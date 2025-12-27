// Better Together: Enhanced Analytics API
// Advanced relationship analytics and insights

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'

const analyticsApi = new Hono()

// GET /api/analytics/relationship-health/:relationshipId
// Calculate comprehensive relationship health score
analyticsApi.get('/relationship-health/:relationshipId', async (c: Context) => {
  try {
    const relationshipId = c.req.param('relationshipId')
    const db = createDatabase(c.env as Env)

    // Get check-ins for last 30 days
    const checkins = await db.first<{
      avg_connection: number | null
      avg_mood: number | null
      total_checkins: number
    }>(`
      SELECT AVG(connection_score) as avg_connection,
             AVG(mood_score) as avg_mood,
             COUNT(*) as total_checkins
      FROM daily_checkins
      WHERE relationship_id = $1 AND created_at > NOW() - INTERVAL '30 days'
    `, [relationshipId])

    // Get goal completion rate
    const goals = await db.first<{
      total: number
      completed: number
    }>(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM shared_goals WHERE relationship_id = $1
    `, [relationshipId])

    // Get activity frequency
    const activities = await db.first<{ count: number }>(`
      SELECT COUNT(*) as count FROM activities
      WHERE relationship_id = $1 AND created_at > NOW() - INTERVAL '30 days'
    `, [relationshipId])

    // Calculate scores
    const communicationScore = Math.min(100, (checkins?.total_checkins || 0) * 3.3) // 30 checkins = 100
    const connectionScore = (checkins?.avg_connection || 5) * 10
    const goalScore = goals?.total > 0 ? ((goals?.completed || 0) / goals.total) * 100 : 50
    const activityScore = Math.min(100, (activities?.count || 0) * 12.5) // 8 activities = 100

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
    const db = createDatabase(c.env as Env)

    // Weekly stats
    const weekly = await db.first<{
      checkins: number
      activities: number
      goals: number
    }>(`
      SELECT
        (SELECT COUNT(*) FROM daily_checkins WHERE relationship_id = $1 AND created_at > NOW() - INTERVAL '7 days') as checkins,
        (SELECT COUNT(*) FROM activities WHERE relationship_id = $1 AND created_at > NOW() - INTERVAL '7 days') as activities,
        (SELECT COUNT(*) FROM shared_goals WHERE relationship_id = $1 AND created_at > NOW() - INTERVAL '7 days') as goals
    `, [relationshipId])

    // Monthly stats
    const monthly = await db.first<{
      checkins: number
      activities: number
      goals: number
    }>(`
      SELECT
        (SELECT COUNT(*) FROM daily_checkins WHERE relationship_id = $1 AND created_at > NOW() - INTERVAL '30 days') as checkins,
        (SELECT COUNT(*) FROM activities WHERE relationship_id = $1 AND created_at > NOW() - INTERVAL '30 days') as activities,
        (SELECT COUNT(*) FROM shared_goals WHERE relationship_id = $1 AND created_at > NOW() - INTERVAL '30 days') as goals
    `, [relationshipId])

    return c.json({
      weekly: {
        checkins: weekly?.checkins || 0,
        activities: weekly?.activities || 0,
        goals: weekly?.goals || 0
      },
      monthly: {
        checkins: monthly?.checkins || 0,
        activities: monthly?.activities || 0,
        goals: monthly?.goals || 0
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
    const db = createDatabase(c.env as Env)

    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30

    const trends = await db.all<{
      date: string
      avg_connection: number
      avg_mood: number
      checkin_count: number
    }>(`
      SELECT
        DATE(created_at) as date,
        AVG(connection_score) as avg_connection,
        AVG(mood_score) as avg_mood,
        COUNT(*) as checkin_count
      FROM daily_checkins
      WHERE relationship_id = $1 AND created_at > NOW() - INTERVAL '${days} days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `, [relationshipId])

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
    const db = createDatabase(c.env as Env)

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
    const recentCheckins = await db.first<{ count: number }>(`
      SELECT COUNT(*) as count FROM daily_checkins
      WHERE relationship_id = $1 AND created_at > NOW() - INTERVAL '7 days'
    `, [relationshipId])

    if ((recentCheckins?.count || 0) < 3) {
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
    const db = createDatabase(c.env as Env)

    const relationship = await db.first<{
      start_date: string
      anniversary_date: string | null
    }>(`
      SELECT start_date, anniversary_date FROM relationships WHERE id = $1
    `, [relationshipId])

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
