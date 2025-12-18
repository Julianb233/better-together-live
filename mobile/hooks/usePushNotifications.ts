// Better Together: React Hook for Push Notifications
// Easy-to-use hook for managing push notifications in React Native/Expo

import { useEffect, useState, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';
import { pushNotificationManager, NotificationType } from '../utils/pushNotifications';

interface UsePushNotificationsProps {
  userId?: string;
  enabled?: boolean;
  onNotificationReceived?: (notification: Notifications.Notification) => void;
}

interface PushNotificationState {
  isInitialized: boolean;
  hasPermission: boolean;
  isLoading: boolean;
  error: string | null;
}

export function usePushNotifications({
  userId,
  enabled = true,
  onNotificationReceived,
}: UsePushNotificationsProps = {}) {
  const navigation = useNavigation();
  const [state, setState] = useState<PushNotificationState>({
    isInitialized: false,
    hasPermission: false,
    isLoading: false,
    error: null,
  });

  // Handle notification tap navigation
  const handleNotificationTap = useCallback(
    (response: Notifications.NotificationResponse) => {
      const data = response.notification.request.content.data;
      const action = data.action as string;
      const notificationType = data.type as NotificationType;

      // Navigate based on notification type
      switch (notificationType) {
        case NotificationType.PARTNER_CHECKIN_REMINDER:
          navigation.navigate('CheckIn' as never);
          break;

        case NotificationType.PARTNER_ACTIVITY:
          navigation.navigate('PartnerActivity' as never);
          break;

        case NotificationType.MILESTONE_ACHIEVED:
          navigation.navigate('Achievements' as never);
          break;

        case NotificationType.DAILY_PROMPT:
          navigation.navigate('DailyPrompt' as never);
          break;

        case NotificationType.GIFT_RECEIVED:
          navigation.navigate('Gifts' as never);
          break;

        case NotificationType.ANNIVERSARY_REMINDER:
          navigation.navigate('Calendar' as never);
          break;

        case NotificationType.GOAL_COMPLETED:
          navigation.navigate('Goals' as never);
          break;

        default:
          navigation.navigate('Home' as never);
          break;
      }
    },
    [navigation]
  );

  // Initialize push notifications
  const initialize = useCallback(async () => {
    if (!userId || !enabled) {
      return;
    }

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const success = await pushNotificationManager.initialize({
        userId,
        onNotificationReceived,
        onNotificationTapped: handleNotificationTap,
      });

      const permissionStatus = await pushNotificationManager.getPermissionStatus();

      setState({
        isInitialized: success,
        hasPermission: permissionStatus === 'granted',
        isLoading: false,
        error: success ? null : 'Failed to initialize push notifications',
      });
    } catch (error) {
      setState({
        isInitialized: false,
        hasPermission: false,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, [userId, enabled, onNotificationReceived, handleNotificationTap]);

  // Request permissions
  const requestPermissions = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const { status } = await Notifications.requestPermissionsAsync();
      const hasPermission = status === 'granted';

      setState((prev) => ({
        ...prev,
        hasPermission,
        isLoading: false,
        error: hasPermission ? null : 'Permission denied',
      }));

      // If permission granted and user ID exists, initialize
      if (hasPermission && userId && enabled) {
        await initialize();
      }

      return hasPermission;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to request permissions',
      }));
      return false;
    }
  }, [userId, enabled, initialize]);

  // Unregister (call on logout)
  const unregister = useCallback(async () => {
    if (!userId) return;

    try {
      await pushNotificationManager.unregister(userId);
      setState({
        isInitialized: false,
        hasPermission: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error unregistering push notifications:', error);
    }
  }, [userId]);

  // Clear badge count
  const clearBadge = useCallback(async () => {
    await pushNotificationManager.clearBadge();
  }, []);

  // Initialize on mount if userId is available
  useEffect(() => {
    if (userId && enabled) {
      initialize();
    }

    // Cleanup on unmount
    return () => {
      // Don't unregister on unmount, only on explicit logout
      // This prevents losing the token if the component remounts
    };
  }, [userId, enabled, initialize]);

  // Clear badge when app comes to foreground
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(() => {
      // Optionally clear badge when notifications are received
      // clearBadge();
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return {
    // State
    isInitialized: state.isInitialized,
    hasPermission: state.hasPermission,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    initialize,
    requestPermissions,
    unregister,
    clearBadge,
  };
}

// Example usage in a component:
/*
import { usePushNotifications } from '../hooks/usePushNotifications';

function MyComponent() {
  const { user } = useAuth(); // Your auth hook
  const {
    isInitialized,
    hasPermission,
    isLoading,
    error,
    requestPermissions,
    clearBadge,
  } = usePushNotifications({
    userId: user?.id,
    enabled: true,
    onNotificationReceived: (notification) => {
      console.log('Received:', notification);
      // Show in-app notification, update UI, etc.
    },
  });

  // Clear badge when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        clearBadge();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [clearBadge]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!hasPermission) {
    return (
      <View>
        <Text>Enable notifications to stay connected with your partner</Text>
        <Button onPress={requestPermissions}>Enable Notifications</Button>
      </View>
    );
  }

  return <YourContent />;
}
*/
