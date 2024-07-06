import {
  Pressable,
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BackButton from "../components/BackButton";
import SignUpButton from "../components/SignUpButton";
import Tag from "../components/Tag";

export default function VolunteerOpportunityScreen() {
  const tagTexts = ["Electric Piano", "Indoors", "Presentation Equipment"];
  const tags = tagTexts.map((text) => <Tag key={text} text={text} />);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <ImageBackground
          source={require("./../assets/warm-springs-bart.png")}
          style={styles.backgroundImage}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={{ width: "100%", height: "100%", position: "absolute" }}
          ></LinearGradient>
        </ImageBackground>
        <Pressable style={styles.backButton}>
          <BackButton opaque={true} />
        </Pressable>
        <View
          style={[
            {
              justifyContent: "flex-end",
              marginLeft: "3%",
              paddingRight: "30%",
            },
          ]}
        >
          <Text style={styles.headerText}>Music By The Tracks</Text>
        </View>
      </View>
      <View style={styles.details}>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Image
            source={require("./../assets/clock.png")}
            style={{ height: 18, width: 18 }}
          ></Image>
          <Text style={styles.detailsText}>
            Saturday, July 27, 2024 4:00 PM
          </Text>
        </View>
        <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
          <Image
            source={require("./../assets/location.png")}
            style={{ height: 18, width: 18 }}
          ></Image>
          <Text style={styles.detailsText}>Warm Springs BART Station</Text>
        </View>
      </View>
      <View style={styles.about}>
        <Text style={{ fontSize: 16, color: "353535", fontWeight: "bold" }}>
          About
        </Text>
        <Text style={{ fontSize: 14 }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In sit amet
          nibh nulla. Vestibulum ante ipsum primis in faucibus orci luctus et
          ultrices posuere cubilia curae; Aenean vitae orci in mi ultricies
          varius et at tellus. Maecenas posuere vestibulum tortor, euismod
          aliquam odio ullamcorper eget. Phasellus quam mi, bibendum id
          elementum eget, semper id risus. Nunc eu bibendum erat, nec
          pellentesque est. Nullam lobortis mattis laoreet. Aliquam quis ipsum
          at arcu tempus scelerisque. Nullam malesuada, enim quis dignissim
          suscipit, neque massa tristique diam, non rhoncus diam felis at
          turpis. Ut ullamcorper quis leo a pharetra.
        </Text>
      </View>
      <View style={styles.tagsContainer}>
        <Text style={[{ fontSize: 16, fontWeight: "bold", color: "353535" }]}>
          Tags
        </Text>
        <View style={styles.tags}>{tags}</View>
      </View>
      <View style={styles.signUpButton}>
        <Pressable style={[{ marginBottom: "5%", marginRight: "4%" }]}>
          <SignUpButton />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
  },
  banner: {
    flex: 4,
  },
  details: {
    flex: 1,
    paddingLeft: "4%",
    justifyContent: "center",
  },
  about: {
    flex: 3,
    paddingLeft: "4%",
    paddingTop: "5%",
    paddingRight: "8%",
  },
  tagsContainer: {
    flex: 1.5,
    paddingLeft: "4%",
    paddingTop: "5%",
    flexDirection: "column",
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingTop: "1%",
    paddingRight: "4%",
  },
  signUpButton: {
    flex: 1.5,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backButton: {
    position: "absolute",
    paddingTop: "15%",

    transform: [{ scale: 0.8 }],
  },
  headerText: {
    position: "absolute",
    fontSize: 48,
    color: "white",
    fontWeight: "bold",
  },
  detailsText: {
    fontSize: 20,
  },
});
