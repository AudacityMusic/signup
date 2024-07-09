import { useState } from "react";

import {
  Pressable,
  View,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
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
      <View style={styles.backButton}>
        <Pressable>
          <BackButton />
        </Pressable>
      </View>
      <View style={styles.header}>
        <Text style={styles.heading}>{"Contact Info"}</Text>
        <Text style={{fontSize: 10}}>{"\n".repeat(3)}</Text>
        <Text style={styles.instructions}>
          {"Please fill in the following details about the person who will be"} 
          {"performing at the concert."}
        </Text>
      </View>
      <Text style={{fontSize: 10}}>{"\n".repeat(3)}</Text>
      <View style={styles.body}>
        <ScrollView contentContainerStyle={styles.form}>
          <TextField
            title="Performer's Full Name "
            setText={(text) => setFullName(text)}
          ></TextField>
          <TextField
            title="City of Residence "
            setText={(text) => setCity(text)}
          ></TextField>
          <TextField
            title="Phone Number "
            setText={(text) => setPhoneNumber(text)}>
          </TextField>
          <TextField
            title="Performer's Age "
            setText={(text) => setAge(text)}>
          </TextField>
          <TextField
            title="Name of Music Piece "
            setText={(text) => setMusicPiece(text)}>
          </TextField>
          <TextField
            title="Composer of Music Piece "
            setText={(text) => setComposer(text)}>
          </TextField>
          <TextField
            title="Instrument Type "
            setText={(text) => setInstrument(text)}>
          </TextField>
        </ScrollView>
        <Pressable style={styles.nextButton}>
          <NextButton />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: "7%",
    display: "flex",
    alignItems: "stretch",
    flexDirection: "column",
    flex: 1,
    minHeight: "100%",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    flex: 3,
    alignItems: "stretch",
    paddingHorizontal: "8%",
  },
  form: {
    display: "flex",
    alignItems: "stretch",
    flex: 6,
    backgroundColor: "#00ffff",
  },
  heading: {
    fontSize: 45,
    fontWeight: "bold",
  },
  header: {
    alignItems: "center",
    textAlign: "center",
    paddingHorizontal: "5%",
    flex: 1,
  },
  backButton: {
    alignSelf: "flex-start",
  },
  instructions: {
    fontSize: 20,
    flexWrap: "wrap",
  },
  nextButton: {
    alignSelf: "flex-end",
    flex: 2,
    justifyContent: "flex-end",
  },
});
