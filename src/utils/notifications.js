import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Initialize notification handling and permissions
export async function initNotificationHandling() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Notification permissions not granted');
  }
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

// Schedule notifications for an event at given offsets
export async function scheduleEventNotifications(event) {
  const { id, Title, Date: dateStr, Location } = event;
  const eventDate = new Date(dateStr);
  const times = [
    { offset: 7 * 24 * 60 * 60 * 1000, label: '1 week' },
    { offset: 3 * 24 * 60 * 60 * 1000, label: '3 days' },
    { offset: 1 * 24 * 60 * 60 * 1000, label: '1 day' },
    { offset: 1 * 60 * 60 * 1000,    label: '1 hour' },
  ];

  for (let { offset, label } of times) {
    const triggerDate = new Date(eventDate.getTime() - offset);
    if (triggerDate > new Date()) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Upcoming: ${Title}`,
          body: `${label} until ${Title} at ${Location} on ${eventDate.toLocaleString()}`,
          data: { eventId: id },
        },
        trigger: triggerDate,
      });
    }
  }
}

// Cancel all scheduled notifications
export function cancelAllScheduled() {
  return Notifications.cancelAllScheduledNotificationsAsync();
}
