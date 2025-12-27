// Better Together: Utility Functions

import { Env, User, Relationship } from './types'
import { Database, createDatabase } from './db'

/**
 * Generate a unique ID for database records
 */
export function generateId(): string {
  return crypto.randomUUID()
}

/**
 * Calculate days between two dates
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

/**
 * Get current date in YYYY-MM-DD format
 */
export function getCurrentDate(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Get current datetime in ISO format
 */
export function getCurrentDateTime(): string {
  return new Date().toISOString()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Get partner ID from relationship
 */
export function getPartnerId(relationship: Relationship, currentUserId: string): string {
  return relationship.user_1_id === currentUserId 
    ? relationship.user_2_id 
    : relationship.user_1_id
}

/**
 * Calculate relationship health score based on various metrics
 */
export function calculateHealthScore(
  avgConnectionScore: number,
  avgSatisfactionScore: number,
  checkinFrequency: number,
  goalCompletionRate: number
): number {
  const connectionWeight = 0.3
  const satisfactionWeight = 0.3
  const consistencyWeight = 0.2
  const goalsWeight = 0.2
  
  const normalizedConnection = (avgConnectionScore / 10) * 100
  const normalizedSatisfaction = (avgSatisfactionScore / 10) * 100
  const normalizedConsistency = Math.min(checkinFrequency * 10, 100) // Assume 10 checkins per month is 100%
  const normalizedGoals = goalCompletionRate * 100
  
  return Math.round(
    (normalizedConnection * connectionWeight) +
    (normalizedSatisfaction * satisfactionWeight) +
    (normalizedConsistency * consistencyWeight) +
    (normalizedGoals * goalsWeight)
  )
}

/**
 * Get user by email
 */
export async function getUserByEmail(env: Env, email: string): Promise<User | null> {
  const db = createDatabase(env)
  return await db.first<User>(
    'SELECT * FROM users WHERE email = $1',
    [email]
  )
}

/**
 * Get user by ID
 */
export async function getUserById(env: Env, userId: string): Promise<User | null> {
  const db = createDatabase(env)
  return await db.first<User>(
    'SELECT * FROM users WHERE id = $1',
    [userId]
  )
}

/**
 * Get relationship by user ID
 */
export async function getRelationshipByUserId(env: Env, userId: string): Promise<Relationship | null> {
  const db = createDatabase(env)
  return await db.first<Relationship>(
    "SELECT * FROM relationships WHERE (user_1_id = $1 OR user_2_id = $2) AND status = 'active'",
    [userId, userId]
  )
}

/**
 * Check if user has completed checkin for today
 */
export async function hasTodayCheckin(env: Env, relationshipId: string, userId: string): Promise<boolean> {
  const db = createDatabase(env)
  const today = getCurrentDate()
  const result = await db.first(
    'SELECT id FROM daily_checkins WHERE relationship_id = $1 AND user_id = $2 AND checkin_date = $3',
    [relationshipId, userId, today]
  )

  return result !== null
}

/**
 * Calculate current checkin streak for a relationship
 */
export async function calculateCheckinStreak(env: Env, relationshipId: string): Promise<number> {
  const db = createDatabase(env)
  const results = await db.all<{ checkin_date: string }>(`
    SELECT DISTINCT checkin_date
    FROM daily_checkins
    WHERE relationship_id = $1
    ORDER BY checkin_date DESC
    LIMIT 100
  `, [relationshipId])

  if (!results || results.length === 0) return 0

  const dates = results.map(row => new Date(row.checkin_date))
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  let currentDate = new Date(today)

  for (const date of dates) {
    date.setHours(0, 0, 0, 0)
    if (date.getTime() === currentDate.getTime()) {
      streak++
      currentDate.setDate(currentDate.getDate() - 1)
    } else {
      break
    }
  }

  return streak
}

/**
 * Get upcoming important dates (next 30 days)
 */
export async function getUpcomingDates(env: Env, relationshipId: string): Promise<any[]> {
  const db = createDatabase(env)
  const today = getCurrentDate()
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + 30)
  const future = futureDate.toISOString().split('T')[0]

  return await db.all(`
    SELECT * FROM important_dates
    WHERE relationship_id = $1
    AND date_value BETWEEN $2 AND $3
    ORDER BY date_value ASC
  `, [relationshipId, today, future])
}

/**
 * Check and award achievements
 */
export async function checkAchievements(env: Env, relationshipId: string, userId: string): Promise<string[]> {
  const newAchievements: string[] = []

  // Check for checkin streak achievements
  const streak = await calculateCheckinStreak(env, relationshipId)

  if (streak === 7) {
    await awardAchievement(env, relationshipId, 'week_streak', userId)
    newAchievements.push('week_streak')
  }

  if (streak === 30) {
    await awardAchievement(env, relationshipId, 'month_streak', userId)
    newAchievements.push('month_streak')
  }

  return newAchievements
}

/**
 * Award an achievement to a relationship
 */
export async function awardAchievement(env: Env, relationshipId: string, achievementId: string, userId?: string): Promise<void> {
  try {
    const db = createDatabase(env)
    await db.run(`
      INSERT INTO user_achievements (id, relationship_id, achievement_id, earned_by_user_id)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING
    `, [generateId(), relationshipId, achievementId, userId || null])
  } catch (error) {
    console.error('Error awarding achievement:', error)
  }
}

/**
 * Send notification to user
 */
export async function sendNotification(
  env: Env,
  userId: string,
  type: string,
  title: string,
  message: string,
  relationshipId?: string,
  actionUrl?: string
): Promise<void> {
  try {
    const db = createDatabase(env)
    await db.run(`
      INSERT INTO notifications (id, user_id, relationship_id, notification_type, title, message, action_url)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [generateId(), userId, relationshipId || null, type, title, message, actionUrl || null])
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

/**
 * Calculate analytics for a relationship
 */
export async function calculateAnalytics(env: Env, relationshipId: string): Promise<any> {
  const db = createDatabase(env)
  const today = getCurrentDate()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const monthAgo = thirtyDaysAgo.toISOString().split('T')[0]

  // Get relationship start date for days together
  const relationship = await db.first<{ start_date: string }>(
    'SELECT start_date FROM relationships WHERE id = $1',
    [relationshipId]
  )

  const daysTogether = relationship?.start_date
    ? daysBetween(relationship.start_date, today)
    : 0

  // Calculate average scores from recent checkins
  const checkinStats = await db.first<{
    avg_connection: number
    avg_satisfaction: number
    checkin_count: number
  }>(`
    SELECT
      AVG(connection_score) as avg_connection,
      AVG(relationship_satisfaction) as avg_satisfaction,
      COUNT(*) as checkin_count
    FROM daily_checkins
    WHERE relationship_id = $1
    AND checkin_date >= $2
  `, [relationshipId, monthAgo])

  // Count activities and goals this month
  const activityCount = await db.first<{ count: number }>(`
    SELECT COUNT(*) as count
    FROM activities
    WHERE relationship_id = $1
    AND status = 'completed'
    AND completed_date >= $2
  `, [relationshipId, monthAgo])

  const goalCount = await db.first<{ count: number }>(`
    SELECT COUNT(*) as count
    FROM shared_goals
    WHERE relationship_id = $1
    AND status = 'completed'
    AND completion_date >= $2
  `, [relationshipId, monthAgo])

  const checkinStreak = await calculateCheckinStreak(env, relationshipId)

  const avgConnection = Number(checkinStats?.avg_connection || 0)
  const avgSatisfaction = Number(checkinStats?.avg_satisfaction || 0)
  const checkinFrequency = Number(checkinStats?.checkin_count || 0)
  const goalCompletionRate = Number(goalCount?.count || 0) / 30 // Simple rate calculation

  const overallHealthScore = calculateHealthScore(
    avgConnection,
    avgSatisfaction,
    checkinFrequency,
    goalCompletionRate
  )

  return {
    days_together: daysTogether,
    average_connection_score: avgConnection,
    average_satisfaction_score: avgSatisfaction,
    checkin_streak: checkinStreak,
    activities_completed_this_month: Number(activityCount?.count || 0),
    goals_completed_this_month: Number(goalCount?.count || 0),
    communication_frequency_score: checkinFrequency,
    overall_health_score: overallHealthScore
  }
}