# Better Together Mobile App

React Native mobile application for Better Together - A relationship-strengthening app with daily check-ins, shared goals, and AI-powered coaching.

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Native Stack + Bottom Tabs)
- **State Management**: Zustand + Custom Hooks
- **API Client**: Axios
- **Storage**: AsyncStorage
- **TypeScript**: Full type safety with shared types from backend

## Project Structure

```
mobile/
├── src/
│   ├── api/            # API client and endpoints
│   │   └── client.ts   # Axios-based API client
│   ├── components/     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Card.tsx
│   ├── hooks/          # Custom React hooks
│   │   └── useAuth.ts  # Authentication hook
│   ├── navigation/     # Navigation configuration
│   │   └── AppNavigator.tsx
│   ├── screens/        # App screens
│   │   ├── LoginScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── AICoachScreen.tsx
│   │   ├── SchedulingScreen.tsx
│   │   ├── CheckinScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── ActivitiesScreen.tsx
│   │   └── ChallengesScreen.tsx
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts    # Shared types with backend
│   └── utils/          # Utility functions and constants
│       └── constants.ts
├── App.tsx             # App entry point
├── app.json            # Expo configuration
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript configuration
```

## Features Implemented

### 1. Authentication
- Simple email/name login flow
- User registration via API
- Persistent authentication with AsyncStorage
- `useAuth()` hook for auth state management

### 2. Navigation
- Bottom tab navigation for main screens
- Stack navigation for detail views
- Conditional routing based on auth state
- Tab icons (placeholder emoji, ready for icon library)

### 3. Core Screens

#### Login Screen
- Email and name input validation
- Integration with backend user creation API
- Form validation with error messages

#### Dashboard Screen
- Relationship overview with stats
- Active goals with progress bars
- Upcoming important dates
- Recent activities
- Pull-to-refresh functionality
- Health score visualization

#### AI Coach Screen
- Chat interface for AI relationship coaching
- Suggested conversation starters
- Message history
- Ready for AI API integration

#### Scheduling Screen
- Planned activities list
- Important dates calendar
- AI-powered activity suggestions
- Quick add buttons for new items

#### Daily Check-in Screen
- Connection, mood, and satisfaction score selectors
- Gratitude note input
- Support needs input
- Highlight of day capture
- Integration with backend check-in API

#### Profile Screen
- User information display
- Preferences management
- Account settings
- Logout functionality

### 4. API Integration
- Complete API client with all backend endpoints
- Type-safe request/response handling
- Error handling with user-friendly messages
- Automatic auth header injection
- AsyncStorage for token/user persistence

### 5. UI Components
- **Button**: Primary, secondary, outline variants
- **Input**: With label, error states, multiline support
- **Card**: Elevated container with shadow
- Consistent design system with theme constants

### 6. Type Safety
- Shared types between mobile and backend
- Full TypeScript coverage
- Type-safe API responses
- Intellisense support throughout

## API Endpoints Used

The mobile app connects to the following backend endpoints:

**User Management**
- `POST /api/users` - Create user account
- `GET /api/users/:userId` - Get user profile
- `PUT /api/users/:userId` - Update user profile

**Relationships**
- `POST /api/invite-partner` - Invite relationship partner
- `GET /api/relationships/:userId` - Get user's relationship

**Check-ins**
- `POST /api/checkins` - Create daily check-in
- `GET /api/checkins/:relationshipId` - Get check-in history

**Goals**
- `POST /api/goals` - Create shared goal
- `GET /api/goals/:relationshipId` - Get relationship goals
- `PUT /api/goals/:goalId/progress` - Update goal progress

**Activities**
- `POST /api/activities` - Create activity
- `GET /api/activities/:relationshipId` - Get activities
- `PUT /api/activities/:activityId/complete` - Mark activity complete

**Important Dates**
- `POST /api/important-dates` - Add important date
- `GET /api/important-dates/:relationshipId` - Get dates

**Challenges**
- `GET /api/challenges` - Get available challenges
- `POST /api/challenges/:challengeId/start` - Start challenge
- `GET /api/challenges/participation/:relationshipId` - Get active challenges

**Dashboard**
- `GET /api/dashboard/:userId` - Get full dashboard data

**Analytics**
- `GET /api/analytics/:relationshipId` - Get relationship analytics

**Notifications**
- `GET /api/notifications/:userId` - Get notifications
- `PUT /api/notifications/:notificationId/read` - Mark notification read

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator

### Installation

```bash
cd mobile
npm install
```

### Environment Setup

Create a `.env` file:
```bash
cp .env.example .env
```

For local development, set:
```
API_BASE_URL=http://localhost:3000/api
```

For production:
```
API_BASE_URL=https://better-together.live/api
```

### Running the App

```bash
# Start Expo dev server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run in web browser
npm run web
```

### Development

```bash
# Type check
npm run type-check

# Lint code
npm run lint
```

## Next Steps (Ready for Task T5)

The mobile foundation is now complete and ready for:

1. **Push Notifications Integration** (Task T5)
   - Expo Notifications setup
   - FCM/APNs configuration
   - Notification permissions handling
   - Deep linking from notifications
   - Backend integration for sending notifications

2. **Additional Features**
   - Complete AI Coach integration with backend AI API
   - Rich activity creation forms
   - Photo upload for memories
   - Challenge browsing and participation
   - Achievement notifications
   - Partner invitation flow
   - Relationship onboarding wizard

3. **Enhanced UI**
   - Replace emoji icons with proper icon library (Expo Vector Icons)
   - Add animations with Reanimated
   - Implement skeleton loaders
   - Add image pickers and camera integration
   - Create custom charts for analytics

4. **Testing**
   - Unit tests with Jest
   - Component tests with React Native Testing Library
   - E2E tests with Detox

5. **Performance**
   - Optimize bundle size
   - Implement image optimization
   - Add offline support with local caching
   - Background fetch for updates

## Architecture Notes

### State Management
- Authentication state managed with `useAuth()` hook + AsyncStorage
- API responses stored in component state
- Ready to add Zustand stores for global state if needed

### Navigation Flow
```
App
├── Login (if not authenticated)
└── MainTabs (if authenticated)
    ├── Dashboard
    ├── Check-in
    ├── Activities
    ├── AI Coach
    └── Profile
```

### API Client Design
- Centralized API client with automatic error handling
- Request interceptor adds auth headers
- Response interceptor transforms errors
- Type-safe responses using shared types
- AsyncStorage integration for persistence

## Backend Coordination

This mobile app is designed to work seamlessly with the existing Hono backend:
- **API Base**: `/api/*` routes
- **Database**: D1 (same as web app)
- **Types**: Shared type definitions from `src/types.ts`
- **Auth**: User ID based (ready for JWT/session tokens)

## Contributing

Key files to modify for new features:
- **New screen**: Add to `src/screens/` and update `AppNavigator.tsx`
- **New API endpoint**: Add method to `src/api/client.ts`
- **New type**: Add to `src/types/index.ts` (and sync with backend)
- **New component**: Add to `src/components/`

## License

Part of the Better Together project.
