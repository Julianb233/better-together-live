// Better Together Mobile: Daily Check-in Screen
import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native'
import { Card } from '../components/Card'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { useAuth } from '../hooks/useAuth'
import { apiClient } from '../api/client'
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants'

const CheckinScreen: React.FC = () => {
  const { user } = useAuth()
  const [connectionScore, setConnectionScore] = useState(5)
  const [moodScore, setMoodScore] = useState(5)
  const [satisfactionScore, setSatisfactionScore] = useState(5)
  const [gratitudeNote, setGratitudeNote] = useState('')
  const [supportNeeded, setSupportNeeded] = useState('')
  const [highlight, setHighlight] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!user) return

    setLoading(true)

    const relationshipResponse = await apiClient.getRelationship(user.id)

    if (relationshipResponse.data?.relationship) {
      const checkinData = {
        relationship_id: relationshipResponse.data.relationship.id,
        user_id: user.id,
        connection_score: connectionScore,
        mood_score: moodScore,
        relationship_satisfaction: satisfactionScore,
        gratitude_note: gratitudeNote,
        support_needed: supportNeeded,
        highlight_of_day: highlight,
      }

      const result = await apiClient.createCheckin(checkinData)

      if (result.data && !result.error) {
        Alert.alert('Success', 'Daily check-in saved!', [
          { text: 'OK', onPress: resetForm },
        ])
      } else {
        Alert.alert('Error', result.error?.message || 'Failed to save check-in')
      }
    }

    setLoading(false)
  }

  const resetForm = () => {
    setConnectionScore(5)
    setMoodScore(5)
    setSatisfactionScore(5)
    setGratitudeNote('')
    setSupportNeeded('')
    setHighlight('')
  }

  const ScoreSelector = ({
    label,
    value,
    onChange,
  }: {
    label: string
    value: number
    onChange: (val: number) => void
  }) => (
    <View style={styles.scoreSection}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={styles.scoreButtons}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
          <TouchableOpacity
            key={score}
            style={[
              styles.scoreButton,
              value === score && styles.scoreButtonActive,
            ]}
            onPress={() => onChange(score)}
          >
            <Text
              style={[
                styles.scoreButtonText,
                value === score && styles.scoreButtonTextActive,
              ]}
            >
              {score}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Check-in</Text>
        <Text style={styles.headerSubtitle}>
          How are you feeling today?
        </Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <ScoreSelector
            label="Connection Score"
            value={connectionScore}
            onChange={setConnectionScore}
          />
        </Card>

        <Card style={styles.card}>
          <ScoreSelector
            label="Mood Score"
            value={moodScore}
            onChange={setMoodScore}
          />
        </Card>

        <Card style={styles.card}>
          <ScoreSelector
            label="Relationship Satisfaction"
            value={satisfactionScore}
            onChange={setSatisfactionScore}
          />
        </Card>

        <Card style={styles.card}>
          <Input
            label="What are you grateful for today?"
            placeholder="Share something you appreciate..."
            value={gratitudeNote}
            onChangeText={setGratitudeNote}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </Card>

        <Card style={styles.card}>
          <Input
            label="Do you need support with anything?"
            placeholder="Optional - share if you'd like support..."
            value={supportNeeded}
            onChangeText={setSupportNeeded}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </Card>

        <Card style={styles.card}>
          <Input
            label="Highlight of your day"
            placeholder="What made today special?"
            value={highlight}
            onChangeText={setHighlight}
            multiline
            numberOfLines={3}
            style={styles.textArea}
          />
        </Card>

        <Button
          title="Submit Check-in"
          onPress={handleSubmit}
          loading={loading}
          style={styles.submitButton}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

import { TouchableOpacity } from 'react-native'

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
  scoreSection: {
    marginBottom: SPACING.md,
  },
  scoreLabel: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  scoreButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  scoreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  scoreButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  scoreButtonText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
  scoreButtonTextActive: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    margin: SPACING.md,
  },
})

export default CheckinScreen
