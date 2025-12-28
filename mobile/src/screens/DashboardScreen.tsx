// Better Together Mobile: Enhanced Dashboard Screen
import React, { useEffect, useState, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import { BlurView } from 'expo-blur'
import { useAuth } from '../hooks/useAuth'
import { apiClient } from '../api/client'
import { COLORS, SPACING, FONT_SIZES, GRADIENTS, GLASSMORPHISM, SHADOWS } from '../utils/constants'
import type { DashboardData } from '../types'

const { width } = Dimensions.get('window')

// Daily inspiration quotes
const DAILY_QUOTES = [
  { quote: "Love is not about how many days you've been together, it's about how much you love each other every day.", author: "Unknown" },
  { quote: "The best thing to hold onto in life is each other.", author: "Audrey Hepburn" },
  { quote: "In all the world, there is no heart for me like yours.", author: "Maya Angelou" },
  { quote: "Being deeply loved gives you strength, while loving deeply gives you courage.", author: "Lao Tzu" },
  { quote: "The greatest thing you'll ever learn is just to love and be loved in return.", author: "Nat King Cole" },
]

// Quick action items - Row 1
const QUICK_ACTIONS_ROW1 = [
  { id: 'checkin', icon: 'heart', label: 'Check-in', color: '#FF6B9D', route: 'Checkin' },
  { id: 'coach', icon: 'sparkles', label: 'AI Coach', color: '#9B6BFF', route: 'AICoach' },
  { id: 'goals', icon: 'flag', label: 'Goals', color: '#22c55e', route: 'Goals' },
  { id: 'analytics', icon: 'stats-chart', label: 'Insights', color: '#3b82f6', route: 'Analytics' },
]

// Quick action items - Row 2
const QUICK_ACTIONS_ROW2 = [
  { id: 'schedule', icon: 'calendar', label: 'Schedule', color: '#6BB5FF', route: 'Scheduling' },
  { id: 'challenges', icon: 'trophy', label: 'Challenges', color: '#FFB86B', route: 'Challenges' },
  { id: 'shop', icon: 'gift', label: 'Shop', color: '#ec4899', route: 'Shop' },
  { id: 'community', icon: 'people', label: 'Community', color: '#8b5cf6', route: 'Community' },
]

const DashboardScreen: React.FC<any> = ({ navigation }) => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [dailyQuote] = useState(() => DAILY_QUOTES[Math.floor(Math.random() * DAILY_QUOTES.length)])

  const loadDashboard = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await apiClient.getDashboard(user.id)

    if (data && !error) {
      setDashboardData(data)
    }

    setLoading(false)
    setRefreshing(false)
  }, [user])

  useEffect(() => {
    loadDashboard()
  }, [loadDashboard])

  const onRefresh = () => {
    setRefreshing(true)
    loadDashboard()
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Tomorrow'
    if (diffDays < 7) return `In ${diffDays} days`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
        style={styles.headerGradient}
      />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>{getGreeting()},</Text>
                <Text style={styles.userName}>{user?.name?.split(' ')[0] || 'Friend'}</Text>
              </View>
              <TouchableOpacity
                style={styles.profileButton}
                onPress={() => navigation.navigate('Profile')}
              >
                {user?.profile_photo_url ? (
                  <Image source={{ uri: user.profile_photo_url }} style={styles.profileImage} />
                ) : (
                  <LinearGradient
                    colors={['#FFB6C1', '#FF69B4']}
                    style={styles.profilePlaceholder}
                  >
                    <Text style={styles.profileInitial}>
                      {user?.name?.charAt(0).toUpperCase() || '?'}
                    </Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </View>

            {/* Daily Inspiration Card */}
            <BlurView intensity={20} style={styles.quoteCard}>
              <View style={styles.quoteContent}>
                <Ionicons name="heart" size={20} color="#FF6B9D" />
                <Text style={styles.quoteText}>"{dailyQuote.quote}"</Text>
                <Text style={styles.quoteAuthor}>— {dailyQuote.author}</Text>
              </View>
            </BlurView>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              {QUICK_ACTIONS_ROW1.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[styles.actionCard, GLASSMORPHISM.light, SHADOWS.card]}
                  onPress={() => navigation.navigate(action.route)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[styles.actionsGrid, { marginTop: SPACING.sm }]}>
              {QUICK_ACTIONS_ROW2.map((action) => (
                <TouchableOpacity
                  key={action.id}
                  style={[styles.actionCard, GLASSMORPHISM.light, SHADOWS.card]}
                  onPress={() => navigation.navigate(action.route)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                    <Ionicons name={action.icon as any} size={24} color={action.color} />
                  </View>
                  <Text style={styles.actionLabel}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {dashboardData ? (
            <>
              {/* Relationship Stats */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Relationship Overview</Text>
                <View style={[styles.statsCard, GLASSMORPHISM.light, SHADOWS.card]}>
                  <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                      <LinearGradient
                        colors={['#FF6B9D', '#FF8E53']}
                        style={styles.statCircle}
                      >
                        <Ionicons name="heart" size={24} color="#FFFFFF" />
                      </LinearGradient>
                      <Text style={styles.statValue}>
                        {dashboardData.relationship?.days_together || 0}
                      </Text>
                      <Text style={styles.statLabel}>Days Together</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <View style={styles.statItem}>
                      <LinearGradient
                        colors={['#9B6BFF', '#6B9BFF']}
                        style={styles.statCircle}
                      >
                        <Ionicons name="flame" size={24} color="#FFFFFF" />
                      </LinearGradient>
                      <Text style={styles.statValue}>
                        {dashboardData.checkin_streak || 0}
                      </Text>
                      <Text style={styles.statLabel}>Day Streak</Text>
                    </View>

                    <View style={styles.statDivider} />

                    <TouchableOpacity style={styles.statItem} onPress={() => navigation.navigate('Analytics')}>
                      <LinearGradient
                        colors={['#6BB5FF', '#6BFFB5']}
                        style={styles.statCircle}
                      >
                        <Ionicons name="pulse" size={24} color="#FFFFFF" />
                      </LinearGradient>
                      <Text style={styles.statValue}>
                        {dashboardData.analytics?.overall_health_score?.toFixed(0) || '—'}
                      </Text>
                      <Text style={styles.statLabel}>Health Score</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Active Goals */}
              {dashboardData.active_goals && dashboardData.active_goals.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Active Goals</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Goals')}>
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.goalsCard, GLASSMORPHISM.light, SHADOWS.card]}>
                    {dashboardData.active_goals.slice(0, 3).map((goal, index) => {
                      const progress = goal.target_count
                        ? (goal.current_progress / goal.target_count) * 100
                        : 0
                      return (
                        <View
                          key={goal.id}
                          style={[
                            styles.goalItem,
                            index < dashboardData.active_goals.slice(0, 3).length - 1 && styles.goalBorder
                          ]}
                        >
                          <View style={styles.goalHeader}>
                            <Text style={styles.goalName}>{goal.goal_name}</Text>
                            <Text style={styles.goalProgress}>
                              {goal.current_progress}/{goal.target_count}
                            </Text>
                          </View>
                          <View style={styles.progressBarBg}>
                            <LinearGradient
                              colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
                              start={{ x: 0, y: 0 }}
                              end={{ x: 1, y: 0 }}
                              style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]}
                            />
                          </View>
                        </View>
                      )
                    })}
                  </View>
                </View>
              )}

              {/* Upcoming Dates */}
              {dashboardData.upcoming_dates && dashboardData.upcoming_dates.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Upcoming Dates</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Scheduling')}>
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.datesScroll}
                  >
                    {dashboardData.upcoming_dates.slice(0, 5).map((date) => (
                      <TouchableOpacity
                        key={date.id}
                        style={[styles.dateCard, GLASSMORPHISM.light, SHADOWS.card]}
                        onPress={() => navigation.navigate('Scheduling')}
                        activeOpacity={0.8}
                      >
                        <View style={styles.dateIconWrapper}>
                          <Ionicons name="calendar" size={20} color={COLORS.primary} />
                        </View>
                        <Text style={styles.dateName} numberOfLines={2}>{date.event_name}</Text>
                        <Text style={styles.dateTime}>{formatDate(date.date_value)}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}

              {/* Recent Activities */}
              {dashboardData.recent_activities && dashboardData.recent_activities.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recent Activities</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Activities')}>
                      <Text style={styles.seeAllText}>See All</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.activitiesCard, GLASSMORPHISM.light, SHADOWS.card]}>
                    {dashboardData.recent_activities.slice(0, 3).map((activity, index) => (
                      <View
                        key={activity.id}
                        style={[
                          styles.activityItem,
                          index < dashboardData.recent_activities.slice(0, 3).length - 1 && styles.activityBorder
                        ]}
                      >
                        <View style={styles.activityIcon}>
                          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                        </View>
                        <View style={styles.activityContent}>
                          <Text style={styles.activityName}>{activity.activity_name}</Text>
                          <Text style={styles.activityDate}>
                            {activity.completed_date || activity.planned_date}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              )}
            </>
          ) : (
            /* Welcome Card for New Users */
            <View style={styles.section}>
              <View style={[styles.welcomeCard, GLASSMORPHISM.light, SHADOWS.card]}>
                <LinearGradient
                  colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
                  style={styles.welcomeGradient}
                >
                  <Ionicons name="heart" size={48} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.welcomeTitle}>Welcome to Better Together!</Text>
                <Text style={styles.welcomeText}>
                  Start your journey to a stronger relationship. Check in daily,
                  set goals, and grow together with your partner.
                </Text>
                <TouchableOpacity
                  style={styles.welcomeButton}
                  onPress={() => navigation.navigate('Checkin')}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.welcomeButtonGradient}
                  >
                    <Text style={styles.welcomeButtonText}>Start Your First Check-in</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Bottom Padding */}
          <View style={{ height: 100 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  safeArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: SPACING.xl,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.lg,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: FONT_SIZES.md,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  userName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 2,
  },
  profileButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profilePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  quoteCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  quoteContent: {
    padding: SPACING.md,
    alignItems: 'center',
  },
  quoteText: {
    fontSize: FONT_SIZES.md,
    color: '#FFFFFF',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: SPACING.sm,
    lineHeight: 22,
  },
  quoteAuthor: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: SPACING.sm,
  },
  quickActions: {
    paddingHorizontal: SPACING.lg,
    marginTop: -SPACING.md,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: (width - SPACING.lg * 2 - SPACING.sm * 3) / 4,
    padding: SPACING.sm,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  actionLabel: {
    fontSize: 11,
    color: COLORS.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginTop: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  seeAllText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },
  statsCard: {
    padding: SPACING.lg,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 60,
    backgroundColor: COLORS.border,
  },
  goalsCard: {
    padding: SPACING.md,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  goalItem: {
    paddingVertical: SPACING.md,
  },
  goalBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  goalName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '600',
    flex: 1,
  },
  goalProgress: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  datesScroll: {
    paddingRight: SPACING.lg,
  },
  dateCard: {
    width: 140,
    padding: SPACING.md,
    borderRadius: 16,
    marginRight: SPACING.sm,
    backgroundColor: '#FFFFFF',
  },
  dateIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  dateName: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  dateTime: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
    fontWeight: '500',
  },
  activitiesCard: {
    padding: SPACING.md,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityIcon: {
    marginRight: SPACING.md,
  },
  activityContent: {
    flex: 1,
  },
  activityName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    fontWeight: '500',
  },
  activityDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  welcomeCard: {
    padding: SPACING.xl,
    borderRadius: 24,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  welcomeGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: SPACING.lg,
  },
  welcomeButton: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  welcomeButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  welcomeButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: '#FFFFFF',
  },
})

export default DashboardScreen
