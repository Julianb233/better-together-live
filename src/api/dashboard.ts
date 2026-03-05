// Better Together: Dashboard API
// Handles dashboard data aggregation and relationship analytics

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase/server'
import { checkOwnership, forbiddenResponse } from '../lib/security'
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
    const supabase = createAdminClient(c.env as SupabaseEnv)
    const userId = c.req.param('userId')

    if (!checkOwnership(c, userId)) {
      return forbiddenResponse(c)
    }

    // Get user's relationship
    const relationship = await getRelationshipByUserId(c.env, userId)
    if (!relationship) {
      return c.json({ error: 'No active relationship found' }, 404)
    }

    // Get partner details
    const partnerId = getPartnerId(relationship, userId)
    const partner = await getUserById(c.env, partnerId)

    // Get recent checkins
    const { data: recentCheckins, error: checkinsErr } = await supabase
      .from('daily_checkins')
      .select('*, users!daily_checkins_user_id_fkey(name)')
      .eq('relationship_id', relationship.id)
      .order('checkin_date', { ascending: false })
      .limit(10)

    if (checkinsErr) throw checkinsErr

    // Flatten user_name from join
    const checkins = (recentCheckins || []).map((row: any) => ({
      ...row,
      user_name: row.users?.name ?? null,
      users: undefined,
    }))

    // Get upcoming dates
    const upcomingDates = await getUpcomingDates(c.env, relationship.id)

    // Get active goals
    const { data: activeGoals, error: goalsErr } = await supabase
      .from('shared_goals')
      .select('*')
      .eq('relationship_id', relationship.id)
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(5)

    if (goalsErr) throw goalsErr

    // Map goal columns to frontend shape
    const goals = (activeGoals || []).map((row: any) => ({
      ...row,
      goal_name: row.title,
      goal_description: row.description,
      current_progress: row.progress_percentage,
    }))

    // Get recent activities
    const { data: recentActivities, error: activitiesErr } = await supabase
      .from('activities')
      .select('*')
      .eq('relationship_id', relationship.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (activitiesErr) throw activitiesErr

    // Map activity columns to frontend shape
    const activities = (recentActivities || []).map((row: any) => ({
      ...row,
      activity_name: row.title,
      planned_date: row.date,
      cost_amount: row.cost,
    }))

    // Get current challenges (these tables may not exist in Supabase types yet;
    // use raw query to avoid type errors -- will be typed when challenge tables are added)
    let currentChallenges: any[] = []
    try {
      const { data: challenges } = await supabase
        .from('challenge_participation' as any)
        .select('*, challenges!inner(challenge_name, challenge_description, category)')
        .eq('relationship_id', relationship.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3)
      currentChallenges = challenges || []
    } catch {
      // Table may not exist yet -- return empty array
    }

    // Get earned achievements
    let achievements: any[] = []
    try {
      const { data: achData } = await supabase
        .from('user_achievements' as any)
        .select('*, achievements!inner(achievement_name, achievement_description, icon_url, point_value)')
        .eq('relationship_id', relationship.id)
        .order('earned_date', { ascending: false })
        .limit(10)
      achievements = achData || []
    } catch {
      // Table may not exist yet -- return empty array
    }

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
      recent_checkins: checkins,
      upcoming_dates: upcomingDates,
      active_goals: goals,
      recent_activities: activities,
      current_challenges: currentChallenges,
      analytics,
      achievements_earned: achievements,
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
