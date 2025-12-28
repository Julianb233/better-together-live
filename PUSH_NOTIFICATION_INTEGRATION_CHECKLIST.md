# Push Notification Integration Checklist
**Project:** Better Together Live
**Mobile App:** React Native / Expo
**Status:** Ready for Integration

## Overview

This checklist guides you through integrating push notifications into the Better Together mobile app. All backend code is complete and ready - this focuses on mobile app integration.

---

## Prerequisites

- [ ] Firebase setup complete (FCM for Android)
- [ ] APNs setup complete (APNs keys for iOS)
- [ ] Backend deployed with push notification endpoints
- [ ] Physical devices for testing (iOS and Android)

---

## Phase 1: Environment Setup

### 1.1 Install Dependencies

```bash
cd /root/github-repos/better-together-live/mobile

# Install required packages (already installed)
npx expo install expo-notifications expo-device expo-constants

# Verify installation
npm list expo-notifications expo-device expo-constants
```

**Expected versions:**
- `expo-notifications`: ^0.32.15
- `expo-device`: ^8.0.10
- `expo-constants`: Latest

**Status:** ✅ Already installed in package.json

---

### 1.2 Configure app.json

File: `/root/github-repos/better-together-live/mobile/app.json`

Verify these settings are present:

```json
{
  "expo": {
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#667eea",
      "androidMode": "default",
      "androidCollapsedTitle": "Better Together"
    },
    "ios": {
      "bundleIdentifier": "com.bettertogether.app",
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "android": {
      "package": "com.bettertogether.app",
      "googleServicesFile": "./google-services.json",
      "useNextNotificationsApi": true
    },
    "plugins": [
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#667eea"
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "better-together-mobile"
      }
    }
  }
}
```

**Status:** ✅ Already configured

---

### 1.3 Add Firebase Configuration (Android)

```bash
# Ensure google-services.json is in mobile directory
ls -la /root/github-repos/better-together-live/mobile/google-services.json
```

**Expected:** File should exist
**If missing:** Download from Firebase Console (see FIREBASE_SETUP_GUIDE.md)

---

### 1.4 Configure EAS Build (Optional but Recommended)

File: `/root/github-repos/better-together-live/mobile/eas.json`

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false
      }
    },
    "production": {
      "autoIncrement": true
    }
  }
}
```

**Status:** ✅ Already configured

---

## Phase 2: Code Integration

### 2.1 Push Notification Manager

File: `/root/github-repos/better-together-live/mobile/utils/pushNotifications.ts`

**Status:** ✅ Already implemented

**Verify the file contains:**
- `PushNotificationManager` class
- Permission handling
- Token registration
- Notification listeners
- Navigation handling

---

### 2.2 Create React Hook (Optional Enhancement)

File: `/root/github-repos/better-together-live/mobile/hooks/usePushNotifications.ts`

Create this file if it doesn't exist:

```typescript
import { useEffect, useState } from 'react';
import { pushNotificationManager, PushNotificationConfig } from '../utils/pushNotifications';

interface UsePushNotificationsConfig extends Omit<PushNotificationConfig, 'userId'> {
  userId?: string;
  enabled?: boolean;
}

export function usePushNotifications(config: UsePushNotificationsConfig) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (!config.enabled || !config.userId) return;

    const initialize = async () => {
      const success = await pushNotificationManager.initialize({
        userId: config.userId!,
        onNotificationReceived: config.onNotificationReceived,
        onNotificationTapped: config.onNotificationTapped,
      });

      setIsInitialized(success);
      setHasPermission(success);
    };

    initialize();
  }, [config.userId, config.enabled]);

  const requestPermissions = async () => {
    if (!config.userId) return false;

    const success = await pushNotificationManager.initialize({
      userId: config.userId,
      onNotificationReceived: config.onNotificationReceived,
      onNotificationTapped: config.onNotificationTapped,
    });

    setHasPermission(success);
    return success;
  };

  const clearBadge = () => pushNotificationManager.clearBadge();

  return {
    isInitialized,
    hasPermission,
    requestPermissions,
    clearBadge,
  };
}
```

**Action:** Create this file if needed for easier integration

---

### 2.3 Integrate into App Entry Point

File: `/root/github-repos/better-together-live/mobile/App.tsx` or main app file

Add push notification initialization:

```typescript
import { useEffect } from 'react';
import { pushNotificationManager } from './utils/pushNotifications';
import { useNavigation } from '@react-navigation/native';

