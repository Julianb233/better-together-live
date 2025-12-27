# User Portal Testing Checklist

## Pre-Testing Setup

- [ ] Ensure backend APIs are running
- [ ] Database has test data:
  - [ ] Test user account
  - [ ] Relationship created
  - [ ] Some check-ins recorded
  - [ ] Some goals created
  - [ ] Some activities planned
  - [ ] At least one challenge participation

## Authentication Tests

### Login Flow
- [ ] Login with valid credentials redirects to /user-portal
- [ ] Login sets httpOnly cookies (access_token, refresh_token)
- [ ] Login also stores token in localStorage (fallback)
- [ ] Invalid credentials show error message
- [ ] Rate limiting works (too many failed attempts)

### Token Management
- [ ] `getAuthToken()` retrieves token from cookies first
- [ ] Falls back to localStorage if cookies not available
- [ ] No token redirects to /login page
- [ ] Expired token triggers refresh automatically
- [ ] Failed refresh redirects to /login

### API Call Helper
- [ ] `apiCall()` includes credentials in requests
- [ ] Handles 401 responses with token refresh
- [ ] Retries failed request after successful refresh
- [ ] Redirects to login if refresh fails
- [ ] Other errors logged but don't break flow

## Data Loading Tests

### Initial Load (/api/auth/me)
- [ ] Shows loading spinner initially
- [ ] Calls `/api/auth/me` first to verify auth
- [ ] Updates user name in sidebar and header
- [ ] Updates user email
- [ ] Generates and displays correct initials
- [ ] Shows time-appropriate greeting (morning/afternoon/evening)
- [ ] Uses first name in greeting

### Check-ins Data (/api/checkins/:relationshipId)
- [ ] Fetches check-ins for relationship
- [ ] Updates connection score with latest value
- [ ] Calculates streak correctly
- [ ] Shows correct streak count in metric card
- [ ] Updates sidebar streak display
- [ ] Handles no check-ins gracefully
- [ ] Handles partial check-in data

### Streak Calculation
- [ ] Consecutive daily check-ins count correctly
- [ ] Breaks streak on missed day
- [ ] Handles timezone differences
- [ ] Works with today's check-in
- [ ] Works without today's check-in

### Goals Data (/api/goals/:relationshipId)
- [ ] Fetches all goals
- [ ] Calculates average progress correctly
- [ ] Updates goal percentage metric
- [ ] Updates progress bar width
- [ ] Shows completed/total in sidebar
- [ ] Handles no goals gracefully
- [ ] Handles goals without target_count

### Activities Data (/api/activities/:relationshipId)
- [ ] Fetches all activities
- [ ] Finds next upcoming activity
- [ ] Updates date night card with correct info
- [ ] Formats date and time correctly
- [ ] Shows location if available
- [ ] Counts this year's completed activities
- [ ] Updates sidebar count
- [ ] Handles no activities gracefully

### Challenges Data (/api/challenges/participation/:relationshipId)
- [ ] Fetches active challenge participations
- [ ] Fetches completed challenges separately
- [ ] Updates achievements count
- [ ] Shows latest challenge in recent activity
- [ ] Displays progress percentage
- [ ] Handles no challenges gracefully

## UI Update Tests

### Metric Cards
- [ ] Connection score displays with 1 decimal
- [ ] Streak shows whole number
- [ ] Goal progress shows percentage
- [ ] Achievements shows count
- [ ] All cards update with real data
- [ ] Default values shown if no data

### Sidebar
- [ ] User name updates
- [ ] Email updates
- [ ] Initials update in avatar
- [ ] Plan type shows (if available)
- [ ] Streak counter updates
- [ ] Goals counter updates (X/Y format)
- [ ] Date nights counter updates

### Dashboard Cards
- [ ] Next date night card updates
- [ ] AI suggestion card remains (placeholder)
- [ ] Daily check-in card remains (placeholder)
- [ ] Recent activity adds challenge info
- [ ] Quick actions remain functional

## Error Handling Tests

### Network Errors
- [ ] Failed check-ins call doesn't break dashboard
- [ ] Failed goals call doesn't break dashboard
- [ ] Failed activities call doesn't break dashboard
- [ ] Failed challenges call doesn't break dashboard
- [ ] Errors logged to console
- [ ] User sees friendly error if auth fails

### Missing Data
- [ ] No relationship ID shows warning
- [ ] Empty arrays handled gracefully
- [ ] Null values handled correctly
- [ ] Missing properties don't cause errors

### Invalid Responses
- [ ] Non-JSON responses handled
- [ ] 404 errors logged but don't break flow
- [ ] 500 errors logged but don't break flow
- [ ] Malformed data handled safely

## Mobile Tests

