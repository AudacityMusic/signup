import Constants from "expo-constants";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { maybeOpenURL, openURL } from "../utils";

import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

export default function OtherOpportunities({ navigation }) {
  return (
    <View style={styles.container}>
      <Pressable
        style={[styles.card, styles.first]}
        onPress={() =>
          navigation.navigate("Sign Up Form", {
            title: "Request a Concert",
            location: null,
            date: null,
          })
        }
      >
        <Entypo
          name="beamed-note"
          size={18}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.text}>Request a Concert</Text>
        <FontAwesome
          name="chevron-right"
          size={20}
          color="black"
          style={styles.arrow}
        />
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() =>
          navigation.navigate("Sign Up Form", {
            title: "Audacity Dance Club",
            location: null,
            date: null,
          })
        }
      >
        <MaterialCommunityIcons
          name="human-female-dance"
          size={18}
          color="black"
          style={styles.icon}
        />
        <Text style={styles.text}>Sign Up for Audacity Dance Club</Text>
        <FontAwesome
          name="chevron-right"
          size={20}
          color="black"
          style={styles.arrow}
        />
      </Pressable>

      <Pressable
        style={styles.card}
        onPress={() => openURL(`mailto:${Constants.expoConfig.extra.email}`)}
      >
        <MaterialIcons
          name="feedback"
          size={18}
          color="black"
          style={styles.icon}
        />
        <Text
          style={styles.text}
        >{`Send feedback to ${Constants.expoConfig.extra.email}`}</Text>
        <Feather
          name="external-link"
          size={21}
          color="black"
          style={styles.external}
        />
      </Pressable>

      <Pressable
        style={[styles.card, styles.last]}
        onPress={() =>
          maybeOpenURL("zelle://", "zelle", "1260755201", "com.zellepay.zelle")
        }
      >
        <Ionicons name="gift" size={18} color="black" style={styles.icon} />
        <Text style={styles.text}>Donate to admin@funyouth.us on Zelle</Text>
        <Feather
          name="external-link"
          size={21}
          color="black"
          style={styles.external}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 10,
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
    width: 18,
    height: 18,
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: "#555",
  },
  arrow: {
    width: 20,
    height: 20,
  },
  external: {
    width: 20,
    height: 20,
    marginRight: 3,
  },
});
