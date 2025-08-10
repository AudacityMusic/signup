/**
 * PersistScrollView.js
 * Wraps children in a FlatList that preserves scroll position and flashes indicators on mount.
 * Props:
 *  - children: React nodes to render inside scroll view
 *  - style: optional styling for FlatList
 *  - scrollRef: ref to control FlatList instance
 */

import { useEffect, useRef, useMemo } from "react";
import { FlatList } from "react-native";
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

  // Convert children to array for FlatList
  // Convert children to array for FlatList, memoized for performance
  const childrenArray = useMemo(
    () => (Array.isArray(children) ? children : [children]),
    [children]
  );

  const renderItem = ({ item }) => item;

  return (
    <GestureHandlerRootView>
      {/* Main scroll container with vertical scroll indicator */}
      <FlatList
        style={style}
        ref={scrollRef}
        data={childrenArray}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={true}
      />
    </GestureHandlerRootView>
  );
}
