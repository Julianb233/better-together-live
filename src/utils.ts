// Better Together: Utility Functions

import {
  Env,
  User,
  Relationship,
  ConnectionStyle,
  QuizResult,
  AnswerData,
  QuizQuestion,
  StyleBreakdown,
  ResultData
} from './types'

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
  const result = await env.DB.prepare(
    'SELECT * FROM users WHERE email = ?'
  ).bind(email).first()
  
  return result as User | null
}

/**
 * Get user by ID
 */
export async function getUserById(env: Env, userId: string): Promise<User | null> {
  const result = await env.DB.prepare(
    'SELECT * FROM users WHERE id = ?'
  ).bind(userId).first()
  
  return result as User | null
}

/**
 * Get relationship by user ID
 */
export async function getRelationshipByUserId(env: Env, userId: string): Promise<Relationship | null> {
  const result = await env.DB.prepare(
    'SELECT * FROM relationships WHERE (user_1_id = ? OR user_2_id = ?) AND status = "active"'
  ).bind(userId, userId).first()
  
  return result as Relationship | null
}

/**
 * Check if user has completed checkin for today
 */
export async function hasTodayCheckin(env: Env, relationshipId: string, userId: string): Promise<boolean> {
  const today = getCurrentDate()
  const result = await env.DB.prepare(
    'SELECT id FROM daily_checkins WHERE relationship_id = ? AND user_id = ? AND checkin_date = ?'
  ).bind(relationshipId, userId, today).first()
  
  return result !== null
}

/**
 * Calculate current checkin streak for a relationship
 */
