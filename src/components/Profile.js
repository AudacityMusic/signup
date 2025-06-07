import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

import { getUser } from "../utils";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    getUser().then(setUser);
  }, []);

  let name = user?.name ?? "Loading";
  if (name == "") {
    name = "Anonymous Apple User";
  }
  let email = user?.email ?? "Loading";
  if (email == "") {
    email = "apple.com";
  }

  return (
    <View style={styles.container}>
      {user?.photo != null ? (
        <Image
          style={styles.image}
          source={{ width: 0, height: 0, uri: user.photo }} // size doesn't matter
        ></Image>
      ) : (
        <FontAwesome
          name="user-circle"
          size={60}
          color="black"
          style={styles.image}
        />
      )}
      <View>
        <Text style={styles.name} selectable={true}>{name}</Text>
        <Text style={styles.email} selectable={true}>{email}</Text>
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
