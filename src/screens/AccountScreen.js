import { View } from "react-native";

import LogOutButton from "../components/LogOutButton.js";
import Profile from "../components/Profile.js";

export default function AccountScreen({ navigation }) {
  return (
    <View style={{ height: "100%" }}>
      <Profile />
      <LogOutButton navigation={navigation} />
    </View>
  );
}
