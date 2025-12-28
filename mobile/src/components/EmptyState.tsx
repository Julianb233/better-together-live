// Better Together Mobile: EmptyState Component
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Button } from './Button'
import { COLORS, GRADIENTS, SPACING, FONT_SIZES, FONT_WEIGHTS } from '../utils/constants'

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
  gradient?: keyof typeof GRADIENTS
}

export const EmptyState = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  gradient = 'warm',
}: EmptyStateProps) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[...GRADIENTS[gradient], 'transparent'] as readonly [string, string, ...string[]]}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text
            style={styles.icon}
            accessible={true}
            accessibilityRole="image"
            accessibilityLabel={`${icon} icon`}
          >
            {icon}
          </Text>
        </View>

        <Text
          style={styles.title}
          accessible={true}
          accessibilityRole="header"
        >
          {title}
        </Text>

        <Text
          style={styles.description}
          accessible={true}
        >
          {description}
        </Text>

        {actionLabel && onAction && (
          <View style={styles.actionContainer}>
            <Button
              title={actionLabel}
              onPress={onAction}
              variant="primary"
              size="medium"
            />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    position: 'relative',
  },
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.1,
  },
  content: {
    alignItems: 'center',
    maxWidth: 320,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  icon: {
    fontSize: 64,
  },
  title: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: FONT_SIZES.md * 1.5,
    marginBottom: SPACING.lg,
  },
  actionContainer: {
    marginTop: SPACING.md,
    width: '100%',
  },
})

export default EmptyState
