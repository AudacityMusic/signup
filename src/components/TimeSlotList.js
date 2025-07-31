/**
 * TimeSlotList.js
 * Manages a dynamic list of time slots with add/remove controls and date pickers.
 * Exports:
 *   - Default component: renders all slots and a date picker modal
 */

import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

import colors from "../constants/colors";
import TimeSlot from "./TimeSlot";

export default function TimeSlotList({ title, state, setState }) {
  const slots = state.value;
  const setSlots = (newSlots) => setState((prev) => ({ ...prev, value: newSlots }));

  return (
    <View style={styles.container}>
      <Text style={styles.title} selectable={true}>
        {title}
        <Text style={{ color: "red" }}> *</Text>
      </Text>
      {slots.map((slot, index) => (
        <View key={index} style={styles.slotRow}>
          <TimeSlot
            // combined range selection: datetime start and time-only end
            slot={slot}
            selectRange={true}
            startPickerMode="datetime"
            endPickerMode="time"
            // no individual title
            title={null}
            // auto-open picker for newly added slots
            autoOpen={slot.start == null && slot.end == null}
            onChange={(updatedSlot) => {
              const newSlots = [...slots];
              newSlots[index] = updatedSlot;
              setSlots(newSlots);
            }}
          />
          <Pressable
            style={styles.button}
            onPress={() => {
              const newSlots = slots.filter((_, i) => i !== index);
              setSlots(newSlots);
            }}
          >
            <EvilIcons name="trash" size={30} color="#FF3B30" />
          </Pressable>
        </View>
      ))}
      <Pressable
        style={styles.button}
        onPress={() => {
          const newSlot = { start: null, end: null };
          setSlots([...slots, newSlot]);
        }}
      >
        <Ionicons name="add-circle-sharp" size={21} color={colors.blue} />
        <Text style={{ color: colors.blue, fontSize: 19 }}> Add Time Slot</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, marginBottom: 10 },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    flexWrap: "wrap",
    color: "black",
  },
  slotRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});
