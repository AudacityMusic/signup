import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Zoom, createZoomListComponent } from "react-native-reanimated-zoom";

import colors from "../constants/colors";

const ZoomFlatList = createZoomListComponent(FlatList);
const { width, height } = Dimensions.get("window");

export default function PostersButton({ posters }) {
  const [showGallery, setShowGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const images = useMemo(() => Array.from(new Set(posters ?? [])), [posters]);
  const count = images.length;
  const looped = useMemo(
    () => (count > 0 ? [...images, ...images, ...images] : []),
    [count, images],
  );

  function openGallery() {
    setCurrentIndex(count);
    setShowGallery(true);
    setTimeout(() => {
      flatListRef.current?.scrollToIndex({ index: count, animated: false });
    }, 0);
  }

  function onMomentumScrollEnd(e) {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    let normalized = idx;

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

    setCurrentIndex(normalized);
  }

  const keyExtractor = useCallback((_, i) => String(i), []);

  const getItemLayout = useCallback(
    (_, i) => ({
      length: width,
      offset: width * i,
      index: i,
    }),
    [],
  );

  const renderItem = useCallback(
    ({ item }) => (
      <View style={styles.imagePage}>
        <Zoom style={styles.image}>
          <Image
            source={{ uri: item }}
            style={styles.image}
            contentFit="contain"
          />
        </Zoom>
      </View>
    ),
    [],
  );

  if (count === 0) return null;

  return (
    <View>
      <Pressable onPress={openGallery} style={styles.button}>
        <MaterialCommunityIcons
          name="image-multiple-outline"
          size={22}
          color={colors.primary}
        />
        <Text style={styles.buttonText}>Show Posters & Programs</Text>
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
          >
            <MaterialCommunityIcons name="close" size={28} color="white" />
          </Pressable>

          <ZoomFlatList
            ref={flatListRef}
            data={looped}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            initialScrollIndex={count}
            onMomentumScrollEnd={onMomentumScrollEnd}
            renderItem={renderItem}
            initialNumToRender={1}
            maxToRenderPerBatch={2}
            windowSize={3}
            removeClippedSubviews
          />

          <Text style={styles.footer}>
            {(currentIndex % count) + 1} / {count}
          </Text>
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
    justifyContent: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  imagePage: {
    width,
    height,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 50,
    paddingLeft: 50,
    paddingRight: 50,
  },
  image: {
    width: "100%",
    height: "100%",
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
