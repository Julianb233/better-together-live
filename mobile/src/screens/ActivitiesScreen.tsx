// Better Together Mobile: Activities Screen
import React, { useState, useEffect, useCallback } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { Ionicons } from '@expo/vector-icons'
import {
  COLORS,
  SPACING,
  FONT_SIZES,
  FONT_WEIGHTS,
  BORDER_RADIUS,
  SHADOWS,
  GLASSMORPHISM,
  GRADIENTS,
  ACTIVITY_TYPES,
  ACTIVITY_STATUS,
} from '../utils/constants'
import apiClient from '../api/client'
import type { Activity, Relationship } from '../types'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - SPACING.lg * 3) / 2

type FilterType = 'all' | 'date_night' | 'quality_time' | 'adventure'

const ActivitiesScreen: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([])
  const [completedActivities, setCompletedActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all')
  const [showCompleted, setShowCompleted] = useState(false)
  const [relationshipId, setRelationshipId] = useState<string | null>(null)
  const [fabAnimation] = useState(new Animated.Value(0))

  // Fetch activities
  const fetchActivities = useCallback(async () => {
    try {
      const userId = await apiClient.getUserId()
      if (!userId) {
        Alert.alert('Error', 'User not found. Please log in again.')
        return
      }

      // Get relationship
      const relationshipResponse = await apiClient.getRelationship(userId)
      if (relationshipResponse.error || !relationshipResponse.data?.relationship) {
        setActivities([])
        setFilteredActivities([])
        setCompletedActivities([])
        return
      }

      const relationship = relationshipResponse.data.relationship as Relationship
      setRelationshipId(relationship.id)

      // Get activities
      const activitiesResponse = await apiClient.getActivities(relationship.id)
      if (activitiesResponse.error) {
        throw new Error(activitiesResponse.error.message || 'Failed to fetch activities')
      }

      const fetchedActivities = (activitiesResponse.data as any)?.activities || []

      // Separate completed and planned activities
      const completed = fetchedActivities.filter((a: Activity) => a.status === 'completed')
      const planned = fetchedActivities.filter((a: Activity) => a.status !== 'completed')

      setActivities(planned)
      setFilteredActivities(planned)
      setCompletedActivities(completed)
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to load activities')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchActivities()

    // Animate FAB on mount
    Animated.spring(fabAnimation, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start()
  }, [fetchActivities, fabAnimation])

  // Filter activities
  useEffect(() => {
    if (selectedFilter === 'all') {
      setFilteredActivities(activities)
    } else {
      setFilteredActivities(
        activities.filter((activity) => activity.activity_type === selectedFilter)
      )
    }
  }, [selectedFilter, activities])

  const onRefresh = useCallback(() => {
    setIsRefreshing(true)
    fetchActivities()
  }, [fetchActivities])

  const handleFilterPress = (filter: FilterType) => {
    setSelectedFilter(filter)
  }

  const handleActivityPress = (activity: Activity) => {
    Alert.alert(
      activity.activity_name,
      activity.description || 'No description available',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Mark Complete',
          onPress: () => handleCompleteActivity(activity.id),
        },
      ]
    )
  }

  const handleCompleteActivity = async (activityId: string) => {
    try {
      const response = await apiClient.completeActivity(activityId, {
        completed_date: new Date().toISOString(),
        satisfaction_rating_user1: 5,
      })

      if (response.error) {
        throw new Error(response.error.message || 'Failed to complete activity')
      }

      Alert.alert('Success', 'Activity marked as complete!')
      fetchActivities()
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to complete activity')
    }
  }

  const handleAddActivity = () => {
    Alert.alert(
      'Add Activity',
      'Activity creation form coming soon!',
      [{ text: 'OK' }]
    )
  }

  const getActivityIcon = (type: string) => {
    const activityType = ACTIVITY_TYPES.find((t) => t.value === type)
    return activityType?.icon || '✨'
  }

  const renderFilterTab = (filter: FilterType, label: string, icon: string) => {
    const isActive = selectedFilter === filter
    return (
      <TouchableOpacity
        key={filter}
        style={[styles.filterTab, isActive && styles.filterTabActive]}
        onPress={() => handleFilterPress(filter)}
        activeOpacity={0.7}
      >
        <Text style={styles.filterIcon}>{icon}</Text>
        <Text style={[styles.filterText, isActive && styles.filterTextActive]}>
          {label}
        </Text>
      </TouchableOpacity>
    )
  }

  const renderActivityCard = ({ item }: { item: Activity }) => {
    const activityIcon = getActivityIcon(item.activity_type)
    const plannedDate = item.planned_date ? new Date(item.planned_date) : null

    return (
      <TouchableOpacity
        style={styles.activityCard}
        onPress={() => handleActivityPress(item)}
        activeOpacity={0.8}
      >
        <View style={[styles.cardGlass, GLASSMORPHISM.light, SHADOWS.card]}>
          {/* Icon */}
          <View style={styles.cardIconContainer}>
            <Text style={styles.cardIcon}>{activityIcon}</Text>
          </View>

          {/* Content */}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={2}>
              {item.activity_name}
            </Text>

            {item.location && (
              <View style={styles.cardMeta}>
                <Ionicons name="location-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.cardMetaText} numberOfLines={1}>
                  {item.location}
                </Text>
              </View>
            )}

            {plannedDate && (
              <View style={styles.cardMeta}>
                <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
                <Text style={styles.cardMetaText}>
                  {plannedDate.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            )}
          </View>

          {/* Status Badge */}
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: ACTIVITY_STATUS.find((s) => s.value === item.status)?.color || COLORS.primary },
            ]}
          >
            <Text style={styles.statusText}>
              {ACTIVITY_STATUS.find((s) => s.value === item.status)?.label || 'Planned'}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderCompletedSection = () => {
    if (completedActivities.length === 0) return null

    return (
      <View style={styles.completedSection}>
        <TouchableOpacity
          style={styles.completedHeader}
          onPress={() => setShowCompleted(!showCompleted)}
          activeOpacity={0.7}
        >
          <Text style={styles.completedTitle}>
            Completed ({completedActivities.length})
          </Text>
          <Ionicons
            name={showCompleted ? 'chevron-up' : 'chevron-down'}
            size={20}
            color={COLORS.textSecondary}
          />
        </TouchableOpacity>

        {showCompleted && (
          <FlatList
            data={completedActivities}
            renderItem={renderActivityCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            scrollEnabled={false}
          />
        )}
      </View>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Text style={styles.emptyIcon}>❤️</Text>
      <Text style={styles.emptyTitle}>No Activities Yet</Text>
      <Text style={styles.emptyDescription}>
        Start planning activities to create memorable moments together!
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={handleAddActivity}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.emptyButtonGradient}
        >
          <Text style={styles.emptyButtonText}>Get Started</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  )

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading activities...</Text>
        </View>
      )
    }

    if (filteredActivities.length === 0 && selectedFilter === 'all') {
      return renderEmptyState()
    }

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {filteredActivities.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsIcon}>🔍</Text>
            <Text style={styles.noResultsText}>
              No {selectedFilter.replace('_', ' ')} activities found
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredActivities}
            renderItem={renderActivityCard}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            scrollEnabled={false}
          />
        )}

        {renderCompletedSection()}
      </ScrollView>
    )
  }

  const fabScale = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  })

  const fabRotate = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  })

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Gradient */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryPurple] as readonly [string, string, ...string[]]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Activities</Text>
        <Text style={styles.headerSubtitle}>
          Plan and track your memorable moments
        </Text>
      </LinearGradient>

      {/* Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {renderFilterTab('all', 'All', '✨')}
        {renderFilterTab('date_night', 'Date Night', '🌃')}
        {renderFilterTab('quality_time', 'Quality Time', '⏰')}
        {renderFilterTab('adventure', 'Adventure', '🏔️')}
      </ScrollView>

      {/* Content */}
      {renderContent()}

      {/* Floating Action Button */}
      <Animated.View
        style={[
          styles.fab,
          {
            transform: [{ scale: fabScale }, { rotate: fabRotate }],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.fabTouchable}
          onPress={handleAddActivity}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={GRADIENTS.primary as readonly [string, string, ...string[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.fabGradient}
          >
            <Ionicons name="add" size={28} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
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
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  headerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: FONT_WEIGHTS.bold,
    color: '#FFFFFF',
    marginBottom: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONT_SIZES.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: FONT_WEIGHTS.medium,
  },
  filterContainer: {
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  filterContent: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.sm,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.large,
    backgroundColor: COLORS.gray100,
    marginRight: SPACING.sm,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterIcon: {
    fontSize: FONT_SIZES.md,
    marginRight: SPACING.xs,
  },
  filterText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: FONT_WEIGHTS.medium,
    color: COLORS.textSecondary,
  },
  filterTextActive: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    paddingBottom: SPACING.xxl + 60, // Space for FAB
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  activityCard: {
    width: CARD_WIDTH,
    marginBottom: SPACING.md,
  },
  cardGlass: {
    padding: SPACING.md,
    minHeight: 180,
  },
  cardIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  cardIcon: {
    fontSize: 24,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
  },
  cardMetaText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.textSecondary,
    marginLeft: SPACING.xs,
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.small,
    marginTop: SPACING.sm,
  },
  statusText: {
    fontSize: FONT_SIZES.xs,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#FFFFFF',
  },
  completedSection: {
    marginTop: SPACING.xl,
  },
  completedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    marginBottom: SPACING.md,
  },
  completedTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.semibold,
    color: COLORS.text,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xxl * 2,
  },
  emptyIcon: {
    fontSize: 80,
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: FONT_WEIGHTS.bold,
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  emptyDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    lineHeight: 22,
  },
  emptyButton: {
    borderRadius: BORDER_RADIUS.large,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  emptyButtonGradient: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  emptyButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: FONT_WEIGHTS.semibold,
    color: '#FFFFFF',
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  noResultsIcon: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  noResultsText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.xxl * 2,
  },
  loadingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.lg,
    zIndex: 1000,
  },
  fabTouchable: {
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    ...SHADOWS.heavy,
  },
  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: BORDER_RADIUS.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ActivitiesScreen
