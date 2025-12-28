#!/bin/bash

# Push Notification Test Script
# Better Together Live - Automated API Testing
# Usage: ./test-push-notifications.sh <API_URL>

API_URL=${1:-"https://better-together-live.vercel.app"}
TEST_USER_ID="test_user_$(date +%s)"
ANDROID_TOKEN="eXAMPLE_FCM_TOKEN_abc123xyz789def456ghi012jkl345mno678pqr901stu234vwx567yza890bcd123efg456hij789klm012nop345qrs678tuv901wxy234zab567cde890fgh123ijk456lmn789opq012rst345uvw678xyz901abc234def567ghi890jkl123mno456pqr789stu012vwx345yza678bcd901efg234hij567klm890nop123qrs456tuv789wxy012zab345cde678fgh901ijk234lmn567opq890rst123uvw456xyz789"
IOS_TOKEN="1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"

PASS_COUNT=0
FAIL_COUNT=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "Push Notification Test Suite"
echo "API URL: ${API_URL}"
echo "Test User: ${TEST_USER_ID}"
echo "========================================="
echo ""

# Helper function to check response
check_response() {
    local test_name=$1
    local response=$2
    local expected_keyword=$3

    echo -e "${YELLOW}Test: ${test_name}${NC}"
    echo "Response: ${response}"

    if echo "${response}" | grep -q "${expected_keyword}"; then
        echo -e "${GREEN}✅ PASS${NC}"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "${RED}❌ FAIL${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    echo ""
}

# Test 1: Register Android token
echo "========================================="
echo "Test 1: Register Android Token"
echo "========================================="
response=$(curl -s -X POST ${API_URL}/api/push/register \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"${TEST_USER_ID}\",\"device_token\":\"${ANDROID_TOKEN}\",\"platform\":\"android\"}")
check_response "Android Token Registration" "${response}" "token_id"

# Test 2: Register iOS token
echo "========================================="
echo "Test 2: Register iOS Token"
echo "========================================="
response=$(curl -s -X POST ${API_URL}/api/push/register \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"${TEST_USER_ID}\",\"device_token\":\"${IOS_TOKEN}\",\"platform\":\"ios\"}")
check_response "iOS Token Registration" "${response}" "token_id"

# Test 3: Get user tokens
echo "========================================="
echo "Test 3: Get User Tokens"
echo "========================================="
response=$(curl -s -X GET ${API_URL}/api/push/tokens/${TEST_USER_ID})
check_response "Get User Tokens" "${response}" "device_count"

# Test 4: Invalid Android token format
echo "========================================="
echo "Test 4: Invalid Android Token Format"
echo "========================================="
response=$(curl -s -X POST ${API_URL}/api/push/register \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"${TEST_USER_ID}\",\"device_token\":\"invalid_short_token\",\"platform\":\"android\"}")
check_response "Invalid Android Token" "${response}" "Invalid"

# Test 5: Invalid iOS token format
echo "========================================="
echo "Test 5: Invalid iOS Token Format"
echo "========================================="
response=$(curl -s -X POST ${API_URL}/api/push/register \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"${TEST_USER_ID}\",\"device_token\":\"invalid_not_hex\",\"platform\":\"ios\"}")
check_response "Invalid iOS Token" "${response}" "Invalid"

# Test 6: Send daily_prompt notification
echo "========================================="
echo "Test 6: Send Daily Prompt Notification"
echo "========================================="
response=$(curl -s -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"${TEST_USER_ID}\",\"notification_type\":\"daily_prompt\",\"payload\":[\"What made you smile today?\"]}")
check_response "Send Daily Prompt" "${response}" "sent"

# Test 7: Send partner_activity notification
echo "========================================="
echo "Test 7: Send Partner Activity Notification"
echo "========================================="
response=$(curl -s -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"${TEST_USER_ID}\",\"notification_type\":\"partner_activity\",\"payload\":[\"Sarah\",\"Just finished a workout!\"]}")
check_response "Send Partner Activity" "${response}" "sent"

# Test 8: Send milestone_achieved notification
echo "========================================="
echo "Test 8: Send Milestone Notification"
echo "========================================="
response=$(curl -s -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"${TEST_USER_ID}\",\"notification_type\":\"milestone_achieved\",\"payload\":[\"100-day streak\",\"🎉\"]}")
check_response "Send Milestone" "${response}" "sent"

# Test 9: Send custom notification
echo "========================================="
echo "Test 9: Send Custom Notification"
echo "========================================="
response=$(curl -s -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"${TEST_USER_ID}\",\"custom_payload\":{\"title\":\"Test Notification\",\"body\":\"This is a test\",\"data\":{\"test\":true}}}")
check_response "Send Custom Notification" "${response}" "sent"

# Test 10: Send to non-existent user
echo "========================================="
echo "Test 10: Send to Non-existent User"
echo "========================================="
response=$(curl -s -X POST ${API_URL}/api/push/send \
  -H "Content-Type: application/json" \
  -d "{\"user_id\":\"non_existent_user_12345\",\"notification_type\":\"daily_prompt\",\"payload\":[\"Test\"]}")
check_response "Non-existent User" "${response}" "No device tokens"

# Test 11: Unregister Android token
echo "========================================="
echo "Test 11: Unregister Android Token"
echo "========================================="
response=$(curl -s -X DELETE ${API_URL}/api/push/unregister \
  -H "Content-Type: application/json" \
  -d "{\"device_token\":\"${ANDROID_TOKEN}\",\"user_id\":\"${TEST_USER_ID}\"}")
check_response "Unregister Android Token" "${response}" "unregistered"

# Test 12: Unregister iOS token
echo "========================================="
echo "Test 12: Unregister iOS Token"
echo "========================================="
response=$(curl -s -X DELETE ${API_URL}/api/push/unregister \
  -H "Content-Type: application/json" \
  -d "{\"device_token\":\"${IOS_TOKEN}\",\"user_id\":\"${TEST_USER_ID}\"}")
check_response "Unregister iOS Token" "${response}" "unregistered"

# Test 13: Verify tokens removed
echo "========================================="
echo "Test 13: Verify Tokens Removed"
echo "========================================="
response=$(curl -s -X GET ${API_URL}/api/push/tokens/${TEST_USER_ID})
if echo "${response}" | grep -q '"device_count":0' || echo "${response}" | grep -q '"device_count": 0'; then
    echo -e "${GREEN}✅ PASS - All tokens removed${NC}"
    PASS_COUNT=$((PASS_COUNT + 1))
else
    echo -e "${RED}❌ FAIL - Tokens still exist${NC}"
    FAIL_COUNT=$((FAIL_COUNT + 1))
fi
echo "Response: ${response}"
echo ""

# Summary
echo "========================================="
echo "Test Results Summary"
echo "========================================="
echo -e "Total Tests: $((PASS_COUNT + FAIL_COUNT))"
echo -e "${GREEN}Passed: ${PASS_COUNT}${NC}"
echo -e "${RED}Failed: ${FAIL_COUNT}${NC}"
echo ""

if [ ${FAIL_COUNT} -eq 0 ]; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
    exit 0
else
    echo -e "${RED}❌ Some tests failed. Please review the output above.${NC}"
    exit 1
fi
