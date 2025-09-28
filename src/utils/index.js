/**
 * index.js
 * Shared utility functions:
 *  - alertError: standardized error alert
 *  - openURL / maybeOpenURL: external link handling
 *  - getUser: retrieve cached user from AsyncStorage
 *  - request: retry wrapper for network calls
 *  - strToDate / formatDate: date parsing and formatting
 *  - Question: form question helper class
 *  - emptyQuestionState: hook for question state
 *  - validation helpers: isAtLeast, isNotEmpty, isExactly
 *  - hashForm: deterministic event hash
 *  - openInMaps: launch maps app for a location
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useState } from "react";
import { Alert, Linking, Platform } from "react-native";

/**
 * Send email using the device's default email client.
 * @param {string} to - recipient email address
 * @param {string} subject - email subject
 * @param {string} body - email body content
 * @returns {Promise<void>}
 */
export async function sendEmail(to, subject, body) {
  try {
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);
    const emailUrl = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;

    console.log("Attempting to open email URL:", emailUrl);
    console.log("Platform:", Platform.OS, Platform.Version);

    const canOpen = await Linking.canOpenURL(emailUrl);
    console.log("Can open mailto URL:", canOpen);

    if (canOpen) {
      await Linking.openURL(emailUrl);
      console.log("Email client opened successfully");
    } else {
      console.warn("Cannot open mailto URL - this is common on iOS Simulator");

      // Try alternative approach for debugging
      try {
        await Linking.openURL(emailUrl);
        console.log(
          "Direct email opening succeeded despite canOpenURL being false",
        );
      } catch (directError) {
        console.log("Direct email opening also failed:", directError);

        // Show user-friendly message with copy-to-clipboard option
        Alert.alert(
          "Email Not Available",
          `Testing on simulator or no email app configured.\n\nEmail: ${to}\nSubject: ${subject}\n\nTip: Test on a real device with Mail app configured.`,
          [{ text: "Got it" }],
        );
      }
    }
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
    Alert.alert("Email Error", `Email functionality error. Contact: ${to}`, [
      { text: "OK" },
    ]);
  }
}

/**
 * Submit bug report using multiple methods for reliability.
 * @param {string} error - error message or object to display
 * @returns {Promise<void>}
 */
