import AsyncStorage from "@react-native-async-storage/async-storage";

import { alertError, hashForm } from "..";
import formIDs from "../../constants/formIDs";

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

async function submitForm(formId, formData) {
  const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
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
    alertError(`submitForm failed with response: ${JSON.stringify(response)}`);
    return false;
  } catch (error) {
    alertError(`submitForm errored with: ${error}`);
    return false;
  }
}

export default class Form {
  constructor(title, date, location, navigation, scrollObject) {
    this.title = title;
    this.date = date;
    this.location = location;
    this.navigation = navigation;
    this.scrollObject = scrollObject;
  }

  questions() {
    alertError("questions() cannot be called on the Form base class");
    return [];
  }

  validate() {
    let allValid = true;
    let minInvalidY = Infinity;

    for (const question of this.questions()) {
      const isValid = question.validate();
      question.setState((prevState) => ({
        ...prevState,
        valid: isValid,
      }));

      if (!isValid) {
        allValid = false;
        if (question.y < minInvalidY) {
          minInvalidY = question.y;
        }
      }
    }

    if (!allValid) {
      this.scrollObject.scrollTo({
        x: 0,
        y: minInvalidY,
        animated: true,
      });
      return false;
    }

    return true;
  }

  async submit() {
    if (!this.validate()) {
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
      const value = this[question.name][0].value;
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

    try {
      const submittedForms = await AsyncStorage.getItem("submittedForms");
      const hash = hashForm(this.title, this.location, this.date);
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
