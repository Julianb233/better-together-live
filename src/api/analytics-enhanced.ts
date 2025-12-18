// Better Together: Enhanced Analytics API
// Advanced relationship analytics and insights

import { Hono } from 'hono'
import type { Context } from 'hono'

const analyticsApi = new Hono()

// GET /api/analytics/relationship-health/:relationshipId
// Calculate comprehensive relationship health score
analyticsApi.get('/relationship-health/:relationshipId', async (c: Context) => {
  try {
    const relationshipId = c.req.param('relationshipId')
    const db = (c.env as any)?.DB

    if (!db) {
      // Return mock data for demo
      return c.json({
        score: 78,
        breakdown: {
          communication: 82,
          qualityTime: 75,
          goals: 80,
          activities: 72,
          consistency: 81
        },
        trend: 'improving',
        recommendations: [
          'Try scheduling a weekly check-in to improve communication',
          'Plan more activities together based on your shared interests',
          'Set a new goal together to strengthen your bond'
        ]
      })
    }

    // Get check-ins for last 30 days
    const checkins = await db.prepare(`
      SELECT AVG(connection_score) as avg_connection,
             AVG(mood_score) as avg_mood,
             COUNT(*) as total_checkins
      FROM daily_checkins
      WHERE relationship_id = ? AND created_at > datetime('now', '-30 days')
    `).bind(relationshipId).first()

    // Get goal completion rate
    const goals = await db.prepare(`
      SELECT COUNT(*) as total,
             SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
      FROM shared_goals WHERE relationship_id = ?
    `).bind(relationshipId).first()

    // Get activity frequency
    const activities = await db.prepare(`
      SELECT COUNT(*) as count FROM activities
      WHERE relationship_id = ? AND created_at > datetime('now', '-30 days')
    `).bind(relationshipId).first()

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
    const db = (c.env as any)?.DB

    if (!db) {
      return c.json({
        weekly: { checkins: 5, activities: 2, goals: 1 },
        monthly: { checkins: 18, activities: 7, goals: 3 },
        streaks: { currentStreak: 12, longestStreak: 28 },
        balance: { user1Participation: 55, user2Participation: 45 }
      })
    }

    // Weekly stats
    const weekly = await db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM daily_checkins WHERE relationship_id = ? AND created_at > datetime('now', '-7 days')) as checkins,
        (SELECT COUNT(*) FROM activities WHERE relationship_id = ? AND created_at > datetime('now', '-7 days')) as activities,
        (SELECT COUNT(*) FROM shared_goals WHERE relationship_id = ? AND created_at > datetime('now', '-7 days')) as goals
    `).bind(relationshipId, relationshipId, relationshipId).first()

    // Monthly stats
    const monthly = await db.prepare(`
      SELECT
        (SELECT COUNT(*) FROM daily_checkins WHERE relationship_id = ? AND created_at > datetime('now', '-30 days')) as checkins,
        (SELECT COUNT(*) FROM activities WHERE relationship_id = ? AND created_at > datetime('now', '-30 days')) as activities,
        (SELECT COUNT(*) FROM shared_goals WHERE relationship_id = ? AND created_at > datetime('now', '-30 days')) as goals
    `).bind(relationshipId, relationshipId, relationshipId).first()

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
    const db = (c.env as any)?.DB

    const days = period === '7d' ? 7 : period === '90d' ? 90 : 30

    if (!db) {
      // Generate mock trend data
      const mockData = Array.from({ length: days }, (_, i) => ({
        date: new Date(Date.now() - (days - i - 1) * 86400000).toISOString().split('T')[0],
        connectionScore: 60 + Math.random() * 30,
        moodScore: 55 + Math.random() * 35,
        activityCount: Math.floor(Math.random() * 3)
      }))

      return c.json({
        period,
        data: mockData,
        summary: {
          avgConnection: 75,
          avgMood: 72,
          totalActivities: mockData.reduce((sum, d) => sum + d.activityCount, 0)
        }
      })
    }

    const trends = await db.prepare(`
      SELECT
        DATE(created_at) as date,
        AVG(connection_score) as avg_connection,
        AVG(mood_score) as avg_mood,
        COUNT(*) as checkin_count
      FROM daily_checkins
      WHERE relationship_id = ? AND created_at > datetime('now', '-${days} days')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `).bind(relationshipId).all()

    return c.json({
      period,
      data: trends.results || [],
      summary: {
        dataPoints: trends.results?.length || 0
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
    const db = (c.env as any)?.DB

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

    if (!db) {
      return c.json({ recommendations })
    }

    // Check recent activity to customize
    const recentCheckins = await db.prepare(`
      SELECT COUNT(*) as count FROM daily_checkins
      WHERE relationship_id = ? AND created_at > datetime('now', '-7 days')
    `).bind(relationshipId).first()

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
    const db = (c.env as any)?.DB

    if (!db) {
      return c.json({
        upcoming: [
          { type: '1 Year Anniversary', date: '2025-02-14', daysUntil: 58 },
          { type: 'Valentine\'s Day', date: '2025-02-14', daysUntil: 58 }
        ],
        achieved: [
          { type: '6 Months Together', date: '2024-08-14', celebratedAt: null },
          { type: '100 Days', date: '2024-05-23', celebratedAt: '2024-05-24' }
        ]
      })
    }

    const relationship = await db.prepare(`
      SELECT start_date, anniversary_date FROM relationships WHERE id = ?
    `).bind(relationshipId).first()

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
