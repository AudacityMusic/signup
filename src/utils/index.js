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

export async function submitForm(formId, formData) {
  const formUrl = `https://docs.google.com/forms/d/e/${formId}/formResponse`;
  try {
    console.log(formData);
    const response = await fetch(formUrl, {
      method: "POST",
      body: formData,
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
