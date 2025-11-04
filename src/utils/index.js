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
 * Send email using mailto URL (works in Expo Go).
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

    console.log("Attempting to send email via mailto URL");

    const canOpen = await Linking.canOpenURL(emailUrl);
    if (canOpen) {
      await Linking.openURL(emailUrl);
      console.log("Email client opened successfully");
    } else {
      console.warn("Cannot open mailto URL - no email app configured");
      Alert.alert(
        "Email Not Available",
        `No email app configured. Please manually email:\n\nTo: ${to}\nSubject: ${subject}`,
        [{ text: "OK" }],
      );
      throw new Error("No email app available");
    }
  } catch (error) {
    console.error("Failed to send email:", error);
    Alert.alert("Email Error", `Failed to send email: ${error.message}`, [
      { text: "OK" },
    ]);
    throw error;
  }
}

/**
 * Submit bug report using email.
 * @param {string} error - error message or object to display
 * @returns {Promise<void>}
 */
async function submitBugReport(error) {
  const user = await getUser(true);
  const supportEmail =
    Constants.expoConfig.extra?.email || "it@eternityband.org";

  const subject = "Bug Report - Auto Submitted";
  const body = `Bug Report Details:
  
User: ${user?.name || "Anonymous"}
User ID: ${user?.id || "unknown"}
Platform: ${Platform.OS} v${Platform.Version}
App Version: ${Constants.expoConfig?.version || "Unknown"}
Timestamp: ${new Date().toISOString()}

Error Details:
${error.toString()}
`;

  try {
    await sendEmail(supportEmail, subject, body);
    console.log("Bug report submitted successfully via email");
  } catch (emailError) {
    console.error("Failed to submit bug report:", emailError);
    // Store locally as fallback
    try {
      const existingReports =
        (await AsyncStorage.getItem("bug_reports")) || "[]";
      const reports = JSON.parse(existingReports);
      reports.push({
        user: user?.name || "Anonymous",
        userId: user?.id || "unknown",
        platform: `${Platform.OS} v${Platform.Version}`,
        appVersion: Constants.expoConfig?.version || "Unknown",
        timestamp: new Date().toISOString(),
        error: error.toString(),
      });
      await AsyncStorage.setItem("bug_reports", JSON.stringify(reports));
      console.log("Bug report stored locally as fallback");
    } catch (storageError) {
      console.error("Failed to store bug report locally:", storageError);
    }
  }
}
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

alertError("Test error alert from index.js");
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

// error-mailer.js
// Node.js (requires nodemailer). Install: npm install nodemailer

const nodemailer = require("nodemailer");

/**
 * Configure transporter.
 * Uses environment variables:
 *   EMAIL_USER  - the Gmail address (e.g. amazon.prime.misc@gmail.com)
 *   EMAIL_PASS  - the app password or SMTP password
 *
 * For production, prefer OAuth2 or a secret manager.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an error email.
 * @param {Error|any} err - error object or message
 * @param {Object} [opts] - optional overrides { to, from, subjectPrefix }
 */
async function sendErrorEmail(err, opts = {}) {
  console.log(process.env.EXPO_EMAIL_USER);
  console.log(process.env.EXPO_EMAIL_PASS);
  console.log(process.env.EXPO_EMAIL_TO);
  const to = opts.to || process.env.EMAIL_TO || process.env.EMAIL_USER;
  const from = opts.from || process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const subjectPrefix = opts.subjectPrefix || "[ERROR ALERT]";

  const errorMessage = err && err.stack ? err.stack : String(err);

  const mailOptions = {
    from: process.env.EMAIL_FROM, // sender
    to: process.env.EMAIL_TO, // recipient
    subject: `[ERROR ALERT] ${new Date().toISOString()}`,
    text: `An error occurred from Samaira:\n\n${errorMessage}`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Error email sent:", info.messageId || info);
    return info;
  } catch (sendErr) {
    // If sending fails, log but don't throw (to avoid recursive uncaughtException)
    console.error("Failed to send error email:", sendErr);
    return null;
  }
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Optional: install global handlers to catch uncaught exceptions & rejections.
 * This will attempt to email when anything crashes the process.
 */
function installGlobalErrorHandlers() {
  process.on("uncaughtException", async (err) => {
    console.error("uncaughtException:", err);
    // best-effort: send email, then exit
    await sendErrorEmail(err, { subjectPrefix: "[UNCAUGHT EXCEPTION]" });
    // give a moment for transporter to try then exit
    setTimeout(() => process.exit(1), 2000);
  });

  process.on("unhandledRejection", async (reason, promise) => {
    console.error("unhandledRejection at:", promise, "reason:", reason);
    await sendErrorEmail(reason, { subjectPrefix: "[UNHANDLED REJECTION]" });
    // do NOT exit automatically for unhandledRejection in all apps; here we choose to exit
    setTimeout(() => process.exit(1), 2000);
  });

  console.log("Global error handlers installed.");
}

// Export functions for reuse
module.exports = {
  sendErrorEmail,
  installGlobalErrorHandlers,
};
