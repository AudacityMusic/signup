/**
 * PersistScrollView.js
 * Wraps children in a ScrollView that preserves scroll position and flashes indicators on mount.
 * Props:
 *  - children: React nodes to render inside scroll view
 *  - style: optional styling for ScrollView
 *  - scrollRef: ref to control ScrollView instance
 */

import { useEffect, useRef } from "react";
import { ScrollView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function PersistScrollView({
  children,
  style = {},
  scrollRef = useRef(null),
}) {
  // Flash scroll indicators shortly after mount
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.flashScrollIndicators();
    }, 500);
  }, []);

  return (
    <GestureHandlerRootView>
      {/* Main scroll container with persistent scrollbar */}
      <ScrollView style={style} ref={scrollRef} persistentScrollbar={true}>
        {children}
      </ScrollView>
    </GestureHandlerRootView>
  );
}
