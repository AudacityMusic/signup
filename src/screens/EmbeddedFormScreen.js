/**
 * EmbeddedFormScreen.js
 * Displays a Google Forms URL within a WebView.
 * Props:
 *  - route.params.formURL: the URL string of the form to embed
 */

import { Dimensions } from "react-native";
import WebView from "react-native-webview";

export default function EmbeddedFormScreen({ route }) {
  // Extract form URL from navigation params
  const { formURL } = route.params;

  return (
    // Render the form inside a WebView, adjusting height to avoid header overlap
    <WebView
      source={{
        uri: formURL,
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height - 100,
      }}
    />
  );
}
