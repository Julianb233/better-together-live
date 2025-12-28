// Better Together Mobile: Shared TypeScript Types
// Synced with backend types from ../src/types.ts

export interface User {
  id: string
  email: string
  name: string
  nickname?: string
  profile_photo_url?: string
  phone_number?: string
  timezone: string
  love_language_primary?: LoveLanguage
  love_language_secondary?: LoveLanguage
  relationship_preferences?: string
  created_at: string
  updated_at: string
  last_active_at: string
}

export type LoveLanguage =
  | 'words_of_affirmation'
  | 'quality_time'
  | 'physical_touch'
  | 'acts_of_service'
  | 'receiving_gifts'

export interface Relationship {
  id: string
  user_1_id: string
  user_2_id: string
  relationship_type: 'dating' | 'engaged' | 'married' | 'partnership'
  start_date?: string
  anniversary_date?: string
  status: 'active' | 'paused' | 'ended'
  privacy_level: 'private' | 'friends' | 'public'
  created_at: string
  updated_at: string
}

export interface ImportantDate {
  id: string
  relationship_id: string
  date_value: string
  event_name: string
  event_type: 'anniversary' | 'milestone' | 'birthday' | 'holiday' | 'custom'
  description?: string
  is_recurring: boolean
  recurrence_pattern?: string
  reminder_days_before: number
  created_by_user_id: string
  created_at: string
}

export interface SharedGoal {
  id: string
  relationship_id: string
  goal_name: string
  goal_description?: string
  goal_type: 'weekly' | 'monthly' | 'milestone' | 'custom'
  target_count?: number
  current_progress: number
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  start_date?: string
  target_date?: string
  completion_date?: string
  created_by_user_id: string
  created_at: string
  updated_at: string
}

export interface DailyCheckin {
  id: string
  relationship_id: string
  user_id: string
  checkin_date: string
  connection_score?: number
  mood_score?: number
  relationship_satisfaction?: number
  gratitude_note?: string
  support_needed?: string
  highlight_of_day?: string
  created_at: string
}

export interface Activity {
  id: string
  relationship_id: string
  activity_name: string
  activity_type: 'date_night' | 'quality_time' | 'adventure' | 'relaxation' | 'learning' | 'exercise' | 'social' | 'custom'
  description?: string
  location?: string
  planned_date?: string
  completed_date?: string
  duration_minutes?: number
  cost_amount?: number
  satisfaction_rating_user1?: number
  satisfaction_rating_user2?: number
  notes?: string
  photos?: string
  status: 'planned' | 'completed' | 'cancelled'
  created_by_user_id: string
  created_at: string
  updated_at: string
}

export interface Challenge {
  id: string
  challenge_name: string
  challenge_description?: string
  challenge_type: 'daily' | 'weekly' | 'monthly' | 'milestone'
  duration_days?: number
  difficulty_level: 'beginner' | 'intermediate' | 'advanced'
  category: 'communication' | 'intimacy' | 'adventure' | 'gratitude' | 'quality_time' | 'support'
  instructions?: string
  is_template: boolean
  created_at: string
}

export interface ChallengeParticipation {
  id: string
  relationship_id: string
  challenge_id: string
  start_date: string
  target_end_date?: string
  actual_end_date?: string
  status: 'active' | 'completed' | 'paused' | 'abandoned'
  progress_percentage: number
  completion_notes?: string
  created_at: string
  updated_at: string
}

export interface Achievement {
  id: string
  achievement_name: string
  achievement_description?: string
  achievement_type: 'milestone' | 'streak' | 'completion' | 'special'
  category: 'communication' | 'activities' | 'goals' | 'challenges' | 'consistency'
  icon_url?: string
  requirements?: string
  point_value: number
  is_active: boolean
  created_at: string
}

export interface RelationshipAnalytics {
  id: string
  relationship_id: string
  analytics_date: string
  days_together?: number
  average_connection_score?: number
  average_satisfaction_score?: number
  checkin_streak?: number
  activities_completed_this_month?: number
  goals_completed_this_month?: number
  communication_frequency_score?: number
  overall_health_score?: number
  trends?: string
  created_at: string
}

// API Request/Response Types
export interface CreateUserRequest {
  email: string
  name: string
  nickname?: string
  phone_number?: string
  timezone?: string
  love_language_primary?: LoveLanguage
  love_language_secondary?: LoveLanguage
}

