// Better Together Mobile: Smart Scheduling Screen
import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth'
import { apiClient } from '../api/client'
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants'
import type { Activity, ImportantDate } from '../types'

const SchedulingScreen: React.FC = () => {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [upcomingDates, setUpcomingDates] = useState<ImportantDate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadScheduledItems()
  }, [user])

  const loadScheduledItems = async () => {
    if (!user) return

    const relationshipResponse = await apiClient.getRelationship(user.id)

    if (relationshipResponse.data?.relationship) {
      const relationshipId = relationshipResponse.data.relationship.id

      const [activitiesRes, datesRes] = await Promise.all([
        apiClient.getActivities(relationshipId),
        apiClient.getImportantDates(relationshipId),
      ])

      const activitiesData = activitiesRes.data as { activities?: Activity[] } | undefined
      if (activitiesData?.activities) {
        setActivities(
          activitiesData.activities.filter(
            (a: Activity) => a.status === 'planned'
          )
        )
      }

      const datesData = datesRes.data as { dates?: ImportantDate[] } | undefined
      if (datesData?.dates) {
        setUpcomingDates(datesData.dates)
      }
    }

    setLoading(false)
  }

  const handleScheduleActivity = () => {
    Alert.alert(
      'Schedule Activity',
      'Activity scheduling form coming soon!',
      [{ text: 'OK' }]
    )
  }

  const handleAddImportantDate = () => {
    Alert.alert(
      'Add Important Date',
      'Important date form coming soon!',
      [{ text: 'OK' }]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Smart Scheduling</Text>
        <Text style={styles.headerSubtitle}>
          Plan activities and track important dates
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Planned Activities */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Planned Activities</Text>
            <Button
              title="+ Add"
              onPress={handleScheduleActivity}
              size="small"
            />
          </View>

          {activities.length > 0 ? (
            activities.map((activity) => (
              <TouchableOpacity key={activity.id} style={styles.activityItem}>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityName}>
                    {activity.activity_name}
                  </Text>
                  <Text style={styles.activityType}>
                    {activity.activity_type.replace('_', ' ')}
                  </Text>
                  {activity.location && (
                    <Text style={styles.activityLocation}>
                      📍 {activity.location}
                    </Text>
                  )}
                </View>
                <View style={styles.activityDate}>
                  <Text style={styles.dateText}>
                    {activity.planned_date
                      ? new Date(activity.planned_date).toLocaleDateString()
                      : 'TBD'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>
              No planned activities yet. Start planning your next adventure!
            </Text>
          )}
        </Card>

        {/* Important Dates */}
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Important Dates</Text>
            <Button
              title="+ Add"
              onPress={handleAddImportantDate}
              size="small"
            />
          </View>

          {upcomingDates.length > 0 ? (
            upcomingDates.map((date) => (
              <View key={date.id} style={styles.dateItem}>
                <View style={styles.dateInfo}>
                  <Text style={styles.dateEventName}>{date.event_name}</Text>
                  <Text style={styles.dateEventType}>
                    {date.event_type.replace('_', ' ')}
                  </Text>
                </View>
                <View style={styles.dateValue}>
                  <Text style={styles.dateText}>
                    {new Date(date.date_value).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>
              No important dates added yet. Add anniversaries, birthdays, and special events!
            </Text>
          )}
        </Card>

        {/* AI Suggestions */}
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>AI Suggestions</Text>
          <Text style={styles.suggestionText}>
            Based on your schedule and preferences, here are some ideas:
          </Text>

          <View style={styles.suggestionItem}>
            <Text style={styles.suggestionEmoji}>🍽️</Text>
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionTitle}>
                Date Night This Friday
              </Text>
              <Text style={styles.suggestionDescription}>
                Try that new Italian restaurant you both wanted to visit
              </Text>
            </View>
          </View>

          <View style={styles.suggestionItem}>
            <Text style={styles.suggestionEmoji}>🏞️</Text>
            <View style={styles.suggestionContent}>
              <Text style={styles.suggestionTitle}>
                Weekend Hike
              </Text>
              <Text style={styles.suggestionDescription}>
                Weather looks perfect for outdoor activities this Saturday
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  header: {
    padding: SPACING.lg,
    backgroundColor: COLORS.background,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: SPACING.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  activityInfo: {
    flex: 1,
  },
  activityName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  activityType: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textTransform: 'capitalize',
  },
  activityLocation: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  activityDate: {
    justifyContent: 'center',
  },
  dateItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  dateInfo: {
    flex: 1,
  },
  dateEventName: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  dateEventType: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
    textTransform: 'capitalize',
  },
  dateValue: {
    justifyContent: 'center',
  },
  dateText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  emptyText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    paddingVertical: SPACING.lg,
    lineHeight: 22,
  },
  suggestionText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  suggestionItem: {
    flexDirection: 'row',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  suggestionEmoji: {
    fontSize: FONT_SIZES.xl,
    marginRight: SPACING.md,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  suggestionDescription: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
})

export default SchedulingScreen
