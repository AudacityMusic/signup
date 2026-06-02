import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  InteractionManager,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Zoom,
  createZoomListWithReanimatedComponent,
} from "react-native-reanimated-zoom";

import colors from "../constants/colors";

const initialDims = Dimensions.get("window");

export default function PostersButton({ posters }) {
  const [showGallery, setShowGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dims, setDims] = useState(initialDims);
  const [failedMap, setFailedMap] = useState({});
  const [hasPositioned, setHasPositioned] = useState(false);

  const flatListRef = useRef(null);

  const images = useMemo(() => Array.from(new Set(posters ?? [])), [posters]);
  const count = images.length;
  const usesLoop = count > 1;

  const looped = useMemo(
    () => (usesLoop ? [...images, ...images, ...images] : images),
    [usesLoop, images]
  );

  const ZoomFlatList = useMemo(
    () => createZoomListWithReanimatedComponent(FlatList),
    []
  );

  const keyExtractor = useCallback((item, i) => `${item}-${i}`, []);

  const getItemLayout = useCallback(
    (_, i) => ({
      length: dims.width,
      offset: dims.width * i,
      index: i,
    }),
    [dims.width]
  );

  const renderItem = useCallback(
    ({ item, index }) => {
      const realIndex = index % count;

      return (
        <View style={{ width: dims.width, height: dims.height }}>
          <Zoom style={{ width: dims.width, height: dims.height }}>
            {failedMap[realIndex] ? (
              <View style={styles.fallback}>
                <Text style={{ color: "white" }}>Image unavailable</Text>
              </View>
            ) : (
              <Image
                source={{ uri: item }}
                style={{ width: dims.width, height: dims.height }}
                contentFit="contain"
                onError={() =>
                  setFailedMap((f) => ({ ...f, [realIndex]: true }))
                }
              />
            )}
          </Zoom>
        </View>
      );
    },
    [dims.width, dims.height, failedMap, count]
  );

  useEffect(() => {
    const sub = Dimensions.addEventListener?.("change", ({ window }) =>
      setDims(window)
    );
    return () => sub?.remove?.();
  }, []);

  function openGallery() {
    const startIndex = usesLoop ? count : 0;

    setCurrentIndex(startIndex);
    setShowGallery(true);
    setFailedMap({});
    setHasPositioned(false);

    InteractionManager.runAfterInteractions(() => {
      flatListRef.current?.scrollToIndex({
        index: startIndex,
        animated: false,
      });
      setHasPositioned(true);
    });
  }

  function onMomentumScrollEnd(e) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / dims.width);
    let normalized = idx;

    if (usesLoop) {
      if (idx < count) {
        normalized = idx + count;
        flatListRef.current?.scrollToIndex({
          index: normalized,
          animated: false,
        });
      } else if (idx >= count * 2) {
        normalized = idx - count;
        flatListRef.current?.scrollToIndex({
          index: normalized,
          animated: false,
        });
      }
    }

    setCurrentIndex(normalized);
  }

  function onScrollToIndexFailed(info) {
    const offset = info.index * dims.width;

    InteractionManager.runAfterInteractions(() => {
      flatListRef.current?.scrollToOffset({
        offset,
        animated: false,
      });
    });
  }

  if (count === 0) return null;

  const displayIndex =
    ((currentIndex % count) + count) % count + 1;

  return (
    <View>
      <Pressable
        onPress={openGallery}
        style={styles.button}
        accessibilityLabel="Show posters"
      >
        <MaterialCommunityIcons
          name="image-multiple-outline"
          size={22}
          color={colors.primary}
        />
        <Text style={styles.buttonText}>
          Show Posters & Programs
        </Text>
      </Pressable>

      <Modal
        visible={showGallery}
        transparent={false}
        animationType="fade"
        onRequestClose={() => setShowGallery(false)}
      >
        <GestureHandlerRootView style={styles.modalContainer}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setShowGallery(false)}
            accessibilityLabel="Close posters"
          >
            <MaterialCommunityIcons
              name="close"
              size={28}
              color="white"
            />
          </Pressable>

          {showGallery && (
            <ZoomFlatList
              ref={flatListRef}
              data={looped}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={keyExtractor}
              getItemLayout={getItemLayout}
              onMomentumScrollEnd={onMomentumScrollEnd}
              onScrollToIndexFailed={onScrollToIndexFailed}
              renderItem={renderItem}
              initialNumToRender={1}
              maxToRenderPerBatch={2}
              windowSize={3}
              removeClippedSubviews={false}
            />
          )}

          {hasPositioned && (
            <Text style={styles.footer}>
              {displayIndex} / {count}
            </Text>
          )}
        </GestureHandlerRootView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.primary,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 22,
    color: colors.primary,
    fontWeight: "500",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    position: "absolute",
    bottom: 30,
    width: "100%",
  },
});
