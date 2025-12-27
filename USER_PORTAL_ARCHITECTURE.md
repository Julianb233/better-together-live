# User Portal Architecture & Data Flow

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        User Portal Page                          │
│                     (user-portal.ts)                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  Page Load Event │
                    └──────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │  loadUserData()  │
                    └──────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   Check Token       Show Loading           Check Auth
 (Cookie/Storage)    Spinner                    │
        │                                        ▼
        │                              ┌─────────────────┐
        │                              │ GET /api/auth/me │
        │                              └─────────────────┘
        │                                        │
        │                                        ▼
        │                              ┌──────────────────────┐
        │                              │   Update Basic UI    │
        │                              │ - Name, Email        │
        │                              │ - Initials           │
        │                              │ - Greeting           │
        │                              └──────────────────────┘
        │                                        │
        └────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │   Parallel Data Loading       │
              │    (Promise.all)              │
              └───────────────────────────────┘
                              │
        ┌─────────────────────┼──────────────────────┐
        │                     │                      │
        ▼                     ▼                      ▼
   ┌─────────┐         ┌──────────┐         ┌──────────┐
   │Check-ins│         │  Goals   │         │Activities│
   └─────────┘         └──────────┘         └──────────┘
        │                     │                      │
        ▼                     ▼                      ▼
        │                     │                      │
        │                     │                      └──────┐
        │                     │                             │
        ▼                     ▼                             ▼
  ┌──────────────┐   ┌──────────────┐           ┌────────────────┐
  │GET /api/     │   │GET /api/     │           │GET /api/       │
  │checkins/{id} │   │goals/{id}    │           │activities/{id} │
  └──────────────┘   └──────────────┘           └────────────────┘
        │                     │                             │
        ▼                     ▼                             ▼
  ┌──────────────┐   ┌──────────────┐           ┌────────────────┐
  │ Update:      │   │ Update:      │           │ Update:        │
  │- Connection  │   │- Goal %      │           │- Next Date     │
  │  Score       │   │- Progress    │           │- Location      │
  │- Streak      │   │  Bar         │           │- Date Count    │
  │  Counter     │   │- Completed   │           │                │
  └──────────────┘   └──────────────┘           └────────────────┘
                              │
                              ▼
                    ┌──────────────────┐
                    │   Challenges     │
                    └──────────────────┘
                              │
                              ▼
        ┌─────────────────────┴─────────────────────┐
        │                                            │
        ▼                                            ▼
┌────────────────────┐                    ┌────────────────────┐
│GET /api/challenges/│                    │GET /api/challenges/│
│participation/{id}  │                    │participation/{id}  │
│?status=active      │                    │?status=completed   │
└────────────────────┘                    └────────────────────┘
        │                                            │
        ▼                                            ▼
┌────────────────────┐                    ┌────────────────────┐
│ Update:            │                    │ Update:            │
│- Recent Activity   │                    │- Achievements      │
│- Active Challenge  │                    │  Count             │
└────────────────────┘                    └────────────────────┘
```

## Authentication Flow

```
┌──────────────────┐
│   User Login     │
└──────────────────┘
         │
         ▼
┌──────────────────┐
│ POST /api/auth/  │
│      login       │
└──────────────────┘
         │
         ▼
┌──────────────────┐
│   Set Cookies:   │
│ - access_token   │
│ - refresh_token  │
└──────────────────┘
         │
         ▼
┌──────────────────┐
│  Store in        │
│  localStorage    │
│  (fallback)      │
└──────────────────┘
         │
         ▼
┌──────────────────┐
│ Redirect to      │
│  /user-portal    │
└──────────────────┘
         │
         ▼
┌──────────────────┐
│  getAuthToken()  │
│  - Check Cookie  │
│  - Check Storage │
└──────────────────┘
         │
         ▼
┌──────────────────┐
│  apiCall() with  │
│  credentials     │
└──────────────────┘
         │
    ┌────┴────┐
    │   200?  │
    └────┬────┘
         │ No (401)
         ▼
┌──────────────────┐
│ refreshAuthToken │
└──────────────────┘
         │
         ▼
┌──────────────────┐
│ POST /api/auth/  │
│     refresh      │
└──────────────────┘
         │
    ┌────┴────┐
    │Success? │
    └────┬────┘
         │ Yes
         ▼
