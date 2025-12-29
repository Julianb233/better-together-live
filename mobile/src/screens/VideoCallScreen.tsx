import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Dimensions
} from 'react-native'
import {
  LiveKitRoom,
  VideoTrack,
  AudioTrack,
  useTracks,
  useParticipants,
  useRoomContext,
  useLocalParticipant,
  TrackToggle,
  isTrackReference
} from '@livekit/react-native'
import { Track } from 'livekit-client'
import { registerGlobals } from '@livekit/react-native-webrtc'
import { useNavigation, useRoute } from '@react-navigation/native'
import { API_URL } from '../utils/constants'

// Register WebRTC globals
registerGlobals()

const { width, height } = Dimensions.get('window')

interface VideoCallScreenProps {
  roomName?: string
  participantName?: string
  coupleId?: string
}

// Video participant component
const ParticipantView = ({ participant, isLocal }: { participant: any; isLocal: boolean }) => {
  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone])

  const videoTrack = tracks.find(
    (t) => isTrackReference(t) &&
    t.participant.identity === participant.identity &&
    t.source === Track.Source.Camera
  )

  return (
    <View style={[styles.participantContainer, isLocal && styles.localParticipant]}>
      {videoTrack ? (
        <VideoTrack
          trackRef={videoTrack}
          style={styles.video}
          objectFit="cover"
        />
      ) : (
        <View style={styles.noVideo}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>
              {participant.name?.[0]?.toUpperCase() || '?'}
            </Text>
          </View>
          <Text style={styles.participantName}>{participant.name || 'Guest'}</Text>
        </View>
      )}
      {isLocal && (
        <View style={styles.localBadge}>
          <Text style={styles.localBadgeText}>You</Text>
        </View>
      )}
    </View>
  )
}

// Room controls component
const RoomControls = ({ onLeave }: { onLeave: () => void }) => {
  const { localParticipant } = useLocalParticipant()
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)

  const toggleMute = async () => {
    await localParticipant.setMicrophoneEnabled(!isMuted)
    setIsMuted(!isMuted)
  }

  const toggleVideo = async () => {
    await localParticipant.setCameraEnabled(!isVideoOff)
    setIsVideoOff(!isVideoOff)
  }

  return (
    <View style={styles.controls}>
      <TouchableOpacity
        style={[styles.controlButton, isMuted && styles.controlButtonActive]}
        onPress={toggleMute}
      >
        <Text style={styles.controlIcon}>{isMuted ? '🔇' : '🎤'}</Text>
        <Text style={styles.controlLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlButton, isVideoOff && styles.controlButtonActive]}
        onPress={toggleVideo}
      >
        <Text style={styles.controlIcon}>{isVideoOff ? '📷' : '🎥'}</Text>
        <Text style={styles.controlLabel}>{isVideoOff ? 'Start' : 'Stop'}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.controlButton, styles.endCallButton]}
        onPress={onLeave}
      >
        <Text style={styles.controlIcon}>📞</Text>
        <Text style={[styles.controlLabel, styles.endCallLabel]}>End</Text>
      </TouchableOpacity>
    </View>
  )
}

// Active room view
const ActiveRoom = ({ onLeave }: { onLeave: () => void }) => {
  const participants = useParticipants()
  const { localParticipant } = useLocalParticipant()

  const remoteParticipants = participants.filter(
    (p) => p.identity !== localParticipant.identity
  )

  return (
    <View style={styles.roomContainer}>
      {/* Main video (remote participant or placeholder) */}
      <View style={styles.mainVideo}>
        {remoteParticipants.length > 0 ? (
          <ParticipantView
            participant={remoteParticipants[0]}
            isLocal={false}
          />
        ) : (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingEmoji}>💕</Text>
            <Text style={styles.waitingTitle}>Waiting for your partner...</Text>
            <Text style={styles.waitingSubtitle}>
              Share the room link to invite them
            </Text>
          </View>
        )}
      </View>

      {/* Local video (picture-in-picture) */}
      <View style={styles.pipContainer}>
        <ParticipantView participant={localParticipant} isLocal={true} />
      </View>

      {/* Controls */}
      <RoomControls onLeave={onLeave} />
    </View>
  )
}

