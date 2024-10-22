import { useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function PersistScrollView({
  children,
  style = {},
  scrollRef = useRef(null),
}) {
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.flashScrollIndicators();
    }, 500);
  }, []);

  return (
    <GestureHandlerRootView>
      <ScrollView style={style} ref={scrollRef} persistentScrollbar={true}>
        {children}
      </ScrollView>
    </GestureHandlerRootView>
  );
}
