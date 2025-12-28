# Apple Push Notification Service (APNs) Setup Guide
**Project:** Better Together Live
**Purpose:** Enable iOS push notifications via Apple Push Notification service
**Status:** Manual Setup Required

## Overview

Apple Push Notification service (APNs) is required for sending push notifications to iOS devices. This guide walks you through creating APNs keys and configuring them for production use.

---

## Prerequisites

- Active Apple Developer Program membership ($99/year)
- Access to [Apple Developer Portal](https://developer.apple.com/account)
- Team Admin or Account Holder role
- iOS app bundle identifier: `com.bettertogether.app`

---

## Step-by-Step Setup

### Step 1: Access Apple Developer Portal

1. Go to [Apple Developer Portal](https://developer.apple.com/account)
2. Sign in with your Apple ID (must be enrolled in Apple Developer Program)
3. Navigate to **Certificates, Identifiers & Profiles**

### Step 2: Register App Identifier (if not already registered)

1. Click **Identifiers** in the sidebar
2. Click the **+** button to add a new identifier
3. Select **App IDs** and click **Continue**
4. Select **App** and click **Continue**
5. Configure the App ID:
   - **Description:** `Better Together`
   - **Bundle ID:** `com.bettertogether.app` (Explicit)
   - **Capabilities:** Enable **Push Notifications**
6. Click **Continue** then **Register**

### Step 3: Create APNs Authentication Key

1. In the sidebar, click **Keys**
2. Click the **+** button to create a new key
3. Configure the key:
   - **Key Name:** `Better Together Push Notifications`
   - **Services:** Check **Apple Push Notifications service (APNs)**
4. Click **Continue**
5. Review and click **Register**

### Step 4: Download the .p8 Key File

**CRITICAL: You can only download this file once!**

1. After registration, click **Download**
2. Save the file (format: `AuthKey_XXXXXXXXXX.p8`)
3. **Store this file securely** - you cannot re-download it
4. If you lose it, you'll need to revoke and create a new key

**Action Required:**
```bash
# Save the downloaded .p8 file
mv ~/Downloads/AuthKey_*.p8 ~/apns-key.p8

# View the key content (you'll need this for Cloudflare)
cat ~/apns-key.p8
```

### Step 5: Note Important Values

After creating the key, note these values:

1. **Key ID:**
   - 10-character identifier (e.g., `A1B2C3D4E5`)
   - Visible in the key list in Apple Developer Portal

2. **Team ID:**
   - Found in the top-right corner of Apple Developer Portal
   - Or in **Membership** section
   - 10-character identifier (e.g., `X9Y8Z7W6V5`)

3. **Bundle ID:**
   - `com.bettertogether.app`

4. **Private Key Content:**
   - Content of the `.p8` file you downloaded
   - Format:
     ```
     -----BEGIN PRIVATE KEY-----
     [base64 encoded key content]
     -----END PRIVATE KEY-----
     ```

---

## Configuration Values Needed

After completing the setup, you should have:

| Value | Example | Description |
|-------|---------|-------------|
| **Team ID** | `X9Y8Z7W6V5` | Found in Apple Developer Portal (top-right) |
| **Key ID** | `A1B2C3D4E5` | 10-character identifier from key creation |
| **Private Key** | `-----BEGIN PRIVATE KEY-----\n...` | Content of `.p8` file |
| **Bundle ID** | `com.bettertogether.app` | Your app's bundle identifier |
| **Environment** | `sandbox` or `production` | Use sandbox for development/TestFlight |

---

## Add to Cloudflare Workers Secrets

Once you have all the values, add them as Cloudflare Workers secrets:

```bash
# Navigate to project directory
cd /root/github-repos/better-together-live

# Add Team ID
npx wrangler secret put APNS_TEAM_ID
# When prompted, enter your Team ID (e.g., X9Y8Z7W6V5)

# Add Key ID
npx wrangler secret put APNS_KEY_ID
# When prompted, enter your Key ID (e.g., A1B2C3D4E5)

# Add Private Key
npx wrangler secret put APNS_PRIVATE_KEY
# When prompted, paste the ENTIRE content of the .p8 file including:
# -----BEGIN PRIVATE KEY-----
# [key content]
# -----END PRIVATE KEY-----

# Add Bundle ID
npx wrangler secret put APNS_BUNDLE_ID
# When prompted, enter: com.bettertogether.app

# Add Production flag (false for development/sandbox, true for production)
npx wrangler secret put APNS_PRODUCTION
# For development/TestFlight: false
# For App Store production: true
```

---

## Configure Mobile App

Update the `mobile/app.json` file with your Bundle ID:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.bettertogether.app",
      "buildNumber": "1",
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    }
  }
}
```

This is already configured in your project.

---

## Testing APNs Setup

### Test 1: Verify Configuration

```bash
# Check if secrets are set
npx wrangler secret list
```

Expected output should include:
- `APNS_TEAM_ID`
- `APNS_KEY_ID`
- `APNS_PRIVATE_KEY`
- `APNS_BUNDLE_ID`
- `APNS_PRODUCTION`

### Test 2: Register a Test Device Token

To get a real APNs token, you need to:

1. Build the app for iOS device
2. Install on a physical device (or simulator for testing)
3. Grant notification permissions
4. App will receive a 64-character hex token

Example token format:
```
1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef
```

### Test 3: Register Token with Backend

```bash
curl -X POST https://better-together-live.vercel.app/api/push/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_ios",
    "device_token": "[64-character-hex-token-from-device]",
    "platform": "ios"
  }'
```

### Test 4: Send Test Notification

```bash
curl -X POST https://better-together-live.vercel.app/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_ios",
    "notification_type": "daily_prompt",
    "payload": ["What made you smile today?"]
  }'
