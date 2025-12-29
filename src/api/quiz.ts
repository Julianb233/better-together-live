// Better Together: Quiz API
// Handles compatibility quiz questions, responses, and history

import { Hono } from 'hono'
import type { Context } from 'hono'
import { createDatabase } from '../db'
import type { Env } from '../types'
import { generateId, getCurrentDateTime } from '../utils'

const quizApi = new Hono()

// Sample quiz questions (in production, these would be in the database)
const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    category: 'communication',
    question: 'How do you prefer to resolve conflicts?',
    options: [
      { id: 'a', text: 'Talk it out immediately', value: 5 },
      { id: 'b', text: 'Take time to cool down first', value: 3 },
      { id: 'c', text: 'Avoid confrontation when possible', value: 1 },
      { id: 'd', text: 'Compromise and find middle ground', value: 4 }
    ]
  },
  {
    id: 'q2',
    category: 'quality_time',
    question: 'What\'s your ideal date night?',
    options: [
      { id: 'a', text: 'Adventure and trying something new', value: 5 },
      { id: 'b', text: 'Quiet dinner at home', value: 3 },
      { id: 'c', text: 'Out with friends or social events', value: 2 },
      { id: 'd', text: 'Movie or entertainment', value: 4 }
    ]
  },
  {
    id: 'q3',
    category: 'intimacy',
    question: 'How important is physical affection to you?',
    options: [
      { id: 'a', text: 'Extremely important - I need it daily', value: 5 },
      { id: 'b', text: 'Important but not constant', value: 4 },
      { id: 'c', text: 'Nice to have occasionally', value: 2 },
      { id: 'd', text: 'Not a priority for me', value: 1 }
    ]
  },
  {
    id: 'q4',
    category: 'future_planning',
    question: 'How do you approach long-term planning?',
    options: [
      { id: 'a', text: 'I plan everything in detail', value: 5 },
      { id: 'b', text: 'I have goals but stay flexible', value: 4 },
      { id: 'c', text: 'I prefer to go with the flow', value: 2 },
      { id: 'd', text: 'I live in the moment', value: 1 }
    ]
  },
  {
    id: 'q5',
    category: 'family',
    question: 'How important is family in your life?',
    options: [
      { id: 'a', text: 'Top priority - family comes first', value: 5 },
      { id: 'b', text: 'Very important but balanced', value: 4 },
      { id: 'c', text: 'Important but not central', value: 3 },
      { id: 'd', text: 'Independent from family', value: 1 }
    ]
  }
]

// GET /api/quiz/questions - Return quiz questions
quizApi.get('/questions', async (c: Context) => {
  try {
    return c.json({
      success: true,
      questions: QUIZ_QUESTIONS,
      totalQuestions: QUIZ_QUESTIONS.length,
      categories: ['communication', 'quality_time', 'intimacy', 'future_planning', 'family']
    })
  } catch (error) {
    console.error('Get quiz questions error:', error)
    return c.json({ error: 'Failed to get quiz questions' }, 500)
  }
})

// POST /api/quiz/responses - Submit single response
quizApi.post('/responses', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const { userId, questionId, answerId, answerValue } = await c.req.json()

    if (!userId || !questionId || !answerId) {
      return c.json({ error: 'userId, questionId, and answerId are required' }, 400)
    }

    const responseId = generateId()
    const now = getCurrentDateTime()

    // Store response (this would go to a quiz_responses table in production)
    // For now, we'll use a generic approach or return mock success

    return c.json({
      success: true,
      message: 'Response recorded',
      responseId,
      questionId,
      answerId,
      timestamp: now
    })
  } catch (error) {
    console.error('Submit quiz response error:', error)
    return c.json({ error: 'Failed to submit response' }, 500)
  }
})

// POST /api/quiz/responses/bulk - Submit all responses
quizApi.post('/responses/bulk', async (c: Context) => {
  try {
    const db = createDatabase(c.env as Env)
    const { userId, responses } = await c.req.json()

    if (!userId || !responses || !Array.isArray(responses)) {
      return c.json({ error: 'userId and responses array are required' }, 400)
    }

    const now = getCurrentDateTime()
    const quizSessionId = generateId()

    // Calculate scores by category
    const categoryScores: Record<string, number[]> = {}

    responses.forEach((response: any) => {
      const question = QUIZ_QUESTIONS.find(q => q.id === response.questionId)
      if (question) {
        if (!categoryScores[question.category]) {
          categoryScores[question.category] = []
        }
        categoryScores[question.category].push(response.answerValue || 0)
      }
    })

    // Calculate averages
    const results = Object.entries(categoryScores).map(([category, scores]) => ({
      category,
      averageScore: scores.reduce((a, b) => a + b, 0) / scores.length,
      totalQuestions: scores.length
    }))

    const overallScore = results.reduce((sum, r) => sum + r.averageScore, 0) / results.length

    return c.json({
      success: true,
      message: 'All responses recorded successfully',
      quizSessionId,
      completedAt: now,
      results: {
        overallScore: Math.round(overallScore * 20), // Convert to 0-100 scale
        categoryScores: results,
        totalQuestions: responses.length
      }
    })
  } catch (error) {
    console.error('Submit bulk responses error:', error)
    return c.json({ error: 'Failed to submit responses' }, 500)
  }
})

// GET /api/quiz/history/:userId - Get quiz history
quizApi.get('/history/:userId', async (c: Context) => {
  try {
    const userId = c.req.param('userId')

    // In production, this would query the database
    // For now, return mock data
    return c.json({
      success: true,
      userId,
      quizHistory: [
        {
          quizSessionId: 'session_1',
          completedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          overallScore: 78,
          categoryScores: [
            { category: 'communication', score: 85 },
            { category: 'quality_time', score: 72 },
            { category: 'intimacy', score: 80 },
            { category: 'future_planning', score: 75 },
            { category: 'family', score: 78 }
          ]
        }
      ],
      totalQuizzesTaken: 1
    })
  } catch (error) {
    console.error('Get quiz history error:', error)
    return c.json({ error: 'Failed to get quiz history' }, 500)
  }
})

export default quizApi
