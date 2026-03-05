# Testing Patterns

**Analysis Date:** 2026-03-05

## Test Framework

**Runner:**
- No test runner configured in `package.json` dependencies (no vitest, jest, or mocha)
- The `mobile/` directory references Jest (via `jest.mock()`, `jest.fn()`) but Jest is not in `package.json`
- `npm run test` is defined as `curl http://localhost:3000` -- a basic smoke check, not a test suite

**Assertion Library:**
- Mobile tests use Jest's built-in `expect()` assertions
- No assertion library for the main server-side codebase

**Run Commands:**
```bash
npm run test               # Just curls localhost:3000 (smoke test)
./test-push-notifications.sh [API_URL]  # Bash-based API integration tests
./tests/push-notifications.test.sh      # More detailed bash API tests
```

## Test File Organization

**Location:**
- `tests/` directory at project root -- contains 1 file: `tests/push-notifications.test.sh`
- `test-push-notifications.sh` at project root -- duplicate/variant of the above
- `mobile/src/api/__tests__/client.test.ts` -- Jest unit tests for mobile API client
- `mobile/__mocks__/axios.ts` -- Jest mock for axios

**Naming:**
- Bash test scripts: `*.test.sh` or `test-*.sh`
- TypeScript tests (mobile): `*.test.ts` in `__tests__/` directories

**Structure:**
```
better-together-live/
  tests/
    push-notifications.test.sh    # Bash integration tests for push API
  test-push-notifications.sh      # Root-level duplicate push API tests
  mobile/
    __mocks__/
      axios.ts                    # Jest mock for axios
    src/
      api/
        __tests__/
          client.test.ts          # Jest unit tests (20 tests)
```

## Test Structure

**Bash API Tests (`test-push-notifications.sh`):**
```bash
#!/bin/bash
API_URL=${1:-"https://better-together-live.vercel.app"}
TEST_USER_ID="test_user_$(date +%s)"

# Helper function
check_response() {
    local test_name=$1
    local response=$2
    local expected_keyword=$3
    if echo "${response}" | grep -q "${expected_keyword}"; then
        echo -e "${GREEN}PASS${NC}"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "${RED}FAIL${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
}

# Test: curl endpoint, check response contains keyword
response=$(curl -s -X POST ${API_URL}/api/push/register \
  -H "Content-Type: application/json" \
  -d '{"user_id":"...","device_token":"...","platform":"android"}')
check_response "Android Token Registration" "${response}" "token_id"
```

**Bash API Tests (`tests/push-notifications.test.sh`):**
```bash
# More structured variant with HTTP status code checking
test_endpoint() {
    local test_name="$1"
    local expected_status="$2"
    local response="$3"
    local actual_status=$(echo "$response" | tail -n1)
    if [ "$actual_status" = "$expected_status" ]; then
        echo -e "${GREEN}PASS${NC} (HTTP $actual_status)"
    else
        echo -e "${RED}FAIL${NC} (Expected HTTP $expected_status, got HTTP $actual_status)"
    fi
}

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/register" ...)
test_endpoint "Register Android device" "201" "$RESPONSE"
```

**Jest Tests (Mobile - `mobile/src/api/__tests__/client.test.ts`):**
```typescript
describe('API Client', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /users - Create User', () => {
    it('Test 1: should handle successful user creation', async () => {
      const mockClient = {
        post: jest.fn().mockResolvedValueOnce({
          data: { user: { id: '123', email: 'john@example.com' } },
        }),
        interceptors: {
          request: { use: jest.fn(), eject: jest.fn() },
          response: { use: jest.fn(), eject: jest.fn() },
        },
      }
      ;(axios.create as jest.Mock).mockReturnValueOnce(mockClient)

      const response = await mockClient.post('/users', { email: '...', name: '...' })
      expect(response.data.user).toBeDefined()
    })
  })
})
```

## Mocking

**Framework:** Jest (mobile tests only)

**Patterns:**
```typescript
// Module-level mocks
jest.mock('axios')
jest.mock('@react-native-async-storage/async-storage')

// Per-test mock setup
const mockClient = {
  post: jest.fn().mockResolvedValueOnce({ data: { ... } }),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
}
;(axios.create as jest.Mock).mockReturnValueOnce(mockClient)
```

**Manual Mock File (`mobile/__mocks__/axios.ts`):**
```typescript
const mockAxios = {
  create: jest.fn(function () {
    return {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn() },
      },
    }
  }),
  // ... top-level methods
}
export default mockAxios
```

**What to Mock:**
- External HTTP clients (axios)
- Device storage (AsyncStorage)

