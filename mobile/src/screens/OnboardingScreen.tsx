// Better Together Mobile: Onboarding Flow
import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  Dimensions,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useAuth } from '../hooks/useAuth'
import { apiClient } from '../api/client'
import { COLORS, SPACING, FONT_SIZES, GRADIENTS, GLASSMORPHISM } from '../utils/constants'
import type { LoveLanguage } from '../types'

const { width, height } = Dimensions.get('window')

// Love Languages
const LOVE_LANGUAGES: { id: LoveLanguage; label: string; emoji: string; description: string }[] = [
  { id: 'words_of_affirmation', label: 'Words of Affirmation', emoji: '💬', description: 'Verbal compliments, encouragement, and appreciation' },
  { id: 'quality_time', label: 'Quality Time', emoji: '⏰', description: 'Undivided attention and focused presence' },
  { id: 'receiving_gifts', label: 'Receiving Gifts', emoji: '🎁', description: 'Thoughtful presents and symbols of love' },
  { id: 'acts_of_service', label: 'Acts of Service', emoji: '🤲', description: 'Helpful actions and doing things for each other' },
  { id: 'physical_touch', label: 'Physical Touch', emoji: '🤗', description: 'Hugs, holding hands, and physical closeness' },
]

// Relationship types
const RELATIONSHIP_TYPES = [
  { id: 'dating', label: 'Dating', emoji: '💕' },
  { id: 'engaged', label: 'Engaged', emoji: '💍' },
  { id: 'married', label: 'Married', emoji: '💒' },
  { id: 'partnership', label: 'Partnership', emoji: '🤝' },
]

interface OnboardingScreenProps {
  navigation: any
}

interface StepProps {
  onNext: () => void
  onBack?: () => void
  isFirst?: boolean
  isLast?: boolean
}

// Welcome Screen
const WelcomeStep = ({ onNext }: StepProps) => {
  const fadeAnim = useRef(new Animated.Value(0)).current
  const scaleAnim = useRef(new Animated.Value(0.8)).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  return (
    <Animated.View style={[styles.stepContainer, { opacity: fadeAnim }]}>
      <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }] }]}>
        <LinearGradient
          colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
          style={styles.logoGradient}
        >
          <Text style={styles.logoEmoji}>💕</Text>
        </LinearGradient>
      </Animated.View>

      <Text style={styles.welcomeTitle}>Welcome to{'\n'}Better Together</Text>
      <Text style={styles.welcomeSubtitle}>
        Your journey to a stronger, more connected relationship starts here
      </Text>

      <View style={styles.featureList}>
        {[
          { emoji: '📊', text: 'Track your relationship health' },
          { emoji: '💬', text: 'Daily check-ins with your partner' },
          { emoji: '🎯', text: 'Set and achieve goals together' },
          { emoji: '🤖', text: 'AI-powered relationship coaching' },
        ].map((feature, index) => (
          <Animated.View
            key={index}
            style={[
              styles.featureItem,
              {
                opacity: fadeAnim,
                transform: [{
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20 * (index + 1), 0],
                  }),
                }],
              },
            ]}
          >
            <Text style={styles.featureEmoji}>{feature.emoji}</Text>
            <Text style={styles.featureText}>{feature.text}</Text>
          </Animated.View>
        ))}
      </View>

      <TouchableOpacity onPress={onNext} style={styles.primaryButton}>
        <LinearGradient
          colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.background} />
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  )
}

// Profile Setup Step
interface ProfileStepProps extends StepProps {
  name: string
  setName: (val: string) => void
  nickname: string
  setNickname: (val: string) => void
}

const ProfileStep = ({ onNext, onBack, name, setName, nickname, setNickname }: ProfileStepProps) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.stepContainer}
  >
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepEmoji}>👤</Text>
        <Text style={styles.stepTitle}>Let's set up your profile</Text>
        <Text style={styles.stepSubtitle}>Tell us a bit about yourself</Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Your Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your full name"
            placeholderTextColor={COLORS.textSecondary}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nickname (optional)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="What should your partner call you?"
            placeholderTextColor={COLORS.textSecondary}
            value={nickname}
            onChangeText={setNickname}
          />
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={onBack} style={styles.secondaryButton}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNext}
          style={[styles.primaryButton, styles.flexButton, !name && styles.disabledButton]}
          disabled={!name}
        >
          <LinearGradient
            colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>Continue</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.background} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ScrollView>
  </KeyboardAvoidingView>
)

