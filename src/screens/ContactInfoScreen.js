import { Pressable,View, SafeAreaView, KeyboardAvoidingView,StyleSheet, Text } from "react-native";
import BackButton from "../components/BackButton";
import TextField from "../components/TextField";
import NextButton from "../components/NextButton";

export default function ContactInfoScreen() {
  return (
    // TODO
    <SafeAreaView style={styles.container}>
      <View style={styles.backButton}>
        <Pressable><BackButton/></Pressable>
      </View>

      <View style={styles.header}>
        <Text style={[styles.heading,{textAlign:"center"}]}>Contact Info</Text>
        <Text style={[styles.instructions,{textAlign:"center"}]}>Please fill in the following details about the person who will be performing at the concert.</Text>
      </View>
      <KeyboardAvoidingView style={styles.body} behavior="height">

        <View style={styles.form}>
          <TextField style={styles.field} title="Performer's Full Name "></TextField>
          <TextField style={styles.field} title="City of Residence "></TextField>
          <TextField style={styles.field} title="Phone Number "></TextField>
          <TextField style={styles.field} title="Performer's Age "></TextField>

        </View>
        <Pressable style={styles.nextButton}><NextButton/></Pressable>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    paddingVertical:"7%",
    display: "flex",
    alignItems:"stretch",
    flexDirection: "column",
    flex:1,
    minHeight:"100%"
  },
  body:{
    display: "flex",
    flexDirection: "column",
    justifyContent:"space-between",
    flex:3,
    alignItems:"stretch",
    paddingHorizontal:"8%",

  },
  form:{
    display:"flex",
    alignItems:"stretch",
    flex:6,
  },
  heading:{
    fontSize:64,
    fontWeight:"condensedBold"
  },
  header:{
    alignItems:"center",
    paddingHorizontal:"5%",
    flex:1,
  },
  backButton:{
    alignSelf:"flex-start",
  },
  instructions:{
    fontSize:20,  
    flexWrap:"wrap"
  },
  field:{
    flex:1,
    backgroundColor:"blue"
  },
  nextButton:{
    alignSelf:"flex-end",
    flex:2,
    justifyContent:"flex-end"
  }

});
