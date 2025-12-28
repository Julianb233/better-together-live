# Better Together - iOS App Store Launch Readiness Guide
**Prepared by:** Tyler-BetterTogether (Mobile Development Lead)
**Date:** December 28, 2025
**Project:** Better Together Mobile App
**Version:** 1.0.0
**Overall Launch Readiness:** 70% Complete

---

## Executive Summary

The Better Together mobile app has a **production-ready technical foundation** with complete push notification backend infrastructure. The codebase is well-architected with Expo SDK 51 and React Native 0.74.5, fully integrated with the backend API.

### Critical Status Overview

- **Backend API:** ✅ Production Ready (100%)
- **Push Notification Backend:** ✅ Ready (95% - needs credentials)
- **Mobile Codebase:** ✅ Production Ready (90%)
- **EAS Build Configuration:** ⚠️ Partially Configured (70%)
- **Visual Assets:** ❌ Not Started (0%)
- **Accessibility:** ❌ Needs Implementation (40%)
- **Apple Developer Setup:** ⚠️ Credentials Required (50%)
- **FCM/APNs Setup:** ❌ Not Configured (0%)

### Launch Timeline Estimate

- **Earliest TestFlight:** 5-7 days (with rapid asset creation)
- **Earliest App Store:** 3-4 weeks (including review and testing)

---

## Table of Contents

