import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  ViewStyle
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

interface VideoCallButtonProps {
  roomName?: string
  participantName: string
  coupleId?: string
  variant?: 'primary' | 'secondary' | 'icon'
  size?: 'small' | 'medium' | 'large'
  label?: string
  style?: ViewStyle
}

export default function VideoCallButton({
  roomName,
  participantName,
  coupleId,
  variant = 'primary',
  size = 'medium',
  label = 'Start Video Call',
  style
}: VideoCallButtonProps) {
  const navigation = useNavigation<any>()

  const handlePress = () => {
    // Generate room name if not provided
    const room = roomName || `date-${coupleId || Date.now()}`

    navigation.navigate('VideoCall', {
      roomName: room,
      participantName,
      coupleId
    })
  }

  if (variant === 'icon') {
    return (
      <TouchableOpacity
        style={[styles.iconButton, styles[`${size}Icon`], style]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <Text style={styles.iconEmoji}>📹</Text>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      style={[
        styles.button,
        styles[variant],
        styles[size],
        style
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>📹</Text>
        <Text style={[styles.label, variant === 'secondary' && styles.secondaryLabel]}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  )
}

// Floating video call button for screens
export function FloatingVideoButton({
  roomName,
  participantName,
  coupleId
}: Omit<VideoCallButtonProps, 'variant' | 'size' | 'label' | 'style'>) {
  const navigation = useNavigation<any>()

  const handlePress = () => {
    const room = roomName || `date-${coupleId || Date.now()}`
    navigation.navigate('VideoCall', {
      roomName: room,
      participantName,
      coupleId
    })
  }

  return (
    <TouchableOpacity
      style={styles.floatingButton}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text style={styles.floatingIcon}>📹</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  },
  primary: {
    backgroundColor: '#E91E63'
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#E91E63'
  },
  small: {
    paddingVertical: 8,
    paddingHorizontal: 16
  },
  medium: {
    paddingVertical: 14,
    paddingHorizontal: 24
  },
  large: {
    paddingVertical: 18,
    paddingHorizontal: 32
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  icon: {
    fontSize: 18
  },
  label: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  secondaryLabel: {
    color: '#E91E63'
  },
  iconButton: {
    backgroundColor: '#E91E63',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  smallIcon: {
    width: 36,
    height: 36
  },
  mediumIcon: {
    width: 48,
    height: 48
  },
  largeIcon: {
    width: 60,
    height: 60
  },
  iconEmoji: {
    fontSize: 20
  },
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E91E63',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8
  },
  floatingIcon: {
    fontSize: 26
  }
})
