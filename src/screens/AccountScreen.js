import { View } from "react-native";

import LogOutButton from "../components/LogOutButton.js";
import Profile from "../components/Profile.js";

export default function AccountScreen({name, email, profilePicture}) {
  return (
    <View>
      <Profile name={name} email={email} profilePicture={profilePicture} />
      <LogOutButton />
    </View>
  );
}
