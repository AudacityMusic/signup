/**
 * Profile.js
 * Displays logged-in user's name, email, and profile image or icon.
 * Retrieves user info from AsyncStorage on mount.
 */
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { getUser } from "../utils";

export default function Profile() {
  // Local user state
  const [user, setUser] = useState(null);

  // Load user data on mount
  useEffect(() => {
    getUser().then(setUser);
  }, []);

  // Default display values while loading or empty
  let name = user?.name ?? "Loading";
  if (name === "") name = "Anonymous Apple User";
  let email = user?.email ?? "Loading";
  if (email === "") email = "apple.com";

  return (
    <View style={styles.container}>
      {/* User photo if available, else default icon */}
      {user?.photo ? (
        <Image
          style={styles.image}
          source={{ uri: user.photo, width: 60, height: 60 }}
        />
      ) : (
        <FontAwesome
          name="user-circle"
          size={60}
          color="black"
          style={styles.image}
        />
      )}
      {/* Name and email text */}
      <View>
        <Text style={styles.name} selectable>
          {name}
        </Text>
        <Text style={styles.email} selectable>
          {email}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Light grey background color
    padding: 15,
    borderRadius: 10,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    margin: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginRight: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#555",
  },
});
