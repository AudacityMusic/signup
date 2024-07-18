import { StyleSheet, Text, View, Image } from "react-native";

export default function UploadButton({ title, state, useState }) {
  return (
    <View>
      <Text style={styles.label}>
        <Text style={{ color: state.valid ? "black" : "red" }}>{title}</Text>
      </Text>
      <View style={styles.upload}>
        <Image
          source={require("./../assets/upload.png")}
          style={{ height: 25, width: 25 }}
        />
        <Text style={styles.uploadText}>Upload</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "700",
    paddingBottom: 10,
  },
  upload: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 20,
    borderWidth: 1.5,
    marginBottom: 20,
  },

  uploadText: {
    fontSize: 18,
    paddingLeft: "3%",
  },
});
