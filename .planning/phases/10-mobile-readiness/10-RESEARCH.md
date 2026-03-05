# Phase 10: Mobile Production Readiness - Research

**Researched:** 2026-03-05
**Domain:** React Native (Expo) mobile app alignment with consolidated Supabase Auth backend
**Confidence:** HIGH

## Summary

The Better Together mobile app is an Expo SDK 51 / React Native 0.74.5 app using `@react-navigation` (native stack + bottom tabs), `axios` for API calls, `zustand` for state, and `AsyncStorage` for persistence. It currently has **zero authentication** in the real sense -- the "login" flow calls `POST /api/users` (createUser) and stores the returned user ID in AsyncStorage, then sends it as an `X-User-ID` header on every request. There is no password field, no JWT, no session management.

The backend has a fully-implemented Supabase Auth system at `/api/auth/supabase/*` (signup, login, logout, refresh, me, OAuth, forgot-password, reset-password, update-profile). The mobile app needs to be rewired to use these endpoints, storing JWT access/refresh tokens instead of a raw user ID, and sending `Authorization: Bearer <token>` headers. The old custom JWT auth at `/api/auth/*` also exists but Supabase Auth is marked as "Primary" in the codebase.

The production API URL is already correctly set to `https://better-together.live/api` in the client. The app has EAS Build configured with bundle identifiers and a deep link scheme (`bettertogether://`).

**Primary recommendation:** Add `@supabase/supabase-js` to the mobile app for direct Supabase Auth (handles token refresh automatically), rewrite `useAuth` hook and auth screens, update the API client interceptor to use Bearer tokens, and verify all screens compile against the updated auth flow.

## Standard Stack

### Core (Already in Place)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| expo | ^51.0.0 | App framework | Installed |
| react-native | 0.74.5 | UI runtime | Installed |
| axios | ^1.6.0 | HTTP client | Installed, needs auth header update |
| @react-navigation/native | ^6.1.9 | Navigation | Installed |
| @react-navigation/native-stack | ^6.9.17 | Stack navigation | Installed |
| @react-navigation/bottom-tabs | ^6.5.11 | Tab navigation | Installed |
| zustand | ^4.4.7 | State management | Installed |
| @react-native-async-storage/async-storage | ^1.21.0 | Local storage | Installed |

