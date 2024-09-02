import { View, Text, StyleSheet, Image, Pressable } from "react-native";

export default function OtherOpportunities({navigation}) {
  return (
    <View style={styles.container}>
      <Pressable 
        style={[styles.card, styles.first]} 
        onPress={() => 
          navigation.navigate("Volunteer Form", {
            title: "Request Concert",
            location: null,
            date: null,
          })
        }
      >
        <Image
          style={styles.icon}
          source={require("./../assets/music-note.png")}
        />
        <Text style={styles.text}>Request a Concert</Text>
        <Image
          style={styles.arrow}
          source={require("./../assets/caret-left.png")}
        />
      </Pressable>
      <Pressable 
        style={styles.card} 
        onPress={() => 
          navigation.navigate("Volunteer Form", {
            title: "Audacity Dance Club",
            location: null,
            date: null,
          })
        }
      >
        <Image
          style={styles.icon}
          source={require("./../assets/music-note.png")}
        />
        <Text style={styles.text}>Request a Concert</Text>
        <Image
          style={styles.arrow}
          source={require("./../assets/caret-left.png")}
        />
      </Pressable>
      <View style={styles.divider} />
      <View style={[styles.card, styles.last]}>
        <Image style={styles.icon} source={require("./../assets/gift.png")} />
        <Text style={styles.text}>Donate to admin@funyouth.us on Zelle</Text>
      </View>
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
    width: 15,
    height: 15,
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
    transform: [{ rotateZ: "180deg" }],
  },
  divider: {
    height: 0.1,
    backgroundColor: "#e0e0e0",
  },
});
