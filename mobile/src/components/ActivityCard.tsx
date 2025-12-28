// Better Together Mobile: ActivityCard Component
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GlassCard } from './GlassCard'
import {
  COLORS,
  GRADIENTS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  ACTIVITY_STATUS,
  ACTIVITY_TYPES,
} from '../utils/constants'

interface Activity {
  id: string
  name: string
  type: string
  date: string
  location?: string
  status: 'planned' | 'completed' | 'cancelled'
}

interface ActivityCardProps {
  activity: Activity
  onPress?: () => void
}

export const ActivityCard = ({ activity, onPress }: ActivityCardProps) => {
  const scaleAnim = React.useRef(new Animated.Value(1)).current

  const activityType = ACTIVITY_TYPES.find(t => t.value === activity.type)
  const statusInfo = ACTIVITY_STATUS.find(s => s.value === activity.status)

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      damping: 15,
      stiffness: 150,
    }).start()
  }

  const CardContent = (
    <View style={styles.content}>
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
          style={styles.iconGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.icon}>{activityType?.icon || '✨'}</Text>
        </LinearGradient>
      </View>

      <View style={styles.details}>
        <View style={styles.header}>
          <Text style={styles.name} numberOfLines={1}>
            {activity.name}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusInfo?.color || COLORS.gray200 }]}>
            <Text style={styles.statusText}>{statusInfo?.label || 'Unknown'}</Text>
          </View>
        </View>

        <Text style={styles.date}>📅 {activity.date}</Text>

        {activity.location && (
          <Text style={styles.location} numberOfLines={1}>
            📍 {activity.location}
          </Text>
        )}
      </View>
    </View>
  )

  if (onPress) {
    return (
      <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
        <TouchableOpacity
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
          accessible={true}
          accessibilityRole="button"
          accessibilityLabel={`${activity.name}, ${activity.status}`}
          accessibilityHint={`View details for ${activity.name}`}
        >
          <GlassCard variant="light" padding="medium">
            {CardContent}
          </GlassCard>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <GlassCard variant="light" padding="medium">
      {CardContent}
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: SPACING.md,
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.medium,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
  },
  details: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  name: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.small,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.background,
  },
  date: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  location: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
})

export default ActivityCard
