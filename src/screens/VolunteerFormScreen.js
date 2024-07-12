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
  Platform,
} from "react-native";

import BackButton from "../components/BackButton";
import TextField from "../components/TextField";
import NextButton from "../components/NextButton";
import MultipleChoice from "../components/MultipleChoice";

export default function VolunteerFormScreen() {
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState(0);
  const [musicPiece, setMusicPiece] = useState("");
  const [composer, setComposer] = useState("");
  const [instrument, setInstrument] = useState("");

  const [performanceType, setPerformanceType] = useState("");
  const [timeLimit, setTimeLimit] = useState(0);
  const [length, setLength] = useState(0);
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
    console.log("change");

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

    console.log(timeLimit);
  };

  const [borderColors, setBorderColors] = useState([
    "black",
    "black",
    "black",
    "black",
    "black",
    "black",
    "black",
    "black",
    "black",
  ]);

  const [performanceTypeColor, setPerformanceTypeColor] = useState("black");

  const validate = () => {
    const basicCheckingVariables = [
      ["instrument", instrument],
      ["composer", composer],
      ["musicPiece", musicPiece],
      ["age", age],
      ["phoneNumber", phoneNumber],
      ["city", city],
    ];

    console.log(fullName.trim());
    console.log(city.trim());
    console.log(phoneNumber.trim());
    console.log(age);
    console.log(musicPiece.trim());
    console.log(composer.trim());
    console.log(instrument.trim());
    console.log(performanceType.trim());
    console.log(timeLimit);
    console.log(length);
    console.log(recordingLink.trim());

    borderColors[0] = fullName.split(" ").length - 1 == 0 ? "red" : "black";
    setPerformanceTypeColor(performanceType == "" ? "red" : "black");
    borderColors[7] = length > timeLimit || length == 0 ? "red" : "black";

    try {
      let url = new URL(recordingLink);
      borderColors[8] = "black";
    } catch (error) {
      borderColors[8] = "red";
      console.error(error);
    }

    let index = 1;

    basicCheckingVariables.forEach(([name, variable]) => {
      borderColors[index] = (variable == "0" || variable == 0 ? "red" : "black");
      index++;
    });

    borderColors.forEach((color) => console.log(color));
    setBorderColors([...borderColors]);
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
          { height: Dimensions.get("window").height - topHeight - 60 - 10 },
        ]}
        behavior="padding"
      >
        <ScrollView>
          <View style={styles.form}>
            <TextField
              title="Performer's Full Name "
              setText={(text) => setFullName(text)}
              keyboardType="default"
              borderColor={borderColors[0]}
            ></TextField>
            <TextField
              title="City of Residence "
              setText={(text) => setCity(text)}
              keyboardType="default"
              borderColor={borderColors[1]}
            ></TextField>
            <TextField
              title="Phone Number "
              setText={(text) => setPhoneNumber(text)}
              keyboardType="phone-pad"
              borderColor={borderColors[2]}
            ></TextField>
            <TextField
              title="Performer's Age "
              setText={(text) => setAge(text)}
              keyboardType="numeric"
              borderColor={borderColors[3]}
            ></TextField>
            <TextField
              title="Name of Music Piece "
              setText={(text) => setMusicPiece(text)}
              keyboardType="default"
              borderColor={borderColors[4]}
            ></TextField>
            <TextField
              title="Composer of Music Piece "
              setText={(text) => setComposer(text)}
              keyboardType="default"
              borderColor={borderColors[5]}
            ></TextField>
            <TextField
              title="Instrument Type "
              setText={(text) => setInstrument(text)}
              keyboardType="default"
              borderColor={borderColors[6]}
            ></TextField>
            <MultipleChoice
              title="Performance Type"
              options={performanceOptions}
              selectedOption={performanceType}
              onSelect={(text) => onSelectionChange(text)}
              color={performanceTypeColor}
            />
            <TextField
              title={"Length of Performance (min)"}
              subtitle={"Time Limit: " + timeLimit + " minutes"}
              setText={(text) => setLength(text)}
              keyboardType={"numeric"}
              borderColor={borderColors[7]}
            />
            <TextField
              title="Recording Link"
              subtitle="Share to YouTube / Google Drive"
              setText={(text) => setRecordingLink(text)}
              keyboardType="url"
              borderColor={borderColors[8]}
            />
          </View>
          <Pressable style={styles.nextButton} onPress={() => validate()}>
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
