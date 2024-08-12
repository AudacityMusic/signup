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

import forms from "../constants/forms";
import { getUser, FormString, submitForm } from "../utils";

import TextField from "../components/TextField";
import CheckBoxQuery from "../components/CheckBoxQuery";
import UploadButton from "../components/UploadButton";
import NextButton from "../components/NextButton";
import MultipleChoice from "../components/MultipleChoice";

import EndScreen from "./EndScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

export default function VolunteerFormScreen({ navigation, route }) {
  const { title, location, date } = route.params;

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
    "Individual performance only": 8,
    "Individual performance and music instrument presentation": 12,
    "Group performance only": 15,
    "Group performance and music instrument presentation": 20,
    "Library Band Ensemble (Band, Orchestra, or Choir)": 60,
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
          onSelect={(option) => {
            setPerformanceType((prevState) => ({
              ...prevState,
              value: option,
            }));
            setTimeLimit(performanceOptions[option]);
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
      // Optional
      validate: () =>
        pianoAccompaniment.value == null ||
        pianoAccompaniment.value[1] <= 104857600, // There are 104,857,600 bytes in 100 MB
    }),

    new Question({
      component: (
        <UploadButton
          title="Upload your Library Band Ensemble profile as one PDF file."
          key="ensembleProfile"
          state={ensembleProfile}
          setState={setEnsembleProfile}
          required={true}
        />
      ),

      isVisible: () => performanceType.value?.includes("Ensemble"),

      // Only PDF files can be uploaded
      // Required only if visible (selected ensemble option)
      validate: () =>
        ensembleProfile.value != null && ensembleProfile.value[1] <= 104857600, // There are 104,857,600 bytes in 100 MB
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

  async function submit() {
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

    if (!allValid) {
      scrollObject.scrollTo({
        x: 0,
        y: minInvalidY,
        animated: true,
      });
      return;
    }

    if (!forms.hasOwnProperty(title)) {
      Alert.alert(`Form "${title}" is not implemented`);
      return;
    }

    const form = forms[title];
    const formData = new FormString();

    if (title == "Library Music Hour") {
      formData.append(form.location, location);
      formData.append(form.date, date);
      formData.append(form.fullName, fullName.value);
      formData.append(form.city, city.value);
      formData.append(form.phoneNumber, phoneNumber.value);
      formData.append(form.age, age.value);
      formData.append(form.musicPiece, musicPiece.value);
      formData.append(form.composer, composer.value);
      formData.append(form.instrument, instrument.value);
      formData.append(form.length, length.value);
      formData.append(form.recordingLink, recordingLink.value);
      formData.append(form.performanceType, performanceType.value);
      formData.append(
        form.publicPermission,
        publicPermission.value ? "Yes" : "No",
      );
      formData.append(
        form.parentalConsent,
        parentalConsent.value == null
          ? ""
          : parentalConsent.value
            ? "Yes"
            : "No",
      );
      formData.append(
        form.pianoAccompaniment,
        pianoAccompaniment.value ? pianoAccompaniment.value[0] : "",
      );
      formData.append(
        form.ensembleProfile,
        ensembleProfile.value ? ensembleProfile.value[0] : "",
      );
      formData.append(form.otherInfo, otherInfo.value ?? "");
    }
    async function _storeData() {
      try {
        let submittedForms = JSON.parse(
          await AsyncStorage.getItem("submittedForms"),
        );
        submittedForms.push([title + location + date, true]);
        await AsyncStorage.setItem(
          "submittedForms",
          JSON.stringify(submittedForms),
        );
      } catch (err) {
        _createNew();
      }
    }
    async function _createNew() {
      console.log("created new ");
      try {
        let submittedForms = JSON.parse(
          await AsyncStorage.getItem("submittedForms"),
        );
        if (submittedForms.length === 0) {
          let newthing = [[title + location + date, true]];
          await AsyncStorage.setItem(
            "submittedForms",
            JSON.stringify(newthing),
          );
        } else {
          submittedForms.push([title + location + date, true]);
          await AsyncStorage.setItem(
            "submittedForms",
            JSON.stringify(submittedForms),
          );
        }
      } catch (err) {
        console.log("oh no");
      }
    }
    if (submitForm(form.id, formData)) {
      _storeData();
      navigation.navigate("End", { isSuccess: true });
    } else {
      navigation.navigate("End", { isSuccess: false });
    }
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
            <Pressable style={styles.nextButton} onPress={() => submit()}>
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
