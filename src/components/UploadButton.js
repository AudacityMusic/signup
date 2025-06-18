import Feather from "@expo/vector-icons/Feather";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
    if (DocumentPicker.isCancel(error)) {
      return null;
    }
    alertError(`In selectFile: ${error}`);
  }
};

async function getAccessToken() {
  try {
    const accessToken = await AsyncStorage.getItem("access-token");
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
        const y = event.nativeEvent.layout.y;
        setState((prevState) => ({
          ...prevState,
          y,
        }));
      }}
    >
      <Text style={styles.title} selectable={true}>
        {title}
        {required ? <Text style={{ color: "red" }}> *</Text> : null}
      </Text>
      {fileName == null ? null : (
        <Text style={styles.otherInfo} selectable={true}>
          {fileName}
        </Text>
      )}
      <Pressable
        style={styles.upload}
        onPress={async () => {
          const accessToken = await getAccessToken();
          if (accessToken == null) {
            Alert.alert(
              "File upload is unavailable",
              "The upload feature uses Google Drive to share your file with Audacity Sign Up. Your session may have expired or you may be using an unsupported Apple account. Please log out and log in with a Google account to use this feature.",
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
          setState((prevState) => ({ ...prevState, value: "Uploading" }));

          const googleDrive = new GDrive();
          googleDrive.accessToken = accessToken;
          googleDrive.fetchTimeout = 20000; // 20 seconds

          const file = await selectFile();
          if (file == null) {
            // Cancel
            setFileName(null);
            setState((prevState) => ({ ...prevState, value: null }));
            return;
          }

          let fileData;
          try {
            fileData = await fs.readFile(file.uri, "base64");
          } catch (error) {
            setFileName("Upload failed");
            setState((prevState) => ({ ...prevState, value: null }));

            const fileName = file.name?.endsWith(".pdf")
              ? file.name.slice(0, file.name.length - 4)
              : file.name;

            Alert.alert(
              "Invalid file",
              `Please make sure your file (${fileName}) is a single PDF that can be accessed by the app.`,
            );
            return;
          }
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
            } else if (error.__response?.status == 401) {
              Alert.alert(
                "Invalid Session",
                "Your authentication session is malformed, most likely because your device has old data that is not compatible with the current version of the app. To fix this issue, please go to your profile, clear your data, and log in again with your Google account. We apologize for the inconvenience.",
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
            } else if (error.__response?.status == 403) {
              Alert.alert(
                "Permission Denied",
                'Audacity Sign Up does not have permission to share files associated with your Google account.\n\nTo enable this feature, please go to your profile, clear your data, and reauthenticate your Google account. When prompted to select what the app can access, tap on the checkbox to "see, edit, create, and delete Google files in this app."',
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
            setState((prevState) => ({ ...prevState, value: null }));
            return;
          }

          if (file.size > 104857600) {
            // 100 MB
            Alert.alert(
              "File size too large",
              `Your file ${file.name} has a size of ${file.size} bytes. Please compress your file and upload a smaller version.`,
            );
            setFileName("Upload too large");
            setState((prevState) => ({ ...prevState, value: null }));
            return;
          }

          setFileName(file.name);

          setState((prevState) => ({
            ...prevState,
            value: `https://drive.google.com/open?id=${id}`,
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
        selectable={true}
      >
        PDF only - 100MB Limit
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
