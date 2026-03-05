// AI Coach API endpoints -- Real Claude integration via Vercel AI SDK
import { Hono } from 'hono'
import { z } from 'zod'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { requireAuth } from '../lib/supabase/middleware'
import { COACH_SYSTEM_PROMPT } from '../lib/ai/prompts'
import { getConversationHistory, saveMessages } from '../lib/ai/conversation'

const aiCoachApi = new Hono()

// Apply auth middleware to all routes
aiCoachApi.use('/*', requireAuth())

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

    // Load conversation history for context
    const history = await getConversationHistory(supabase, userId, relationship_id)

    // Build messages array with history + new user message
    const messages = [
      ...history.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ]

    // Call Claude via Vercel AI SDK
    const { text } = await generateText({
      model: anthropic('claude-haiku-4-5'),
      system: COACH_SYSTEM_PROMPT,
      messages,
    })

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
        model_used: 'claude-haiku-4-5',
      },
    ])

    return c.json({
      response: text,
      tier: 'complex',
      model: 'claude-haiku-4-5',
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
