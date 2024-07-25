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
import SignUpButton from "../components/SignUpButton";
import Tag from "../components/Tag";
import Heading from "../components/Heading";

export default function VolunteerOpportunityScreen({ route, navigation }) {
  const { title, location, date, image, description, tags, formURL } =
    route.params;
  const tagsIcons = tags.map((text) => <Tag key={text} text={text} />);
  console.log(formURL);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <ImageBackground
          source={{ width: 0, height: 0, uri: image }}
          style={styles.backgroundImage}
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={{ width: "100%", height: "100%", position: "absolute" }}
          ></LinearGradient>
        </ImageBackground>
        <View
          style={[
            {
              justifyContent: "flex-end",
              marginLeft: "3%",
              paddingRight: "30%",
            },
          ]}
        >
          <Text style={styles.headerText}>{title}</Text>
        </View>
      </View>
      <View style={styles.subcontainer}>
        <View style={styles.details}>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Image
              source={require("./../assets/clock.png")}
              style={{ height: 18, width: 18 }}
            ></Image>
            <Text style={styles.detailsText}>{date}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <Image
              source={require("./../assets/location.png")}
              style={{ height: 18, width: 18 }}
            ></Image>
            <Text style={styles.detailsText}>{location}</Text>
          </View>
        </View>
        {description != "" ? (
          <View style={styles.about}>
            <Heading>About</Heading>
            <Text style={{ fontSize: 14 }}>{description}</Text>
          </View>
        ) : null}
        {tags.length > 0 ? (
          <View style={styles.tagsContainer}>
            <Heading>Tags</Heading>
            <View style={styles.tags}>{tagsIcons}</View>
          </View>
        ) : null}
        <Pressable
          style={styles.signUpButton}
          onPress={() =>
            formURL == null
              ? navigation.navigate("Volunteer Form")
              : navigation.navigate("Google Forms", { formURL })
          }
        >
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
    flex: 0.5,
  },
  subcontainer: {
    flex: 1,
    marginHorizontal: 20,
  },
  details: {
    paddingTop: 10,
    justifyContent: "center",
  },
  about: {
    paddingVertical: 10,
  },
  tagsContainer: {
    flexDirection: "column",
  },
  tags: {
    paddingVertical: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
  },
  signUpButton: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headerText: {
    position: "absolute",
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
  detailsText: {
    fontSize: 18,
  },
});
