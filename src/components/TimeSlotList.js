/**
 * TimeSlotList.js
 * Manages a dynamic list of time slots with add/remove controls and date pickers.
 * Exports:
 *   - Default component: renders all slots and a date picker modal
 */

import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

import colors from "../constants/colors";
import TimeSlot from "./TimeSlot";

export default function TimeSlotList({ 
  title, 
  state, 
  setState,
  startTitle = "Start Date",
  endTitle = "End Date",
  combinedTitle = "Select Time Slot"
}) {
  const slots = state.value;
  const setSlots = (newSlots) => setState((prev) => ({ ...prev, value: newSlots }));
  const [isAddingSlot, setIsAddingSlot] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.title} selectable={true}>
        {title}
        <Text style={{ color: "red" }}> *</Text>
      </Text>
      {slots.map((slot, index) => (
        <View key={index} style={styles.slotRow}>
          <TimeSlot
            // Use range selection only for empty slots, independent for filled slots
            slot={slot}
            selectRange={!(slot.start && slot.end)}
            startPickerMode="datetime"
            endPickerMode="time"
            // don't auto-open for existing slots
            autoOpen={false}
            startTitle={startTitle}
            endTitle={endTitle}
            onChange={(updatedSlot) => {
              const newSlots = [...slots];
              newSlots[index] = updatedSlot;
              setSlots(newSlots);
            }}
          />
          {(slot.start || slot.end) && (
            <Pressable
              style={styles.button}
              onPress={() => {
                const newSlots = slots.filter((_, i) => i !== index);
                setSlots(newSlots);
              }}
            >
              <EvilIcons name="trash" size={30} color="#FF3B30" />
            </Pressable>
          )}
        </View>
      ))}
      {isAddingSlot && (
        <TimeSlot
          slot={{ start: null, end: null }}
          selectRange={true}
          startPickerMode="datetime"
          endPickerMode="time"
          autoOpen={true}
          startTitle={startTitle}
          endTitle={endTitle}
          onChange={(updatedSlot) => {
            // Only add to slots array if both dates are set
            if (updatedSlot.start && updatedSlot.end) {
              setSlots([...slots, updatedSlot]);
              setIsAddingSlot(false);
            }
          }}
          onCancel={() => {
            // Remove the temporary slot on cancel
            setIsAddingSlot(false);
          }}
        />
      )}
      <Pressable
        style={styles.button}
        onPress={() => {
          if (!isAddingSlot) {
            setIsAddingSlot(true);
          }
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
