import { StyleSheet, Text, View } from "react-native";
import { Checkbox } from "expo-checkbox";

export default function CheckBoxQuery({question, boxColor, value, setValue, setY=(y)=>{}}) {
  return (
    <View 
      style={styles.container}     
      onLayout={(event) => {
        const { x, y, width, height } = event.nativeEvent.layout;
        setY(y);
      }}
    >
      <Text style={[styles.header, { paddingBottom: "2%", color: boxColor }]}>
        {question}
        <Text style={[styles.red]}>{"*\n"}</Text>
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Checkbox
          color={"#0d79ff"}
          value={value == true}
          onValueChange={() => {setValue(true); console.log("YES")}}
          style={{ borderRadius: 20, transform: [{ scale: 1.3 }] }}
        />
        <Text style={[styles.text, { paddingHorizontal: "3%", color: boxColor }]}>Yes</Text>
        <Text>       </Text>
        <Checkbox
          color={"#0d79ff"}
          value={value == false}
          onValueChange={() => {setValue(false); console.log("NO")}}
          style={{ borderRadius: 20, transform: [{ scale: 1.3 }] }}
        />
        <Text style={[styles.text, { paddingHorizontal: "3%", color: boxColor }]}>No</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  red: {
    color: "red",
  },
  container: {
    flexGrow: 1,
    marginBottom: 25,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  text: {
    fontSize: 25,
  },
  header: {
    fontSize: 25,
  }
});
