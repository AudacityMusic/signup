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
