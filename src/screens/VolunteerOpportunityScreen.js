import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import Heading from "../components/Heading";
import NextButton from "../components/NextButton";
import PersistScrollView from "../components/PersistScrollView";
import Tag from "../components/Tag";
import colors from "../constants/colors";

export default function VolunteerOpportunityScreen({ route, navigation }) {
  const {
    title,
    location,
    date,
    image,
    description,
    tags,
    formURL,
    isSubmitted,
  } = route.params;

  const tagsIcons = tags.map((text) => <Tag key={text} text={text} />);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.banner}>
        <ImageBackground
          source={{ width: 0, height: 0, uri: image }}
          style={styles.backgroundImage}
          placeholder={{ blurhash: "LT9Hq#RPVrt8%%RjWCkCR:WWtSWB" }}
          transition={500}
          cachePolicy="memory"
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
              marginLeft: 20,
            },
          ]}
        >
          <Text style={styles.headerText} selectable={true}>{title}</Text>
        </View>
      </View>
      <PersistScrollView style={styles.scrollContainer}>
        <View style={styles.subContainer}>
          <View style={styles.details}>
            <View style={styles.icon}>
              <MaterialCommunityIcons
                name="clock-time-five-outline"
                size={20}
                color={colors.black}
              />
              <Text style={styles.detailsText} selectable={true}>{date}</Text>
            </View>
            <View style={styles.icon}>
              <SimpleLineIcons
                name="location-pin"
                size={20}
                color={colors.black}
              />
              <Text style={styles.detailsText} selectable={true}>{location}</Text>
            </View>
          </View>
          {description != "" ? (
            <View style={styles.about}>
              <Heading>About</Heading>
              <Text style={{ fontSize: 14 }} selectable={true}>{description}</Text>
            </View>
          ) : null}
          {tags.length > 0 ? (
            <View style={styles.tagsContainer}>
              <Heading>Tags</Heading>
              <View style={styles.tags}>{tagsIcons}</View>
            </View>
          ) : null}
          <View style={styles.lowerRight}>
            {isSubmitted ? (
              <Text style={styles.alreadySubmitted} selectable={true}>
                Warning: You have already submitted this form.
              </Text>
            ) : null}
            <Pressable
              onPress={() =>
                formURL == null
                  ? navigation.navigate("Sign Up Form", {
                      title,
                      location,
                      date,
                    })
                  : navigation.navigate("Google Forms", { formURL })
              }
            >
              <NextButton>Sign Up</NextButton>
            </Pressable>
          </View>
        </View>
      </PersistScrollView>
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
  backgroundImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  scrollContainer: {
    flex: 1,
  },
  subContainer: {
    marginHorizontal: 20,
  },
  details: {
    paddingTop: 10,
    justifyContent: "center",
  },
  icon: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
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
  alreadySubmitted: {
    color: colors.danger,
    marginBottom: 10,
  },
  lowerRight: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginTop: 20,
  },
  headerText: {
    position: "absolute",
    fontSize: 35,
    color: "white",
    fontWeight: "bold",
    paddingBottom: 5,
  },
  detailsText: {
    fontSize: 18,
  },
});
