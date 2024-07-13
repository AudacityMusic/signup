import { View } from "react-native";

import LogOutButton from "../components/LogOutButton.js";
import Profile from "../components/Profile.js";

export default function AccountScreen() {
  return (
    <View>
      <Profile />
      <LogOutButton />
    </View>
  );
}
