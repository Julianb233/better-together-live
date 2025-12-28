// Better Together Mobile: Authentication Hook
import { useState, useEffect } from 'react'
import { apiClient } from '../api/client'
import type { User, AuthState } from '../types'

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = async () => {
    try {
      const userId = await apiClient.getUserId()
      if (userId) {
        const { data, error } = await apiClient.getUser(userId)
        if (data && !error) {
          setAuthState({
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          })
        } else {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    } catch (error) {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }

  const login = async (email: string, name: string) => {
    setAuthState({ ...authState, isLoading: true })

    const { data, error } = await apiClient.createUser({ email, name })

    if (data && !error) {
      await apiClient.storeUserId(data.user.id)
      await apiClient.storeUserData(data.user)

      setAuthState({
        user: data.user,
        isAuthenticated: true,
        isLoading: false,
      })

      return { success: true }
    } else {
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })

      return { success: false, error: error?.message || 'Login failed' }
    }
  }

  const logout = async () => {
    await apiClient.clearAuth()
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
  }

  const updateUser = async (userData: Partial<User>) => {
    if (!authState.user) return { success: false, error: 'No user logged in' }

    const { data, error } = await apiClient.updateUser(authState.user.id, userData)

    if (data && !error) {
      await apiClient.storeUserData(data.user)
      setAuthState({
        ...authState,
        user: data.user,
      })

      return { success: true }
    } else {
      return { success: false, error: error?.message || 'Update failed' }
    }
  }

  // Set user directly (used after onboarding)
  const setUser = (user: User) => {
    setAuthState({
      user,
      isAuthenticated: true,
      isLoading: false,
    })
  }

  return {
    ...authState,
    login,
    logout,
    updateUser,
    setUser,
    refresh: loadUser,
  }
}
