/**
 * Form.js
 * Base form handling utilities for dynamic Google Forms submission:
 * - FormString: constructs URL-encoded form data string
 * - submitForm: sends POST request to Google Forms endpoint
 * - Form: abstract class to define questions, validation, and submission flow
 */

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Alert } from "react-native";
import { alertError, getUser, hashForm, request } from "..";
import formIDs from "../../constants/formIDs";

/**
 * Helper class to build form-urlencoded data and logging representation.
 */
class FormString {
  constructor() {
    this.string = "";
    this.repr = "";
  }

  append(key, value) {
    if (this.string.length > 0) {
      this.string += "&";
      this.repr += "\n";
    }

    this.string += `entry.${key}=${encodeURIComponent(value)}`;
    this.repr += `entry.${key}=${value}`;
  }

  toString() {
    return this.string;
  }

  log() {
    return this.repr;
  }
}

/**
 * Send form data to Google Forms 'formResponse' endpoint via POST.
 * Retries using request wrapper; on failure shows an alert.
 * @param {string} formId - Google Forms entry ID
 * @param {FormString} formData - encoded form data
 * @returns {Promise<boolean>} success status
 */
async function submitForm(formId, formData) {
  const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  const response = await request(() =>
    fetch(formUrl, {
      method: "POST",
      body: formData.toString(),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }),
  );
  if (response.ok) {
    return true;
  }
  alertError(`submitForm failed with response: ${JSON.stringify(response)}`);
  return false;
}

/**
 * Base class for building and submitting custom forms.
 * Subclasses should implement questions() to return array of Question objects.
 */
export default class Form {
  /**
   * @param {string} title - form title matching constants/formIDs
   * @param {string} date - event date string
   * @param {string} location - event location string
   * @param {object} navigation - React Navigation prop
   * @param {object} scrollRef - ref for scroll-to-error behavior
   */
  constructor(title, date, location, navigation, scrollRef) {
    this.title = title;
    this.date = date;
    this.location = location;
    this.navigation = navigation;
    this.scrollRef = scrollRef;
  }

  /**
   * Must be overridden by subclasses to define form fields.
   * @returns {Array} array of question definition objects
   */
  questions() {
    alertError("questions() cannot be called on the Form base class");
    return [];
  }

  /**
   * Validate all visible questions; scrolls to first invalid field.
   * @returns {number} count of invalid responses
   */
  validate() {
    let invalidResponses = 0;
    let minInvalidY = Infinity;

    for (const question of this.questions()) {
      const isVisible = question.isVisible();
      if (!isVisible) {
        question.setState((prevState) => ({
          ...prevState,
          value: null,
          valid: true,
        }));
        continue;
      }

      const isValid = question.validate();
      question.setState((prevState) => ({
        ...prevState,
        valid: isValid,
      }));

      if (!isValid) {
        invalidResponses++;
        if (question.y < minInvalidY) {
          minInvalidY = question.y;
        }
      }
    }

    if (invalidResponses > 0) {
      this.scrollRef.current?.scrollTo({
        x: 0,
        y: minInvalidY,
        animated: true,
      });
    }

    return invalidResponses;
  }

  /**
   * Perform validation, build form data, submit to Google Forms, track submissions, and navigate outcome.
   */
  async submit() {
    const invalidResponses = this.validate();
    if (invalidResponses > 0) {
      Alert.alert(
        "Error",
        `${invalidResponses} questions have invalid or missing required responses. Please fix all responses that are highlighted in red to submit this form.`,
      );
      return;
    }

    if (!(this.title in formIDs)) {
      alertError(`Form ${this.title} is not implemented`);
      return;
    }

    const form = formIDs[this.title];
    const formData = new FormString();

    if ("location" in form) {
      formData.append(form.location, this.location);
    }
    if ("date" in form) {
      formData.append(form.date, this.date);
    }

    for (const question of this.questions()) {
      const value = question.state.value;
      formData.append(
        form[question.name],
        value == null
          ? ""
          : value.constructor === Array
            ? value.join(", ")
            : value,
      );
    }

    const isFormSuccessful = await submitForm(form.id, formData);
    if (!isFormSuccessful) {
      this.navigation.navigate("End", { isSuccess: false });
      return;
    }

    const user = await getUser();
    const hash = hashForm(user.id, this.title, this.location, this.date);

    try {
      const submittedForms = await AsyncStorage.getItem("submittedForms");
      if (submittedForms == null) {
        await AsyncStorage.setItem("submittedForms", JSON.stringify([hash]));
      } else {
        const newForms = JSON.parse(submittedForms);
        newForms.push(hash);
        await AsyncStorage.setItem("submittedForms", JSON.stringify(newForms));
      }
    } catch (error) {
      alertError(`Unable to get/save submittedForms: ${error}`);
    }

    this.navigation.navigate("End", { isSuccess: true });
  }
}
