# Better Together - Entity Relationship Diagram

## Core Relationships Schema

```mermaid
erDiagram
    users ||--o{ relationships : "has"
    users ||--o{ subscriptions : "purchases"
    users ||--o{ payment_transactions : "makes"
    users ||--o{ daily_checkins : "completes"
    users ||--o{ ai_credits : "owns"
    users ||--o{ analytics_events : "generates"

    relationships ||--o{ daily_checkins : "tracks"
    relationships ||--o{ activities : "contains"
    relationships ||--o{ shared_goals : "pursues"
    relationships ||--o{ important_dates : "celebrates"
    relationships ||--o{ subscriptions : "shared_by"
    relationships ||--o{ relationship_analytics : "measured_by"

    subscription_plans ||--o{ subscriptions : "defines"
    subscriptions ||--o{ payment_transactions : "generates"

    users {
        text id PK
        text email UK
        text name
        text nickname
        text profile_photo_url
        text phone_number
        text timezone
        text love_language_primary
        text love_language_secondary
        text relationship_preferences
        datetime created_at
        datetime updated_at
        datetime last_active_at
    }

    relationships {
        text id PK
        text user_1_id FK
        text user_2_id FK
        text relationship_type
        date start_date
        date anniversary_date
        text status
        text privacy_level
        datetime created_at
        datetime updated_at
    }

    subscription_plans {
        text id PK
        text plan_name
        text plan_type
        text billing_period
        integer price_cents
        text price_display
        text stripe_price_id UK
        boolean is_active
        integer sort_order
    }

    subscriptions {
        text id PK
        text relationship_id FK
        text plan_id FK
        text user_id FK
        text stripe_customer_id
        text stripe_subscription_id UK
        text status
        text billing_period
        integer price_cents
        datetime current_period_start
        datetime current_period_end
        boolean is_gift
        text gift_from_user_id FK
    }

    payment_transactions {
        text id PK
        text subscription_id FK
        text user_id FK
        text relationship_id FK
        text stripe_payment_intent_id UK
        text transaction_type
        integer amount_cents
        text status
        text payment_method
        datetime created_at
    }

    daily_checkins {
        text id PK
        text relationship_id FK
        text user_id FK
        date checkin_date
        integer connection_score
        integer mood_score
        integer relationship_satisfaction
        text gratitude_note
        datetime created_at
    }

    activities {
        text id PK
        text relationship_id FK
        text activity_name
        text activity_type
        datetime planned_date
        datetime completed_date
        integer duration_minutes
        integer satisfaction_rating_user1
        integer satisfaction_rating_user2
        text status
    }

    shared_goals {
        text id PK
        text relationship_id FK
        text goal_name
        text goal_type
        integer target_count
        integer current_progress
        text status
        date start_date
        date target_date
    }
```

---

## Analytics & Events Schema

```mermaid
erDiagram
    users ||--o{ analytics_events : "generates"
    users ||--o{ user_sessions : "creates"
    users ||--o{ page_views : "visits"
    users ||--o{ engagement_scores : "measured_by"

    relationships ||--o{ analytics_events : "associated_with"
    relationships ||--o{ engagement_scores : "tracked_for"

    user_sessions ||--o{ analytics_events : "contains"
    user_sessions ||--o{ page_views : "includes"

    analytics_events {
        text id PK
        text event_name
        text event_category
        text user_id FK
        text relationship_id FK
        text session_id FK
        text event_data
        text page_url
        text device_type
        datetime created_at
    }

    user_sessions {
        text id PK
        text user_id FK
        text relationship_id FK
        datetime session_start
        datetime session_end
        integer duration_seconds
        integer pages_viewed
        integer events_count
        text device_type
        boolean converted
    }

    page_views {
        text id PK
        text user_id FK
        text relationship_id FK
        text session_id FK
        text page_path
        integer duration_seconds
        boolean bounce
        datetime created_at
    }

    engagement_scores {
        text id PK
        text user_id FK
        text relationship_id FK
        date score_date
        integer engagement_score
        boolean checkin_completed
        integer activities_logged
        integer features_used
    }

    feature_usage_metrics {
        text id PK
        text feature_name
        date metric_date
        integer total_users
        integer active_users
        integer total_interactions
        decimal average_time_spent_seconds
        decimal completion_rate
    }

    revenue_analytics {
        text id PK
        date analytics_date UK
        integer subscription_revenue_cents
        integer credits_revenue_cents
        integer total_revenue_cents
        integer new_subscriptions
        integer canceled_subscriptions
        integer mrr_cents
        integer arr_cents
    }
```

