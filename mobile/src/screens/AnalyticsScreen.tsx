// Better Together Mobile: Analytics & Insights Dashboard
import React, { useState, useRef, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { BlurView } from 'expo-blur'
import { Feather } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native'
import { COLORS, SPACING, FONT_SIZES, GRADIENTS, SHADOWS } from '../utils/constants'

const { width } = Dimensions.get('window')
const CHART_WIDTH = width - SPACING.md * 4

type TimeRange = '7d' | '30d' | '90d'

interface MoodDataPoint {
  date: string
  mood: number
  connection: number
}

interface InsightCard {
  id: string
  type: 'positive' | 'suggestion' | 'milestone'
  emoji: string
  title: string
  description: string
}

// Demo data
const MOOD_DATA: MoodDataPoint[] = [
  { date: 'Mon', mood: 4, connection: 3 },
  { date: 'Tue', mood: 3, connection: 4 },
  { date: 'Wed', mood: 5, connection: 5 },
  { date: 'Thu', mood: 4, connection: 4 },
  { date: 'Fri', mood: 5, connection: 5 },
  { date: 'Sat', mood: 5, connection: 5 },
  { date: 'Sun', mood: 4, connection: 4 },
]

const INSIGHTS: InsightCard[] = [
  {
    id: '1',
    type: 'positive',
    emoji: '🌟',
    title: 'Great Week!',
    description: 'Your connection score improved by 15% this week. Keep up the great communication!',
  },
  {
    id: '2',
    type: 'suggestion',
    emoji: '💡',
    title: 'Try Something New',
    description: 'You haven\'t tried an adventure activity in a while. Plan something exciting together!',
  },
  {
    id: '3',
    type: 'milestone',
    emoji: '🏆',
    title: '10-Day Streak!',
    description: 'You\'ve completed daily check-ins for 10 days straight. Amazing consistency!',
  },
]

const StatCard = ({
  emoji,
  label,
  value,
  subvalue,
  color,
  trend,
}: {
  emoji: string
  label: string
  value: string
  subvalue?: string
  color: string
  trend?: 'up' | 'down' | 'neutral'
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current
  const opacityAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, delay: 100 }),
      Animated.timing(opacityAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start()
  }, [])

  return (
    <Animated.View style={[styles.statCard, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
      <BlurView intensity={80} tint="light" style={styles.statCardContent}>
        <View style={[styles.statEmojiBg, { backgroundColor: `${color}20` }]}>
          <Text style={styles.statEmoji}>{emoji}</Text>
        </View>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={styles.statValueRow}>
          <Text style={[styles.statValue, { color }]}>{value}</Text>
          {trend && (
            <Feather
              name={trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'minus'}
              size={14}
              color={trend === 'up' ? COLORS.success : trend === 'down' ? COLORS.error : COLORS.textSecondary}
            />
          )}
        </View>
        {subvalue && <Text style={styles.statSubvalue}>{subvalue}</Text>}
      </BlurView>
    </Animated.View>
  )
}

const MiniChart = ({ data, color }: { data: number[]; color: string }) => {
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const range = maxValue - minValue || 1

  return (
    <View style={styles.miniChart}>
      {data.map((value, index) => {
        const height = ((value - minValue) / range) * 30 + 10
        return (
          <View
            key={index}
            style={[
              styles.miniChartBar,
              {
                height,
                backgroundColor: color,
                opacity: 0.3 + (value / maxValue) * 0.7,
              },
            ]}
          />
        )
      })}
    </View>
  )
}

const MoodChart = ({ data, timeRange }: { data: MoodDataPoint[]; timeRange: TimeRange }) => {
  const animProgress = useRef(new Animated.Value(0)).current

  useEffect(() => {
    animProgress.setValue(0)
    Animated.timing(animProgress, {
      toValue: 1,
      duration: 800,
      useNativeDriver: false,
    }).start()
  }, [timeRange])

  const chartHeight = 120
  const barWidth = CHART_WIDTH / data.length - 8

  return (
    <View style={styles.chartContainer}>
      <View style={styles.chartHeader}>
        <Text style={styles.chartTitle}>Mood & Connection</Text>
        <View style={styles.chartLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.primary }]} />
            <Text style={styles.legendText}>Mood</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.primaryPurple }]} />
            <Text style={styles.legendText}>Connection</Text>
          </View>
        </View>
      </View>

      <View style={[styles.chart, { height: chartHeight }]}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={styles.yAxisLabel}>5</Text>
          <Text style={styles.yAxisLabel}>3</Text>
          <Text style={styles.yAxisLabel}>1</Text>
        </View>

        {/* Chart bars */}
        <View style={styles.chartBars}>
          {data.map((point, index) => (
            <View key={index} style={[styles.barGroup, { width: barWidth }]}>
              <View style={styles.barsContainer}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: animProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, (point.mood / 5) * (chartHeight - 20)],
                      }),
                      backgroundColor: COLORS.primary,
                    },
                  ]}
                />
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      height: animProgress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, (point.connection / 5) * (chartHeight - 20)],
                      }),
                      backgroundColor: COLORS.primaryPurple,
                    },
                  ]}
                />
              </View>
              <Text style={styles.xAxisLabel}>{point.date}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const InsightCardComponent = ({ insight }: { insight: InsightCard }) => {
  const bgColor =
    insight.type === 'positive' ? '#dcfce7' :
    insight.type === 'suggestion' ? '#fef3c7' :
    '#ede9fe'

  const borderColor =
    insight.type === 'positive' ? '#22c55e' :
    insight.type === 'suggestion' ? '#f59e0b' :
    '#8b5cf6'

  return (
    <View style={[styles.insightCard, { backgroundColor: bgColor, borderColor }]}>
      <Text style={styles.insightEmoji}>{insight.emoji}</Text>
      <View style={styles.insightContent}>
        <Text style={styles.insightTitle}>{insight.title}</Text>
        <Text style={styles.insightDescription}>{insight.description}</Text>
      </View>
    </View>
  )
}

