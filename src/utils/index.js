import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { useState } from "react";
import { Alert, Platform } from "react-native";

export function alertError(error) {
  console.error(error);
  Alert.alert(
    "Error",
    `Your request was not processed successfully due to an unexpected error. We apologize for the inconvenience. To help us identify and fix this error, please take a screenshot of this alert and send a bug report to ${Constants.expoConfig.extra.email}. Thank you!\n\nPlatform: ${Platform.OS} with v${Platform.Version}\n\n${error}`,
  );
  return null;
}

export async function getUser() {
  try {
    const userString = await AsyncStorage.getItem("user");
    if (userString === null) {
      throw "EMPTY User";
    }
    return JSON.parse(userString);
  } catch (error) {
    alertError("Unexpected error in getUser: " + error);
  }
}

export class Question {
  constructor({
    name,
    component,
    validate = (_) => true,
    isVisible = () => true,
    state = null,
    setState = null,
    y = null,
  }) {
    this.name = name;
    this.component = component;
    this.state = state ? state : component.props.state;
    this.setState = setState ? setState : component.props.setState;
    this.y = y ? y : component.props.state.y;
    this.isVisible = isVisible;
    this.validate = () =>
      !isVisible() || validate((state ? state : component.props.state).value);
  }
}

export function emptyQuestionState(initial = null) {
  return useState({ value: initial, y: null, valid: true });
}

export const isAtLeast = (value, len) =>
  value
    ? (value.hasOwnProperty("trim") ? value.trim() : value).length >= len
    : false;
export const isNotEmpty = (value) => isAtLeast(value, 1);
export const isExactly = (value, len) =>
  !isAtLeast(value, len + 1) && isAtLeast(value, len);

export function hashForm(title, location, date) {
  return title + "&&&" + location + "&&&" + date;
}
