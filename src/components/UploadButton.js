import { useState } from "react";
import { StyleSheet, Text, View, Image, Pressable, Alert } from "react-native";
import DocumentPicker from "react-native-document-picker";
import * as fs from "react-native-fs";
import {
  GDrive,
  MimeTypes,
} from "@robinbobin/react-native-google-drive-api-wrapper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../constants/colors";

const selectFile = async () => {
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

async function getAccessToken() {
  try {
    const accessToken = await AsyncStorage.getItem("access-token");
    console.log(accessToken);
    if (accessToken === null) {
      throw "EMPTY access token";
    }
    return accessToken;
  } catch (error) {
    console.error(error);
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
          const accessToken = await getAccessToken();
          const googleDrive = new GDrive();
          googleDrive.accessToken = accessToken;
          googleDrive.fetchTimeout = 5000; // 5 seconds

          const file = await selectFile();
          console.log(`FILE: ${file.uri}`);

          const fileData = await fs.readFile(file.uri, "base64");
          console.log("FILE DATA");

          let id = "";

          try {
            setFileName(`Uploading ${file.name}...`);
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
            console.log(`ID Fetching Successful: id=${id}`);
            await googleDrive.permissions.create(
              id,
              {},
              {
                role: "reader",
                type: "anyone",
              },
            );
            console.log("Permissions: everyone (with the link) can view");
          } catch (error) {
            if (error.name == "AbortError") {
              console.error(
                "File upload aborted. Use a more stable Internet connection or increase fetchTimeout.",
              );
            } else if (error.__response?.status == 403) {
              Alert.alert(
                "Permission Denied",
                'Audacity Music Club does not have permission to share files associated with your Google account.\n\nTo enable this feature, please go to your profile, clear your data, and reauthenticate your Google account. When prompted to select what the app can access, tap on the checkbox to "see, edit, create, and delete Google files in this app."',
                [
                  {
                    text: "Cancel",
                  },
                  {
                    text: "Go to Profile",
                    isPreferred: true,
                    onPress: () => {
                      navigation.navigate("Account");
                    },
                  },
                ],
              );
            } else {
              console.error("Error uploading file:", error);
            }
            setFileName("Upload failed");
            return;
          }

          console.log(`ID: https://drive.google.com/open?id=${id}`);
          setFileName(file.name);

          setState((prevState) => ({
            ...prevState,
            value: [`https://drive.google.com/open?id=${id}`, file.size],
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
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },

  uploadText: {
    fontSize: 18,
    paddingLeft: "3%",
  },
});