const AnalyticsScreen: React.FC = () => {
  const navigation = useNavigation()
  const [timeRange, setTimeRange] = useState<TimeRange>('7d')

  const timeRanges: { id: TimeRange; label: string }[] = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' },
  ]

  return (
    <LinearGradient colors={['#fdf2f8', '#f5f3ff', '#eff6ff']} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color={COLORS.gray800} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Insights & Analytics</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Time Range Selector */}
          <View style={styles.timeRangeContainer}>
            {timeRanges.map(range => (
              <TouchableOpacity
                key={range.id}
                onPress={() => setTimeRange(range.id)}
                style={[styles.timeRangeButton, timeRange === range.id && styles.timeRangeButtonActive]}
              >
                <Text style={[styles.timeRangeText, timeRange === range.id && styles.timeRangeTextActive]}>
                  {range.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Overview Stats */}
          <View style={styles.statsGrid}>
            <StatCard
              emoji="💕"
              label="Relationship Health"
              value="85%"
              subvalue="+5% this week"
              color={COLORS.primary}
              trend="up"
            />
            <StatCard
              emoji="🔥"
              label="Check-in Streak"
              value="10"
              subvalue="days"
              color="#f97316"
              trend="up"
            />
            <StatCard
              emoji="📊"
              label="Avg Mood"
              value="4.2"
              subvalue="out of 5"
              color="#22c55e"
              trend="up"
            />
            <StatCard
              emoji="🎯"
              label="Goals Progress"
              value="67%"
              subvalue="3 active"
              color="#8b5cf6"
              trend="neutral"
            />
          </View>

          {/* Mood Chart */}
          <View style={styles.section}>
            <BlurView intensity={80} tint="light" style={styles.chartCard}>
              <MoodChart data={MOOD_DATA} timeRange={timeRange} />
            </BlurView>
          </View>

          {/* Activity Summary */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Activity Summary</Text>
            <BlurView intensity={80} tint="light" style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryEmoji}>📅</Text>
                  <View>
                    <Text style={styles.summaryValue}>8</Text>
                    <Text style={styles.summaryLabel}>Date Nights</Text>
                  </View>
                  <MiniChart data={[3, 5, 4, 6, 5, 7, 8]} color={COLORS.primary} />
                </View>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryEmoji}>💬</Text>
                  <View>
                    <Text style={styles.summaryValue}>24</Text>
                    <Text style={styles.summaryLabel}>Conversations</Text>
                  </View>
                  <MiniChart data={[10, 12, 15, 18, 20, 22, 24]} color={COLORS.primaryBlue} />
                </View>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <View style={styles.summaryItem}>
                  <Text style={styles.summaryEmoji}>✅</Text>
                  <View>
                    <Text style={styles.summaryValue}>15</Text>
                    <Text style={styles.summaryLabel}>Challenges Done</Text>
                  </View>
                  <MiniChart data={[5, 7, 9, 10, 12, 14, 15]} color={COLORS.success} />
                </View>
              </View>
            </BlurView>
          </View>

          {/* AI Insights */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI Insights</Text>
              <LinearGradient colors={GRADIENTS.primary} style={styles.aiBadge}>
                <Text style={styles.aiBadgeText}>✨ AI</Text>
              </LinearGradient>
            </View>
            {INSIGHTS.map(insight => (
              <InsightCardComponent key={insight.id} insight={insight} />
            ))}
          </View>

          {/* Love Language Compatibility */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Love Language Match</Text>
            <BlurView intensity={80} tint="light" style={styles.compatibilityCard}>
              <View style={styles.compatibilityHeader}>
                <View style={styles.compatibilityPartner}>
                  <LinearGradient colors={GRADIENTS.pink} style={styles.partnerAvatar}>
                    <Text style={styles.partnerAvatarText}>You</Text>
                  </LinearGradient>
                  <Text style={styles.partnerLanguage}>Quality Time</Text>
                </View>
                <View style={styles.compatibilityCenter}>
                  <Text style={styles.compatibilityScore}>78%</Text>
                  <Text style={styles.compatibilityLabel}>Match</Text>
                </View>
                <View style={styles.compatibilityPartner}>
                  <LinearGradient colors={GRADIENTS.purple} style={styles.partnerAvatar}>
                    <Text style={styles.partnerAvatarText}>💕</Text>
                  </LinearGradient>
                  <Text style={styles.partnerLanguage}>Words of Affirmation</Text>
                </View>
              </View>
              <Text style={styles.compatibilityTip}>
                💡 Tip: Express appreciation verbally while spending quality time together!
              </Text>
            </BlurView>
          </View>

          <View style={styles.bottomSpacer} />
        </ScrollView>
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
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  timeRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    marginVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  timeRangeButton: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.1)',
  },
  timeRangeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  timeRangeText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.gray800,
  },
  timeRangeTextActive: {
    color: 'white',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginTop: SPACING.sm,
  },
  statCard: {
    width: (width - SPACING.md * 2 - SPACING.sm) / 2,
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  statCardContent: {
    padding: SPACING.md,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  statEmojiBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  statEmoji: {
    fontSize: 20,
  },
  statLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
  },
  statSubvalue: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.gray800,
    marginBottom: SPACING.md,
  },
  aiBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: SPACING.md,
  },
  aiBadgeText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: '600',
    color: 'white',
  },
  chartCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...SHADOWS.card,
  },
  chartContainer: {
    padding: SPACING.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  chartTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray800,
  },
  chartLegend: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  chart: {
    flexDirection: 'row',
  },
  yAxis: {
    width: 20,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  yAxisLabel: {
    fontSize: 10,
    color: COLORS.textLight,
  },
  chartBars: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    paddingBottom: 20,
  },
  barGroup: {
    alignItems: 'center',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
  },
  bar: {
    width: 12,
    borderRadius: 6,
  },
  xAxisLabel: {
    fontSize: 10,
    color: COLORS.textLight,
    marginTop: 4,
    position: 'absolute',
    bottom: 0,
  },
  summaryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...SHADOWS.card,
  },
  summaryRow: {
    padding: SPACING.md,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  summaryEmoji: {
    fontSize: 28,
  },
  summaryValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '700',
    color: COLORS.gray800,
  },
  summaryLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    marginHorizontal: SPACING.md,
  },
  miniChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 3,
    marginLeft: 'auto',
  },
  miniChartBar: {
    width: 6,
    borderRadius: 3,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
  },
  insightEmoji: {
    fontSize: 28,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: 4,
  },
  insightDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  compatibilityCard: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: SPACING.md,
    ...SHADOWS.card,
  },
  compatibilityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  compatibilityPartner: {
    alignItems: 'center',
    flex: 1,
  },
  partnerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  partnerAvatarText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  partnerLanguage: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  compatibilityCenter: {
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
  },
  compatibilityScore: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.primary,
  },
  compatibilityLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
  },
  compatibilityTip: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.gray800,
    backgroundColor: 'rgba(236, 72, 153, 0.1)',
    padding: SPACING.md,
    borderRadius: 12,
    lineHeight: 20,
  },
  bottomSpacer: {
    height: SPACING.xxl,
  },
})

export default AnalyticsScreen