function App() {
  const navigation = useNavigation();
  const { user } = useAuth(); // Your auth context/hook

  useEffect(() => {
    if (!user?.id) return;

    // Initialize push notifications
    pushNotificationManager.initialize({
      userId: user.id,
      onNotificationReceived: (notification) => {
        console.log('Notification received:', notification);
        // Optional: Show in-app notification UI
      },
      onNotificationTapped: (response) => {
        const data = response.notification.request.content.data;
        handleNotificationNavigation(data, navigation);
      },
    });

    // Clean up on unmount
    return () => {
      // Optionally unregister on logout
    };
  }, [user?.id]);

  return (
    // Your app components
  );
}
```

---

### 2.4 Add Navigation Handler

Create a helper function to handle notification navigation:

```typescript
function handleNotificationNavigation(data: any, navigation: any) {
  const action = data.action as string;

  switch (action) {
    case 'open_checkin':
      navigation.navigate('CheckIn');
      break;
    case 'view_checkin':
      navigation.navigate('PartnerActivity', { activityId: data.activityId });
      break;
    case 'view_achievements':
      navigation.navigate('Achievements');
      break;
    case 'view_prompt':
      navigation.navigate('DailyPrompt');
      break;
    case 'view_gifts':
      navigation.navigate('Gifts');
      break;
    case 'view_calendar':
      navigation.navigate('Calendar');
      break;
    case 'view_goals':
      navigation.navigate('Goals');
      break;
    default:
      navigation.navigate('Home');
      break;
  }
}
```

---

### 2.5 Handle Logout

Add push notification cleanup on logout:

```typescript
async function handleLogout() {
  const userId = getCurrentUserId();

  // Unregister push notifications
  await pushNotificationManager.unregister(userId);

  // Clear badge
  await pushNotificationManager.clearBadge();

  // Rest of logout logic
}
```

---

## Phase 3: Build & Test

### 3.1 Build for Development

#### iOS Development Build

```bash
cd /root/github-repos/better-together-live/mobile

# Start Expo dev server
npx expo start --ios

# Or build with EAS
eas build --platform ios --profile development
```

#### Android Development Build

```bash
cd /root/github-repos/better-together-live/mobile

# Start Expo dev server
npx expo start --android

# Or build with EAS
eas build --platform android --profile development
```

---

### 3.2 Test Permission Flow

**Test on Physical Device:**

1. Install the app
2. Open the app and log in
3. App should request notification permissions
4. Grant permissions
5. Verify token registration in console logs

**Expected Console Output:**
```
Push token registered: dt_1234567890_abc123
```

---

### 3.3 Test Notification Reception

#### Test with Backend API

```bash
# Get your device's registered token first
curl https://better-together-live.vercel.app/api/push/tokens/[USER_ID]

# Send test notification
curl -X POST https://better-together-live.vercel.app/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "[USER_ID]",
    "notification_type": "daily_prompt",
    "payload": ["What made you smile today?"]
  }'
```

**Expected Behavior:**
- Notification appears on device
- Tapping opens the app
- Console shows notification data

---

### 3.4 Test Navigation

1. Send notification with specific action
2. Tap notification on device
3. Verify app navigates to correct screen

**Test Cases:**
- `open_checkin` → CheckIn screen
- `view_gifts` → Gifts screen
- `view_achievements` → Achievements screen

---

## Phase 4: Production Preparation

### 4.1 Update API URL

File: `/root/github-repos/better-together-live/mobile/utils/pushNotifications.ts`

Update line 9:
```typescript
const API_URL = 'https://better-together-live.vercel.app'; // Production URL
```

Or use environment variable:
```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://better-together-live.vercel.app';
```

---

### 4.2 Configure Production Builds

#### iOS Production

```bash
# Build for App Store
eas build --platform ios --profile production

# Or submit directly
eas submit --platform ios
```

**Requirements:**
- Apple Developer account
- APNs production keys configured
- `APNS_PRODUCTION=true` in backend

#### Android Production

```bash
# Build for Google Play
eas build --platform android --profile production

