// Better Together Mobile: Main Navigation
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text } from 'react-native'

// Import screens
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen'
import DashboardScreen from '../screens/DashboardScreen'
import AICoachScreen from '../screens/AICoachScreen'
import SchedulingScreen from '../screens/SchedulingScreen'
import ProfileScreen from '../screens/ProfileScreen'
import CheckinScreen from '../screens/CheckinScreen'
import ActivitiesScreen from '../screens/ActivitiesScreen'
import ChallengesScreen from '../screens/ChallengesScreen'

import { useAuth } from '../hooks/useAuth'

// Stack and Tab navigators
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

// Tab icon component (simple text for now, replace with icons)
const TabIcon = ({ label, focused }: { label: string; focused: boolean }) => (
  <Text style={{ color: focused ? '#FF6B9D' : '#666666', fontSize: 12 }}>
    {label}
  </Text>
)

// Main tab navigator (authenticated users)
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#FF6B9D',
        tabBarInactiveTintColor: '#666666',
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="🏠" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Checkin"
        component={CheckinScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="✅" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Activities"
        component={ActivitiesScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="🎯" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="AI Coach"
        component={AICoachScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="🤖" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="👤" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  )
}

// Main app navigator
export const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null // TODO: Add loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          // Auth stack
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          // Main app stack
          <>
            <Stack.Screen name="MainTabs" component={MainTabs} />
            <Stack.Screen name="Scheduling" component={SchedulingScreen} />
            <Stack.Screen name="Challenges" component={ChallengesScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