┌──────────────────┐
│  Retry Original  │
│     Request      │
└──────────────────┘
```

## Component Interactions

```
┌─────────────────────────────────────────────────────────────┐
│                    Dashboard UI Elements                     │
└─────────────────────────────────────────────────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Metric Cards (4) │  │  Sidebar Info    │  │ Recent Activity  │
│                  │  │                  │  │                  │
│ • Connection     │  │ • User Name      │  │ • Check-ins      │
│   Score          │  │ • Email          │  │ • Goals          │
│ • Streak Days    │  │ • Initials       │  │ • Challenges     │
│ • Goal Progress  │  │ • Streak         │  │                  │
│ • Achievements   │  │ • Goals Count    │  │                  │
│                  │  │ • Date Nights    │  │                  │
└──────────────────┘  └──────────────────┘  └──────────────────┘
         │                     │                      │
         │                     │                      │
         └─────────────────────┼──────────────────────┘
                               │
                               ▼
                    ┌──────────────────┐
                    │  Data Binding    │
                    │  Functions       │
                    └──────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│updateBasicUser  │  │loadCheckIns     │  │updateNextDate   │
│Info()           │  │Data()           │  │Night()          │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Data Models

### User Profile (from /api/auth/me)
```javascript
{
  user: {
    id: string,
    email: string,
    name: string,
    nickname: string | null,
    profilePhotoUrl: string | null,
    timezone: string,
    primaryLoveLanguage: string | null,
    secondaryLoveLanguage: string | null
  }
}
```

### Check-ins (from /api/checkins/:relationshipId)
```javascript
{
  checkins: [
    {
      id: string,
      relationship_id: string,
      user_id: string,
      checkin_date: string,
      connection_score: number,
      mood_score: number,
      relationship_satisfaction: number,
      gratitude_note: string | null,
      created_at: string
    }
  ]
}
```

### Goals (from /api/goals/:relationshipId)
```javascript
{
  goals: [
    {
      id: string,
      relationship_id: string,
      goal_name: string,
      goal_description: string | null,
      goal_type: string,
      target_count: number | null,
      current_progress: number,
      status: 'active' | 'completed' | 'paused',
      start_date: string,
      target_date: string | null,
      created_at: string
    }
  ]
}
```

### Activities (from /api/activities/:relationshipId)
```javascript
{
  activities: [
    {
      id: string,
      relationship_id: string,
      activity_name: string,
      activity_type: string,
      description: string | null,
      location: string | null,
      planned_date: string | null,
      status: 'planned' | 'completed' | 'cancelled',
      cost_amount: number | null,
      completed_at: string | null,
      created_at: string
    }
  ]
}
```

### Challenges (from /api/challenges/participation/:relationshipId)
```javascript
{
  participations: [
    {
      id: string,
      relationship_id: string,
      challenge_id: string,
      challenge_name: string,
      challenge_description: string,
      category: string,
      difficulty_level: string,
      start_date: string,
      target_end_date: string | null,
      actual_end_date: string | null,
      status: 'active' | 'completed' | 'abandoned',
      progress_percentage: number,
      created_at: string
    }
  ]
}
```

## Error Handling Strategy

```
┌──────────────────┐
│   API Call       │
└──────────────────┘
         │
         ▼
    ┌────────┐
    │Success?│
    └────────┘
         │
    ┌────┴────┐
    │         │
   Yes       No
    │         │
    │         ▼
    │    ┌──────────┐
    │    │ 401?     │
    │    └──────────┘
    │         │
    │    ┌────┴────┐
    │    │         │
    │   Yes       No
    │    │         │
    │    ▼         ▼
    │ ┌─────┐  ┌──────┐
    │ │Retry│  │ Log  │
    │ │Auth │  │Error │
    │ └─────┘  └──────┘
    │              │
    │              ▼
    │         ┌────────┐
    │         │Continue│
    │         │Loading │
    │         │Other   │
    │         │Data    │
    │         └────────┘
    │
    ▼
┌──────────────────┐
│ Update UI        │
│ with Data        │
└──────────────────┘
```

## Performance Optimizations

1. **Parallel Loading**: Uses `Promise.all()` for concurrent API calls
2. **Incremental Updates**: Updates UI sections as data arrives
3. **Graceful Degradation**: Individual failures don't break entire dashboard
4. **Token Caching**: Reduces auth overhead with httpOnly cookies
5. **Selective Updates**: Only updates DOM elements that change

## Security Measures

1. **HttpOnly Cookies**: Prevents XSS attacks on tokens
2. **Automatic Token Refresh**: Keeps sessions alive securely
3. **Credential Mode**: Ensures cookies sent with cross-origin requests
4. **Token Fallback**: LocalStorage as backup (less secure but functional)
5. **401 Auto-Redirect**: Prevents unauthorized access

## Mobile Responsiveness

- Touch-friendly mobile menu
- Responsive grid layouts (1/2/4 columns)
- Optimized for smaller screens
- Swipe navigation support
- Mobile overlay for sidebar
