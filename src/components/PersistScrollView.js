import { useEffect, useRef } from "react";
import { ScrollView } from "react-native";

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
    <ScrollView style={style} ref={scrollRef} persistentScrollbar={true}>
      {children}
    </ScrollView>
  );
}
