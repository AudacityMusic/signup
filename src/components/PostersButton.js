import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import colors from "../constants/colors";

const { width, height } = Dimensions.get("window");

export default function PostersButton({ posters }) {
  const [showGallery, setShowGallery] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const images = posters.filter((uri, i) => posters.indexOf(uri) === i);
  const count = images.length;
  const looped = count > 0 ? [...images, ...images, ...images] : [];

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
        <View style={styles.modalContainer}>
          <Pressable
            style={styles.closeButton}
            onPress={() => setShowGallery(false)}
          >
            <MaterialCommunityIcons name="close" size={28} color="white" />
          </Pressable>

          <FlatList
            ref={flatListRef}
            data={looped}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(_, i) => String(i)}
            getItemLayout={(_, i) => ({
              length: width,
              offset: width * i,
              index: i,
            })}
            initialScrollIndex={count}
            onMomentumScrollEnd={onMomentumScrollEnd}
            renderItem={({ item }) => (
              <View style={styles.imagePage}>
                <Image
                  source={{ uri: item }}
                  style={styles.image}
                  contentFit="contain"
                />
              </View>
            )}
          />

          <Text style={styles.footer}>
            {(currentIndex % count) + 1} / {count}
          </Text>
        </View>
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