```

---

## APNs Environments

### Sandbox (Development)

- **URL:** `https://api.sandbox.push.apple.com`
- **Use for:**
  - Development builds
  - TestFlight builds
  - Xcode simulator testing
- **Configuration:** `APNS_PRODUCTION=false`

### Production

- **URL:** `https://api.push.apple.com`
- **Use for:**
  - App Store releases
  - Production apps
- **Configuration:** `APNS_PRODUCTION=true`

**Important:** Tokens from sandbox environment will NOT work in production, and vice versa.

---

## Building iOS App with APNs

### For Development/Testing

```bash
cd /root/github-repos/better-together-live/mobile

# Start development server
npx expo start --ios

# Or build for testing
eas build --platform ios --profile preview
```

### For Production

```bash
# Build production app
eas build --platform ios --profile production

# Or submit to App Store
eas submit --platform ios
```

---

## Troubleshooting

### Issue: "403 Forbidden" from APNs

**Causes:**
- Invalid Team ID
- Invalid Key ID
- Invalid Private Key
- Key doesn't have APNs capability

**Solution:**
1. Verify all credentials in Apple Developer Portal
2. Ensure the key has "Apple Push Notifications service" enabled
3. Re-create the key if necessary
4. Update Cloudflare secrets with new values

### Issue: "400 Bad Request" - Invalid token

**Causes:**
- Token is not 64 hex characters
- Token is from wrong environment (sandbox vs production)
- Token format is incorrect

**Solution:**
1. Verify token format: exactly 64 hexadecimal characters
2. Ensure `APNS_PRODUCTION` matches your build environment
3. Get a fresh token from the device

### Issue: "Invalid Bundle ID"

**Causes:**
- Bundle ID mismatch between code and APNs configuration
- Bundle ID not registered in Apple Developer Portal

**Solution:**
1. Verify `mobile/app.json` has correct `bundleIdentifier`
2. Ensure Bundle ID is registered in Apple Developer Portal
3. Ensure Bundle ID has Push Notifications capability enabled

### Issue: "Key not found" or "Cannot download key again"

**Solution:**
1. You can only download the `.p8` file once
2. If lost, you must:
   - Revoke the old key in Apple Developer Portal
   - Create a new key
   - Update Cloudflare secrets with new values

### Issue: Notifications not appearing on device

**Causes:**
- Device doesn't have notification permissions
- Wrong APNs environment (sandbox vs production)
- Device has no internet connection
- Silent hours / Do Not Disturb enabled

**Solution:**
1. Check notification permissions: Settings > Better Together > Notifications
2. Verify `APNS_PRODUCTION` matches build type
3. Check device connectivity
4. Test outside Do Not Disturb hours

---

## APNs JWT Implementation (Current Issue)

**Status:** The current implementation has a placeholder JWT generation function.

**Location:** `/root/github-repos/better-together-live/src/api/push-notifications.ts` (line 195-212)

**Issue:** Proper ES256 JWT signing with the private key needs to be implemented.

**Solution Required:** Install a JWT library that supports ES256 signing:

```bash
# Install jose library for JWT support
npm install jose
```

Updated implementation needed:
```typescript
import * as jose from 'jose';

async function generateAPNsJWT(config: { teamId: string; keyId: string; privateKey: string }): Promise<string> {
  // Import the P8 private key
  const privateKey = await jose.importPKCS8(config.privateKey, 'ES256');

  // Create JWT
  const jwt = await new jose.SignJWT({})
    .setProtectedHeader({ alg: 'ES256', kid: config.keyId })
    .setIssuer(config.teamId)
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(privateKey);

  return jwt;
}
```

This needs to be implemented before iOS push notifications will work in production.

---

## Security Best Practices

1. **Protect Private Key**
   - Never commit `.p8` file to Git
   - Store in secure password manager
   - Only share via secure channels

2. **Use Cloudflare Secrets**
   - Never put private key in `.env` files
   - Use `wrangler secret put` command

3. **Key Rotation**
   - Rotate APNs keys annually
   - Keep old keys for 48 hours during transition

4. **Monitoring**
   - Track notification delivery rates
   - Monitor for authentication failures
   - Set up alerts for high error rates

5. **Environment Separation**
   - Use sandbox for all development
   - Only use production for App Store releases

---

## Production Checklist

Before going to production:

- [ ] APNs authentication key created
- [ ] Team ID, Key ID, and Private Key recorded
- [ ] All values added to Cloudflare Workers secrets
- [ ] Bundle ID matches app configuration
- [ ] `APNS_PRODUCTION` set to `true`
- [ ] JWT generation implemented with proper crypto library
- [ ] Tested on physical iOS device
- [ ] Notifications working in TestFlight
- [ ] App submitted to App Store with proper entitlements

---

## Next Steps

After completing APNs setup:

1. ✅ APNs authentication key created
2. ✅ Private key downloaded and stored securely
3. ✅ Team ID, Key ID, and Bundle ID noted
4. ✅ All values added to Cloudflare Workers secrets
5. ⏭️ Implement proper JWT generation with jose library
6. ⏭️ Test on physical iOS device
7. ⏭️ Test in TestFlight
8. ⏭️ Deploy to production

---

## Support Resources

- [Apple Developer Portal](https://developer.apple.com/account)
- [APNs Documentation](https://developer.apple.com/documentation/usernotifications)
- [APNs Token-Based Authentication](https://developer.apple.com/documentation/usernotifications/setting_up_a_remote_notification_server/establishing_a_token-based_connection_to_apns)
- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)

---

**Estimated Time:** 20-30 minutes
**Difficulty:** Medium
**Prerequisites:** Active Apple Developer Program membership, Team Admin role
**Cost:** $99/year for Apple Developer Program (if not already enrolled)
