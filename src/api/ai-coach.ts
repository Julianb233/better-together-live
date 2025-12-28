// AI Coach API endpoints
import { Hono } from 'hono'
import { z } from 'zod'

const aiCoachApi = new Hono()

// Request validation schema
const askCoachSchema = z.object({
  message: z.string().min(1).max(2000),
  relationship_id: z.string().uuid(),
})

// Mock AI responses for now - will integrate with OpenAI/Anthropic later
const generateAIResponse = async (message: string, relationshipId: string): Promise<string> => {
  // TODO: Integrate with actual AI service (OpenAI, Anthropic, etc.)
  // For now, return contextual responses based on keywords

  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes('communication') || lowerMessage.includes('talk')) {
    return "Communication is the foundation of every strong relationship. Try this: Set aside 15 minutes daily for uninterrupted conversation. Use 'I feel' statements instead of 'You always/never' to express your needs without blame. What specific communication challenge are you facing?"
  }

  if (lowerMessage.includes('conflict') || lowerMessage.includes('fight') || lowerMessage.includes('argue')) {
    return "Conflicts are normal and can actually strengthen your relationship when handled well. Here's a proven technique: Take a 20-minute break when emotions run high, then come back when you're both calmer. Focus on understanding their perspective before defending your own. Would you like specific strategies for your situation?"
  }

  if (lowerMessage.includes('date') || lowerMessage.includes('romance')) {
    return "Keeping romance alive takes intentional effort! Try alternating who plans the date each week. It doesn't need to be expensive - a picnic in the park, cooking together, or stargazing can be just as meaningful. What kind of experiences do you both enjoy?"
  }

  if (lowerMessage.includes('trust') || lowerMessage.includes('honesty')) {
    return "Trust is built through consistent actions over time. Be reliable with small things - follow through on promises, be transparent about your day, share your feelings openly. Rebuild trust by being patient and acknowledging that healing takes time. How can I help you with trust in your relationship?"
  }

  if (lowerMessage.includes('love language')) {
    return "Understanding each other's love languages is transformative! The 5 love languages are: Words of Affirmation, Quality Time, Physical Touch, Acts of Service, and Receiving Gifts. Most people have a primary and secondary language. What makes YOU feel most loved?"
  }

  // Default response
  return "I'm here to help strengthen your relationship. Whether it's communication, conflict resolution, intimacy, or daily connection - I can provide personalized guidance. What specific area would you like to focus on today?"
}

// POST /api/ai-coach/ask - Ask the AI coach a question
aiCoachApi.post('/ask', async (c) => {
  try {
    const body = await c.req.json()
    const validated = askCoachSchema.parse(body)

    const response = await generateAIResponse(validated.message, validated.relationship_id)

    return c.json({
      response,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return c.json({ error: 'Invalid request data', details: error.errors }, 400)
    }
    console.error('AI Coach error:', error)
    return c.json({ error: 'Failed to get AI response' }, 500)
  }
})

// GET /api/ai-coach/history/:relationship_id - Get chat history (future feature)
aiCoachApi.get('/history/:relationship_id', async (c) => {
  const relationshipId = c.req.param('relationship_id')

  // TODO: Implement chat history storage and retrieval
  return c.json({
    messages: [],
    note: 'Chat history feature coming soon',
  })
})

export default aiCoachApi
