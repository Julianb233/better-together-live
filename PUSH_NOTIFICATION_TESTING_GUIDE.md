# Push Notification Testing Guide
**Project:** Better Together Live
**Purpose:** Comprehensive testing procedures for push notifications
**Status:** Ready to test

## Overview

This guide provides step-by-step testing procedures and scripts to verify push notification functionality for both iOS and Android platforms.

---

## Testing Environment Setup

### Prerequisites

- [ ] Backend deployed with push notification endpoints
- [ ] Firebase (FCM) configured for Android
- [ ] APNs configured for iOS
- [ ] Physical devices for testing (simulators have limited push support)
- [ ] curl or Postman for API testing

### Environment URLs

**Development:**
```
API_BASE_URL=http://localhost:8787
```

**Staging/Production:**
```
API_BASE_URL=https://better-together-live.vercel.app
```

---

## Test Suite 1: Backend API Testing

### Test 1.1: Health Check

Verify the push notification API is accessible.

```bash
# Replace with your actual API URL
API_URL="https://better-together-live.vercel.app"

curl -X GET ${API_URL}/api/push/tokens/test_user
```

**Expected Response:**
```json
{
  "user_id": "test_user",
  "device_count": 0,
  "devices": []
}
```

**Status:** ✅ Pass / ❌ Fail

---

### Test 1.2: Register Android Device Token

Test device token registration for Android.

```bash
API_URL="https://better-together-live.vercel.app"

curl -X POST ${API_URL}/api/push/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_android",
    "device_token": "eXAMPLE_FCM_TOKEN_abc123xyz789def456ghi012jkl345mno678pqr901stu234vwx567yza890bcd123efg456hij789klm012nop345qrs678tuv901wxy234zab567cde890fgh123ijk456lmn789opq012rst345uvw678xyz901abc234def567ghi890jkl123mno456pqr789stu012vwx345yza678bcd901efg234hij567klm890nop123qrs456tuv789wxy012zab345cde678fgh901ijk234lmn567opq890rst123uvw456xyz789",
    "platform": "android"
  }'
```

**Expected Response:**
```json
{
  "message": "Device token registered successfully",
  "token_id": "dt_[timestamp]_[random]",
  "platform": "android"
}
```

**Status:** ✅ Pass / ❌ Fail

---

### Test 1.3: Register iOS Device Token

Test device token registration for iOS.

```bash
API_URL="https://better-together-live.vercel.app"

curl -X POST ${API_URL}/api/push/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_ios",
    "device_token": "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "platform": "ios"
  }'
```

**Expected Response:**
```json
{
  "message": "Device token registered successfully",
  "token_id": "dt_[timestamp]_[random]",
  "platform": "ios"
}
```

**Status:** ✅ Pass / ❌ Fail

---

### Test 1.4: Invalid Token Format (Android)

Test validation of Android FCM token format.

```bash
API_URL="https://better-together-live.vercel.app"

curl -X POST ${API_URL}/api/push/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "device_token": "invalid_token_too_short",
    "platform": "android"
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid FCM token format"
}
```

**Expected Status Code:** 400

**Status:** ✅ Pass / ❌ Fail

---

### Test 1.5: Invalid Token Format (iOS)

Test validation of iOS APNs token format.

```bash
API_URL="https://better-together-live.vercel.app"

curl -X POST ${API_URL}/api/push/register \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "device_token": "invalid_token_not_64_hex",
    "platform": "ios"
  }'
```

**Expected Response:**
```json
{
  "error": "Invalid APNs token format"
}
```

**Expected Status Code:** 400

**Status:** ✅ Pass / ❌ Fail

---

### Test 1.6: Get User Device Tokens

Retrieve all tokens registered for a user.

```bash
API_URL="https://better-together-live.vercel.app"

curl -X GET ${API_URL}/api/push/tokens/test_user_android
```

**Expected Response:**
```json
{
  "user_id": "test_user_android",
  "device_count": 1,
  "devices": [
    {
      "id": "dt_[timestamp]_[random]",
      "platform": "android",
      "registered_at": "[ISO timestamp]",
      "token_preview": "eXAMPLE_FC..."
    }
  ]
}
```

**Status:** ✅ Pass / ❌ Fail

---

### Test 1.7: Send Template Notification

Test sending notification using a pre-built template.

```bash
API_URL="https://better-together-live.vercel.app"

curl -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_android",
    "notification_type": "daily_prompt",
    "payload": ["What made you smile today?"]
  }'
```

**Expected Response (Development Mode - no FCM keys):**
```json
{
  "message": "Push notifications simulated (dev mode)",
  "sent": 1,
  "failed": 0,
  "simulated": 1,
  "dev_mode": true
}
```

