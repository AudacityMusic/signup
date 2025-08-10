/**
 * TimeSlotList.js
 * Manages a dynamic list of time slots with add/remove controls and date pickers.
 * Exports:
 *   - Default component: renders all slots and a date picker modal
 */

import React, { useState, useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

import colors from "../constants/colors";
import TimeSlot from "./TimeSlot.js";

// Add validation method to a slot object
const addValidationToSlot = (slot) => {
  if (slot.validate && slot.validateDetailed) return slot; // Already has validation

  return {
    ...slot,
    validate: function () {
      // Both start and end must be non-null
      if (!this.start || !this.end) return false;

      // Start must be before end
      if (this.start >= this.end) return false;

      // Business rules: 10:30 AM <= start <= 5:00 PM
      const startHour = this.start.getHours();
      const startMinute = this.start.getMinutes();
      const startTimeInMinutes = startHour * 60 + startMinute;
      const minStartTime = 10 * 60 + 30; // 10:30 AM
      const maxStartTime = 17 * 60; // 5:00 PM

      if (
        startTimeInMinutes < minStartTime ||
        startTimeInMinutes > maxStartTime
      )
        return false;

      // Business rules: start < end <= 6:00 PM
      const endHour = this.end.getHours();
      const endMinute = this.end.getMinutes();
      const endTimeInMinutes = endHour * 60 + endMinute;
      const maxEndTime = 18 * 60; // 6:00 PM

      if (endTimeInMinutes > maxEndTime) return false;

      return true;
    },

    validateDetailed: function () {
      const result = { valid: true, invalidStart: false, invalidEnd: false };

      // Both start and end must be non-null
      if (!this.start || !this.end) {
        result.valid = false;
        if (!this.start) result.invalidStart = true;
        if (!this.end) result.invalidEnd = true;
        return result;
      }

      // Start must be before end
      if (this.start >= this.end) {
        result.valid = false;
        result.invalidStart = true;
        result.invalidEnd = true;
        return result;
      }

      // Business rules: 10:30 AM <= start <= 5:00 PM
      const startHour = this.start.getHours();
      const startMinute = this.start.getMinutes();
      const startTimeInMinutes = startHour * 60 + startMinute;
      const minStartTime = 10 * 60 + 30; // 10:30 AM
      const maxStartTime = 17 * 60; // 5:00 PM

      if (
        startTimeInMinutes < minStartTime ||
        startTimeInMinutes > maxStartTime
      ) {
        result.valid = false;
        result.invalidStart = true;
      }

      // Business rules: start < end <= 6:00 PM
      const endHour = this.end.getHours();
      const endMinute = this.end.getMinutes();
      const endTimeInMinutes = endHour * 60 + endMinute;
      const maxEndTime = 18 * 60; // 6:00 PM

      if (endTimeInMinutes > maxEndTime) {
        result.valid = false;
        result.invalidEnd = true;
      }

      return result;
    },
  };
};

export default function TimeSlotList({
  title,
  state,
  setState,
  startTitle = "Start Date",
  endTitle = "End Date",
  combinedTitle = "Select Time Slot",
  subheader = null,
}) {
  const slots = state.value;
  const setSlots = (newSlots) => {
    // Ensure all slots have validation method
    const slotsWithValidation = newSlots.map(addValidationToSlot);
    setState((prev) => ({ ...prev, value: slotsWithValidation }));
  };
  const [isAddingSlot, setIsAddingSlot] = useState(false);

  // Only show red styling when there are invalid slots OR the list is empty (after validation attempt)
  const hasInvalidSlots =
    !state.valid &&
    (slots.length === 0 ||
      slots.some((slot) => slot.validate && !slot.validate()));

  // Ensure existing slots have validation methods when component mounts
  useEffect(() => {
    if (slots.length > 0) {
      const needsValidation = slots.some((slot) => !slot.validate);
      if (needsValidation) {
        const slotsWithValidation = slots.map(addValidationToSlot);
        setState((prev) => ({ ...prev, value: slotsWithValidation }));
      }
    }
  }, [slots, setState]);

  return (
    <View style={styles.container}>
      <Text
        style={[styles.title, hasInvalidSlots && { color: "red" }]}
        selectable={true}
      >
        {title}
        <Text style={{ color: "red" }}> *</Text>
      </Text>
      {subheader && (
        <Text style={[styles.subheader, hasInvalidSlots && { color: "red" }]}>
          {subheader}
        </Text>
      )}
      {slots.map((slot, index) => (
        <View key={index}>
          <View style={styles.slotRow}>
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
              validationResult={
                state.valid
                  ? { valid: true, invalidStart: false, invalidEnd: false }
                  : slot.validateDetailed
                    ? slot.validateDetailed()
                    : { valid: true, invalidStart: false, invalidEnd: false }
              }
              onChange={(updatedSlot) => {
                const newSlots = [...slots];
                newSlots[index] = addValidationToSlot(updatedSlot);
                setSlots(newSlots);

                // Reset validation state when slot is modified
                setState((prev) => ({ ...prev, valid: true }));
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
          isValid={state.valid}
          onChange={(updatedSlot) => {
            // Only add to slots array if both dates are set
            if (updatedSlot.start && updatedSlot.end) {
              setSlots([...slots, addValidationToSlot(updatedSlot)]);
              setIsAddingSlot(false);
              // Reset validation state when new slot is added
              setState((prev) => ({ ...prev, valid: true }));
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
  subheader: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  slotRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});
