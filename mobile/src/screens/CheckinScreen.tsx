// Better Together Mobile: Enhanced Daily Check-in Screen
import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useAuth } from '../hooks/useAuth'
import { apiClient } from '../api/client'
import { COLORS, SPACING, FONT_SIZES, GRADIENTS, GLASSMORPHISM, SHADOWS } from '../utils/constants'

const { width } = Dimensions.get('window')

// Mood emojis with descriptions
const MOODS = [
  { emoji: '😢', label: 'Struggling', value: 1, color: '#EF4444' },
  { emoji: '😕', label: 'Low', value: 2, color: '#F97316' },
  { emoji: '😐', label: 'Okay', value: 3, color: '#F59E0B' },
  { emoji: '🙂', label: 'Good', value: 4, color: '#84CC16' },
  { emoji: '😊', label: 'Great', value: 5, color: '#22C55E' },
]

// Connection feelings
const CONNECTION_FEELINGS = [
  { emoji: '💔', label: 'Distant', value: 1, color: '#EF4444' },
  { emoji: '🤝', label: 'Neutral', value: 2, color: '#F59E0B' },
  { emoji: '💕', label: 'Close', value: 3, color: '#84CC16' },
  { emoji: '💖', label: 'Very Close', value: 4, color: '#22C55E' },
  { emoji: '💞', label: 'Deeply Connected', value: 5, color: '#ec4899' },
]

interface GlassCardProps {
  children: React.ReactNode
  style?: any
}

const GlassCard = ({ children, style }: GlassCardProps) => (
  <View style={[styles.glassCard, style]}>
    <BlurView intensity={20} tint="light" style={styles.glassBlur}>
      {children}
    </BlurView>
  </View>
)

interface MoodSelectorProps {
  value: number
  onChange: (value: number) => void
  items: typeof MOODS
  label: string
  description: string
}

