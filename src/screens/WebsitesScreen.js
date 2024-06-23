import {
  StyleSheet,
  Text,
  Linking,
  View,
  Pressable,
  Image,
} from "react-native";

export default function WebsitesScreen() {
  const openURL = (url) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err),
    );
  };
  return (
    <View style={styles.container}>
      <Pressable>
        <View style={styles.backButton}>
          <Text style={{ fontSize: 15 }}>
            <Image
              source={require("../assets/caret-left.png")}
              style={styles.fitSizeBack}
            />
            Back
          </Text>
        </View>
      </Pressable>
      <Text style={styles.header}>Websites</Text>

      <Pressable
        style={styles.linkContainer1}
        onPress={() => openURL("https://eternityband.org/")}
      >
        <Text style={styles.linkText}>
          <Image
            source={require("../assets/external-link.png")}
            style={styles.fitSize}
          />
          Eternity Band
        </Text>
      </Pressable>

      <Pressable
        style={styles.linkContainer2}
        onPress={() => openURL("https://goaudacity.com/")}
      >
        <Text style={styles.linkText}>
          <Image
            source={require("../assets/external-link.png")}
            style={styles.fitSize}
          />
          Audacity Workshop
        </Text>
      </Pressable>

      <Pressable
        style={styles.linkContainer3}
        onPress={() => openURL("https://funyouth.us/art")}
      >
        <Text style={styles.linkText}>
          <Image
            source={require("../assets/external-link.png")}
            style={styles.fitSize}
          />
          ColorVision
        </Text>
      </Pressable>
      <Pressable
        style={styles.linkContainer4}
        onPress={() => openURL("https://funyouth.us/")}
      >
        <Text style={styles.linkText}>
          <Image
            source={require("../assets/external-link.png")}
            style={styles.fitSize}
          />
          FUN Youth
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    top: -180,
    fontSize: 50,
    fontWeight: "bold",
  },
  linkContainer1: {
    marginVertical: 10,
    top: -180,
    left: -50,
  },
  linkContainer2: {
    marginVertical: 10,
    top: -180,
    left: -25,
  },
  linkContainer3: {
    marginVertical: 10,
    top: -180,
    left: -60,
  },
  linkContainer4: {
    marginVertical: 10,
    top: -180,
    left: -65,
  },
  linkText: {
    color: "black",
    textDecorationLine: "underline",
    fontSize: 20,
  },
  backButton: {
    top: -200,
    marginLeft: -200,
    flexDirection: "row",
  },
  fitSize: {
    margin: 2,
    marginBottom: -5,
    width: 20,
    height: 20,
  },
  fitSizeBack: {
    width: 24,
    height: 24,
  },
});
