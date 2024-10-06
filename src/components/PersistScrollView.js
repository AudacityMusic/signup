import { useEffect, useRef } from "react";
import { ScrollView } from "react-native";

export default function PersistScrollView({
  children,
  style = {},
  setScrollRef = (_) => null,
}) {
  const scrollRef = useRef(null);
  setScrollRef(scrollRef);

  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.flashScrollIndicators();
    }, 500);
  });

  return (
    <ScrollView style={style} ref={scrollRef} persistentScrollbar={true}>
      {children}
    </ScrollView>
  );
}