export async function calculateCheckinStreak(env: Env, relationshipId: string): Promise<number> {
  const results = await env.DB.prepare(`
    SELECT DISTINCT checkin_date 
    FROM daily_checkins 
    WHERE relationship_id = ? 
    ORDER BY checkin_date DESC
    LIMIT 100
  `).bind(relationshipId).all()
  
  if (!results.results || results.results.length === 0) return 0
  
  const dates = results.results.map(row => new Date(row.checkin_date as string))
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
  const today = getCurrentDate()
  const futureDate = new Date()
  futureDate.setDate(futureDate.getDate() + 30)
  const future = futureDate.toISOString().split('T')[0]
  
  const results = await env.DB.prepare(`
    SELECT * FROM important_dates 
    WHERE relationship_id = ? 
    AND date_value BETWEEN ? AND ?
    ORDER BY date_value ASC
  `).bind(relationshipId, today, future).all()
  
  return results.results || []
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
    await env.DB.prepare(`
      INSERT OR IGNORE INTO user_achievements (id, relationship_id, achievement_id, earned_by_user_id)
      VALUES (?, ?, ?, ?)
    `).bind(generateId(), relationshipId, achievementId, userId || null).run()
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
    await env.DB.prepare(`
      INSERT INTO notifications (id, user_id, relationship_id, notification_type, title, message, action_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(generateId(), userId, relationshipId || null, type, title, message, actionUrl || null).run()
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

/**
 * Calculate analytics for a relationship
 */
export async function calculateAnalytics(env: Env, relationshipId: string): Promise<any> {
  const today = getCurrentDate()
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const monthAgo = thirtyDaysAgo.toISOString().split('T')[0]
  
  // Get relationship start date for days together
  const relationship = await env.DB.prepare(
    'SELECT start_date FROM relationships WHERE id = ?'
  ).bind(relationshipId).first()
  
  const daysTogether = relationship?.start_date 
    ? daysBetween(relationship.start_date, today)
    : 0
  
  // Calculate average scores from recent checkins
  const checkinStats = await env.DB.prepare(`
    SELECT 
      AVG(connection_score) as avg_connection,
      AVG(relationship_satisfaction) as avg_satisfaction,
      COUNT(*) as checkin_count
    FROM daily_checkins 
    WHERE relationship_id = ? 
    AND checkin_date >= ?
  `).bind(relationshipId, monthAgo).first()
  
  // Count activities and goals this month
  const activityCount = await env.DB.prepare(`
    SELECT COUNT(*) as count 
    FROM activities 
    WHERE relationship_id = ? 
    AND status = 'completed'
    AND completed_date >= ?
  `).bind(relationshipId, monthAgo).first()
  
  const goalCount = await env.DB.prepare(`
    SELECT COUNT(*) as count 
    FROM shared_goals 
    WHERE relationship_id = ? 
    AND status = 'completed'
    AND completion_date >= ?
  `).bind(relationshipId, monthAgo).first()
  
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

// ============================================
// QUIZ SYSTEM UTILITIES
// ============================================

/**
 * Calculate Connection Compass scores from quiz answers
 */
export function calculateConnectionCompassScores(
  answers: Array<{ question: QuizQuestion; answer: AnswerData }>
): StyleBreakdown {
  const styles: ConnectionStyle[] = [
    'verbal_appreciation',
    'focused_presence',
    'thoughtful_gestures',
    'supportive_partnership',
    'physical_connection',
    'growth_championing'
  ]

  // Initialize scores
  const scores: Record<ConnectionStyle, number> = {
    verbal_appreciation: 0,
    focused_presence: 0,
    thoughtful_gestures: 0,
    supportive_partnership: 0,
    physical_connection: 0,
    growth_championing: 0
  }

  // Process each answer
  for (const { question, answer } of answers) {
    const scoringData = question.scoring_data

    if (!scoringData) continue

    // Handle forced choice questions
    if (question.question_type === 'forced_choice') {
      const selectedOption = answer.selected_option_ids?.[0]
      if (selectedOption && scoringData.points_map) {
        const pointsForOption = scoringData.points_map[selectedOption]
        if (typeof pointsForOption === 'object') {
          for (const [style, points] of Object.entries(pointsForOption)) {
            scores[style as ConnectionStyle] += points as number
          }
        }
      }
    }

    // Handle likert scale questions
    if (question.question_type === 'likert_scale' && answer.scale_value) {
      if (scoringData.style_weights && answer.scale_value >= 4) {
        for (const [style, weight] of Object.entries(scoringData.style_weights)) {
          scores[style as ConnectionStyle] += (answer.scale_value - 3) * (weight as number)
        }
      }
    }

    // Handle ranking questions
    if (question.question_type === 'ranking' && answer.ranked_items) {
      const rankedItems = answer.ranked_items
      const styleOrder = [
        'verbal_appreciation',
        'focused_presence',
        'thoughtful_gestures',
        'supportive_partnership',
        'physical_connection',
        'growth_championing'
      ]

      rankedItems.forEach((item, index) => {
        const rank = index // 0-based ranking
        const points = 6 - rank // 6 points for 1st place, 1 point for 6th
        const style = styleOrder[rankedItems.indexOf(item)]
        if (style) {
          scores[style as ConnectionStyle] += points
        }
      })
    }

    // Handle single choice questions with points map
    if (question.question_type === 'single_choice' && scoringData.points_map) {
      const selectedOption = answer.selected_option_ids?.[0]
      if (selectedOption) {
        const pointsForOption = scoringData.points_map[selectedOption]
        if (typeof pointsForOption === 'object') {
          for (const [style, points] of Object.entries(pointsForOption)) {
            scores[style as ConnectionStyle] += points as number
          }
        }
      }
    }
  }

  // Calculate total and percentages
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0)

  const breakdown: StyleBreakdown = {}
  for (const style of styles) {
    const score = scores[style]
    const percentage = totalScore > 0 ? (score / totalScore) * 100 : 0
    breakdown[style] = {
      score,
      percentage: Math.round(percentage),
      description: getConnectionStyleDescription(style)
    }
  }

  return breakdown
}

/**
 * Get description for a connection style
 */
export function getConnectionStyleDescription(style: ConnectionStyle): string {
  const descriptions: Record<ConnectionStyle, string> = {
    verbal_appreciation: 'You feel valued through spoken or written expressions of care, appreciation, and encouragement',
    focused_presence: 'You feel connected through undivided attention and meaningful shared experiences',
    thoughtful_gestures: 'You feel loved through intentional actions that show consideration and remembrance',
    supportive_partnership: 'You feel cared for through practical help and sharing life\'s responsibilities',
    physical_connection: 'You feel close through appropriate touch, proximity, and physical affection',
    growth_championing: 'You feel valued when your partner actively supports your dreams and personal development'
  }
  return descriptions[style]
}

/**
 * Get emoji for connection style
 */
export function getConnectionStyleEmoji(style: ConnectionStyle): string {
  const emojis: Record<ConnectionStyle, string> = {
    verbal_appreciation: '🗣️',
    focused_presence: '🎯',
    thoughtful_gestures: '🎁',
    supportive_partnership: '🤲',
    physical_connection: '🫂',
    growth_championing: '🌟'
  }
  return emojis[style]
}

/**
 * Get friendly name for connection style
 */
export function getConnectionStyleName(style: ConnectionStyle): string {
  const names: Record<ConnectionStyle, string> = {
    verbal_appreciation: 'Verbal Appreciation',
    focused_presence: 'Focused Presence',
    thoughtful_gestures: 'Thoughtful Gestures',
    supportive_partnership: 'Supportive Partnership',
    physical_connection: 'Physical Connection',
    growth_championing: 'Growth Championing'
  }
  return names[style]
}

/**
 * Get the top 2 connection styles from breakdown
 */
export function getTopConnectionStyles(breakdown: StyleBreakdown): {
  primary: ConnectionStyle
  secondary: ConnectionStyle
} {
  const sorted = Object.entries(breakdown)
    .sort(([, a], [, b]) => b.percentage - a.percentage)

  return {
    primary: sorted[0][0] as ConnectionStyle,
    secondary: sorted[1][0] as ConnectionStyle
  }
}

/**
 * Generate personalized result summary based on connection styles
 */
export function generateConnectionCompassSummary(
  primaryStyle: ConnectionStyle,
  secondaryStyle: ConnectionStyle
): string {
  const summaries: Record<string, string> = {
    'verbal_appreciation_focused_presence': 'You feel most valued when your partner gives you their complete, undivided attention and verbally expresses what you mean to them. Quality conversations where you both put away distractions and really listen to each other fill your emotional tank. You thrive on both presence and verbal affirmation.',
    'verbal_appreciation_thoughtful_gestures': 'You appreciate when your partner expresses their love through both words and actions. Thoughtful notes paired with small surprises, or verbal appreciation alongside meaningful gestures create the deepest connection for you.',
    'verbal_appreciation_supportive_partnership': 'You feel loved when your partner both tells you and shows you through practical support. Hearing "I appreciate you" while they help with daily tasks creates a powerful sense of partnership and validation.',
    'verbal_appreciation_physical_connection': 'You need a combination of words and touch to feel fully loved. A verbal "I love you" paired with a warm embrace, or encouraging words with physical closeness creates your ideal connection.',
    'verbal_appreciation_growth_championing': 'You feel most supported when your partner verbally encourages your dreams and actively champions your personal growth. Hearing specific affirmations about your potential energizes you.',
    'focused_presence_thoughtful_gestures': 'You value when your partner creates intentional moments of connection through planned experiences and undivided attention. A device-free date night that shows planning and thought means everything.',
    'focused_presence_supportive_partnership': 'You feel most connected when your partner is fully present while you work together on shared responsibilities. Quality time doing life together, not just leisure activities, strengthens your bond.',
    'focused_presence_physical_connection': 'You need both undivided attention and physical closeness to feel deeply connected. Sitting together without distractions while maintaining physical touch is your ideal.',
    'focused_presence_growth_championing': 'You feel valued when your partner gives you their full attention as you discuss your goals and dreams. Being actively listened to about your aspirations creates deep connection.',
    'thoughtful_gestures_supportive_partnership': 'You appreciate when your partner shows love through both meaningful surprises and practical help. A thoughtful gift paired with assistance on a project speaks volumes.',
    'thoughtful_gestures_physical_connection': 'You feel loved through tangible expressions - both gifts/gestures and physical affection. A small surprise paired with a warm hug communicates care effectively.',
    'thoughtful_gestures_growth_championing': 'You appreciate when your partner supports your growth through both encouragement and thoughtful resources. Buying you a book you mentioned or signing you up for a class shows they listen and invest.',
    'supportive_partnership_physical_connection': 'You feel most loved when your partner both helps with practical needs and maintains physical closeness. Working alongside you while staying physically connected is ideal.',
    'supportive_partnership_growth_championing': 'You value a partner who both helps with daily responsibilities and actively supports your personal development. Sharing the load so you can pursue your goals matters deeply.',
    'physical_connection_growth_championing': 'You need both physical affection and support for your individual growth. A partner who celebrates your wins with a hug and encourages your independence creates the perfect balance.'
  }

  const key = `${primaryStyle}_${secondaryStyle}`
  return summaries[key] || `You feel most valued through ${getConnectionStyleName(primaryStyle)} combined with ${getConnectionStyleName(secondaryStyle)}.`
}

/**
 * Generate action steps based on connection styles
 */
export function generateConnectionCompassActionSteps(
  primaryStyle: ConnectionStyle,
  secondaryStyle: ConnectionStyle
): Array<{ title: string; description: string; priority: 'high' | 'medium' | 'low'; category: string }> {
  const allSteps: Record<ConnectionStyle, Array<{ title: string; description: string; category: string }>> = {
    verbal_appreciation: [
      {
        title: 'Daily Verbal Affirmation',
        description: 'Share one specific thing you appreciate about your partner each day',
        category: 'communication'
      },
      {
        title: 'Write a Love Note',
        description: 'Leave a thoughtful written message expressing your feelings',
        category: 'expression'
      }
    ],
    focused_presence: [
      {
        title: 'Device-Free Time',
        description: 'Schedule 30 minutes of undivided attention with no phones or distractions',
        category: 'quality_time'
      },
      {
        title: 'Active Listening Practice',
        description: 'Take turns sharing about your day while the other fully listens',
        category: 'communication'
      }
    ],
    thoughtful_gestures: [
      {
        title: 'Surprise Gesture',
        description: 'Do something thoughtful that shows you remember their preferences',
        category: 'gestures'
      },
      {
        title: 'Plan Something Special',
        description: 'Arrange an activity based on something they mentioned wanting to do',
        category: 'planning'
      }
    ],
    supportive_partnership: [
      {
        title: 'Share a Task',
        description: 'Take on a responsibility your partner usually handles',
        category: 'support'
      },
      {
        title: 'Problem-Solve Together',
        description: 'Collaborate on solving a challenge one of you is facing',
        category: 'partnership'
      }
    ],
    physical_connection: [
      {
        title: 'Intentional Touch',
        description: 'Initiate appropriate physical affection multiple times today',
        category: 'physical'
      },
      {
        title: 'Close Proximity',
        description: 'Sit or stand close to your partner during conversations',
        category: 'physical'
      }
    ],
    growth_championing: [
      {
        title: 'Discuss Their Goals',
        description: 'Ask about their personal aspirations and how you can support them',
        category: 'growth'
      },
      {
        title: 'Celebrate Progress',
        description: 'Acknowledge and celebrate a recent achievement or progress they\'ve made',
        category: 'encouragement'
      }
    ]
  }

  const actionSteps = [
    { ...allSteps[primaryStyle][0], priority: 'high' as const },
    { ...allSteps[primaryStyle][1], priority: 'high' as const },
    { ...allSteps[secondaryStyle][0], priority: 'medium' as const }
  ]

  return actionSteps
}

/**
 * Calculate couple compatibility based on both partners' connection styles
 */
export function calculateCoupleCompatibility(
  user1Breakdown: StyleBreakdown,
  user2Breakdown: StyleBreakdown
): {
  compatibility_score: number
  style_overlap: number
  complementary_score: number
  potential_conflicts: string[]
  strengths: string[]
  growth_areas: string[]
} {
  // Calculate style overlap (how similar are their top styles)
  const user1Top = Object.entries(user1Breakdown)
    .sort(([, a], [, b]) => b.percentage - a.percentage)
    .slice(0, 2)
    .map(([style]) => style)

  const user2Top = Object.entries(user2Breakdown)
    .sort(([, a], [, b]) => b.percentage - a.percentage)
    .slice(0, 2)
    .map(([style]) => style)

  const overlap = user1Top.filter(style => user2Top.includes(style)).length
  const styleOverlap = (overlap / 2) * 100

  // Calculate complementary score (how well they might fulfill each other's needs)
  let complementaryScore = 0
  for (const user1Style of user1Top) {
    if (user2Breakdown[user1Style]?.percentage > 10) {
      complementaryScore += 50
    }
  }

  // Overall compatibility
  const compatibilityScore = Math.round((styleOverlap * 0.4) + (complementaryScore * 0.6))

  // Generate insights
  const potentialConflicts: string[] = []
  const strengths: string[] = []
  const growthAreas: string[] = []

  if (overlap === 2) {
    strengths.push('You both share the same top connection styles, making it easy to understand each other')
  } else if (overlap === 1) {
    strengths.push('You share one primary connection style, providing common ground')
    growthAreas.push('Learning to appreciate each other\'s different secondary style will deepen your connection')
  } else {
    potentialConflicts.push('Your connection styles differ significantly - what feels loving to one may not resonate with the other')
    growthAreas.push('Focus on learning and practicing each other\'s top connection styles')
  }

  if (user1Breakdown.verbal_appreciation?.percentage > 30 && user2Breakdown.verbal_appreciation?.percentage < 15) {
    growthAreas.push('One partner values verbal appreciation much more - practice expressing appreciation in words')
  }

  if (user1Breakdown.physical_connection?.percentage > 30 && user2Breakdown.physical_connection?.percentage < 15) {
    growthAreas.push('Physical connection is more important to one partner - discuss comfort levels and needs')
  }

  return {
    compatibility_score: compatibilityScore,
    style_overlap: styleOverlap,
    complementary_score: complementaryScore,
    potential_conflicts,
    strengths,
    growth_areas
  }
}