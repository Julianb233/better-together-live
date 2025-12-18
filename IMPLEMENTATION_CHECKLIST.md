# Push Notification System - Implementation Checklist

Use this checklist to deploy the push notification system to production.

## Pre-Deployment

### 1. Database Migration
- [ ] Review migration file: `migrations/0004_push_notifications.sql`
- [ ] Run migration locally (dev):
  ```bash
  npx wrangler d1 execute better-together-db --local --file=./migrations/0004_push_notifications.sql
  ```
- [ ] Test locally with local D1 database
- [ ] Run migration in production:
  ```bash
  npx wrangler d1 execute better-together-db --remote --file=./migrations/0004_push_notifications.sql
  ```
- [ ] Verify tables created:
  ```bash
  npx wrangler d1 execute better-together-db --remote --command="SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%token%';"
  ```

### 2. Firebase Cloud Messaging (FCM) Setup
- [ ] Go to [Firebase Console](https://console.firebase.google.com/)
- [ ] Create or select your project
- [ ] Navigate to Project Settings > Cloud Messaging
- [ ] Enable Cloud Messaging API (if not already enabled)
- [ ] Copy **Server Key** (Legacy server key)
- [ ] Copy **Project ID** (from General tab)
- [ ] Save these values securely

### 3. Apple Push Notification service (APNs) Setup
- [ ] Go to [Apple Developer Portal](https://developer.apple.com/account)
- [ ] Navigate to Certificates, Identifiers & Profiles > Keys
- [ ] Click "+" to create a new key
- [ ] Name it "Better Together APNs Key"
- [ ] Enable "Apple Push Notifications service (APNs)"
- [ ] Click Continue and Register
- [ ] **Download the .p8 file immediately** (you can't download it again!)
- [ ] Note your **Key ID** (shown on the key details page)
- [ ] Note your **Team ID** (top right of Developer Portal)
- [ ] Note your **Bundle ID** (from Identifiers section, e.g., `com.bettertogether.app`)
- [ ] Save the .p8 file contents (it's a text file)

### 4. Cloudflare Secrets Configuration
- [ ] Set FCM Server Key:
  ```bash
  npx wrangler secret put FCM_SERVER_KEY
  # Paste the FCM server key when prompted
  ```
- [ ] Set FCM Project ID:
  ```bash
  npx wrangler secret put FCM_PROJECT_ID
  # Paste the Firebase project ID when prompted
  ```
- [ ] Set APNs Team ID:
  ```bash
  npx wrangler secret put APNS_TEAM_ID
  # Paste your Apple Team ID when prompted
  ```
- [ ] Set APNs Key ID:
  ```bash
  npx wrangler secret put APNS_KEY_ID
  # Paste your APNs Key ID when prompted
  ```
- [ ] Set APNs Private Key:
  ```bash
  npx wrangler secret put APNS_PRIVATE_KEY
  # Paste the entire contents of the .p8 file when prompted
  # Include the -----BEGIN PRIVATE KEY----- and -----END PRIVATE KEY----- lines
  ```
- [ ] Set APNs Bundle ID:
  ```bash
  npx wrangler secret put APNS_BUNDLE_ID
  # Paste your app's bundle ID (e.g., com.bettertogether.app)
  ```
- [ ] Set APNs Production flag:
  ```bash
  npx wrangler secret put APNS_PRODUCTION
  # Enter 'false' for sandbox/development, 'true' for production
  ```
- [ ] Set Admin API Key:
  ```bash
  npx wrangler secret put ADMIN_API_KEY
  # Enter a secure random string (e.g., generated with: openssl rand -base64 32)
  ```
- [ ] Verify all secrets are set:
  ```bash
  npx wrangler secret list
  ```

### 5. Build and Test Locally
- [ ] Build the project:
  ```bash
  npm run build
  ```
- [ ] Verify no TypeScript errors
- [ ] Test locally with Wrangler:
  ```bash
  npm run dev
  ```
- [ ] Test device registration endpoint (use Postman or curl)
- [ ] Test send notification endpoint
- [ ] Review logs for any errors

### 6. Deploy to Production
- [ ] Deploy to Cloudflare Workers:
  ```bash
  npm run deploy
  ```
- [ ] Verify deployment was successful
- [ ] Check Workers dashboard for any errors
- [ ] Test production endpoints

## Post-Deployment

### 7. API Testing
- [ ] Update test script with production URL
- [ ] Run test suite:
  ```bash
  bash tests/push-notifications.test.sh
  ```
- [ ] Verify all endpoints are working
- [ ] Check Cloudflare Workers logs for errors

### 8. Mobile App Integration
- [ ] Install Expo dependencies:
  ```bash
  cd mobile
  npx expo install expo-notifications expo-device expo-constants
  ```
- [ ] Copy `mobile/utils/pushNotifications.ts` to your app
- [ ] Copy `mobile/hooks/usePushNotifications.ts` to your app
- [ ] Update `API_URL` in `pushNotifications.ts` to production URL
- [ ] Implement notification permission flow in onboarding
- [ ] Add `usePushNotifications` hook to auth context
- [ ] Implement navigation handlers for all notification types
- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Test notification tap navigation
- [ ] Test badge clearing
- [ ] Test unregister on logout

### 9. Configure app.json (Expo)
- [ ] Add notification configuration to `app.json`:
  ```json
  {
    "expo": {
      "android": {
        "googleServicesFile": "./google-services.json",
        "useNextNotificationsApi": true
      },
      "ios": {
        "bundleIdentifier": "com.bettertogether.app",
        "infoPlist": {
          "UIBackgroundModes": ["remote-notification"]
        }
      },
      "notification": {
        "icon": "./assets/notification-icon.png",
        "color": "#667eea",
        "androidMode": "default",
        "androidCollapsedTitle": "Better Together"
      },
      "plugins": [
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
- [ ] Download `google-services.json` from Firebase Console
- [ ] Place in mobile app root directory
- [ ] Add to `.gitignore`
- [ ] Build new app binary with `eas build`

### 10. Testing with Real Devices

#### iOS Testing
- [ ] Install development build on iOS device
- [ ] Grant notification permissions
- [ ] Register device token
- [ ] Send test notification via backend
- [ ] Verify notification appears
- [ ] Tap notification and verify navigation
- [ ] Test in foreground, background, and killed states
- [ ] Test custom sounds (if configured)
- [ ] Test badge count

#### Android Testing
- [ ] Install development build on Android device
- [ ] Grant notification permissions
- [ ] Register device token
- [ ] Send test notification via backend
- [ ] Verify notification appears
- [ ] Tap notification and verify navigation
- [ ] Test in foreground, background, and killed states
- [ ] Test notification channels (if configured)
- [ ] Test badge count

### 11. Integration with App Features

#### Daily Check-in Reminders
- [ ] Create cron trigger or scheduled worker
- [ ] Query users who haven't checked in today
- [ ] Send `partner_checkin_reminder` notification
- [ ] Schedule for optimal time (e.g., 7 PM local time)

#### Partner Activity Notifications
- [ ] Hook into check-in submission endpoint
- [ ] Get partner user ID
- [ ] Send `partner_activity` notification to partner
- [ ] Include check-in highlights

#### Milestone Achievements
- [ ] Hook into achievement system
- [ ] When milestone unlocked, send `milestone_achieved`
- [ ] Include milestone name and emoji

#### Gift Notifications
- [ ] Hook into gift sending endpoint
- [ ] Send `gift_received` notification to recipient
- [ ] Include sender name and gift type

#### Anniversary Reminders
- [ ] Create scheduled job (cron)
- [ ] Query upcoming anniversaries (7 days, 3 days, 1 day)
- [ ] Send `anniversary_reminder` notification
- [ ] Include days until anniversary

### 12. Monitoring & Analytics
- [ ] Set up Cloudflare Workers analytics
- [ ] Monitor push notification delivery rate
- [ ] Track notification open rates (if possible)
- [ ] Set up alerts for high failure rates
- [ ] Monitor token registration/unregistration trends
- [ ] Create dashboard for notification metrics

### 13. Documentation
- [ ] Review `docs/PUSH_NOTIFICATIONS.md`
- [ ] Share with team
- [ ] Document any custom notification types added
- [ ] Document troubleshooting steps for common issues
- [ ] Add runbook for on-call team

### 14. Security Review
- [ ] Verify admin endpoints require admin key
- [ ] Ensure device tokens are never exposed in API responses
- [ ] Review rate limiting (consider adding to registration endpoint)
- [ ] Verify CORS settings
- [ ] Test with invalid/malicious tokens
- [ ] Ensure secrets are in Cloudflare Secrets (not .env files)

### 15. Performance Testing
- [ ] Test broadcast to large number of devices
- [ ] Verify batch processing works correctly
- [ ] Monitor Worker execution time
- [ ] Check database query performance
- [ ] Test concurrent notification sends
- [ ] Verify no memory leaks

## Production Checklist

### Critical Items (Must Complete)
- [ ] Database migration applied to production
- [ ] All environment variables/secrets configured
- [ ] Backend deployed and tested
- [ ] Mobile app updated with push notification code
- [ ] iOS and Android tested on real devices
- [ ] Notification navigation handlers implemented
- [ ] Unregister on logout implemented

### Important Items (Should Complete)
- [ ] Scheduled jobs for reminders configured
- [ ] Partner activity notifications hooked up
- [ ] Milestone notifications hooked up
- [ ] Gift notifications hooked up
- [ ] Monitoring and analytics set up
- [ ] Team documentation shared

### Nice-to-Have Items (Can Complete Later)
- [ ] Custom notification sounds
- [ ] Rich notifications with images
- [ ] Notification action buttons
- [ ] User notification preferences
- [ ] A/B testing for notification content
- [ ] Localization support

## Rollback Plan

If issues arise, follow this rollback procedure:

1. **Disable Push Notifications:**
   ```bash
   # Set a flag to disable push in your app
   npx wrangler secret put ENABLE_PUSH_NOTIFICATIONS
   # Enter 'false'
   ```

2. **Revert Backend Code:**
   ```bash
   git revert <commit-hash>
   npm run deploy
   ```

3. **Revert Mobile App:**
   - Remove push notification initialization
   - Deploy updated mobile app
   - Or add feature flag to disable push

4. **Database Rollback (if needed):**
   ```bash
   # Drop tables (only if absolutely necessary)
   npx wrangler d1 execute better-together-db --remote --command="DROP TABLE IF EXISTS device_tokens;"
   npx wrangler d1 execute better-together-db --remote --command="DROP TABLE IF EXISTS push_notification_log;"
   ```

## Support Contacts

- **Firebase Issues:** [Firebase Support](https://firebase.google.com/support)
- **Apple APNs Issues:** [Apple Developer Support](https://developer.apple.com/support/)
- **Cloudflare Issues:** [Cloudflare Support](https://support.cloudflare.com/)
- **Expo Issues:** [Expo Support](https://expo.dev/support)

## Additional Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Apple Push Notification Service Documentation](https://developer.apple.com/documentation/usernotifications)
- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Better Together Push Notifications Guide](./docs/PUSH_NOTIFICATIONS.md)

---

**Last Updated:** 2025-12-18
**Version:** 1.0.0
**Status:** Ready for deployment
