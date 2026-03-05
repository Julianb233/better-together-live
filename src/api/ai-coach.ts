// AI Coach API endpoints -- Tiered routing via coach-router
import { Hono } from 'hono'
import { z } from 'zod'
import { requireAuth } from '../lib/supabase/middleware'
import { COACH_SYSTEM_PROMPT } from '../lib/ai/prompts'
import { getConversationHistory, saveMessages } from '../lib/ai/conversation'
import { generateCoachResponse } from '../lib/ai/coach-router'
import { aiCoachRateLimit } from '../lib/ai/rate-limiter'
import { getCachedResponse, cacheResponse } from '../lib/ai/response-cache'

const aiCoachApi = new Hono()

// Apply auth middleware to all routes, rate limiting to /ask
aiCoachApi.use('/*', requireAuth())
aiCoachApi.use('/ask', aiCoachRateLimit(20, 60 * 60 * 1000)) // 20 requests per hour

// Request validation schema
const askCoachSchema = z.object({
  message: z.string().min(1).max(2000),
  relationship_id: z.string().uuid(),
})

// POST /api/ai-coach/ask - Ask the AI coach a question
aiCoachApi.post('/ask', async (c) => {
  try {
    const body = await c.req.json()
    const validated = askCoachSchema.parse(body)

    const userId = c.get('userId') as string
    const supabase = c.get('supabase')
    const { message, relationship_id } = validated

    // Check cache first -- skip LLM call for repeated identical questions
    const cached = getCachedResponse(message)
    if (cached) {
      // Still save the user message to history for completeness
      await saveMessages(supabase, [
        { user_id: userId, relationship_id, role: 'user', content: message, model_used: null },
      ])
      return c.json({
        response: cached.response,
        tier: cached.tier,
        model: cached.model,
        cached: true,
        timestamp: new Date().toISOString(),
      })
    }

    // Load conversation history for context
    const history = await getConversationHistory(supabase, userId, relationship_id)

    // Route to appropriate model (Claude for complex, OpenAI for simple) with fallback
    const { text, tier, model } = await generateCoachResponse(
      message,
      history.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      COACH_SYSTEM_PROMPT
    )

    // Cache the response for future identical questions
    cacheResponse(message, text, tier, model)

    // Save both user and assistant messages to database
    await saveMessages(supabase, [
      {
        user_id: userId,
        relationship_id,
        role: 'user',
        content: message,
        model_used: null,
      },
      {
        user_id: userId,
        relationship_id,
        role: 'assistant',
        content: text,
        model_used: model,
      },
    ])

    return c.json({
      response: text,
      tier,
      model,
      cached: false,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid request data', details: error.errors }, 400)
    }
    console.error('AI Coach error:', error)
    return c.json(
      { error: "I'm having trouble responding right now. Please try again in a moment." },
      500
    )
  }
})

// GET /api/ai-coach/history/:relationship_id - Get chat history
aiCoachApi.get('/history/:relationship_id', async (c) => {
  try {
    const userId = c.get('userId') as string
    const supabase = c.get('supabase')
    const relationshipId = c.req.param('relationship_id')

    const messages = await getConversationHistory(supabase, userId, relationshipId, 50)

    return c.json({ messages })
  } catch (error) {
    console.error('AI Coach history error:', error)
    return c.json({ error: 'Failed to load conversation history' }, 500)
  }
})

export default aiCoachApi
