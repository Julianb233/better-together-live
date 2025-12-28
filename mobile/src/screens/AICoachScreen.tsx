// Better Together Mobile: AI Coach Screen - Modern Chat Interface
import React, { useState, useEffect, useRef, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, SPACING, FONT_SIZES, GRADIENTS, SHADOWS } from '../utils/constants'
import { apiClient } from '../api/client'

const { width } = Dimensions.get('window')

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface QuickAction {
  id: string
  emoji: string
  label: string
  prompt: string
}

const QUICK_ACTIONS: QuickAction[] = [
  { id: '1', emoji: '💬', label: 'Communication', prompt: 'How can we improve our communication as a couple?' },
  { id: '2', emoji: '❤️', label: 'Connection', prompt: 'What are some ways to feel more connected with my partner?' },
  { id: '3', emoji: '🌃', label: 'Date Ideas', prompt: 'Can you suggest some creative date night ideas?' },
  { id: '4', emoji: '🤝', label: 'Conflict', prompt: 'How can we resolve conflicts more effectively?' },
  { id: '5', emoji: '💕', label: 'Love Languages', prompt: 'How can I better express love in my partner\'s love language?' },
  { id: '6', emoji: '🎯', label: 'Goals', prompt: 'What are some relationship goals we should set together?' },
]

const TypingIndicator = () => {
  const dot1 = useRef(new Animated.Value(0)).current
  const dot2 = useRef(new Animated.Value(0)).current
  const dot3 = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const animate = (dot: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(dot, { toValue: 1, duration: 300, useNativeDriver: true }),
          Animated.timing(dot, { toValue: 0, duration: 300, useNativeDriver: true }),
          Animated.delay(600 - delay),
        ])
      )
    }

    Animated.parallel([
      animate(dot1, 0),
      animate(dot2, 200),
      animate(dot3, 400),
    ]).start()
  }, [])

  const animatedStyle = (dot: Animated.Value) => ({
    transform: [{ translateY: dot.interpolate({ inputRange: [0, 1], outputRange: [0, -6] }) }],
    opacity: dot.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }),
  })

  return (
    <View style={styles.typingContainer}>
      <BlurView intensity={80} tint="light" style={styles.typingBubble}>
        <Text style={styles.typingEmoji}>🤔</Text>
        <View style={styles.dotsContainer}>
          <Animated.View style={[styles.dot, animatedStyle(dot1)]} />
          <Animated.View style={[styles.dot, animatedStyle(dot2)]} />
          <Animated.View style={[styles.dot, animatedStyle(dot3)]} />
        </View>
        <Text style={styles.typingText}>AI is thinking...</Text>
      </BlurView>
    </View>
  )
}

const MessageBubble = ({ message, isLast }: { message: Message; isLast: boolean }) => {
  const isUser = message.role === 'user'
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(20)).current

  useEffect(() => {
    if (isLast) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
      ]).start()
    } else {
      fadeAnim.setValue(1)
      slideAnim.setValue(0)
    }
  }, [isLast])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <Animated.View
      style={[
        styles.messageWrapper,
        isUser ? styles.userMessageWrapper : styles.assistantMessageWrapper,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      {!isUser && (
        <View style={styles.avatarContainer}>
          <LinearGradient colors={GRADIENTS.primary} style={styles.avatar}>
            <Text style={styles.avatarEmoji}>💕</Text>
          </LinearGradient>
        </View>
      )}
      <View style={[styles.bubbleContainer, isUser ? styles.userBubbleContainer : styles.assistantBubbleContainer]}>
        {isUser ? (
          <LinearGradient colors={GRADIENTS.primary} style={styles.userBubble}>
            <Text style={styles.userMessageText}>{message.content}</Text>
          </LinearGradient>
        ) : (
          <BlurView intensity={80} tint="light" style={styles.assistantBubble}>
            <Text style={styles.assistantMessageText}>{message.content}</Text>
          </BlurView>
        )}
        <Text style={[styles.timestamp, isUser ? styles.userTimestamp : styles.assistantTimestamp]}>
          {formatTime(message.timestamp)}
        </Text>
      </View>
    </Animated.View>
  )
}

