// Better Together Mobile: Main Navigation
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Feather } from '@expo/vector-icons'

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
import ShopScreen from '../screens/ShopScreen'
import CommunityFeedScreen from '../screens/CommunityFeedScreen'
import MessagingScreen from '../screens/MessagingScreen'
import PostDetailScreen from '../screens/PostDetailScreen'
import UserProfileScreen from '../screens/UserProfileScreen'
import CommunityDetailScreen from '../screens/CommunityDetailScreen'
import VideoCallScreen from '../screens/VideoCallScreen'

import { useAuth } from '../hooks/useAuth'

// Stack and Tab navigators
const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

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
          tabBarIcon: ({ focused, color }) => (
            <Feather name="home" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Checkin"
        component={CheckinScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Feather name="check-circle" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Activities"
        component={ActivitiesScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Feather name="heart" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityFeedScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Feather name="users" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagingScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Feather name="message-circle" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Feather name="user" size={24} color={color} />
          ),
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
            <Stack.Screen name="AICoach" component={AICoachScreen} />
            <Stack.Screen name="Shop" component={ShopScreen} />
            <Stack.Screen name="PostDetail" component={PostDetailScreen} />
            <Stack.Screen name="UserProfile" component={UserProfileScreen} />
            <Stack.Screen name="CommunityDetail" component={CommunityDetailScreen} />
            <Stack.Screen
              name="VideoCall"
              component={VideoCallScreen}
              options={{
                presentation: 'fullScreenModal',
                animation: 'slide_from_bottom'
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default AppNavigator
