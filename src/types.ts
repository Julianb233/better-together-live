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

// Payment & Subscription Types
export interface SubscriptionPlan {
  id: string
  plan_name: string
  plan_type: 'try_it_out' | 'better_together' | 'premium_plus' | 'custom'
  billing_period: 'monthly' | 'annual'
  price_cents: number
  price_display: string
  currency: string
  stripe_price_id?: string
  stripe_product_id?: string
  features?: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  relationship_id: string
  plan_id: string
  user_id: string
  stripe_customer_id?: string
  stripe_subscription_id?: string
  status: 'active' | 'past_due' | 'canceled' | 'trialing' | 'paused' | 'incomplete'
  billing_period: 'monthly' | 'annual'
  price_cents: number
  currency: string
  trial_end_date?: string
  current_period_start: string
  current_period_end: string
  canceled_at?: string
  cancel_reason?: string
  is_gift: boolean
  gift_from_user_id?: string
  gift_message?: string
  created_at: string
  updated_at: string
}

export interface PaymentTransaction {
  id: string
  subscription_id?: string
  user_id: string
  relationship_id?: string
  stripe_payment_intent_id?: string
  stripe_charge_id?: string
  transaction_type: 'subscription' | 'credits' | 'add_on' | 'gift' | 'box' | 'coaching' | 'refund'
  amount_cents: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed' | 'refunded' | 'canceled'
  payment_method?: 'card' | 'bank_account' | 'apple_pay' | 'google_pay'
  description?: string
  metadata?: string
  failure_reason?: string
  refund_amount_cents?: number
  refunded_at?: string
  processed_at?: string
  created_at: string
}

export interface AICredit {
  id: string
  relationship_id: string
  user_id: string
  transaction_type: 'purchase' | 'grant' | 'usage' | 'expiration' | 'refund'
  credits_amount: number
  credits_balance: number
  purchase_price_cents?: number
  usage_description?: string
  stripe_payment_id?: string
  expires_at?: string
  created_at: string
}

export interface SubscriptionAddon {
  id: string
  addon_name: string
  addon_type: 'surprise_box' | 'coaching' | 'calendar_features' | 'analytics' | 'customization' | 'content'
  description?: string
  price_cents: number
  billing_period?: 'one_time' | 'monthly' | 'annual'
  stripe_price_id?: string
  stripe_product_id?: string
  is_active: boolean
  features?: string
  created_at: string
  updated_at: string
}

export interface DiscountCode {
  id: string
  code: string
  discount_type: 'percentage' | 'fixed_amount' | 'trial_extension'
  discount_value: number
  applies_to?: 'all' | 'subscription' | 'credits' | 'addons'
  max_uses?: number
  current_uses: number
  valid_from: string
  valid_until: string
  stripe_coupon_id?: string
  is_active: boolean
  created_by?: string
  created_at: string
}

// Analytics Types
export interface AnalyticsEvent {
  id: string
  event_name: string
  event_category: 'user_action' | 'feature_usage' | 'conversion' | 'engagement' | 'system' | 'error' | 'payment' | 'partner'
  user_id?: string
  relationship_id?: string
  session_id?: string
  event_data?: string
  page_url?: string
  referrer_url?: string
  device_type?: 'desktop' | 'mobile' | 'tablet' | 'unknown'
  browser?: string
  os?: string
  ip_address?: string
  user_agent?: string
  created_at: string
}

export interface PageView {
  id: string
  user_id?: string
  relationship_id?: string
  session_id: string
  page_path: string
  page_title?: string
  referrer?: string
  duration_seconds?: number
  bounce: boolean
  device_type?: string
  created_at: string
}

export interface UserSession {
  id: string
  user_id?: string
  relationship_id?: string
  session_start: string
  session_end?: string
  duration_seconds?: number
  pages_viewed: number
  events_count: number
  device_type?: string
  browser?: string
  os?: string
  ip_address?: string
  entry_page?: string
  exit_page?: string
  converted: boolean
  conversion_value_cents?: number
}

export interface FeatureUsageMetrics {
  id: string
  feature_name: string
  metric_date: string
  total_users: number
  new_users: number
  active_users: number
  total_interactions: number
  average_time_spent_seconds?: number
  completion_rate?: number
  satisfaction_score?: number
  created_at: string
}

export interface RevenueAnalytics {
  id: string
  analytics_date: string
  subscription_revenue_cents: number
  credits_revenue_cents: number
  addons_revenue_cents: number
  gift_revenue_cents: number
  total_revenue_cents: number
  new_subscriptions: number
  canceled_subscriptions: number
  refunds_cents: number
  mrr_cents: number
  arr_cents: number
  created_at: string
}

export interface EngagementScore {
  id: string
  user_id: string
  relationship_id: string
  score_date: string
  engagement_score: number
  checkin_completed: boolean
  activities_logged: number
  messages_sent: number
  features_used: number
  session_duration_seconds: number
  created_at: string
}

// API Request Types for Payments
export interface CreateSubscriptionRequest {
  relationship_id: string
  user_id: string
  plan_id: string
  payment_method_id: string
  is_gift?: boolean
  gift_message?: string
  discount_code?: string
}

export interface PurchaseCreditsRequest {
  relationship_id: string
  user_id: string
  credits_amount: number
  payment_method_id: string
}

export interface CreateCheckoutSessionRequest {
  relationship_id: string
  user_id: string
  items: {
    type: 'subscription' | 'credits' | 'addon'
    id: string
    quantity?: number
  }[]
  success_url: string
  cancel_url: string
  discount_code?: string
}

// API Request Types for Analytics
export interface TrackEventRequest {
  event_name: string
  event_category: string
  user_id?: string
  relationship_id?: string
  event_data?: Record<string, any>
}

// Environment Variables
export interface Env {
  DATABASE_URL: string
  STRIPE_SECRET_KEY: string
  STRIPE_WEBHOOK_SECRET: string
  STRIPE_PUBLISHABLE_KEY: string
  RESEND_API_KEY?: string
}