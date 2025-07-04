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

  // Parse per-event notification times, e.g. "1W,3D,5H"
  const raw = event['Notification Times'] || '';

  const times = raw
    .split(',')
    .map((token) => token.trim().toUpperCase())
    .map((val) => {
      if (!val) return null;
      const unit = val.slice(-1);
      const num = parseInt(val.slice(0, -1), 10);
      if (isNaN(num)) return null;
      let offset = 0;
      if (unit === 'D') offset = num * 24 * 60 * 60 * 1000;
      else if (unit === 'W') offset = num * 7 * 24 * 60 * 60 * 1000;
      else if (unit === 'H') offset = num * 60 * 60 * 1000;
      else return null;
      return { offset, num, unit };
    })
    .filter(Boolean);

  for (let { offset, num, unit } of times) {
    const triggerDate = new Date(eventDate.getTime() - offset);
    if (triggerDate > new Date()) {
      // Build descriptive label
      let unitName = unit === 'D' ? 'day' : unit === 'W' ? 'week' : 'hour';
      const labelText = `${num} ${unitName}${num > 1 ? 's' : ''}`;
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Upcoming: ${Title}`,
          body: `${labelText} until ${Title} at ${Location} on ${eventDate.toLocaleString()}`,
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
