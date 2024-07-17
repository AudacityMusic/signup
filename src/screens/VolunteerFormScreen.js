import { useState, useEffect } from "react";

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

import { getUser } from "./SignInScreen";

import TextField from "../components/TextField";
import CheckBoxQuery from "../components/CheckBoxQuery";
import UploadButton from "../components/UploadButton";
import NextButton from "../components/NextButton";
import MultipleChoice from "../components/MultipleChoice";

export default function VolunteerFormScreen() {
  const [user, setUser] = useState(JSON.parse("{}"));

  useEffect(() => {
    async function asynchronouslyGetUser() {
      return await getUser();
    }
    asynchronouslyGetUser().then(setUser);
  }, []);

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

  const [permissions, setPermissions] = useState(null);
  const [parentalConsent, setParentalConsent] = useState(null);
  const [otherInfo, setOtherInfo] = useState("");

  const basicCheckingVariables = [
    ["instrument", instrument],
    ["composer", composer],
    ["musicPiece", musicPiece],
    ["age", age],
    ["phoneNumber", phoneNumber],
    ["city", city],
  ];

  const [fullNameY, setFullNameY] = useState(0);
  const [cityY, setCityY] = useState(0);
  const [phoneNumberY, setPhoneNumberY] = useState(0);
  const [ageY, setAgeY] = useState(0);
  const [musicPieceY, setMusicPieceY] = useState(0);
  const [composerY, setComposerY] = useState(0);
  const [instrumentY, setInstrumentY] = useState(0);
  const [performanceTypeY, setPerformanceTypeY] = useState(0);
  const [lengthY, setLengthY] = useState(0);
  const [recordingLinkY, setRecordingLinkY] = useState(0);
  const [permissionsY, setPermissionsY] = useState(0);
  const [parentalConsentY, setParentalConsentY] = useState(0);

  const locations = new Map();
  locations.set("fullName", fullNameY);
  locations.set("city", cityY);
  locations.set("phoneNumber", phoneNumberY);
  locations.set("age", ageY);
  locations.set("musicPiece", musicPieceY);
  locations.set("composer", composerY);
  locations.set("instrument", instrumentY);
  locations.set("performanceType", performanceTypeY);
  locations.set("length", lengthY);
  locations.set("recordingLink", recordingLinkY);
  locations.set("permissions", permissionsY);
  locations.set("parentalConsent", parentalConsentY);

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
  const [permissionsColor, setPermissionsColor] = useState("black");
  const [parentalConsentColor, setParentalConsentColor] = useState("black");

  const [scrollObject, setScrollObject] = useState(null);

  const validate = () => {
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
    console.log(permissions);
    console.log(parentalConsent);
    console.log(otherInfo);

    const center = Dimensions.get("window").width / 2;

    if (permissions != null) {
      setPermissionsColor("black");
      console.log("Is null and none the same? " + (null == false));
    } else {
      setPermissionsColor("red");
      scrollObject.scrollTo({
        x: center,
        y: locations.get("permissions"),
        animated: true,
      });
    }

    if (parentalConsent == true || age >= 18) {
      setParentalConsentColor("black");
      console.log("pc");
    } else {
      setParentalConsentColor("red");
      scrollObject.scrollTo({
        x: center,
        y: locations.get("parentalConsent"),
        animated: true,
      });
    }

    try {
      let url = new URL(recordingLink);
      borderColors[8] = "black";
    } catch (error) {
      borderColors[8] = "red";
      console.error(error);
      scrollObject.scrollTo({
        x: center,
        y: locations.get("recordingLink"),
        animated: true,
      });
    }

    if (length > timeLimit || length == 0) {
      borderColors[7] = "red";
      scrollObject.scrollTo({
        x: center,
        y: locations.get("length"),
        behavior: "smooth",
      });
    } else {
      borderColors[7] = "black";
    }

    if (performanceType == "") {
      setPerformanceTypeColor("red");
      scrollObject.scrollTo({
        x: center,
        y: locations.get("performanceType"),
        animated: true,
      });
    } else {
      setPerformanceTypeColor("black");
    }

    let index = 6;

    basicCheckingVariables.forEach(([name, variable]) => {
      if (variable == "0" || variable == 0) {
        borderColors[index] = "red";
        scrollObject.scrollTo({
          x: center,
          y: locations.get(name),
          animated: true,
        });
      } else {
        borderColors[index] = "black";
      }

      index--;
    });

    borderColors.forEach((color) => console.log(color));
    setBorderColors([...borderColors]);
  };

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
          <View style={styles.header}>
            <Text style={styles.heading}>Volunteer Form</Text>
            <Text style={styles.instructions}>
              {"\n"}
              {
                "Please fill in the following details about the person who will be"
              }
              {"performing at the concert."}
              {"\n"}
            </Text>
          </View>
          <View style={styles.form}>
            <TextField
              title="Performer's Full Name "
              defaultText={user.name}
              setText={(text) => setFullName(text)}
              keyboardType="default"
              borderColor={borderColors[0]}
              setY={setFullNameY}
            ></TextField>
            <TextField
              title="City of Residence "
              setText={(text) => setCity(text)}
              keyboardType="default"
              borderColor={borderColors[1]}
              setY={setCityY}
            ></TextField>
            <TextField
              title="Phone Number "
              setText={(text) => setPhoneNumber(text)}
              keyboardType="phone-pad"
              borderColor={borderColors[2]}
              setY={setPhoneNumberY}
            ></TextField>
            <TextField
              title="Performer's Age "
              setText={(text) => setAge(text)}
              keyboardType="numeric"
              borderColor={borderColors[3]}
              setY={setAgeY}
            ></TextField>
            <TextField
              title="Name of Music Piece "
              setText={(text) => setMusicPiece(text)}
              keyboardType="default"
              borderColor={borderColors[4]}
              setY={setMusicPieceY}
            ></TextField>
            <TextField
              title="Composer of Music Piece "
              setText={(text) => setComposer(text)}
              keyboardType="default"
              borderColor={borderColors[5]}
              setY={setComposerY}
            ></TextField>
            <TextField
              title="Instrument Type "
              setText={(text) => setInstrument(text)}
              keyboardType="default"
              borderColor={borderColors[6]}
              setY={setInstrumentY}
            ></TextField>
            <MultipleChoice
              title="Performance Type"
              options={performanceOptions}
              selectedOption={performanceType}
              onSelect={(text) => onSelectionChange(text)}
              color={performanceTypeColor}
              setY={setPerformanceTypeY}
            />
            <TextField
              title={"Length of Performance (min)"}
              subtitle={"Time Limit: " + timeLimit + " minutes"}
              setText={(text) => setLength(text)}
              keyboardType={"numeric"}
              borderColor={borderColors[7]}
              setY={setLengthY}
            />
            <TextField
              title="Recording Link"
              subtitle="Share to YouTube / Google Drive"
              setText={(text) => setRecordingLink(text)}
              keyboardType="url"
              borderColor={borderColors[8]}
              setY={setRecordingLinkY}
            />
            <View style={styles.checkBoxesContainer}>
              <CheckBoxQuery
                question={
                  "Do you give permission for Audacity Music Club to post recordings of your performance on public websites? "
                }
                boxColor={permissionsColor}
                value={permissions}
                setValue={setPermissions}
                setY={setPermissionsY}
              />
              {age < 18 ? (
                <CheckBoxQuery
                  question={
                    "My parent has given their consent for my participation. "
                  }
                  boxColor={parentalConsentColor}
                  value={parentalConsent}
                  setValue={setParentalConsent}
                  setY={setParentalConsentY}
                />
              ) : null}
            </View>
            <View style={styles.uploadsContainer}>
              <View style={{ justifyContent: "center" }}>
                <Text
                  style={{
                    paddingBottom: "3%",
                    fontSize: 18,
                    flexWrap: "wrap",
                  }}
                >
                  Our volunteer piano accompanist can provide sight reading
                  accompaniment for entry level players. To request this
                  service, upload the main score AND accompaniment score in one
                  PDF file. (100 MB file size limit){"\n"}
                </Text>
                <UploadButton />
              </View>
              <View style={{ paddingTop: "3%" }}>
                <Text
                  style={{
                    paddingBottom: "3%",
                    fontSize: 18,
                    flexWrap: "wrap",
                  }}
                >
                  Upload your Library Band Ensemble profile as one PDF file.
                  {"\n"}
                </Text>
                <UploadButton />
              </View>
            </View>
            <View style={styles.otherInfoContainer}>
              <TextField
                title={
                  "Other Information, such as special requests in sequence arrangement (optional)"
                }
                setText={(text) => {
                  setOtherInfo(text);
                }}
                keyboardType="default"
              />
            </View>
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
    fontSize: 30,
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
  },
});
