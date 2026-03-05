// Better Together Mobile: Supabase Client
// NOTE: supabaseUrl and supabaseAnonKey must be configured in app.json expo.extra
// before the app will work. Get these from your Supabase project dashboard.
// The anon key is safe to embed in client code (it's a public key like Firebase config).

import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import Constants from 'expo-constants'

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey

if (!supabaseUrl) {
  throw new Error(
    'Missing supabaseUrl. Set it in app.json under expo.extra.supabaseUrl'
  )
}

if (!supabaseAnonKey) {
  throw new Error(
    'Missing supabaseAnonKey. Set it in app.json under expo.extra.supabaseAnonKey'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false, // CRITICAL for React Native -- prevents URL parsing crash
  },
})
