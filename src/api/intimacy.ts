// Better Together: Intimacy API
// Handles intimacy tracking and statistics

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase/server'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { zodErrorHandler } from '../lib/validation'
import { uuidParam } from '../lib/validation/schemas/common'
import { generateId, getCurrentDateTime } from '../utils'

const eventTypeEnum = z.enum(['physical', 'emotional', 'quality_time', 'communication'])

/** POST /api/intimacy/track - Log intimacy event */
const trackIntimacySchema = z.object({
  userId: uuidParam,
  relationshipId: uuidParam,
  eventType: eventTypeEnum,
  intensity: z.number().min(1).max(10).optional(),
  notes: z.string().max(1000).optional(),
  timestamp: z.string().optional(),
})

/** GET /api/intimacy/stats - query params */
const intimacyStatsQuerySchema = z.object({
  relationshipId: z.string().uuid(),
  timeframe: z.coerce.number().int().min(1).max(365).default(30),
})

const intimacyApi = new Hono()

// POST /api/intimacy/track - Log intimacy event
intimacyApi.post('/track', zValidator('json', trackIntimacySchema, zodErrorHandler), async (c: Context) => {
  try {
    const {
      userId,
      relationshipId,
      eventType,
      intensity,
      notes,
      timestamp
    } = c.req.valid('json' as never)

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
intimacyApi.get('/stats', zValidator('query', intimacyStatsQuerySchema, zodErrorHandler), async (c: Context) => {
  try {
    const { relationshipId, timeframe } = c.req.valid('query' as never)

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
