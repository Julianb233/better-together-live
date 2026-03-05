// Better Together Mobile: Authentication Hook (Supabase Auth)
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { apiClient } from '../api/client'
import type { User, AuthState } from '../types'
import type { Session, User as SupabaseUser } from '@supabase/supabase-js'

/** Map a Supabase user to the app's User type */
function mapSupabaseUser(su: SupabaseUser): User {
  return {
    id: su.id,
    email: su.email ?? '',
    name: su.user_metadata?.name ?? su.user_metadata?.full_name ?? '',
    nickname: su.user_metadata?.nickname,
    profile_photo_url: su.user_metadata?.avatar_url,
    timezone: su.user_metadata?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
    created_at: su.created_at,
    updated_at: su.updated_at ?? su.created_at,
    last_active_at: su.last_sign_in_at ?? su.created_at,
  }
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    // Restore persisted session on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setAuthState({
          user: mapSupabaseUser(session.user),
          session,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        setAuthState({
          user: null,
          session: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    })

    // Listen for auth state changes (sign in, sign out, token refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setAuthState({
            user: mapSupabaseUser(session.user),
            session,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          setAuthState({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return { success: false, error: error.message }
    }

    // onAuthStateChange will update state
    return { success: true }
  }

  const register = async (email: string, password: string, name: string) => {
    setAuthState((prev) => ({ ...prev, isLoading: true }))

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, full_name: name },
      },
    })

    if (error) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
      return { success: false, error: error.message }
    }

    // If session is null, email confirmation is required
    const confirmationRequired = !data.session
    if (confirmationRequired) {
      setAuthState((prev) => ({ ...prev, isLoading: false }))
    }
    // Otherwise onAuthStateChange will fire

    return { success: true, confirmationRequired }
  }

  const logout = async () => {
    await supabase.auth.signOut()
    await apiClient.clearAuth()
    // onAuthStateChange will update state to logged out
  }

  const updateUser = async (userData: Partial<User>) => {
    const currentUserId = authState.session?.user?.id
    if (!currentUserId) return { success: false, error: 'No user logged in' }

    const { data, error } = await apiClient.updateUser(currentUserId, userData)

    if (data && !error) {
      await apiClient.storeUserData(data.user)
      setAuthState((prev) => ({
        ...prev,
        user: data.user,
      }))
      return { success: true }
    }

    return { success: false, error: error?.message || 'Update failed' }
  }

  // Set user directly (used after onboarding)
  const setUser = (user: User) => {
    setAuthState((prev) => ({
      ...prev,
      user,
      isAuthenticated: true,
      isLoading: false,
    }))
  }

  const refresh = async () => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user) {
      setAuthState({
        user: mapSupabaseUser(session.user),
        session,
        isAuthenticated: true,
        isLoading: false,
      })
    }
  }

  return {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    setUser,
    refresh,
  }
}
