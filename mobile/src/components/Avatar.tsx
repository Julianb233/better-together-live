// Better Together Mobile: Avatar Component
import React from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { COLORS, GRADIENTS, FONT_SIZES, FONT_WEIGHTS } from '../utils/constants'

interface AvatarProps {
  imageUri?: string
  name: string
  size?: 'small' | 'medium' | 'large'
  showOnlineIndicator?: boolean
  gradient?: keyof typeof GRADIENTS
}

const SIZES = {
  small: 40,
  medium: 64,
  large: 96,
}

const BORDER_WIDTHS = {
  small: 2,
  medium: 3,
  large: 4,
}

const ONLINE_INDICATOR_SIZES = {
  small: 10,
  medium: 14,
  large: 18,
}

export const Avatar = ({
  imageUri,
  name,
  size = 'medium',
  showOnlineIndicator = false,
  gradient = 'primary',
}: AvatarProps) => {
  const avatarSize = SIZES[size]
  const borderWidth = BORDER_WIDTHS[size]
  const innerSize = avatarSize - borderWidth * 2
  const indicatorSize = ONLINE_INDICATOR_SIZES[size]

  // Get initials from name
  const getInitials = (fullName: string): string => {
    const names = fullName.trim().split(' ')
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase()
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
  }

  const initials = getInitials(name)

  return (
    <View
      style={[styles.container, { width: avatarSize, height: avatarSize }]}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={`Avatar for ${name}`}
    >
      {/* Gradient border */}
      <LinearGradient
        colors={GRADIENTS[gradient] as readonly [string, string, ...string[]]}
        style={[
          styles.gradientBorder,
          {
            width: avatarSize,
            height: avatarSize,
            borderRadius: avatarSize / 2,
          },
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Inner content */}
        <View
          style={[
            styles.innerContainer,
            {
              width: innerSize,
              height: innerSize,
              borderRadius: innerSize / 2,
            },
          ]}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.image,
                {
                  width: innerSize,
                  height: innerSize,
                  borderRadius: innerSize / 2,
                },
              ]}
              accessible={false}
            />
          ) : (
            <View
              style={[
                styles.initialsContainer,
                {
                  width: innerSize,
                  height: innerSize,
                  borderRadius: innerSize / 2,
                },
              ]}
            >
              <Text
                style={[
                  styles.initials,
                  {
                    fontSize: size === 'small' ? FONT_SIZES.sm : size === 'medium' ? FONT_SIZES.lg : FONT_SIZES.xl,
                  },
                ]}
              >
                {initials}
              </Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {/* Online indicator */}
      {showOnlineIndicator && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: indicatorSize,
              height: indicatorSize,
              borderRadius: indicatorSize / 2,
              borderWidth: borderWidth,
              right: borderWidth,
              bottom: borderWidth,
            },
          ]}
          accessible={true}
          accessibilityLabel="Online"
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  gradientBorder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  image: {
    resizeMode: 'cover',
  },
  initialsContainer: {
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  onlineIndicator: {
    position: 'absolute',
    backgroundColor: COLORS.success,
    borderColor: COLORS.background,
  },
})

export default Avatar
