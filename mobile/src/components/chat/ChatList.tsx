// Better Together Mobile: Chat List Component
// Displays a list of conversations/chat threads
import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
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
} from '../../utils/constants'
import type { Conversation } from '../../types'

interface ChatListProps {
  conversations: Conversation[]
  currentUserId: string | null
  onConversationPress: (conversation: Conversation) => void
  onNewConversation: () => void
  isRefreshing?: boolean
  onRefresh?: () => void
}

export const ChatList: React.FC<ChatListProps> = ({
  conversations,
  currentUserId,
  onConversationPress,
  onNewConversation,
  isRefreshing = false,
  onRefresh,
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.name) return conversation.name
    if (conversation.type === 'direct' && conversation.participants) {
      const otherParticipant = conversation.participants.find(
        (p) => p.user_id !== currentUserId
      )
      return otherParticipant?.user?.name || 'Unknown'
    }
    return 'Conversation'
  }

  const getConversationAvatar = (conversation: Conversation) => {
    if (conversation.avatar_url) return conversation.avatar_url
    if (conversation.type === 'direct' && conversation.participants) {
      const otherParticipant = conversation.participants.find(
        (p) => p.user_id !== currentUserId
      )
      return otherParticipant?.user?.profile_photo_url
    }
    return null
  }

  const renderConversation = ({ item: conversation }: { item: Conversation }) => {
    const title = getConversationTitle(conversation)
    const avatarUrl = getConversationAvatar(conversation)
    const hasUnread = (conversation.unread_count || 0) > 0

    return (
      <TouchableOpacity
        style={[styles.conversationItem, GLASSMORPHISM.light]}
        onPress={() => onConversationPress(conversation)}
        activeOpacity={0.7}
      >
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.conversationAvatar} />
        ) : (
          <View style={[styles.conversationAvatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>
              {title.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}

        <View style={styles.conversationContent}>
          <View style={styles.conversationHeader}>
            <Text style={[styles.conversationTitle, hasUnread && styles.unreadTitle]}>
              {title}
            </Text>
            <Text style={styles.conversationTime}>
              {conversation.last_message_at
                ? formatTime(conversation.last_message_at)
                : ''}
            </Text>
          </View>
          <View style={styles.conversationPreview}>
            <Text
              style={[styles.previewText, hasUnread && styles.unreadPreview]}
              numberOfLines={1}
            >
              {conversation.last_message_preview || 'No messages yet'}
            </Text>
            {hasUnread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{conversation.unread_count}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>💬</Text>
      <Text style={styles.emptyTitle}>No Conversations</Text>
      <Text style={styles.emptyDescription}>
        Start a conversation with other couples in the community!
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={onNewConversation}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.emptyButtonGradient}
        >
          <Text style={styles.emptyButtonText}>Start Chat</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )

  return (
    <>
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryPurple] as readonly [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Messages</Text>
        <Text style={styles.headerSubtitle}>
          Stay connected with your community
        </Text>
      </LinearGradient>

      <FlatList
        data={conversations}
        renderItem={renderConversation}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              tintColor={COLORS.primary}
              colors={[COLORS.primary]}
            />
          ) : undefined
        }
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={onNewConversation}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.fabGradient}
        >
          <Ionicons name="create-outline" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
    </>
  )
}

const styles = StyleSheet.create({
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
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl + 60,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  conversationAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginRight: SPACING.md,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.text,
    flex: 1,
  },
  unreadTitle: {
    fontWeight: FONT_WEIGHTS.bold,
  },
  conversationTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginLeft: SPACING.sm,
  },
  conversationPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  unreadPreview: {
    color: COLORS.text,
    fontWeight: FONT_WEIGHTS.medium,
  },
  unreadBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginLeft: SPACING.sm,
  },
  unreadCount: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
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
})
