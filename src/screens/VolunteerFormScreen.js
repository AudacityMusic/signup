import { useState, useEffect } from "react";

import {
  Alert,
  Pressable,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";

import { questions } from "../utils";
import NextButton from "../components/NextButton";

export default function VolunteerFormScreen({ navigation, route }) {
  const { title, location, date } = route.params;
  const [scrollObject, setScrollObject] = useState(null);

  const form = questions(date, location, navigation, scrollObject)[title];

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
              <Text style={styles.instructions}>
                Please fill in the following details about the person who will
                be performing at the concert.
              </Text>
            </View>
            <View style={styles.form}>
              {form.questions()
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
  },
  questions: {
    paddingHorizontal: 30,
  },
  instructions: {
    fontSize: 20,
    flexWrap: "wrap",
    textAlign: "center",
    paddingVertical: 20,
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
