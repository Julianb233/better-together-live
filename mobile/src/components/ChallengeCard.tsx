// Better Together Mobile: ChallengeCard Component
import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { GlassCard } from './GlassCard'
import { Button } from './Button'
import {
  COLORS,
  GRADIENTS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  CHALLENGE_CATEGORIES,
  DIFFICULTY_LEVELS,
} from '../utils/constants'

interface Challenge {
  id: string
  name: string
  description: string
  category: string
  progress: number // 0-100
  daysLeft: number
  difficulty: 'easy' | 'medium' | 'hard'
  isStarted?: boolean
}

interface ChallengeCardProps {
  challenge: Challenge
  onPress?: () => void
}

export const ChallengeCard = ({ challenge, onPress }) => {
  const categoryInfo = CHALLENGE_CATEGORIES.find(c => c.value === challenge.category)
  const difficultyInfo = DIFFICULTY_LEVELS.find(d => d.value === challenge.difficulty)

  return (
    <GlassCard variant="light" padding="large" style={styles.card}>
      <View style={styles.header}>
        <View style={styles.badges}>
          <View
            style={[styles.categoryBadge, { backgroundColor: categoryInfo?.color || COLORS.primary }]}
          >
            <Text style={styles.categoryText}>{categoryInfo?.label || 'Challenge'}</Text>
          </View>
          <View
            style={[styles.difficultyBadge, { backgroundColor: difficultyInfo?.color || COLORS.info }]}
          >
            <Text style={styles.difficultyText}>{difficultyInfo?.label || 'Medium'}</Text>
          </View>
        </View>

        {challenge.daysLeft > 0 && (
          <View style={styles.daysLeftContainer}>
            <Text style={styles.daysLeftNumber}>{challenge.daysLeft}</Text>
            <Text style={styles.daysLeftLabel}>days left</Text>
          </View>
        )}
      </View>

      <Text
        style={styles.name}
        accessible={true}
        accessibilityRole="header"
      >
        {challenge.name}
      </Text>

      <Text
        style={styles.description}
        numberOfLines={2}
        accessible={true}
      >
        {challenge.description}
      </Text>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBackground}>
          <LinearGradient
            colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.progressFill, { width: `${challenge.progress}%` }]}
          />
        </View>
        <Text style={styles.progressText}>{Math.round(challenge.progress)}% Complete</Text>
      </View>

      {/* Action Button */}
      {onPress && (
        <View style={styles.actionContainer}>
          <Button
            title={challenge.isStarted ? 'Continue' : 'Start Challenge'}
            onPress={onPress}
            variant="primary"
            size="medium"
          />
        </View>
      )}
    </GlassCard>
  )
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  badges: {
    flexDirection: 'row',
    gap: SPACING.sm,
    flex: 1,
  },
  categoryBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  categoryText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.background,
  },
  difficultyBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  difficultyText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.background,
  },
  daysLeftContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.medium,
  },
  daysLeftNumber: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.primary,
  },
  daysLeftLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  name: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  description: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    lineHeight: FONT_SIZES.md * 1.5,
    marginBottom: SPACING.md,
  },
  progressContainer: {
    marginBottom: SPACING.md,
  },
  progressBackground: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  actionContainer: {
    marginTop: SPACING.sm,
  },
})

export default ChallengeCard
