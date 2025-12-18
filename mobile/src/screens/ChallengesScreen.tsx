// Better Together Mobile: Challenges Screen
import React from 'react'
import { View, Text, StyleSheet, SafeAreaView } from 'react-native'
import { COLORS, SPACING, FONT_SIZES } from '../utils/constants'

const ChallengesScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Challenges</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>Challenges screen - Coming soon!</Text>
      </View>
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
})

export default ChallengesScreen