---

## Payment System Schema

```mermaid
erDiagram
    subscriptions ||--o{ payment_transactions : "generates"
    subscription_plans ||--o{ subscriptions : "used_by"
    ai_credits }o--|| payment_transactions : "purchased_via"
    discount_codes ||--o{ discount_usage : "redeemed_as"
    users ||--o{ discount_usage : "redeems"

    subscription_plans {
        text id PK
        text plan_name
        text plan_type
        text billing_period
        integer price_cents
        text stripe_price_id UK
    }

    subscriptions {
        text id PK
        text user_id FK
        text plan_id FK
        text stripe_subscription_id UK
        text status
        datetime current_period_end
        boolean is_gift
    }

    payment_transactions {
        text id PK
        text user_id FK
        text subscription_id FK
        text stripe_payment_intent_id UK
        text transaction_type
        integer amount_cents
        text status
    }

    ai_credits {
        text id PK
        text user_id FK
        text relationship_id FK
        text transaction_type
        integer credits_amount
        integer credits_balance
        text stripe_payment_id FK
    }

    subscription_addons {
        text id PK
        text addon_name
        text addon_type
        integer price_cents
        text stripe_price_id UK
    }

    user_addons {
        text id PK
        text user_id FK
        text addon_id FK
        text stripe_subscription_id
        text status
        datetime purchase_date
    }

    discount_codes {
        text id PK
        text code UK
        text discount_type
        integer discount_value
        integer max_uses
        integer current_uses
        datetime valid_until
    }

    discount_usage {
        text id PK
        text discount_id FK
        text user_id FK
        integer discount_amount_cents
        datetime used_at
    }

    stripe_webhooks {
        text id PK
        text event_id UK
        text event_type
        text event_data
        boolean processed
        integer retry_count
    }
```

---

## Gamification & Content Schema

```mermaid
erDiagram
    relationships ||--o{ challenge_participation : "participates_in"
    challenges ||--o{ challenge_participation : "instances"
    challenge_participation ||--o{ challenge_entries : "contains"
    users ||--o{ challenge_entries : "submits"

    relationships ||--o{ user_achievements : "earns"
    achievements ||--o{ user_achievements : "awarded_as"

    users ||--o{ notifications : "receives"
    relationships ||--o{ notifications : "sent_to"

    challenges {
        text id PK
        text challenge_name
        text challenge_type
        text difficulty_level
        text category
        text instructions
        boolean is_template
    }

    challenge_participation {
        text id PK
        text relationship_id FK
        text challenge_id FK
        date start_date
        date target_end_date
        text status
        integer progress_percentage
    }

    challenge_entries {
        text id PK
        text participation_id FK
        text user_id FK
        date entry_date
        text entry_content
        boolean completion_status
    }

    achievements {
        text id PK
        text achievement_name
        text achievement_type
        text category
        integer point_value
        boolean is_active
    }

    user_achievements {
        text id PK
        text relationship_id FK
        text achievement_id FK
        text earned_by_user_id FK
        datetime earned_date
    }

    notifications {
        text id PK
        text user_id FK
        text relationship_id FK
        text notification_type
        text title
        text message
        boolean is_read
        text priority
        datetime created_at
    }

    important_dates {
        text id PK
        text relationship_id FK
        date date_value
        text event_name
        text event_type
        boolean is_recurring
        integer reminder_days_before
    }
```

---

## Communication & Activity Schema