### Responsive Layout
- [ ] Dashboard looks good on mobile
- [ ] Metric cards stack vertically
- [ ] Sidebar accessible via hamburger menu
- [ ] Mobile overlay works
- [ ] Touch interactions work
- [ ] Cards are touch-friendly

### Mobile Menu
- [ ] Hamburger icon shows on mobile
- [ ] Sidebar slides in from left
- [ ] Overlay darkens background
- [ ] Clicking overlay closes menu
- [ ] Menu closes after navigation
- [ ] Smooth animations

## Browser Compatibility

### Modern Browsers
- [ ] Chrome/Edge (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

### JavaScript Features
- [ ] async/await works
- [ ] Promise.all() works
- [ ] Fetch API works
- [ ] Optional chaining (?.) works
- [ ] Template literals work
- [ ] Arrow functions work

## Performance Tests

### Load Times
- [ ] Initial auth check is fast
- [ ] Parallel data loading is efficient
- [ ] UI updates are smooth
- [ ] No visible lag in updates
- [ ] Loading spinner shows appropriately

### Memory
- [ ] No memory leaks
- [ ] Event listeners cleaned up
- [ ] Large data sets handled well

## Security Tests

### Token Security
- [ ] Tokens in httpOnly cookies
- [ ] No tokens exposed in URLs
- [ ] LocalStorage only used as fallback
- [ ] Tokens refreshed before expiry
- [ ] Old tokens cleared on logout

### XSS Protection
- [ ] User input properly escaped
- [ ] No innerHTML with user data
- [ ] API responses sanitized
- [ ] No script injection possible

## Edge Cases

### Timing Issues
- [ ] Race conditions handled
- [ ] Rapid navigation works
- [ ] Concurrent requests don't conflict
- [ ] Token refresh during other calls

### Data Consistency
- [ ] Stale data handling
- [ ] Refresh updates all data
- [ ] No cached stale values

### User Actions
- [ ] Logout clears all data
- [ ] Multiple tabs handle auth correctly
- [ ] Browser back/forward works
- [ ] Reload preserves state

## Integration Tests

### End-to-End Flows
- [ ] Login → Dashboard → Data loads → Logout
- [ ] Expired token → Refresh → Continue
- [ ] No data → Empty state → Add data → Reload
- [ ] Multiple relationships (if supported)

### API Integration
- [ ] All endpoints called with correct params
- [ ] relationshipId passed correctly
- [ ] Query params formatted correctly
- [ ] Response data structure matches expected

## Accessibility Tests

### Screen Readers
- [ ] Semantic HTML used
- [ ] ARIA labels where needed
- [ ] Alt text for images/icons
- [ ] Focus management works

### Keyboard Navigation
- [ ] Tab order logical
- [ ] All actions keyboard accessible
- [ ] Focus visible
- [ ] Escape closes modals/menus

## Console Verification

### Expected Console Output
```
✓ No authentication errors (unless testing error cases)
✓ API calls logged (in development)
✓ No JavaScript errors
✓ Clear error messages if API fails
✓ Warnings for missing relationship ID
```

### Unexpected Issues to Watch For
```
✗ CORS errors
✗ Undefined property access
✗ Promise rejection warnings
✗ Network timeout errors
✗ Cookie access errors
```

## Manual Test Script

### Basic Flow Test
```
1. Clear cookies and localStorage
2. Navigate to /user-portal
3. Verify redirect to /login
4. Login with valid credentials
5. Verify redirect to /user-portal
6. Verify loading spinner appears
7. Wait for data to load
8. Verify all metrics updated
9. Verify sidebar updated
10. Verify no console errors
11. Click logout
12. Verify redirect to /login
13. Verify cookies/storage cleared
```

### Data Accuracy Test
```
1. Login to user portal
2. Note displayed values:
   - Connection score: _____
   - Streak: _____
   - Goal progress: _____
   - Achievements: _____
   - Next date: _____
3. Check database directly
4. Verify displayed values match database
5. Add new check-in via API
6. Reload page
7. Verify updated values
```

### Error Recovery Test
```
1. Login successfully
2. Open browser DevTools
3. Set breakpoint in apiCall function
4. Reload page
5. Clear cookies during auth check
6. Continue execution
7. Verify token refresh triggered
8. Verify page still loads data
```

## Success Criteria

### All tests must pass:
- ✅ Authentication flow works end-to-end
- ✅ All 5 API endpoints called successfully
- ✅ UI updates with real data
- ✅ Error handling graceful
- ✅ Mobile responsive
- ✅ No console errors
- ✅ Token refresh automatic
- ✅ Logout works correctly

### Optional enhancements verified:
- ⭐ Smooth loading animations
- ⭐ Helpful error messages
- ⭐ Fast load times (<2s)
- ⭐ Works offline (gracefully)
- ⭐ Accessible to screen readers
