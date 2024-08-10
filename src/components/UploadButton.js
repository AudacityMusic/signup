import { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import DocumentPicker from "react-native-document-picker";
import * as fs from "react-native-fs";
import {
  GDrive,
  MimeTypes,
} from "@robinbobin/react-native-google-drive-api-wrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../constants/colors";

const uploadFile = async () => {
  try {
    const file = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.pdf],
    });
    return file;
  } catch (error) {
    if (!DocumentPicker.isCancel(error)) {
      throw error;
    }
  }
};

export default function UploadButton({ title, state, setState }) {
  const [fileName, setFileName] = useState(null);

  return (
    <View
      onLayout={(event) => {
        setState((prevState) => ({
          ...prevState,
          y: event.nativeEvent.layout.y,
        }));
      }}
    >
      <Text style={styles.label}>{title}</Text>
      {fileName == null ? null : (
        <Text style={styles.otherInfo}>{fileName}</Text>
      )}
      <Pressable
        style={styles.upload}
        onPress={async () => {
          const accessToken = await AsyncStorage.getItem("access-token");
          const googleDrive = new GDrive();
          googleDrive.accessToken = accessToken;
          googleDrive.fetchTimeout = 3000;

          const file = await uploadFile();
          console.log(`FILE: ${file.uri}`);

          const fileData = await fs.readFile(file.uri);
          console.log("FILE DATA");

          let id = "";

          try {
            const googleFile = await googleDrive.files
              .newMultipartUploader()
              .setData(fileData, MimeTypes.PDF)
              .setRequestBody({
                parents: ["root"],
                name: file.name,
              })
              .execute();
            console.log(`GOOGLE FILE: ${googleFile}`);

            id = googleFile.id;
          } catch (error) {
            console.error("Error uploading file:", error);
          }

          console.log(`ID: https://drive.google.com/open?id=${id}`);
          setFileName(file?.name);

          setState((prevState) => ({
            ...prevState,
            value: `https://drive.google.com/open?id=${id}`,
          }));
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