async function submitBugReport(error) {
  try {
    const user = await getUser(true);
    const userId = user?.id || "anonymous";
    const userName = user?.name || "Anonymous User";

    const subject = "Auto Bug Report - Mobile App Error";
    const bugData = {
      user: userName,
      userId: userId,
      platform: `${Platform.OS} v${Platform.Version}`,
      appVersion: Constants.expoConfig?.version || "Unknown",
      timestamp: new Date().toISOString(),
      error: error.toString(),
    };

    // Method 1: Try email first
    try {
      const emailBody =
        `Bug Report Auto-Submitted\n\n` +
        `User: ${bugData.user} (ID: ${bugData.userId})\n` +
        `Platform: ${bugData.platform}\n` +
        `App Version: ${bugData.appVersion}\n` +
        `Timestamp: ${bugData.timestamp}\n\n` +
        `Error Details:\n${bugData.error}\n\n` +
        `Please investigate this error and contact the user if needed.`;

      await sendEmail("uppalsamaira9@gmail.com", subject, emailBody);
      console.log("Bug report sent via email");
      return;
    } catch (emailError) {
      console.warn("Email method failed, trying alternatives:", emailError);
    }

    // Method 2: Send email via EmailJS service (reliable web-based email)
    try {
      const emailJSResponse = await fetch(
        "https://api.emailjs.com/api/v1.0/email/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            service_id: "YOUR_SERVICE_ID", // You'll need to replace this
            template_id: "YOUR_TEMPLATE_ID", // You'll need to replace this
            user_id: "YOUR_PUBLIC_KEY", // You'll need to replace this
            template_params: {
              to_email: "uppalsamaira9@gmail.com",
              from_name: "Audacity App Bug Report",
              subject: subject,
              message:
                `Bug Report Auto-Submitted\n\n` +
                `User: ${bugData.user} (ID: ${bugData.userId})\n` +
                `Platform: ${bugData.platform}\n` +
                `App Version: ${bugData.appVersion}\n` +
                `Timestamp: ${bugData.timestamp}\n\n` +
                `Error Details:\n${bugData.error}`,
            },
          }),
        },
      );

      if (emailJSResponse.ok) {
        console.log("Bug report sent via EmailJS");
        Alert.alert(
          "Bug Report Sent",
          "Thank you! Your bug report has been sent successfully.",
        );
        return;
      }
    } catch (emailJSError) {
      console.warn("EmailJS method failed:", emailJSError);
    }

    // Method 3: Send email via Formspree (simple webhook-to-email service)
    try {
      const formspreeResponse = await fetch(
        "https://formspree.io/f/YOUR_FORM_ID",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: "uppalsamaira9@gmail.com",
            subject: subject,
            message:
              `Bug Report Auto-Submitted\n\n` +
              `User: ${bugData.user} (ID: ${bugData.userId})\n` +
              `Platform: ${bugData.platform}\n` +
              `App Version: ${bugData.appVersion}\n` +
              `Timestamp: ${bugData.timestamp}\n\n` +
              `Error Details:\n${bugData.error}`,
          }),
        },
      );

      if (formspreeResponse.ok) {
        console.log("Bug report sent via Formspree");
        Alert.alert(
          "Bug Report Sent",
          "Thank you! Your bug report has been sent successfully.",
        );
        return;
      }
    } catch (formspreeError) {
      console.warn("Formspree method failed:", formspreeError);
    }

    // Method 4: Store locally for manual retrieval
    try {
      const existingReports =
        (await AsyncStorage.getItem("bug_reports")) || "[]";
      const reports = JSON.parse(existingReports);
      reports.push(bugData);
      await AsyncStorage.setItem("bug_reports", JSON.stringify(reports));
      console.log(
        "Bug report stored locally - check AsyncStorage for bug_reports",
      );

      // Show alert to user about local storage
      Alert.alert(
        "Bug Report Stored",
        "Bug report saved locally. Please contact support manually if the issue persists.",
        [{ text: "OK" }],
      );
    } catch (storageError) {
      console.error("All bug report methods failed:", storageError);
    }
  } catch (bugReportError) {
    console.error("Failed to submit bug report:", bugReportError);
  }
}

export function alertError(error) {
  console.error(error);
  // Submit bug report with diagnostic info
  submitBugReport(error);
  Alert.alert(
    "Error",
    `Your request was not processed successfully due to an unexpected error. We apologize for the inconvenience. A bug report has been automatically submitted to ${Constants.expoConfig.extra?.email || "support"}. Thank you!\n\nPlatform: ${Platform.OS} with v${Platform.Version}\n\n${error}`,
  );
  return null;
}

/**
 * Retrieve all stored bug reports (for debugging/manual review).
 * @returns {Promise<Array>}
 */
export async function getBugReports() {
  try {
    const existingReports = (await AsyncStorage.getItem("bug_reports")) || "[]";
    return JSON.parse(existingReports);
  } catch (error) {
    console.error("Failed to get bug reports:", error);
    return [];
  }
}

/**
 * Clear all stored bug reports.
 * @returns {Promise<void>}
 */
export async function clearBugReports() {
  try {
    await AsyncStorage.removeItem("bug_reports");
    console.log("Bug reports cleared");
  } catch (error) {
    console.error("Failed to clear bug reports:", error);
  }
}

alertError(2 / 0);
/**
 * Open a URL in the default browser.
 * @param {string} url
 */
export function openURL(url) {
  Linking.openURL(url).catch((_) => {
    Alert.alert(
      `Unable to open URL`,
      `Your device does not support opening ${url} from this app. Please copy and paste the URL into your browser.`,
    );
  });
}

/**
 * Try to open URL, fallback to app store if scheme fails.
 * @param {string} url
 * @param {string} appName
 * @param {string} appStoreID
 * @param {string} playStoreID
 */
export function maybeOpenURL(url, appName, appStoreID, playStoreID) {
  Linking.openURL(url).catch((error) => {
    if (error.code == "EUNSPECIFIED") {
      if (Platform.OS == "ios") {
        openURL(`https://apps.apple.com/us/app/${appName}/id${appStoreID}`);
      } else {
        openURL(`https://play.google.com/store/apps/details?id=${playStoreID}`);
      }
    } else {
      Alert.alert(
        `Unable to open URL`,
        `Your device does not support opening ${url} from this app. Please copy and paste the URL into your browser.`,
      );
    }
  });
}

