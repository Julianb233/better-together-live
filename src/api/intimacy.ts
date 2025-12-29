// Better Together: Intimacy API
// Handles intimacy tracking and statistics

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import { generateId, getCurrentDateTime } from '../utils'

const intimacyApi = new Hono()

// POST /api/intimacy/track - Log intimacy event
intimacyApi.post('/track', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const {
      userId,
      relationshipId,
      eventType, // 'physical', 'emotional', 'quality_time'
      intensity, // 1-10 scale
      notes,
      timestamp
    } = await c.req.json()

    if (!userId || !relationshipId || !eventType) {
      return c.json({ error: 'userId, relationshipId, and eventType are required' }, 400)
    }

    const validEventTypes = ['physical', 'emotional', 'quality_time', 'communication']
    if (!validEventTypes.includes(eventType)) {
      return c.json({
        error: `Invalid eventType. Must be one of: ${validEventTypes.join(', ')}`
      }, 400)
    }

    const eventId = generateId()
    const eventTime = timestamp || getCurrentDateTime()

    // In production, this would save to an intimacy_events table
    // with privacy considerations and encryption

    return c.json({
      success: true,
      message: 'Intimacy event tracked',
      eventId,
      eventType,
      trackedAt: eventTime,
      pointsEarned: 25 // Gamification points for tracking
    })
  } catch (error) {
    console.error('Track intimacy error:', error)
    return c.json({ error: 'Failed to track intimacy event' }, 500)
  }
})

// GET /api/intimacy/stats - Get stats
intimacyApi.get('/stats', async (c: Context) => {
  try {
    const relationshipId = c.req.query('relationshipId')
    const timeframe = c.req.query('timeframe') || '30' // days

    if (!relationshipId) {
      return c.json({ error: 'relationshipId is required' }, 400)
    }

    // In production, calculate from database
    // This would aggregate intimacy_events with privacy safeguards

    const stats = {
      relationshipId,
      timeframe: `Last ${timeframe} days`,
      overview: {
        totalEvents: 24,
        averagePerWeek: 6,
        mostCommonType: 'quality_time',
        averageIntensity: 7.5
      },
      byType: {
        physical: {
          count: 8,
          averageIntensity: 8.2,
          lastEvent: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        emotional: {
          count: 10,
          averageIntensity: 7.5,
          lastEvent: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
        },
        quality_time: {
          count: 6,
          averageIntensity: 7.0,
          lastEvent: new Date(Date.now() - 0.5 * 24 * 60 * 60 * 1000).toISOString()
        }
      },
      trends: {
        weekOverWeekChange: 12, // percentage
        comparedToPreviousPeriod: 'increased',
        healthScore: 85 // 0-100 scale
      },
      insights: [
        'Your intimacy frequency has increased by 12% this month',
        'Quality time events are most common on weekends',
        'Your relationship health score is excellent'
      ]
    }

    return c.json({
      success: true,
      stats
    })
  } catch (error) {
    console.error('Get intimacy stats error:', error)
    return c.json({ error: 'Failed to get intimacy stats' }, 500)
  }
})

export default intimacyApi
