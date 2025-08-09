/**
 * Profile.js
 * Displays logged-in user's name, email, and profile image or icon.
 * Retrieves user info from AsyncStorage on mount.
 * For Apple users, provides option to update profile information.
 */
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, Pressable, Modal } from "react-native";

import { getUser } from "../utils";
import AppleUserProfile from "./AppleUserProfile";

export default function Profile() {
  // Local user state
  const [user, setUser] = useState(null);
  const [showProfileEditor, setShowProfileEditor] = useState(false);

  // Load user data on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const userData = await getUser();
    setUser(userData);
  };

  // Check if user is signed in with Apple
  const isAppleUser = user?.provider === "apple" || user?.id === "apple";

  // Check if Apple user has incomplete profile
  const hasIncompleteProfile =
    isAppleUser &&
    (!user?.name || !user?.email || user?.name === "" || user?.email === "");

  // Default display values while loading or empty
  let name = user?.name ?? "Loading";
  if (name === "") name = "Anonymous Apple User";
  let email = user?.email ?? "Loading";
  if (email === "") email = "apple.com";

  const handleUpdateProfile = () => {
    setShowProfileEditor(false);
    loadUserData(); // Refresh user data after update
  };

  return (
    <View style={styles.container}>
      {/* User photo if available, else default icon */}
      {user?.photo ? (
        <Image
          style={styles.image}
          source={{ uri: user.photo, width: 60, height: 60 }}
        />
      ) : (
        <FontAwesome
          name="user-circle"
          size={60}
          color="black"
          style={styles.image}
        />
      )}
      {/* Name and email text */}
      <View style={styles.userInfo}>
        <Text style={styles.name} selectable>
          {name}
        </Text>
        <Text style={styles.email} selectable>
          {email}
        </Text>

        {/* Show update profile button for Apple users */}
        {isAppleUser && (
          <Pressable
            style={[
              styles.updateButton,
              hasIncompleteProfile && styles.updateButtonHighlight,
            ]}
            onPress={() => setShowProfileEditor(true)}
          >
            <Text
              style={[
                styles.updateButtonText,
                hasIncompleteProfile && styles.updateButtonTextHighlight,
              ]}
            >
              {hasIncompleteProfile ? "Complete Profile" : "Update Profile"}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Profile Editor Modal */}
      <Modal
        visible={showProfileEditor}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowProfileEditor(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable
              style={styles.closeButton}
              onPress={() => setShowProfileEditor(false)}
            >
              <FontAwesome name="times" size={24} color="#333" />
            </Pressable>
          </View>
          <AppleUserProfile onUpdate={handleUpdateProfile} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5", // Light grey background color
    padding: 15,
    borderRadius: 10,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    margin: 10,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 100,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  updateButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  updateButtonHighlight: {
    backgroundColor: "#FF6B35",
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  updateButtonTextHighlight: {
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  closeButton: {
    padding: 8,
  },
});
