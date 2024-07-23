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

import { getUser } from "../utils";

import TextField from "../components/TextField";
import CheckBoxQuery from "../components/CheckBoxQuery";
import UploadButton from "../components/UploadButton";
import NextButton from "../components/NextButton";
import MultipleChoice from "../components/MultipleChoice";

class Question {
  constructor({ component, validate = (_) => true, isVisible = () => true }) {
    this.component = component;
    this.validate = () => !isVisible() || validate(component.props.state.value);
    this.isVisible = isVisible;
    this.state = component.props.state;
    this.setState = component.props.setState;
    this.y = component.props.state.y;
  }
}

export default function VolunteerFormScreen() {
  function emptyQuestionState(initial = null) {
    return useState({ value: initial, y: null, valid: true });
  }

  const [fullName, setFullName] = emptyQuestionState();

  useEffect(() => {
    (async () => {
      try {
        const user = await getUser();
        setFullName((prevState) => ({ ...prevState, value: user?.name }));
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const [city, setCity] = emptyQuestionState();
  const [phoneNumber, setPhoneNumber] = emptyQuestionState();
  const [age, setAge] = emptyQuestionState();
  const [musicPiece, setMusicPiece] = emptyQuestionState();
  const [composer, setComposer] = emptyQuestionState();
  const [instrument, setInstrument] = emptyQuestionState();
  const [performanceType, setPerformanceType] = emptyQuestionState();
  const [length, setLength] = emptyQuestionState();
  const [recordingLink, setRecordingLink] = emptyQuestionState();
  const [publicPermission, setPublicPermission] = emptyQuestionState();
  const [parentalConsent, setParentalConsent] = emptyQuestionState();
  const [pianoAccompaniment, setPianoAccompaniment] = emptyQuestionState();
  const [ensembleProfile, setEnsembleProfile] = emptyQuestionState();
  const [otherInfo, setOtherInfo] = emptyQuestionState();

  const [scrollObject, setScrollObject] = useState(null);
  const [timeLimit, setTimeLimit] = useState(0);

  const performanceOptions = {
    individual: { label: "Individual performance only", timeLimit: 8 },
    individualPresentation: {
      label: "Individual performance and music instrument presentation",
      timeLimit: 12,
    },
    group: { label: "Group performance only", timeLimit: 15 },
    groupPresentation: {
      label: "Group performance and music instrument presentation",
      timeLimit: 20,
    },
    ensemble: {
      label: "Library Band Ensemble\n(Band, Orchestra, or Choir)",
      timeLimit: 60,
    },
  };

  const isAtLeast = (value, len) => value?.trim().length >= len;
  const isNotEmpty = (value) => isAtLeast(value, 1);

  const questions = [
    new Question({
      component: (
        <TextField
          title="Performer's Full Name"
          key="fullName"
          state={fullName}
          setState={setFullName}
        />
      ),
      validate: (value) => value.trim().split(" ").length >= 2,
    }),

    new Question({
      component: (
        <TextField
          title="City of Residence"
          key="city"
          state={city}
          setState={setCity}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <TextField
          title="Phone Number"
          keyboardType="phone-pad"
          maxLength={11}
          key="phoneNumber"
          state={phoneNumber}
          setState={setPhoneNumber}
        />
      ),
      validate: (value) => isAtLeast(value, 10),
    }),

    new Question({
      component: (
        <TextField
          title="Performer's Age"
          keyboardType="numeric"
          key="age"
          state={age}
          setState={setAge}
        />
      ),
      validate(value) {
        const age = Number(value);
        if (isNaN(age)) {
          return false;
        }
        return age >= 5 && age <= 125;
      },
    }),

    new Question({
      component: (
        <TextField
          title="Name of Music Piece"
          key="musicPiece"
          state={musicPiece}
          setState={setMusicPiece}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <TextField
          title="Name of Composer"
          key="composer"
          state={composer}
          setState={setComposer}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <TextField
          title="Instrument Type"
          key="instrument"
          state={instrument}
          setState={setInstrument}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <MultipleChoice
          title="Performance Type"
          options={performanceOptions}
          onSelect={(text) => {
            setPerformanceType((prevState) => ({
              ...prevState,
              value: text,
            }));
            setTimeLimit(performanceOptions[text].timeLimit);
          }}
          key="performanceType"
          state={performanceType}
          setState={setPerformanceType}
        />
      ),
      validate: isNotEmpty,
    }),

    new Question({
      component: (
        <TextField
          title="Length of Performance (mins)"
          subtitle={`Time Limit: ${timeLimit} minutes`}
          keyboardType="numeric"
          key="length"
          state={length}
          setState={setLength}
        />
      ),
      validate(value) {
        const time = Number(value);
        if (isNaN(time)) {
          return false;
        }
        return time > 0 && time <= timeLimit;
      },
    }),

    new Question({
      component: (
        <TextField
          title="Recording Link"
          keyboardType="url"
          key="recordingLink"
          state={recordingLink}
          setState={setRecordingLink}
        />
      ),
      validate(value) {
        try {
          new URL(value);
        } catch {
          return false;
        }
        return true;
      },
    }),

    new Question({
      component: (
        <CheckBoxQuery
          question="Do you give permission for Audacity Music Club to post recordings of your performance on public websites?"
          key="publicPermission"
          state={publicPermission}
          setState={setPublicPermission}
        />
      ),
      validate: (value) => value != null,
    }),

    new Question({
      component: (
        <CheckBoxQuery
          question="My parent has given their consent for my participation."
          key="parentalConsent"
          state={parentalConsent}
          setState={setParentalConsent}
        />
      ),
      validate: (value) => value,
      isVisible: () => age.value < 18,
    }),

    new Question({
      component: (
        <UploadButton
          title="Our volunteer piano accompanist can provide sight reading accompaniment for entry level players. To request this service, upload the main score AND accompaniment score in one PDF file."
          key="pianoAccompaniment"
          state={pianoAccompaniment}
          setState={setPianoAccompaniment}
        />
      ),
      // Only PDF files can be uploaded
      validate: () =>
        (pianoAccompaniment.value?.size ?? 0) <= 104857600, // There are 104,857,600 bytes in 100 MB
    }),

    new Question({
      component: (
        <UploadButton
          title="Upload your Library Band Ensemble profile as one PDF file."
          key="ensembleProfile"
          state={ensembleProfile}
          setState={setEnsembleProfile}
        />
      ),

      isVisible: () => performanceType.value == "ensemble",

      // Only PDF files can be uploaded
      validate: () =>
        (ensembleProfile.value?.size ?? 1000000000) <= 104857600, // There are 104,857,600 bytes in 100 MB
    }),

    new Question({
      component: (
        <TextField
          title="Other Information (optional)"
          key="otherInfo"
          state={otherInfo}
          setState={setOtherInfo}
        />
      ),
    }),
  ];

  function validate() {
    let allValid = true;
    let minInvalidY = Infinity;

    for (const question of questions) {
      const isValid = question.validate();
      question.setState((prevState) => ({
        ...prevState,
        valid: isValid,
      }));

      if (!isValid && question.isVisible) {
        allValid = false;
        if (question.y < minInvalidY) {
          minInvalidY = question.y;
        }
      }
    }

    if (allValid) {
      Alert.alert("All good!");
      return;
    }

    scrollObject.scrollTo({
      x: 0,
      y: minInvalidY,
      animated: true,
    });
  }

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
              {questions
                .filter((question) => question.isVisible())
                .map((question) => question.component)}
            </View>
            <Pressable style={styles.nextButton} onPress={() => validate()}>
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