**Expected Response (Production Mode - with FCM keys):**
```json
{
  "message": "Push notifications sent",
  "sent": 1,
  "failed": 0
}
```

**Status:** ✅ Pass / ❌ Fail

---

### Test 1.8: Send Custom Notification

Test sending notification with custom payload.

```bash
API_URL="https://better-together-live.vercel.app"

curl -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user_android",
    "custom_payload": {
      "title": "Custom Test Notification",
      "body": "This is a test notification with custom content",
      "data": {
        "test": true,
        "action": "open_test_screen"
      },
      "badge": 5,
      "sound": "default"
    }
  }'
```

**Expected Response:**
```json
{
  "message": "Push notifications sent",
  "sent": 1,
  "failed": 0
}
```

**Status:** ✅ Pass / ❌ Fail

---

### Test 1.9: Unregister Device Token

Test removing a device token.

```bash
API_URL="https://better-together-live.vercel.app"

curl -X DELETE ${API_URL}/api/push/unregister \
  -H "Content-Type: application/json" \
  -d '{
    "device_token": "eXAMPLE_FCM_TOKEN_abc123xyz789...",
    "user_id": "test_user_android"
  }'
```

**Expected Response:**
```json
{
  "message": "Device token unregistered successfully"
}
```

**Status:** ✅ Pass / ❌ Fail

---

### Test 1.10: Broadcast Notification (Admin)

Test broadcasting to all users (requires admin key).

```bash
API_URL="https://better-together-live.vercel.app"
ADMIN_KEY="your_admin_api_key_here"

curl -X POST ${API_URL}/api/push/broadcast \
  -H "Content-Type: application/json" \
  -d "{
    \"admin_key\": \"${ADMIN_KEY}\",
    \"custom_payload\": {
      \"title\": \"System Announcement\",
      \"body\": \"This is a test broadcast message\",
      \"data\": {
        \"type\": \"announcement\"
      }
    }
  }"
```

**Expected Response:**
```json
{
  "message": "Broadcast completed",
  "total_devices": 10,
  "sent": 10,
  "failed": 0
}
```

**Status:** ✅ Pass / ❌ Fail

---

## Test Suite 2: All Notification Templates

### Test 2.1: Partner Check-in Reminder

```bash
curl -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "notification_type": "partner_checkin_reminder",
    "payload": ["Sarah"]
  }'
```

**Expected Notification:**
- Title: "Time for your daily check-in!"
- Body: "Sarah is waiting to connect with you today."

---

### Test 2.2: Partner Activity

```bash
curl -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "notification_type": "partner_activity",
    "payload": ["Sarah", "Just finished a great workout!"]
  }'
```

**Expected Notification:**
- Title: "Sarah just checked in!"
- Body: "They shared: \"Just finished a great workout!\""

---

### Test 2.3: Milestone Achieved

```bash
curl -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "notification_type": "milestone_achieved",
    "payload": ["100-day streak", "🎉"]
  }'
```

**Expected Notification:**
- Title: "🎉 Milestone Achieved!"
- Body: "You've reached: 100-day streak"

---

### Test 2.4: Daily Prompt

```bash
curl -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "notification_type": "daily_prompt",
    "payload": ["What are you grateful for today?"]
  }'
```

**Expected Notification:**
- Title: "Your Daily Relationship Prompt"
- Body: "What are you grateful for today?"

---

### Test 2.5: Gift Received

```bash
curl -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "notification_type": "gift_received",
    "payload": ["Sarah", "Virtual Hug"]
  }'
```

**Expected Notification:**
- Title: "🎁 You received a gift!"
- Body: "Sarah sent you a Virtual Hug"

---

### Test 2.6: Anniversary Reminder (Same Day)

```bash
curl -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "notification_type": "anniversary_reminder",
    "payload": ["1-year anniversary", 0]
  }'
```

**Expected Notification:**
- Title: "1-year anniversary is coming up!"
- Body: "Today is your 1-year anniversary! 💕"

---

### Test 2.7: Anniversary Reminder (7 Days)

```bash
curl -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "notification_type": "anniversary_reminder",
    "payload": ["1-year anniversary", 7]
  }'
```

**Expected Notification:**
- Title: "1-year anniversary is coming up!"
- Body: "Your 1-year anniversary is in 7 days!"

---

### Test 2.8: Goal Completed

```bash
curl -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "test_user",
    "notification_type": "goal_completed",
    "payload": ["5 Date Nights This Month"]
  }'
```

**Expected Notification:**
- Title: "🎯 Goal Completed!"
- Body: "You completed: 5 Date Nights This Month"

---

## Test Suite 3: Mobile App Testing