const QuickActionButton = ({ action, onPress }: { action: QuickAction; onPress: () => void }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Animated.View style={[styles.quickActionButton, { transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={80} tint="light" style={styles.quickActionContent}>
          <Text style={styles.quickActionEmoji}>{action.emoji}</Text>
          <Text style={styles.quickActionLabel}>{action.label}</Text>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  )
}

const AICoachScreen: React.FC = () => {
  const navigation = useNavigation()
  const scrollViewRef = useRef<ScrollView>(null)
  const inputRef = useRef<TextInput>(null)

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! 💕 I'm your AI relationship coach. I'm here to help you and your partner build a stronger, more loving connection. What would you like to talk about today?",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [relationshipId, setRelationshipId] = useState<string | null>(null)
  const [showQuickActions, setShowQuickActions] = useState(true)

  useEffect(() => {
    const loadRelationshipId = async () => {
      try {
        const userId = await apiClient.getUserId()
        if (userId) {
          const response = await apiClient.getRelationship(userId)
          if (response.data?.relationship?.id) {
            setRelationshipId(response.data.relationship.id)
          }
        }
      } catch (err) {
        console.error('Failed to load relationship:', err)
      }
    }
    loadRelationshipId()
  }, [])

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const handleSend = async (customMessage?: string) => {
    const messageContent = customMessage || inputText.trim()
    if (!messageContent || isLoading) return

    setShowQuickActions(false)

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsLoading(true)

    try {
      if (relationshipId) {
        const response = await apiClient.askAICoach({
          message: messageContent,
          relationship_id: relationshipId,
        })

        if (response.data?.response) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.data.response,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
        } else {
          throw new Error('No response received')
        }
      } else {
        // Demo mode without relationship
        const demoResponses = [
          "That's a wonderful question! Building strong communication is key to any relationship. Try setting aside 15 minutes each day for uninterrupted conversation with your partner. 💬",
          "I love that you're thinking about this! One great way to strengthen your bond is through shared experiences. Plan a new activity together this week! 🎯",
          "Great insight! Remember, small gestures of appreciation can make a huge difference. Consider expressing gratitude for something specific your partner did today. ❤️",
        ]
        const randomResponse = demoResponses[Math.floor(Math.random() * demoResponses.length)]

        setTimeout(() => {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: randomResponse,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, assistantMessage])
          setIsLoading(false)
        }, 1500)
        return
      }
    } catch (err) {
      console.error('AI Coach error:', err)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I had trouble processing that. Could you try asking again? 🙏",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleQuickAction = (action: QuickAction) => {
    handleSend(action.prompt)
  }

  return (
    <LinearGradient colors={['#fdf2f8', '#fce7f3', '#fbcfe8']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={COLORS.gray800} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <LinearGradient colors={GRADIENTS.primary} style={styles.headerAvatar}>
              <Text style={styles.headerAvatarEmoji}>💕</Text>
            </LinearGradient>
            <View style={styles.headerText}>
              <Text style={styles.headerTitle}>AI Coach</Text>
              <View style={styles.onlineStatus}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineText}>Always here for you</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.menuButton}>
            <Feather name="more-vertical" size={24} color={COLORS.gray800} />
          </TouchableOpacity>
        </View>

        <KeyboardAvoidingView
          style={styles.keyboardAvoid}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={0}
        >
          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isLast={index === messages.length - 1}
              />
            ))}

            {isLoading && <TypingIndicator />}

            {/* Quick Actions */}
            {showQuickActions && messages.length === 1 && (
              <View style={styles.quickActionsContainer}>
                <Text style={styles.quickActionsTitle}>Quick topics to explore:</Text>
                <View style={styles.quickActionsGrid}>
                  {QUICK_ACTIONS.map((action) => (
                    <QuickActionButton
                      key={action.id}
                      action={action}
                      onPress={() => handleQuickAction(action)}
                    />
                  ))}
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputContainer}>
            <BlurView intensity={90} tint="light" style={styles.inputBlur}>
              <View style={styles.inputRow}>
                <TextInput
                  ref={inputRef}
                  style={styles.textInput}
                  value={inputText}
                  onChangeText={setInputText}
                  placeholder="Ask me anything..."
                  placeholderTextColor={COLORS.textLight}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  onPress={() => handleSend()}
                  disabled={!inputText.trim() || isLoading}
                  style={[
                    styles.sendButton,
                    (!inputText.trim() || isLoading) && styles.sendButtonDisabled,
                  ]}
                >
                  <LinearGradient
                    colors={inputText.trim() && !isLoading ? GRADIENTS.primary : ['#d1d5db', '#9ca3af']}
                    style={styles.sendButtonGradient}
                  >
                    <Feather name="send" size={20} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(236, 72, 153, 0.1)',
  },
  backButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  headerAvatarEmoji: {
    fontSize: 22,
  },
  headerText: {
    marginLeft: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.gray800,
  },
  onlineStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  onlineText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  menuButton: {
    padding: SPACING.sm,
  },
  keyboardAvoid: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
  },
  userMessageWrapper: {
    justifyContent: 'flex-end',
  },
  assistantMessageWrapper: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    marginRight: SPACING.sm,
    alignSelf: 'flex-end',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 16,
  },
  bubbleContainer: {
    maxWidth: width * 0.75,
  },
  userBubbleContainer: {
    alignItems: 'flex-end',
  },
  assistantBubbleContainer: {
    alignItems: 'flex-start',
  },
  userBubble: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: 20,
    borderBottomRightRadius: 6,
    ...SHADOWS.soft,
  },
  assistantBubble: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  userMessageText: {
    fontSize: FONT_SIZES.md,
    color: 'white',
    lineHeight: 22,
  },
  assistantMessageText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.gray800,
    lineHeight: 22,
  },
  timestamp: {
    fontSize: 10,
    marginTop: 4,
  },
  userTimestamp: {
    color: COLORS.textLight,
  },
  assistantTimestamp: {
    color: COLORS.textLight,
  },
  typingContainer: {
    marginBottom: SPACING.md,
  },
  typingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    borderBottomLeftRadius: 6,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    alignSelf: 'flex-start',
  },
  typingEmoji: {
    fontSize: 16,
    marginRight: SPACING.sm,
  },
  dotsContainer: {
    flexDirection: 'row',
    marginRight: SPACING.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginHorizontal: 2,
  },
  typingText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  quickActionsContainer: {
    marginTop: SPACING.lg,
  },
  quickActionsTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.sm,
  },
  quickActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  quickActionContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    minWidth: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  quickActionEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  quickActionLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray800,
  },
  inputContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(236, 72, 153, 0.1)',
  },
  inputBlur: {
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  textInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.gray800,
    maxHeight: 100,
    paddingVertical: SPACING.sm,
    paddingRight: SPACING.sm,
  },
  sendButton: {
    marginLeft: SPACING.sm,
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
  sendButtonGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default AICoachScreen
