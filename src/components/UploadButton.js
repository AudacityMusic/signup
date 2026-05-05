/**
 * UploadButton.js
 * Provides a PDF upload button using Google Drive API:
 * - Selects a PDF file from the device
 * - Authenticates via stored OAuth refresh token (no user sign-in required)
 * - Uploads to Google Drive with a timestamped unique filename
 * - Sets sharing to public
 * - Updates form state with Drive URL
 * Props:
 *  - title: label text for the upload field
 *  - state: { value: url|string, y: number, valid: boolean }
 *  - setState: setter to update component state
 *  - required: whether a file is mandatory
 */

import Feather from "@expo/vector-icons/Feather";
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

const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID ?? "";
const CLIENT_SECRET = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_SECRET ?? "";
const REFRESH_TOKEN = process.env.EXPO_PUBLIC_GOOGLE_REFRESH_TOKEN ?? "";

function uniqueFileName(original) {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const stamp =
    `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}` +
    `_${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const base = (original.endsWith(".pdf") ? original.slice(0, -4) : original)
    .replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${stamp}_${base}.pdf`;
}

async function getAccessToken() {
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: REFRESH_TOKEN,
      grant_type: "refresh_token",
    }).toString(),
  });
  const json = await res.json();
  return json.access_token ?? null;
}

const selectFile = async () => {
  try {
    return await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.pdf],
    });
  } catch (error) {
    if (DocumentPicker.isCancel(error)) return null;
    alertError(`In selectFile: ${error}`);
  }
};

export default function UploadButton({
  title,
  state,
  setState,
  required = false,
}) {
  const [fileName, setFileName] = useState(null);

  return (
    <View
      onLayout={(event) => {
        const y = event.nativeEvent.layout.y;
        setState((prev) => ({ ...prev, y }));
      }}
    >
      <Text style={styles.title} selectable>
        {title}
        {required && <Text style={{ color: "red" }}> *</Text>}
      </Text>
      {fileName && (
        <Text style={styles.otherInfo} selectable>
          {fileName}
        </Text>
      )}

      <Pressable
        style={styles.upload}
        onPress={async () => {
          const file = await selectFile();
          if (file == null) {
            setFileName(null);
            setState((prev) => ({ ...prev, value: null }));
            return;
          }

          if (file.size > 104857600) {
            Alert.alert(
              "File size too large",
              `${file.name} exceeds the 100 MB limit. Please compress it and try again.`,
            );
            setFileName("Upload too large");
            setState((prev) => ({ ...prev, value: null }));
            return;
          }

          setFileName("Uploading...");
          setState((prev) => ({ ...prev, value: "Uploading" }));

          const accessToken = await getAccessToken();
          if (!accessToken) {
            Alert.alert(
              "File upload is unavailable",
              "Could not authenticate for file upload. Please check your connection and try again.",
            );
            setFileName("Upload failed");
            setState((prev) => ({ ...prev, value: null }));
            return;
          }

          let fileData;
          try {
            fileData = await fs.readFile(file.uri, "base64");
          } catch {
            const base = file.name?.endsWith(".pdf")
              ? file.name.slice(0, -4)
              : file.name;
            Alert.alert(
              "Invalid file",
              `Could not read ${base}. Make sure it is a single accessible PDF.`,
            );
            setFileName("Upload failed");
            setState((prev) => ({ ...prev, value: null }));
            return;
          }

          const googleDrive = new GDrive();
          googleDrive.accessToken = accessToken;
          googleDrive.fetchTimeout = 20000;

          try {
            const uploaded = await googleDrive.files
              .newMultipartUploader()
              .setIsBase64(true)
              .setData(fileData, MimeTypes.PDF)
              .setRequestBody({
                parents: ["root"],
                name: uniqueFileName(file.name),
              })
              .execute();

            await googleDrive.permissions.create(
              uploaded.id,
              {},
              { role: "reader", type: "anyone" },
            );

            setFileName(file.name);
            setState((prev) => ({
              ...prev,
              value: `https://drive.google.com/open?id=${uploaded.id}`,
            }));
          } catch (error) {
            if (error.name === "AbortError") {
              Alert.alert(
                "Upload timed out",
                "Check your internet connection and try again.",
              );
            } else {
              alertError("Error uploading file: " + error);
            }
            setFileName("Upload failed");
            setState((prev) => ({ ...prev, value: null }));
          }
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
        selectable
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
