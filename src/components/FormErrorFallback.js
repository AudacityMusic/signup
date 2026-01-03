/**
 * FormErrorFallback.js
 *
 * This component is shown whenever a volunteer form crashes or fails to load.
 * - Displays the error message to the user.
 * - Provides a "Use embedded form instead" button to redirect to a fallback URL.
 * - Provides a "Try again" button to retry loading the form.
 *
 * Used in VolunteerFormScreen inside an ErrorBoundary from 'react-native-error-boundary'.
 */

import { Linking } from "react-native";
import React from "react";
import { View, Text, Button } from "react-native";
//import { useNavigation } from '@react-navigation/native';

const FormErrorFallback = ({ error, resetError, fallbackUrl }) => {
  //const navigation = useNavigation();

  const handleRedirect = () => {
    Linking.openURL(fallbackUrl);
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ color: "red", marginBottom: 10 }}>
        Something went wrong: {error.message}
      </Text>
      <Button title="Use embedded form instead" onPress={handleRedirect} />
      <View style={{ marginTop: 10 }}>
        <Button title="Try again" onPress={resetError} />
      </View>
    </View>
  );
};

export default FormErrorFallback;
