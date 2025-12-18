// Better Together Mobile: Dashboard Screen
import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from 'react-native'
import { Card } from '../components/Card'
import { useAuth } from '../hooks/useAuth'
import { apiClient } from '../api/client'
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants'
import type { DashboardData } from '../types'

const DashboardScreen: React.FC = () => {
  const { user } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const loadDashboard = async () => {
    if (!user) return

    const { data, error } = await apiClient.getDashboard(user.id)

    if (data && !error) {
      setDashboardData(data)
    }

    setLoading(false)
    setRefreshing(false)
  }

  useEffect(() => {
    loadDashboard()
  }, [user])

  const onRefresh = () => {
    setRefreshing(true)
    loadDashboard()
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name}!</Text>
          <Text style={styles.subtitle}>How's your relationship today?</Text>
        </View>

        {dashboardData ? (
          <>
            {/* Relationship Overview */}
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Your Relationship</Text>
              <View style={styles.statRow}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {dashboardData.relationship.days_together}
                  </Text>
                  <Text style={styles.statLabel}>Days Together</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {dashboardData.checkin_streak}
                  </Text>
                  <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {dashboardData.analytics.overall_health_score?.toFixed(0) || 'N/A'}
                  </Text>
                  <Text style={styles.statLabel}>Health Score</Text>
                </View>
              </View>
            </Card>

            {/* Active Goals */}
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Active Goals</Text>
              {dashboardData.active_goals.length > 0 ? (
                dashboardData.active_goals.slice(0, 3).map((goal) => (
                  <View key={goal.id} style={styles.goalItem}>
                    <Text style={styles.goalName}>{goal.goal_name}</Text>
                    <View style={styles.progressBar}>
                      <View
                        style={[
                          styles.progressFill,
                          {
                            width: `${
                              goal.target_count
                                ? (goal.current_progress / goal.target_count) * 100
                                : 0
                            }%`,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.progressText}>
                      {goal.current_progress} / {goal.target_count || '?'}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No active goals yet</Text>
              )}
            </Card>

            {/* Upcoming Dates */}
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Upcoming Dates</Text>
              {dashboardData.upcoming_dates.length > 0 ? (
                dashboardData.upcoming_dates.slice(0, 3).map((date) => (
                  <View key={date.id} style={styles.dateItem}>
                    <Text style={styles.dateName}>{date.event_name}</Text>
                    <Text style={styles.dateValue}>{date.date_value}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No upcoming dates</Text>
              )}
            </Card>

            {/* Recent Activities */}
            <Card style={styles.card}>
              <Text style={styles.cardTitle}>Recent Activities</Text>
              {dashboardData.recent_activities.length > 0 ? (
                dashboardData.recent_activities.slice(0, 3).map((activity) => (
                  <View key={activity.id} style={styles.activityItem}>
                    <Text style={styles.activityName}>{activity.activity_name}</Text>
                    <Text style={styles.activityDate}>
                      {activity.completed_date || activity.planned_date}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No recent activities</Text>
              )}
            </Card>
          </>
        ) : (
          <Card style={styles.card}>
            <Text style={styles.emptyText}>
              Welcome! Set up your relationship to get started.
            </Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  greeting: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  card: {
    margin: SPACING.md,
    marginTop: 0,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  goalItem: {
    marginBottom: SPACING.md,
  },
  goalName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    marginBottom: SPACING.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  progressText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  dateName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  dateValue: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  activityName: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  activityDate: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
  },
})

export default DashboardScreen