**What NOT to Mock:**
- No guidance established; current tests heavily mock everything including the client being tested

## Fixtures and Factories

**Test Data:**
- Bash tests generate unique test data per run using timestamps:
  ```bash
  TEST_USER_ID="test_user_$(date +%s)"
  ```
- Jest tests use inline mock data objects per test (no shared fixtures or factories)
- No factory functions or fixture files exist

**Location:**
- All test data is inline within test files

## Coverage

**Requirements:** None enforced

**Current State:**
- No coverage tool configured
- No coverage thresholds set
- No CI coverage gates

## Test Types

**Unit Tests:**
- 1 file: `mobile/src/api/__tests__/client.test.ts` (20 tests)
- Tests mock-level interactions with axios client
- Tests AsyncStorage get/set operations
- Does NOT test actual API client implementation (tests mock the thing they are testing)

**Integration Tests:**
- 2 bash scripts that test live API endpoints via curl
- `test-push-notifications.sh` (13 tests) -- tests push notification CRUD flow
- `tests/push-notifications.test.sh` (20 tests) -- more comprehensive push notification tests with HTTP status code assertions
- Require a running server instance (local or deployed)

**E2E Tests:**
- Not used

**Type Checking:**
- CI runs `npx tsc --noEmit || echo "Type checking completed with warnings"` (non-blocking)

## CI/CD Pipeline

**Location:** `.github/workflows/deploy.yml`

**Test Steps in CI:**
1. `npm install`
2. `npx tsc --noEmit || echo "..."` -- type checking (non-blocking, always passes)
3. `npm run build` -- build verification (blocking)

**No actual test execution in CI.** The `npm run test` script (which just curls localhost) is never run in CI. The bash test scripts are not executed in CI either.

**Pipeline Structure:**
- `lint-and-test` job: install, type-check (soft fail), build
- `deploy-preview`: PR deployments to Cloudflare Pages
- `deploy-staging`: push to `staging` branch
- `deploy-production`: push to `main` branch
- `notify-failure`: creates GitHub issue on failure

## Common Patterns

**Async Testing (Jest):**
```typescript
it('should handle errors', async () => {
  const mockClient = {
    post: jest.fn().mockRejectedValueOnce({
      response: { status: 400, data: { error: 'Message' } },
      message: 'Request failed',
    }),
    interceptors: { ... },
  }
  ;(axios.create as jest.Mock).mockReturnValueOnce(mockClient)

  try {
    await mockClient.post('/endpoint', { bad: 'data' })
  } catch (error: any) {
    expect(error.response.status).toBe(400)
  }
})
```

**Error Testing (Bash):**
```bash
# Test validation errors return correct status
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/api/push/register" \
  -H "Content-Type: application/json" \
  -d '{"device_token":"test","platform":"invalid"}')
test_endpoint "Invalid platform" "400" "$RESPONSE"
```

## Critical Testing Gaps

**Server-Side API Routes:**
- Zero unit tests for any of the 31 API route modules in `src/api/`
- No tests for `src/utils.ts` utility functions
- No tests for `src/db.ts` or `src/db-supabase.ts` database adapters
- No tests for `src/api/auth.ts` authentication module (JWT generation, password hashing, rate limiting)

**Business Logic:**
- `calculateHealthScore()`, `calculateCheckinStreak()`, `calculateAnalytics()` have no unit tests
- Achievement awarding logic untested
- Email sending (Resend) untested
- Payment processing untested
- AI coach integration untested

**Pages:**
- No tests for any of the 33 page templates in `src/pages/`
- No visual regression or snapshot testing

**Mobile:**
- Jest test file exists but tests mock the system under test (testing mocks, not real behavior)
- No test runner configuration found in `mobile/` (no `jest.config.*`, no `package.json` in mobile)
- Tests may not actually run without additional setup

**Infrastructure:**
- No load/stress testing
- No database migration testing
- No security testing (auth bypass, injection, etc.)

## Recommendations for Adding Tests

**Priority 1 - Add Vitest:**
- Install vitest as devDependency
- Configure in `vite.config.ts` (native Vite integration)
- Add `"test": "vitest"` to package.json scripts

**Priority 2 - Test Pure Functions:**
- `src/utils.ts` functions are pure and easy to test
- `src/api/auth.ts` token generation/verification

**Priority 3 - API Route Integration Tests:**
- Use Hono's test helper: `app.request('/api/endpoint', { method: 'POST', body: ... })`
- Mock database layer, test route logic

---

*Testing analysis: 2026-03-05*
