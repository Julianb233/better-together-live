# Better Together Mobile - Setup & Installation Guide

## Quick Start

### 1. Install Dependencies

```bash
cd /root/github-repos/better-together-live/mobile
npm install
```

### 2. Backend Setup

Make sure the Better Together backend is running:

```bash
cd /root/github-repos/better-together-live
npm run dev:sandbox
```

The backend should be available at `http://localhost:3000`

### 3. Configure API Endpoint

For local development, the API client is already configured to use:
- Development: `http://localhost:3000/api`
- Production: `https://better-together.live/api`

The app automatically switches based on `__DEV__` flag.

### 4. Start Expo Dev Server

```bash
npm start
```

This opens the Expo dev tools. From here you can:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone

## Testing the App

### 1. Create a User Account

On the login screen:
- Enter email: `test@example.com`
- Enter name: `Test User`
- Tap "Get Started"

This creates a new user in the D1 database.

### 2. Explore Features

Once logged in, you can:
- View dashboard (requires relationship setup)
- Create daily check-in
- Browse AI Coach (mock responses currently)
- View scheduling features
- Edit profile

### 3. Set Up Relationship

To see full functionality:
1. Create a second user account
2. Use the invite partner feature (to be implemented)
3. Dashboard will populate with relationship data

## Development Workflow

### File Structure

```
mobile/
├── src/
│   ├── api/client.ts          # All API calls
│   ├── components/            # Reusable UI components
│   ├── hooks/useAuth.ts       # Authentication logic
│   ├── navigation/            # App navigation
│   ├── screens/               # All app screens
│   ├── types/index.ts         # Shared types with backend
│   └── utils/constants.ts     # Design tokens
├── App.tsx                    # Entry point
└── app.json                   # Expo config
```

### Adding a New Screen

1. Create screen file: `src/screens/MyNewScreen.tsx`
2. Add route in `src/navigation/AppNavigator.tsx`
3. Add tab or stack screen configuration

### Adding a New API Endpoint

1. Add method to `src/api/client.ts`
2. Add types to `src/types/index.ts` if needed
3. Call from screen or hook

### Styling Guidelines

Use constants from `src/utils/constants.ts`:
- Colors: `COLORS.primary`, `COLORS.background`, etc.
- Spacing: `SPACING.md`, `SPACING.lg`, etc.
- Font sizes: `FONT_SIZES.md`, `FONT_SIZES.lg`, etc.

## Troubleshooting

### "Cannot connect to API"

1. Check backend is running on port 3000
2. For iOS simulator, `localhost` should work
3. For Android emulator, use `10.0.2.2:3000` instead of `localhost:3000`
4. For physical device, use your computer's IP address

Update `src/api/client.ts`:
```typescript
const API_BASE_URL = __DEV__
  ? 'http://YOUR_COMPUTER_IP:3000/api'  // e.g., 'http://192.168.1.100:3000/api'
  : 'https://better-together.live/api'
```

### "Module not found"

Clear cache and reinstall:
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

### TypeScript Errors

Run type check:
```bash
npm run type-check
```

### Expo Issues

Reset Expo cache:
```bash
npx expo start --clear
```

## Building for Production

### iOS

```bash
npx expo build:ios
```

Requirements:
- Apple Developer account
- iOS certificates and provisioning profiles

### Android

```bash
npx expo build:android
```

Requirements:
- Google Play Console account
- Android keystore

### Expo Application Services (EAS)

Modern build system:

```bash
npm install -g eas-cli
eas build --platform ios
eas build --platform android
```

## Next Steps

1. **Integrate Push Notifications** (Task T5)
   - Install `expo-notifications`
   - Configure FCM and APNs
   - Add notification permissions
   - Handle notification taps

2. **Enhance UI**
   - Add `@expo/vector-icons`
   - Implement animations with `react-native-reanimated`
   - Add loading skeletons

3. **Add Features**
   - Photo upload with `expo-image-picker`
   - Camera integration with `expo-camera`
   - Charts with `react-native-chart-kit`
   - Calendar with `react-native-calendars`

4. **Testing**
   - Jest for unit tests
   - React Native Testing Library
   - Detox for E2E tests

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [React Native](https://reactnative.dev/)
- [TypeScript](https://www.typescriptlang.org/)