// Main VideoCallScreen component
export default function VideoCallScreen() {
  const navigation = useNavigation()
  const route = useRoute()

  const params = route.params as VideoCallScreenProps || {}
  const { roomName: paramRoomName, participantName: paramName, coupleId } = params

  const [token, setToken] = useState<string | null>(null)
  const [wsUrl, setWsUrl] = useState<string | null>(null)
  const [roomName, setRoomName] = useState(paramRoomName || `room-${Date.now()}`)
  const [participantName, setParticipantName] = useState(paramName || 'User')
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch token from backend
  const fetchToken = useCallback(async () => {
    try {
      setIsConnecting(true)
      setError(null)

      const response = await fetch(`${API_URL}/api/video/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomName,
          participantName,
          participantId: coupleId ? `${coupleId}-${Date.now()}` : undefined
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get video token')
      }

      const data = await response.json()
      setToken(data.token)
      setWsUrl(data.url)
    } catch (err) {
      console.error('Token fetch error:', err)
      setError('Could not connect to video call. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }, [roomName, participantName, coupleId])

  useEffect(() => {
    fetchToken()
  }, [fetchToken])

  const handleLeave = () => {
    Alert.alert(
      'Leave Call',
      'Are you sure you want to end this video call?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: () => navigation.goBack()
        }
      ]
    )
  }

  const handleDisconnect = () => {
    navigation.goBack()
  }

  if (isConnecting) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator size="large" color="#E91E63" />
        <Text style={styles.loadingText}>Connecting to video call...</Text>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <StatusBar barStyle="light-content" />
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchToken}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  if (!token || !wsUrl) {
    return null
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LiveKitRoom
        serverUrl={wsUrl}
        token={token}
        connect={true}
        options={{
          adaptiveStream: true,
          dynacast: true,
          publishDefaults: {
            simulcast: false
          }
        }}
        onDisconnected={handleDisconnect}
        onError={(err) => {
          console.error('LiveKit error:', err)
          setError('Video call disconnected')
        }}
      >
        <ActiveRoom onLeave={handleLeave} />
      </LiveKitRoom>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e'
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#1a1a2e',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16
  },
  errorText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24
  },
  retryButton: {
    backgroundColor: '#E91E63',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 25,
    marginBottom: 12
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  backButton: {
    paddingHorizontal: 32,
    paddingVertical: 14
  },
  backButtonText: {
    color: '#888',
    fontSize: 16
  },
  roomContainer: {
    flex: 1
  },
  mainVideo: {
    flex: 1,
    backgroundColor: '#0f0f1e'
  },
  participantContainer: {
    flex: 1,
    backgroundColor: '#0f0f1e'
  },
  localParticipant: {
    borderRadius: 12,
    overflow: 'hidden'
  },
  video: {
    flex: 1
  },
  noVideo: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2a2a4a'
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16
  },
  avatarText: {
    fontSize: 48,
    color: '#fff',
    fontWeight: '600'
  },
  participantName: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '500'
  },
  localBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(233, 30, 99, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12
  },
  localBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600'
  },
  waitingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e'
  },
  waitingEmoji: {
    fontSize: 64,
    marginBottom: 16
  },
  waitingTitle: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8
  },
  waitingSubtitle: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center'
  },
  pipContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 120,
    height: 160,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#E91E63',
    backgroundColor: '#0f0f1e'
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  controlButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  controlButtonActive: {
    backgroundColor: 'rgba(233, 30, 99, 0.8)'
  },
  controlIcon: {
    fontSize: 24,
    marginBottom: 4
  },
  controlLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500'
  },
  endCallButton: {
    backgroundColor: '#f44336'
  },
  endCallLabel: {
    color: '#fff'
  }
})
