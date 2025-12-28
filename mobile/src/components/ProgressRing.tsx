// Better Together Mobile: ProgressRing Component
import React, { useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Animated } from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'
import { COLORS, FONT_SIZES, FONT_WEIGHTS } from '../utils/constants'

interface ProgressRingProps {
  progress: number // 0-100
  size?: number
  color?: string
  strokeWidth?: number
  showPercentage?: boolean
  animated?: boolean
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export const ProgressRing = ({
  progress,
  size = 100,
  color = COLORS.primary,
  strokeWidth = 8,
  showPercentage = true,
  animated = true,
}: ProgressRingProps) => {
  const animatedValue = useRef(new Animated.Value(0)).current

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const clampedProgress = Math.min(Math.max(progress, 0), 100)

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedValue, {
        toValue: clampedProgress,
        duration: 800,
        useNativeDriver: false,
      }).start()
    } else {
      animatedValue.setValue(clampedProgress)
    }
  }, [clampedProgress, animated])

  const strokeDashoffset = animatedValue.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  })

  return (
    <View
      style={[styles.container, { width: size, height: size }]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={`Progress: ${Math.round(clampedProgress)} percent`}
      accessibilityValue={{ min: 0, max: 100, now: clampedProgress }}
    >
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={COLORS.gray200}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="none"
          />
        </G>
      </Svg>
      {showPercentage && (
        <View style={styles.percentageContainer}>
          <Text style={[styles.percentage, { color }]}>
            {Math.round(clampedProgress)}%
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentage: {
    fontSize: FONT_SIZES.lg,
    fontWeight: FONT_WEIGHTS.bold,
  },
})

export default ProgressRing
