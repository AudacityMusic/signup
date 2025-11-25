/**
 * VolunteerOpportunityScreen.js
 * Detailed view of a volunteer event.
 * - Displays banner image with gradient overlay and title
 * - Shows event date and location (tap to open in maps)
 * - Optionally displays description and tags
 * - Provides Sign Up button (navigates to form or Google Forms URL)
 * - ***Update*** Show and Hide Show Posters & Program List Button using public google sheet parser
 */

import { useState, useEffect } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";

import Heading from "../components/Heading";
import NextButton from "../components/NextButton";
import PersistScrollView from "../components/PersistScrollView";
import Tag from "../components/Tag";
import colors from "../constants/colors";

import PublicGoogleSheetsParser from "../utils/PublicGoogleSheetsParser";

const sheetId = process.env.EXPO_PUBLIC_SHEET_ID;
const sheetName = process.env.EXPO_PUBLIC_SHEET_NAME;

export default function VolunteerOpportunityScreen({ route, navigation }) {
  const {
    title,
    location,
    date,
    image,
    description,
    tags = [],
    formURL,
    isSubmitted,
  } = route.params;

  const tagsIcons = tags.map((text) => <Tag key={text} text={text} />);

  const [showImages, setShowImages] = useState(false);
  const [imageGallery, setImageGallery] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        console.log("sheetId:", sheetId);
        console.log("sheetName:", sheetName);

        if (!sheetId || !sheetName) {
          throw new Error(
            "Missing sheetId or sheetName. Ensure EXPO_PUBLIC_SHEET_ID and EXPO_PUBLIC_SHEET_NAME are set.",
          );
        }


        const parser = new PublicGoogleSheetsParser(sheetId, {
          sheetName,
        });

        const rows = await parser.parse();

        console.log("rows from parser:", rows?.length ?? 0, rows?.slice?.(0, 3));


        const imageObjects = (rows || [])
          .map((row) => {

            const url = row && row.ProgramList ? String(row.ProgramList).trim() : "";
            return url;
          })
          .filter((url) => url && url.length > 0)
          .map((url) => ({ uri: url }));

        setImageGallery(imageObjects);
      } catch (error) {
        console.error("Error loading images from Google Sheet:", error);
      }
    };

    fetchImages();
  }, []);

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
          />
        </ImageBackground>
        <View style={{ justifyContent: "flex-end", marginLeft: 20 }}>
          <Text style={styles.headerText}>{title}</Text>
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
              <Text style={styles.detailsText}>{date}</Text>
            </View>
            <View style={styles.icon}>
              <SimpleLineIcons
                name="location-pin"
                size={20}
                color={colors.black}
              />
              <Text style={styles.detailsText}>{location}</Text>
            </View>
          </View>

          {description !== "" ? (
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

          <Pressable onPress={() => setShowImages(!showImages)}>
            <NextButton>
              {showImages ? "Hide Posters & Programs" : "Show Posters & Programs"}
            </NextButton>
          </Pressable>

          {showImages && imageGallery.length > 0 && (
            <View style={{ marginTop: 15 }}>
              <Heading>Gallery</Heading>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {imageGallery.map((img, index) => (
                  <Image
                    key={index}
                    source={img}
                    style={{
                      width: 100,
                      height: 140,
                      borderRadius: 10,
                      marginRight: 10,
                      marginBottom: 10,
                    }}
                    resizeMode="cover"
                  />
                ))}
              </View>
            </View>
          )}

          <View style={styles.lowerRight}>
            {isSubmitted ? (
              <Text style={styles.alreadySubmitted}>
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
