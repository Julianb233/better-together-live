// Better Together Mobile: Post Detail Screen with Comments
import React, { useState, useEffect, useCallback, useRef } from 'react'
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
  KeyboardAvoidingView,
  Platform,
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
import type { Post, Comment, ReactionType, User } from '../types'

const REACTION_EMOJIS: Record<ReactionType, string> = {
  like: '👍',
  love: '❤️',
  celebrate: '🎉',
  support: '🤗',
  insightful: '💡',
}

const PostDetailScreen: React.FC<any> = ({ route, navigation }) => {
  const { postId } = route.params
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSendingComment, setIsSendingComment] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const inputRef = useRef<TextInput>(null)

  const fetchPostAndComments = useCallback(async () => {
    try {
      const userId = await apiClient.getUserId()
      setCurrentUserId(userId)

      const [postResponse, commentsResponse] = await Promise.all([
        apiClient.getPost(postId),
        apiClient.getComments(postId),
      ])

      if (postResponse.error) {
        throw new Error(postResponse.error.message || 'Failed to fetch post')
      }

      if (commentsResponse.error) {
        throw new Error(commentsResponse.error.message || 'Failed to fetch comments')
      }

      setPost(postResponse.data?.post || null)
      setComments(commentsResponse.data?.comments || [])
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load post')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [postId])

  useEffect(() => {
    fetchPostAndComments()
  }, [fetchPostAndComments])

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    fetchPostAndComments()
  }, [fetchPostAndComments])

  const handleReaction = async (reactionType: ReactionType) => {
    if (!post) return

    try {
      if (post.user_reaction === reactionType) {
        await apiClient.removeReaction('post', post.id)
        setPost((prev) =>
          prev
            ? { ...prev, user_reaction: undefined, like_count: prev.like_count - 1 }
            : null
        )
      } else {
        await apiClient.addReaction('post', post.id, reactionType)
        setPost((prev) =>
          prev
            ? {
                ...prev,
                user_reaction: reactionType,
                like_count: prev.user_reaction ? prev.like_count : prev.like_count + 1,
              }
            : null
        )
      }
    } catch (error: any) {
      console.error('Failed to update reaction:', error)
    }
  }

  const handleSendComment = async () => {
    if (!commentText.trim() || isSendingComment) return

    try {
      setIsSendingComment(true)
      const response = await apiClient.createComment(
        postId,
        commentText.trim(),
        replyingTo?.id
      )

      if (response.error) {
        throw new Error(response.error.message || 'Failed to send comment')
      }

      const newComment = response.data?.comment
      if (newComment) {
        setComments((prev) => [newComment, ...prev])
        setCommentText('')
        setReplyingTo(null)

        // Update comment count
        setPost((prev) =>
          prev ? { ...prev, comment_count: prev.comment_count + 1 } : null
        )
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send comment')
    } finally {
      setIsSendingComment(false)
    }
  }

  const handleReplyPress = (comment: Comment) => {
    setReplyingTo(comment)
    inputRef.current?.focus()
  }

  const handleCancelReply = () => {
    setReplyingTo(null)
  }

  const handleDeleteComment = async (commentId: string) => {
    Alert.alert('Delete Comment', 'Are you sure you want to delete this comment?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const response = await apiClient.deleteComment(commentId)
            if (response.error) {
              throw new Error(response.error.message || 'Failed to delete comment')
            }
            setComments((prev) => prev.filter((c) => c.id !== commentId))
            setPost((prev) =>
              prev ? { ...prev, comment_count: prev.comment_count - 1 } : null
            )
          } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to delete comment')
          }
        },
      },
    ])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString()
  }

  const renderPostHeader = () => {
    if (!post) return null

    const author = post.author

    return (
      <View style={[styles.postCard, GLASSMORPHISM.light, SHADOWS.card]}>
        {/* Author Info */}
        <View style={styles.authorRow}>
          {author?.profile_photo_url ? (
            <Image source={{ uri: author.profile_photo_url }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>
                {author?.name?.charAt(0) || '?'}
              </Text>
            </View>
          )}
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{author?.name || 'Anonymous'}</Text>
            <Text style={styles.postTime}>{formatDate(post.created_at)}</Text>
          </View>
        </View>

        {/* Post Content */}
        <Text style={styles.postContent}>{post.content}</Text>

        {/* Media */}
        {post.media_urls && post.media_urls.length > 0 && (
          <Image
            source={{ uri: post.media_urls[0] }}
            style={styles.postMedia}
            resizeMode="cover"
          />
        )}

        {/* Stats */}
        <View style={styles.statsRow}>
          <Text style={styles.statText}>
            {post.like_count} reactions • {post.comment_count} comments
          </Text>
        </View>

        {/* Reaction Buttons */}
        <View style={styles.reactionsRow}>
          {(Object.keys(REACTION_EMOJIS) as ReactionType[]).map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.reactionButton,
                post.user_reaction === type && styles.reactionButtonActive,
              ]}
              onPress={() => handleReaction(type)}
              activeOpacity={0.7}
            >
              <Text style={styles.reactionEmoji}>{REACTION_EMOJIS[type]}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Comments Header */}
        <View style={styles.commentsHeader}>
          <Text style={styles.commentsTitle}>Comments</Text>
        </View>
      </View>
    )
  }

  const renderComment = ({ item: comment }: { item: Comment }) => {
    const author = comment.author
    const isOwnComment = comment.author_id === currentUserId

    return (
      <View style={styles.commentItem}>
        <View style={styles.commentRow}>
          {author?.profile_photo_url ? (
            <Image
              source={{ uri: author.profile_photo_url }}
              style={styles.commentAvatar}
            />
          ) : (
            <View style={[styles.commentAvatar, styles.commentAvatarPlaceholder]}>
              <Text style={styles.commentAvatarInitial}>
                {author?.name?.charAt(0) || '?'}
              </Text>
            </View>
          )}

          <View style={styles.commentContent}>
            <View style={styles.commentBubble}>
              <Text style={styles.commentAuthor}>{author?.name || 'Anonymous'}</Text>
              <Text style={styles.commentText}>{comment.content}</Text>
            </View>

            <View style={styles.commentActions}>
              <Text style={styles.commentTime}>{formatDate(comment.created_at)}</Text>
              <TouchableOpacity onPress={() => handleReplyPress(comment)}>
                <Text style={styles.commentAction}>Reply</Text>
              </TouchableOpacity>
              {comment.like_count > 0 && (
                <Text style={styles.commentLikes}>{comment.like_count} likes</Text>
              )}
              {isOwnComment && (
                <TouchableOpacity onPress={() => handleDeleteComment(comment.id)}>
                  <Text style={[styles.commentAction, styles.deleteAction]}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    )
  }

  const renderEmptyComments = () => (
    <View style={styles.emptyComments}>
      <Text style={styles.emptyText}>No comments yet. Be the first!</Text>
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
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={[styles.header, SHADOWS.soft]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Comments List */}
        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={renderPostHeader}
          ListEmptyComponent={renderEmptyComments}
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

        {/* Reply Banner */}
        {replyingTo && (
          <View style={styles.replyBanner}>
            <Text style={styles.replyText}>
              Replying to <Text style={styles.replyName}>{replyingTo.author?.name}</Text>
            </Text>
            <TouchableOpacity onPress={handleCancelReply}>
              <Ionicons name="close" size={20} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>
        )}

        {/* Comment Input */}
        <View style={[styles.inputContainer, SHADOWS.soft]}>
          <TextInput
            ref={inputRef}
            style={styles.commentInput}
            placeholder="Write a comment..."
            placeholderTextColor={COLORS.textSecondary}
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!commentText.trim() || isSendingComment) && styles.sendButtonDisabled,
            ]}
            onPress={handleSendComment}
            disabled={!commentText.trim() || isSendingComment}
          >
            {isSendingComment ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="send" size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  keyboardView: {
    flex: 1,
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
  headerSpacer: {
    width: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: SPACING.lg,
  },
  postCard: {
    margin: SPACING.md,
    padding: SPACING.md,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
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
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
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
    lineHeight: 22,
    marginBottom: SPACING.md,
  },
  postMedia: {
    width: '100%',
    height: 250,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.md,
  },
  statsRow: {
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  statText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  reactionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  reactionButton: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.medium,
  },
  reactionButtonActive: {
    backgroundColor: `${COLORS.primary}15`,
  },
  reactionEmoji: {
    fontSize: 24,
  },
  commentsHeader: {
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  commentsTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  commentItem: {
    paddingHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: SPACING.sm,
  },
  commentAvatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  commentAvatarInitial: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  commentContent: {
    flex: 1,
  },
  commentBubble: {
    backgroundColor: COLORS.gray100,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.large,
    borderTopLeftRadius: BORDER_RADIUS.small,
  },
  commentAuthor: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: 2,
  },
  commentText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    lineHeight: 18,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    paddingLeft: SPACING.xs,
  },
  commentTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginRight: SPACING.md,
  },
  commentAction: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: FONT_WEIGHTS.medium,
    marginRight: SPACING.md,
  },
  deleteAction: {
    color: COLORS.error,
  },
  commentLikes: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  emptyComments: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  replyBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  replyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  replyName: {
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  commentInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.large,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray200,
  },
})

export default PostDetailScreen
