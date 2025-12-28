// Better Together Mobile: User Profile Screen (View Other Users)
import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
  FlatList,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
  GLASSMORPHISM,
  GRADIENTS,
} from '../utils/constants'
import apiClient from '../api/client'
import type { User, Post, UserConnection } from '../types'

const UserProfileScreen: React.FC<any> = ({ route, navigation }) => {
  const { userId } = route.params
  const [user, setUser] = useState<User | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [followerCount, setFollowerCount] = useState(0)
  const [followingCount, setFollowingCount] = useState(0)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const fetchUserProfile = useCallback(async () => {
    try {
      const myUserId = await apiClient.getUserId()
      setCurrentUserId(myUserId)

      const userResponse = await apiClient.getUser(userId)

      if (userResponse.error) {
        throw new Error(userResponse.error.message || 'Failed to fetch user')
      }

      setUser(userResponse.data?.user || null)

      // Fetch followers/following counts
      const [followersResponse, followingResponse] = await Promise.all([
        apiClient.getFollowers(userId),
        apiClient.getFollowing(userId),
      ])

      setFollowerCount((followersResponse.data?.followers || []).length)
      setFollowingCount((followingResponse.data?.following || []).length)

      // Check if current user is following this user
      if (myUserId) {
        const myFollowing = await apiClient.getFollowing(myUserId)
        const following = myFollowing.data?.following || []
        setIsFollowing(following.some((f: any) => f.following_id === userId))
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load profile')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [userId])

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    fetchUserProfile()
  }, [fetchUserProfile])

  const handleFollowToggle = async () => {
    if (isFollowLoading) return

    try {
      setIsFollowLoading(true)

      if (isFollowing) {
        const response = await apiClient.unfollowUser(userId)
        if (response.error) {
          throw new Error(response.error.message || 'Failed to unfollow')
        }
        setIsFollowing(false)
        setFollowerCount((prev) => Math.max(0, prev - 1))
      } else {
        const response = await apiClient.followUser(userId)
        if (response.error) {
          throw new Error(response.error.message || 'Failed to follow')
        }
        setIsFollowing(true)
        setFollowerCount((prev) => prev + 1)
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update follow status')
    } finally {
      setIsFollowLoading(false)
    }
  }

  const handleMessage = async () => {
    try {
      // Create or get existing conversation
      const response = await apiClient.createConversation([userId])
      if (response.error) {
        throw new Error(response.error.message || 'Failed to start conversation')
      }

      // Navigate to messaging screen
      navigation.navigate('Messages', {
        conversationId: response.data?.conversation?.id,
      })
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to start conversation')
    }
  }

  const getLoveLanguageLabel = (lang?: string) => {
    const labels: Record<string, string> = {
      words_of_affirmation: 'Words of Affirmation',
      quality_time: 'Quality Time',
      physical_touch: 'Physical Touch',
      acts_of_service: 'Acts of Service',
      receiving_gifts: 'Receiving Gifts',
    }
    return labels[lang || ''] || lang
  }

  const getLoveLanguageEmoji = (lang?: string) => {
    const emojis: Record<string, string> = {
      words_of_affirmation: '💬',
      quality_time: '⏰',
      physical_touch: '🤗',
      acts_of_service: '🛠️',
      receiving_gifts: '🎁',
    }
    return emojis[lang || ''] || '❤️'
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    )
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>User not found</Text>
          <TouchableOpacity
            style={styles.backButtonLarge}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  const isOwnProfile = currentUserId === userId

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={[styles.header, SHADOWS.soft]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{user.name}</Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <LinearGradient
          colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileHeader}
        >
          {/* Avatar */}
          {user.profile_photo_url ? (
            <Image source={{ uri: user.profile_photo_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          {/* Name & Nickname */}
          <Text style={styles.userName}>{user.name}</Text>
          {user.nickname && (
            <Text style={styles.userNickname}>"{user.nickname}"</Text>
          )}

          {/* Stats */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{followerCount}</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </TouchableOpacity>
            <View style={styles.statDivider} />
            <TouchableOpacity style={styles.statItem}>
              <Text style={styles.statNumber}>{followingCount}</Text>
              <Text style={styles.statLabel}>Following</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Action Buttons */}
        {!isOwnProfile && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing && styles.followingButton,
              ]}
              onPress={handleFollowToggle}
              disabled={isFollowLoading}
              activeOpacity={0.7}
            >
              {isFollowLoading ? (
                <ActivityIndicator size="small" color={isFollowing ? COLORS.primary : '#FFFFFF'} />
              ) : (
                <>
                  <Ionicons
                    name={isFollowing ? 'checkmark' : 'person-add'}
                    size={18}
                    color={isFollowing ? COLORS.primary : '#FFFFFF'}
                  />
                  <Text
                    style={[
                      styles.followButtonText,
                      isFollowing && styles.followingButtonText,
                    ]}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.messageButton}
              onPress={handleMessage}
              activeOpacity={0.7}
            >
              <Ionicons name="chatbubble-outline" size={18} color={COLORS.primary} />
              <Text style={styles.messageButtonText}>Message</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* About Section */}
        <View style={[styles.section, GLASSMORPHISM.light, SHADOWS.card]}>
          <Text style={styles.sectionTitle}>About</Text>

          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>{user.timezone || 'Unknown location'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.infoText}>
              Joined {new Date(user.created_at).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}
            </Text>
          </View>
        </View>

        {/* Love Languages */}
        {(user.love_language_primary || user.love_language_secondary) && (
          <View style={[styles.section, GLASSMORPHISM.light, SHADOWS.card]}>
            <Text style={styles.sectionTitle}>Love Languages</Text>

            {user.love_language_primary && (
              <View style={styles.loveLanguageItem}>
                <Text style={styles.loveLanguageEmoji}>
                  {getLoveLanguageEmoji(user.love_language_primary)}
                </Text>
                <View style={styles.loveLanguageInfo}>
                  <Text style={styles.loveLanguageLabel}>Primary</Text>
                  <Text style={styles.loveLanguageValue}>
                    {getLoveLanguageLabel(user.love_language_primary)}
                  </Text>
                </View>
              </View>
            )}

            {user.love_language_secondary && (
              <View style={styles.loveLanguageItem}>
                <Text style={styles.loveLanguageEmoji}>
                  {getLoveLanguageEmoji(user.love_language_secondary)}
                </Text>
                <View style={styles.loveLanguageInfo}>
                  <Text style={styles.loveLanguageLabel}>Secondary</Text>
                  <Text style={styles.loveLanguageValue}>
                    {getLoveLanguageLabel(user.love_language_secondary)}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Activity Section */}
        <View style={[styles.section, GLASSMORPHISM.light, SHADOWS.card]}>
          <Text style={styles.sectionTitle}>Activity</Text>
          <View style={styles.activityPlaceholder}>
            <Text style={styles.activityEmoji}>📊</Text>
            <Text style={styles.activityText}>
              {user.name}'s posts will appear here
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  moreButton: {
    padding: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  backButtonLarge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.large,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: FONT_WEIGHTS.semibold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: SPACING.md,
  },
  avatarPlaceholder: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 40,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  userName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  userNickname: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255, 255, 255, 0.8)',
    fontStyle: 'italic',
    marginBottom: SPACING.md,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.sm,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
  },
  statNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  actionButtons: {
    flexDirection: 'row',
    padding: SPACING.md,
    gap: SPACING.sm,
  },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.large,
    gap: SPACING.xs,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  followButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#FFFFFF',
  },
  followingButtonText: {
    color: COLORS.primary,
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.large,
    gap: SPACING.xs,
  },
  messageButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
  },
  section: {
    margin: SPACING.md,
    marginTop: 0,
    padding: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  infoText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  loveLanguageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
    padding: SPACING.sm,
    backgroundColor: COLORS.gray50,
    borderRadius: BORDER_RADIUS.medium,
  },
  loveLanguageEmoji: {
    fontSize: 28,
    marginRight: SPACING.sm,
  },
  loveLanguageInfo: {
    flex: 1,
  },
  loveLanguageLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
    fontWeight: FONT_WEIGHTS.medium,
  },
  loveLanguageValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.medium,
  },
  activityPlaceholder: {
    alignItems: 'center',
    padding: SPACING.xl,
  },
  activityEmoji: {
    fontSize: 48,
    marginBottom: SPACING.sm,
  },
  activityText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
})

export default UserProfileScreen
