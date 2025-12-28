# Firebase Cloud Messaging (FCM) Setup Guide
**Project:** Better Together Live
**Purpose:** Enable Android push notifications via Firebase Cloud Messaging
**Status:** Manual Setup Required

## Overview

Firebase Cloud Messaging (FCM) is required for sending push notifications to Android devices. This guide walks you through the complete setup process.

---

## Prerequisites

- Access to [Firebase Console](https://console.firebase.google.com/)
- Google account with admin permissions
- Android app package name: `com.bettertogether.app`

---

## Step-by-Step Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project details:
   - **Project name:** `Better Together` (or your preferred name)
   - **Project ID:** Will be auto-generated (e.g., `better-together-12345`)
   - **Analytics:** Enable or disable Google Analytics (optional)
4. Click "Create project"
5. Wait for project creation to complete

### Step 2: Add Android App to Firebase Project

1. In your Firebase project, click the Android icon to add an Android app
2. Enter app details:
   - **Android package name:** `com.bettertogether.app`
   - **App nickname:** `Better Together Mobile` (optional)
   - **Debug signing certificate SHA-1:** (optional for now, needed for advanced features)
3. Click "Register app"

### Step 3: Download google-services.json

1. Firebase will prompt you to download `google-services.json`
2. **Download this file** - you'll need it for the mobile app
3. **File location:** Save it to `/root/github-repos/better-together-live/mobile/google-services.json`

**Action Required:**
```bash
# After downloading, move the file to your mobile project
mv ~/Downloads/google-services.json /root/github-repos/better-together-live/mobile/
```

### Step 4: Get Server Key and Project ID

1. In Firebase Console, go to **Project Settings** (gear icon in top-left)
2. Navigate to the **Cloud Messaging** tab
3. Find these values:

   **Server Key:**
   - Look for "Server key" under "Cloud Messaging API (Legacy)"
   - If not visible, you may need to enable Cloud Messaging API:
     - Click "Enable Cloud Messaging API"
     - Go to Google Cloud Console
     - Enable the API
     - Return to Firebase Console and refresh

   **Project ID:**
   - This is visible at the top of Project Settings
   - Format: `better-together-12345` (example)

4. **Copy both values** - you'll need them for Cloudflare Workers

### Step 5: Enable Cloud Messaging API (if not already enabled)

1. In Firebase Console, under Cloud Messaging tab, click the link to "Cloud Messaging API"
2. This opens Google Cloud Console
3. Click **"Enable"** to activate the API
4. Return to Firebase Console

### Step 6: Configure Firebase in Mobile App

The mobile app configuration file (`mobile/app.json`) already has the Firebase reference:

```json
{
  "android": {
    "googleServicesFile": "./google-services.json"
  }
}
```

Just ensure the `google-services.json` file is in the correct location:
```
/root/github-repos/better-together-live/mobile/google-services.json
```

---

## Configuration Values Needed

After completing the setup, you should have:

| Value | Example | Description |
|-------|---------|-------------|
| **FCM Server Key** | `AAAA...xyz123` | Found in Cloud Messaging tab (Legacy) |
| **FCM Project ID** | `better-together-12345` | Found in Project Settings |
| **google-services.json** | File | Downloaded from Firebase Console |

---

## Add to Cloudflare Workers Secrets

Once you have the Server Key and Project ID, add them as Cloudflare Workers secrets:

```bash
# Navigate to project directory
cd /root/github-repos/better-together-live

# Add FCM Server Key
npx wrangler secret put FCM_SERVER_KEY
# When prompted, paste your FCM Server Key

# Add FCM Project ID
npx wrangler secret put FCM_PROJECT_ID
# When prompted, paste your Firebase Project ID
```

---

## Testing FCM Setup

### Test 1: Verify Configuration

```bash
# Check if secrets are set
npx wrangler secret list
```

Expected output should include:
- `FCM_SERVER_KEY`
- `FCM_PROJECT_ID`

### Test 2: Register a Test Device Token

```bash
curl -X POST https://better-together-live.vercel.app/api/push/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_android",
    "device_token": "eXAMPLE_FCM_TOKEN_abc123xyz789",
    "platform": "android"
  }'
```

Expected response:
```json
{
  "message": "Device token registered successfully",
  "token_id": "dt_...",
  "platform": "android"
}
```

### Test 3: Send Test Notification (Development Mode)

Since FCM credentials are not yet configured, the system runs in development mode and simulates notifications:

```bash
curl -X POST https://better-together-live.vercel.app/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_android",
    "notification_type": "daily_prompt",
    "payload": ["What made you smile today?"]
  }'
```

Expected response (development mode):
```json
{
  "message": "Push notifications simulated (dev mode)",
  "sent": 1,
  "failed": 0,
  "simulated": 1,
  "dev_mode": true
}
```

---

## Production Deployment

After configuration is complete:

```bash
# Deploy to Cloudflare Workers
npm run deploy

# Or deploy to Vercel
vercel --prod
```

---

## Mobile App Integration

The mobile app needs to:

1. Request notification permissions
2. Get FCM device token
3. Register token with backend

Example integration is already implemented in:
- `/root/github-repos/better-together-live/mobile/utils/pushNotifications.ts`

To test on a physical Android device:

```bash
cd /root/github-repos/better-together-live/mobile
npx expo start --android
```

---

## Troubleshooting

### Issue: "Cloud Messaging API is disabled"

**Solution:**
1. Go to Google Cloud Console
2. Select your Firebase project
3. Navigate to APIs & Services > Library
4. Search for "Firebase Cloud Messaging API"
5. Click "Enable"

### Issue: "Invalid Server Key"

**Solution:**
- Ensure you copied the entire Server Key (starts with `AAAA`)
- Verify the key is from the correct Firebase project
- Re-generate the key if necessary

### Issue: "google-services.json not found"

**Solution:**
```bash
# Verify file exists
ls -la /root/github-repos/better-together-live/mobile/google-services.json

# If missing, re-download from Firebase Console
```

### Issue: "Token registration fails"

**Solution:**
- Check that device is a physical Android device (emulators may not support push)
- Verify internet connectivity
- Ensure app has notification permissions enabled

---

## Security Best Practices

1. **Never commit `google-services.json` to Git**
   - Already added to `.gitignore`

2. **Use Cloudflare Secrets for Server Key**
   - Never put Server Key in `.env` files
   - Use `wrangler secret put` command

3. **Rotate keys periodically**
   - Regenerate Server Key every 6-12 months
   - Update Cloudflare secrets after rotation

4. **Monitor usage**
   - Check Firebase Console for API usage
   - Set up billing alerts to avoid surprises

---

## Next Steps

After completing Firebase setup:

1. ✅ Firebase project created
2. ✅ Android app added to Firebase
3. ✅ `google-services.json` downloaded and placed in mobile directory
4. ✅ FCM Server Key and Project ID added to Cloudflare Workers
5. ⏭️ Move to APNs setup for iOS notifications
6. ⏭️ Test on physical Android device
7. ⏭️ Deploy to production

---

## Support Resources

- [Firebase Console](https://console.firebase.google.com/)
- [FCM Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Expo Notifications Guide](https://docs.expo.dev/push-notifications/overview/)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)

---

**Estimated Time:** 15-20 minutes
**Difficulty:** Easy
**Prerequisites:** Google account with project creation permissions
