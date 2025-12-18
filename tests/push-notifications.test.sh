#!/bin/bash
# Push Notification API Test Suite
# Tests all endpoints of the push notification system

set -e

# Configuration
API_URL="https://better-together.app"  # Update with your actual URL
# For local testing: API_URL="http://localhost:3000"

# Test user data
TEST_USER_1="test_user_$(date +%s)"
TEST_USER_2="test_user_$(date +%s)_2"
TEST_FCM_TOKEN="eXAMPLE_FCM_TOKEN_abc123xyz789_test_token_$(date +%s)"
TEST_APNS_TOKEN="1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
ADMIN_KEY="your_admin_api_key_here"  # Update with actual admin key

echo "========================================="
echo "Push Notification API Test Suite"
echo "========================================="
echo ""
echo "API URL: $API_URL"
echo "Test User 1: $TEST_USER_1"
echo "Test User 2: $TEST_USER_2"
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test counter
TESTS_PASSED=0
TESTS_FAILED=0

# Test function
test_endpoint() {
    local test_name="$1"
    local expected_status="$2"
    local response="$3"
    local actual_status=$(echo "$response" | tail -n1)

    echo -n "Testing: $test_name ... "

    if [ "$actual_status" = "$expected_status" ]; then
        echo -e "${GREEN}PASS${NC} (HTTP $actual_status)"
        TESTS_PASSED=$((TESTS_PASSED + 1))
        # Show response body (all but last line which is status code)
        echo "$response" | head -n -1 | jq '.' 2>/dev/null || echo "$response" | head -n -1
    else
        echo -e "${RED}FAIL${NC} (Expected HTTP $expected_status, got HTTP $actual_status)"
        TESTS_FAILED=$((TESTS_FAILED + 1))
        echo "$response" | head -n -1
    fi
    echo ""
}

echo "========================================="
echo "1. DEVICE REGISTRATION TESTS"
echo "========================================="
echo ""

# Test 1: Register Android device
echo "Test 1.1: Register Android device (FCM)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$TEST_USER_1\",
    \"device_token\": \"$TEST_FCM_TOKEN\",
    \"platform\": \"android\"
  }")
test_endpoint "Register Android device" "201" "$RESPONSE"

# Test 2: Register iOS device
echo "Test 1.2: Register iOS device (APNs)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$TEST_USER_2\",
    \"device_token\": \"$TEST_APNS_TOKEN\",
    \"platform\": \"ios\"
  }")
test_endpoint "Register iOS device" "201" "$RESPONSE"

# Test 3: Re-register same token (should update)
echo "Test 1.3: Re-register same token (should update)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$TEST_USER_1\",
    \"device_token\": \"$TEST_FCM_TOKEN\",
    \"platform\": \"android\"
  }")
test_endpoint "Re-register token" "200" "$RESPONSE"

# Test 4: Invalid platform
echo "Test 1.4: Register with invalid platform (should fail)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$TEST_USER_1\",
    \"device_token\": \"test_token\",
    \"platform\": \"windows\"
  }")
test_endpoint "Invalid platform" "400" "$RESPONSE"

# Test 5: Missing required fields
echo "Test 1.5: Register without user_id (should fail)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/register" \
  -H "Content-Type: application/json" \
  -d "{
    \"device_token\": \"test_token\",
    \"platform\": \"android\"
  }")
test_endpoint "Missing user_id" "400" "$RESPONSE"

echo ""
echo "========================================="
echo "2. GET DEVICE TOKENS TESTS"
echo "========================================="
echo ""

# Test 6: Get user's device tokens
echo "Test 2.1: Get user's registered devices"
RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/api/push/tokens/$TEST_USER_1")
test_endpoint "Get device tokens" "200" "$RESPONSE"

echo ""
echo "========================================="
echo "3. SEND NOTIFICATION TESTS"
echo "========================================="
echo ""

# Test 7: Send partner_checkin_reminder
echo "Test 3.1: Send partner check-in reminder"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/send" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$TEST_USER_1\",
    \"notification_type\": \"partner_checkin_reminder\",
    \"payload\": [\"Sarah\"]
  }")
test_endpoint "Send partner_checkin_reminder" "200" "$RESPONSE"

# Test 8: Send partner_activity
echo "Test 3.2: Send partner activity notification"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/send" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$TEST_USER_1\",
    \"notification_type\": \"partner_activity\",
    \"payload\": [\"John\", \"Just completed today's check-in!\"]
  }")
test_endpoint "Send partner_activity" "200" "$RESPONSE"

# Test 9: Send milestone_achieved
echo "Test 3.3: Send milestone achieved notification"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/send" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$TEST_USER_1\",
    \"notification_type\": \"milestone_achieved\",
    \"payload\": [\"100-day streak\", \"🎉\"]
  }")
test_endpoint "Send milestone_achieved" "200" "$RESPONSE"