### Must Add
| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| @supabase/supabase-js | ^2.x | Supabase client (Auth + DB) | Handles auth flow, token refresh, session persistence natively |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @supabase/supabase-js | Raw REST calls to /api/auth/supabase/* | Supabase JS client handles token refresh, session restore, auth state change events automatically. Raw REST means reimplementing all of that. Use the client. |
| axios + Supabase Auth | Supabase client for everything | Keep axios for non-auth API calls to the Hono backend. Supabase client only for auth. The backend API routes are Hono routes, not Supabase PostgREST. |

**Installation:**
```bash
cd mobile && npm install @supabase/supabase-js
```

**Additional requirement:** Supabase JS on React Native needs AsyncStorage as the storage adapter:
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // Important for React Native
  },
})
```

## Architecture Patterns

### Current Auth Flow (BROKEN - Must Replace)
```
LoginScreen -> useAuth.login(email, name) -> apiClient.createUser({email, name})
  -> POST /api/users -> stores userId in AsyncStorage
  -> All requests send X-User-ID header (NO PASSWORD, NO JWT)
```

### Target Auth Flow
```
LoginScreen -> supabase.auth.signInWithPassword({email, password})
  -> Supabase handles JWT issuance, storage, refresh
  -> useAuth hook listens to supabase.auth.onAuthStateChange()
  -> API client interceptor reads session.access_token
  -> All requests send Authorization: Bearer <token>
```

### Recommended File Changes
```
mobile/src/
  lib/
    supabase.ts              # NEW: Supabase client initialization
  api/
    client.ts                # MODIFY: Bearer token from Supabase session
  hooks/
    useAuth.ts               # REWRITE: Use Supabase Auth, password-based login
  screens/
    LoginScreen.tsx           # MODIFY: Add password field, use supabase.auth.signInWithPassword
    RegisterScreen.tsx        # MODIFY: Add password field, use supabase.auth.signUp
  types/
    index.ts                 # MODIFY: Update AuthState to include session info
```

### Pattern: Supabase Auth in React Native
```typescript
// lib/supabase.ts
import 'react-native-url-polyfill/shims' // May be needed
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co'
const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

### Pattern: Updated useAuth Hook
```typescript
// hooks/useAuth.ts
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Session, User } from '@supabase/supabase-js'

export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return { success: false, error: error.message }
    return { success: true }
  }

  const register = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, full_name: name } }
    })
    if (error) return { success: false, error: error.message }
    return { success: true, confirmationRequired: !data.session }
  }

  const logout = async () => {
    await supabase.auth.signOut()
  }

  return {
    user,
    session,
    isAuthenticated: !!session,
    isLoading,
    login,
    register,
    logout,
  }
}
```

### Pattern: Updated API Client Interceptor
```typescript
// api/client.ts - Updated interceptor
this.client.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.access_token) {
      config.headers['Authorization'] = `Bearer ${session.access_token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)
```

### Anti-Patterns to Avoid
- **Storing tokens in AsyncStorage manually:** The Supabase client does this automatically. Do NOT duplicate storage.
- **Calling /api/auth/supabase/* from mobile:** Use `supabase.auth.*` methods directly. The server-side auth routes exist for the web app (which uses cookies). Mobile should use the Supabase client directly.
- **Keeping X-User-ID header:** All API endpoints should accept `Authorization: Bearer` headers. The backend middleware needs to extract user ID from the JWT. Remove X-User-ID pattern entirely.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Token refresh | Manual refresh logic with timers | `supabase.auth.autoRefreshToken: true` | Supabase handles JWT refresh automatically before expiry |
| Session persistence | Manual AsyncStorage read/write for tokens | `supabase.auth.persistSession: true` | Supabase stores/restores sessions from AsyncStorage automatically |
| Auth state management | Custom useState/useEffect for auth state | `supabase.auth.onAuthStateChange()` | Supabase emits events on sign-in, sign-out, token refresh |
| Password hashing | Client-side hashing | Supabase Auth handles it server-side | Never hash passwords on the client |
| Email validation on auth | Custom regex for signup | Supabase returns proper errors | Server validates; client can do basic UX validation |

## Common Pitfalls

### Pitfall 1: Missing URL Polyfill
**What goes wrong:** `URL is not a constructor` crash on Android
**Why it happens:** React Native doesn't have a full URL implementation
**How to avoid:** Install `react-native-url-polyfill` and import shims at the top of the Supabase client file
**Warning signs:** App crashes on Android but works on iOS simulator

### Pitfall 2: detectSessionInUrl Must Be False
**What goes wrong:** Supabase tries to parse auth tokens from URLs (designed for web OAuth redirects), crashes in React Native
**Why it happens:** Default is `true` for web environments
**How to avoid:** Always set `detectSessionInUrl: false` in the Supabase client config
**Warning signs:** Errors about URL parsing on app startup

### Pitfall 3: Backend Middleware Must Accept Bearer Tokens
**What goes wrong:** Mobile sends Bearer token but backend still expects `X-User-ID` header
**Why it happens:** The existing Hono API routes were built for the old auth model
**How to avoid:** Verify that backend API middleware extracts user from Supabase JWT. The `requireAuth` middleware in `auth.ts` already supports Bearer tokens, but it verifies against custom JWT secrets, not Supabase. Need to ensure Supabase auth middleware is used for protected routes.
**Warning signs:** All API calls return 401 after auth migration

### Pitfall 4: Login Screen Missing Password Field
**What goes wrong:** Current LoginScreen only has email + name fields (no password)
**Why it happens:** The old "auth" was just user creation, not real authentication
**How to avoid:** Add password fields to both LoginScreen and RegisterScreen
**Warning signs:** Users cannot actually authenticate

### Pitfall 5: Expo SDK 51 Compatibility
**What goes wrong:** `@supabase/supabase-js` v2 works with React Native but may need `react-native-url-polyfill`
**Why it happens:** Expo SDK 51 uses React Native 0.74.x which has improved but still incomplete URL support
**How to avoid:** Test on both iOS and Android after adding Supabase client
**Warning signs:** Platform-specific crashes

### Pitfall 6: Navigation.replace After Register
**What goes wrong:** RegisterScreen calls `navigation.replace('MainTabs')` directly instead of letting auth state drive navigation
**Why it happens:** Old imperative navigation pattern
**How to avoid:** The AppNavigator already conditionally renders auth vs main stacks based on `isAuthenticated`. After successful registration, the `onAuthStateChange` listener updates state, which triggers the navigation switch automatically. Remove manual `navigation.replace` calls.
**Warning signs:** Double navigation, screen flicker after registration

### Pitfall 7: WebSocket Auth
**What goes wrong:** WebSocket connection at `wss://better-together.live/ws?userId=X` passes userId in query string with no verification
**Why it happens:** No auth was ever implemented for WebSocket
**How to avoid:** Pass the Supabase JWT as a query parameter or in a connection init message. Update WebSocket server to verify the token.
**Warning signs:** Anyone can connect as any user by passing a different userId

## Code Examples

### Updated LoginScreen (key changes)
```typescript
const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, isLoading } = useAuth()

  const handleLogin = async () => {
    const result = await login(email.trim(), password)
    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Invalid credentials')
    }
    // No navigation needed - AppNavigator auto-switches when isAuthenticated changes
  }
  // ... add password Input field
}
```

### Updated RegisterScreen (key changes)
```typescript
const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const { register, isLoading } = useAuth()

  const handleRegister = async () => {
    const result = await register(email.trim(), password, name.trim())
    if (!result.success) {
      Alert.alert('Registration Failed', result.error || 'An error occurred')
    } else if (result.confirmationRequired) {
      Alert.alert('Check Your Email', 'Please confirm your email before logging in.')
    }
    // No navigation.replace needed
  }
  // ... add password Input field
}
```

### Supabase Config Values
The Supabase URL and anon key need to come from environment/config. Options:
1. **app.json `extra` field** (recommended for Expo):
```json
{
  "expo": {
    "extra": {
      "supabaseUrl": "https://YOUR_PROJECT.supabase.co",
      "supabaseAnonKey": "YOUR_ANON_KEY"
    }
  }
}
```
Then access via `expo-constants`:
```typescript
import Constants from 'expo-constants'
const SUPABASE_URL = Constants.expoConfig?.extra?.supabaseUrl
const SUPABASE_ANON_KEY = Constants.expoConfig?.extra?.supabaseAnonKey
```

2. **Hardcoded constants** (simpler, anon key is safe to expose):
```typescript
// The anon key is designed to be public (it's in every web app's source)
const SUPABASE_URL = 'https://YOUR_PROJECT.supabase.co'
const SUPABASE_ANON_KEY = 'eyJ...'
```

## State of the Art

| Old Approach (Current) | New Approach (Target) | Impact |
|------------------------|----------------------|--------|
| No password, store userId in AsyncStorage | Supabase Auth with email+password, JWT tokens | Real authentication instead of user-ID-as-auth |
| X-User-ID header on requests | Authorization: Bearer header | Actual security, user identity verified by JWT |
| `POST /api/users` as "login" | `supabase.auth.signInWithPassword()` | Proper auth flow with password verification |
| No token refresh | Auto refresh via Supabase client | Sessions don't expire unexpectedly |
| WebSocket uses raw userId query param | JWT-authenticated WebSocket | Prevents impersonation |

## Scope Assessment

### Files Requiring Changes (Complete List)
| File | Change Type | Effort |
|------|-------------|--------|
| `mobile/package.json` | Add @supabase/supabase-js, react-native-url-polyfill | Trivial |
| `mobile/src/lib/supabase.ts` | NEW: Supabase client init | Small |
| `mobile/src/hooks/useAuth.ts` | REWRITE: Supabase Auth | Medium |
| `mobile/src/api/client.ts` | MODIFY: Bearer token interceptor, remove X-User-ID | Medium |
| `mobile/src/screens/LoginScreen.tsx` | MODIFY: Add password field, update handler | Small |
| `mobile/src/screens/RegisterScreen.tsx` | MODIFY: Add password field, update handler | Small |
| `mobile/src/types/index.ts` | MODIFY: Update AuthState type | Trivial |
| `mobile/src/utils/websocket.ts` | MODIFY: Use JWT for auth | Small |
| `mobile/src/utils/constants.ts` | MODIFY: Add Supabase config | Trivial |
| `mobile/app.json` | MODIFY: Add Supabase config to extra | Trivial |

### Files NOT Requiring Changes
All screen components (DashboardScreen, CheckinScreen, ActivitiesScreen, etc.) use `apiClient` methods which go through the axios interceptor. As long as the interceptor sends the right auth header, these screens do not need modification. The `useAuth` hook API shape should remain similar (`user`, `isAuthenticated`, `isLoading`, `logout`) so AppNavigator and ProfileScreen logout work without changes.

### Backend Considerations
The backend `/api/auth/supabase/*` routes already return JSON with `session.accessToken`. However, mobile should NOT use these server-side routes -- it should use `supabase.auth.*` directly. The backend API routes need to accept Supabase JWTs in the `Authorization: Bearer` header. This depends on Phase 02 (Auth Consolidation) being complete -- if the backend middleware still validates custom JWTs rather than Supabase JWTs, mobile auth will fail.

**CRITICAL DEPENDENCY:** Phase 02 (Auth Consolidation) must be done first. If backend API routes still use the old `requireAuth` middleware (which checks custom JWT secrets), then mobile Bearer tokens from Supabase will be rejected.

## Open Questions

1. **Supabase project credentials for mobile**
   - What we know: Backend uses SUPABASE_URL and SUPABASE_ANON_KEY from environment variables
   - What's unclear: Whether these values are documented/accessible for mobile config
   - Recommendation: Extract from backend's .env or Vercel env vars; the anon key is safe to embed in mobile code

2. **Email confirmation flow**
   - What we know: Backend signup supports email confirmation (`confirmationRequired: true`)
   - What's unclear: Whether email confirmation is enabled in Supabase project settings
   - Recommendation: Check Supabase dashboard; if enabled, mobile needs a "check your email" screen

3. **Backend auth middleware compatibility**
   - What we know: Old `requireAuth` validates custom JWT (jose library, HS256, `better-together` issuer). Supabase uses RS256 with different JWT structure.
   - What's unclear: Whether Phase 02 has already updated middleware to accept Supabase tokens
   - Recommendation: Verify Phase 02 completion before starting Phase 10. If not done, mobile auth will not work end-to-end.

4. **TypeScript build verification**
   - What we know: `npm run type-check` (tsc --noEmit) should catch type errors
   - What's unclear: Whether current codebase already has type errors (node_modules may not be installed)
   - Recommendation: Run `cd mobile && npm install && npm run type-check` as first step

## Sources

### Primary (HIGH confidence)
- Direct code inspection of `mobile/src/api/client.ts` -- confirmed X-User-ID auth pattern
- Direct code inspection of `mobile/src/hooks/useAuth.ts` -- confirmed no-password login via createUser
- Direct code inspection of `src/api/supabase-auth.ts` -- confirmed full Supabase Auth API exists
- Direct code inspection of `src/api/auth.ts` -- confirmed old custom JWT middleware
- Direct code inspection of `mobile/package.json` -- confirmed no Supabase dependency
- `mobile/app.json` -- confirmed Expo SDK 51, deep link scheme, EAS config

### Secondary (MEDIUM confidence)
- Supabase JS client React Native setup pattern (well-documented in official docs)
- AsyncStorage as Supabase storage adapter (standard pattern)

### Tertiary (LOW confidence)
- `react-native-url-polyfill` necessity -- may not be needed with RN 0.74.x / Expo 51 (needs testing)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Direct code inspection, all dependencies verified in package.json
- Architecture: HIGH - Auth flow fully traced through codebase, backend endpoints verified
- Pitfalls: HIGH - Based on well-known React Native + Supabase integration patterns
- Scope: HIGH - Complete file-by-file impact analysis performed

**Research date:** 2026-03-05
**Valid until:** 2026-04-05 (stable -- Expo 51, Supabase v2 are mature)