```mermaid
erDiagram
    relationships ||--o{ communication_log : "tracks"
    users ||--o{ communication_log : "initiates"

    relationships ||--o{ activities : "plans"
    users ||--o{ activities : "creates"

    relationships ||--o{ relationship_analytics : "summarized_as"

    communication_log {
        text id PK
        text relationship_id FK
        text communication_type
        text topic
        text outcome
        integer duration_minutes
        text initiated_by_user_id FK
        datetime communication_date
        boolean follow_up_needed
    }

    activities {
        text id PK
        text relationship_id FK
        text activity_name
        text activity_type
        datetime planned_date
        datetime completed_date
        integer duration_minutes
        decimal cost_amount
        integer satisfaction_rating_user1
        integer satisfaction_rating_user2
        text status
    }

    relationship_analytics {
        text id PK
        text relationship_id FK
        date analytics_date
        integer days_together
        decimal average_connection_score
        decimal average_satisfaction_score
        integer checkin_streak
        integer activities_completed_this_month
        decimal overall_health_score
    }
```

---

## Index Strategy Overview

### High-Performance Indexes

**User Lookups**:
- `idx_users_email` (unique) - Fast authentication
- Primary key on `id`

**Relationship Queries**:
- `idx_relationships_users` - Find relationships by user
- `idx_relationships_status` - Active relationship filtering

**Subscription Operations**:
- `idx_subscriptions_user` - User's subscription lookup
- `idx_subscriptions_status` - Active subscription queries
- `idx_subscriptions_stripe_customer` - Stripe integration
- `idx_subscriptions_period_end` - Expiration checking

**Payment Transactions**:
- `idx_payment_transactions_user` - User payment history
- `idx_payment_transactions_subscription` - Subscription payments
- `idx_payment_transactions_status` - Successful payments
- `idx_payment_transactions_created` - Time-based queries

**Analytics Events**:
- `idx_analytics_events_user` - User activity tracking
- `idx_analytics_events_category` - Event type filtering
- `idx_analytics_events_session` - Session reconstruction
- `idx_analytics_events_created` - Time-range queries

**Engagement Tracking**:
- `idx_engagement_scores_user` - User engagement history
- `idx_engagement_scores_date` - Daily engagement queries

---

## Key Relationships Summary

### Core Platform
- **Users ↔ Relationships**: Many-to-many (user can have multiple relationships)
- **Relationships ↔ Activities**: One-to-many (shared experiences)
- **Relationships ↔ Goals**: One-to-many (shared objectives)
- **Relationships ↔ Check-ins**: One-to-many (wellness tracking)

### Payment System
- **Users ↔ Subscriptions**: One-to-many (can gift multiple)
- **Plans ↔ Subscriptions**: One-to-many (plan instances)
- **Subscriptions ↔ Transactions**: One-to-many (billing history)
- **Users ↔ Credits**: One-to-many (credit transactions)

### Analytics
- **Users ↔ Events**: One-to-many (user actions)
- **Sessions ↔ Events**: One-to-many (session activity)
- **Users ↔ Engagement**: One-to-many (daily scores)

### Gamification
- **Challenges ↔ Participation**: One-to-many (challenge instances)
- **Participation ↔ Entries**: One-to-many (daily entries)
- **Achievements ↔ User Achievements**: One-to-many (earned badges)

---

## Data Flow Patterns

### User Sign-up Flow
```
1. Create user record → users
2. Send invitation → notifications
3. Create relationship → relationships
4. Track event → analytics_events
5. Create user session → user_sessions
```

### Subscription Purchase Flow
```
1. Select plan → subscription_plans
2. Create Stripe checkout → (external)
3. Receive webhook → stripe_webhooks
4. Create subscription → subscriptions
5. Create transaction → payment_transactions
6. Track conversion → analytics_events
7. Update revenue → revenue_analytics
```

### Daily Check-in Flow
```
1. Submit check-in → daily_checkins
2. Update relationship analytics → relationship_analytics
3. Calculate engagement score → engagement_scores
4. Track event → analytics_events
5. Send partner notification → notifications
```

### Analytics Aggregation Flow
```
1. Collect events → analytics_events
2. Aggregate daily → feature_usage_metrics
3. Calculate engagement → engagement_scores
4. Compute revenue → revenue_analytics
5. Update cohorts → user_cohorts
```

---

**Legend**:
- PK = Primary Key
- FK = Foreign Key
- UK = Unique Key
- `||--o{` = One-to-many relationship
- `}o--||` = Many-to-one relationship

---

**Generated**: 2025-12-17
**Schema Version**: 3 (migrations 0001-0003)
**Total Tables**: 40+
**Total Relationships**: 60+