const MoodSelector = ({ value, onChange, items, label, description }: MoodSelectorProps) => {
  const scaleAnims = useRef(items.map(() => new Animated.Value(1))).current

  const handlePress = (itemValue: number, index: number) => {
    Animated.sequence([
      Animated.timing(scaleAnims[index], {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnims[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start()
    onChange(itemValue)
  }

  const selectedItem = items.find(item => item.value === value)

  return (
    <GlassCard style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{label}</Text>
        <Text style={styles.sectionDescription}>{description}</Text>
      </View>

      <View style={styles.moodGrid}>
        {items.map((item, index) => (
          <Animated.View
            key={item.value}
            style={{ transform: [{ scale: scaleAnims[index] }] }}
          >
            <TouchableOpacity
              onPress={() => handlePress(item.value, index)}
              style={[
                styles.moodItem,
                value === item.value && styles.moodItemSelected,
                value === item.value && { borderColor: item.color || COLORS.primary },
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`${item.label} mood`}
              accessibilityState={{ selected: value === item.value }}
            >
              <Text style={styles.moodEmoji}>{item.emoji}</Text>
              <Text style={[
                styles.moodLabel,
                value === item.value && styles.moodLabelSelected,
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          </Animated.View>
        ))}
      </View>

      {selectedItem && (
        <View style={[styles.selectedIndicator, { backgroundColor: selectedItem.color || COLORS.primary }]}>
          <Text style={styles.selectedText}>
            You're feeling {selectedItem.label.toLowerCase()} {selectedItem.emoji}
          </Text>
        </View>
      )}
    </GlassCard>
  )
}

interface SliderScoreProps {
  value: number
  onChange: (value: number) => void
  label: string
  description: string
  icon: string
  minLabel: string
  maxLabel: string
}

const SliderScore = ({ value, onChange, label, description, icon, minLabel, maxLabel }: SliderScoreProps) => {
  const progress = (value - 1) / 9

  return (
    <GlassCard style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Ionicons name={icon as any} size={24} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>{label}</Text>
        </View>
        <Text style={styles.sectionDescription}>{description}</Text>
      </View>

      <View style={styles.sliderContainer}>
        <View style={styles.sliderTrack}>
          <LinearGradient
            colors={['#EF4444', '#F59E0B', '#22C55E'] as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[styles.sliderFill, { width: `${progress * 100}%` }]}
          />
        </View>

        <View style={styles.scoreDotsContainer}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
            <TouchableOpacity
              key={score}
              onPress={() => onChange(score)}
              style={[
                styles.scoreDot,
                value >= score && styles.scoreDotActive,
              ]}
              accessible={true}
              accessibilityRole="button"
              accessibilityLabel={`Score ${score}`}
            >
              <Text style={[
                styles.scoreDotText,
                value >= score && styles.scoreDotTextActive,
              ]}>
                {score}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabelText}>{minLabel}</Text>
          <Text style={styles.sliderValueText}>{value}/10</Text>
          <Text style={styles.sliderLabelText}>{maxLabel}</Text>
        </View>
      </View>
    </GlassCard>
  )
}

interface TextSectionProps {
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  icon: string
  emoji?: string
}

const TextSection = ({ value, onChange, label, placeholder, icon, emoji }: TextSectionProps) => (
  <GlassCard style={styles.sectionCard}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionEmoji}>{emoji}</Text>
        <Text style={styles.sectionTitle}>{label}</Text>
      </View>
    </View>

    <TextInput
      style={styles.textInput}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textSecondary}
      value={value}
      onChangeText={onChange}
      multiline
      numberOfLines={3}
      textAlignVertical="top"
    />
  </GlassCard>
)

const CheckinScreen = ({ navigation }: { navigation: any }) => {
  const { user } = useAuth()
  const [step, setStep] = useState(0)
  const [moodScore, setMoodScore] = useState(3)
  const [connectionScore, setConnectionScore] = useState(3)
  const [satisfactionScore, setSatisfactionScore] = useState(5)
  const [gratitudeNote, setGratitudeNote] = useState('')
  const [supportNeeded, setSupportNeeded] = useState('')
  const [highlight, setHighlight] = useState('')
  const [loading, setLoading] = useState(false)
  const [streak, setStreak] = useState(0)
  const [partnerCheckedIn, setPartnerCheckedIn] = useState(false)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const progressAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start()

    // Fetch streak and partner status
    fetchCheckinData()
  }, [])

  useEffect(() => {
    const progress = step / 3
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 300,
      useNativeDriver: false,
    }).start()
  }, [step])

  const fetchCheckinData = async () => {
    // Mock data for now
    setStreak(7)
    setPartnerCheckedIn(true)
  }

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)

    try {
      const relationshipResponse = await apiClient.getRelationship(user.id)

      if (relationshipResponse.data?.relationship) {
        const checkinData = {
          relationship_id: relationshipResponse.data.relationship.id,
          user_id: user.id,
          connection_score: connectionScore * 2, // Scale 1-5 to 2-10
          mood_score: moodScore * 2,
          relationship_satisfaction: satisfactionScore,
          gratitude_note: gratitudeNote,
          support_needed: supportNeeded,
          highlight_of_day: highlight,
        }

        const result = await apiClient.createCheckin(checkinData)

        if (result.data && !result.error) {
          Alert.alert(
            '🎉 Check-in Complete!',
            `Great job keeping your ${streak + 1} day streak alive!`,
            [{ text: 'Done', onPress: () => navigation.goBack() }]
          )
        } else {
          Alert.alert('Error', result.error?.message || 'Failed to save check-in')
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong. Please try again.')
    }

    setLoading(false)
  }

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      handleSubmit()
    }
  }

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <View>
            <MoodSelector
              value={moodScore}
              onChange={setMoodScore}
              items={MOODS}
              label="How are you feeling today?"
              description="Select the mood that best describes your current state"
            />

            <MoodSelector
              value={connectionScore}
              onChange={setConnectionScore}
              items={CONNECTION_FEELINGS}
              label="How connected do you feel?"
              description="Rate your emotional connection with your partner"
            />
          </View>
        )

      case 1:
        return (
          <SliderScore
            value={satisfactionScore}
            onChange={setSatisfactionScore}
            label="Relationship Satisfaction"
            description="Overall, how satisfied are you with your relationship today?"
            icon="heart-circle"
            minLabel="Not Great"
            maxLabel="Amazing"
          />
        )

      case 2:
        return (
          <View>
            <TextSection
              value={gratitudeNote}
              onChange={setGratitudeNote}
              label="What are you grateful for?"
              placeholder="Share something you appreciate about your partner or relationship..."
              icon="heart"
              emoji="🙏"
            />

            <TextSection
              value={highlight}
              onChange={setHighlight}
              label="Highlight of your day"
              placeholder="What made today special? Any moments you'd like to remember?"
              icon="sunny"
              emoji="✨"
            />
          </View>
        )

      case 3:
        return (
          <View>
            <TextSection
              value={supportNeeded}
              onChange={setSupportNeeded}
              label="Do you need support?"
              placeholder="Optional: Is there anything you'd like your partner to know or help with?"
              icon="hand-left"
              emoji="💬"
            />

            <GlassCard style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>📋 Check-in Summary</Text>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Mood:</Text>
                <Text style={styles.summaryValue}>
                  {MOODS.find(m => m.value === moodScore)?.emoji} {MOODS.find(m => m.value === moodScore)?.label}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Connection:</Text>
                <Text style={styles.summaryValue}>
                  {CONNECTION_FEELINGS.find(c => c.value === connectionScore)?.emoji} {CONNECTION_FEELINGS.find(c => c.value === connectionScore)?.label}
                </Text>
              </View>

              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Satisfaction:</Text>
                <Text style={styles.summaryValue}>{satisfactionScore}/10</Text>
              </View>

              {gratitudeNote && (
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Grateful for:</Text>
                  <Text style={styles.summaryValue} numberOfLines={2}>{gratitudeNote}</Text>
                </View>
              )}
            </GlassCard>
          </View>
        )

      default:
        return null
    }
  }

  const getProgressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  })

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient
        colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.background} />
        </TouchableOpacity>

        <Animated.View
          style={[
            styles.headerContent,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Daily Check-in</Text>
              <Text style={styles.headerSubtitle}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </Text>
            </View>

            <View style={styles.streakBadge}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakNumber}>{streak}</Text>
              <Text style={styles.streakLabel}>day streak</Text>
            </View>
          </View>

          {partnerCheckedIn && (
            <View style={styles.partnerStatus}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.partnerStatusText}>Your partner has checked in today!</Text>
            </View>
          )}

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View style={[styles.progressFill, { width: getProgressWidth }]} />
            </View>
            <View style={styles.stepIndicators}>
              {['Mood', 'Satisfaction', 'Gratitude', 'Review'].map((label, index) => (
                <View
                  key={label}
                  style={[styles.stepDot, step >= index && styles.stepDotActive]}
                >
                  <Text style={[styles.stepLabel, step >= index && styles.stepLabelActive]}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {renderStep()}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {step > 0 && (
          <TouchableOpacity
            style={styles.prevButton}
            onPress={prevStep}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
            <Text style={styles.prevButtonText}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.nextButton, loading && styles.nextButtonDisabled]}
          onPress={nextStep}
          disabled={loading}
        >
          <LinearGradient
            colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.nextButtonGradient}
          >
            <Text style={styles.nextButtonText}>
              {step === 3 ? (loading ? 'Saving...' : 'Complete Check-in') : 'Continue'}
            </Text>
            {step < 3 && <Ionicons name="arrow-forward" size={20} color={COLORS.background} />}
            {step === 3 && !loading && <Ionicons name="checkmark" size={20} color={COLORS.background} />}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  header: {
    paddingTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  headerContent: {
    gap: SPACING.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  streakBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
  },
  streakEmoji: {
    fontSize: 24,
  },
  streakNumber: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.background,
  },
  streakLabel: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.8)',
  },
  partnerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: SPACING.md,
  },
  partnerStatusText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.background,
  },
  progressContainer: {
    marginTop: SPACING.md,
  },
  progressBackground: {
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 3,
  },
  stepIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  stepDot: {
    alignItems: 'center',
  },
  stepDotActive: {},
  stepLabel: {
    fontSize: FONT_SIZES.xs,
    color: 'rgba(255,255,255,0.5)',
  },
  stepLabelActive: {
    color: COLORS.background,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: 120,
  },
  glassCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    ...SHADOWS.card,
  },
  glassBlur: {
    padding: SPACING.lg,
    backgroundColor: GLASSMORPHISM.light.backgroundColor,
  },
  sectionCard: {},
  sectionHeader: {
    marginBottom: SPACING.lg,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  sectionEmoji: {
    fontSize: 24,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  moodGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  moodItem: {
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    minWidth: (width - SPACING.lg * 4) / 5 - SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  moodItemSelected: {
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  moodLabelSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  selectedIndicator: {
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedText: {
    color: COLORS.background,
    fontWeight: '600',
    fontSize: FONT_SIZES.sm,
  },
  sliderContainer: {
    gap: SPACING.md,
  },
  sliderTrack: {
    height: 8,
    backgroundColor: COLORS.gray200,
    borderRadius: 4,
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreDotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  scoreDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  scoreDotActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  scoreDotText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  scoreDotTextActive: {
    color: COLORS.background,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderLabelText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  sliderValueText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  textInput: {
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    padding: SPACING.md,
    minHeight: 100,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    textAlignVertical: 'top',
  },
  summaryCard: {
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
  },
  summaryTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
    textAlign: 'right',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: SPACING.lg,
    paddingBottom: SPACING.xl,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    gap: SPACING.md,
  },
  prevButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.gray100,
  },
  prevButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
  },
  nextButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextButtonDisabled: {
    opacity: 0.6,
  },
  nextButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
  },
  nextButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.background,
  },
})

export default CheckinScreen
