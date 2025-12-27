// Better Together: Dashboard API
// Handles dashboard data aggregation and relationship analytics

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import {
  getUserById,
  getRelationshipByUserId,
  getPartnerId,
  getUpcomingDates,
  calculateAnalytics,
  calculateCheckinStreak
} from '../utils'

const dashboardApi = new Hono()

// GET /api/dashboard/:userId
// Get dashboard data for user
dashboardApi.get('/:userId', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const userId = c.req.param('userId')

    // Get user's relationship
    const relationship = await getRelationshipByUserId(c.env, userId)
    if (!relationship) {
      return c.json({ error: 'No active relationship found' }, 404)
    }

    // Get partner details
    const partnerId = getPartnerId(relationship, userId)
    const partner = await getUserById(c.env, partnerId)

    // Get recent checkins
    const recentCheckins = await db.all(`
      SELECT c.*, u.name as user_name
      FROM daily_checkins c
      JOIN users u ON c.user_id = u.id
      WHERE c.relationship_id = $1
      ORDER BY c.checkin_date DESC
      LIMIT 10
    `, [relationship.id])

    // Get upcoming dates
    const upcomingDates = await getUpcomingDates(c.env, relationship.id)

    // Get active goals
    const activeGoals = await db.all(`
      SELECT g.*, u.name as created_by_name
      FROM shared_goals g
      JOIN users u ON g.created_by_user_id = u.id
      WHERE g.relationship_id = $1 AND g.status = 'active'
      ORDER BY g.created_at DESC
      LIMIT 5
    `, [relationship.id])

    // Get recent activities
    const recentActivities = await db.all(`
      SELECT a.*, u.name as created_by_name
      FROM activities a
      JOIN users u ON a.created_by_user_id = u.id
      WHERE a.relationship_id = $1
      ORDER BY COALESCE(a.completed_date, a.planned_date) DESC
      LIMIT 5
    `, [relationship.id])

    // Get current challenges
    const currentChallenges = await db.all(`
      SELECT cp.*, c.challenge_name, c.challenge_description, c.category
      FROM challenge_participation cp
      JOIN challenges c ON cp.challenge_id = c.id
      WHERE cp.relationship_id = $1 AND cp.status = 'active'
      ORDER BY cp.created_at DESC
      LIMIT 3
    `, [relationship.id])

    // Get earned achievements
    const achievements = await db.all(`
      SELECT ua.*, a.achievement_name, a.achievement_description, a.icon_url, a.point_value
      FROM user_achievements ua
      JOIN achievements a ON ua.achievement_id = a.id
      WHERE ua.relationship_id = $1
      ORDER BY ua.earned_date DESC
      LIMIT 10
    `, [relationship.id])

    // Calculate analytics
    const analytics = await calculateAnalytics(c.env, relationship.id)

    // Calculate checkin streak
    const checkinStreak = await calculateCheckinStreak(c.env, relationship.id)

    return c.json({
      relationship: {
        ...relationship,
        partner,
        days_together: analytics.days_together
      },
      recent_checkins: recentCheckins || [],
      upcoming_dates: upcomingDates,
      active_goals: activeGoals || [],
      recent_activities: recentActivities || [],
      current_challenges: currentChallenges || [],
      analytics,
      achievements_earned: achievements || [],
      checkin_streak: checkinStreak
    })
  } catch (error) {
    console.error('Get dashboard error:', error)
    return c.json({ error: 'Failed to get dashboard data' }, 500)
  }
})

// GET /api/dashboard/analytics/:relationshipId
// Get relationship analytics
dashboardApi.get('/analytics/:relationshipId', async (c: Context) => {
  try {
    const relationshipId = c.req.param('relationshipId')
    const analytics = await calculateAnalytics(c.env, relationshipId)

    return c.json({ analytics })
  } catch (error) {
    console.error('Get analytics error:', error)
    return c.json({ error: 'Failed to get analytics' }, 500)
  }
})

export default dashboardApi
