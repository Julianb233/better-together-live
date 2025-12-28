// Better Together Mobile: Goals Management Screen
import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Animated,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, SPACING, FONT_SIZES, GRADIENTS, SHADOWS } from '../utils/constants'

const { width } = Dimensions.get('window')

interface Goal {
  id: string
  title: string
  description: string
  category: GoalCategory
  progress: number
  targetDate?: Date
  milestones: Milestone[]
  createdAt: Date
  isShared: boolean
  completedAt?: Date
}

interface Milestone {
  id: string
  title: string
  isCompleted: boolean
}

type GoalCategory = 'communication' | 'quality_time' | 'intimacy' | 'adventure' | 'growth' | 'financial' | 'health' | 'family'

const GOAL_CATEGORIES: { id: GoalCategory; label: string; emoji: string; color: string }[] = [
  { id: 'communication', label: 'Communication', emoji: '💬', color: '#3b82f6' },
  { id: 'quality_time', label: 'Quality Time', emoji: '⏰', color: '#8b5cf6' },
  { id: 'intimacy', label: 'Intimacy', emoji: '❤️', color: '#ec4899' },
  { id: 'adventure', label: 'Adventure', emoji: '🏔️', color: '#f97316' },
  { id: 'growth', label: 'Growth', emoji: '🌱', color: '#22c55e' },
  { id: 'financial', label: 'Financial', emoji: '💰', color: '#eab308' },
  { id: 'health', label: 'Health', emoji: '🏃', color: '#14b8a6' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧', color: '#6366f1' },
]

// Demo goals
const DEMO_GOALS: Goal[] = [
  {
    id: '1',
    title: 'Weekly Date Night',
    description: 'Have a dedicated date night every week for quality time together',
    category: 'quality_time',
    progress: 60,
    milestones: [
      { id: '1a', title: 'Plan first date night', isCompleted: true },
      { id: '1b', title: 'Try 3 new restaurants', isCompleted: true },
      { id: '1c', title: 'Do an outdoor activity', isCompleted: false },
      { id: '1d', title: 'Complete 10 date nights', isCompleted: false },
    ],
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    isShared: true,
  },
  {
    id: '2',
    title: 'Daily Check-ins',
    description: 'Share highs and lows of the day with each other',
    category: 'communication',
    progress: 85,
    milestones: [
      { id: '2a', title: 'Set reminder for daily check-in', isCompleted: true },
      { id: '2b', title: 'Do 7 consecutive days', isCompleted: true },
      { id: '2c', title: 'Do 30 consecutive days', isCompleted: false },
    ],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    isShared: true,
  },
  {
    id: '3',
    title: 'Learn Something New Together',
    description: 'Take a cooking class or learn a new hobby as a couple',
    category: 'growth',
    progress: 25,
    milestones: [
      { id: '3a', title: 'Research class options', isCompleted: true },
      { id: '3b', title: 'Book a class', isCompleted: false },
      { id: '3c', title: 'Complete the class', isCompleted: false },
    ],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isShared: true,
  },
]

const GoalCard = ({ goal, onPress }: { goal: Goal; onPress: () => void }) => {
  const category = GOAL_CATEGORIES.find(c => c.id === goal.category)
  const scaleAnim = useRef(new Animated.Value(1)).current
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: goal.progress,
      duration: 800,
      useNativeDriver: false,
    }).start()
  }, [goal.progress])

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start()
  }

  const completedMilestones = goal.milestones.filter(m => m.isCompleted).length

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.9}
    >
      <Animated.View style={[styles.goalCard, { transform: [{ scale: scaleAnim }] }]}>
        <BlurView intensity={80} tint="light" style={styles.goalCardContent}>
          <View style={styles.goalHeader}>
            <View style={[styles.categoryBadge, { backgroundColor: `${category?.color}20` }]}>
              <Text style={styles.categoryEmoji}>{category?.emoji}</Text>
              <Text style={[styles.categoryLabel, { color: category?.color }]}>{category?.label}</Text>
            </View>
            {goal.isShared && (
              <View style={styles.sharedBadge}>
                <Feather name="users" size={12} color={COLORS.primary} />
                <Text style={styles.sharedText}>Shared</Text>
              </View>
            )}
          </View>

          <Text style={styles.goalTitle}>{goal.title}</Text>
          <Text style={styles.goalDescription} numberOfLines={2}>{goal.description}</Text>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressPercent}>{goal.progress}%</Text>
            </View>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                    }),
                    backgroundColor: category?.color || COLORS.primary,
                  },
                ]}
              />
            </View>
          </View>

          {/* Milestones Preview */}
          <View style={styles.milestonesPreview}>
            <Feather name="flag" size={14} color={COLORS.textSecondary} />
            <Text style={styles.milestonesText}>
              {completedMilestones} of {goal.milestones.length} milestones completed
            </Text>
          </View>
        </BlurView>
      </Animated.View>
    </TouchableOpacity>
  )
}

