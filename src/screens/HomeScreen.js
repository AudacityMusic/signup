import { StyleSheet, Text, Image, View, Pressable } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Image source={require("./../assets/logo.png")} style={styles.logo} />
      <Pressable
        style={styles.volunteer}
        onPress={() => navigation.navigate("Sign In")}
      >
        <Text style={styles.buttonText}>Volunteer</Text>
      </Pressable>
      <Pressable
        style={styles.request}
        onPress={() => navigation.navigate("Sign In")}
      >
        <Text style={[styles.buttonText, { fontSize: 24 }]}>
          Request a Concert
        </Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Donate")}>
        <Text style={styles.smallButton}>Donate</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate("Websites")}>
        <Text style={styles.smallButton}>Visit our websites</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 24,
  },
  logo: {
    flexDirection: "column",
    justifyContent: "center",
    width: 387,
    height: 208,
  },
  volunteer: {
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 1,
    width: 267,
    height: 74,
    backgroundColor: "#4B5588",
    marginBottom: 24,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
  buttonText: {
    textAlign: "center",
    fontSize: 36,
    fontWeight: "medium",
    color: "white",
  },
  request: {
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 15,
    borderWidth: 1,
    width: 267,
    height: 74,
    backgroundColor: "#000000",
    marginBottom: 24,
    shadowColor: "black",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
  smallButton: {
    borderBottomWidth: 2,
    fontSize: 24,
    marginBottom: 10,
  },
});
