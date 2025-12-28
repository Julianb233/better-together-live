// Better Together Mobile: Challenges Screen
import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  RefreshControl,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import apiClient from '../api/client'
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
  GLASSMORPHISM,
  GRADIENTS,
  CHALLENGE_CATEGORIES,
  DIFFICULTY_LEVELS,
} from '../utils/constants'

interface Challenge {
  id: string
  title: string
  description: string
  category: string
  difficulty: 'easy' | 'medium' | 'hard'
  duration_days: number
  is_active?: boolean
}

interface ChallengeParticipation {
  id: string
  challenge_id: string
  relationship_id: string
  started_at: string
  completed_at?: string
  progress: number
  challenge?: Challenge
}

interface Relationship {
  id: string
  user1_id: string
  user2_id: string
}

const ChallengesScreen: React.FC = () => {
  const [userId, setUserId] = useState<string | null>(null)
  const [relationship, setRelationship] = useState<Relationship | null>(null)
  const [allChallenges, setAllChallenges] = useState<Challenge[]>([])
  const [participations, setParticipations] = useState<ChallengeParticipation[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [chevronRotation] = useState(new Animated.Value(0))

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)

      // Get user ID
      const id = await apiClient.getUserId()
      if (!id) {
        console.error('No user ID found')
        setLoading(false)
        return
      }
      setUserId(id)

      // Get relationship
      const relationshipResponse = await apiClient.getRelationship(id)
      if (relationshipResponse.data?.relationship) {
        setRelationship(relationshipResponse.data.relationship)
      }

      // Get all challenges
      const challengesResponse = await apiClient.getChallenges()
      if (challengesResponse.data) {
        setAllChallenges(challengesResponse.data as Challenge[])
      }

      // Get participations
      if (relationshipResponse.data?.relationship) {
        const participationResponse = await apiClient.getChallengeParticipation(
          relationshipResponse.data.relationship.id
        )
        if (participationResponse.data) {
          setParticipations(participationResponse.data as ChallengeParticipation[])
        }
      }
    } catch (error) {
      console.error('Error loading challenges:', error)
    } finally {
      setLoading(false)
    }
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await loadData()
    setRefreshing(false)
  }, [])

  const startChallenge = async (challengeId: string) => {
    if (!relationship) {
      console.error('No relationship found')
      return
    }

    try {
      const response = await apiClient.startChallenge(challengeId, {
        relationship_id: relationship.id,
      })
      if (response.data) {
        // Refresh data to show new participation
        await loadData()
      }
    } catch (error) {
      console.error('Error starting challenge:', error)
    }
  }

  const toggleCompletedSection = () => {
    setShowCompleted(!showCompleted)
    Animated.timing(chevronRotation, {
      toValue: showCompleted ? 0 : 1,
      duration: 200,
      useNativeDriver: true,
    }).start()
  }

  const chevronRotate = chevronRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  })

  // Filter active and completed participations
  const activeParticipations = participations.filter(p => !p.completed_at)
  const completedParticipations = participations.filter(p => p.completed_at)

  // Get available challenges (not already started)
  const participationChallengeIds = participations.map(p => p.challenge_id)
  const availableChallenges = allChallenges.filter(
    c => !participationChallengeIds.includes(c.id)
  )

  // Filter by category
  const filteredChallenges =
    selectedCategory === 'all'
      ? availableChallenges
      : availableChallenges.filter(c => c.category === selectedCategory)

  const getDaysRemaining = (startedAt: string, durationDays: number): number => {
    const started = new Date(startedAt)
    const now = new Date()
    const daysPassed = Math.floor((now.getTime() - started.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, durationDays - daysPassed)
  }

  const getDifficultyColor = (difficulty: string): string => {
    const level = DIFFICULTY_LEVELS.find(d => d.value === difficulty)
    return level?.color || COLORS.gray200
  }

  const getCategoryColor = (category: string): string => {
    const cat = CHALLENGE_CATEGORIES.find(c => c.value === category)
    return cat?.color || COLORS.primary
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading challenges...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Gradient Header */}
        <LinearGradient
          colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradientHeader}
        >
          <Text style={styles.headerTitle}>Challenges</Text>
          <Text style={styles.headerSubtitle}>Grow Together</Text>
        </LinearGradient>

        {/* Active Challenges Section */}
        {activeParticipations.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            {activeParticipations.map(participation => {
              const challenge = allChallenges.find(c => c.id === participation.challenge_id)
              if (!challenge) return null

              const daysRemaining = getDaysRemaining(
                participation.started_at,
                challenge.duration_days
              )

              return (
                <View key={participation.id} style={styles.activeCard}>
                  <View style={styles.activeCardHeader}>
                    <Text style={styles.activeCardTitle}>{challenge.title}</Text>
                    <View
                      style={[
                        styles.daysRemainingBadge,
                        { backgroundColor: daysRemaining > 3 ? COLORS.success : COLORS.warning },
                      ]}
                    >
                      <Text style={styles.daysRemainingText}>{daysRemaining}d left</Text>
                    </View>
                  </View>
                  <Text style={styles.activeCardDescription}>{challenge.description}</Text>

                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarBackground}>
                      <View
                        style={[
                          styles.progressBarFill,
                          { width: `${participation.progress}%` },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>{participation.progress}%</Text>
                  </View>
                </View>
              )
            })}
          </View>
        )}

        {/* Discover Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discover New Challenges</Text>

          {/* Category Filter Chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
          >
            <TouchableOpacity
              style={[
                styles.categoryChip,
                selectedCategory === 'all' && styles.categoryChipActive,
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  selectedCategory === 'all' && styles.categoryChipTextActive,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            {CHALLENGE_CATEGORIES.map(category => (
              <TouchableOpacity
                key={category.value}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.value && styles.categoryChipActive,
                  selectedCategory === category.value && {
                    backgroundColor: category.color,
                  },
                ]}
                onPress={() => setSelectedCategory(category.value)}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selectedCategory === category.value && styles.categoryChipTextActive,
                  ]}
                >
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Challenge Cards Grid */}
          {filteredChallenges.length > 0 ? (
            <View style={styles.challengesGrid}>
              {filteredChallenges.map((challenge, index) => (
                <View
                  key={challenge.id}
                  style={[
                    styles.challengeCard,
                    index % 2 === 0 ? styles.challengeCardLeft : styles.challengeCardRight,
                  ]}
                >
                  <View
                    style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(challenge.difficulty) },
                    ]}
                  >
                    <Text style={styles.difficultyText}>
                      {DIFFICULTY_LEVELS.find(d => d.value === challenge.difficulty)?.label}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.categoryIndicator,
                      { backgroundColor: getCategoryColor(challenge.category) },
                    ]}
                  />
                  <Text style={styles.challengeCardTitle}>{challenge.title}</Text>
                  <Text style={styles.challengeCardDescription} numberOfLines={3}>
                    {challenge.description}
                  </Text>
                  <View style={styles.challengeCardFooter}>
                    <Text style={styles.durationText}>📅 {challenge.duration_days} days</Text>
                    <TouchableOpacity
                      style={styles.startButton}
                      onPress={() => startChallenge(challenge.id)}
                    >
                      <Text style={styles.startButtonText}>Start</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>🏆</Text>
              <Text style={styles.emptyStateTitle}>No Challenges Available</Text>
              <Text style={styles.emptyStateText}>
                {selectedCategory === 'all'
                  ? "You've started all available challenges!"
                  : `No challenges in the ${
                      CHALLENGE_CATEGORIES.find(c => c.value === selectedCategory)?.label
                    } category`}
              </Text>
            </View>
          )}
        </View>

        {/* Completed Challenges Section */}
        {completedParticipations.length > 0 && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.completedHeader}
              onPress={toggleCompletedSection}
              activeOpacity={0.7}
            >
              <Text style={styles.sectionTitle}>
                Completed Challenges ({completedParticipations.length})
              </Text>
              <Animated.Text
                style={[styles.chevron, { transform: [{ rotate: chevronRotate }] }]}
              >
                ▼
              </Animated.Text>
            </TouchableOpacity>

            {showCompleted && (
              <View style={styles.completedList}>
                {completedParticipations.map(participation => {
                  const challenge = allChallenges.find(c => c.id === participation.challenge_id)
                  if (!challenge) return null

                  return (
                    <View key={participation.id} style={styles.completedCard}>
                      <Text style={styles.completedEmoji}>✅</Text>
                      <View style={styles.completedCardContent}>
                        <Text style={styles.completedCardTitle}>{challenge.title}</Text>
                        <Text style={styles.completedCardDate}>
                          Completed on{' '}
                          {new Date(participation.completed_at!).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  )
                })}
              </View>
            )}
          </View>
        )}

        {/* Empty State - No Participations */}
        {activeParticipations.length === 0 &&
          completedParticipations.length === 0 &&
          availableChallenges.length > 0 && (
            <View style={styles.welcomeEmptyState}>
              <Text style={styles.emptyStateEmoji}>🎯</Text>
              <Text style={styles.emptyStateTitle}>Ready to Grow?</Text>
              <Text style={styles.emptyStateText}>
                Start your first challenge and strengthen your relationship together!
              </Text>
            </View>
          )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  scrollContent: {
    paddingBottom: SPACING.xxl,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  gradientHeader: {
    padding: SPACING.xl,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.medium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  section: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  activeCard: {
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  activeCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.sm,
  },
  activeCardTitle: {
    flex: 1,
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginRight: SPACING.sm,
  },
  daysRemainingBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  daysRemainingText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  activeCardDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
    lineHeight: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  progressBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.full,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.primary,
    minWidth: 40,
    textAlign: 'right',
  },
  categoriesContainer: {
    marginBottom: SPACING.md,
  },
  categoryChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.gray100,
    marginRight: SPACING.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
  },
  categoryChipText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  challengesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -SPACING.xs,
  },
  challengeCard: {
    width: '50%',
    padding: SPACING.xs,
  },
  challengeCardLeft: {
    paddingRight: SPACING.xs / 2,
  },
  challengeCardRight: {
    paddingLeft: SPACING.xs / 2,
  },
  difficultyBadge: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
    zIndex: 1,
  },
  difficultyText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
  },
  categoryIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
    position: 'absolute',
    left: 0,
    top: SPACING.md,
  },
  challengeCardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    paddingLeft: SPACING.sm,
    paddingRight: SPACING.lg,
    paddingTop: SPACING.xs,
  },
  challengeCardDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    paddingLeft: SPACING.sm,
    lineHeight: 18,
  },
  challengeCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: SPACING.sm,
    paddingTop: SPACING.xs,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
  durationText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.small,
  },
  startButtonText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  welcomeEmptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  emptyStateTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  emptyStateText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  chevron: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  completedList: {
    gap: SPACING.sm,
  },
  completedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: BORDER_RADIUS.medium,
    padding: SPACING.md,
    gap: SPACING.md,
  },
  completedEmoji: {
    fontSize: 24,
  },
  completedCardContent: {
    flex: 1,
  },
  completedCardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  completedCardDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
})

export default ChallengesScreen
