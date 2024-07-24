import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Linking,
} from "react-native";

export default function Websites() {
  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <View>
      <View style={styles.cardContainer}>
        <Pressable
          style={[styles.card, styles.first]}
          onPress={() => openLink("https://eternityband.org/")}
        >
          <Image
            style={styles.icon}
            source={require("./../assets/eternity-band.png")}
          />
          <Text style={styles.text}>Eternity Band</Text>
          <Image
            style={styles.arrow}
            source={require("./../assets/external-link.png")}
          />
        </Pressable>
        <View style={styles.divider} />
        <Pressable
          style={styles.card}
          onPress={() => openLink("https://goaudacity.com/")}
        >
          <Image
            style={styles.icon}
            source={require("./../assets/audacity-workshop.png")}
          />
          <Text style={styles.text}>Audacity Workshop</Text>
          <Image
            style={styles.arrow}
            source={require("./../assets/external-link.png")}
          />
        </Pressable>
        <View style={styles.divider} />
        <Pressable
          style={styles.card}
          onPress={() => openLink("https://funyouth.us/art")}
        >
          <Image
            style={styles.icon}
            source={require("./../assets/colorvision.png")}
          />
          <Text style={styles.text}>ColorVision</Text>
          <Image
            style={styles.arrow}
            source={require("./../assets/external-link.png")}
          />
        </Pressable>
        <View style={styles.divider} />
        <Pressable
          style={[styles.card, styles.last]}
          onPress={() => openLink("https://funyouth.us/")}
        >
          <Image
            style={styles.icon}
            source={require("./../assets/fun-youth.png")}
          />
          <Text style={styles.text}>FUN Youth</Text>
          <Image
            style={styles.arrow}
            source={require("./../assets/external-link.png")}
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
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
  arrow: {
    width: 20,
    height: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
  },
});
