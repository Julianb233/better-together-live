// Better Together Mobile: Chat Room Component
// Full chat interface with messages list and input
import React, { useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  SHADOWS,
} from '../../utils/constants'
import type { Conversation, Message } from '../../types'
import { MessageBubble } from './MessageBubble'
import { ChatInput } from './ChatInput'

interface ChatRoomProps {
  conversation: Conversation
  messages: Message[]
  currentUserId: string | null
  messageText: string
  onMessageTextChange: (text: string) => void
  onSendMessage: () => void
  onBack: () => void
  isSending?: boolean
  onAttach?: () => void
}

export const ChatRoom: React.FC<ChatRoomProps> = ({
  conversation,
  messages,
  currentUserId,
  messageText,
  onMessageTextChange,
  onSendMessage,
  onBack,
  isSending = false,
  onAttach,
}) => {
  const flatListRef = useRef<FlatList>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true })
      }, 100)
    }
  }, [messages.length])

  const getConversationTitle = () => {
    if (conversation.name) return conversation.name
    if (conversation.type === 'direct' && conversation.participants) {
      const otherParticipant = conversation.participants.find(
        (p) => p.user_id !== currentUserId
      )
      return otherParticipant?.user?.name || 'Unknown'
    }
    return 'Conversation'
  }

  const getConversationAvatar = () => {
    if (conversation.avatar_url) return conversation.avatar_url
    if (conversation.type === 'direct' && conversation.participants) {
      const otherParticipant = conversation.participants.find(
        (p) => p.user_id !== currentUserId
      )
      return otherParticipant?.user?.profile_photo_url
    }
    return null
  }

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isOwnMessage = message.sender_id === currentUserId
    return <MessageBubble message={message} isOwnMessage={isOwnMessage} />
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>👋</Text>
      <Text style={styles.emptyTitle}>No Messages Yet</Text>
      <Text style={styles.emptyDescription}>
        Send a message to start the conversation!
      </Text>
    </View>
  )

  const avatarUrl = getConversationAvatar()
  const title = getConversationTitle()

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Chat Header */}
      <View style={[styles.header, SHADOWS.soft]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarPlaceholder]}>
              <Text style={styles.avatarInitial}>{title.charAt(0)}</Text>
            </View>
          )}
          <View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.status}>Active now</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesContent}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Message Input */}
      <ChatInput
        value={messageText}
        onChangeText={onMessageTextChange}
        onSend={onSendMessage}
        onAttach={onAttach}
        isSending={isSending}
      />
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: SPACING.xs,
    marginRight: SPACING.sm,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  avatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  title: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  status: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.success,
  },
  moreButton: {
    padding: SPACING.xs,
  },
  messagesContent: {
    padding: SPACING.md,
    flexGrow: 1,
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
  },
})
