# Push Notification System - Better Together

Complete push notification implementation supporting both iOS (APNs) and Android (FCM).

## Overview

The push notification system enables real-time engagement with users through:
- Partner activity notifications
- Daily check-in reminders
- Milestone achievements
- Gift notifications
- Anniversary reminders
- Broadcast messages (admin only)

## Architecture

### Components

1. **API Endpoints** (`/src/api/push-notifications.ts`)
   - Device registration/unregistration
   - Individual user notifications
   - Broadcast notifications
   - Token management

2. **Database Schema** (`/migrations/0004_push_notifications.sql`)
   - `device_tokens` - Stores FCM/APNs tokens
   - `push_notification_log` - Audit trail of sent notifications

3. **Push Services**
   - FCM (Firebase Cloud Messaging) for Android
   - APNs (Apple Push Notification service) for iOS

## API Endpoints

### POST `/api/push/register`
Register a device token for push notifications.

**Request:**
```json
{
  "user_id": "user_123",
  "device_token": "fCm_ToKeN_hErE...", // FCM token or APNs token
  "platform": "android" // or "ios"
}
```

**Response:**
```json
{
  "message": "Device token registered successfully",
  "token_id": "dt_1234567890_abc123",
  "platform": "android"
}
```

**Token Formats:**
- **Android (FCM):** Base64url string, 100+ characters (e.g., `eXAMPLE_FCM_TOKEN...`)
- **iOS (APNs):** 64 character hex string (e.g., `1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`)

---

### POST `/api/push/send`
Send push notification to a specific user.

**Request (Template-based):**
```json
{
  "user_id": "user_123",
  "notification_type": "partner_checkin_reminder",
  "payload": ["Partner Name"]
}
```

**Request (Custom):**
```json
{
  "user_id": "user_123",
  "custom_payload": {
    "title": "Custom Notification",
    "body": "This is a custom message",
    "data": {
      "action": "open_screen",
      "screen": "profile"
    },
    "badge": 1,
    "sound": "default"
  }
}
```

**Response:**
```json
{
  "message": "Push notifications sent",
  "sent": 2,
  "failed": 0
}
```

---

### POST `/api/push/broadcast`
Send push notification to all users (admin only).

**Request:**
```json
{
  "admin_key": "your_admin_api_key",
  "notification_type": "daily_prompt",
  "payload": ["What made you smile today?"]
}
```

**Response:**
```json
{
  "message": "Broadcast completed",
  "total_devices": 1500,
  "sent": 1450,
  "failed": 50
}
```

---

### DELETE `/api/push/unregister`
Remove a device token (e.g., on logout).

**Request:**
```json
{
  "device_token": "fCm_ToKeN_hErE...",
  "user_id": "user_123" // optional, for extra security
}
```

**Response:**
```json
{
  "message": "Device token unregistered successfully",
  "deleted": 1
}
```

---

### GET `/api/push/tokens/:userId`
Get user's registered devices (for debugging).

**Response:**
```json
{
  "user_id": "user_123",
  "device_count": 2,
  "devices": [
    {
      "id": "dt_1234567890_abc123",
      "platform": "android",
      "registered_at": "2025-01-15T10:30:00Z",
      "token_preview": "eXAMPLE_FC..."
    },
    {
      "id": "dt_1234567891_def456",
      "platform": "ios",
      "registered_at": "2025-01-16T14:20:00Z",
      "token_preview": "1234567890..."
    }
  ]
}
```

## Notification Templates

### Available Templates

1. **partner_checkin_reminder**
   ```typescript
   { notification_type: "partner_checkin_reminder", payload: ["Partner Name"] }
   ```

2. **partner_activity**
   ```typescript
   { notification_type: "partner_activity", payload: ["Partner Name", "Activity text"] }
   ```

3. **milestone_achieved**
   ```typescript
   { notification_type: "milestone_achieved", payload: ["100-day streak", "🎉"] }
   ```

4. **daily_prompt**
   ```typescript
   { notification_type: "daily_prompt", payload: ["What made you smile today?"] }
   ```

