// Better Together: Utility Functions

import { Env, User, Relationship } from './types'
import { createAdminClient, type SupabaseEnv } from './lib/supabase/server'

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
  const supabase = createAdminClient(env as unknown as SupabaseEnv)
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return (data as unknown as User) ?? null
}

/**
 * Get user by ID
 */
export async function getUserById(env: Env, userId: string): Promise<User | null> {
  const supabase = createAdminClient(env as unknown as SupabaseEnv)
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return (data as unknown as User) ?? null
}

/**
 * Get relationship by user ID
 */
export async function getRelationshipByUserId(env: Env, userId: string): Promise<Relationship | null> {
  const supabase = createAdminClient(env as unknown as SupabaseEnv)
  const { data, error } = await supabase
    .from('relationships')
    .select('*')
    .eq('status', 'active')
    .or(`user_1_id.eq.${userId},user_2_id.eq.${userId}`)
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return (data as unknown as Relationship) ?? null
}

/**
 * Check if user has completed checkin for today
 */
export async function hasTodayCheckin(env: Env, relationshipId: string, userId: string): Promise<boolean> {
  const supabase = createAdminClient(env as unknown as SupabaseEnv)
  const today = getCurrentDate()
  const { data, error } = await supabase
    .from('daily_checkins')
    .select('id')
    .eq('relationship_id', relationshipId)
    .eq('user_id', userId)
    .eq('checkin_date', today)
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data !== null
}

/**
 * Calculate current checkin streak for a relationship
 */
export async function calculateCheckinStreak(env: Env, relationshipId: string): Promise<number> {
  const supabase = createAdminClient(env as unknown as SupabaseEnv)
  const { data: results, error } = await supabase
    .from('daily_checkins')
    .select('checkin_date')
    .eq('relationship_id', relationshipId)
    .order('checkin_date', { ascending: false })
    .limit(100)

  if (error) throw error
  if (!results || results.length === 0) return 0

  // Deduplicate dates
  const uniqueDates = [...new Set(results.map((r: any) => r.checkin_date))]
  const dates = uniqueDates.map((d: string) => new Date(d))
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  let streak = 0
  const currentDate = new Date(today)

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
  const supabase = createAdminClient(env as unknown as SupabaseEnv)
  const today = getCurrentDate()
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + 30)
  const future = futureDate.toISOString().split('T')[0]

  const { data, error } = await supabase
    .from('important_dates')
    .select('*')
    .eq('relationship_id', relationshipId)
    .gte('date_value', today)
    .lte('date_value', future)
    .order('date_value', { ascending: true })

  if (error) throw error
  return data || []
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
    const supabase = createAdminClient(env as unknown as SupabaseEnv)
    await supabase.from('user_achievements').upsert({
      id: generateId(),
      relationship_id: relationshipId,
      achievement_id: achievementId,
      earned_by_user_id: userId || null,
    } as any, { onConflict: 'relationship_id,achievement_id' })
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
    const supabase = createAdminClient(env as unknown as SupabaseEnv)
    await supabase.from('notifications').insert({
      id: generateId(),
      user_id: userId,
      relationship_id: relationshipId || null,
      notification_type: type,
      title,
      message,
      action_url: actionUrl || null,
    } as any)
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

/**
 * Calculate analytics for a relationship
 */
export async function calculateAnalytics(env: Env, relationshipId: string): Promise<any> {
  const supabase = createAdminClient(env as unknown as SupabaseEnv)
  const today = getCurrentDate()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const monthAgo = thirtyDaysAgo.toISOString().split('T')[0]

  // Get relationship start date for days together
  const { data: relationship } = await supabase
    .from('relationships')
    .select('start_date')
    .eq('id', relationshipId)
    .limit(1)
    .single()

  const daysTogether = relationship?.start_date
    ? daysBetween(relationship.start_date, today)
    : 0

  // Fetch recent checkins and aggregate in JS (Supabase query builder lacks AVG)
  const { data: checkins } = await supabase
    .from('daily_checkins')
    .select('connection_score, satisfaction')
    .eq('relationship_id', relationshipId)
    .gte('checkin_date', monthAgo)

  const checkinCount = checkins?.length || 0
  const avgConnection = checkinCount > 0
    ? checkins!.reduce((sum: number, c: any) => sum + Number(c.connection_score || 0), 0) / checkinCount
    : 0
  const avgSatisfaction = checkinCount > 0
    ? checkins!.reduce((sum: number, c: any) => sum + Number(c.satisfaction || 0), 0) / checkinCount
    : 0

  // Count activities completed this month
  const { data: activities } = await supabase
    .from('activities')
    .select('id')
    .eq('relationship_id', relationshipId)
    .eq('status', 'completed')
    .gte('completed_date', monthAgo)

  // Count goals completed this month
  const { data: goals } = await supabase
    .from('shared_goals')
    .select('id')
    .eq('relationship_id', relationshipId)
    .eq('status', 'completed')
    .gte('completion_date', monthAgo)

  const checkinStreak = await calculateCheckinStreak(env, relationshipId)

  const activityCountVal = activities?.length || 0
  const goalCountVal = goals?.length || 0
  const goalCompletionRate = goalCountVal / 30 // Simple rate calculation

  const overallHealthScore = calculateHealthScore(
    avgConnection,
    avgSatisfaction,
    checkinCount,
    goalCompletionRate
  )

  return {
    days_together: daysTogether,
    average_connection_score: avgConnection,
    average_satisfaction_score: avgSatisfaction,
    checkin_streak: checkinStreak,
    activities_completed_this_month: activityCountVal,
    goals_completed_this_month: goalCountVal,
    communication_frequency_score: checkinCount,
    overall_health_score: overallHealthScore
  }
}
