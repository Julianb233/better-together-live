// Better Together Mobile: Chat-specific TypeScript Types
// Additional types for chat/messaging functionality

export type ChatViewMode = 'conversations' | 'chat'

export interface ChatThread {
  id: string
  title: string
  avatarUrl?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount: number
  isGroup: boolean
  participants: string[]
}

export interface ChatMessage {
  id: string
  threadId: string
  senderId: string
  senderName: string
  senderAvatar?: string
  content: string
  timestamp: string
  isEdited: boolean
  editedAt?: string
  type: 'text' | 'image' | 'activity' | 'post' | 'challenge'
  mediaUrl?: string
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
}

export interface ChatParticipant {
  id: string
  userId: string
  name: string
  avatarUrl?: string
  role: 'owner' | 'admin' | 'member'
  isOnline: boolean
  lastSeen?: string
}

export interface TypingIndicator {
  userId: string
  userName: string
  timestamp: string
}

export interface ChatReaction {
  messageId: string
  userId: string
  emoji: string
  timestamp: string
}

export interface ChatSettings {
  isMuted: boolean
  notificationsEnabled: boolean
  customNickname?: string
  theme?: 'light' | 'dark' | 'auto'
}
