import { StyleSheet, Text, View } from "react-native";
import LogOutButton from "../components/Logout.js";
import Profile from "../components/Profile.js";
export default function AccountScreen() {
  return (
    <View>
      <Text>{"\n\n\n\n\n\n\n"}</Text>
      <Profile></Profile>
      <LogOutButton></LogOutButton>
    </View>
  );
}
