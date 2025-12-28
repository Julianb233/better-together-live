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
      (error: AxiosError<{ error?: string; message?: string }>) => {
        const apiError: ApiError = {
          error: error.message,
          message: (error.response?.data as { error?: string })?.error || 'An unexpected error occurred',
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

  async updateProfile(userId: string, profileData: any): Promise<ApiResponse<{ user: any }>> {
    return this.request('put', `/users/${userId}`, profileData)
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

  // Community Feed endpoints
  async getFeed(limit?: number, offset?: number): Promise<ApiResponse<{ posts: any[]; hasMore: boolean }>> {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (offset) params.append('offset', offset.toString())
    return this.request('get', `/feed?${params.toString()}`)
  }

  async getTrendingPosts(limit?: number): Promise<ApiResponse<{ posts: any[] }>> {
    return this.request('get', `/feed/trending${limit ? `?limit=${limit}` : ''}`)
  }

  async getCommunityFeed(communityId: string, limit?: number, offset?: number): Promise<ApiResponse<{ posts: any[] }>> {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (offset) params.append('offset', offset.toString())
    return this.request('get', `/feed/community/${communityId}?${params.toString()}`)
  }

  // Posts endpoints
  async createPost(postData: any): Promise<ApiResponse<{ post: any }>> {
    return this.request('post', '/posts', postData)
  }

  async getPost(postId: string): Promise<ApiResponse<{ post: any }>> {
    return this.request('get', `/posts/${postId}`)
  }

  async updatePost(postId: string, postData: any): Promise<ApiResponse<{ post: any }>> {
    return this.request('put', `/posts/${postId}`, postData)
  }

  async deletePost(postId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request('delete', `/posts/${postId}`)
  }

  // Reactions endpoints
  async addReaction(targetType: string, targetId: string, reactionType: string): Promise<ApiResponse<{ reaction: any }>> {
    return this.request('post', '/social/reactions', { target_type: targetType, target_id: targetId, reaction_type: reactionType })
  }

  async removeReaction(targetType: string, targetId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request('delete', `/social/reactions/${targetType}/${targetId}`)
  }

  // Comments endpoints
  async getComments(postId: string): Promise<ApiResponse<{ comments: any[] }>> {
    return this.request('get', `/social/comments/post/${postId}`)
  }

  async createComment(postId: string, content: string, parentCommentId?: string): Promise<ApiResponse<{ comment: any }>> {
    return this.request('post', '/social/comments', { post_id: postId, content, parent_comment_id: parentCommentId })
  }

  async deleteComment(commentId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request('delete', `/social/comments/${commentId}`)
  }

  // Connections endpoints
  async followUser(userId: string): Promise<ApiResponse<{ connection: any }>> {
    return this.request('post', '/social/connections/follow', { following_id: userId })
  }

  async unfollowUser(userId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request('delete', `/social/connections/unfollow/${userId}`)
  }

  async getFollowers(userId: string): Promise<ApiResponse<{ followers: any[] }>> {
    return this.request('get', `/social/connections/followers/${userId}`)
  }

  async getFollowing(userId: string): Promise<ApiResponse<{ following: any[] }>> {
    return this.request('get', `/social/connections/following/${userId}`)
  }

  // Communities endpoints
  async getCommunities(): Promise<ApiResponse<{ communities: any[] }>> {
    return this.request('get', '/communities')
  }

  async getCommunity(communityId: string): Promise<ApiResponse<{ community: any }>> {
    return this.request('get', `/communities/${communityId}`)
  }

  async joinCommunity(communityId: string): Promise<ApiResponse<{ membership: any }>> {
    return this.request('post', `/communities/${communityId}/join`)
  }

  async leaveCommunity(communityId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request('delete', `/communities/${communityId}/leave`)
  }

  // Messaging endpoints
  async getConversations(): Promise<ApiResponse<{ conversations: any[] }>> {
    return this.request('get', '/messaging/conversations')
  }

  async getConversation(conversationId: string): Promise<ApiResponse<{ conversation: any }>> {
    return this.request('get', `/messaging/conversations/${conversationId}`)
  }

  async createConversation(participantIds: string[], name?: string): Promise<ApiResponse<{ conversation: any }>> {
    return this.request('post', '/messaging/conversations', { participant_ids: participantIds, name })
  }

  async getMessages(conversationId: string, limit?: number, before?: string): Promise<ApiResponse<{ messages: any[] }>> {
    const params = new URLSearchParams()
    if (limit) params.append('limit', limit.toString())
    if (before) params.append('before', before)
    return this.request('get', `/messaging/conversations/${conversationId}/messages?${params.toString()}`)
  }

  async sendMessage(conversationId: string, content: string, messageType?: string): Promise<ApiResponse<{ message: any }>> {
    return this.request('post', `/messaging/conversations/${conversationId}/messages`, { content, message_type: messageType || 'text' })
  }

  async markMessagesRead(conversationId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request('put', `/messaging/conversations/${conversationId}/read`)
  }

  // AI Coach endpoints
  async askAICoach(data: { message: string; relationship_id: string }): Promise<ApiResponse<{ response: string; timestamp: string }>> {
    return this.request('post', '/ai-coach/ask', data)
  }

  async getAICoachHistory(relationshipId: string): Promise<ApiResponse<{ messages: any[] }>> {
    return this.request('get', `/ai-coach/history/${relationshipId}`)
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
