// Better Together: Experiences API
// Handles curated date experiences, favorites, and completion tracking

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createAdminClient, type SupabaseEnv } from '../lib/supabase/server'
import { zValidator } from '@hono/zod-validator'
import { z } from 'zod'
import { zodErrorHandler } from '../lib/validation'
import { uuidParam } from '../lib/validation/schemas/common'
import { generateId, getCurrentDateTime } from '../utils'
import { checkOwnership, forbiddenResponse } from '../lib/security'

/** POST /api/experiences/:id/save - Save to favorites */
const saveExperienceSchema = z.object({
  userId: uuidParam,
  relationshipId: uuidParam.optional(),
})

/** POST /api/experiences/:id/complete - Mark completed */
const completeExperienceSchema = z.object({
  userId: uuidParam,
  relationshipId: uuidParam,
  rating: z.number().min(1).max(5).optional(),
  notes: z.string().max(1000).optional(),
  completedAt: z.string().optional(),
})

/** GET /api/experiences - query params */
const experienceFilterSchema = z.object({
  category: z.enum(['outdoor', 'indoor', 'adventure', 'relaxation']).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  cost: z.enum(['free', 'low', 'medium', 'high']).optional(),
})

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
experiencesApi.get('/', zValidator('query', experienceFilterSchema, zodErrorHandler), async (c: Context) => {
  try {
    const { category, difficulty, cost } = c.req.valid('query' as never)

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
experiencesApi.post('/:id/save', zValidator('json', saveExperienceSchema, zodErrorHandler), async (c: Context) => {
  try {
    const experienceId = c.req.param('id')
    const { userId } = c.req.valid('json' as never)

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
experiencesApi.post('/:id/complete', zValidator('json', completeExperienceSchema, zodErrorHandler), async (c: Context) => {
  try {
    const experienceId = c.req.param('id')
    const { userId, relationshipId, rating, notes, completedAt } = c.req.valid('json' as never)

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

    if (!checkOwnership(c, userId)) {
      return forbiddenResponse(c)
    }

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
