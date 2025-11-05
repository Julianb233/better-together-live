// Better Together: TypeScript Type Definitions

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

// Cloudflare Environment Bindings
export interface Env {
  DB: D1Database
}

// Quiz System Types

export type QuizType = 'intake' | 'connection_compass' | 'custom'

export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'likert_scale'
  | 'ranking'
  | 'forced_choice'

export type ConnectionStyle =
  | 'verbal_appreciation'
  | 'focused_presence'
  | 'thoughtful_gestures'
  | 'supportive_partnership'
  | 'physical_connection'
  | 'growth_championing'

export interface Quiz {
  id: string
  name: string
  type: QuizType
  title: string
  description?: string
  version: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface QuizQuestion {
  id: string
  quiz_id: string
  question_number: number
  question_text: string
  question_type: QuestionType
  question_data: QuestionData
  scoring_data?: ScoringData
  is_required: boolean
  created_at: string
}

export interface QuestionData {
  subtitle?: string
  emoji?: string
  options?: QuestionOption[]
  scale_min?: number
  scale_max?: number
  scale_labels?: { min: string; max: string }
  max_selections?: number
  items_to_rank?: string[]
}

export interface QuestionOption {
  id: string
  text: string
  emoji?: string
  value?: string | number
  description?: string
}

export interface ScoringData {
  points_map?: Record<string, number | Record<ConnectionStyle, number>>
  style_weights?: Record<ConnectionStyle, number>
  calculation_method?: 'sum' | 'weighted' | 'custom'
}

export interface UserQuizResponse {
  id: string
  user_id: string
  quiz_id: string
  started_at: string
  completed_at?: string
  current_question: number
  is_completed: boolean
}

export interface QuizAnswerResponse {
  id: string
  user_quiz_response_id: string
  question_id: string
  answer_data: AnswerData
  answered_at: string
}

export interface AnswerData {
  selected_option_ids?: string[]
  selected_values?: (string | number)[]
  scale_value?: number
  ranked_items?: string[]
  text_response?: string
}

export interface QuizResult {
  id: string
  user_quiz_response_id: string
  user_id: string
  quiz_id: string
  result_data: ResultData
  primary_style?: ConnectionStyle
  secondary_style?: ConnectionStyle
  full_breakdown?: StyleBreakdown
  ai_analysis?: string
  is_visible_to_partner: boolean
  created_at: string
}

export interface ResultData {
  scores: Record<string, number>
  profile_summary: string
  recommendations: string[]
  action_steps: ActionStep[]
}

export interface StyleBreakdown {
  [key: string]: {
    percentage: number
    score: number
    description: string
  }
}

export interface ActionStep {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  category: string
}

export interface CoupleCompatibilityReport {
  id: string
  relationship_id: string
  user1_result_id: string
  user2_result_id: string
  compatibility_score?: number
  compatibility_data: CompatibilityData
  recommendations?: Recommendation[]
  created_at: string
}

export interface CompatibilityData {
  style_overlap: number
  complementary_score: number
  potential_conflicts: string[]
  strengths: string[]
  growth_areas: string[]
}

export interface Recommendation {
  type: 'activity' | 'communication' | 'challenge' | 'learning'
  title: string
  description: string
  reason: string
  priority: 'high' | 'medium' | 'low'
}

// Quiz API Request Types

export interface StartQuizRequest {
  user_id: string
  quiz_id: string
}

export interface SubmitAnswerRequest {
  user_quiz_response_id: string
  question_id: string
  answer_data: AnswerData
}

export interface CompleteQuizRequest {
  user_quiz_response_id: string
}

// Intake Quiz Specific Types

export interface IntakeQuizAnswers {
  relationship_status?: string
  connection_goals?: string[]
  current_challenge?: string
  ideal_date_vibe?: string
  energy_level?: string
  budget_comfort?: string
  planning_style?: string
  social_preference?: string
  growth_mindset?: string
  communication_check?: string
  love_expression?: string
  availability?: string[]
}

// Connection Compass Specific Types

export interface ConnectionCompassAnswers {
  forced_choices: Record<number, string>
  scenario_preferences: Record<number, string>
  likert_responses: Record<number, number>
  style_ranking: ConnectionStyle[]
  disconnection_trigger: ConnectionStyle
}