// Love Language Step
interface LoveLanguageStepProps extends StepProps {
  primaryLanguage: LoveLanguage | null
  setPrimaryLanguage: (val: LoveLanguage) => void
  secondaryLanguage: LoveLanguage | null
  setSecondaryLanguage: (val: LoveLanguage) => void
}

const LoveLanguageStep = ({
  onNext,
  onBack,
  primaryLanguage,
  setPrimaryLanguage,
  secondaryLanguage,
  setSecondaryLanguage,
}: LoveLanguageStepProps) => {
  const [selectingSecondary, setSelectingSecondary] = useState(false)

  const handleSelect = (lang: LoveLanguage) => {
    if (selectingSecondary) {
      if (lang !== primaryLanguage) {
        setSecondaryLanguage(lang)
      }
    } else {
      setPrimaryLanguage(lang)
      if (lang === secondaryLanguage) {
        setSecondaryLanguage(null as any)
      }
    }
  }

  return (
    <View style={styles.stepContainer}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.stepHeader}>
          <Text style={styles.stepEmoji}>💖</Text>
          <Text style={styles.stepTitle}>
            {selectingSecondary ? 'Secondary Love Language' : 'Primary Love Language'}
          </Text>
          <Text style={styles.stepSubtitle}>
            {selectingSecondary
              ? 'What\'s your second preferred way to receive love?'
              : 'How do you most prefer to receive love?'}
          </Text>
        </View>

        <View style={styles.languageList}>
          {LOVE_LANGUAGES.map((lang) => {
            const isPrimary = primaryLanguage === lang.id
            const isSecondary = secondaryLanguage === lang.id
            const isSelected = selectingSecondary ? isSecondary : isPrimary
            const isDisabled = selectingSecondary && isPrimary

            return (
              <TouchableOpacity
                key={lang.id}
                onPress={() => !isDisabled && handleSelect(lang.id)}
                style={[
                  styles.languageCard,
                  isSelected && styles.languageCardSelected,
                  isDisabled && styles.languageCardDisabled,
                ]}
                disabled={isDisabled}
              >
                <Text style={styles.languageEmoji}>{lang.emoji}</Text>
                <View style={styles.languageInfo}>
                  <Text style={[styles.languageLabel, isSelected && styles.languageLabelSelected]}>
                    {lang.label}
                  </Text>
                  <Text style={styles.languageDescription}>{lang.description}</Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                )}
                {isPrimary && !selectingSecondary && (
                  <View style={styles.primaryBadge}>
                    <Text style={styles.primaryBadgeText}>Primary</Text>
                  </View>
                )}
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => selectingSecondary ? setSelectingSecondary(false) : onBack?.()}
            style={styles.secondaryButton}
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.text} />
            <Text style={styles.secondaryButtonText}>Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!selectingSecondary && primaryLanguage) {
                setSelectingSecondary(true)
              } else if (secondaryLanguage) {
                onNext()
              }
            }}
            style={[
              styles.primaryButton,
              styles.flexButton,
              (!primaryLanguage || (selectingSecondary && !secondaryLanguage)) && styles.disabledButton,
            ]}
            disabled={!primaryLanguage || (selectingSecondary && !secondaryLanguage)}
          >
            <LinearGradient
              colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <Text style={styles.primaryButtonText}>
                {selectingSecondary ? 'Continue' : 'Next'}
              </Text>
              <Ionicons name="arrow-forward" size={20} color={COLORS.background} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

// Relationship Type Step
interface RelationshipStepProps extends StepProps {
  relationshipType: string
  setRelationshipType: (val: string) => void
}

