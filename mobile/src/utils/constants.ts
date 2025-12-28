// Better Together Mobile: Constants

export const COLORS = {
  // Primary palette (matching web app)
  primary: '#ec4899',
  primaryPurple: '#8b5cf6',
  primaryBlue: '#3b82f6',

  // Secondary shades
  secondary: '#be185d',
  accent: '#7c3aed',

  // Status colors
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',

  // Gray scale
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray800: '#1f2937',
  gray900: '#111827',

  // Legacy compatibility
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#E0E0E0',
}

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

export const GRADIENTS = {
  primary: ['#ec4899', '#8b5cf6'] as const,
  pink: ['#ec4899', '#be185d'] as const,
  purple: ['#8b5cf6', '#7c3aed'] as const,
  blue: ['#3b82f6', '#2563eb'] as const,
  green: ['#10b981', '#059669'] as const,
  warm: ['#fef3c7', '#fde68a'] as const,
  sunset: ['#f97316', '#ea580c'] as const,
} as const

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
}

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
}

export const BORDER_RADIUS = {
  small: 8,
  medium: 12,
  large: 16,
  xl: 20,
  full: 9999,
  // Legacy compatibility
  sm: 4,
  md: 8,
  lg: 12,
  round: 999,
}

export const SHADOWS = {
  soft: {
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  heavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
}

export const GLASSMORPHISM = {
  light: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  medium: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dark: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  pink: {
    backgroundColor: 'rgba(236, 72, 153, 0.15)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.3)',
  },
}

export const ANIMATIONS = {
  spring: { damping: 15, stiffness: 150 },
  gentle: { duration: 200 },
  bounce: { damping: 10, stiffness: 200 },
  slow: { duration: 400 },
}

export const LOVE_LANGUAGES = [
  { value: 'words_of_affirmation', label: 'Words of Affirmation' },
  { value: 'quality_time', label: 'Quality Time' },
  { value: 'physical_touch', label: 'Physical Touch' },
  { value: 'acts_of_service', label: 'Acts of Service' },
  { value: 'receiving_gifts', label: 'Receiving Gifts' },
] as const

export const RELATIONSHIP_TYPES = [
  { value: 'dating', label: 'Dating' },
  { value: 'engaged', label: 'Engaged' },
  { value: 'married', label: 'Married' },
  { value: 'partnership', label: 'Partnership' },
] as const

export const ACTIVITY_TYPES = [
  { value: 'date_night', label: 'Date Night', icon: '🌃' },
  { value: 'quality_time', label: 'Quality Time', icon: '⏰' },
  { value: 'adventure', label: 'Adventure', icon: '🏔️' },
  { value: 'relaxation', label: 'Relaxation', icon: '🧘' },
  { value: 'learning', label: 'Learning', icon: '📚' },
  { value: 'exercise', label: 'Exercise', icon: '🏃' },
  { value: 'social', label: 'Social', icon: '👥' },
  { value: 'custom', label: 'Custom', icon: '✨' },
] as const

export const CHALLENGE_CATEGORIES = [
  { value: 'communication', label: 'Communication', color: '#2196F3' },
  { value: 'intimacy', label: 'Intimacy', color: '#FF6B9D' },
  { value: 'adventure', label: 'Adventure', color: '#FF9800' },
  { value: 'gratitude', label: 'Gratitude', color: '#4CAF50' },
  { value: 'quality_time', label: 'Quality Time', color: '#9C27B0' },
  { value: 'support', label: 'Support', color: '#00BCD4' },
] as const

export const DIFFICULTY_LEVELS = [
  { value: 'easy', label: 'Easy', color: '#4CAF50' },
  { value: 'medium', label: 'Medium', color: '#FF9800' },
  { value: 'hard', label: 'Hard', color: '#F44336' },
] as const

export const ACTIVITY_STATUS = [
  { value: 'planned', label: 'Planned', color: '#2196F3' },
  { value: 'completed', label: 'Completed', color: '#4CAF50' },
  { value: 'cancelled', label: 'Cancelled', color: '#999999' },
] as const