# Test 10: Send daily_prompt
echo "Test 3.4: Send daily prompt notification"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/send" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$TEST_USER_1\",
    \"notification_type\": \"daily_prompt\",
    \"payload\": [\"What made you smile today?\"]
  }")
test_endpoint "Send daily_prompt" "200" "$RESPONSE"

# Test 11: Send gift_received
echo "Test 3.5: Send gift received notification"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/send" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$TEST_USER_1\",
    \"notification_type\": \"gift_received\",
    \"payload\": [\"Sarah\", \"Virtual Hug\"]
  }")
test_endpoint "Send gift_received" "200" "$RESPONSE"

# Test 12: Send custom notification
echo "Test 3.6: Send custom notification"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/send" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$TEST_USER_1\",
    \"custom_payload\": {
      \"title\": \"Custom Test Notification\",
      \"body\": \"This is a custom test message\",
      \"data\": {
        \"test\": true,
        \"timestamp\": $(date +%s)
      },
      \"badge\": 5,
      \"sound\": \"default\"
    }
  }")
test_endpoint "Send custom notification" "200" "$RESPONSE"

# Test 13: Send to non-existent user
echo "Test 3.7: Send to user with no devices registered"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/send" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"nonexistent_user_123\",
    \"notification_type\": \"daily_prompt\",
    \"payload\": [\"Test prompt\"]
  }")
test_endpoint "Send to non-existent user" "200" "$RESPONSE"

# Test 14: Send without required fields
echo "Test 3.8: Send without user_id (should fail)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/send" \
  -H "Content-Type: application/json" \
  -d "{
    \"notification_type\": \"daily_prompt\",
    \"payload\": [\"Test\"]
  }")
test_endpoint "Send without user_id" "400" "$RESPONSE"

echo ""
echo "========================================="
echo "4. BROADCAST TESTS (Admin Only)"
echo "========================================="
echo ""

# Test 15: Broadcast without admin key (should fail)
echo "Test 4.1: Broadcast without admin key (should fail)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/broadcast" \
  -H "Content-Type: application/json" \
  -d "{
    \"notification_type\": \"daily_prompt\",
    \"payload\": [\"System announcement\"]
  }")
test_endpoint "Broadcast without admin key" "401" "$RESPONSE"

# Test 16: Broadcast with admin key
echo "Test 4.2: Broadcast with admin key"
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/broadcast" \
  -H "Content-Type: application/json" \
  -d "{
    \"admin_key\": \"$ADMIN_KEY\",
    \"custom_payload\": {
      \"title\": \"System Announcement\",
      \"body\": \"Test broadcast notification to all users\"
    }
  }")
# Note: Will likely fail with 401 if ADMIN_KEY is not set correctly, that's expected
echo "Note: This test requires valid ADMIN_API_KEY to be set"
echo "$RESPONSE" | head -n -1 | jq '.' 2>/dev/null || echo "$RESPONSE" | head -n -1
echo ""

echo ""
echo "========================================="
echo "5. UNREGISTER TESTS"
echo "========================================="
echo ""

# Test 17: Unregister device token
echo "Test 5.1: Unregister device token"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/api/push/unregister" \
  -H "Content-Type: application/json" \
  -d "{
    \"device_token\": \"$TEST_FCM_TOKEN\",
    \"user_id\": \"$TEST_USER_1\"
  }")
test_endpoint "Unregister device" "200" "$RESPONSE"

# Test 18: Unregister already unregistered token (should fail)
echo "Test 5.2: Unregister non-existent token (should fail)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/api/push/unregister" \
  -H "Content-Type: application/json" \
  -d "{
    \"device_token\": \"$TEST_FCM_TOKEN\",
    \"user_id\": \"$TEST_USER_1\"
  }")
test_endpoint "Unregister non-existent token" "404" "$RESPONSE"

# Test 19: Unregister without token (should fail)
echo "Test 5.3: Unregister without device_token (should fail)"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/api/push/unregister" \
  -H "Content-Type: application/json" \
  -d "{
    \"user_id\": \"$TEST_USER_1\"
  }")
test_endpoint "Unregister without token" "400" "$RESPONSE"

# Test 20: Unregister iOS device
echo "Test 5.4: Unregister iOS device"
RESPONSE=$(curl -s -w "\n%{http_code}" -X DELETE "$API_URL/api/push/unregister" \
  -H "Content-Type: application/json" \
  -d "{
    \"device_token\": \"$TEST_APNS_TOKEN\",
    \"user_id\": \"$TEST_USER_2\"
  }")
test_endpoint "Unregister iOS device" "200" "$RESPONSE"

echo ""
echo "========================================="
echo "TEST SUMMARY"
echo "========================================="
echo ""
echo -e "${GREEN}Tests Passed: $TESTS_PASSED${NC}"
echo -e "${RED}Tests Failed: $TESTS_FAILED${NC}"
echo ""

TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}All tests passed! ✓${NC}"
    exit 0
else
    echo -e "${RED}Some tests failed. Please review the output above.${NC}"
    exit 1
fi
