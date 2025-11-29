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


export async function alertError(error) {
  console.error(error);

  // Attempt to get user info
  let user;
  try {
    const userString = await AsyncStorage.getItem("user");
    user = userString ? JSON.parse(userString) : {};
  } catch (err) {
    console.error("Failed to get user info:", err);
    user = {};
  }

  // Prepare payload for server
  const payload = {
    errorMessage: error?.stack || String(error),
    userId: user?.id || "unknown",
    userName: user?.name || "Anonymous",
    platform: `${Platform.OS} v${Platform.Version}`,
    appVersion: Constants.expoConfig?.version || "Unknown",
  };

  // Send error to backend server
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/send-error`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!response.ok) {
      console.warn("Failed to send error to server");
    } else {
      console.log("Error reported to server successfully");
    }
  } catch (err) {
    console.error("Error reporting failed:", err);
    // Optional fallback: store locally if server unreachable
    try {
      const existingReports =
        (await AsyncStorage.getItem("bug_reports")) || "[]";
      const reports = JSON.parse(existingReports);
      reports.push({
        ...payload,
        timestamp: new Date().toISOString(),
      });
      await AsyncStorage.setItem("bug_reports", JSON.stringify(reports));
      console.log("Error stored locally as fallback");
    } catch (storageErr) {
      console.error("Failed to store error locally:", storageErr);
    }
  }
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