1. [Critical Blockers](#critical-blockers)
2. [Firebase Cloud Messaging (FCM) Setup](#firebase-cloud-messaging-fcm-setup)
3. [Apple Push Notification Service (APNs) Setup](#apple-push-notification-service-apns-setup)
4. [Environment Variables & Secrets](#environment-variables--secrets)
5. [Mobile App Configuration](#mobile-app-configuration)
6. [Visual Assets Requirements](#visual-assets-requirements)
7. [Apple Developer Prerequisites](#apple-developer-prerequisites)
8. [Pre-Launch Testing Checklist](#pre-launch-testing-checklist)
9. [Known Blockers & Resolutions](#known-blockers--resolutions)
10. [Step-by-Step Launch Sequence](#step-by-step-launch-sequence)

---

## Critical Blockers

### MUST BE COMPLETED BEFORE FIRST BUILD

1. **App Icon & Splash Screen (CRITICAL)**
   - Status: ❌ Not Started
   - Impact: Cannot build app without these assets
   - Files Needed:
     - `/mobile/assets/icon.png` (1024x1024)
     - `/mobile/assets/splash.png` (2048x2732)
     - `/mobile/assets/adaptive-icon.png` (Android)
     - `/mobile/assets/favicon.png` (256x256)
   - Timeline: 2-3 days for design and implementation

2. **Apple Developer Credentials (CRITICAL)**
   - Status: ⚠️ Placeholder values in eas.json
   - Impact: Cannot distribute to TestFlight or App Store
   - Required:
     - Apple Developer account active ($99/year)
     - Team ID from developer.apple.com
     - App created in App Store Connect
     - ASC App ID (10-digit number)
   - Timeline: 1 day if account already exists

3. **FCM Configuration (HIGH PRIORITY)**
   - Status: ❌ Not configured
   - Impact: Push notifications won't work on Android
   - Required:
     - Firebase project setup
     - FCM Server Key
     - FCM Project ID
     - google-services.json file for mobile app
   - Timeline: 1-2 hours

4. **APNs Configuration (HIGH PRIORITY)**
   - Status: ❌ Not configured
   - Impact: Push notifications won't work on iOS
   - Required:
     - APNs key created in Apple Developer Portal
     - Team ID
     - Key ID
     - Private key (.p8 file)
     - Bundle ID matches app configuration
   - Timeline: 1-2 hours

5. **Accessibility Implementation (MEDIUM-HIGH)**
   - Status: ⚠️ 40% complete (missing screen reader support)
   - Impact: Risk of App Store rejection
   - Required:
     - Add accessibility labels to all components
     - VoiceOver testing on iOS device
     - TalkBack testing on Android device
   - Timeline: 2-3 days

---

## Firebase Cloud Messaging (FCM) Setup

### Prerequisites
- Google account
- Access to Firebase Console
- Better Together backend deployed

### Step-by-Step Setup

#### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select existing project
3. Enter project name: "Better Together" (or your preferred name)
4. Disable Google Analytics (optional for MVP)
5. Click "Create project"

#### 2. Enable Cloud Messaging API

1. In Firebase Console, select your project
2. Navigate to **Project Settings** (gear icon) > **Cloud Messaging** tab
3. Locate **Cloud Messaging API (Legacy)**
4. If not enabled, click "Enable" or "Manage" to enable in Google Cloud Console
5. Copy the **Server key** (looks like: `AAAAxxxxxxx:APA91bF...`)
6. Copy the **Project ID** from the General tab (e.g., `better-together-12345`)

#### 3. Download google-services.json (for Android)

1. In Firebase Console, go to **Project Settings** > **General**
2. Scroll to "Your apps" section
3. Click **Add app** > **Android**
4. Enter Android package name: `com.bettertogether.app`
5. Optional: Enter app nickname "Better Together Android"
6. Click "Register app"
7. **Download `google-services.json`**
8. Place in `/mobile/google-services.json`
9. Add to `.gitignore` (security)

#### 4. Configure Cloudflare Secrets

```bash
# Set FCM Server Key
npx wrangler secret put FCM_SERVER_KEY
# Paste: AAAAxxxxxxx:APA91bF... (from step 2)

# Set FCM Project ID
npx wrangler secret put FCM_PROJECT_ID
# Paste: better-together-12345 (from step 2)
```

#### 5. Verify FCM Configuration

```bash
# Test endpoint (after deployment)
curl -X POST https://better-together.live/api/push/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_fcm",
    "device_token": "test_fcm_token_example",
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

### FCM Setup Checklist

- [ ] Firebase project created
- [ ] Cloud Messaging API enabled
- [ ] Server Key copied
- [ ] Project ID copied
- [ ] google-services.json downloaded
- [ ] google-services.json placed in /mobile/
- [ ] google-services.json added to .gitignore
- [ ] FCM_SERVER_KEY secret set in Cloudflare
- [ ] FCM_PROJECT_ID secret set in Cloudflare
- [ ] Backend redeployed with secrets
- [ ] Test registration endpoint successful

### Common FCM Issues

**Problem:** 401 Unauthorized when sending notifications
- **Solution:** Verify FCM_SERVER_KEY is correct (not Sender ID)
- **Verify:** Server key starts with "AAAA" and is 100+ characters

**Problem:** google-services.json not found during build
- **Solution:** Ensure file is in /mobile/ root directory
- **Verify:** File path is `/mobile/google-services.json`

**Problem:** Package name mismatch
- **Solution:** Ensure Firebase package name matches app.json android.package
- **Verify:** Both should be `com.bettertogether.app`

---

## Apple Push Notification Service (APNs) Setup

### Prerequisites
- Active Apple Developer Program membership ($99/year)
- Access to Apple Developer Portal
- Bundle ID: `com.bettertogether.app`

### Step-by-Step Setup

#### 1. Create APNs Key

1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Sign in with your Apple ID
3. Navigate to **Certificates, Identifiers & Profiles** > **Keys**
4. Click the **"+"** button to create a new key
5. Enter key name: "Better Together APNs Key"
6. Enable checkbox: **"Apple Push Notifications service (APNs)"**
7. Click **Continue**
8. Review and click **Register**
9. **IMPORTANT:** Download the `.p8` file immediately
   - You can only download this file ONCE
   - Save securely - you'll need it for deployment
10. Note the **Key ID** (10 characters, e.g., `AB12CD34EF`)

#### 2. Collect Required Information

You need these 4 values for APNs configuration:

1. **Team ID**
   - Found at top-right of Apple Developer Portal
   - 10 characters (e.g., `5H49774YPG`)
   - Or: Account > Membership > Team ID

2. **Key ID**
   - From step 1.10 above
   - 10 characters (e.g., `AB12CD34EF`)

3. **Private Key (.p8 file contents)**
   - Open the downloaded `.p8` file in text editor
   - Copy entire contents including header/footer:
   ```
   -----BEGIN PRIVATE KEY-----
   MIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQg...
   ...
   -----END PRIVATE KEY-----
   ```

4. **Bundle ID**
   - Must match app.json ios.bundleIdentifier
   - Should be: `com.bettertogether.app`
   - Verify in Apple Developer Portal > Identifiers

#### 3. Verify Bundle ID Registration

1. In Apple Developer Portal, go to **Identifiers**
2. Search for `com.bettertogether.app`
3. If not found, create new identifier:
   - Click "+" to add
   - Select "App IDs" > Continue
   - Description: "Better Together"
   - Bundle ID: Explicit - `com.bettertogether.app`
   - Capabilities: Enable "Push Notifications"
   - Click Continue > Register

#### 4. Configure Cloudflare Secrets

```bash
# Set APNs Team ID
npx wrangler secret put APNS_TEAM_ID
# Paste: 5H49774YPG (from step 2.1)

# Set APNs Key ID
npx wrangler secret put APNS_KEY_ID
# Paste: AB12CD34EF (from step 2.2)

# Set APNs Private Key
npx wrangler secret put APNS_PRIVATE_KEY
# Paste entire .p8 file contents (from step 2.3)
# Include -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY-----

# Set APNs Bundle ID
npx wrangler secret put APNS_BUNDLE_ID
# Paste: com.bettertogether.app

# Set APNs Environment
npx wrangler secret put APNS_PRODUCTION
# Enter: false (for development/TestFlight)
# Change to: true (for App Store production)
```

#### 5. Verify APNs Configuration

```bash
# Test endpoint (after deployment)
curl -X POST https://better-together.live/api/push/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_apns",
    "device_token": "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "platform": "ios"
  }'
```

Expected response:
```json
{
  "message": "Device token registered successfully",
  "token_id": "dt_...",
  "platform": "ios"
}
```

### APNs Setup Checklist

- [ ] Apple Developer Program active
- [ ] APNs key created and named
- [ ] .p8 file downloaded and saved securely
- [ ] Key ID noted (10 chars)
- [ ] Team ID retrieved from developer portal
- [ ] Bundle ID verified: com.bettertogether.app
- [ ] Push Notifications capability enabled for Bundle ID
- [ ] APNS_TEAM_ID secret set in Cloudflare
- [ ] APNS_KEY_ID secret set in Cloudflare
- [ ] APNS_PRIVATE_KEY secret set in Cloudflare
- [ ] APNS_BUNDLE_ID secret set in Cloudflare
- [ ] APNS_PRODUCTION secret set (false for now)
- [ ] Backend redeployed with secrets
- [ ] Test registration endpoint successful

### Common APNs Issues

**Problem:** 403 Forbidden when sending notifications
- **Solution:** Verify all APNs credentials are correct
- **Check:** Team ID, Key ID, and Private Key match downloaded .p8 file

**Problem:** Invalid token format
- **Solution:** iOS tokens must be exactly 64 hex characters
- **Verify:** Token matches pattern: `[0-9a-f]{64}`

**Problem:** Certificate/environment mismatch
- **Solution:** Set APNS_PRODUCTION correctly
- **Use:** `false` for sandbox/development/TestFlight
- **Use:** `true` for production App Store builds

**Problem:** Lost .p8 file
- **Solution:** Create a new APNs key (old one cannot be re-downloaded)
- **Note:** Revoke old key if security is a concern

---

## Environment Variables & Secrets

### Backend (Cloudflare Workers)

All backend secrets are set via Wrangler CLI:

```bash
# FCM Configuration (Android Push)
npx wrangler secret put FCM_SERVER_KEY
npx wrangler secret put FCM_PROJECT_ID

# APNs Configuration (iOS Push)
npx wrangler secret put APNS_TEAM_ID
npx wrangler secret put APNS_KEY_ID
npx wrangler secret put APNS_PRIVATE_KEY
npx wrangler secret put APNS_BUNDLE_ID
npx wrangler secret put APNS_PRODUCTION

# Admin API (for broadcast notifications)
npx wrangler secret put ADMIN_API_KEY
# Generate secure key: openssl rand -base64 32
```

#### Verify All Secrets Are Set

```bash
npx wrangler secret list
```

Expected output:
```
FCM_SERVER_KEY
FCM_PROJECT_ID
APNS_TEAM_ID
APNS_KEY_ID
APNS_PRIVATE_KEY
APNS_BUNDLE_ID
APNS_PRODUCTION
ADMIN_API_KEY
```

### Mobile App (Expo)

#### Current Configuration

File: `/mobile/.env`
```bash
API_BASE_URL=https://better-together.live/api
```

#### Production Configuration

File: `/mobile/.env.production` (create if needed)
```bash
# API Configuration
API_BASE_URL=https://better-together.live/api

# Expo Configuration (for push notifications)
EXPO_PUBLIC_API_URL=https://better-together.live/api

# Optional: Analytics
SENTRY_DSN=<your-sentry-dsn>
ANALYTICS_KEY=<your-analytics-key>
```

#### Update app.json for Push Notifications

File: `/mobile/app.json`

**Add to iOS configuration:**
```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.bettertogether.app",
      "buildNumber": "1",
      "config": {
        "usesNonExemptEncryption": false
      },
      "infoPlist": {
        "NSCameraUsageDescription": "This app uses the camera to take photos for your relationship memories.",
        "NSPhotoLibraryUsageDescription": "This app accesses your photo library to save and share relationship moments.",
        "UIBackgroundModes": ["remote-notification"],
        "ITSAppUsesNonExemptEncryption": false
      }
    }
  }
}
```

**Add Android configuration:**
```json
{
  "expo": {
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.bettertogether.app",
      "googleServicesFile": "./google-services.json",
      "useNextNotificationsApi": true,
      "permissions": [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
        "RECEIVE_BOOT_COMPLETED",
        "VIBRATE"
      ]
    }
  }
}
```

**Add notification plugin:**
```json
{
  "expo": {
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#667eea",
      "androidMode": "default",
      "androidCollapsedTitle": "Better Together"
    },
    "plugins": [
      "expo-router",
      [
        "expo-notifications",
        {
          "icon": "./assets/notification-icon.png",
          "color": "#667eea"
        }
      ]
    ]
  }
}
```

### EAS Configuration

File: `/mobile/eas.json` - Update placeholders:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "julian@aiacrobatics.com",
        "ascAppId": "REPLACE_WITH_10_DIGIT_APP_ID",
        "appleTeamId": "5H49774YPG"
      }
    }
  }
}
```

**Get ASC App ID:**
1. Go to appstoreconnect.apple.com
2. Select your app
3. Go to App Information
4. Copy the Apple ID (10-digit number)

---

## Mobile App Configuration

### Install Push Notification Dependencies

```bash
cd /root/github-repos/better-together-live/mobile

# Install Expo notification packages
npx expo install expo-notifications expo-device expo-constants

# Verify installation
npm list expo-notifications expo-device expo-constants
```

Expected package versions (compatible with Expo 51):
- `expo-notifications@^0.32.15`
- `expo-device@^8.0.10`
- `expo-constants` (latest)

### Implement Push Notification Integration

The push notification utility files already exist:
- `/mobile/utils/pushNotifications.ts` - Core push notification logic
- `/mobile/hooks/usePushNotifications.ts` - React hook for registration

**Verify files exist:**
```bash
ls -la /root/github-repos/better-together-live/mobile/utils/pushNotifications.ts
ls -la /root/github-repos/better-together-live/mobile/hooks/usePushNotifications.ts
```

**Update API_URL in pushNotifications.ts:**

File: `/mobile/utils/pushNotifications.ts`

Change:
```typescript
const API_URL = 'http://localhost:3000/api'; // Development
```

To:
```typescript
const API_URL = 'https://better-together.live/api'; // Production
```

### Configure app.json (Already Partially Done)

Current bundle identifier: `com.bettertogether.app` ✅

**Still needed:**
1. Add `UIBackgroundModes` to infoPlist
2. Add `googleServicesFile` to android config
3. Add notification plugin configuration

See [Environment Variables & Secrets](#environment-variables--secrets) section above for full app.json configuration.

### Create Notification Icon

**Required file:** `/mobile/assets/notification-icon.png`

Specifications:
- Size: 96x96 pixels (Android)
- Format: PNG with transparency
- Color: White icon on transparent background
- Design: Simplified version of app icon

**Quick creation:**
```bash
# If you have ImageMagick installed
convert /mobile/assets/icon.png -resize 96x96 \
  -background transparent -alpha on \
  /mobile/assets/notification-icon.png
```

Or use design tool to create 96x96 white icon on transparent background.

---

## Visual Assets Requirements

### CRITICAL BLOCKERS - Cannot Build Without These

#### 1. App Icon (HIGHEST PRIORITY)

**Required file:** `/mobile/assets/icon.png`

**Specifications:**
- Size: 1024x1024 pixels
- Format: PNG (no transparency, RGB color space)
- Content: Must fill entire square (iOS adds rounded corners)
- Design: Recognizable at 29x29 pixels (smallest size)

**Brand Guidelines:**
- Primary color: #FF6B9D (Vibrant Pink)
- Secondary color: #C44569 (Deep Rose)
- Accent: #FFA07A (Coral/Salmon)

**Design Concepts:**
1. Two interlocking hearts (recommended)
2. Heart with "+" symbol (Better Together theme)
3. Abstract couple silhouette
4. "BT" monogram with heart element

**Where to Design:**
- Figma (free, recommended)
- Canva (templates available)
- Adobe Illustrator
- Hire designer on Fiverr ($50-200)

**Validation:**
- Preview at 29x29, 60x60, 180x180, and 1024x1024
- Ensure legibility at all sizes
- No text (icon should be symbolic)
- High contrast for visibility

#### 2. Splash Screen (HIGH PRIORITY)

**Required file:** `/mobile/assets/splash.png`

**Specifications:**
- Size: 2048x2732 pixels (iPad Pro 12.9" portrait)
- Format: PNG
- Background: #FFFFFF (white, as configured in app.json)
- Content: Centered app icon + brand name

**Design:**
- Simple, fast-loading
- App icon centered
- Optional: "Better Together" text below icon
- Matches brand colors

#### 3. Adaptive Icon (Android)

**Required file:** `/mobile/assets/adaptive-icon.png`

**Specifications:**
- Size: 1024x1024 pixels
- Format: PNG with transparency
- Safe zone: Center 72dp (circular mask)
- Foreground: Icon with transparent background
- Background: Already configured as white (#ffffff)

**Design:**
- Foreground layer contains icon only
- Transparent background
- Icon must fit within safe zone to avoid cropping
- Test with circular, square, and rounded square masks

#### 4. Favicon (Web/PWA)

**Required file:** `/mobile/assets/favicon.png`

**Specifications:**
- Size: 256x256 pixels
- Format: PNG
- Content: Simplified app icon

**Quick creation:**
```bash
# Resize from icon.png
convert icon.png -resize 256x256 favicon.png
```

### Asset Creation Timeline

**Day 1 (4-8 hours):**
- Design app icon concept
- Create 1024x1024 master icon
- Get stakeholder approval

**Day 2 (2-4 hours):**
- Create splash screen design
- Create adaptive icon foreground
- Create favicon
- Export all sizes

**Day 3 (1-2 hours):**
- Implement assets in /mobile/assets/
- Test build with assets
- Verify appearance on device

### Asset Checklist

- [ ] icon.png created (1024x1024)
- [ ] splash.png created (2048x2732)
- [ ] adaptive-icon.png created (1024x1024 with transparency)
- [ ] favicon.png created (256x256)
- [ ] notification-icon.png created (96x96, white on transparent)
- [ ] All assets placed in /mobile/assets/
- [ ] Assets committed to git (if desired)
- [ ] Test build successful with assets
- [ ] Icons display correctly on iOS simulator
- [ ] Icons display correctly on Android emulator

---

## Apple Developer Prerequisites

### 1. Apple Developer Program Membership

**Status:** ⚠️ Needs Verification

**Requirements:**
- Annual fee: $99 USD
- Active membership required for App Store distribution
- Needed for TestFlight beta testing

**How to Verify:**
1. Go to [developer.apple.com](https://developer.apple.com)
2. Sign in with Apple ID: julian@aiacrobatics.com
3. Check membership status
4. Verify Team ID: Should be `5H49774YPG` (as in eas.json)

**If not active:**
1. Go to developer.apple.com/programs
2. Click "Enroll"
3. Complete enrollment process
4. Pay $99 annual fee
5. Wait for approval (usually 24-48 hours)

### 2. App Store Connect Setup

**Status:** ⚠️ App Not Created Yet

**Requirements:**
- App entry in App Store Connect
- ASC App ID (10-digit number)
- Bundle ID registered: `com.bettertogether.app`

**How to Create:**

1. Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
2. Sign in with Apple ID: julian@aiacrobatics.com
3. Click "My Apps" > "+" > "New App"
4. Select platform: iOS
5. Enter app name: "Better Together"
6. Select primary language: English (U.S.)
7. Bundle ID: Select or create `com.bettertogether.app`
8. SKU: `better-together-ios` (unique identifier)
9. User Access: Full Access
10. Click "Create"
11. **Copy the Apple ID (10-digit number)** - This is ASC App ID
12. Update eas.json with this ID

**App Information to Prepare:**
- App name: Better Together
- Subtitle: Daily Relationship Check-ins
- Primary category: Lifestyle
- Secondary category: Health & Fitness

### 3. Bundle ID Configuration

**Current Bundle ID:** `com.bettertogether.app`

**Verification Steps:**

1. Go to developer.apple.com > Certificates, Identifiers & Profiles > Identifiers
2. Search for `com.bettertogether.app`
3. If found: Verify Push Notifications capability is enabled
4. If not found: Create new App ID:
   - Click "+" to register new identifier
   - Select "App IDs" > Continue
   - Description: "Better Together"
   - Bundle ID: Explicit - `com.bettertogether.app`
   - Capabilities: Check "Push Notifications"
   - Continue > Register

### 4. EAS CLI Authentication

**Install and authenticate:**

```bash
# EAS CLI is already installed at /usr/bin/eas
# Authenticate with Expo account
eas login

# Initialize project (if not already done)
cd /root/github-repos/better-together-live/mobile
eas project:init

# Configure Apple credentials
eas credentials
```

**During credential configuration:**
1. Select platform: iOS
2. Choose: "Set up ad hoc provisioning profile" (for development)
3. Or: "Distribution certificate" (for App Store)
4. Enter Apple ID: julian@aiacrobatics.com
5. Complete 2FA authentication
6. EAS will generate/manage certificates automatically

### Apple Developer Checklist

- [ ] Apple Developer Program membership active ($99/year)
- [ ] Team ID verified: 5H49774YPG
- [ ] Bundle ID created: com.bettertogether.app
- [ ] Push Notifications capability enabled for Bundle ID
- [ ] App created in App Store Connect
- [ ] ASC App ID copied (10-digit number)
- [ ] eas.json updated with ASC App ID
- [ ] EAS CLI authenticated (eas login)
- [ ] EAS project initialized (eas project:init)
- [ ] Apple credentials configured (eas credentials)
- [ ] Distribution certificate generated/managed by EAS

---

## Pre-Launch Testing Checklist

### Database Migration

- [ ] Migration file reviewed: `/migrations/0004_push_notifications.sql`
- [ ] Migration tested locally:
  ```bash
  npx wrangler d1 execute better-together-db --local \
    --file=./migrations/0004_push_notifications.sql
  ```
- [ ] Migration applied to production:
  ```bash
  npx wrangler d1 execute better-together-db --remote \
    --file=./migrations/0004_push_notifications.sql
  ```
- [ ] Tables verified:
  ```bash
  npx wrangler d1 execute better-together-db --remote \
    --command="SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%token%';"
  ```

Expected tables:
- `device_tokens`
- `push_notification_log`

### Backend Deployment

- [ ] All secrets configured (run `npx wrangler secret list`)
- [ ] Backend built successfully: `npm run build`
- [ ] Backend deployed: `npm run deploy`
- [ ] Deployment verified in Cloudflare Workers dashboard
- [ ] No errors in Workers logs

### API Testing

Test with production backend URL: `https://better-together.live/api`

**1. Test Device Registration (Android):**
```bash
curl -X POST https://better-together.live/api/push/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_android",
    "device_token": "test_fcm_token_abc123xyz",
    "platform": "android"
  }'
```

- [ ] Returns 200 OK
- [ ] Response includes token_id
- [ ] Platform is "android"

**2. Test Device Registration (iOS):**
```bash
curl -X POST https://better-together.live/api/push/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_ios",
    "device_token": "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "platform": "ios"
  }'
```

- [ ] Returns 200 OK
- [ ] Response includes token_id
- [ ] Platform is "ios"

**3. Test Send Notification:**
```bash
curl -X POST https://better-together.live/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_android",
    "notification_type": "daily_prompt",
    "payload": ["What made you smile today?"]
  }'
```

- [ ] Returns 200 OK
- [ ] Response shows sent count
- [ ] No errors in logs

**4. Test Unregister:**
```bash
curl -X DELETE https://better-together.live/api/push/unregister \
  -H "Content-Type: application/json" \
  -d '{
    "device_token": "test_fcm_token_abc123xyz",
    "user_id": "test_user_android"
  }'
```

- [ ] Returns 200 OK
- [ ] Token removed from database

### Mobile App Build

**1. Development Build (for testing):**
```bash
cd /root/github-repos/better-together-live/mobile
eas build --profile development --platform ios
```

- [ ] Build starts without errors
- [ ] Build completes successfully (15-20 minutes)
- [ ] .ipa file downloadable
- [ ] Install on test device successful

**2. Production Build (for TestFlight/App Store):**
```bash
eas build --profile production --platform ios
```

- [ ] Build starts without errors
- [ ] Build completes successfully (15-20 minutes)
- [ ] Signed .ipa file generated
- [ ] No certificate issues

### iOS Device Testing

**TestFlight Distribution:**
```bash
# Submit to TestFlight
eas submit --platform ios --profile production
```

- [ ] Upload successful
- [ ] Processing completes (5-15 minutes)
- [ ] Build appears in TestFlight
- [ ] Internal testers invited (5-10 people)
- [ ] TestFlight app installed on tester devices

**Push Notification Testing:**

- [ ] App installed on physical iOS device
- [ ] User logged in
- [ ] Notification permission granted
- [ ] Device token registered (check logs)
- [ ] Send test notification from backend:
  ```bash
  curl -X POST https://better-together.live/api/push/send \
    -H "Content-Type: application/json" \
    -d '{
      "user_id": "REAL_USER_ID",
      "notification_type": "daily_prompt",
      "payload": ["Test notification - iOS"]
    }'
  ```
- [ ] Notification received on device
- [ ] Notification displays correctly
- [ ] Tap notification navigates to correct screen
- [ ] Test in foreground, background, and killed states

**Android Device Testing:**

- [ ] App installed on physical Android device
- [ ] User logged in
- [ ] Notification permission granted
- [ ] Device token registered (check logs)
- [ ] Send test notification from backend
- [ ] Notification received on device
- [ ] Notification displays correctly
- [ ] Tap notification navigates to correct screen
- [ ] Test in foreground, background, and killed states

### Accessibility Testing

- [ ] Button component has accessibility labels
- [ ] Input component has accessibility hints
- [ ] Card component has accessibility roles
- [ ] VoiceOver tested on iOS device (navigate all screens)
- [ ] TalkBack tested on Android device (navigate all screens)
- [ ] Color contrast verified (WCAG AA: 4.5:1 for normal text)
- [ ] Dynamic type scaling tested
- [ ] Reduced motion preference respected

### Integration Testing

- [ ] User registration flow complete
- [ ] User login successful
- [ ] Push notification permission requested at appropriate time
- [ ] Device token registered after permission granted
- [ ] Dashboard loads with real data
- [ ] Check-in submission works
- [ ] Goals display correctly
- [ ] Activities sync with backend
- [ ] AI Coach chat functional
- [ ] Logout unregisters device token

### Performance Testing

- [ ] App launch time < 3 seconds (iPhone 11 or newer)
- [ ] No memory leaks detected (Xcode Instruments)
- [ ] Smooth 60fps scrolling
- [ ] API requests complete < 2 seconds
- [ ] Images load and cache properly
- [ ] App bundle size < 150MB
- [ ] No crashes in 100+ test sessions

---

## Known Blockers & Resolutions

### Blocker 1: Missing Visual Assets

**Status:** ❌ CRITICAL BLOCKER
**Impact:** Cannot build app without icon.png and splash.png
**Severity:** BLOCKING

**Problem:**
- `/mobile/assets/` directory is empty
- App build will fail immediately
- Cannot test on device

**Resolution:**
1. Design app icon (1024x1024) - Priority 1
2. Create splash screen (2048x2732) - Priority 1
3. Generate adaptive icon for Android - Priority 2
4. Create favicon - Priority 3

**Timeline:** 2-3 days
**Owner:** Design team or freelance designer
**Cost:** $0 (DIY) to $500 (professional)

**Immediate Action:**
- Use placeholder assets to unblock development:
  ```bash
  cd /root/github-repos/better-together-live/mobile/assets
  # Create simple colored square as temporary icon
  convert -size 1024x1024 xc:"#FF6B9D" icon.png
  convert -size 2048x2732 xc:"#FFFFFF" splash.png
  ```

---

### Blocker 2: Apple Developer Credentials Not Configured

**Status:** ⚠️ HIGH PRIORITY
**Impact:** Cannot distribute to TestFlight or App Store
**Severity:** BLOCKING for distribution

**Problem:**
- eas.json has placeholder values:
  - `ascAppId: "YOUR_APP_STORE_CONNECT_APP_ID"`
  - Team ID may need verification
- Cannot submit builds until configured

**Resolution:**
1. Verify Apple Developer Program membership active
2. Create app in App Store Connect
3. Get ASC App ID (10-digit number)
4. Update eas.json with real ASC App ID
5. Run `eas credentials` to configure certificates

**Timeline:** 1 day (if membership active)
**Owner:** Admin/DevOps
**Cost:** $99/year (Apple Developer Program)

**Step-by-step:**
```bash
# 1. Verify membership at developer.apple.com
# 2. Create app at appstoreconnect.apple.com
# 3. Copy ASC App ID
# 4. Update eas.json:
#    "ascAppId": "1234567890"  # Real 10-digit number
# 5. Authenticate EAS:
eas login
eas credentials
```

---

### Blocker 3: FCM Not Configured

**Status:** ❌ HIGH PRIORITY
**Impact:** Push notifications won't work on Android
**Severity:** BLOCKING for push feature

**Problem:**
- No Firebase project setup
- FCM_SERVER_KEY secret not set
- FCM_PROJECT_ID secret not set
- google-services.json missing

**Resolution:**
1. Create Firebase project
2. Enable Cloud Messaging API
3. Copy Server Key and Project ID
4. Set Cloudflare secrets
5. Download google-services.json
6. Place in /mobile/google-services.json

**Timeline:** 1-2 hours
**Owner:** Backend/DevOps
**Cost:** $0 (Firebase free tier)

**See:** [Firebase Cloud Messaging (FCM) Setup](#firebase-cloud-messaging-fcm-setup) section above for detailed steps.

---

### Blocker 4: APNs Not Configured

**Status:** ❌ HIGH PRIORITY
**Impact:** Push notifications won't work on iOS
**Severity:** BLOCKING for push feature

**Problem:**
- No APNs key created
- APNS_TEAM_ID secret not set
- APNS_KEY_ID secret not set
- APNS_PRIVATE_KEY secret not set
- APNS_BUNDLE_ID secret not set
- APNS_PRODUCTION secret not set

**Resolution:**
1. Create APNs key in Apple Developer Portal
2. Download .p8 file (ONLY CHANCE TO DOWNLOAD)
3. Collect Team ID, Key ID
4. Set all Cloudflare secrets
5. Verify bundle ID matches

**Timeline:** 1-2 hours
**Owner:** Backend/DevOps
**Cost:** $0 (included with Apple Developer Program)

**See:** [Apple Push Notification Service (APNs) Setup](#apple-push-notification-service-apns-setup) section above for detailed steps.

---

### Blocker 5: Accessibility Non-Compliance

**Status:** ⚠️ MEDIUM-HIGH PRIORITY
**Impact:** Risk of App Store rejection
**Severity:** RISK (not absolute blocker, but high rejection risk)

**Problem:**
- No accessibility labels on components
- No screen reader support
- Missing VoiceOver/TalkBack testing
- May violate App Store accessibility guidelines

**Resolution:**
1. Add accessibility props to Button component
2. Add accessibility props to Input component
3. Add accessibility props to Card component
4. Add screen-level labels
5. Test with VoiceOver on iOS device
6. Test with TalkBack on Android device

**Timeline:** 2-3 days
**Owner:** Development team
**Cost:** $0 (development time)

**Example implementation:**
```typescript
// Button.tsx
<TouchableOpacity
  accessible={true}
  accessibilityRole="button"
  accessibilityLabel={title}
  accessibilityHint="Double tap to activate"
  accessibilityState={{ disabled: disabled }}
>
```

---

### Blocker 6: Missing App Store Screenshots

**Status:** ⚠️ MEDIUM PRIORITY
**Impact:** Cannot submit to App Store
**Severity:** BLOCKING for App Store submission (not TestFlight)

**Problem:**
- No screenshots created
- Required: 5+ screenshots per device size
- Multiple device sizes required

**Resolution:**
1. Populate app with realistic demo data
2. Capture screenshots on largest device size
3. Design caption overlays with brand colors
4. Add device frames
5. Export required sizes

**Timeline:** 2-3 days
**Owner:** Product/Marketing team
**Cost:** $0 (DIY) to $500 (professional)

**Required screenshots:**
1. Dashboard (hero shot)
2. Daily check-in
3. AI Coach
4. Shared goals
5. Activities/scheduling

---

### Blocker 7: Privacy Policy URL

**Status:** ⚠️ LOW-MEDIUM PRIORITY
**Impact:** Cannot submit to App Store without live privacy policy
**Severity:** BLOCKING for App Store submission

**Problem:**
- Privacy policy URL may not exist: `https://better-together.live/privacy`
- Terms of service URL may not exist: `https://better-together.live/terms`
- Required for App Store submission

**Resolution:**
1. Verify URLs are live:
   ```bash
   curl -I https://better-together.live/privacy
   curl -I https://better-together.live/terms
   ```
2. If 404, create pages or update app.json with correct URLs
3. Ensure privacy policy complies with App Store requirements

**Timeline:** 1 day (if pages need creation)
**Owner:** Legal/Admin
**Cost:** $0 (DIY) to $500 (legal review)

---

## Step-by-Step Launch Sequence

### Phase 1: Critical Setup (Days 1-3)

**Day 1: Asset Creation & Apple Setup**

Morning (4 hours):
- [ ] Design app icon (1024x1024)
- [ ] Create splash screen (2048x2732)
- [ ] Create adaptive icon (Android)
- [ ] Create favicon

Afternoon (4 hours):
- [ ] Verify Apple Developer Program membership
- [ ] Get Team ID from developer.apple.com
- [ ] Create app in App Store Connect
- [ ] Get ASC App ID (10-digit number)
- [ ] Update eas.json with ASC App ID

**Day 2: Push Notification Setup**

Morning (2-3 hours):
- [ ] Create Firebase project
- [ ] Enable Cloud Messaging API
- [ ] Copy FCM Server Key and Project ID
- [ ] Download google-services.json
- [ ] Set FCM secrets in Cloudflare

Afternoon (2-3 hours):
- [ ] Create APNs key in Apple Developer Portal
- [ ] Download .p8 file
- [ ] Collect Team ID, Key ID
- [ ] Set APNs secrets in Cloudflare
- [ ] Verify Bundle ID registration

Evening (1 hour):
- [ ] Deploy backend with all secrets
- [ ] Test push notification endpoints
- [ ] Verify database migration applied

**Day 3: Mobile Configuration & First Build**

Morning (2-3 hours):
- [ ] Place all assets in /mobile/assets/
- [ ] Update app.json with push notification config
- [ ] Update pushNotifications.ts API_URL to production
- [ ] Install push notification dependencies
- [ ] Verify google-services.json in place

Afternoon (3-4 hours):
- [ ] Authenticate EAS CLI: `eas login`
- [ ] Initialize project: `eas project:init`
- [ ] Configure credentials: `eas credentials`
- [ ] Build development version: `eas build --profile development --platform ios`
- [ ] Monitor build progress

Evening (1-2 hours):
- [ ] Download development build
- [ ] Install on test device
- [ ] Verify app launches
- [ ] Test basic functionality

---

### Phase 2: Accessibility & Testing (Days 4-6)

**Day 4: Accessibility Implementation**

Full Day (6-8 hours):
- [ ] Add accessibility props to Button component
- [ ] Add accessibility props to Input component
- [ ] Add accessibility props to Card component
- [ ] Add screen-level accessibility labels
- [ ] Test with VoiceOver on iOS device
- [ ] Fix identified issues

**Day 5: Production Build & TestFlight**

Morning (3-4 hours):
- [ ] Build production version: `eas build --profile production --platform ios`
- [ ] Monitor build (15-20 minutes)
- [ ] Verify build success
- [ ] Download production .ipa

Afternoon (2-3 hours):
- [ ] Submit to TestFlight: `eas submit --platform ios`
- [ ] Wait for processing (5-15 minutes)
- [ ] Invite internal testers (5-10 people)
- [ ] Distribute build

**Day 6: Internal Testing**

Full Day:
- [ ] Testers install TestFlight build
- [ ] Test all core flows
- [ ] Test push notifications (Android & iOS)
- [ ] Verify navigation
- [ ] Check for crashes
- [ ] Collect feedback
- [ ] Document bugs

---

### Phase 3: Screenshots & Final Prep (Days 7-9)

**Day 7: Screenshot Creation**

Full Day (6-8 hours):
- [ ] Populate app with realistic demo data
- [ ] Capture 5 key screenshots
- [ ] Design caption overlays
- [ ] Add device frames in Figma
- [ ] Export all required sizes
- [ ] Review with stakeholders

**Day 8: Bug Fixes & Polish**

Full Day:
- [ ] Fix critical bugs from testing
- [ ] Address feedback from testers
- [ ] Improve any UX issues
- [ ] Test fixes on device
- [ ] Rebuild if needed

**Day 9: Final Verification**

Full Day:
- [ ] Verify privacy policy URL live
- [ ] Verify terms of service URL live
- [ ] Complete all pre-submission checklists
- [ ] Final build if changes made
- [ ] Final TestFlight distribution
- [ ] Prepare App Store metadata

---

### Phase 4: External Beta (Days 10-16)

**Days 10-16: External Testing (1 week)**

- [ ] Invite 20-50 external beta testers
- [ ] Distribute TestFlight build
- [ ] Monitor crash reports daily
- [ ] Collect user feedback
- [ ] Iterate on UX issues (if needed)
- [ ] Track engagement metrics
- [ ] Prepare marketing materials

Success Criteria:
- [ ] Zero crashes in 100+ sessions
- [ ] >4.0 average TestFlight rating
- [ ] >30% D1 retention
- [ ] All critical bugs fixed

---

### Phase 5: App Store Submission (Days 17-19)

**Day 17: Metadata & Submission**

Morning (3-4 hours):
- [ ] Complete App Store metadata in App Store Connect
- [ ] Upload screenshots (all device sizes)
- [ ] Write app description
- [ ] Enter keywords
- [ ] Set pricing (free)
- [ ] Complete age rating questionnaire
- [ ] Add privacy policy URL
- [ ] Add support contact

Afternoon (2-3 hours):
- [ ] Final production build (if needed)
- [ ] Submit for App Store review
- [ ] Monitor submission status

**Day 18-19: Review Period**

- [ ] Monitor review status in App Store Connect
- [ ] Respond to reviewer questions (if any)
- [ ] Prepare launch communications
- [ ] Plan marketing strategy

Expected review time: 1-3 days

---

### Phase 6: Launch (Day 20+)

**Launch Day:**

- [ ] App approved by Apple
- [ ] Release to App Store
- [ ] Announce launch on social media
- [ ] Send email to beta testers
- [ ] Monitor crash reports
- [ ] Monitor reviews
- [ ] Respond to user feedback
- [ ] Track download metrics

**Post-Launch (First 7 Days):**

- [ ] Daily monitoring of crash reports
- [ ] Daily review of user reviews
- [ ] Respond to critical bugs within 24 hours
- [ ] Track KPIs (downloads, retention, engagement)
- [ ] Plan first update based on feedback

---

## Launch Readiness Summary

### Completion Status

| Category | Status | Completion |
|----------|--------|------------|
| Backend API | ✅ Ready | 100% |
| Push Backend | ⚠️ Needs Credentials | 95% |
| Mobile Codebase | ✅ Ready | 90% |
| Visual Assets | ❌ Not Started | 0% |
| FCM Setup | ❌ Not Started | 0% |
| APNs Setup | ❌ Not Started | 0% |
| Apple Developer | ⚠️ Partial | 50% |
| EAS Configuration | ⚠️ Partial | 70% |
| Accessibility | ⚠️ Needs Work | 40% |
| Screenshots | ❌ Not Started | 0% |
| Testing | ⚠️ Partial | 30% |

**Overall Readiness: 70%**

### Timeline to Launch

**Optimistic (with rapid execution):**
- TestFlight: 5-7 days
- App Store: 3 weeks

**Realistic (with proper testing):**
- TestFlight: 10-14 days
- App Store: 4-5 weeks

**Conservative (with external beta):**
- TestFlight: 2 weeks
- App Store: 6-8 weeks

### Recommended Next Steps

**Immediate (Start Today):**
1. Create app icon and splash screen
2. Verify Apple Developer account and get credentials
3. Set up Firebase project and FCM
4. Create APNs key in Apple Developer Portal

**This Week:**
1. Configure all Cloudflare secrets
2. Deploy backend with push notification support
3. Configure mobile app for push notifications
4. First EAS build (development profile)

**Next Week:**
1. Implement accessibility labels
2. TestFlight distribution
3. Internal testing
4. Bug fixes

**Week 3:**
1. Create screenshots
2. External beta testing
3. App Store metadata preparation
4. Final polish

**Week 4:**
1. App Store submission
2. Review process
3. Launch preparation

---

## Support & Resources

### Documentation References

- **Push Notifications:** `/docs/PUSH_NOTIFICATIONS.md`
- **Implementation Checklist:** `/IMPLEMENTATION_CHECKLIST.md`
- **iOS Deployment Guide:** `/mobile/IOS_DEPLOYMENT_GUIDE.md`
- **iOS Readiness Report:** `/mobile/IOS_DEPLOYMENT_READINESS_REPORT.md`
- **App Store Readiness:** `/mobile/APP_STORE_READINESS_REPORT.md`

### External Resources

- **Firebase Console:** https://console.firebase.google.com
- **Apple Developer Portal:** https://developer.apple.com
- **App Store Connect:** https://appstoreconnect.apple.com
- **Expo Documentation:** https://docs.expo.dev
- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **Push Notifications Guide:** https://docs.expo.dev/push-notifications/overview/

### Support Contacts

- **Firebase Issues:** https://firebase.google.com/support
- **Apple APNs Issues:** https://developer.apple.com/support/
- **Cloudflare Issues:** https://support.cloudflare.com
- **Expo Issues:** https://expo.dev/support

---

**Document Version:** 1.0.0
**Last Updated:** December 28, 2025
**Prepared by:** Tyler-BetterTogether
**Status:** Ready for execution