# Or submit directly
eas submit --platform android
```

**Requirements:**
- Google Play Developer account
- FCM production keys configured
- Signing keys set up

---

### 4.3 Test on TestFlight/Internal Testing

#### iOS (TestFlight)

1. Build and upload to TestFlight
2. Add internal testers
3. Test notifications on TestFlight build
4. Verify navigation works correctly

#### Android (Internal Testing)

1. Build and upload to Google Play Console
2. Create internal testing track
3. Add testers
4. Test notifications on Play Store build

---

## Phase 5: Monitoring & Analytics

### 5.1 Add Analytics Events

Track notification interactions:

```typescript
// On notification received
analytics.track('push_notification_received', {
  notification_type: data.type,
  user_id: userId,
});

// On notification tapped
analytics.track('push_notification_tapped', {
  notification_type: data.type,
  action: data.action,
  user_id: userId,
});
```

---

### 5.2 Monitor Registration Success

Track token registration:

```typescript
analytics.track('push_token_registered', {
  platform: Platform.OS,
  user_id: userId,
  success: true,
});
```

---

### 5.3 Error Tracking

Add error tracking:

```typescript
try {
  await pushNotificationManager.initialize(config);
} catch (error) {
  console.error('Push notification init failed:', error);
  analytics.track('push_notification_error', {
    error: error.message,
    user_id: userId,
  });
}
```

---

## Troubleshooting

### Issue: Permissions not requested

**Solution:**
- Verify `Device.isDevice` returns true (must be physical device)
- Check `expo-notifications` is installed
- Ensure app has notification capabilities in `app.json`

### Issue: Token registration fails

**Solution:**
- Check API URL is correct
- Verify backend is deployed and accessible
- Check network connectivity
- Review backend logs for errors

### Issue: Notifications not appearing

**Solution:**
- Verify token is registered: `GET /api/push/tokens/:userId`
- Check backend has FCM/APNs keys configured
- Ensure correct environment (sandbox vs production)
- Test with curl command first

### Issue: Navigation not working

**Solution:**
- Check navigation setup is complete
- Verify screen names match exactly
- Add console logs to debug navigation flow
- Ensure `react-navigation` is properly configured

---

## Verification Checklist

### Development

- [ ] Dependencies installed
- [ ] `app.json` configured
- [ ] `google-services.json` added (Android)
- [ ] Push notification manager integrated
- [ ] Permission flow works
- [ ] Token registration succeeds
- [ ] Test notifications received
- [ ] Navigation works correctly
- [ ] Logout clears token

### Production

- [ ] Production API URL configured
- [ ] FCM production keys configured
- [ ] APNs production keys configured
- [ ] `APNS_PRODUCTION=true` for iOS
- [ ] Tested on TestFlight (iOS)
- [ ] Tested on Internal Testing (Android)
- [ ] Analytics tracking added
- [ ] Error monitoring enabled
- [ ] Badge clearing works
- [ ] All notification types tested

---

## Next Steps

1. **Complete backend setup**
   - Follow `FIREBASE_SETUP_GUIDE.md`
   - Follow `APNS_SETUP_GUIDE.md`

2. **Integrate into mobile app**
   - Add push notification initialization to App.tsx
   - Implement navigation handlers
   - Add logout cleanup

3. **Test thoroughly**
   - Test on physical iOS device
   - Test on physical Android device
   - Test all notification types
   - Test navigation flows

4. **Deploy to production**
   - Build production versions
   - Test on TestFlight/Internal Testing
   - Submit to App Store and Google Play

---

## Support Files

- **Backend API:** `/root/github-repos/better-together-live/src/api/push-notifications.ts`
- **Mobile Utils:** `/root/github-repos/better-together-live/mobile/utils/pushNotifications.ts`
- **Database Schema:** `/root/github-repos/better-together-live/migrations/0004_push_notifications.sql`
- **Documentation:** `/root/github-repos/better-together-live/docs/PUSH_NOTIFICATIONS.md`

---

**Status:** Ready for mobile app integration
**Estimated Time:** 2-4 hours for full integration
**Difficulty:** Medium
