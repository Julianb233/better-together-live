import { Hono } from 'hono'
import { AccessToken, RoomServiceClient } from 'livekit-server-sdk'
import type { Env } from '../types'

const video = new Hono<{ Bindings: Env }>()

// LiveKit configuration helper
const getLiveKitConfig = (env: Env) => ({
  url: env.LIVEKIT_URL || 'wss://better-togther-app-ior6zkzv.livekit.cloud',
  apiKey: env.LIVEKIT_API_KEY || '',
  apiSecret: env.LIVEKIT_API_SECRET || ''
})

// Generate access token for a user to join a room
video.post('/token', async (c) => {
  try {
    const { roomName, participantName, participantId } = await c.req.json()

    if (!roomName || !participantName) {
      return c.json({ error: 'roomName and participantName are required' }, 400)
    }

    const config = getLiveKitConfig(c.env as Env)

    if (!config.apiKey || !config.apiSecret) {
      return c.json({ error: 'LiveKit not configured' }, 500)
    }

    // Create access token
    const at = new AccessToken(config.apiKey, config.apiSecret, {
      identity: participantId || participantName,
      name: participantName,
      ttl: '2h' // Token valid for 2 hours
    })

    // Grant permissions
    at.addGrant({
      room: roomName,
      roomJoin: true,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true
    })

    const token = await at.toJwt()

    return c.json({
      token,
      url: config.url,
      roomName,
      participantName
    })
  } catch (error) {
    console.error('Token generation error:', error)
    return c.json({ error: 'Failed to generate token' }, 500)
  }
})

// Create a new room (for scheduled video dates)
video.post('/rooms', async (c) => {
  try {
    const { roomName, metadata, maxParticipants = 2 } = await c.req.json()

    if (!roomName) {
      return c.json({ error: 'roomName is required' }, 400)
    }

    const config = getLiveKitConfig(c.env as Env)

    if (!config.apiKey || !config.apiSecret) {
      return c.json({ error: 'LiveKit not configured' }, 500)
    }

    const roomService = new RoomServiceClient(
      config.url.replace('wss://', 'https://'),
      config.apiKey,
      config.apiSecret
    )

    const room = await roomService.createRoom({
      name: roomName,
      emptyTimeout: 600, // 10 minutes
      maxParticipants,
      metadata: metadata ? JSON.stringify(metadata) : undefined
    })

    return c.json({
      room: {
        name: room.name,
        sid: room.sid,
        maxParticipants: room.maxParticipants,
        createdAt: room.creationTime
      }
    })
  } catch (error) {
    console.error('Room creation error:', error)
    return c.json({ error: 'Failed to create room' }, 500)
  }
})

// List active rooms
video.get('/rooms', async (c) => {
  try {
    const config = getLiveKitConfig(c.env as Env)

    if (!config.apiKey || !config.apiSecret) {
      return c.json({ error: 'LiveKit not configured' }, 500)
    }

    const roomService = new RoomServiceClient(
      config.url.replace('wss://', 'https://'),
      config.apiKey,
      config.apiSecret
    )

    const rooms = await roomService.listRooms()

    return c.json({
      rooms: rooms.map(room => ({
        name: room.name,
        sid: room.sid,
        numParticipants: room.numParticipants,
        maxParticipants: room.maxParticipants,
        createdAt: room.creationTime
      }))
    })
  } catch (error) {
    console.error('List rooms error:', error)
    return c.json({ error: 'Failed to list rooms' }, 500)
  }
})

// Get room details
video.get('/rooms/:roomName', async (c) => {
  try {
    const roomName = c.req.param('roomName')
    const config = getLiveKitConfig(c.env as Env)

    if (!config.apiKey || !config.apiSecret) {
      return c.json({ error: 'LiveKit not configured' }, 500)
    }

    const roomService = new RoomServiceClient(
      config.url.replace('wss://', 'https://'),
      config.apiKey,
      config.apiSecret
    )

    const participants = await roomService.listParticipants(roomName)

    return c.json({
      roomName,
      participants: participants.map(p => ({
        identity: p.identity,
        name: p.name,
        state: p.state,
        joinedAt: p.joinedAt
      }))
    })
  } catch (error) {
    console.error('Room details error:', error)
    return c.json({ error: 'Failed to get room details' }, 500)
  }
})

// Delete/close a room
video.delete('/rooms/:roomName', async (c) => {
  try {
    const roomName = c.req.param('roomName')
    const config = getLiveKitConfig(c.env as Env)

    if (!config.apiKey || !config.apiSecret) {
      return c.json({ error: 'LiveKit not configured' }, 500)
    }

    const roomService = new RoomServiceClient(
      config.url.replace('wss://', 'https://'),
      config.apiKey,
      config.apiSecret
    )

    await roomService.deleteRoom(roomName)

    return c.json({ success: true, message: `Room ${roomName} deleted` })
  } catch (error) {
    console.error('Delete room error:', error)
    return c.json({ error: 'Failed to delete room' }, 500)
  }
})

// Create a video date room for a couple
video.post('/date-room', async (c) => {
  try {
    const { coupleId, user1Name, user2Name, scheduledTime } = await c.req.json()

    if (!coupleId) {
      return c.json({ error: 'coupleId is required' }, 400)
    }

    const config = getLiveKitConfig(c.env as Env)

    if (!config.apiKey || !config.apiSecret) {
      return c.json({ error: 'LiveKit not configured' }, 500)
    }

    // Create unique room name for the couple
    const roomName = `date-${coupleId}-${Date.now()}`

    const roomService = new RoomServiceClient(
      config.url.replace('wss://', 'https://'),
      config.apiKey,
      config.apiSecret
    )

    const room = await roomService.createRoom({
      name: roomName,
      emptyTimeout: 1800, // 30 minutes after empty
      maxParticipants: 2,
      metadata: JSON.stringify({
        type: 'date',
        coupleId,
        user1Name,
        user2Name,
        scheduledTime,
        createdAt: new Date().toISOString()
      })
    })

    // Generate tokens for both participants
    const generateToken = async (name: string, identity: string) => {
      const at = new AccessToken(config.apiKey, config.apiSecret, {
        identity,
        name,
        ttl: '3h'
      })
      at.addGrant({
        room: roomName,
        roomJoin: true,
        canPublish: true,
        canSubscribe: true,
        canPublishData: true
      })
      return at.toJwt()
    }

    const [token1, token2] = await Promise.all([
      user1Name ? generateToken(user1Name, `user1-${coupleId}`) : null,
      user2Name ? generateToken(user2Name, `user2-${coupleId}`) : null
    ])

    return c.json({
      room: {
        name: room.name,
        sid: room.sid,
        url: config.url
      },
      tokens: {
        user1: token1,
        user2: token2
      }
    })
  } catch (error) {
    console.error('Date room creation error:', error)
    return c.json({ error: 'Failed to create date room' }, 500)
  }
})

export default video
