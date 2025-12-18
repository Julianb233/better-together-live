// Better Together Mobile: AI Coach Screen
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const AICoachScreen: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm your AI relationship coach. How can I help strengthen your relationship today?",
      timestamp: new Date(),
    },
  ])
  const [inputText, setInputText] = useState('')

  const suggestedTopics = [
    'Communication tips',
    'Date night ideas',
    'Resolving conflicts',
    'Building trust',
    'Love languages',
  ]

  const handleSend = () => {
    if (!inputText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText,
      timestamp: new Date(),
    }

    setMessages([...messages, userMessage])
    setInputText('')

    // TODO: Integrate with AI API
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I understand you're asking about that. Let me help you with personalized advice based on your relationship journey.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const handleSuggestedTopic = (topic: string) => {
    setInputText(topic)
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Relationship Coach</Text>
        <Text style={styles.headerSubtitle}>
          Get personalized advice and insights
        </Text>
      </View>

      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageBubble,
              message.role === 'user'
                ? styles.userMessage
                : styles.assistantMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.role === 'user'
                  ? styles.userMessageText
                  : styles.assistantMessageText,
              ]}
            >
              {message.content}
            </Text>
          </View>
        ))}

        {messages.length === 1 && (
          <View style={styles.suggestedTopicsContainer}>
            <Text style={styles.suggestedTopicsTitle}>
              Suggested topics:
            </Text>
            {suggestedTopics.map((topic, index) => (
              <TouchableOpacity
                key={index}
                style={styles.topicButton}
                onPress={() => handleSuggestedTopic(topic)}
              >
                <Text style={styles.topicButtonText}>{topic}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <Input
          value={inputText}
          onChangeText={setInputText}
          placeholder="Ask me anything..."
          multiline
          style={styles.input}
          containerStyle={styles.inputWrapper}
        />
        <Button
          title="Send"
          onPress={handleSend}
          size="small"
          style={styles.sendButton}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.primary,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.background,
    marginTop: SPACING.xs,
    opacity: 0.9,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: SPACING.md,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: SPACING.md,
    borderRadius: SPACING.md,
    marginBottom: SPACING.md,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: COLORS.primary,
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.surface,
  },
  messageText: {
    fontSize: FONT_SIZES.md,
    lineHeight: 22,
  },
  userMessageText: {
    color: COLORS.background,
  },
  assistantMessageText: {
    color: COLORS.text,
  },
  suggestedTopicsContainer: {
    marginTop: SPACING.lg,
  },
  suggestedTopicsTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  topicButton: {
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topicButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.primary,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    alignItems: 'flex-end',
  },
  inputWrapper: {
    flex: 1,
    marginBottom: 0,
    marginRight: SPACING.sm,
  },
  input: {
    maxHeight: 100,
  },
  sendButton: {
    marginBottom: SPACING.md,
  },
})

export default AICoachScreen
