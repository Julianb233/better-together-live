// Better Together Mobile: GradientHeader Component
import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { COLORS, GRADIENTS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../utils/constants'

interface GradientHeaderProps {
  title: string
  subtitle?: string
  leftIcon?: string
  onBackPress?: () => void
  rightAction?: React.ReactNode
  gradient?: keyof typeof GRADIENTS
}

export const GradientHeader: React.FC<GradientHeaderProps> = ({
  title,
  subtitle,
  leftIcon = '←',
  onBackPress,
  rightAction,
  gradient = 'primary',
}) => {
  const insets = useSafeAreaInsets()

  return (
    <LinearGradient
      colors={GRADIENTS[gradient] as readonly [string, string, ...string[]]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.container, { paddingTop: insets.top + SPACING.md }]}
    >
      <View style={styles.content}>
        <View style={styles.leftSection}>
          {onBackPress && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={onBackPress}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              accessibilityHint="Navigate to the previous screen"
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backIcon}>{leftIcon}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.centerSection}>
          <Text
            style={styles.title}
            numberOfLines={1}
            accessible={true}
            accessibilityRole="header"
            accessibilityLabel={title}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={styles.subtitle}
              numberOfLines={1}
              accessible={true}
              accessibilityLabel={subtitle}
            >
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightSection}>{rightAction}</View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: SPACING.md,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
  },
  leftSection: {
    width: 40,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
  },
  rightSection: {
    width: 40,
    alignItems: 'flex-end',
  },
  backButton: {
    padding: SPACING.sm,
    marginLeft: -SPACING.sm,
  },
  backIcon: {
    fontSize: 24,
    color: COLORS.background,
    fontWeight: FONT_WEIGHTS.bold,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.background,
    textAlign: 'center',
    ...Platform.select({
      ios: {
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 0, height: 1 },
        textShadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  subtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 2,
  },
})

export default GradientHeader