### Test 3.1: Permission Request Flow

**Test on iOS:**
1. Install app on physical device
2. Open app for first time
3. App should request notification permissions
4. Accept permissions
5. Check console for token registration

**Expected Behavior:**
- System permission dialog appears
- After accepting, token is registered with backend
- Console shows: "Push token registered: [token_id]"

**Status:** ✅ Pass / ❌ Fail

---

### Test 3.2: Foreground Notification

**Test Procedure:**
1. Open app
2. Send notification via API
3. Notification should appear as banner at top

**Expected Behavior:**
- Banner appears at top of screen
- Shows notification title and body
- Plays sound
- Can be dismissed

**Status:** ✅ Pass / ❌ Fail

---

### Test 3.3: Background Notification

**Test Procedure:**
1. Open app
2. Switch to home screen (app in background)
3. Send notification via API
4. Notification appears in notification center

**Expected Behavior:**
- Notification appears in system notification center
- Shows icon, title, and body
- Badge count increments
- Plays sound

**Status:** ✅ Pass / ❌ Fail

---

### Test 3.4: Notification Tap Navigation

**Test Procedure:**
1. App in background
2. Send notification with action: "open_checkin"
3. Tap notification
4. App opens and navigates to check-in screen

**Test Each Action:**
- [ ] `open_checkin` → CheckIn screen
- [ ] `view_checkin` → Partner Activity screen
- [ ] `view_achievements` → Achievements screen
- [ ] `view_prompt` → Daily Prompt screen
- [ ] `view_gifts` → Gifts screen
- [ ] `view_calendar` → Calendar screen
- [ ] `view_goals` → Goals screen

**Status:** ✅ Pass / ❌ Fail

---

### Test 3.5: Badge Count

**Test Procedure:**
1. Send 3 notifications while app is closed
2. Check app icon - should show badge count: 3
3. Open app
4. Badge count should clear to 0

**Expected Behavior:**
- Badge count increments with each notification
- Badge clears when app opens

**Status:** ✅ Pass / ❌ Fail

---

### Test 3.6: Logout Token Cleanup

**Test Procedure:**
1. Login and verify token is registered
2. Logout from app
3. Verify token is removed from backend

```bash
# Check tokens before logout
curl -X GET ${API_URL}/api/push/tokens/test_user

# After logout, check again
curl -X GET ${API_URL}/api/push/tokens/test_user
```

**Expected Behavior:**
- Before logout: device_count = 1
- After logout: device_count = 0

**Status:** ✅ Pass / ❌ Fail

---

## Test Suite 4: Error Handling

### Test 4.1: Network Error Handling

**Test Procedure:**
1. Disable internet on device
2. Open app
3. App should handle token registration failure gracefully

**Expected Behavior:**
- No crash
- Error logged to console
- User can still use app
- Retry on next app open when network available

**Status:** ✅ Pass / ❌ Fail

---

### Test 4.2: Invalid Token Handling

**Test Procedure:**
1. Send notification to non-existent user
2. Backend should handle gracefully

```bash
curl -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "non_existent_user_12345",
    "notification_type": "daily_prompt",
    "payload": ["Test"]
  }'
```

**Expected Response:**
```json
{
  "message": "No device tokens registered for this user",
  "sent": 0
}
```

**Status:** ✅ Pass / ❌ Fail

---

### Test 4.3: Permission Denied

**Test Procedure:**
1. Deny notification permissions
2. App should handle gracefully
3. User should still be able to use app

**Expected Behavior:**
- No crash
- Console logs warning
- App functions normally without push notifications

**Status:** ✅ Pass / ❌ Fail

---

## Test Suite 5: Production Readiness

### Test 5.1: FCM Production Keys

**Verification:**
```bash
npx wrangler secret list
```

**Expected Output:**
- FCM_SERVER_KEY
- FCM_PROJECT_ID

**Status:** ✅ Pass / ❌ Fail

---

### Test 5.2: APNs Production Keys

**Verification:**
```bash
npx wrangler secret list
```

**Expected Output:**
- APNS_TEAM_ID
- APNS_KEY_ID
- APNS_PRIVATE_KEY
- APNS_BUNDLE_ID
- APNS_PRODUCTION

**Status:** ✅ Pass / ❌ Fail

---

### Test 5.3: Database Migration

**Verification:**
```bash
# Check if tables exist
npx wrangler d1 execute better-together-db --remote --command "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('device_tokens', 'push_notification_log')"
```

**Expected Output:**
- device_tokens
- push_notification_log

**Status:** ✅ Pass / ❌ Fail

---

### Test 5.4: Rate Limiting

**Test Procedure:**
Send 100 registration requests rapidly.

