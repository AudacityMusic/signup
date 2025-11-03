/**
 * VolunteerFormScreen.js
 * Renders a dynamic sign-up form based on the event type.
 * - Chooses the correct form class via getForm()
 * - Displays questions with automatic scroll-to-error support
 * - Handles submission and updates button state
 */

import { ErrorBoundary } from 'react-native-error-boundary';
import FormErrorFallback from '../components/FormErrorFallback';
import { useRef, useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import NextButton from "../components/NextButton";
import PersistScrollView from "../components/PersistScrollView";

import { alertError, openInMaps } from "../utils";
import DanceClub from "../utils/forms/DanceClub";
import LibraryMusicHour from "../utils/forms/LibraryMusicHour";
import MusicByTheTracks from "../utils/forms/MusicByTheTracks";
import RequestConcert from "../utils/forms/RequestConcert";
import colors from "../constants/colors";

// Factory: choose form class by event title
function getForm(title, date, location, navigation, scrollRef) {
  const eventTitle = title.trim().toUpperCase();

  if (eventTitle == "LIBRARY MUSIC HOUR") {
    return new LibraryMusicHour(date, location, navigation, scrollRef);
  }
  if (eventTitle == "MUSIC BY THE TRACKS") {
    return new MusicByTheTracks(date, location, navigation, scrollRef);
  }
  if (eventTitle == "REQUEST A CONCERT") {
    return new RequestConcert(date, location, navigation, scrollRef);
  }
  if (eventTitle == "AUDACITY DANCE CLUB") {
    return new DanceClub(date, location, navigation, scrollRef);
  }

  alertError(`Unknown form title ${eventTitle} in getForm`);
  return null;
}

// Custom fallback component that accepts the fallbackUrl prop
const CustomFallback = (props) => (
  <FormErrorFallback {...props} fallbackUrl={props.fallbackUrl} />
);

export default function VolunteerFormScreen({ navigation, route }) {
  // Extract parameters from navigation
  const { title, location, date } = route.params;
  const scrollRef = useRef(null);
  const [buttonText, setButtonText] = useState("Submit");

  const fallbackUrls = {
    // add all your events here
    "Cultural Variety Show @ Newark State Of City Address": "http://www.eternityband.org/events",
    "Music by the Tracks 2nd Anniversary": "https://forms.gle/a8cu9teEz5NyXrNXA",
    "Library Music Hour Special Feature": "https://forms.gle/g659PdzrnvLPsT949",
    "Summer Splash Concert": "www.eternityband.org/events",
    "Library Music Hour": "https://forms.gle/dY1xYVqdGv3G6mmd9",
    "Audacity Academy Student Online Tutoring": "https://forms.gle/1KVrVutYBg8pMdva9",
    "Live @ SJC 2025": "www.eternityband.org/events",
    "Independence Day Concert": "www.eternityband.org/events",
    "Library Music Hour Chinese Music Special Feature": "https://forms.gle/g659PdzrnvLPsT949",
    "Wellness Seminars - Audacity STEM Forum": "www.goaudacity.com/stem",
    "Music by the Tracks": "https://forms.gle/a8cu9teEz5NyXrNXA",
    "ColorVision Student Art Fair": "www.funyouth.us/art",
    "Library Music Hour Indian Music Special Feature": "https://forms.gle/g659PdzrnvLPsT949",
    "Summer Blast Concert": "www.eternityband.org/events",
    "Green Trek @ Mission Peak": "www.goaudacity.com/projects",
    "Eternity Band Live @ The Splatter Concert": "www.eternityband.org/events",
    "Eternity Band Live Newark Concert @ Newark Days": "www.eternityband.org/events",
    "Audacity Dance Club Runway By The Lake": "https://forms.gle/Pjc6VCVEkEg5faMM6",
    "Library Music Hour Moon Festival Variety Show": "https://forms.gle/dY1xYVqdGv3G6mmd9",
    "Diwali Variety Show 2025": "https://forms.gle/T1kC4qbtdBmaW5Vs7",
    "ADC Demo Team Recruitment": "https://forms.gle/eTkGHx6ULaFNqGGZ7",
    "Wellness Fair - Audacity STEM Forum": "www.goaudacity.com/stem",
    "AI Workshop - Audacity STEM Forum": "www.goaudacity.com/stem",
  };

  // Normalize the event title to match fallbackUrls keys (case-insensitive)
  const normalizedTitle = Object.keys(fallbackUrls).find(
    key => key.trim().toLowerCase() === title.trim().toLowerCase()
  );

  const fallbackUrl = fallbackUrls[normalizedTitle] || "https://eternityband.org/events/";


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
    <ErrorBoundary
      FallbackComponent={(props) => (
        <FormErrorFallback {...props} fallbackUrl={fallbackUrl} />
      )}
     > 
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
                  setButtonText("Submitting...");
                  await form.submit();
                  setButtonText("Submit");
                }}
              >
                <NextButton>{buttonText}</NextButton>
              </Pressable>
            </View>
          </PersistScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ErrorBoundary>
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
