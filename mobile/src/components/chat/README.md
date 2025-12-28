# Chat Components

Modular, reusable chat/messaging components for the Better Together mobile app.

## Components

### ChatList
**Purpose**: Displays a list of conversations/chat threads with unread badges and preview text.

**Props**:
- `conversations: Conversation[]` - Array of conversation objects
- `currentUserId: string | null` - ID of the current user
- `onConversationPress: (conversation: Conversation) => void` - Callback when a conversation is tapped
- `onNewConversation: () => void` - Callback for new conversation button
- `isRefreshing?: boolean` - Pull-to-refresh loading state
- `onRefresh?: () => void` - Pull-to-refresh callback

**Features**:
- Gradient header with title and subtitle
- Conversation cards with glassmorphism effect
- Avatar images or fallback initials
- Unread message badges
- Smart timestamp formatting (Today, Yesterday, weekday, date)
- Empty state with call-to-action
- Floating action button (FAB) for new conversation
- Pull-to-refresh support

**Usage**:
```tsx
<ChatList
  conversations={conversations}
  currentUserId={userId}
  onConversationPress={handlePress}
  onNewConversation={handleNew}
  isRefreshing={isRefreshing}
  onRefresh={onRefresh}
/>
```

---

### ChatRoom
**Purpose**: Full chat interface with message history and input field.

**Props**:
- `conversation: Conversation` - Active conversation object
- `messages: Message[]` - Array of messages in the conversation
- `currentUserId: string | null` - ID of the current user
- `messageText: string` - Current input text
- `onMessageTextChange: (text: string) => void` - Input change handler
- `onSendMessage: () => void` - Send button callback
- `onBack: () => void` - Back button callback
- `isSending?: boolean` - Message sending state
- `onAttach?: () => void` - Attachment button callback (optional)

**Features**:
- Header with back button, avatar, and conversation title
- Auto-scrolling message list
- MessageBubble components for each message
- ChatInput component at the bottom
- KeyboardAvoidingView for iOS/Android
- Empty state for new conversations
- Activity status indicator

**Usage**:
```tsx
<ChatRoom
  conversation={activeConversation}
  messages={messages}
  currentUserId={userId}
  messageText={inputText}
  onMessageTextChange={setInputText}
  onSendMessage={handleSend}
  onBack={handleBack}
  isSending={isSending}
  onAttach={handleAttach}
/>
```

---

### MessageBubble
**Purpose**: Individual message display with sender info and timestamp.

**Props**:
- `message: Message` - Message object to display
- `isOwnMessage: boolean` - Whether the message is from the current user