**Expected Behavior:**
- Backend handles load gracefully
- No crashes
- All valid requests processed

**Status:** ✅ Pass / ❌ Fail

---

## Test Suite 6: Performance Testing

### Test 6.1: Token Registration Time

**Test Procedure:**
Measure time from app open to token registration.

**Expected:** < 2 seconds

**Status:** ✅ Pass / ❌ Fail

---

### Test 6.2: Notification Delivery Time

**Test Procedure:**
1. Send notification via API
2. Measure time until received on device

**Expected:** < 5 seconds

**Status:** ✅ Pass / ❌ Fail

---

### Test 6.3: Broadcast Performance

**Test Procedure:**
Broadcast to 1000+ devices.

**Expected:**
- All devices receive within 30 seconds
- Backend handles load
- No crashes

**Status:** ✅ Pass / ❌ Fail

---

## Automated Test Script

Save this as `/root/github-repos/better-together-live/test-push-notifications.sh`:

```bash
#!/bin/bash

# Push Notification Test Script
# Usage: ./test-push-notifications.sh <API_URL>

API_URL=${1:-"https://better-together-live.vercel.app"}
TEST_USER_ID="test_user_$(date +%s)"
ANDROID_TOKEN="eXAMPLE_FCM_TOKEN_abc123xyz789def456ghi012jkl345mno678pqr901stu234vwx567yza890bcd123efg456hij789klm012nop345qrs678tuv901wxy234zab567cde890fgh123ijk456lmn789opq012rst345uvw678xyz901abc234def567ghi890jkl123mno456pqr789stu012vwx345yza678bcd901efg234hij567klm890nop123qrs456tuv789wxy012zab345cde678fgh901ijk234lmn567opq890rst123uvw456xyz789"
IOS_TOKEN="1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

echo "========================================="
echo "Push Notification Test Suite"
echo "API URL: ${API_URL}"
echo "========================================="
echo ""

# Test 1: Register Android token
echo "Test 1: Register Android Token"
response=$(curl -s -X POST ${API_URL}/api/push/register \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"${TEST_USER_ID}\",\"device_token\":\"${ANDROID_TOKEN}\",\"platform\":\"android\"}")
echo "Response: ${response}"
echo ""

# Test 2: Register iOS token
echo "Test 2: Register iOS Token"
response=$(curl -s -X POST ${API_URL}/api/push/register \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"${TEST_USER_ID}\",\"device_token\":\"${IOS_TOKEN}\",\"platform\":\"ios\"}")
echo "Response: ${response}"
echo ""

# Test 3: Get user tokens
echo "Test 3: Get User Tokens"
response=$(curl -s -X GET ${API_URL}/api/push/tokens/${TEST_USER_ID})
echo "Response: ${response}"
echo ""

# Test 4: Send test notification
echo "Test 4: Send Test Notification"
response=$(curl -s -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"${TEST_USER_ID}\",\"notification_type\":\"daily_prompt\",\"payload\":[\"Test notification\"]}")
echo "Response: ${response}"
echo ""

# Test 5: Unregister Android token
echo "Test 5: Unregister Android Token"
response=$(curl -s -X DELETE ${API_URL}/api/push/unregister \
  -H "Content-Type: application/json" \
  -d "{\"device_token\":\"${ANDROID_TOKEN}\",\"user_id\":\"${TEST_USER_ID}\"}")
echo "Response: ${response}"
echo ""

echo "========================================="
echo "Test Suite Complete"
echo "========================================="
```

Make it executable:
```bash
chmod +x /root/github-repos/better-together-live/test-push-notifications.sh
```

Run it:
```bash
./test-push-notifications.sh https://better-together-live.vercel.app
```

---

## Test Results Summary

| Test Suite | Total Tests | Passed | Failed | Status |
|------------|-------------|--------|--------|--------|
| Backend API | 10 | - | - | ⏳ Pending |
| Templates | 8 | - | - | ⏳ Pending |
| Mobile App | 6 | - | - | ⏳ Pending |
| Error Handling | 3 | - | - | ⏳ Pending |
| Production | 4 | - | - | ⏳ Pending |
| Performance | 3 | - | - | ⏳ Pending |

**Overall Status:** ⏳ Ready to test

---

## Sign-off

- [ ] All backend API tests passed
- [ ] All notification templates tested
- [ ] Mobile app integration tested on iOS
- [ ] Mobile app integration tested on Android
- [ ] Error handling verified
- [ ] Production keys configured
- [ ] Performance metrics acceptable

**Tested by:** _________________
**Date:** _________________
**Status:** ⏳ Pending / ✅ Approved / ❌ Issues Found