5. **gift_received**
   ```typescript
   { notification_type: "gift_received", payload: ["Sender Name", "Virtual Hug"] }
   ```

6. **anniversary_reminder**
   ```typescript
   { notification_type: "anniversary_reminder", payload: ["1-year anniversary", 7] }
   ```

7. **goal_completed**
   ```typescript
   { notification_type: "goal_completed", payload: ["5 Date Nights"] }
   ```

## Environment Variables

Add these to your Cloudflare Workers environment:

### Android (FCM)
```bash
FCM_SERVER_KEY=your_fcm_server_key_here
FCM_PROJECT_ID=your-firebase-project-id
```

### iOS (APNs)
```bash
APNS_TEAM_ID=your_apple_team_id
APNS_KEY_ID=your_apns_key_id
APNS_PRIVATE_KEY=your_apns_private_key_p8_content
APNS_BUNDLE_ID=com.bettertogether.app
APNS_PRODUCTION=false  # Set to 'true' for production
```

### Admin
```bash
ADMIN_API_KEY=your_secure_admin_key_for_broadcasts
```

## Setup Instructions

### 1. Run Database Migration

```bash
# Apply the migration to your D1 database
npx wrangler d1 execute better-together-db --file=./migrations/0004_push_notifications.sql --remote
```

### 2. Configure Firebase Cloud Messaging (FCM)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create one)
3. Navigate to Project Settings > Cloud Messaging
4. Copy the Server Key and Project ID
5. Add to Cloudflare Workers secrets:
   ```bash
   npx wrangler secret put FCM_SERVER_KEY
   npx wrangler secret put FCM_PROJECT_ID
   ```

### 3. Configure Apple Push Notification service (APNs)

1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Create an APNs Key:
   - Certificates, Identifiers & Profiles > Keys
   - Click "+" to create a new key
   - Enable "Apple Push Notifications service (APNs)"
   - Download the `.p8` file
3. Note your Team ID and Key ID
4. Add to Cloudflare Workers secrets:
   ```bash
   npx wrangler secret put APNS_TEAM_ID
   npx wrangler secret put APNS_KEY_ID
   npx wrangler secret put APNS_PRIVATE_KEY  # Paste .p8 file content
   npx wrangler secret put APNS_BUNDLE_ID
   ```

### 4. Set Admin Key

```bash
npx wrangler secret put ADMIN_API_KEY
```

### 5. Deploy

```bash
npm run deploy
```

## Mobile App Integration

### React Native / Expo Setup

#### Install Dependencies

```bash
# For Expo
npx expo install expo-notifications expo-device expo-constants

# For React Native (non-Expo)
npm install @react-native-firebase/app @react-native-firebase/messaging
npm install @notifee/react-native  # Optional: for advanced local notifications
```

#### Register Device Token

```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

async function registerForPushNotifications(userId: string) {
  if (!Device.isDevice) {
    console.log('Must use physical device for push notifications');
    return;
  }

  // Request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  // Get device token
  const token = (await Notifications.getExpoPushTokenAsync({
    projectId: Constants.expoConfig?.extra?.eas?.projectId,
  })).data;

  // Determine platform
  const platform = Device.osName === 'iOS' ? 'ios' : 'android';

  // Register with backend
  await fetch('https://better-together.app/api/push/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      device_token: token,
      platform: platform,
    }),
  });

  console.log('Push token registered:', token);
}
```

#### Handle Notifications

```typescript
import * as Notifications from 'expo-notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Listen for notifications
useEffect(() => {
  // Notification received while app is foregrounded
  const subscription = Notifications.addNotificationReceivedListener(notification => {
    console.log('Notification received:', notification);
  });

  // User tapped on notification
  const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
    const data = response.notification.request.content.data;

    // Handle navigation based on notification type
    switch (data.type) {
      case 'partner_checkin_reminder':
        navigation.navigate('CheckIn');
        break;
      case 'gift_received':
        navigation.navigate('Gifts');
        break;
      case 'milestone_achieved':
        navigation.navigate('Achievements');
        break;
      // ... handle other types
    }
  });

  return () => {
    subscription.remove();
    responseSubscription.remove();
  };
}, []);
```

