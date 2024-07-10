import { useState } from "react";

import {
  Pressable,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";

import BackButton from "../components/BackButton";
import TextField from "../components/TextField";
import NextButton from "../components/NextButton";
import MultipleChoice from "../components/MultipleChoice";

export default function VolunteerFormScreen() {
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [musicPiece, setMusicPiece] = useState("");
  const [composer, setComposer] = useState("");
  const [instrument, setInstrument] = useState("");

  const [performanceType, setPerformanceType] = useState("");
  const [timeLimit, setTimeLimit] = useState(0);
  const [length, setLength] = useState("");
  const [recordingLink, setRecordingLink] = useState("");

  const performanceOptions = [
    { label: "Individual performance only", value: "individual" },
    {
      label: "Individual performance and music instrument presentation",
      value: "individualPresentation",
    },
    { label: "Group performance only", value: "group" },
    {
      label: "Group performance and music instrument presentation",
      value: "groupPresentation",
    },
    {
      label: "Library Band Ensemble (Band, Orchestra, or Choir)",
      value: "library",
    },
  ];

  const onSelectionChange = (type) => {
    setPerformanceType(type);

    switch (type) {
      case "individual":
        setTimeLimit(8);
        break;

      case "individualPresentation":
        setTimeLimit(12);
        break;

      case "group":
        setTimeLimit(15);
        break;

      case "groupPresentation":
        setTimeLimit(20);
        break;

      case "library":
        setTimeLimit(60);
        break;

      default:
        throw new Error(
          "Value " +
            type +
            " is an invalid performanceType, or is not added to PerformanceDetailsScreen",
        );
    }
  };

  const printAll = () => {
    console.log(fullName);
    console.log(city);
    console.log(phoneNumber);
    console.log(age);
    console.log(musicPiece);
    console.log(composer);
    console.log(instrument);
    console.log(performanceType);
    console.log(timeLimit);
    console.log(length);
    console.log(recordingLink);
  };

  const [topHeight, setTopHeight] = useState(0);

  return (
    <SafeAreaView style={styles.container}>
      <View
        onLayout={(event) => {
          const { x, y, width, height } = event.nativeEvent.layout;
          setTopHeight(height);
        }}
      >
        <Pressable>
          <BackButton />
        </Pressable>
        <View style={styles.header}>
          <Text style={styles.heading}>{"Volunteer Form"}</Text>
          <Text style={styles.instructions}>
            {"\n"}
            {
              "Please fill in the following details about the person who will be"
            }
            {"performing at the concert."}
            {"\n\n"}
          </Text>
        </View>
      </View>
      <KeyboardAvoidingView
        style={[
          styles.body,
          { height: Dimensions.get("window").height - topHeight - 60 },
        ]}
        behavior="height"
      >
        <ScrollView>
          <View style={styles.form}>
            <TextField
              title="Performer's Full Name "
              setText={(text) => setFullName(text)}
              keyboardType="default"
            ></TextField>
            <TextField
              title="City of Residence "
              setText={(text) => setCity(text)}
              keyboardType="default"
            ></TextField>
            <TextField
              title="Phone Number "
              setText={(text) => setPhoneNumber(text)}
              keyboardType="phone-pad"
            ></TextField>
            <TextField
              title="Performer's Age "
              setText={(text) => setAge(text)}
              keyboardType="numeric"
            ></TextField>
            <TextField
              title="Name of Music Piece "
              setText={(text) => setMusicPiece(text)}
              keyboardType="default"
            ></TextField>
            <TextField
              title="Composer of Music Piece "
              setText={(text) => setComposer(text)}
              keyboardType="default"
            ></TextField>
            <TextField
              title="Instrument Type "
              setText={(text) => setInstrument(text)}
              keyboardType="default"
            ></TextField>
            <MultipleChoice
              title="Performance Type"
              options={performanceOptions}
              selectedOption={performanceType}
              onSelect={(text) => onSelectionChange(text)}
            />
            <TextField
              title="Length of Performance (min:ss)"
              subtitle={"Time Limit: " + timeLimit + " minutes"}
              setText={(text) => setLength(text)}
              keyboardType="numeric"
            />
            <TextField
              title="Recording Link"
              subtitle="Share to YouTube / Google Drive"
              setText={(text) => setRecordingLink(text)}
              keyboardType="default"
            />
          </View>
          <Pressable style={styles.nextButton} onPress={() => printAll()}>
            <NextButton />
          </Pressable>
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
    paddingHorizontal: "10%",
  },
  form: {
    alignItems: "stretch",
  },
  heading: {
    fontSize: 45,
    fontWeight: "bold",
  },
  header: {
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: "5%",
  },
  instructions: {
    fontSize: 20,
    flexWrap: "wrap",
  },
  nextButton: {
    alignSelf: "flex-end",
    justifyContent: "flex-end",
  },
});
