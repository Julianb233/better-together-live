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
  Modal,
  Switch,
} from 'react-native'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useAuth } from '../hooks/useAuth'
import { apiClient } from '../api/client'
import { COLORS, SPACING, FONT_SIZES, ACTIVITY_TYPES, BORDER_RADIUS } from '../utils/constants'
import type { Activity, ImportantDate } from '../types'

const EVENT_TYPES = [
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'milestone', label: 'Milestone' },
  { value: 'birthday', label: 'Birthday' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'custom', label: 'Custom' },
] as const

const SchedulingScreen: React.FC = () => {
  const { user } = useAuth()
  const [activities, setActivities] = useState<Activity[]>([])
  const [upcomingDates, setUpcomingDates] = useState<ImportantDate[]>([])
  const [loading, setLoading] = useState(true)

  // Activity Form State
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [activityName, setActivityName] = useState('')
  const [activityType, setActivityType] = useState<string>('date_night')
  const [activityDate, setActivityDate] = useState('')
  const [activityLocation, setActivityLocation] = useState('')
  const [activityNotes, setActivityNotes] = useState('')
  const [savingActivity, setSavingActivity] = useState(false)

  // Important Date Form State
  const [showDateModal, setShowDateModal] = useState(false)
  const [eventName, setEventName] = useState('')
  const [eventType, setEventType] = useState<string>('anniversary')
  const [eventDate, setEventDate] = useState('')
  const [eventReminder, setEventReminder] = useState(true)
  const [savingDate, setSavingDate] = useState(false)

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

  const resetActivityForm = () => {
    setActivityName('')
    setActivityType('date_night')
    setActivityDate('')
    setActivityLocation('')
    setActivityNotes('')
  }

  const resetDateForm = () => {
    setEventName('')
    setEventType('anniversary')
    setEventDate('')
    setEventReminder(true)
  }

  const handleScheduleActivity = () => {
    resetActivityForm()
    setShowActivityModal(true)
  }

  const handleAddImportantDate = () => {
    resetDateForm()
    setShowDateModal(true)
  }

  const handleSaveActivity = async () => {
    if (!activityName.trim()) {
      Alert.alert('Error', 'Please enter an activity name')
      return
    }

    if (!activityDate.trim()) {
      Alert.alert('Error', 'Please enter a date (YYYY-MM-DD format)')
      return
    }

    setSavingActivity(true)

    try {
      const relationshipResponse = await apiClient.getRelationship(user!.id)

      if (!relationshipResponse.data?.relationship) {
        Alert.alert('Error', 'No relationship found')
        setSavingActivity(false)
        return
      }

      const relationshipId = relationshipResponse.data.relationship.id

      await apiClient.createActivity({
        relationship_id: relationshipId,
        activity_name: activityName,
        activity_type: activityType as any,
        planned_date: activityDate,
        location: activityLocation || undefined,
        description: activityNotes || undefined,
      })

      Alert.alert('Success', 'Activity scheduled successfully!')
      setShowActivityModal(false)
      resetActivityForm()
      await loadScheduledItems()
    } catch (error) {
      console.error('Failed to create activity:', error)
      Alert.alert('Error', 'Failed to schedule activity. Please try again.')
    } finally {
      setSavingActivity(false)
    }
  }

  const handleSaveImportantDate = async () => {
    if (!eventName.trim()) {
      Alert.alert('Error', 'Please enter an event name')
      return
    }

    if (!eventDate.trim()) {
      Alert.alert('Error', 'Please enter a date (YYYY-MM-DD format)')
      return
    }

    setSavingDate(true)

    try {
      const relationshipResponse = await apiClient.getRelationship(user!.id)

      if (!relationshipResponse.data?.relationship) {
        Alert.alert('Error', 'No relationship found')
        setSavingDate(false)
        return
      }

      const relationshipId = relationshipResponse.data.relationship.id

      await apiClient.createImportantDate({
        relationship_id: relationshipId,
        date_value: eventDate,
        event_name: eventName,
        event_type: eventType as any,
        is_recurring: false,
      })

      Alert.alert('Success', 'Important date added successfully!')
      setShowDateModal(false)
      resetDateForm()
      await loadScheduledItems()
    } catch (error) {
      console.error('Failed to create important date:', error)
      Alert.alert('Error', 'Failed to add important date. Please try again.')
    } finally {
      setSavingDate(false)
    }
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

      {/* Activity Form Modal */}
      <Modal
        visible={showActivityModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowActivityModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Activity</Text>
              <TouchableOpacity
                onPress={() => setShowActivityModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Input
                label="Activity Name *"
                placeholder="e.g., Dinner at Italian Restaurant"
                value={activityName}
                onChangeText={setActivityName}
              />

              <View style={styles.formGroup}>
                <Text style={styles.label}>Activity Type *</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.typeSelector}
                >
                  {ACTIVITY_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.typeOption,
                        activityType === type.value && styles.typeOptionSelected,
                      ]}
                      onPress={() => setActivityType(type.value)}
                    >
                      <Text style={styles.typeIcon}>{type.icon}</Text>
                      <Text
                        style={[
                          styles.typeLabel,
                          activityType === type.value && styles.typeLabelSelected,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              <Input
                label="Date * (YYYY-MM-DD)"
                placeholder="2024-12-31"
                value={activityDate}
                onChangeText={setActivityDate}
              />

              <Input
                label="Location"
                placeholder="Restaurant name or address"
                value={activityLocation}
                onChangeText={setActivityLocation}
              />

              <Input
                label="Notes"
                placeholder="Any additional details..."
                value={activityNotes}
                onChangeText={setActivityNotes}
                multiline
                numberOfLines={3}
              />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setShowActivityModal(false)}
                variant="outline"
                style={styles.footerButton}
              />
              <Button
                title={savingActivity ? 'Saving...' : 'Save Activity'}
                onPress={handleSaveActivity}
                disabled={savingActivity}
                style={styles.footerButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Important Date Form Modal */}
      <Modal
        visible={showDateModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Important Date</Text>
              <TouchableOpacity
                onPress={() => setShowDateModal(false)}
                style={styles.closeButton}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalForm}>
              <Input
                label="Event Name *"
                placeholder="e.g., Our Anniversary"
                value={eventName}
                onChangeText={setEventName}
              />

              <View style={styles.formGroup}>
                <Text style={styles.label}>Event Type *</Text>
                <View style={styles.eventTypeGrid}>
                  {EVENT_TYPES.map((type) => (
                    <TouchableOpacity
                      key={type.value}
                      style={[
                        styles.eventTypeOption,
                        eventType === type.value && styles.eventTypeOptionSelected,
                      ]}
                      onPress={() => setEventType(type.value)}
                    >
                      <Text
                        style={[
                          styles.eventTypeLabel,
                          eventType === type.value && styles.eventTypeLabelSelected,
                        ]}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <Input
                label="Date * (YYYY-MM-DD)"
                placeholder="2024-12-31"
                value={eventDate}
                onChangeText={setEventDate}
              />

              <View style={styles.formGroup}>
                <View style={styles.switchRow}>
                  <Text style={styles.label}>Enable Reminder</Text>
                  <Switch
                    value={eventReminder}
                    onValueChange={setEventReminder}
                    trackColor={{ false: COLORS.border, true: COLORS.primary }}
                    thumbColor={COLORS.background}
                  />
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <Button
                title="Cancel"
                onPress={() => setShowDateModal(false)}
                variant="outline"
                style={styles.footerButton}
              />
              <Button
                title={savingDate ? 'Saving...' : 'Save Date'}
                onPress={handleSaveImportantDate}
                disabled={savingDate}
                style={styles.footerButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.background,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    maxHeight: '90%',
    paddingBottom: SPACING.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.round,
    backgroundColor: COLORS.surface,
  },
  closeButtonText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    fontWeight: 'bold',
  },
  modalForm: {
    padding: SPACING.lg,
  },
  formGroup: {
    marginBottom: SPACING.md,
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    fontWeight: '500',
  },
  typeSelector: {
    marginTop: SPACING.xs,
  },
  typeOption: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    marginRight: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    alignItems: 'center',
    minWidth: 80,
  },
  typeOptionSelected: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  typeIcon: {
    fontSize: FONT_SIZES.xl,
    marginBottom: SPACING.xs,
  },
  typeLabel: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  typeLabelSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  eventTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  eventTypeOption: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.border,
    minWidth: '30%',
    alignItems: 'center',
  },
  eventTypeOptionSelected: {
    backgroundColor: COLORS.primary + '15',
    borderColor: COLORS.primary,
  },
  eventTypeLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  eventTypeLabelSelected: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: SPACING.lg,
    gap: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  footerButton: {
    flex: 1,
  },
})

export default SchedulingScreen
