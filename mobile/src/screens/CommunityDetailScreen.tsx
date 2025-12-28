// Better Together Mobile: Community Detail Screen
import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
  Image,
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
import type { Community, Post, ReactionType } from '../types'

const REACTION_EMOJIS: Record<ReactionType, string> = {
  like: '👍',
  love: '❤️',
  celebrate: '🎉',
  support: '🤗',
  insightful: '💡',
}

const CommunityDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { communityId } = route.params
  const [community, setCommunity] = useState<Community | null>(null)
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isMember, setIsMember] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  const fetchCommunity = useCallback(async () => {
    try {
      const userId = await apiClient.getUserId()
      setCurrentUserId(userId)

      const [communityResponse, postsResponse] = await Promise.all([
        apiClient.getCommunity(communityId),
        apiClient.getCommunityFeed(communityId, 20, 0),
      ])

      if (communityResponse.error) {
        throw new Error(communityResponse.error.message || 'Failed to fetch community')
      }

      const communityData = communityResponse.data?.community
      setCommunity(communityData || null)
      setPosts(postsResponse.data?.posts || [])

      // Check if user is a member (this would need to be returned by the API)
      // For now, we'll assume they're not a member if the community is private
      setIsMember(communityData?.privacy === 'public')
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load community')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [communityId])

  useEffect(() => {
    fetchCommunity()
  }, [fetchCommunity])

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    fetchCommunity()
  }, [fetchCommunity])

  const handleJoinToggle = async () => {
    if (isJoining) return

    try {
      setIsJoining(true)

      if (isMember) {
        const response = await apiClient.leaveCommunity(communityId)
        if (response.error) {
          throw new Error(response.error.message || 'Failed to leave community')
        }
        setIsMember(false)
        if (community) {
          setCommunity({ ...community, member_count: community.member_count - 1 })
        }
      } else {
        const response = await apiClient.joinCommunity(communityId)
        if (response.error) {
          throw new Error(response.error.message || 'Failed to join community')
        }
        setIsMember(true)
        if (community) {
          setCommunity({ ...community, member_count: community.member_count + 1 })
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update membership')
    } finally {
      setIsJoining(false)
    }
  }

  const handlePostPress = (post: Post) => {
    navigation.navigate('PostDetail', { postId: post.id })
  }

  const handleReaction = async (post: Post, reactionType: ReactionType) => {
    try {
      if (post.user_reaction === reactionType) {
        await apiClient.removeReaction('post', post.id)
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? { ...p, user_reaction: undefined, like_count: p.like_count - 1 }
              : p
          )
        )
      } else {
        await apiClient.addReaction('post', post.id, reactionType)
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? {
                  ...p,
                  user_reaction: reactionType,
                  like_count: p.user_reaction ? p.like_count : p.like_count + 1,
                }
              : p
          )
        )
      }
    } catch (error: any) {
      console.error('Failed to update reaction:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  const getPrivacyIcon = (privacy?: string) => {
    switch (privacy) {
      case 'private':
        return 'lock-closed'
      case 'invite_only':
        return 'key'
      default:
        return 'globe'
    }
  }

  const renderCommunityHeader = () => {
    if (!community) return null

    return (
      <View>
        {/* Banner */}
        <LinearGradient
          colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          {community.banner_url && (
            <Image
              source={{ uri: community.banner_url }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
          )}
        </LinearGradient>

        {/* Community Info */}
        <View style={[styles.infoSection, GLASSMORPHISM.light]}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            {community.avatar_url ? (
              <Image source={{ uri: community.avatar_url }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarEmoji}>👥</Text>
              </View>
            )}
          </View>

          {/* Name & Description */}
          <Text style={styles.communityName}>{community.name}</Text>

          <View style={styles.metaRow}>
            <Ionicons
              name={getPrivacyIcon(community.privacy) as any}
              size={14}
              color={COLORS.textSecondary}
            />
            <Text style={styles.metaText}>
              {community.privacy === 'public'
                ? 'Public'
                : community.privacy === 'private'
                ? 'Private'
                : 'Invite Only'}
            </Text>
            <Text style={styles.metaDot}>•</Text>
            <Text style={styles.metaText}>
              {community.member_count.toLocaleString()} members
            </Text>
          </View>

          {community.description && (
            <Text style={styles.description}>{community.description}</Text>
          )}

          {/* Join Button */}
          <TouchableOpacity
            style={[styles.joinButton, isMember && styles.memberButton]}
            onPress={handleJoinToggle}
            disabled={isJoining}
            activeOpacity={0.7}
          >
            {isJoining ? (
              <ActivityIndicator
                size="small"
                color={isMember ? COLORS.primary : '#FFFFFF'}
              />
            ) : (
              <>
                <Ionicons
                  name={isMember ? 'checkmark' : 'add'}
                  size={20}
                  color={isMember ? COLORS.primary : '#FFFFFF'}
                />
                <Text
                  style={[styles.joinButtonText, isMember && styles.memberButtonText]}
                >
                  {isMember ? 'Joined' : 'Join Community'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Posts Header */}
        <View style={styles.postsHeader}>
          <Text style={styles.postsTitle}>Posts</Text>
        </View>
      </View>
    )
  }

  const renderPost = ({ item: post }: { item: Post }) => {
    const author = post.author
    const hasReacted = !!post.user_reaction

    return (
      <TouchableOpacity
        style={[styles.postCard, GLASSMORPHISM.light, SHADOWS.card]}
        onPress={() => handlePostPress(post)}
        activeOpacity={0.8}
      >
        {/* Author Info */}
        <View style={styles.postHeader}>
          {author?.profile_photo_url ? (
            <Image source={{ uri: author.profile_photo_url }} style={styles.postAvatar} />
          ) : (
            <View style={[styles.postAvatar, styles.postAvatarPlaceholder]}>
              <Text style={styles.postAvatarInitial}>
                {author?.name?.charAt(0) || '?'}
              </Text>
            </View>
          )}
          <View style={styles.postAuthorInfo}>
            <Text style={styles.postAuthorName}>{author?.name || 'Anonymous'}</Text>
            <Text style={styles.postTime}>{formatDate(post.created_at)}</Text>
          </View>
        </View>

        {/* Content */}
        <Text style={styles.postContent} numberOfLines={4}>
          {post.content}
        </Text>

        {/* Media */}
        {post.media_urls && post.media_urls.length > 0 && (
          <Image
            source={{ uri: post.media_urls[0] }}
            style={styles.postMedia}
            resizeMode="cover"
          />
        )}

        {/* Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity
            style={[styles.actionButton, hasReacted && styles.actionButtonActive]}
            onPress={() => handleReaction(post, 'like')}
          >
            <Text style={styles.actionEmoji}>
              {hasReacted ? REACTION_EMOJIS[post.user_reaction!] : '👍'}
            </Text>
            <Text style={[styles.actionText, hasReacted && styles.actionTextActive]}>
              {post.like_count > 0 ? post.like_count : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={18} color={COLORS.textSecondary} />
            <Text style={styles.actionText}>
              {post.comment_count > 0 ? post.comment_count : ''}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="share-outline" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmptyPosts = () => (
    <View style={styles.emptyPosts}>
      <Text style={styles.emptyEmoji}>📝</Text>
      <Text style={styles.emptyTitle}>No posts yet</Text>
      <Text style={styles.emptyText}>
        Be the first to share something with this community!
      </Text>
    </View>
  )

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    )
  }

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
        <Text style={styles.headerTitle} numberOfLines={1}>
          {community?.name || 'Community'}
        </Text>
        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Posts */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderCommunityHeader}
        ListEmptyComponent={renderEmptyPosts}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
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
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    textAlign: 'center',
    marginHorizontal: SPACING.sm,
  },
  moreButton: {
    padding: SPACING.xs,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: SPACING.xxl,
  },
  banner: {
    height: 150,
    justifyContent: 'flex-end',
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
  },
  infoSection: {
    marginHorizontal: SPACING.md,
    marginTop: -40,
    padding: SPACING.md,
    alignItems: 'center',
  },
  avatarContainer: {
    marginTop: -30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: COLORS.background,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 36,
  },
  communityName: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginTop: SPACING.sm,
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  metaText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
  },
  metaDot: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.xs,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.md,
    lineHeight: 20,
  },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.xl,
    borderRadius: BORDER_RADIUS.large,
    marginTop: SPACING.md,
    gap: SPACING.xs,
  },
  memberButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  joinButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#FFFFFF',
  },
  memberButtonText: {
    color: COLORS.primary,
  },
  postsHeader: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  postsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  postCard: {
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  postAvatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postAvatarInitial: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  postAuthorInfo: {
    flex: 1,
  },
  postAuthorName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
  },
  postTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  postContent: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 20,
    marginBottom: SPACING.sm,
  },
  postMedia: {
    width: '100%',
    height: 180,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.sm,
  },
  postActions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
    gap: SPACING.lg,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionButtonActive: {
    opacity: 1,
  },
  actionEmoji: {
    fontSize: 18,
  },
  actionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  actionTextActive: {
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  emptyPosts: {
    alignItems: 'center',
    padding: SPACING.xxl,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
})

export default CommunityDetailScreen
