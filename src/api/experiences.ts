// Better Together: Experiences API
// Handles curated date experiences, favorites, and completion tracking

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import { generateId, getCurrentDateTime } from '../utils'

const experiencesApi = new Hono()

// Sample experiences (in production, these would be in a database)
const SAMPLE_EXPERIENCES = [
  {
    id: 'exp_1',
    title: 'Sunset Picnic',
    category: 'outdoor',
    description: 'Pack a basket and watch the sunset together',
    duration: 120,
    difficulty: 'easy',
    cost: 'low',
    tags: ['romantic', 'outdoor', 'food'],
    imageUrl: '/images/experiences/sunset-picnic.jpg',
    steps: [
      'Choose a scenic location with a good sunset view',
      'Pack favorite foods and drinks',
      'Bring a blanket and maybe some music',
      'Arrive 30 minutes before sunset',
      'Enjoy the moment together'
    ]
  },
  {
    id: 'exp_2',
    title: 'Cooking Challenge',
    category: 'indoor',
    description: 'Choose a new recipe and cook it together',
    duration: 90,
    difficulty: 'medium',
    cost: 'medium',
    tags: ['cooking', 'indoor', 'teamwork'],
    imageUrl: '/images/experiences/cooking.jpg',
    steps: [
      'Pick a cuisine neither of you has tried',
      'Shop for ingredients together',
      'Set up your cooking space',
      'Work as a team to follow the recipe',
      'Enjoy your creation together'
    ]
  },
  {
    id: 'exp_3',
    title: 'Stargazing Night',
    category: 'outdoor',
    description: 'Find a dark spot and explore the night sky',
    duration: 180,
    difficulty: 'easy',
    cost: 'free',
    tags: ['romantic', 'outdoor', 'nature'],
    imageUrl: '/images/experiences/stargazing.jpg',
    steps: [
      'Check weather and moon phase',
      'Download a stargazing app',
      'Find a location away from city lights',
      'Bring blankets and warm clothes',
      'Identify constellations together'
    ]
  }
]

// GET /api/experiences - List experiences
experiencesApi.get('/', async (c: Context) => {
  try {
    const category = c.req.query('category')
    const difficulty = c.req.query('difficulty')
    const cost = c.req.query('cost')

    let filteredExperiences = [...SAMPLE_EXPERIENCES]

    if (category) {
      filteredExperiences = filteredExperiences.filter(exp => exp.category === category)
    }
    if (difficulty) {
      filteredExperiences = filteredExperiences.filter(exp => exp.difficulty === difficulty)
    }
    if (cost) {
      filteredExperiences = filteredExperiences.filter(exp => exp.cost === cost)
    }

    return c.json({
      success: true,
      experiences: filteredExperiences,
      total: filteredExperiences.length,
      filters: {
        categories: ['outdoor', 'indoor', 'adventure', 'relaxation'],
        difficulties: ['easy', 'medium', 'hard'],
        costs: ['free', 'low', 'medium', 'high']
      }
    })
  } catch (error) {
    console.error('Get experiences error:', error)
    return c.json({ error: 'Failed to get experiences' }, 500)
  }
})

// GET /api/experiences/:id - Get single experience
experiencesApi.get('/:id', async (c: Context) => {
  try {
    const experienceId = c.req.param('id')
    const experience = SAMPLE_EXPERIENCES.find(exp => exp.id === experienceId)

    if (!experience) {
      return c.json({ error: 'Experience not found' }, 404)
    }

    return c.json({
      success: true,
      experience
    })
  } catch (error) {
    console.error('Get experience error:', error)
    return c.json({ error: 'Failed to get experience' }, 500)
  }
})

// POST /api/experiences/:id/save - Save to favorites
experiencesApi.post('/:id/save', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const experienceId = c.req.param('id')
    const { userId, relationshipId } = await c.req.json()

    if (!userId) {
      return c.json({ error: 'userId is required' }, 400)
    }

    const favoriteId = generateId()
    const now = getCurrentDateTime()

    // In production, save to a favorites table
    // For now, return success

    return c.json({
      success: true,
      message: 'Experience saved to favorites',
      favoriteId,
      experienceId,
      savedAt: now
    })
  } catch (error) {
    console.error('Save experience error:', error)
    return c.json({ error: 'Failed to save experience' }, 500)
  }
})

// POST /api/experiences/:id/complete - Mark completed
experiencesApi.post('/:id/complete', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const experienceId = c.req.param('id')
    const { userId, relationshipId, rating, notes, completedAt } = await c.req.json()

    if (!userId || !relationshipId) {
      return c.json({ error: 'userId and relationshipId are required' }, 400)
    }

    const completionId = generateId()
    const now = completedAt || getCurrentDateTime()

    // In production, save to a completed_experiences table
    // Could also create an activity record

    return c.json({
      success: true,
      message: 'Experience marked as completed',
      completionId,
      experienceId,
      completedAt: now,
      rating: rating || null,
      pointsEarned: 50 // Gamification points
    })
  } catch (error) {
    console.error('Complete experience error:', error)
    return c.json({ error: 'Failed to complete experience' }, 500)
  }
})

// GET /api/user/experiences - Get user's experiences
experiencesApi.get('/user/:userId', async (c: Context) => {
  try {
    const userId = c.req.param('userId')

    // In production, query saved and completed experiences
    return c.json({
      success: true,
      userId,
      saved: [
        {
          experienceId: 'exp_1',
          savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          experience: SAMPLE_EXPERIENCES[0]
        }
      ],
      completed: [
        {
          experienceId: 'exp_3',
          completedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          rating: 5,
          notes: 'Amazing night! Saw shooting stars!',
          experience: SAMPLE_EXPERIENCES[2]
        }
      ],
      stats: {
        totalSaved: 1,
        totalCompleted: 1,
        favoriteCategory: 'outdoor'
      }
    })
  } catch (error) {
    console.error('Get user experiences error:', error)
    return c.json({ error: 'Failed to get user experiences' }, 500)
  }
})

export default experiencesApi