export interface InvitePartnerRequest {
  user_id: string
  partner_email: string
  relationship_type?: string
  start_date?: string
}

export interface CreateGoalRequest {
  relationship_id: string
  goal_name: string
  goal_description?: string
  goal_type: 'weekly' | 'monthly' | 'milestone' | 'custom'
  target_count?: number
  target_date?: string
}

export interface CheckinRequest {
  relationship_id: string
  user_id: string
  connection_score?: number
  mood_score?: number
  relationship_satisfaction?: number
  gratitude_note?: string
  support_needed?: string
  highlight_of_day?: string
}

export interface CreateActivityRequest {
  relationship_id: string
  activity_name: string
  activity_type: string
  description?: string
  location?: string
  planned_date?: string
  cost_amount?: number
}

// Dashboard Data Types
export interface DashboardData {
  relationship: Relationship & {
    partner: User
    days_together: number
  }
  recent_checkins: DailyCheckin[]
  upcoming_dates: ImportantDate[]
  active_goals: SharedGoal[]
  recent_activities: Activity[]
  current_challenges: ChallengeParticipation[]
  analytics: RelationshipAnalytics
  achievements_earned: Achievement[]
  checkin_streak: number
}

// Mobile-specific types
export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface ApiError {
  error: string
  message?: string
  statusCode?: number
}

export type ApiResponse<T> = {
  data?: T
  error?: ApiError
}

// Community Types
export type ReactionType = 'like' | 'love' | 'celebrate' | 'support' | 'insightful'
export type PostType = 'text' | 'image' | 'milestone' | 'activity_share' | 'challenge_share' | 'poll'
export type PostVisibility = 'public' | 'community' | 'connections' | 'private'
export type ConnectionType = 'follow' | 'friend' | 'close_friend'
export type ConnectionStatus = 'pending' | 'accepted' | 'declined' | 'blocked'
export type ConversationType = 'direct' | 'group' | 'community'
export type MessageType = 'text' | 'image' | 'activity_share' | 'challenge_share' | 'post_share' | 'system'

export interface Community {
  id: string
  name: string
  slug: string
  description?: string
  avatar_url?: string
  banner_url?: string
  community_type: string
  privacy: 'public' | 'private' | 'invite_only'
  member_count: number
  created_by: string
  created_at: string
  updated_at: string
}

export interface CommunityMember {
  id: string
  community_id: string
  user_id: string
  role: 'owner' | 'admin' | 'moderator' | 'member'
  joined_at: string
}

export interface Post {
  id: string
  author_id: string
  community_id?: string
  post_type: PostType
  content?: string
  media_urls?: string[]
  shared_activity_id?: string
  shared_challenge_id?: string
  visibility: PostVisibility
  like_count: number
  comment_count: number
  share_count: number
  is_pinned: boolean
  created_at: string
  updated_at: string
  deleted_at?: string
  // Joined fields
  author?: User
  community?: Community
  user_reaction?: ReactionType
}

export interface Comment {
  id: string
  post_id: string
  author_id: string
  parent_comment_id?: string
  content: string
  like_count: number
  reply_count: number
  created_at: string
  updated_at: string
  deleted_at?: string
  author?: User
}

export interface Reaction {
  id: string
  user_id: string
  target_type: 'post' | 'comment'
  target_id: string
  reaction_type: ReactionType
  created_at: string
}

export interface UserConnection {
  id: string
  follower_id: string
  following_id: string
  connection_type: ConnectionType
  status: ConnectionStatus
  created_at: string
  updated_at: string
  follower?: User
  following?: User
}

export interface Conversation {
  id: string
  type: ConversationType
  name?: string
  avatar_url?: string
  community_id?: string
  created_by: string
  last_message_at?: string
  last_message_preview?: string
  unread_count?: number
  created_at: string
  updated_at: string
  participants?: ConversationParticipant[]
}

export interface ConversationParticipant {
  id: string
  conversation_id: string
  user_id: string
  role: 'owner' | 'admin' | 'member'
  nickname?: string
  is_muted: boolean
  last_read_at?: string
  joined_at: string
  user?: User
}

export interface Message {
  id: string
  conversation_id: string
  sender_id: string
  message_type: MessageType
  content?: string
  media_url?: string
  shared_activity_id?: string
  shared_post_id?: string
  shared_challenge_id?: string
  is_edited: boolean
  edited_at?: string
  created_at: string
  deleted_at?: string
  sender?: User
}