/**
 * Retrieve the stored user object from AsyncStorage.
 * @param {boolean} [isEmptySafe=false]
 * @returns {Promise<object|undefined>}
 */
export async function getUser(isEmptySafe = false) {
  try {
    const userString = await AsyncStorage.getItem("user");
    if (userString === null) {
      if (!isEmptySafe) {
        alertError("Empty getUser");
      }
      return;
    }
    return JSON.parse(userString);
  } catch (error) {
    alertError("Unexpected error in getUser: " + error);
  }
}

/**
 * Utility delay function for retry backoff.
 */
function wait(time) {
  return new Promise((resolve) => {
    setTimeout(resolve, time);
  });
}

/**
 * Retry network request with exponential backoff: delays of 1/25/5/25 seconds.
 * @param {Function} fn - async function that returns data or throws
 * @returns {Promise<any>}
 */
export async function request(fn) {
  let data;

  // Request after 0, 1/5, 1, and 5 seconds
  for (let i = -2; i <= 1; i++) {
    if (i > -2) {
      await wait(Math.pow(5, i) * 1000);
    }
    try {
      data = await fn();
    } catch (error) {
      if (i == 1) {
        Alert.alert(
          "Network error",
          `The app could not establish a connection after 6 seconds. Please reopen the app when you have a stable Internet connection.\n\n${error}`,
        );
      }
    }
    if (data != null) {
      break;
    }
  }

  return data;
}

/**
 * Convert serialized Sheet date string 'Date(YYYY,MM,DD,hh,mm,ss)' into Date object.
 * @param {string} str
 * @returns {Date}
 */
export function strToDate(str) {
  const [year, month, day, hour, minute, second] = str
    .slice(5, -1)
    .split(",")
    .map(Number);

  return new Date(year, month, day, hour, minute, second);
}

/**
 * Format Date object to human-readable string 'Weekday, Month Day, Year Time'.
 * @param {Date} date
 * @returns {string}
 */
export function formatDate(date) {
  const datePart = date.toLocaleDateString("en-us", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const timePart = date.toLocaleTimeString("en-us", {
    hour: "numeric",
    minute: "numeric",
  });

  return `${datePart} ${timePart}`;
}

/**
 * Question helper: binds form question component state and validation.
 */
export class Question {
  constructor({
    name,
    component,
    validate = (_) => true,
    isVisible = () => true,
  }) {
    this.name = name;
    this.component = component;
    this.state = component.props.state;
    this.setState = component.props.setState;
    this.y = component.props.state.y;
    this.isVisible = isVisible;
    this.validate = () => validate(component.props.state.value);
  }
}

/**
 * Hook to initialize question state.
 * @param {*} initial
 */
export function emptyQuestionState(initial = null) {
  return useState({ value: initial, y: null, valid: true });
}

// Validation predicates
export const isAtLeast = (value, len) =>
  value
    ? (value.hasOwnProperty("trim") ? value.trim() : value).length >= len
    : false;
export const isNotEmpty = (value) => isAtLeast(value, 1);
export const isExactly = (value, len) =>
  !isAtLeast(value, len + 1) && isAtLeast(value, len);

/**
 * Hash event details deterministically for submission tracking.
 * @param {string} userID
 * @param {string} title
 * @param {string} location
 * @param {string} date
 */
export function hashForm(userID, title, location, date) {
  return `${userID}&&&${title}&&&${location}&&&${date}`;
}

/**
 * Launch maps application or fallback to web URL for a location.
 * @param {string} location
 */
export function openInMaps(location) {
  const encodedLocation = encodeURIComponent(location);
  const url = Platform.select({
    ios: `maps://maps.apple.com/?q=${encodedLocation}`,
    android: `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
  });
  Linking.canOpenURL(url).then((supported) => {
    if (supported) {
      Linking.openURL(url);
    } else {
      // Fallback to Google Maps web URL
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${encodedLocation}`,
      );
    }
  });
}