const RelationshipStep = ({ onNext, onBack, relationshipType, setRelationshipType }: RelationshipStepProps) => (
  <View style={styles.stepContainer}>
    <View style={styles.stepHeader}>
      <Text style={styles.stepEmoji}>💑</Text>
      <Text style={styles.stepTitle}>Relationship Status</Text>
      <Text style={styles.stepSubtitle}>What best describes your relationship?</Text>
    </View>

    <View style={styles.relationshipGrid}>
      {RELATIONSHIP_TYPES.map((type) => (
        <TouchableOpacity
          key={type.id}
          onPress={() => setRelationshipType(type.id)}
          style={[
            styles.relationshipCard,
            relationshipType === type.id && styles.relationshipCardSelected,
          ]}
        >
          <Text style={styles.relationshipEmoji}>{type.emoji}</Text>
          <Text style={[
            styles.relationshipLabel,
            relationshipType === type.id && styles.relationshipLabelSelected,
          ]}>
            {type.label}
          </Text>
          {relationshipType === type.id && (
            <View style={styles.checkIcon}>
              <Ionicons name="checkmark" size={16} color={COLORS.background} />
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>

    <View style={styles.buttonRow}>
      <TouchableOpacity onPress={onBack} style={styles.secondaryButton}>
        <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        <Text style={styles.secondaryButtonText}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNext}
        style={[styles.primaryButton, styles.flexButton, !relationshipType && styles.disabledButton]}
        disabled={!relationshipType}
      >
        <LinearGradient
          colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.buttonGradient}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={20} color={COLORS.background} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>
)

// Invite Partner Step
interface InviteStepProps extends StepProps {
  partnerEmail: string
  setPartnerEmail: (val: string) => void
  onComplete: () => Promise<void>
  loading: boolean
}

const InviteStep = ({ onBack, partnerEmail, setPartnerEmail, onComplete, loading }: InviteStepProps) => (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.stepContainer}
  >
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.stepHeader}>
        <Text style={styles.stepEmoji}>💌</Text>
        <Text style={styles.stepTitle}>Invite Your Partner</Text>
        <Text style={styles.stepSubtitle}>
          Send an invitation to connect your accounts
        </Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Partner's Email</Text>
          <TextInput
            style={styles.textInput}
            placeholder="partner@email.com"
            placeholderTextColor={COLORS.textSecondary}
            value={partnerEmail}
            onChangeText={setPartnerEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={20} color={COLORS.info} />
          <Text style={styles.infoText}>
            Your partner will receive an email invitation to download the app and connect with you.
          </Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity onPress={onBack} style={styles.secondaryButton}>
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
          <Text style={styles.secondaryButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onComplete}
          style={[styles.primaryButton, styles.flexButton, loading && styles.disabledButton]}
          disabled={loading}
        >
          <LinearGradient
            colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Setting up...' : partnerEmail ? 'Complete & Send Invite' : 'Complete Setup'}
            </Text>
            {!loading && <Ionicons name="checkmark" size={20} color={COLORS.background} />}
          </LinearGradient>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={onComplete} style={styles.skipButton}>
        <Text style={styles.skipButtonText}>Skip for now</Text>
      </TouchableOpacity>
    </ScrollView>
  </KeyboardAvoidingView>
)

// Main Onboarding Screen
const OnboardingScreen = ({ navigation }: OnboardingScreenProps) => {
  const { setUser } = useAuth()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [primaryLanguage, setPrimaryLanguage] = useState<LoveLanguage | null>(null)
  const [secondaryLanguage, setSecondaryLanguage] = useState<LoveLanguage | null>(null)
  const [relationshipType, setRelationshipType] = useState('')
  const [partnerEmail, setPartnerEmail] = useState('')

  const slideAnim = useRef(new Animated.Value(0)).current

  const nextStep = () => {
    Animated.sequence([
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()

    setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 0) {
      Animated.sequence([
        Animated.timing(slideAnim, {
          toValue: width,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -width,
          duration: 0,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start()

      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    setLoading(true)

    try {
      // Create user
      const userData = {
        email: `user_${Date.now()}@bettertogether.app`, // Temporary email for demo
        name,
        nickname: nickname || undefined,
        love_language_primary: primaryLanguage,
        love_language_secondary: secondaryLanguage,
        relationship_preferences: relationshipType,
      }

      const result = await apiClient.createUser(userData)

      if (result.data?.user) {
        await apiClient.storeUserId(result.data.user.id)
        await apiClient.storeUserData(result.data.user)

        // Invite partner if email provided
        if (partnerEmail) {
          await apiClient.invitePartner({
            user_id: result.data.user.id,
            partner_email: partnerEmail,
            relationship_type: relationshipType,
          })
        }

        // Set the user
        setUser?.(result.data.user)

        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' }],
        })
      }
    } catch (error) {
      console.error('Onboarding error:', error)
    }

    setLoading(false)
  }

  const totalSteps = 5
  const progress = (step / (totalSteps - 1)) * 100

  const renderStep = () => {
    switch (step) {
      case 0:
        return <WelcomeStep onNext={nextStep} isFirst />
      case 1:
        return (
          <ProfileStep
            onNext={nextStep}
            onBack={prevStep}
            name={name}
            setName={setName}
            nickname={nickname}
            setNickname={setNickname}
          />
        )
      case 2:
        return (
          <LoveLanguageStep
            onNext={nextStep}
            onBack={prevStep}
            primaryLanguage={primaryLanguage}
            setPrimaryLanguage={setPrimaryLanguage}
            secondaryLanguage={secondaryLanguage}
            setSecondaryLanguage={setSecondaryLanguage}
          />
        )
      case 3:
        return (
          <RelationshipStep
            onNext={nextStep}
            onBack={prevStep}
            relationshipType={relationshipType}
            setRelationshipType={setRelationshipType}
          />
        )
      case 4:
        return (
          <InviteStep
            onBack={prevStep}
            onNext={handleComplete}
            partnerEmail={partnerEmail}
            setPartnerEmail={setPartnerEmail}
            onComplete={handleComplete}
            loading={loading}
            isLast
          />
        )
      default:
        return null
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.gray50, COLORS.background] as readonly [string, string, ...string[]]}
        style={styles.background}
      >
        {/* Progress Bar */}
        {step > 0 && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
            <Text style={styles.progressText}>Step {step} of {totalSteps - 1}</Text>
          </View>
        )}

        {/* Content */}
        <Animated.View
          style={[
            styles.content,
            { transform: [{ translateX: slideAnim }] },
          ]}
        >
          {renderStep()}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  content: {
    flex: 1,
  },
  stepContainer: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  logoContainer: {
    alignSelf: 'center',
    marginBottom: SPACING.xl,
  },
  logoGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 64,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  welcomeSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  featureList: {
    marginBottom: SPACING.xl,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  featureEmoji: {
    fontSize: 24,
    marginRight: SPACING.md,
  },
  featureText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  stepHeader: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  stepEmoji: {
    fontSize: 56,
    marginBottom: SPACING.md,
  },
  stepTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  stepSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  formSection: {
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.lg,
  },
  inputLabel: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  textInput: {
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    padding: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  languageList: {
    marginBottom: SPACING.lg,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    marginBottom: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  languageCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
  },
  languageCardDisabled: {
    opacity: 0.5,
  },
  languageEmoji: {
    fontSize: 32,
    marginRight: SPACING.md,
  },
  languageInfo: {
    flex: 1,
  },
  languageLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  languageLabelSelected: {
    color: COLORS.primary,
  },
  languageDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  primaryBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: SPACING.sm,
  },
  primaryBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: COLORS.background,
  },
  relationshipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
  },
  relationshipCard: {
    width: (width - SPACING.lg * 3) / 2,
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  relationshipCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
  },
  relationshipEmoji: {
    fontSize: 40,
    marginBottom: SPACING.sm,
  },
  relationshipLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  relationshipLabelSelected: {
    color: COLORS.primary,
  },
  checkIcon: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    padding: 4,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderRadius: 12,
    gap: SPACING.sm,
  },
  infoText: {
    flex: 1,
    fontSize: FONT_SIZES.sm,
    color: COLORS.info,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  flexButton: {
    flex: 1,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.xl,
  },
  primaryButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.background,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
  },
  secondaryButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  skipButton: {
    alignSelf: 'center',
    paddingVertical: SPACING.lg,
  },
  skipButtonText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
  },
})

export default OnboardingScreen