const CreateGoalModal = ({
  visible,
  onClose,
  onSave,
}: {
  visible: boolean
  onClose: () => void
  onSave: (goal: Partial<Goal>) => void
}) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<GoalCategory>('communication')
  const [milestones, setMilestones] = useState<string[]>([''])

  const handleAddMilestone = () => {
    setMilestones([...milestones, ''])
  }

  const handleUpdateMilestone = (index: number, value: string) => {
    const updated = [...milestones]
    updated[index] = value
    setMilestones(updated)
  }

  const handleRemoveMilestone = (index: number) => {
    if (milestones.length > 1) {
      const updated = milestones.filter((_, i) => i !== index)
      setMilestones(updated)
    }
  }

  const handleSave = () => {
    if (!title.trim()) return

    const validMilestones = milestones
      .filter(m => m.trim())
      .map((m, i) => ({ id: `m${i}`, title: m, isCompleted: false }))

    onSave({
      title,
      description,
      category: selectedCategory,
      milestones: validMilestones,
      progress: 0,
      isShared: true,
    })

    // Reset form
    setTitle('')
    setDescription('')
    setSelectedCategory('communication')
    setMilestones([''])
    onClose()
  }

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <BlurView intensity={100} tint="light" style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create New Goal</Text>
            <TouchableOpacity onPress={onClose}>
              <Feather name="x" size={24} color={COLORS.gray800} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Title */}
            <Text style={styles.inputLabel}>Goal Title</Text>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Weekly date night"
              placeholderTextColor={COLORS.textLight}
            />

            {/* Description */}
            <Text style={styles.inputLabel}>Description</Text>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="What do you want to achieve together?"
              placeholderTextColor={COLORS.textLight}
              multiline
              numberOfLines={3}
            />

            {/* Category */}
            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoriesGrid}>
              {GOAL_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[
                    styles.categoryButton,
                    selectedCategory === cat.id && { borderColor: cat.color, backgroundColor: `${cat.color}15` },
                  ]}
                >
                  <Text style={styles.categoryButtonEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.categoryButtonLabel, selectedCategory === cat.id && { color: cat.color }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Milestones */}
            <Text style={styles.inputLabel}>Milestones</Text>
            {milestones.map((milestone, index) => (
              <View key={index} style={styles.milestoneInput}>
                <TextInput
                  style={[styles.textInput, styles.milestoneTextInput]}
                  value={milestone}
                  onChangeText={(value) => handleUpdateMilestone(index, value)}
                  placeholder={`Milestone ${index + 1}`}
                  placeholderTextColor={COLORS.textLight}
                />
                {milestones.length > 1 && (
                  <TouchableOpacity onPress={() => handleRemoveMilestone(index)} style={styles.removeMilestone}>
                    <Feather name="x" size={18} color={COLORS.error} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity onPress={handleAddMilestone} style={styles.addMilestoneButton}>
              <Feather name="plus" size={18} color={COLORS.primary} />
              <Text style={styles.addMilestoneText}>Add Milestone</Text>
            </TouchableOpacity>

            {/* Save Button */}
            <TouchableOpacity onPress={handleSave} disabled={!title.trim()}>
              <LinearGradient
                colors={title.trim() ? GRADIENTS.primary : ['#d1d5db', '#9ca3af']}
                style={styles.saveButton}
              >
                <Feather name="check" size={20} color="white" />
                <Text style={styles.saveButtonText}>Create Goal</Text>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </BlurView>
      </View>
    </Modal>
  )
}

const GoalsScreen: React.FC = () => {
  const navigation = useNavigation()
  const [goals, setGoals] = useState<Goal[]>(DEMO_GOALS)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterCategory, setFilterCategory] = useState<GoalCategory | 'all'>('all')

  const filteredGoals = filterCategory === 'all'
    ? goals
    : goals.filter(g => g.category === filterCategory)

  const activeGoals = filteredGoals.filter(g => !g.completedAt)
  const completedGoals = filteredGoals.filter(g => g.completedAt)

  const handleCreateGoal = (newGoal: Partial<Goal>) => {
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title || '',
      description: newGoal.description || '',
      category: newGoal.category || 'communication',
      progress: 0,
      milestones: newGoal.milestones || [],
      createdAt: new Date(),
      isShared: newGoal.isShared || false,
    }
    setGoals([goal, ...goals])
  }

  const handleGoalPress = (goal: Goal) => {
    // Navigate to goal detail (to be implemented)
    console.log('Goal pressed:', goal.title)
  }

  const overallProgress = goals.length > 0
    ? Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)
    : 0

  return (
    <LinearGradient colors={['#fdf2f8', '#fce7f3', '#f5f3ff']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={COLORS.gray800} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Relationship Goals</Text>
          <TouchableOpacity onPress={() => setShowCreateModal(true)} style={styles.addButton}>
            <LinearGradient colors={GRADIENTS.primary} style={styles.addButtonGradient}>
              <Feather name="plus" size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Overview Card */}
          <View style={styles.overviewCard}>
            <LinearGradient colors={GRADIENTS.primary} style={styles.overviewGradient}>
              <View style={styles.overviewContent}>
                <View>
                  <Text style={styles.overviewLabel}>Overall Progress</Text>
                  <Text style={styles.overviewTitle}>{overallProgress}% Complete</Text>
                  <Text style={styles.overviewSubtitle}>
                    {activeGoals.length} active goals
                  </Text>
                </View>
                <View style={styles.overviewCircle}>
                  <Text style={styles.overviewCircleText}>{overallProgress}%</Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Category Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryFilter}
            contentContainerStyle={styles.categoryFilterContent}
          >
            <TouchableOpacity
              onPress={() => setFilterCategory('all')}
              style={[styles.filterChip, filterCategory === 'all' && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, filterCategory === 'all' && styles.filterChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>
            {GOAL_CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setFilterCategory(cat.id)}
                style={[styles.filterChip, filterCategory === cat.id && styles.filterChipActive]}
              >
                <Text style={styles.filterChipEmoji}>{cat.emoji}</Text>
                <Text style={[styles.filterChipText, filterCategory === cat.id && styles.filterChipTextActive]}>
                  {cat.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Active Goals */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Active Goals</Text>
            {activeGoals.length > 0 ? (
              activeGoals.map(goal => (
                <GoalCard key={goal.id} goal={goal} onPress={() => handleGoalPress(goal)} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🎯</Text>
                <Text style={styles.emptyTitle}>No active goals</Text>
                <Text style={styles.emptySubtitle}>Create a goal to start tracking progress together!</Text>
              </View>
            )}
          </View>

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Completed Goals</Text>
              {completedGoals.map(goal => (
                <GoalCard key={goal.id} goal={goal} onPress={() => handleGoalPress(goal)} />
              ))}
            </View>
          )}

          <View style={styles.bottomSpacer} />
        </ScrollView>

        {/* Create Modal */}
        <CreateGoalModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSave={handleCreateGoal}
        />
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    padding: SPACING.sm,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.gray800,
  },
  addButton: {
    padding: SPACING.xs,
  },
  addButtonGradient: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.soft,
  },
  scrollView: {
    flex: 1,
  },
  overviewCard: {
    marginHorizontal: SPACING.md,
    marginTop: SPACING.sm,
    borderRadius: 20,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  overviewGradient: {
    padding: SPACING.lg,
  },
  overviewContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  overviewTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: 'white',
  },
  overviewSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  overviewCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white',
  },
  overviewCircleText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: 'white',
  },
  categoryFilter: {
    marginTop: SPACING.md,
  },
  categoryFilterContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.1)',
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  filterChipText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray800,
  },
  filterChipTextActive: {
    color: 'white',
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.gray800,
    marginBottom: SPACING.md,
  },
  goalCard: {
    marginBottom: SPACING.md,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  goalCardContent: {
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryEmoji: {
    fontSize: 14,
    marginRight: 4,
  },
  categoryLabel: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
  },
  sharedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sharedText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '500',
  },
  goalTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.gray800,
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  progressSection: {
    marginTop: SPACING.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  progressPercent: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.gray800,
  },
  progressTrack: {
    height: 8,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  milestonesPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    gap: 6,
  },
  milestonesText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  bottomSpacer: {
    height: SPACING.xxl,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.98)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(236, 72, 153, 0.1)',
  },
  modalTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.gray800,
  },
  modalContent: {
    padding: SPACING.md,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: SPACING.sm,
    marginTop: SPACING.md,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.gray800,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  categoryButtonEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryButtonLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '500',
    color: COLORS.gray800,
  },
  milestoneInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  milestoneTextInput: {
    flex: 1,
    marginBottom: 0,
  },
  removeMilestone: {
    padding: SPACING.sm,
    marginLeft: SPACING.sm,
  },
  addMilestoneButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
    gap: 6,
  },
  addMilestoneText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: 12,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
    ...SHADOWS.soft,
  },
  saveButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: 'white',
  },
})

export default GoalsScreen
