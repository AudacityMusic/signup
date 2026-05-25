/**
 * index.js
 * Shared utility functions:
 *  - alertError: standardized error alert + EmailJS error report
 *  - openURL: external link handling with app store fallback
 *  - request: retry wrapper with exponential backoff for network calls
 *  - strToDate / formatDate: Google Sheets date parsing and formatting
 *  - Question: form question helper class
 *  - emptyQuestionState: hook for question state
 *  - isAtLeast, isNotEmpty, isExactly: basic validation predicates
 *  - isValidEmail, isValidPhoneNumber: validator.js-backed field validators
 */

import Constants from "expo-constants";
import { isEmail, isMobilePhone } from "validator";
import { createNavigationContainerRef } from "@react-navigation/native";
import { useState } from "react";
import { Alert, Linking, Platform } from "react-native";
import { send, EmailJSResponseStatus } from "@emailjs/react-native";

export const navigationRef = createNavigationContainerRef();

export function alertError(error) {
  console.error("Error reported:", error);
  sendErrorEmail(error);
  Alert.alert(
    "Error",
    `Your request was not processed successfully due to an unexpected error.` +
      ` We apologize for the inconvenience.` +
      ` Please submit a bug report to ${Constants.expoConfig.extra.email} explaining how the following error occurred. Thank you!\n\n` +
      ` Platform: ${Platform.OS} with v${Platform.Version}\n\n${error}`,
  );
}

export async function sendErrorEmail(error) {
  try {
    await send(
      process.env.EXPO_PUBLIC_EMAIL_SERVICE_ID,
      process.env.EXPO_PUBLIC_EMAIL_TEMPLATE_ID,
      {
        email: process.env.EXPO_PUBLIC_EMAIL,
        title: "Audacity Sign Up Error Report",
        name: `A ${Platform.OS} v${Platform.Version} User`,
        message: `${error}`,
      },
      {
        publicKey: process.env.EXPO_PUBLIC_EMAIL_PUBLIC_KEY,
      },
    );
  } catch (err) {
    if (err instanceof EmailJSResponseStatus) {
      console.log("EmailJS Request Failed...", err);
    }

    console.log("ERROR", err);
  }
}

const normalizeValidationInput = (value) => (value ?? "").trim();
const normalizePhoneValidationInput = (value) =>
  normalizeValidationInput(value).replace(/[^\d+]/g, "");
export const isValidEmail = (value) => isEmail(normalizeValidationInput(value));
export const isValidPhoneNumber = (value) =>
  isMobilePhone(normalizePhoneValidationInput(value), "any", {
    strictMode: false,
  });

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
  if (!str) return null;
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
