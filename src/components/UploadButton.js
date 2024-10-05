import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import {
  GDrive,
  MimeTypes,
} from "@robinbobin/react-native-google-drive-api-wrapper";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import DocumentPicker from "react-native-document-picker";
import * as fs from "react-native-fs";

import colors from "../constants/colors";
import { alertError } from "../utils";

const selectFile = async () => {
  try {
    const file = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.pdf],
    });
    return file;
  } catch (error) {
    if (!DocumentPicker.isCancel(error)) {
      alertError(`In selectFile: ${error}`);
    }
  }
};

async function getAccessToken() {
  try {
    const accessToken = await AsyncStorage.getItem("access-token");
    if (accessToken === null) {
      alertError("Undefined access token in getAccessToken");
    }
    return accessToken;
  } catch (error) {
    alertError(`In getAccessToken: ${error}`);
  }
}

export default function UploadButton({
  title,
  state,
  setState,
  navigation,
  required = false,
}) {
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
      <Text style={styles.title}>
        {title}
        {required ? <Text style={{ color: "red" }}> *</Text> : null}
      </Text>
      {fileName == null ? null : (
        <Text style={styles.otherInfo}>{fileName}</Text>
      )}
      <Pressable
        style={styles.upload}
        onPress={async () => {
          if (GoogleSignin.getCurrentUser() == null) {
            Alert.alert(
              "File upload is unavailable",
              "The upload feature uses Google Drive to share your file with Audacity Music Club. Please log in with a Google account to use this feature.",
              [
                {
                  text: "Go to Profile",
                  onPress: () => {
                    navigation.navigate("Account");
                  },
                },
                {
                  text: "Cancel",
                  isPreferred: true,
                },
              ],
            );
            return;
          }
          const accessToken = await getAccessToken();
          const googleDrive = new GDrive();
          googleDrive.accessToken = accessToken;
          googleDrive.fetchTimeout = 20000; // 20 seconds

          const file = await selectFile();
          if (file == null) {
            return;
          }
          const fileData = await fs.readFile(file.uri, "base64");

          let id = "";

          try {
            setFileName("Uploading...");
            const googleFile = await googleDrive.files
              .newMultipartUploader()
              .setIsBase64(true)
              .setData(fileData, MimeTypes.PDF)
              .setRequestBody({
                parents: ["root"],
                name: file.name,
              })
              .execute();
            id = googleFile.id;
            await googleDrive.permissions.create(
              id,
              {},
              {
                role: "reader",
                type: "anyone",
              },
            );
          } catch (error) {
            if (error.name == "AbortError") {
              Alert.alert(
                "File upload aborted",
                "Your file could not be uploaded due to a connection error. Please check your Internet connection and try again.",
              );
            } else if (error.__response?.status == 403) {
              Alert.alert(
                "Permission Denied",
                'Audacity Music Club does not have permission to share files associated with your Google account.\n\nTo enable this feature, please go to your profile, clear your data, and reauthenticate your Google account. When prompted to select what the app can access, tap on the checkbox to "see, edit, create, and delete Google files in this app."',
                [
                  {
                    text: "Go to Profile",
                    onPress: () => {
                      navigation.navigate("Account");
                    },
                  },
                  {
                    text: "Cancel",
                    isPreferred: true,
                  },
                ],
              );
            } else {
              alertError("Error uploading file: " + error);
            }
            setFileName("Upload failed");
            return;
          }

          setFileName(file.name);

          setState((prevState) => ({
            ...prevState,
            value: [`https://drive.google.com/open?id=${id}`, file.size],
          }));
        }}
      >
        <Feather name="upload" size={25} color="black" />
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
  title: {
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
    borderWidth: 2,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  uploadText: {
    fontSize: 18,
    paddingLeft: "3%",
  },
});
