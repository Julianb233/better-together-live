// Better Together: Gamification API
// Handles rewards, badges, achievements, and points system

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import { generateId, getCurrentDateTime } from '../utils'

const gamificationApi = new Hono()

// Sample rewards
const SAMPLE_REWARDS = [
  {
    id: 'reward_1',
    name: 'Premium Date Night Guide',
    description: 'Unlock exclusive date night ideas and planning tools',
    pointsCost: 500,
    category: 'content',
    imageUrl: '/images/rewards/date-guide.jpg',
    available: true
  },
  {
    id: 'reward_2',
    name: 'Couples Meditation Session',
    description: 'Access to guided meditation sessions for couples',
    pointsCost: 300,
    category: 'wellness',
    imageUrl: '/images/rewards/meditation.jpg',
    available: true
  },
  {
    id: 'reward_3',
    name: 'Relationship Coach Session',
    description: '30-minute session with a certified relationship coach',
    pointsCost: 1000,
    category: 'coaching',
    imageUrl: '/images/rewards/coaching.jpg',
    available: true
  },
  {
    id: 'reward_4',
    name: 'Custom Anniversary Card',
    description: 'Personalized digital anniversary card design',
    pointsCost: 200,
    category: 'gifts',
    imageUrl: '/images/rewards/card.jpg',
    available: true
  }
]

// Sample badges
const SAMPLE_BADGES = [
  {
    id: 'badge_1',
    name: 'Week Warrior',
    description: 'Complete daily check-ins for 7 days straight',
    category: 'consistency',
    iconUrl: '/images/badges/week-warrior.svg',
    rarity: 'common'
  },
  {
    id: 'badge_2',
    name: 'Adventure Seeker',
    description: 'Complete 5 adventure-type experiences',
    category: 'experiences',
    iconUrl: '/images/badges/adventure.svg',
    rarity: 'uncommon'
  },
  {
    id: 'badge_3',
    name: 'Communication Master',
    description: 'Have 10 deep conversations tracked',
    category: 'communication',
    iconUrl: '/images/badges/communication.svg',
    rarity: 'rare'
  },
  {
    id: 'badge_4',
    name: 'Goal Crusher',
    description: 'Complete 5 shared goals',
    category: 'goals',
    iconUrl: '/images/badges/goals.svg',
    rarity: 'uncommon'
  }
]

// Sample achievements
const SAMPLE_ACHIEVEMENTS = [
  {
    id: 'ach_1',
    name: 'First Steps',
    description: 'Complete your first daily check-in',
    points: 50,
    category: 'milestone',
    progress: { current: 1, target: 1 },
    completed: true,
    unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 'ach_2',
    name: 'Streak Builder',
    description: 'Maintain a 30-day check-in streak',
    points: 500,
    category: 'streak',
    progress: { current: 15, target: 30 },
    completed: false
  },
  {
    id: 'ach_3',
    name: 'Date Night Pro',
    description: 'Complete 10 date night activities',
    points: 300,
    category: 'activities',
    progress: { current: 7, target: 10 },
    completed: false
  }
]

// GET /api/rewards - List rewards
gamificationApi.get('/rewards', async (c: Context) => {
  try {
    const category = c.req.query('category')
    let rewards = [...SAMPLE_REWARDS]

    if (category) {
      rewards = rewards.filter(r => r.category === category)
    }

    return c.json({
      success: true,
      rewards,
      categories: ['content', 'wellness', 'coaching', 'gifts', 'experiences']
    })
  } catch (error) {
    console.error('Get rewards error:', error)
    return c.json({ error: 'Failed to get rewards' }, 500)
  }
})

// POST /api/rewards/:id/redeem - Redeem reward
gamificationApi.post('/rewards/:id/redeem', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const rewardId = c.req.param('id')
    const { userId, relationshipId } = await c.req.json()

    if (!userId) {
      return c.json({ error: 'userId is required' }, 400)
    }

    const reward = SAMPLE_REWARDS.find(r => r.id === rewardId)
    if (!reward) {
      return c.json({ error: 'Reward not found' }, 404)
    }

    // In production:
    // 1. Check user's point balance
    // 2. Deduct points
    // 3. Grant reward access
    // 4. Create redemption record

    const redemptionId = generateId()
    const now = getCurrentDateTime()

    return c.json({
      success: true,
      message: 'Reward redeemed successfully',
      redemptionId,
      reward: {
        id: reward.id,
        name: reward.name
      },
      pointsDeducted: reward.pointsCost,
      redeemedAt: now
    })
  } catch (error) {
    console.error('Redeem reward error:', error)
    return c.json({ error: 'Failed to redeem reward' }, 500)
  }
})

// GET /api/badges - Get badges
gamificationApi.get('/badges', async (c: Context) => {
  try {
    const userId = c.req.query('userId')

    // In production, query earned badges for the user
    const earnedBadges = [
      {
        ...SAMPLE_BADGES[0],
        earnedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]

    return c.json({
      success: true,
      allBadges: SAMPLE_BADGES,
      earnedBadges: userId ? earnedBadges : [],
      progress: {
        totalBadges: SAMPLE_BADGES.length,
        earnedCount: earnedBadges.length,
        percentComplete: Math.round((earnedBadges.length / SAMPLE_BADGES.length) * 100)
      }
    })
  } catch (error) {
    console.error('Get badges error:', error)
    return c.json({ error: 'Failed to get badges' }, 500)
  }
})

// GET /api/achievements - Get achievements
gamificationApi.get('/achievements', async (c: Context) => {
  try {
    const userId = c.req.query('userId')

    return c.json({
      success: true,
      achievements: SAMPLE_ACHIEVEMENTS,
      summary: {
        totalAchievements: SAMPLE_ACHIEVEMENTS.length,
        completed: SAMPLE_ACHIEVEMENTS.filter(a => a.completed).length,
        inProgress: SAMPLE_ACHIEVEMENTS.filter(a => !a.completed).length,
        totalPointsEarned: SAMPLE_ACHIEVEMENTS
          .filter(a => a.completed)
          .reduce((sum, a) => sum + a.points, 0)
      }
    })
  } catch (error) {
    console.error('Get achievements error:', error)
    return c.json({ error: 'Failed to get achievements' }, 500)
  }
})

// GET /api/points - Get user points
gamificationApi.get('/points', async (c: Context) => {
  try {
    const userId = c.req.query('userId')

    if (!userId) {
      return c.json({ error: 'userId is required' }, 400)
    }

    // In production, query from database
    const mockPointsData = {
      userId,
      totalPoints: 1250,
      availablePoints: 750, // After redemptions
      lifetimeEarned: 1250,
      lifetimeSpent: 500,
      recentActivity: [
        {
          type: 'earned',
          amount: 50,
          reason: 'Completed daily check-in',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'earned',
          amount: 100,
          reason: 'Completed a date night',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          type: 'spent',
          amount: 200,
          reason: 'Redeemed: Custom Anniversary Card',
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
        }
      ],
      nextMilestone: {
        points: 2000,
        reward: 'Gold Member Badge',
        pointsNeeded: 750
      }
    }

    return c.json({
      success: true,
      ...mockPointsData
    })
  } catch (error) {
    console.error('Get points error:', error)
    return c.json({ error: 'Failed to get points' }, 500)
  }
})

export default gamificationApi
