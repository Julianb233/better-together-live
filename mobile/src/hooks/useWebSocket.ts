// Better Together Mobile: WebSocket Hook
// React hook for real-time messaging

import { useEffect, useRef, useState, useCallback } from 'react'
import { AppState, AppStateStatus } from 'react-native'
import WebSocketClient, { WebSocketStatus, WebSocketMessage } from '../utils/websocket'
import { API_URL } from '../utils/constants'

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void
  onTyping?: (conversationId: string, userId: string) => void
  autoConnect?: boolean
}

interface UseWebSocketReturn {
  status: WebSocketStatus
  isConnected: boolean
  connect: () => Promise<void>
  disconnect: () => void
  sendMessage: (conversationId: string, content: string) => void
  sendTyping: (conversationId: string) => void
  sendReadReceipt: (conversationId: string) => void
}

export function useWebSocket(options: UseWebSocketOptions = {}): UseWebSocketReturn {
  const { onMessage, onTyping, autoConnect = true } = options

  const [status, setStatus] = useState<WebSocketStatus>('disconnected')
  const wsClient = useRef<WebSocketClient | null>(null)
  const typingTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map())

  // Initialize WebSocket client
  useEffect(() => {
    const wsUrl = API_URL.replace('https://', 'wss://').replace('http://', 'ws://') + '/ws'

    wsClient.current = new WebSocketClient({
      url: wsUrl,
      onStatusChange: setStatus,
      onMessage: (message) => {
        // Handle typing indicators
        if (message.type === 'typing' && message.conversation_id && message.user_id) {
          if (onTyping) {
            onTyping(message.conversation_id, message.user_id)
          }

          // Clear typing after 3 seconds
          const key = `${message.conversation_id}:${message.user_id}`
          const existingTimeout = typingTimeouts.current.get(key)
          if (existingTimeout) {
            clearTimeout(existingTimeout)
          }
          typingTimeouts.current.set(key, setTimeout(() => {
            typingTimeouts.current.delete(key)
          }, 3000))
        }

        // Forward message to handler
        if (onMessage) {
          onMessage(message)
        }
      },
      onError: (error) => {
        console.error('WebSocket error:', error)
      }
    })

    // Auto-connect if enabled
    if (autoConnect) {
      wsClient.current.connect()
    }

    // Cleanup on unmount
    return () => {
      wsClient.current?.disconnect()
      typingTimeouts.current.forEach(timeout => clearTimeout(timeout))
      typingTimeouts.current.clear()
    }
  }, [])

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        // Reconnect when app comes to foreground
        if (wsClient.current?.getStatus() === 'disconnected') {
          wsClient.current.connect()
        }
      } else if (nextAppState === 'background') {
        // Optionally disconnect in background to save battery
        // wsClient.current?.disconnect()
      }
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)
    return () => subscription?.remove()
  }, [])

  const connect = useCallback(async () => {
    await wsClient.current?.connect()
  }, [])

  const disconnect = useCallback(() => {
    wsClient.current?.disconnect()
  }, [])

  const sendMessage = useCallback((conversationId: string, content: string) => {
    wsClient.current?.send({
      type: 'message',
      conversation_id: conversationId,
      message: { content },
      timestamp: new Date().toISOString()
    })
  }, [])

  const sendTyping = useCallback((conversationId: string) => {
    wsClient.current?.sendTyping(conversationId, true)
  }, [])

  const sendReadReceipt = useCallback((conversationId: string) => {
    wsClient.current?.sendReadReceipt(conversationId)
  }, [])

  return {
    status,
    isConnected: status === 'connected',
    connect,
    disconnect,
    sendMessage,
    sendTyping,
    sendReadReceipt
  }
}

export default useWebSocket
