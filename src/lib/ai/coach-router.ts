/**
 * AI Coach Router -- Tiered Model Selection
 *
 * Routes questions to the appropriate AI model:
 * - Complex (relationship advice, emotional, long) -> Claude claude-haiku-4-5
 * - Simple (short, greetings, FAQ) -> OpenAI gpt-4o-mini
 *
 * Includes fallback logic: if primary model fails, tries the other provider.
 */

import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { openai } from '@ai-sdk/openai'

type Tier = 'complex' | 'simple'

interface CoachResponse {
  text: string
  tier: Tier
  model: string
}

// Keywords/phrases that indicate a complex relationship question
const COMPLEX_INDICATORS = [
  'how do i', 'help me', 'struggling', 'advice', 'what should',
  'feeling', 'partner', 'relationship', 'conflict', 'trust',
  'intimacy', 'communicate', 'jealous', 'cheating', 'divorce',
  'therapy', 'depressed', 'anxious', 'hurt', 'betrayal',
  'boundaries', 'affair', 'argue', 'fight', 'lonely',
  'resentment', 'forgive', 'neglect', 'love language',
  'emotional', 'vulnerable', 'insecure', 'attachment',
]

const STATIC_FALLBACK = "I'm having trouble connecting right now. Here's a general tip: take a moment to breathe and reflect on what you appreciate about your partner. Try again in a few minutes."

/**
 * Classify a question as complex or simple based on length and content heuristics.
 * No LLM call -- this is a free heuristic.
 */
export function classifyQuestion(message: string): Tier {
  const lower = message.toLowerCase()
  const wordCount = message.trim().split(/\s+/).length

  // Long messages are complex
  if (wordCount > 15) return 'complex'

  // Check for complex indicator phrases
  for (const indicator of COMPLEX_INDICATORS) {
    if (lower.includes(indicator)) return 'complex'
  }

  return 'simple'
}

/**
 * Get the appropriate model for a tier.
 */
export function getModel(tier: Tier) {
  if (tier === 'complex') {
    return { model: anthropic('claude-haiku-4-5'), name: 'claude-haiku-4-5' }
  }
  return { model: openai('gpt-4o-mini'), name: 'gpt-4o-mini' }
}

/**
 * Generate a coach response with tiered routing and fallback.
 *
 * 1. Classify the question
 * 2. Try primary model
 * 3. On failure, try fallback model
 * 4. On both fail, return static fallback
 */
export async function generateCoachResponse(
  message: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemPrompt: string
): Promise<CoachResponse> {
  const tier = classifyQuestion(message)
  const primary = getModel(tier)
  const fallbackTier: Tier = tier === 'complex' ? 'simple' : 'complex'
  const fallback = getModel(fallbackTier)

  const messages = [
    ...conversationHistory,
    { role: 'user' as const, content: message },
  ]

  // Try primary model
  try {
    const { text } = await generateText({
      model: primary.model,
      system: systemPrompt,
      messages,
    })
    return { text, tier, model: primary.name }
  } catch (primaryError) {
    console.warn(`AI Coach: ${primary.name} failed, falling back to ${fallback.name}`, primaryError)
  }

  // Try fallback model
  try {
    const { text } = await generateText({
      model: fallback.model,
      system: systemPrompt,
      messages,
    })
    return { text, tier: fallbackTier, model: fallback.name }
  } catch (fallbackError) {
    console.error(`AI Coach: Both ${primary.name} and ${fallback.name} failed`, fallbackError)
  }

  // Both failed -- return static fallback
  return { text: STATIC_FALLBACK, tier, model: 'static-fallback' }
}
