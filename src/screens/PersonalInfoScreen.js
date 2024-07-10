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

export default function PersonalInfoScreen() {
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [age, setAge] = useState("");
  const [musicPiece, setMusicPiece] = useState("");
  const [composer, setComposer] = useState("");
  const [instrument, setInstrument] = useState("");

  return (
    // TODO
    <SafeAreaView style={styles.container}>
      <Pressable>
        <BackButton />
      </Pressable>
      <View style={styles.header}>
        <Text style={styles.heading}>{"Personal Info"}</Text>
        <Text style={styles.instructions}>
          {"\n"}
          {"Please fill in the following details about the person who will be"} 
          {"performing at the concert."}
          {"\n\n"}
        </Text>
      </View>
      <KeyboardAvoidingView style={[styles.body, {height: Dimensions.get("window").height - 380}]} behavior="height">
        <ScrollView>
          <View style={styles.form}>
            <TextField
              title="Performer's Full Name "
              setText={(text) => setFullName(text)}
              keyboardType="default">
            </TextField>
            <TextField
              title="City of Residence "
              setText={(text) => setCity(text)}
              keyboardType="default">
            </TextField>
            <TextField
              title="Phone Number "
              setText={(text) => setPhoneNumber(text)}
              keyboardType="phone-pad">
            </TextField>
            <TextField
              title="Performer's Age "
              setText={(text) => setAge(text)}
              keyboardType="numeric">
            </TextField>
            <TextField
              title="Name of Music Piece "
              setText={(text) => setMusicPiece(text)}
              keyboardType="default">
            </TextField>
            <TextField
              title="Composer of Music Piece "
              setText={(text) => setComposer(text)}
              keyboardType="default">
            </TextField>
            <TextField
              title="Instrument Type "
              setText={(text) => setInstrument(text)}
              keyboardType="default">
            </TextField>
          </View>
          <Pressable style={styles.nextButton}>
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
