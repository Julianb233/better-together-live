// Better Together Mobile: Card Component
import React from 'react'
import { View, StyleSheet, ViewStyle } from 'react-native'
import { COLORS, SPACING, BORDER_RADIUS } from '../utils/constants'

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
  padding?: 'none' | 'small' | 'medium' | 'large'
}

export const Card = ({
  children,
  style,
  padding = 'medium',
}: CardProps) => {
  return (
    <View
      style={[styles.card, styles[padding], style]}
      accessible={false}
      accessibilityRole="none"
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.lg,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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

export default Card
