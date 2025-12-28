# Testing Guide - Better Together Mobile App

## Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (auto-rerun on changes)
npm test:watch

# Run only API tests
npm test:api

# Run only component tests
npm test:components

# Generate coverage report
npm test:coverage

# Debug tests
npm test:debug
```

## Test Infrastructure

### Configuration Files

| File | Purpose |
|------|---------|
| `jest.config.js` | Jest configuration with React Native preset and TypeScript support |
| `jest.setup.js` | Global test setup with mocks for React Native, Expo, and navigation |
| `babel.config.js` | Babel configuration with TypeScript and decorator support |
| `__mocks__/axios.ts` | Mock implementation of axios for API testing |

### Test Locations

```
mobile/
├── src/
│   ├── api/
│   │   └── __tests__/
│   │       └── client.test.ts          (20 API client tests)
│   ├── components/
│   │   └── __tests__/                  (To be added)
│   ├── hooks/
│   │   └── __tests__/                  (To be added)
│   └── ...
├── jest.config.js
├── jest.setup.js
└── TEST_FOUNDATION_REPORT.md
```

## Current Test Coverage

### API Client Tests (20 Tests - All Passing)

#### User Management (Tests 1-7)
- Create user with validation
- Handle validation errors
- Handle network errors
- Retrieve user by ID
- Handle 404 not found
- Update user profile
- Handle permission errors

#### Activity Management (Tests 8-10)
- Create activity
- Validate activity type
- Handle missing required fields

#### Data Persistence (Tests 11-15)
- Store and retrieve user ID
- Handle null values
- Store and retrieve JSON data
- Clear authentication data
- Handle storage errors

#### Infrastructure (Tests 16-20)
- Error structure consistency
- Handle errors without response
- Verify axios initialization
- Configure request interceptor
- Configure response interceptor

## Writing New Tests

### Test File Structure

```typescript
import { describe, it, expect, beforeEach, jest } from '@jest/globals'

describe('Feature Name', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Specific Functionality', () => {
    it('Test #N: should handle specific behavior', async () => {
      // Arrange
      const mockData = { /* ... */ }

      // Act
      const result = await functionUnderTest(mockData)

      // Assert
      expect(result).toEqual(expectedValue)
    })
  })
})
```

### Best Practices

1. **Test Naming**
   - Use format: `should [expected behavior] when [condition]`
   - Prefix with Test # for easy reference
   - Be specific and descriptive

2. **Mock Strategy**
   ```typescript
   // Always clear mocks in beforeEach
   beforeEach(() => {
     jest.clearAllMocks()
   })

   // Mock external dependencies
   jest.mock('external-module')

   // Don't mock code under test
   ```

3. **Async Testing**
   ```typescript
   // Use async/await for async code
   it('Test N: should handle async operation', async () => {
     const result = await asyncFunction()
     expect(result).toBeDefined()
   })
   ```

4. **Error Testing**
   ```typescript
   // Test both success and failure paths
   it('should handle errors', async () => {
     mockFn.mockRejectedValueOnce(new Error('Failed'))

     try {
       await functionUnderTest()
     } catch (error) {
       expect(error.message).toContain('Failed')
     }
   })
   ```

## Mocking Guide

### AsyncStorage

```typescript
// Setup
;(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce('value')
;(AsyncStorage.setItem as jest.Mock).mockResolvedValueOnce(undefined)

// Usage in test
await AsyncStorage.setItem('key', 'value')
const result = await AsyncStorage.getItem('key')

// Verify
expect(AsyncStorage.setItem).toHaveBeenCalledWith('key', 'value')
```

### Axios

```typescript
// Setup
const mockClient = {
  get: jest.fn().mockResolvedValueOnce({ data: { /* ... */ } }),
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() },
  },
}
;(axios.create as jest.Mock).mockReturnValueOnce(mockClient)

// Error handling
mockClient.get.mockRejectedValueOnce({
  response: { status: 404, data: { error: 'Not found' } }
})
```

### React Navigation

```typescript
// Already mocked in jest.setup.js
// Tests can safely import and use:
import { useNavigation, useRoute } from '@react-navigation/native'
```

## Common Issues and Solutions

### Issue: "Cannot find module 'module-name'"
**Solution:** Check that the module is mocked in jest.setup.js or transformIgnorePatterns in jest.config.js

### Issue: Tests timeout
**Solution:** Check jest.setTimeout() value or async operations completing

### Issue: Mocks not working
**Solution:** Ensure jest.clearAllMocks() is called in beforeEach

### Issue: Type errors in tests
**Solution:** Verify @types/jest is installed: `npm list @types/jest`

## Coverage Goals

| Phase | Timeline | Target Coverage |
|-------|----------|-----------------|
| Phase 1 | Completed | API Client (100%) |
| Phase 2 | January 2026 | Components (70%) |
| Phase 3 | February 2026 | Hooks & Utils (70%) |
| Phase 4 | March 2026 | Overall (70%) |

## Continuous Integration

### GitHub Actions Setup (Recommended)

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v2
```

## Performance Tips

1. **Run tests in watch mode during development**
   ```bash
   npm test:watch
   ```

2. **Run specific test file**
   ```bash
   npm test -- client.test.ts
   ```

3. **Run tests matching pattern**
   ```bash
   npm test -- --testNamePattern="AsyncStorage"
   ```

4. **Generate coverage for specific file**
   ```bash
   npm test:coverage -- src/api/client.ts
   ```

## Debugging Tests

### Using Node Inspector

```bash
npm test:debug

# Then open chrome://inspect in Chrome DevTools
```

### Adding Debug Output

```typescript
// In your test
console.log('Debug:', variable)
console.dir(object, { depth: null })

// Run with verbose output
npm test -- --verbose
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Native Testing](https://reactnative.dev/docs/testing-overview)
- [Testing Library](https://testing-library.com/docs/react-native-testing-library/intro/)
- [Mock Functions](https://jestjs.io/docs/mock-functions)

## Contributing Tests

When adding new features:

1. Write tests first (TDD approach)
2. Ensure tests fail initially
3. Implement feature to pass tests
4. Refactor with confidence
5. Commit tests with feature

Example PR checklist:
- [ ] Tests added for new functionality
- [ ] All tests passing locally
- [ ] Coverage report reviewed
- [ ] No console errors or warnings

## Support

For questions or issues:

1. Check TEST_FOUNDATION_REPORT.md for detailed test information
2. Review existing test patterns in client.test.ts
3. Refer to framework documentation links above
4. Consult the team's testing guidelines

---

**Last Updated:** December 28, 2025
**Test Framework:** Jest 30+
**React Native:** 0.74.5
**Status:** Foundation Complete - Ready for Expansion
