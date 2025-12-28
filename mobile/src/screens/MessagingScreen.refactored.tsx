// Better Together Mobile: Messaging Screen (Refactored with Modular Components)
// Uses ChatList, ChatRoom, MessageBubble, and ChatInput components
import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Text,
} from 'react-native'
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants'
import apiClient from '../api/client'
import type { Conversation, Message } from '../types'
import type { ChatViewMode } from '../types/chat'
import { ChatList, ChatRoom } from '../components/chat'

const MessagingScreen: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [viewMode, setViewMode] = useState<ChatViewMode>('conversations')
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messageText, setMessageText] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

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

  const handleAttachment = () => {
    Alert.alert('Attachments', 'Attachment feature coming soon!')
  }

  // Loading state
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
      {viewMode === 'conversations' ? (
        <ChatList
          conversations={conversations}
          currentUserId={currentUserId}
          onConversationPress={handleConversationPress}
          onNewConversation={handleNewConversation}
          isRefreshing={isRefreshing}
          onRefresh={onRefresh}
        />
      ) : activeConversation ? (
        <ChatRoom
          conversation={activeConversation}
          messages={messages}
          currentUserId={currentUserId}
          messageText={messageText}
          onMessageTextChange={setMessageText}
          onSendMessage={handleSendMessage}
          onBack={handleBackPress}
          isSending={isSending}
          onAttach={handleAttachment}
        />
      ) : null}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
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
})

export default MessagingScreen
