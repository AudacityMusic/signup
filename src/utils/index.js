import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Constants from "expo-constants";

export function alertError(error) {
  console.error(error);
  Alert.alert(
    "Error",
    `Your request was not processed successfully due to an unexpected error. We apologize for the inconvenience. To help us identify and fix this error, please take a screenshot of this alert and send a bug report to ${Constants.expoConfig.extra.email}. Thank you!\n\nPlatform: ${Platform.OS} with v${Platform.Version}\n\n${error}`,
  );
}

export async function getUser() {
  try {
    const userString = await AsyncStorage.getItem("user");
    if (userString === null) {
      alertError("Undefined user in getUser");
    }
    return JSON.parse(userString);
  } catch (error) {
    alertError(`In getUser: ${error}`);
  }
}

export function hashForm(title, location, date) {
  return title + location + date;
}

export class FormString {
  constructor() {
    this.string = "";
  }

  append(key, value) {
    if (this.string.length > 0) {
      this.string += "&";
    }

    this.string += `entry.${key}=${encodeURIComponent(value)}`;
  }

  toString() {
    return this.string;
  }
}

export async function submitForm(formId, formData) {
  const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  console.log("Form Data: " + formData);
  try {
    const response = await fetch(formUrl, {
      method: "POST",
      body: formData.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    if (response.ok) {
      return true;
    }
    alertError(`Failure response in submitForm: ${response}`);
    return false;
  } catch (error) {
    alertError(`In submitForm: ${error}`);
    return false;
  }
}
