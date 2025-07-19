/**
 * Websites.js
 * Presents quick-access cards to external Audacity-related websites.
 * Each card shows an icon, label, and opens URL on press.
 */

import Feather from "@expo/vector-icons/Feather";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { openURL } from "../utils";

export default function Websites() {
  return (
    <View>
      <View style={styles.container}>
        {/* Eternity Band website card */}
        <Pressable
          style={[styles.card, styles.first]}
          onPress={() => openURL("https://eternityband.org/")}
        >
          <Image
            style={styles.icon}
            source={require("./../assets/eternity-band.png")}
          />
          <Text style={styles.text} selectable={true}>
            Eternity Band
          </Text>
          <Feather
            name="external-link"
            size={21}
            color="black"
            style={styles.external}
          />
        </Pressable>

        {/* Audacity Workshop website */}
        <Pressable
          style={styles.card}
          onPress={() => openURL("https://goaudacity.com/")}
        >
          <Image
            style={styles.icon}
            source={require("./../assets/audacity-workshop.png")}
          />
          <Text style={styles.text} selectable={true}>
            Audacity Workshop
          </Text>
          <Feather
            name="external-link"
            size={21}
            color="black"
            style={styles.external}
          />
        </Pressable>

        {/* ColorVision site */}
        <Pressable
          style={styles.card}
          onPress={() => openURL("https://funyouth.us/art")}
        >
          <Image
            style={styles.icon}
            source={require("./../assets/colorvision.png")}
          />
          <Text style={styles.text} selectable={true}>
            ColorVision
          </Text>
          <Feather
            name="external-link"
            size={21}
            color="black"
            style={styles.external}
          />
        </Pressable>

        {/* FUN Youth main site */}
        <Pressable
          style={styles.card}
          onPress={() => openURL("https://funyouth.us/")}
        >
          <Image
            style={styles.icon}
            source={require("./../assets/fun-youth.png")}
          />
          <Text style={styles.text} selectable={true}>
            FUN Youth
          </Text>
          <Feather
            name="external-link"
            size={21}
            color="black"
            style={styles.external}
          />
        </Pressable>

        {/* Audacity Dance Club site */}
        <Pressable
          style={[styles.card, styles.last]}
          onPress={() => openURL("https://eternityband.org/dance/")}
        >
          <Image
            style={styles.icon}
            source={require("./../assets/audacity-dance-club.png")}
          />
          <Text style={styles.text} selectable={true}>
            Audacity Dance Club
          </Text>
          <Feather
            name="external-link"
            size={21}
            color="black"
            style={styles.external}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderColor: "#e0e0e0",
    borderWidth: 1,
  },
  first: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  last: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: "#555",
  },
  external: {
    width: 20,
    height: 20,
    marginRight: 3,
  },
});
