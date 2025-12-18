// Better Together Mobile: API Client
import axios, { AxiosInstance, AxiosError } from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { ApiError, ApiResponse } from '../types'

// API Configuration
const API_BASE_URL = __DEV__
  ? 'http://localhost:3000/api'
  : 'https://better-together.live/api'

const STORAGE_KEYS = {
  USER_ID: '@better_together:user_id',
  USER_DATA: '@better_together:user_data',
}

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Request interceptor for adding auth tokens if needed
    this.client.interceptors.request.use(
      async (config) => {
        const userId = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID)
        if (userId) {
          config.headers['X-User-ID'] = userId
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError: ApiError = {
          error: error.message,
          message: error.response?.data?.error || 'An unexpected error occurred',
          statusCode: error.response?.status,
        }
        return Promise.reject(apiError)
      }
    )
  }

  // Generic request handler
  private async request<T>(
    method: 'get' | 'post' | 'put' | 'delete',
    url: string,
    data?: any
  ): Promise<ApiResponse<T>> {
    try {
      const response = await this.client[method](url, data)
      return { data: response.data }
    } catch (error) {
      return { error: error as ApiError }
    }
  }

  // User endpoints
  async createUser(userData: any): Promise<ApiResponse<{ user: any }>> {
    return this.request('post', '/users', userData)
  }

  async getUser(userId: string): Promise<ApiResponse<{ user: any }>> {
    return this.request('get', `/users/${userId}`)
  }

  async updateUser(userId: string, userData: any): Promise<ApiResponse<{ user: any }>> {
    return this.request('put', `/users/${userId}`, userData)
  }

  // Relationship endpoints
  async invitePartner(inviteData: any): Promise<ApiResponse<{ relationship: any }>> {
    return this.request('post', '/invite-partner', inviteData)
  }

  async getRelationship(userId: string): Promise<ApiResponse<{ relationship: any }>> {
    return this.request('get', `/relationships/${userId}`)
  }

  // Check-in endpoints
  async createCheckin(checkinData: any) {
    return this.request('post', '/checkins', checkinData)
  }

  async getCheckins(relationshipId: string) {
    return this.request('get', `/checkins/${relationshipId}`)
  }

  // Goals endpoints
  async createGoal(goalData: any) {
    return this.request('post', '/goals', goalData)
  }

  async getGoals(relationshipId: string) {
    return this.request('get', `/goals/${relationshipId}`)
  }

  async updateGoalProgress(goalId: string, progressData: any) {
    return this.request('put', `/goals/${goalId}/progress`, progressData)
  }

  // Activities endpoints
  async createActivity(activityData: any) {
    return this.request('post', '/activities', activityData)
  }

  async getActivities(relationshipId: string) {
    return this.request('get', `/activities/${relationshipId}`)
  }

  async completeActivity(activityId: string, completionData: any) {
    return this.request('put', `/activities/${activityId}/complete`, completionData)
  }

  // Important dates endpoints
  async createImportantDate(dateData: any) {
    return this.request('post', '/important-dates', dateData)
  }

  async getImportantDates(relationshipId: string) {
    return this.request('get', `/important-dates/${relationshipId}`)
  }

  // Challenges endpoints
  async getChallenges() {
    return this.request('get', '/challenges')
  }

  async startChallenge(challengeId: string, participationData: any) {
    return this.request('post', `/challenges/${challengeId}/start`, participationData)
  }

  async getChallengeParticipation(relationshipId: string) {
    return this.request('get', `/challenges/participation/${relationshipId}`)
  }

  // Dashboard endpoint
  async getDashboard(userId: string): Promise<ApiResponse<any>> {
    return this.request('get', `/dashboard/${userId}`)
  }

  // Analytics endpoint
  async getAnalytics(relationshipId: string) {
    return this.request('get', `/analytics/${relationshipId}`)
  }

  // Notifications endpoints
  async getNotifications(userId: string) {
    return this.request('get', `/notifications/${userId}`)
  }

  async markNotificationRead(notificationId: string) {
    return this.request('put', `/notifications/${notificationId}/read`)
  }

  // Storage helpers
  async storeUserId(userId: string) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, userId)
  }

  async getUserId(): Promise<string | null> {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_ID)
  }

  async storeUserData(userData: any) {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData))
  }

  async getUserData(): Promise<any | null> {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA)
    return data ? JSON.parse(data) : null
  }

  async clearAuth() {
    await AsyncStorage.multiRemove([STORAGE_KEYS.USER_ID, STORAGE_KEYS.USER_DATA])
  }
}

export const apiClient = new ApiClient()
export default apiClient
