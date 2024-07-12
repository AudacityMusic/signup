import { StyleSheet, Text, View, Image } from "react-native";

export default function UploadButton() {
  return (
    <View style={styles.back}>
      <Image
        source={require("./../assets/upload.png")}
        style={{ height: 30, width: 30 }}
      />
      <Text style={styles.backText}>Upload</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  back: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: "2%",
    paddingVertical: "2%",
    borderRadius: 20,
    borderWidth: 3,
  },

  backText: {
    fontSize: 16,
    paddingLeft: "3%",
  },
});