**Features**:
- Different styling for own vs. other messages
- Sender avatar (for other's messages only)
- Text and image message types
- Smart timestamp formatting
- Edit indicator "(edited)"
- Rounded bubble design with tail
- Color-coded (primary color for own, gray for others)

**Usage**:
```tsx
<MessageBubble
  message={message}
  isOwnMessage={message.sender_id === currentUserId}
/>
```

---

### ChatInput
**Purpose**: Message input field with send button and optional attachment button.

**Props**:
- `value: string` - Current input value
- `onChangeText: (text: string) => void` - Text change handler
- `onSend: () => void` - Send button callback
- `onAttach?: () => void` - Attachment button callback (optional)
- `isSending?: boolean` - Sending state (shows spinner)
- `placeholder?: string` - Input placeholder text
- `maxLength?: number` - Max character limit (default: 1000)

**Features**:
- Multiline text input with auto-grow (max 100px)
- Send button with disabled state
- Loading spinner while sending
- Optional attachment button
- Rounded, elevated design
- iOS/Android keyboard handling

**Usage**:
```tsx
<ChatInput
  value={messageText}
  onChangeText={setMessageText}
  onSend={handleSend}
  onAttach={handleAttach}
  isSending={isSending}
  placeholder="Type a message..."
  maxLength={1000}
/>
```

---

## Design System Integration

All components use the app's design system from `utils/constants.ts`:
- **Colors**: `COLORS.primary`, `COLORS.gray100`, etc.
- **Spacing**: `SPACING.sm`, `SPACING.md`, `SPACING.lg`, etc.
- **Typography**: `FONT_SIZES.md`, `FONT_WEIGHTS.bold`, etc.
- **Border Radius**: `BORDER_RADIUS.small`, `BORDER_RADIUS.large`, etc.
- **Shadows**: `SHADOWS.soft`, `SHADOWS.heavy`
- **Glassmorphism**: `GLASSMORPHISM.light`, `GLASSMORPHISM.medium`
- **Gradients**: `GRADIENTS.primary`, `GRADIENTS.pink`, etc.

---

## TypeScript Types

Uses types from `types/index.ts` and `types/chat.ts`:
- `Conversation` - Chat conversation/thread
- `Message` - Individual chat message
- `User` - User profile information
- `ConversationParticipant` - Participant in a conversation
- `ChatViewMode` - 'conversations' | 'chat'
- `ChatMessage` - Extended message type with status
- `ChatThread` - Simplified thread representation

---

## State Management

Components are **controlled** - they don't manage their own state. Parent components handle:
- Fetching conversations and messages
- Sending messages
- Navigation between views
- Loading and error states

This keeps components reusable and testable.

---

## Backend Integration

Components expect these API client methods:
- `apiClient.getConversations()` - Fetch conversation list
- `apiClient.getMessages(conversationId, limit)` - Fetch messages
- `apiClient.sendMessage(conversationId, content, type)` - Send message
- `apiClient.markMessagesRead(conversationId)` - Mark as read
- `apiClient.getUserId()` - Get current user ID

See `api/client.ts` for implementation.

---

## Performance Optimizations

- **FlatList virtualization** - Only renders visible items
- **useCallback hooks** - Prevents unnecessary re-renders
- **Auto-scroll throttling** - 100ms delay for smooth UX
- **Image caching** - Native image cache for avatars
- **Memoized components** - Consider wrapping with React.memo if needed

---

## Accessibility

- TouchableOpacity with `activeOpacity={0.7}` for visual feedback
- Semantic text sizes from design system
- High contrast colors for readability
- Clear visual hierarchy

---

## Future Enhancements

Potential additions:
- [ ] Typing indicators
- [ ] Message reactions (emoji)
- [ ] Voice messages
- [ ] Video messages
- [ ] Location sharing
- [ ] Message forwarding
- [ ] Search in conversation
- [ ] Message deletion
- [ ] Message editing UI
- [ ] Read receipts
- [ ] Online status indicators
- [ ] Push notification handling
- [ ] Rich text formatting
- [ ] Link previews
- [ ] File attachments

---

## Example: Complete Implementation

```tsx
import React, { useState, useCallback, useEffect } from 'react'
import { SafeAreaView, Alert } from 'react-native'
import { ChatList, ChatRoom } from '@/components/chat'
import apiClient from '@/api/client'
import type { Conversation, Message } from '@/types'

const MessagingScreen = () => {
  const [viewMode, setViewMode] = useState<'conversations' | 'chat'>('conversations')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageText, setMessageText] = useState('')
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    const userId = await apiClient.getUserId()
    setCurrentUserId(userId)

    const response = await apiClient.getConversations()
    setConversations(response.data?.conversations || [])
  }

  const handleConversationPress = async (conversation: Conversation) => {
    setActiveConversation(conversation)
    setViewMode('chat')

    const response = await apiClient.getMessages(conversation.id, 50)
    setMessages(response.data?.messages.reverse() || [])
  }

  const handleSendMessage = async () => {
    if (!messageText.trim() || !activeConversation) return

    const response = await apiClient.sendMessage(
      activeConversation.id,
      messageText.trim(),
      'text'
    )

    if (response.data?.message) {
      setMessages(prev => [...prev, response.data!.message])
      setMessageText('')
    }
  }

  const handleBack = () => {
    setViewMode('conversations')
    setActiveConversation(null)
    setMessages([])
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {viewMode === 'conversations' ? (
        <ChatList
          conversations={conversations}
          currentUserId={currentUserId}
          onConversationPress={handleConversationPress}
          onNewConversation={() => Alert.alert('Coming soon!')}
        />
      ) : activeConversation ? (
        <ChatRoom
          conversation={activeConversation}
          messages={messages}
          currentUserId={currentUserId}
          messageText={messageText}
          onMessageTextChange={setMessageText}
          onSendMessage={handleSendMessage}
          onBack={handleBack}
        />
      ) : null}
    </SafeAreaView>
  )
}

export default MessagingScreen
```

---

## Testing

Recommended test cases:
- Rendering with empty conversations
- Rendering with messages
- Sending a message
- Conversation selection
- Back navigation
- Pull-to-refresh
- Timestamp formatting
- Avatar fallbacks
- Disabled send button
- Loading states

---

## File Structure

```
mobile/src/components/chat/
├── ChatList.tsx         # Conversation list view
├── ChatRoom.tsx         # Full chat interface
├── MessageBubble.tsx    # Individual message
├── ChatInput.tsx        # Message input field
├── index.ts            # Barrel exports
└── README.md           # This file
```