#### Unregister on Logout

```typescript
async function unregisterPushNotifications(deviceToken: string, userId: string) {
  await fetch('https://better-together.app/api/push/unregister', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      device_token: deviceToken,
      user_id: userId,
    }),
  });
}
```

## Testing

### Test with cURL

#### Register Device (Android)
```bash
curl -X POST https://better-together.app/api/push/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_123",
    "device_token": "test_fcm_token_abc123xyz",
    "platform": "android"
  }'
```

#### Send Test Notification
```bash
curl -X POST https://better-together.app/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_123",
    "notification_type": "daily_prompt",
    "payload": ["What made you smile today?"]
  }'
```

#### Send Custom Notification
```bash
curl -X POST https://better-together.app/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_123",
    "custom_payload": {
      "title": "Test Notification",
      "body": "This is a test message",
      "data": {
        "test": true
      }
    }
  }'
```

#### Broadcast (Admin)
```bash
curl -X POST https://better-together.app/api/push/broadcast \
  -H "Content-Type: application/json" \
  -d '{
    "admin_key": "your_admin_key",
    "custom_payload": {
      "title": "System Announcement",
      "body": "Scheduled maintenance in 1 hour"
    }
  }'
```

## Programmatic Usage

### Send from Backend Code

```typescript
import { sendTemplateNotification } from './api/push-notifications';

// Example: Send partner activity notification
async function notifyPartnerActivity(env: any, userId: string, partnerName: string, activity: string) {
  await sendTemplateNotification(
    env,
    userId,
    'partner_activity',
    partnerName,
    activity
  );
}

// Example: Send milestone notification
async function notifyMilestone(env: any, userId: string, milestone: string) {
  await sendTemplateNotification(
    env,
    userId,
    'milestone_achieved',
    milestone,
    '🎉'
  );
}
```

## Best Practices

### Security
- Never expose full device tokens in API responses
- Validate admin key for broadcast endpoints
- Use HTTPS for all API calls
- Implement rate limiting on registration endpoint
- Rotate admin keys regularly

### Performance
- Batch broadcast notifications (100 devices per batch)
- Use async processing for large broadcasts
- Implement exponential backoff for failed sends
- Clean up inactive tokens regularly

### User Experience
- Request notification permissions at the right time
- Allow users to customize notification preferences
- Provide clear notification settings in app
- Use meaningful notification content
- Group related notifications
- Respect quiet hours / do-not-disturb settings

### Monitoring
- Track notification delivery rates
- Monitor failed sends and investigate patterns
- Log notification interactions (opens, dismissals)
- Alert on high failure rates
- Track token registration/unregistration trends

## Troubleshooting

### FCM Issues
- **401 Unauthorized:** Check FCM_SERVER_KEY is correct
- **404 Not Found:** Verify FCM_PROJECT_ID is correct
- **Invalid token:** Token may have expired, request new one from device

### APNs Issues
- **403 Forbidden:** Check APNs credentials (Team ID, Key ID, Private Key)
- **400 Bad Request:** Verify APNs token format (64 hex characters)
- **Certificate errors:** Ensure using correct environment (sandbox vs production)

### General Issues
- **No devices registered:** User hasn't granted notification permissions
- **Notifications not received:** Check device has network connectivity
- **Old notifications showing:** Clear badge count on app open

## Future Enhancements

- [ ] Notification scheduling (send at specific time)
- [ ] User notification preferences (per notification type)
- [ ] Rich notifications (images, action buttons)
- [ ] Notification analytics dashboard
- [ ] A/B testing for notification content
- [ ] Localization support
- [ ] Web push notifications (Progressive Web App)
- [ ] Silent notifications for data sync
- [ ] Notification delivery confirmation tracking

## Support

For issues or questions:
- Check logs in Cloudflare Workers dashboard
- Review FCM/APNs documentation
- Test with sample tokens first
- Verify environment variables are set correctly
