/**
 * AppleUserProfile.js
 * A component that allows Apple Sign-in users to view and update their profile information.
 * This is necessary because Apple only provides name/email on first sign-in.
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Alert } from "react-native";

import FullWidthButton from "./FullWidthButton";
import TextField from "./TextField";
import { alertError, updateAppleUserData, getAppleUserData } from "../utils";

export default function AppleUserProfile({ onUpdate }) {
  const [nameState, setNameState] = useState({ value: "", y: 0, valid: true });
  const [emailState, setEmailState] = useState({
    value: "",
    y: 0,
    valid: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    loadAppleUserData();
  }, []);

  const loadAppleUserData = async () => {
    try {
      const appleData = await getAppleUserData();
      if (appleData) {
        setNameState((prev) => ({ ...prev, value: appleData.name || "" }));
        setEmailState((prev) => ({ ...prev, value: appleData.email || "" }));
      }
    } catch (error) {
      console.error("Error loading Apple user data:", error);
    }
  };

  const handleSave = async () => {
    // Don't proceed if there are no changes or if loading
    if (!hasChanges || isLoading) {
      return;
    }

    const name = nameState.value.trim();
    const email = emailState.value.trim();

    if (!name) {
      Alert.alert("Required Field", "Please enter your name.");
      setNameState((prev) => ({ ...prev, valid: false }));
      return;
    }

    if (!email) {
      Alert.alert("Required Field", "Please enter your email address.");
      setEmailState((prev) => ({ ...prev, valid: false }));
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address.");
      setEmailState((prev) => ({ ...prev, valid: false }));
      return;
    }

    // Reset validation states
    setNameState((prev) => ({ ...prev, valid: true }));
    setEmailState((prev) => ({ ...prev, valid: true }));

    setIsLoading(true);
    try {
      const success = await updateAppleUserData({
        name: name,
        email: email,
      });

      if (success) {
        setHasChanges(false);
        Alert.alert(
          "Profile Updated",
          "Your profile information has been updated successfully.",
          [
            {
              text: "OK",
              onPress: () => {
                if (onUpdate) {
                  onUpdate();
                }
              },
            },
          ],
        );
      } else {
        alertError("Failed to update profile information. Please try again.");
      }
    } catch (error) {
      alertError(
        "An error occurred while updating your profile: " + error.message,
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNameChange = (newValue) => {
    setNameState((prev) => ({ ...prev, value: newValue, valid: true }));
    setHasChanges(true);
  };

  const handleEmailChange = (newValue) => {
    setEmailState((prev) => ({ ...prev, value: newValue, valid: true }));
    setHasChanges(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Information</Text>
      <Text style={styles.subtitle}>
        Update your name and email address for a better experience.
      </Text>

      <TextField
        title="Full Name"
        subtitle="Enter your full name as you'd like it to appear"
        state={nameState}
        setState={setNameState}
      />

      <TextField
        title="Email Address"
        subtitle="Enter your email address for notifications and updates"
        state={emailState}
        setState={setEmailState}
        keyboardType="email-address"
      />

      <FullWidthButton
        buttonStyle={[
          styles.saveButton,
          (!hasChanges || isLoading) && styles.disabledButton,
        ]}
        textStyle={styles.buttonText}
        onPress={handleSave}
      >
        {isLoading ? "Saving..." : "Save Profile"}
      </FullWidthButton>

      <Text style={styles.note}>
        Note: Apple only provides your name and email during your first sign-in.
        You can update this information here at any time.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
    lineHeight: 22,
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 16,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
  note: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    lineHeight: 20,
  },
});
