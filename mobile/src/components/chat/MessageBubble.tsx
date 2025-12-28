// Better Together Mobile: Message Bubble Component
// Individual chat message display with avatar and timestamp
import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
} from '../../utils/constants'
import type { Message } from '../../types'

interface MessageBubbleProps {
  message: Message
  isOwnMessage: boolean
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
}) => {
  const sender = message.sender

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

const styles = StyleSheet.create({
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
})
