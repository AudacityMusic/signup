import { useState } from "react";

import {
  Pressable,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  Dimensions,
  KeyboardAvoidingView
} from "react-native";

import BackButton from "../components/BackButton";
import TextField from "../components/TextField";
import NextButton from "../components/NextButton";
import MultipleChoice from "../components/MultipleChoice";

export default function PersonalInfoScreen() {
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
        throw new Error("Value " + type + " is an invalid performanceType, or is not added to PerformanceDetailsScreen")
    }
  }

  const printAll = () => {
    console.log(performanceType);
    console.log(timeLimit);
    console.log(length);
    console.log(recordingLink);
  }

  return (
    // TODO
    <SafeAreaView style={styles.container}>
      <Pressable>
        <BackButton />
      </Pressable>
      <Text style={styles.heading}>{"Performance Details"}</Text>
      <Text style={{ fontSize: 8 }}>{"\n"}</Text>
      <KeyboardAvoidingView style={[styles.body, {height: Dimensions.get("window").height - 260}]} behavior="height">
        <ScrollView>
          <View style={styles.form}>
          <MultipleChoice
            title="Performance Type"
            options={performanceOptions}
            selectedOption={performanceType}
            onSelect={(text) => onSelectionChange(text)}
          />
          <TextField
            title="Length of Performance"
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
          <Pressable style={styles.nextButton} onPress={() => {printAll()}}>
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
    flexDirection: "column"
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
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: "5%",
    fontSize: 45,
    fontWeight: "bold",
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
