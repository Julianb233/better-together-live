/**
 * Conversation History CRUD
 *
 * Manages AI coach message persistence in Supabase.
 * All functions take SupabaseClient as first param (from request context).
 */

import type { SupabaseClient } from '@supabase/supabase-js'

export interface CoachMessage {
  id?: string
  user_id: string
  relationship_id: string
  role: 'user' | 'assistant'
  content: string
  model_used: string | null
  created_at?: string
}

/**
 * Fetch the last N messages for a user+relationship pair, ordered by created_at ascending.
 */
export async function getConversationHistory(
  supabase: SupabaseClient,
  userId: string,
  relationshipId: string,
  limit: number = 20
): Promise<CoachMessage[]> {
  const { data, error } = await supabase
    .from('ai_coach_messages')
    .select('*')
    .eq('user_id', userId)
    .eq('relationship_id', relationshipId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Failed to fetch conversation history: ${error.message}`)
  }

  // Reverse to get chronological order (we fetched newest-first for limit)
  return (data ?? []).reverse()
}

/**
 * Insert one or more messages into ai_coach_messages.
 */
export async function saveMessages(
  supabase: SupabaseClient,
  messages: Array<{
    user_id: string
    relationship_id: string
    role: 'user' | 'assistant'
    content: string
    model_used: string | null
  }>
): Promise<void> {
  const { error } = await supabase
    .from('ai_coach_messages')
    .insert(messages as any)

  if (error) {
    throw new Error(`Failed to save messages: ${error.message}`)
  }
}
