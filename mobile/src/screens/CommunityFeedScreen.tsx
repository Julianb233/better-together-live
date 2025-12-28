// Better Together Mobile: Community Feed Screen
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
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
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
import type { Post, User, ReactionType } from '../types'

const { width } = Dimensions.get('window')

type FeedFilter = 'all' | 'trending' | 'following'

const REACTION_EMOJIS: Record<ReactionType, string> = {
  like: '👍',
  love: '❤️',
  celebrate: '🎉',
  support: '🤗',
  insightful: '💡',
}

const CommunityFeedScreen: React.FC<any> = ({ navigation }) => {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [selectedFilter, setSelectedFilter] = useState<FeedFilter>('all')
  const [showCreatePost, setShowCreatePost] = useState(false)
  const [newPostContent, setNewPostContent] = useState('')
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  // Fetch posts
  const fetchPosts = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh && !isLoading) setIsLoading(true)

      const userId = await apiClient.getUserId()
      setCurrentUserId(userId)

      let response
      if (selectedFilter === 'trending') {
        response = await apiClient.getTrendingPosts(20)
      } else {
        response = await apiClient.getFeed(20, 0)
      }

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch posts')
      }

      const fetchedPosts = response.data?.posts || []
      setPosts(fetchedPosts)
      setHasMore((response.data as any)?.hasMore ?? fetchedPosts.length >= 20)
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load feed')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [selectedFilter])

  // Load more posts
  const loadMorePosts = useCallback(async () => {
    if (isLoadingMore || !hasMore) return

    try {
      setIsLoadingMore(true)
      const response = await apiClient.getFeed(20, posts.length)

      if (response.error) {
        throw new Error(response.error.message || 'Failed to load more posts')
      }

      const newPosts = response.data?.posts || []
      setPosts((prev) => [...prev, ...newPosts])
      setHasMore(newPosts.length >= 20)
    } catch (error: any) {
      console.error('Failed to load more posts:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore, hasMore, posts.length])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    fetchPosts(true)
  }, [fetchPosts])

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Error', 'Please enter some content for your post')
      return
    }

    try {
      setIsCreatingPost(true)
      const response = await apiClient.createPost({
        content: newPostContent.trim(),
        post_type: 'text',
        visibility: 'public',
      })

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create post')
      }

      setShowCreatePost(false)
      setNewPostContent('')
      Alert.alert('Success', 'Post created!')
      fetchPosts(true)
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to create post')
    } finally {
      setIsCreatingPost(false)
    }
  }

  const handleReaction = async (post: Post, reactionType: ReactionType) => {
    try {
      if (post.user_reaction === reactionType) {
        // Remove reaction
        await apiClient.removeReaction('post', post.id)
        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? { ...p, user_reaction: undefined, like_count: p.like_count - 1 }
              : p
          )
        )
      } else {
        // Add reaction
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

  const handleComment = (post: Post) => {
    navigation.navigate('PostDetail', { postId: post.id })
  }

  const handlePostPress = (post: Post) => {
    navigation.navigate('PostDetail', { postId: post.id })
  }

  const handleAuthorPress = (userId: string) => {
    navigation.navigate('UserProfile', { userId })
  }

  const handleCommunityPress = (communityId: string) => {
    navigation.navigate('CommunityDetail', { communityId })
  }

  const handleShare = (post: Post) => {
    Alert.alert('Share', 'Share feature coming soon!')
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

  const getPostTypeIcon = (postType: string) => {
    switch (postType) {
      case 'milestone':
        return '🏆'
      case 'activity_share':
        return '❤️'
      case 'challenge_share':
        return '🎯'
      case 'image':
        return '📷'
      case 'poll':
        return '📊'
      default:
        return '💬'
    }
  }

  const renderFilterTab = (filter: FeedFilter, label: string, icon: string) => {
    const isActive = selectedFilter === filter
    return (
      <TouchableOpacity
        key={filter}
        style={[styles.filterTab, isActive && styles.filterTabActive]}
        onPress={() => setSelectedFilter(filter)}
        activeOpacity={0.7}
      >
        <Text style={styles.filterIcon}>{icon}</Text>
        <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderPost = ({ item: post }: { item: Post }) => {
    const author = post.author
    const hasReacted = !!post.user_reaction

    return (
      <TouchableOpacity
        style={[styles.postCard, GLASSMORPHISM.light, SHADOWS.card]}
        onPress={() => handlePostPress(post)}
        activeOpacity={0.9}
      >
        {/* Post Header */}
        <View style={styles.postHeader}>
          <TouchableOpacity
            style={styles.authorInfo}
            onPress={() => author?.id && handleAuthorPress(author.id)}
            activeOpacity={0.7}
          >
            {author?.profile_photo_url ? (
              <Image
                source={{ uri: author.profile_photo_url }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>
                  {author?.name?.charAt(0) || '?'}
                </Text>
              </View>
            )}
            <View style={styles.authorDetails}>
              <Text style={styles.authorName}>
                {author?.name || 'Anonymous'}
              </Text>
              <View style={styles.postMeta}>
                <Text style={styles.postTime}>{formatDate(post.created_at)}</Text>
                {post.community && (
                  <>
                    <Text style={styles.postMetaDot}>•</Text>
                    <TouchableOpacity onPress={() => handleCommunityPress(post.community!.id)}>
                      <Text style={styles.communityName}>{post.community.name}</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Post Content */}
        <View style={styles.postContent}>
          {post.post_type !== 'text' && (
            <View style={styles.postTypeBadge}>
              <Text style={styles.postTypeIcon}>{getPostTypeIcon(post.post_type)}</Text>
            </View>
          )}
          <Text style={styles.postText}>{post.content}</Text>

          {/* Media */}
          {post.media_urls && post.media_urls.length > 0 && (
            <View style={styles.mediaContainer}>
              <Image
                source={{ uri: post.media_urls[0] }}
                style={styles.postMedia}
                resizeMode="cover"
              />
            </View>
          )}
        </View>

        {/* Post Stats */}
        <View style={styles.postStats}>
          <Text style={styles.statText}>
            {post.like_count > 0 && `${post.like_count} reactions`}
          </Text>
          <Text style={styles.statText}>
            {post.comment_count > 0 && `${post.comment_count} comments`}
          </Text>
        </View>

        {/* Post Actions */}
        <View style={styles.postActions}>
          <TouchableOpacity
            style={[styles.actionButton, hasReacted && styles.actionButtonActive]}
            onPress={() => handleReaction(post, 'like')}
            activeOpacity={0.7}
          >
            <Text style={styles.actionIcon}>
              {hasReacted ? REACTION_EMOJIS[post.user_reaction!] : '👍'}
            </Text>
            <Text style={[styles.actionText, hasReacted && styles.actionTextActive]}>
              {hasReacted ? 'Reacted' : 'React'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleComment(post)}
            activeOpacity={0.7}
          >
            <Ionicons name="chatbubble-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.actionText}>Comment</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleShare(post)}
            activeOpacity={0.7}
          >
            <Ionicons name="share-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.actionText}>Share</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>💬</Text>
      <Text style={styles.emptyTitle}>No Posts Yet</Text>
      <Text style={styles.emptyDescription}>
        Be the first to share something with the community!
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => setShowCreatePost(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.emptyButtonGradient}
        >
          <Text style={styles.emptyButtonText}>Create Post</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )

  const renderFooter = () => {
    if (!isLoadingMore) return null
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    )
  }

  const renderCreatePostModal = () => (
    <Modal
      visible={showCreatePost}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setShowCreatePost(false)}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <SafeAreaView style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              onPress={() => setShowCreatePost(false)}
              disabled={isCreatingPost}
            >
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Create Post</Text>
            <TouchableOpacity
              onPress={handleCreatePost}
              disabled={isCreatingPost || !newPostContent.trim()}
            >
              {isCreatingPost ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text
                  style={[
                    styles.modalPost,
                    !newPostContent.trim() && styles.modalPostDisabled,
                  ]}
                >
                  Post
                </Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.composerContainer}>
            <TextInput
              style={styles.composerInput}
              placeholder="What's on your mind?"
              placeholderTextColor={COLORS.textSecondary}
              multiline
              value={newPostContent}
              onChangeText={setNewPostContent}
              autoFocus
              editable={!isCreatingPost}
            />
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  )

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading feed...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryPurple] as readonly [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Community</Text>
        <Text style={styles.headerSubtitle}>
          Connect with other couples on their journey
        </Text>
      </LinearGradient>

      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {renderFilterTab('all', 'For You', '✨')}
        {renderFilterTab('trending', 'Trending', '🔥')}
        {renderFilterTab('following', 'Following', '👥')}
      </View>

      {/* Feed */}
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.feedContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        onEndReached={loadMorePosts}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowCreatePost(true)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="add" size={28} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {renderCreatePostModal()}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  header: {
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: FONT_WEIGHTS.medium,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: COLORS.gray100,
    marginRight: SPACING.sm,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterIcon: {
    fontSize: FONT_SIZES.md,
    marginRight: SPACING.xs,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  feedContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl + 60,
  },
  postCard: {
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: SPACING.sm,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  authorDetails: {
    flex: 1,
  },
  authorName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  postMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  postTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  postMetaDot: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginHorizontal: SPACING.xs,
  },
  communityName: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  moreButton: {
    padding: SPACING.xs,
  },
  postContent: {
    marginBottom: SPACING.sm,
  },
  postTypeBadge: {
    marginBottom: SPACING.xs,
  },
  postTypeIcon: {
    fontSize: 20,
  },
  postText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 22,
  },
  mediaContainer: {
    marginTop: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
    overflow: 'hidden',
  },
  postMedia: {
    width: '100%',
    height: 200,
    borderRadius: BORDER_RADIUS.medium,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginBottom: SPACING.xs,
  },
  statText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  actionButtonActive: {
    backgroundColor: `${COLORS.primary}10`,
    borderRadius: BORDER_RADIUS.medium,
  },
  actionIcon: {
    fontSize: 18,
    marginRight: SPACING.xs,
  },
  actionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: FONT_WEIGHTS.medium,
  },
  actionTextActive: {
    color: COLORS.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  emptyButton: {
    borderRadius: BORDER_RADIUS.large,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  emptyButtonGradient: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  emptyButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  loadingMore: {
    paddingVertical: SPACING.lg,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    ...SHADOWS.heavy,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalContent: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalCancel: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  modalPost: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
  },
  modalPostDisabled: {
    color: COLORS.textSecondary,
  },
  composerContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  composerInput: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.text,
    minHeight: 150,
    textAlignVertical: 'top',
  },
})

export default CommunityFeedScreen
