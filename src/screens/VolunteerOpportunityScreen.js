/**
 * VolunteerOpportunityScreen.js
 * Detailed view of a volunteer event.
 * - Displays banner image with gradient overlay and title
 * - Shows event date and location (tap to open in maps)
 * - Optionally displays description and tags
 * - Provides Sign Up button (navigates to form or Google Forms URL)
 */

import Markdown from "react-native-markdown-display";
import { Linking } from "react-native";
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
import { openInMaps } from "../utils";

export default function VolunteerOpportunityScreen({ route, navigation }) {
  // Destructure parameters passed via navigation
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

  // Map tags to Tag components
  const tagsIcons = tags.map((text) => <Tag key={text} text={text} />);

  return (
    <SafeAreaView style={styles.container}>
      {/* Banner with background image and gradient overlay */}
      <View style={styles.banner}>
        <ImageBackground
          source={{ uri: image, width: 0, height: 0 }}
          style={styles.backgroundImage}
          placeholder={{ blurhash: "LT9Hq#RPVrt8%%RjWCkCR:WWtSWB" }}
          transition={500}
          cachePolicy="memory"
        >
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={{ position: "absolute", width: "100%", height: "100%" }}
          />
        </ImageBackground>
        {/* Overlay title text at bottom-left of banner */}
        <View style={{ justifyContent: "flex-end", marginLeft: 20 }}>
          <Text style={styles.headerText} selectable>
            {title}
          </Text>
        </View>
      </View>

      {/* Scrollable content area */}
      <PersistScrollView style={styles.scrollContainer}>
        <View style={styles.subContainer}>
          {/* Event details: date and location */}
          <View style={styles.details}>
            <View style={styles.icon}>
              <MaterialCommunityIcons
                name="clock-time-five-outline"
                size={20}
                color={colors.black}
              />
              <Text style={styles.detailsText} selectable>
                {date}
              </Text>
            </View>
            <View style={styles.icon}>
              <SimpleLineIcons
                name="location-pin"
                size={20}
                color={colors.black}
              />
              <Pressable onPress={() => openInMaps(location)}>
                <Text
                  style={[styles.detailsText, styles.locationText]}
                  selectable
                >
                  {location}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Optional description section */}
          {typeof description === "string" && description.trim() !== "" && (
            <View style={styles.about}>
              <Heading>About</Heading>
              <Markdown
                style={{
                  body: { fontSize: 14, color: colors.black },
                  link: { color: colors.primary },
                }}
                onLinkPress={(url) => {
                  Linking.openURL(url);
                  return true;
                }}
              >
                {description}
              </Markdown>
            </View>
          )}

          {/* Optional tags section */}
          {tags.length > 0 && (
            <View style={styles.tagsContainer}>
              <Heading>Tags</Heading>
              <View style={styles.tags}>{tagsIcons}</View>
            </View>
          )}

          {/* Sign Up button with warning if already submitted */}
          <View style={styles.lowerRight}>
            {isSubmitted && (
              <Text style={styles.alreadySubmitted} selectable>
                Warning: You have already submitted this form.
              </Text>
            )}
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
  locationText: {
    textDecorationLine: "underline",
    color: colors.primary,
  },
});
