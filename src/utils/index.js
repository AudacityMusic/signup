import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getUser() {
  try {
    const userString = await AsyncStorage.getItem("user");
    if (userString === null) {
      throw "EMPTY User";
    }
    return JSON.parse(userString);
  } catch (error) {
    console.error(error);
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
    console.error(response);
    return false;
  } catch (error) {
    console.error(error);
    return false;
  }
}
