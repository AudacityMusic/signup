import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

/**
 * Initialize notification permissions and handlers.
 * - Requests user permission for notifications.
 * - Sets up notification handler for foreground notifications.
 * - Configures Android notification channel for scheduling.
 */
export async function initNotificationHandling() {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") {
    console.warn("Notification permissions not granted");
  }

  // Handle notifications when app is foregrounded
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Configure default Android notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "Default",
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }
}

/**
 * Schedule notifications for a given event based on its 'Notification Times'.
 * @param {object} event - The event object containing Title, Date, Location, and Notification Times.
 * Notification Times should be a comma-separated list like '1W,3D,5H'.
 */
export async function scheduleEventNotifications(event) {
  const { id, Title, Date: dateStr, Location } = event;
  const eventDate = new Date(dateStr);

  // Raw string of offsets e.g. '1W,3D,5H'
  const raw = event["Notification Times"] || "";

  // Parse offsets into structured objects: { offset: ms, num: number, unit: 'W'|'D'|'H' }
  const times = raw
    .split(",") // split tokens
    .map((token) => token.trim().toUpperCase())
    .map((val) => {
      if (!val) return null; // skip empty
      const unit = val.slice(-1); // last char: unit
      const num = parseInt(val.slice(0, -1), 10); // leading number
      if (isNaN(num)) return null; // invalid number
      let offset = 0;
      if (unit === "D")
        offset = num * 24 * 60 * 60 * 1000; // days to ms
      else if (unit === "W")
        offset = num * 7 * 24 * 60 * 60 * 1000; // weeks to ms
      else if (unit === "H")
        offset = num * 60 * 60 * 1000; // hours to ms
      else return null; // unsupported unit
      return { offset, num, unit };
    })
    .filter(Boolean);

  // Schedule a notification for each offset if in the future
  for (let { offset, num, unit } of times) {
    const triggerDate = new Date(eventDate.getTime() - offset);
    if (triggerDate > new Date()) {
      // Build human-readable label e.g. '3 days'
      let unitName = unit === "D" ? "day" : unit === "W" ? "week" : "hour";
      const labelText = `${num} ${unitName}${num > 1 ? "s" : ""}`;

      // Schedule the notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: `Upcoming: ${Title}`,
          body: `${labelText} until ${Title} at ${Location} on ${eventDate.toLocaleString()}`,
          data: { eventId: id },
        },
        trigger: triggerDate, // Date object-based trigger
      });
    }
  }
}

/**
 * Cancel all scheduled notifications throughout the app.
 * Useful for clearing events on logout or data refresh.
 */
export function cancelAllScheduled() {
  return Notifications.cancelAllScheduledNotificationsAsync();
}
