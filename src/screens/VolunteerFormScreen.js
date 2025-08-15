/**
 * VolunteerFormScreen.js
 * Renders a dynamic sign-up form based on the event type.
 * - Chooses the correct form class via getForm()
 * - Displays questions with automatic scroll-to-error support
 * - Handles submission and updates button state
 */

import { useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Fuse from "fuse.js";

import NextButton from "../components/NextButton";
import PersistScrollView from "../components/PersistScrollView";

import { alertError, openInMaps } from "../utils";
import DanceClub from "../utils/forms/DanceClub";
import LibraryMusicHour from "../utils/forms/LibraryMusicHour";
import MusicByTheTracks from "../utils/forms/MusicByTheTracks";
import RequestConcert from "../utils/forms/RequestConcert";
import colors from "../constants/colors";

// Factory: choose form class by event title using fuzzy matching
function getForm(title, date, location, navigation, scrollRef) {
  const eventTitle = title.trim();

  // Define form options with their exact names and constructors
  const formOptions = [
    {
      name: "LIBRARY MUSIC HOUR",
      constructor: LibraryMusicHour,
      aliases: ["Library Music Hour", "Library Music", "Music Hour"],
    },
    {
      name: "MUSIC BY THE TRACKS",
      constructor: MusicByTheTracks,
      aliases: ["Music by the Tracks", "Music Tracks", "By the Tracks"],
    },
    {
      name: "REQUEST A CONCERT",
      constructor: RequestConcert,
      aliases: ["Request a Concert", "Request Concert", "Concert Request"],
    },
    {
      name: "AUDACITY DANCE CLUB",
      constructor: DanceClub,
      aliases: ["Audacity Dance Club", "Dance Club", "Dance"],
    },
  ];

  // Create searchable list with all names and aliases
  const searchList = formOptions.flatMap((option) => [
    { name: option.name, constructor: option.constructor },
    ...option.aliases.map((alias) => ({
      name: alias,
      constructor: option.constructor,
    })),
  ]);

  // Configure Fuse for fuzzy search
  const fuse = new Fuse(searchList, {
    keys: ["name"],
    threshold: 0.2, // Lower = more strict matching (0.0 = exact, 1.0 = match anything)
    ignoreLocation: true,
    ignoreFieldNorm: true,
  });

  // Search for the best match
  const results = fuse.search(eventTitle);

  if (results.length > 0) {
    const bestMatch = results[0].item;
    return new bestMatch.constructor(date, location, navigation, scrollRef);
  }

  alertError(`Unknown form title "${eventTitle}" in getForm`);
  return null;
}

export default function VolunteerFormScreen({ navigation, route }) {
  // Extract parameters from navigation
  const { title, location, date } = route.params;
  const scrollRef = useRef(null);
  const [buttonText, setButtonText] = useState("Submit");

  // Initialize form instance based on title
  const form = getForm(
    title.trim().toUpperCase(),
    date,
    location,
    navigation,
    scrollRef,
  );
  if (!form) {
    // If unknown, return to Home screen
    navigation.navigate("Home", { forceRerender: true });
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Keyboard-aware container to avoid hiding inputs */}
      <KeyboardAvoidingView
        style={[
          styles.body,
          {
            height: Dimensions.get("window").height - 100,
            width: Dimensions.get("window").width,
          },
        ]}
        behavior="height"
      >
        {/* Scrollable form questions area */}
        <PersistScrollView scrollRef={scrollRef}>
          <View style={styles.questions}>
            {/* Event title, date, and optional location with map link */}
            <View style={styles.header}>
              <Text
                style={[styles.headerText, { fontWeight: "bold" }]}
                selectable={true}
              >
                {title}
              </Text>
              {date == null ? null : (
                <Text style={styles.headerText} selectable={true}>
                  {date}
                </Text>
              )}
              {location == null ? null : (
                <Pressable onPress={() => openInMaps(location)}>
                  <Text
                    style={[styles.headerText, styles.locationText]}
                    selectable={true}
                  >
                    {location}
                  </Text>
                </Pressable>
              )}
            </View>
            {/* Render each question component from form */}
            <View style={styles.form}>
              {form
                .questions()
                .filter((question) => question?.isVisible())
                .map((question) => question.component)}
            </View>
            {/* Submit button triggers form.submit() */}
            <Pressable
              style={styles.submitButton}
              onPress={async () => {
                // Check if form is valid before showing "Submitting..."
                let invalidResponses = 0;
                try {
                  invalidResponses = form.validate();
                } catch (error) {
                  invalidResponses = 1; // Assume invalid if error occurs
                }
                if (invalidResponses > 0) {
                  // Show error alert with count of invalid questions
                  const questionText =
                    invalidResponses === 1 ? "question" : "questions";
                  const hasText = invalidResponses === 1 ? "has" : "have";
                  Alert.alert(
                    "Error",
                    `${invalidResponses} ${questionText} ${hasText} invalid or missing responses. Please fix all responses highlighted in red to submit this form.`,
                    [{ text: "OK" }],
                  );
                  // Don't show "Submitting..." if validation fails
                  // Do not call form.submit() here; error alert is already shown
                } else {
                  // Only show "Submitting..." if validation passes
                  setButtonText("Submitting...");
                  await form.submit();
                  setButtonText("Submit");
                }
              }}
            >
              <NextButton>{buttonText}</NextButton>
            </Pressable>
          </View>
        </PersistScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: "7%",
    alignItems: "stretch",
    flexDirection: "column",
  },
  body: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "stretch",
  },
  form: {
    alignItems: "stretch",
  },
  header: {
    alignItems: "center",
    textAlign: "center",
    paddingVertical: 20,
  },
  questions: {
    paddingHorizontal: 30,
  },
  headerText: {
    fontSize: 18,
    flexWrap: "wrap",
    textAlign: "center",
  },
  checkBoxesContainer: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "column",
    textAlignVertical: "center",
  },
  uploadsContainer: {
    flex: 3.5,
    justifyContent: "center",
    flexDirection: "column",
    textAlignVertical: "center",
    fontSize: 20,
  },
  otherInfoContainer: {
    flex: 1.2,
  },
  submitButton: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    marginBottom: 50,
  },
  locationText: {
    textDecorationLine: "underline",
    color: colors.primary,
  },
});
