import { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import DatePicker from "react-native-date-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import colors from "../constants/colors";

function timeFormatter(date) {
  const hour = date.getHours() % 12 == 0 ? 12 : date.getHours() % 12;
  const minute = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
  const period = date.getHours() >= 12 ? "PM" : "AM";
  return `${hour}:${minute} ${period}`;
}

function dateFormatter(date) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return `${days[date.getDay()]} ${date.getMonth() + 1}/${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}/${date.getFullYear() - 2000} ${timeFormatter(date)}`;
}

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
          key={10 * index + 7}
          state={state}
          setState={setState}
          index={index}
        />
      </View>
    );
  }
}

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
      {/* <FontAwesome6 name="trash-alt" size={20} color="#FF3B30" /> */}
      <EvilIcons name="trash" size={30} color="#FF3B30" />
    </Pressable>
  );
}

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
      <Ionicons name="add-circle-sharp" size={21} color="#006AFF" />
      <Text style={{ color: "#006AFF", fontSize: 19 }}> Add Time Slot</Text>
    </Pressable>
  );
}

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
            return { ...previous, value: previous.value.slice(0, index - 1) };
          });
        }

        setIsOpen(false);
      }}
    />
  );
}

export default function SlotList({ title, state, setState }) {
  const [open, setIsOpen] = useState(false);
  const [start, setIsStart] = useState(true);
  const [added, setIsAdded] = useState(false);
  const [index, setIndex] = useState(0);

  return (
    <View
      style={styles.container}
      onLayout={(event) => {
        setState((prevState) => ({
          ...prevState,
          y: event.nativeEvent.layout.y,
        }));
      }}
    >
      <Text style={styles.title}>{title}</Text>
      <Text
        style={[
          styles.requirements,
          { color: state.valid ? "black" : colors.danger },
        ]}
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
