// Better Together Mobile: GlassCard Component
import React from 'react'
import { View, StyleSheet, ViewStyle, Platform } from 'react-native'
import { BlurView } from 'expo-blur'
import { GLASSMORPHISM, SHADOWS, SPACING } from '../utils/constants'

interface GlassCardProps {
  children: React.ReactNode
  variant?: 'light' | 'medium' | 'dark' | 'pink'
  style?: ViewStyle
  intensity?: number
  padding?: 'none' | 'small' | 'medium' | 'large'
}

export const GlassCard = ({
  children,
  variant = 'light',
  style,
  intensity = 80,
  padding = 'medium',
}: GlassCardProps) => {
  const glassStyle = GLASSMORPHISM[variant]

  // For Android or when BlurView isn't available, use a fallback with opacity
  const FallbackCard = () => (
    <View
      style={[
        styles.container,
        glassStyle,
        SHADOWS.card,
        styles[padding],
        style,
      ]}
      accessible={false}
      accessibilityRole="none"
    >
      {children}
    </View>
  )

  // iOS BlurView implementation
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={intensity}
        tint={variant === 'dark' ? 'dark' : 'light'}
        style={[
          styles.container,
          {
            borderRadius: glassStyle.borderRadius,
            borderWidth: glassStyle.borderWidth,
            borderColor: glassStyle.borderColor,
            overflow: 'hidden',
          },
          SHADOWS.card,
          styles[padding],
          style,
        ]}
      >
        {children}
      </BlurView>
    )
  }

  return <FallbackCard />
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  none: {
    padding: 0,
  },
  small: {
    padding: SPACING.sm,
  },
  medium: {
    padding: SPACING.md,
  },
  large: {
    padding: SPACING.lg,
  },
})

export default GlassCard
