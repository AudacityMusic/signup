import { useState } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import DocumentPicker from "react-native-document-picker";

const uploadFile = async () => {
  try {
    const file = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.pdf],
    });
    return file;
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      console.log(error);
      throw "CANCELLED";
    } else {
      throw error;
    }
  }
};

export default function UploadButton({ title, state, setState }) {
  const [fileName, setFileName] = useState("");

  return (
    <View>
      <Text style={styles.label}>
        <Text style={{ color: state.valid ? "black" : "red" }}>{title}</Text>
      </Text>
      <Text style={styles.fileName}>{fileName}</Text>
      <Pressable
        style={styles.upload}
        onPress={async () => {
          const file = await uploadFile();
          setFileName(file?.name);
          setState((prevState) => ({
            ...prevState,
            value: file,
          }));
          console.log(file?.size);
        }}
      >
        <Image
          source={require("./../assets/upload.png")}
          style={{ height: 25, width: 25 }}
        />
        <Text style={styles.uploadText}>Upload</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "700",
    paddingBottom: 10,
  },

  fileName: {
    alignSelf: "center",
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
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
