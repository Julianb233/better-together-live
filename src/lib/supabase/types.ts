/**
 * Database Types for Supabase
 *
 * Generated from the Supabase schema.
 * Update this file when schema changes.
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          password_hash: string | null
          name: string
          date_of_birth: string | null
          primary_love_language: string | null
          secondary_love_language: string | null
          personality_type: string | null
          photo_url: string | null
          preferences: Json
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password_hash?: string | null
          name: string
          date_of_birth?: string | null
          primary_love_language?: string | null
          secondary_love_language?: string | null
          personality_type?: string | null
          photo_url?: string | null
          preferences?: Json
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password_hash?: string | null
          name?: string
          date_of_birth?: string | null
          primary_love_language?: string | null
          secondary_love_language?: string | null
          personality_type?: string | null
          photo_url?: string | null
          preferences?: Json
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      relationships: {
        Row: {
          id: string
          user1_id: string
          user2_id: string
          relationship_type: string
          start_date: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user1_id: string
          user2_id: string
          relationship_type?: string
          start_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user1_id?: string
          user2_id?: string
          relationship_type?: string
          start_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      important_dates: {
        Row: {
          id: string
          relationship_id: string
          name: string
          date: string
          recurrence: string
          reminder_days_before: number
          created_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          name: string
          date: string
          recurrence?: string
          reminder_days_before?: number
          created_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          name?: string
          date?: string
          recurrence?: string
          reminder_days_before?: number
          created_at?: string
        }
      }
      daily_checkins: {
        Row: {
          id: string
          relationship_id: string
          user_id: string
          checkin_date: string
          mood: string | null
          connection_score: number | null
          satisfaction: number | null
          gratitude: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          user_id: string
          checkin_date?: string
          mood?: string | null
          connection_score?: number | null
          satisfaction?: number | null
          gratitude?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          user_id?: string
          checkin_date?: string
          mood?: string | null
          connection_score?: number | null
          satisfaction?: number | null
          gratitude?: string | null
          notes?: string | null
          created_at?: string
        }
      }
      shared_goals: {
        Row: {
          id: string
          relationship_id: string
          title: string
          description: string | null
          goal_type: string
          target_date: string | null
          progress_percentage: number
          status: string
          completed_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          title: string
          description?: string | null
          goal_type?: string
          target_date?: string | null
          progress_percentage?: number
          status?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          title?: string
          description?: string | null
          goal_type?: string
          target_date?: string | null
          progress_percentage?: number
          status?: string
          completed_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          relationship_id: string
          title: string
          description: string | null
          activity_type: string | null
          date: string | null
          location: string | null
          cost: number | null
          satisfaction_rating: number | null
          photos: string[] | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          relationship_id: string
          title: string
          description?: string | null
          activity_type?: string | null
          date?: string | null
          location?: string | null
          cost?: number | null
          satisfaction_rating?: number | null
          photos?: string[] | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          relationship_id?: string
          title?: string
          description?: string | null
          activity_type?: string | null
          date?: string | null
          location?: string | null
          cost?: number | null
          satisfaction_rating?: number | null
          photos?: string[] | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string | null
          plan_type: string
          status: string
          current_period_start: string | null
          current_period_end: string | null
          cancel_at_period_end: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id?: string | null
          plan_type?: string
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string | null
          plan_type?: string
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at_period_end?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string
          title: string
          message: string
          data: Json | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type: string
          title: string
          message: string
          data?: Json | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string
          title?: string
          message?: string
          data?: Json | null
          read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

// Helper types for common use cases
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience type aliases
export type User = Tables<'users'>
export type Relationship = Tables<'relationships'>
export type ImportantDate = Tables<'important_dates'>
export type DailyCheckin = Tables<'daily_checkins'>
export type SharedGoal = Tables<'shared_goals'>
export type Activity = Tables<'activities'>
export type Subscription = Tables<'subscriptions'>
export type Notification = Tables<'notifications'>
