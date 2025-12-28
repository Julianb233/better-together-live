// Better Together Mobile: Messaging Screen
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
import type { Conversation, Message, User } from '../types'

const { width } = Dimensions.get('window')

type ViewMode = 'conversations' | 'chat'

const MessagingScreen: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>('conversations')
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const flatListRef = useRef<FlatList>(null)

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      const userId = await apiClient.getUserId()
      setCurrentUserId(userId)

      const response = await apiClient.getConversations()

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch conversations')
      }

      setConversations(response.data?.conversations || [])
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load conversations')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  // Fetch messages for a conversation
  const fetchMessages = useCallback(async (conversationId: string) => {
    try {
      setIsLoading(true)
      const response = await apiClient.getMessages(conversationId, 50)

      if (response.error) {
        throw new Error(response.error.message || 'Failed to fetch messages')
      }

      // Reverse for display (newest at bottom)
      const fetchedMessages = response.data?.messages || []
      setMessages(fetchedMessages.reverse())

      // Mark as read
      await apiClient.markMessagesRead(conversationId)
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load messages')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConversations()
  }, [fetchConversations])

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    if (viewMode === 'conversations') {
      fetchConversations()
    } else if (activeConversation) {
      fetchMessages(activeConversation.id)
      setIsRefreshing(false)
    }
  }, [viewMode, activeConversation, fetchConversations, fetchMessages])

  const handleConversationPress = async (conversation: Conversation) => {
    setActiveConversation(conversation)
    setViewMode('chat')
    await fetchMessages(conversation.id)
  }

  const handleBackPress = () => {
    setViewMode('conversations')
    setActiveConversation(null)
    setMessages([])
    fetchConversations()
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversation || isSending) return

    try {
      setIsSending(true)
      const response = await apiClient.sendMessage(
        activeConversation.id,
        messageText.trim(),
        'text'
      )

      if (response.error) {
        throw new Error(response.error.message || 'Failed to send message')
      }

      const newMessage = response.data?.message
      if (newMessage) {
        setMessages((prev) => [...prev, newMessage])
        setMessageText('')

        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true })
        }, 100)
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  const handleNewConversation = () => {
    Alert.alert('New Conversation', 'New conversation feature coming soon!')
  }

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
        onPress={() => handleConversationPress(conversation)}
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

  const renderMessage = ({ item: message }: { item: Message }) => {
    const isOwnMessage = message.sender_id === currentUserId
    const sender = message.sender

    return (
      <View
        style={[
          styles.messageContainer,
          isOwnMessage ? styles.ownMessage : styles.otherMessage,
        ]}
      >
        {!isOwnMessage && (
          <View style={styles.messageSenderInfo}>
            {sender?.profile_photo_url ? (
              <Image
                source={{ uri: sender.profile_photo_url }}
                style={styles.messageAvatar}
              />
            ) : (
              <View style={[styles.messageAvatar, styles.messageAvatarPlaceholder]}>
                <Text style={styles.messageAvatarInitial}>
                  {sender?.name?.charAt(0) || '?'}
                </Text>
              </View>
            )}
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isOwnMessage ? styles.ownBubble : styles.otherBubble,
          ]}
        >
          {message.message_type === 'text' && (
            <Text style={[styles.messageText, isOwnMessage && styles.ownMessageText]}>
              {message.content}
            </Text>
          )}
          {message.message_type === 'image' && message.media_url && (
            <Image
              source={{ uri: message.media_url }}
              style={styles.messageImage}
              resizeMode="cover"
            />
          )}
          <Text style={[styles.messageTime, isOwnMessage && styles.ownMessageTime]}>
            {formatTime(message.created_at)}
            {message.is_edited && ' (edited)'}
          </Text>
        </View>
      </View>
    )
  }

  const renderConversationsEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>💬</Text>
      <Text style={styles.emptyTitle}>No Conversations</Text>
      <Text style={styles.emptyDescription}>
        Start a conversation with other couples in the community!
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={handleNewConversation}
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

  const renderMessagesEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>👋</Text>
      <Text style={styles.emptyTitle}>No Messages Yet</Text>
      <Text style={styles.emptyDescription}>
        Send a message to start the conversation!
      </Text>
    </View>
  )

  // Conversations list view
  const renderConversationsView = () => (
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
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        ListEmptyComponent={renderConversationsEmptyState}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={handleNewConversation}
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

  // Chat view
  const renderChatView = () => (
    <KeyboardAvoidingView
      style={styles.chatContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* Chat Header */}
      <View style={[styles.chatHeader, SHADOWS.soft]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>

        {activeConversation && (
          <View style={styles.chatHeaderInfo}>
            {getConversationAvatar(activeConversation) ? (
              <Image
                source={{ uri: getConversationAvatar(activeConversation)! }}
                style={styles.chatAvatar}
              />
            ) : (
              <View style={[styles.chatAvatar, styles.chatAvatarPlaceholder]}>
                <Text style={styles.chatAvatarInitial}>
                  {getConversationTitle(activeConversation).charAt(0)}
                </Text>
              </View>
            )}
            <View>
              <Text style={styles.chatTitle}>
                {getConversationTitle(activeConversation)}
              </Text>
              <Text style={styles.chatStatus}>Active now</Text>
            </View>
          </View>
        )}

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
        ListEmptyComponent={renderMessagesEmptyState}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      {/* Message Input */}
      <View style={[styles.inputContainer, SHADOWS.soft]}>
        <TouchableOpacity style={styles.attachButton}>
          <Ionicons name="add-circle-outline" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <TextInput
          style={styles.messageInput}
          placeholder="Type a message..."
          placeholderTextColor={COLORS.textSecondary}
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={1000}
        />

        <TouchableOpacity
          style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
          onPress={handleSendMessage}
          disabled={!messageText.trim() || isSending}
          activeOpacity={0.7}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="send" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )

  if (isLoading && viewMode === 'conversations') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {viewMode === 'conversations' ? renderConversationsView() : renderChatView()}
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
  // Chat View Styles
  chatContainer: {
    flex: 1,
  },
  chatHeader: {
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
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  chatAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: SPACING.sm,
  },
  chatAvatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatAvatarInitial: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  chatTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  chatStatus: {
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
  messageContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
  },
  otherMessage: {
    alignSelf: 'flex-start',
  },
  messageSenderInfo: {
    marginRight: SPACING.xs,
  },
  messageAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  messageAvatarPlaceholder: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageAvatarInitial: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  messageBubble: {
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.large,
    maxWidth: '100%',
  },
  ownBubble: {
    backgroundColor: COLORS.primary,
    borderBottomRightRadius: BORDER_RADIUS.small,
  },
  otherBubble: {
    backgroundColor: COLORS.gray100,
    borderBottomLeftRadius: BORDER_RADIUS.small,
  },
  messageText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    lineHeight: 20,
  },
  ownMessageText: {
    color: '#FFFFFF',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: BORDER_RADIUS.medium,
    marginBottom: SPACING.xs,
  },
  messageTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: SPACING.sm,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attachButton: {
    padding: SPACING.xs,
    marginRight: SPACING.xs,
  },
  messageInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.large,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SPACING.xs,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.gray200,
  },
})

export default MessagingScreen
