import { useState } from "react";

import {
  Dimensions,
  KeyboardAvoidingView,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import NextButton from "../components/NextButton";

import { alertError } from "../utils";
import DanceClub from "../utils/forms/DanceClub";
import LibraryMusicHour from "../utils/forms/LibraryMusicHour";
import MusicByTheTracks from "../utils/forms/MusicByTheTracks";
import RequestConcert from "../utils/forms/RequestConcert";

function getForm(title, date, location, navigation, scrollObject) {
  if (title == "Library Music Hour") {
    return new LibraryMusicHour(date, location, navigation, scrollObject);
  }
  if (title == "Music by the Tracks") {
    return new MusicByTheTracks(date, location, navigation, scrollObject);
  }
  if (title == "Request a Concert") {
    return new RequestConcert(date, location, navigation, scrollObject);
  }
  if (title == "Audacity Dance Club") {
    return new DanceClub(date, location, navigation, scrollObject);
  }

  alertError(`Unknown form title ${title} in getForm`);
}

export default function VolunteerFormScreen({ navigation, route }) {
  const { title, location, date } = route.params;
  const [scrollObject, setScrollObject] = useState(null);

  const form = getForm(title, date, location, navigation, scrollObject);

  return (
    <SafeAreaView style={styles.container}>
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
        <ScrollView
          ref={(ref) => {
            setScrollObject(ref);
          }}
        >
          <View style={styles.questions}>
            <View style={styles.header}>
              <Text style={[styles.headerText, { fontWeight: "bold" }]}>
                {title}
              </Text>
              {date == null ? null : (
                <Text style={styles.headerText}>{date}</Text>
              )}
              {location == null ? null : (
                <Text style={styles.headerText}>{location}</Text>
              )}
            </View>
            <View style={styles.form}>
              {form
                .questions()
                .filter((question) => question?.isVisible())
                .map((question) => question.component)}
            </View>
            <Pressable style={styles.nextButton} onPress={() => form.submit()}>
              <NextButton />
            </Pressable>
          </View>
        </ScrollView>
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
  nextButton: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
    marginBottom: 50,
  },
});
