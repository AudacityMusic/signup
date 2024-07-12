import {
  Pressable,
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  Image,
  ImageBackground,
} from "react-native";
import NextButton from "../components/NextButton";
import BackButton from "../components/BackButton";
import { LinearGradient } from "expo-linear-gradient";
import CheckBoxQuery from "../components/CheckBoxQuery";
import UploadButton from "../components/UploadButton";
import TextField from "../components/TextField";

export default function OtherInfoScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.checkBoxesContainer}>
        <View
          style={{
            paddingLeft: "4%",
            paddingRight: "20%",
            flex: 1,
            justifyContent: "space-between",
            paddingTop: "2%",
            flexDirection: "column",
          }}
        >
          <CheckBoxQuery
            question={
              "Do you give permission for Audacity Music Club to post recordings of your performance on public websites? "
            }
          />
          <CheckBoxQuery
            question={
              "My parent has given their consent for my participation. "
            }
          />
        </View>
      </View>
      <View style={styles.uploadsContainer}>
        <View>
          <Text style={{ paddingBottom: "3%" }}>
            Our volunteer piano accompanist can provide sight reading
            accompaniment for entry level players. To request this service,
            upload the main score AND accompaniment score in one PDF file. (100
            MB file size limit)
          </Text>
          <UploadButton />
        </View>
        <View style={{ paddingTop: "3%" }}>
          <Text style={{ paddingBottom: "3%" }}>
            Upload your Library Band Ensemble profile as one PDF file.
          </Text>
          <UploadButton />
        </View>
      </View>
      <View style={styles.otherInfoContainer}>
        <TextField
          title={
            "Other Information, such as special requests in sequence arrangement (optional) "
          }
        />
      </View>
      <View style={styles.nextContainer}>
        <Pressable style={[{ marginBottom: "5%", marginRight: "4%" }]}>
          <NextButton />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },

  checkBoxesContainer: {
    flex: 2.5,
  },
  uploadsContainer: {
    flex: 3.5,
    paddingLeft: "4%",
    paddingRight: "20%",
    marginTop: "3%",
    justifyContent: "space-evenly",
  },
  otherInfoContainer: {
    paddingTop: "3%",
    flex: 1.2,
    paddingLeft: "4%",
    paddingRight: "10%",
    backgroundColor: "re",
  },
  nextContainer: {
    flex: 2.2,
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
});
