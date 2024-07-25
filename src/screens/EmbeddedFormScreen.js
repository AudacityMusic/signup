import { Dimensions } from "react-native";
import WebView from "react-native-webview";

export default function EmbeddedFormScreen({ route, navigation }) {
  const { formURL } = route.params;

  return (
    <WebView
      source={{
        width: Dimensions.get("window").width,
        height: Dimensions.get("window").height - 100,
        uri: formURL,
      }}
    />
  );
}
