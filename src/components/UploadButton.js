import { useState } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import DocumentPicker from "react-native-document-picker";

import colors from "../constants/colors";

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
  const [fileName, setFileName] = useState(null);

  return (
    <View>
      <Text style={styles.label}>{title}</Text>
      {fileName == null ? null : (
        <Text style={styles.otherInfo}>{fileName}</Text>
      )}
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
      <Text
        style={[
          styles.otherInfo,
          {
            color: state.valid ? colors.secondary : colors.danger,
            marginBottom: 20,
          },
        ]}
      >
        100MB Limit
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "700",
    paddingBottom: 10,
  },

  otherInfo: {
    alignSelf: "center",
    textAlign: "center",
    marginVertical: 5,
    fontSize: 14,
  },

  upload: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 20,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  uploadText: {
    fontSize: 18,
    paddingLeft: "3%",
  },
});
