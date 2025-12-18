// Better Together Mobile: Constants

export const COLORS = {
  primary: '#FF6B9D',
  secondary: '#C44569',
  accent: '#FFA07A',
  background: '#FFFFFF',
  surface: '#F5F5F5',
  text: '#333333',
  textSecondary: '#666666',
  textLight: '#999999',
  border: '#E0E0E0',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
}

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
}

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
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 999,
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
