// Better Together: Push Notification Utilities for React Native/Expo
// Complete integration for iOS and Android push notifications

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_URL = 'https://better-together.app'; // Update with your actual API URL

// Configure how notifications should be handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface PushNotificationConfig {
  userId: string;
  onNotificationReceived?: (notification: Notifications.Notification) => void;
  onNotificationTapped?: (response: Notifications.NotificationResponse) => void;
}

class PushNotificationManager {
  private notificationListener: Notifications.Subscription | null = null;
  private responseListener: Notifications.Subscription | null = null;
  private deviceToken: string | null = null;

  /**
   * Initialize push notifications
   * Call this after user logs in
   */
  async initialize(config: PushNotificationConfig): Promise<boolean> {
    if (!Device.isDevice) {
      console.warn('Push notifications require a physical device');
      return false;
    }

    try {
      // Request permissions
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('Push notification permission denied');
        return false;
      }

      // Get device token
      const token = await this.getDeviceToken();
      if (!token) {
        console.error('Failed to get device token');
        return false;
      }

      this.deviceToken = token;

      // Register token with backend
      await this.registerToken(config.userId, token);

      // Set up notification listeners
      this.setupListeners(config);

      console.log('Push notifications initialized successfully');
      return true;
    } catch (error) {
      console.error('Error initializing push notifications:', error);
      return false;
    }
  }

  /**
   * Request notification permissions
   */
  private async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  }

  /**
   * Get device push token
   */
  private async getDeviceToken(): Promise<string | null> {
    try {
      // For Expo managed workflow
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      if (projectId) {
        const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
        return tokenData.data;
      }

      // For bare workflow or native tokens
      const tokenData = await Notifications.getDevicePushTokenAsync();
      return tokenData.data;
    } catch (error) {
      console.error('Error getting device token:', error);
      return null;
    }
  }

  /**
   * Register device token with backend
   */
  private async registerToken(userId: string, deviceToken: string): Promise<void> {
    const platform = Platform.OS === 'ios' ? 'ios' : 'android';

    const response = await fetch(`${API_URL}/api/push/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        device_token: deviceToken,
        platform: platform,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Failed to register token: ${error.error || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Device token registered:', data.token_id);
  }

  /**
   * Set up notification listeners
   */
  private setupListeners(config: PushNotificationConfig): void {
    // Listen for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Notification received:', notification);
        config.onNotificationReceived?.(notification);
      }
    );

    // Listen for user tapping on notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log('Notification tapped:', response);
        config.onNotificationTapped?.(response);
        this.handleNotificationTap(response);
      }
    );
  }

  /**
   * Handle notification tap and navigate appropriately
   */
  private handleNotificationTap(response: Notifications.NotificationResponse): void {
    const data = response.notification.request.content.data;
    const action = data.action as string;

    // Handle navigation based on action
    // You'll need to integrate this with your navigation system
    console.log('Handle action:', action, data);

    switch (action) {
      case 'open_checkin':
        // Navigate to check-in screen
        // navigation.navigate('CheckIn');
        break;
      case 'view_checkin':
        // Navigate to partner's check-in
        // navigation.navigate('PartnerCheckin');
        break;
      case 'view_achievements':
        // Navigate to achievements
        // navigation.navigate('Achievements');
        break;
      case 'view_prompt':
        // Navigate to daily prompt
        // navigation.navigate('DailyPrompt');
        break;
      case 'view_gifts':
        // Navigate to gifts
        // navigation.navigate('Gifts');
        break;
      case 'view_calendar':
        // Navigate to calendar
        // navigation.navigate('Calendar');
        break;
      case 'view_goals':
        // Navigate to goals
        // navigation.navigate('Goals');
        break;
      default:
        // Default navigation
        // navigation.navigate('Home');
        break;
    }
  }

  /**
   * Unregister device token (call on logout)
   */
  async unregister(userId: string): Promise<void> {
    if (!this.deviceToken) {
      console.warn('No device token to unregister');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/push/unregister`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          device_token: this.deviceToken,
          user_id: userId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to unregister token');
      }

      console.log('Device token unregistered');
      this.cleanup();
    } catch (error) {
      console.error('Error unregistering token:', error);
    }
  }

  /**
   * Clean up listeners
   */
  private cleanup(): void {
    if (this.notificationListener) {
      this.notificationListener.remove();
      this.notificationListener = null;
    }

    if (this.responseListener) {
      this.responseListener.remove();
      this.responseListener = null;
    }

    this.deviceToken = null;
  }

  /**
   * Clear badge count (call when app is opened)
   */
  async clearBadge(): Promise<void> {
    await Notifications.setBadgeCountAsync(0);
  }

  /**
   * Get current badge count
   */
  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  /**
   * Cancel all pending notifications
   */
  async cancelAllNotifications(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  /**
   * Get notification permissions status
   */
  async getPermissionStatus(): Promise<string> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }
}

// Export singleton instance
export const pushNotificationManager = new PushNotificationManager();

// Export types
export type { PushNotificationConfig };

// Export notification types for type safety
export enum NotificationType {
  PARTNER_CHECKIN_REMINDER = 'partner_checkin_reminder',
  PARTNER_ACTIVITY = 'partner_activity',
  MILESTONE_ACHIEVED = 'milestone_achieved',
  DAILY_PROMPT = 'daily_prompt',
  GIFT_RECEIVED = 'gift_received',
  ANNIVERSARY_REMINDER = 'anniversary_reminder',
  GOAL_COMPLETED = 'goal_completed',
}

// Helper function to check if notifications are supported
export function areNotificationsSupported(): boolean {
  return Device.isDevice;
}

// Helper function to open notification settings
export async function openNotificationSettings(): Promise<void> {
  await Notifications.getPermissionsAsync();
  // On iOS, this will prompt user to open settings if needed
  // On Android, you may need to use a library like react-native-permissions
}
