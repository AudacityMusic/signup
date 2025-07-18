/**
 * TimeSlotList.js
 * Manages a dynamic list of time slots with add/remove controls and date pickers.
 * Exports:
 *   - TimeSlot: model class for a time slot
 *   - RemoveButton: UI to remove a slot
 *   - AddButton: UI to add a new slot
 *   - Default component: renders all slots and a date picker modal
 */

import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import DatePicker from "react-native-date-picker";

import EvilIcons from "@expo/vector-icons/EvilIcons";
import Ionicons from "@expo/vector-icons/Ionicons";

import colors from "../constants/colors";

// Utility: format Date to 'h:mm AM/PM' string
function timeFormatter(date) {
  const hour = date.getHours() % 12 == 0 ? 12 : date.getHours() % 12;
  const minute = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  const period = date.getHours() >= 12 ? "PM" : "AM";
  return `${hour}:${minute} ${period}`;
}

// Utility: format Date to 'Day MM/DD/YY h:mm AM/PM' string
function dateFormatter(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${days[date.getDay()]} ${date.getMonth() + 1}/${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}/${date.getFullYear() - 2000} ${timeFormatter(date)}`;
}

// Utility: compare two times (hours, minutes)
function timeCompare(hour1, minute1, hour2, minute2) {
  if (hour1 < hour2) {
    return -1;
  } else if (hour1 > hour2) {
    return 1;
  } else {
    if (minute1 < minute2) {
      return -1;
    } else if (minute1 > minute2) {
      return 1;
    } else {
      return 0;
    }
  }
}

/**
 * Model for a single time slot with start and end dates.
 */
export class TimeSlot {
  constructor(start = new Date(), end = new Date()) {
    this.start = start;
    this.end = end;
    this.valid = true;
  }

  validate() {
    const start_hour = this.start.getHours();
    const start_minute = this.start.getMinutes();
    const end_hour = this.end.getHours();
    const end_minute = this.end.getMinutes();

    if (this.start >= this.end) {
      this.valid = false;
    } else if (
      timeCompare(start_hour, start_minute, 10, 30) < 0 ||
      timeCompare(start_hour, start_minute, 17, 0) > 0
    ) {
      this.valid = false;
    } else if (timeCompare(end_hour, end_minute, 18, 0) > 0) {
      this.valid = false;
    } else {
      this.valid = true;
    }

    return this.valid;
  }

  toString() {
    return `${dateFormatter(this.start)} - ${timeFormatter(this.end)}`;
  }

  compareTo(other) {
    if (this.start < other.start) {
      return -1;
    } else if (this.start > other.start) {
      return 1;
    } else {
      if (this.end < other.end) {
        return -1;
      } else if (this.end > other.end) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  render(state, setState, index, setIndex, setIsOpen, setIsAdded, setIsStart) {
    return (
      <View
        key={index * 10}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
          alignItems: "center",
        }}
      >
        <View key={index * 10 + 1} style={{ flexDirection: "row" }}>
          <Pressable
            key={index * 10 + 2}
            onPress={() => {
              setIsOpen(true);
              setIsAdded(false);
              setIsStart(true);
              setIndex(index);
            }}
          >
            <Text
              key={index * 10 + 3}
              style={{
                fontSize: 16,
                textDecorationLine: "underline",
                color: this.valid ? "black" : colors.danger,
              }}
            >
              {dateFormatter(this.start)}
            </Text>
          </Pressable>
          <Text key={index * 10 + 4} style={{ fontSize: 16 }}>
            {" "}
            -{" "}
          </Text>
          <Pressable
            key={index * 10 + 5}
            onPress={() => {
              setIsOpen(true);
              setIsAdded(false);
              setIsStart(false);
              setIndex(index);
            }}
          >
            <Text
              key={index * 10 + 6}
              style={{
                fontSize: 16,
                textDecorationLine: "underline",
                color: this.valid ? "black" : colors.danger,
              }}
            >
              {timeFormatter(this.end)}
            </Text>
          </Pressable>
        </View>
        <RemoveButton
          key={index * 10 + 7}
          state={state}
          setState={setState}
          index={index}
        />
      </View>
    );
  }
}

/**
 * Button to remove a specific time slot from the list.
 */
function RemoveButton({ state, setState, index }) {
  return (
    <Pressable
      key={index * 10 + 7}
      style={styles.button}
      onPress={() => {
        setState((previous) => {
          return {
            ...previous,
            value: previous.value
              .slice(0, index)
              .concat(previous.value.slice(index + 1, state.value.length)),
          };
        });
      }}
    >
      <EvilIcons name="trash" size={30} color="#FF3B30" />
    </Pressable>
  );
}

/**
 * Button to add a new time slot to the list and open the date picker.
 */
function AddButton({
  state,
  setState,
  setIndex,
  setIsAdded,
  setIsOpen,
  setIsStart,
}) {
  return (
    <Pressable
      style={styles.button}
      onPress={() => {
        setIsAdded(true);
        setIsStart(true);
        let length = state.value.length;
        setIndex(length);
        setState((previous) => {
          return {
            ...previous,
            value: previous.value.concat([new TimeSlot()]),
          };
        });
        setIsOpen(true);
      }}
    >
      <Ionicons name="add-circle-sharp" size={21} color={colors.blue} />
      <Text style={{ color: colors.blue, fontSize: 19 }}> Add Time Slot</Text>
    </Pressable>
  );
}

/**
 * Date and time selection component for start and end times of a time slot.
 */
export function Select({
  state,
  setState,
  index,
  isAdded,
  isStart,
  setIsStart,
  isOpen,
  setIsOpen,
}) {
  const now = new Date();

  if (state.value.length <= index) {
    return;
  }

  let start = state.value[index].start;
  let end = state.value[index].end;

  return (
    <DatePicker
      modal
      open={isOpen}
      date={
        isStart && isAdded
          ? new Date()
          : isStart || isAdded
            ? new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                start.getHours(),
                start.getMinutes(),
              )
            : new Date(
                now.getFullYear(),
                now.getMonth(),
                now.getDate(),
                end.getHours(),
                end.getMinutes(),
              )
      }
      mode={isStart ? "datetime" : "time"}
      title={isStart ? "Select Start Time" : "Select End Time"}
      minimumDate={
        isStart
          ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0)
          : new Date(
              start.getFullYear(),
              start.getMonth(),
              start.getDate(),
              start.getHours(),
              start.getMinutes(),
            )
      }
      maximumDate={
        isStart
          ? new Date(
              now.getFullYear(),
              now.getMonth() + 3,
              now.getDate(),
              23,
              59,
              59,
            )
          : new Date(
              start.getFullYear(),
              start.getMonth(),
              start.getDate(),
              23,
              59,
              59,
            )
      }
      onConfirm={(date) => {
        if (isStart) {
          setState((previous) => {
            let next = previous.value;
            next[index].start = date;
            return { ...previous, value: next };
          });
          setIsStart(false);

          setIsOpen(false);

          if (isAdded) {
            setIsOpen(true);
          }
        } else {
          setState((previous) => {
            let next = previous.value;
            next[index].end = date;
            return { ...previous, value: next };
          });
          setIsOpen(false);
        }
      }}
      onCancel={() => {
        if (isAdded && isStart) {
          setState((previous) => {
            return {
              ...previous,
              value: previous.value.slice(0, previous.value.length - 1),
            };
          });
        }
        setIsOpen(false);
      }}
    />
  );
}

/**
 * Manages a list of time slots, allowing users to add, remove, and edit slots.
 */
export default function TimeSlotList({ title, state, setState }) {
  const [open, setIsOpen] = useState(false);
  const [start, setIsStart] = useState(true);
  const [added, setIsAdded] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        const y = event.nativeEvent.layout.y;
        setState((prevState) => ({
          ...prevState,
          y,
        }));
      }}
    >
      <Text style={styles.title} selectable={true}>
        {title}
        <Text style={{ color: "red" }}> *</Text>
      </Text>
      <Text
        style={[
          styles.requirements,
          { color: state.valid ? "black" : colors.danger },
        ]}
        selectable={true}
      >
        {
          "Each time slot must start between 10:30 am and 5 pm and end before 6 pm."
        }
      </Text>
      {state.value.map((slot, index) =>
        slot == null || (index == state.value.length - 1 && open && added)
          ? null
          : slot.render(
              state,
              setState,
              index,
              setIndex,
              setIsOpen,
              setIsAdded,
              setIsStart,
            ),
      )}
      <AddButton
        state={state}
        setState={setState}
        setIndex={setIndex}
        setIsAdded={setIsAdded}
        setIsOpen={setIsOpen}
        setIsStart={setIsStart}
      />
      {open ? (
        <Select
          state={state}
          setState={setState}
          index={index}
          isAdded={added}
          isStart={start}
          setIsStart={setIsStart}
          isOpen={open}
          setIsOpen={setIsOpen}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    flexWrap: "wrap",
    color: "black",
  },

  requirements: {
    fontSize: 17,
    color: colors.secondary,
    flexWrap: "wrap",
    marginBottom: 10,
  },

  container: {
    flex: 1,
    marginBottom: 10,
  },

  button: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
});
