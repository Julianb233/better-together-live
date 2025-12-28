// Better Together Mobile: WebSocket Client
// Handles real-time messaging with automatic reconnection

import AsyncStorage from '@react-native-async-storage/async-storage'

export type WebSocketStatus = 'connecting' | 'connected' | 'disconnected' | 'error'

export interface WebSocketMessage {
  type: 'message' | 'typing' | 'read' | 'user_online' | 'user_offline' | 'ping' | 'pong'
  conversation_id?: string
  message?: any
  user_id?: string
  timestamp?: string
}

export interface WebSocketConfig {
  url: string
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  onMessage?: (message: WebSocketMessage) => void
  onStatusChange?: (status: WebSocketStatus) => void
  onError?: (error: Error) => void
}

class WebSocketClient {
  private ws: WebSocket | null = null
  private config: WebSocketConfig
  private status: WebSocketStatus = 'disconnected'
  private reconnectAttempts = 0
  private reconnectTimer: NodeJS.Timeout | null = null
  private heartbeatTimer: NodeJS.Timeout | null = null
  private messageQueue: WebSocketMessage[] = []
  private isIntentionallyClosed = false

  constructor(config: WebSocketConfig) {
    this.config = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...config,
    }
  }

  async connect(): Promise<void> {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return
    }

    this.isIntentionallyClosed = false
    this.setStatus('connecting')

    try {
      const userId = await AsyncStorage.getItem('@better_together:user_id')
      const wsUrl = `${this.config.url}${userId ? `?userId=${userId}` : ''}`

      this.ws = new WebSocket(wsUrl)

      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
      this.ws.onerror = this.handleError.bind(this)
      this.ws.onclose = this.handleClose.bind(this)

    } catch (error) {
      console.error('WebSocket connection error:', error)
      this.setStatus('error')
      this.scheduleReconnect()
    }
  }

  disconnect(): void {
    this.isIntentionallyClosed = true
    this.clearReconnectTimer()
    this.clearHeartbeatTimer()

    if (this.ws) {
      this.ws.close()
      this.ws = null
    }

    this.setStatus('disconnected')
  }

  send(message: WebSocketMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify(message))
      } catch (error) {
        console.error('Failed to send WebSocket message:', error)
        this.messageQueue.push(message)
      }
    } else {
      this.messageQueue.push(message)
    }
  }

  sendTyping(conversationId: string, isTyping: boolean): void {
    this.send({
      type: 'typing',
      conversation_id: conversationId,
      timestamp: new Date().toISOString(),
    })
  }

  sendReadReceipt(conversationId: string): void {
    this.send({
      type: 'read',
      conversation_id: conversationId,
      timestamp: new Date().toISOString(),
    })
  }

  getStatus(): WebSocketStatus {
    return this.status
  }

  private handleOpen(): void {
    console.log('WebSocket connected')
    this.reconnectAttempts = 0
    this.setStatus('connected')
    this.startHeartbeat()
    this.flushMessageQueue()
  }

  private handleMessage(event: { data?: string }): void {
    try {
      if (!event.data) return
      const data = JSON.parse(event.data) as WebSocketMessage

      if (data.type === 'pong') {
        return
      }

      if (this.config.onMessage) {
        this.config.onMessage(data)
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error)
    }
  }

  private handleError(event: Event): void {
    console.error('WebSocket error:', event)
    this.setStatus('error')

    if (this.config.onError) {
      this.config.onError(new Error('WebSocket connection error'))
    }
  }

  private handleClose(event: { code?: number; reason?: string }): void {
    console.log('WebSocket closed:', event.code, event.reason)
    this.clearHeartbeatTimer()
    this.setStatus('disconnected')

    if (!this.isIntentionallyClosed) {
      this.scheduleReconnect()
    }
  }

  private setStatus(status: WebSocketStatus): void {
    this.status = status

    if (this.config.onStatusChange) {
      this.config.onStatusChange(status)
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= (this.config.maxReconnectAttempts || 10)) {
      console.error('Max reconnection attempts reached')
      return
    }

    this.clearReconnectTimer()

    const delay = Math.min(
      this.config.reconnectInterval! * Math.pow(2, this.reconnectAttempts),
      30000
    )

    console.log(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`)

    this.reconnectTimer = setTimeout(() => {
      this.reconnectAttempts++
      this.connect()
    }, delay)
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }

  private startHeartbeat(): void {
    this.clearHeartbeatTimer()

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send({ type: 'ping', timestamp: new Date().toISOString() })
      }
    }, this.config.heartbeatInterval)
  }

  private clearHeartbeatTimer(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0 && this.ws?.readyState === WebSocket.OPEN) {
      const message = this.messageQueue.shift()
      if (message) {
        this.send(message)
      }
    }
  }
}

export default WebSocketClient
