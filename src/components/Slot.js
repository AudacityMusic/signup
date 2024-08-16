import { useState } from 'react';
import { View, Pressable, Text, StyleSheet } from 'react-native'
import DatePicker from 'react-native-date-picker'
import Ionicons from '@expo/vector-icons/Ionicons';

function timeFormatter(date) {
    const hour = date.getHours() % 12 == 0 ? 12 : date.getHours() % 12;
    const minute = (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
    const period = date.getHours() >= 12 ? "PM" : "AM";
    return `${hour}:${minute} ${period}`;
}

function dateFormatter(date) {
    const days = [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat",
    ];
    return `${days[date.getDay()]} ${date.getMonth() + 1}/${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}/${date.getFullYear() - 2000} ${timeFormatter(date)}`;
}

export class TimeSlot {
    constructor(start=new Date(), end=new Date()) {
        this.start = start;
        this.end = end;
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

    render(state, setState, index, setIndex, setOpen, setAdded, setStart) {
        return (
            <View key={index * 10} style={{flexDirection: "row", justifyContent: "space-between"}}>
                <View key={index * 10 + 1} style={{flexDirection: "row"}}>
                    <Pressable key={index * 10 + 2} onPress={() => {setOpen(true); setAdded(false); setStart(true); setIndex(index);}}>
                        <Text key={index * 10 + 3} style={{fontSize: 20, textDecorationLine: "underline"}}>{dateFormatter(this.start)}</Text>
                    </Pressable>
                    <Text key={index * 10 + 4} style={{fontSize: 20}}> - </Text>
                    <Pressable key={index * 10 + 5} onPress={() => {setOpen(true); setAdded(false); setStart(false); setIndex(index);}}>
                        <Text key={index * 10 + 6} style={{fontSize: 20, textDecorationLine: "underline"}}>{timeFormatter(this.end)}</Text>
                    </Pressable>
                </View>
                <RemoveButton state={state} setState={setState} index={index} />
            </View>
        );
    }
}

function RemoveButton({state, setState, index}) {
    return (
        <Pressable key={index * 10 + 7} style={styles.button} onPress={() => {setState(previous => {return {...previous, value: previous.value.slice(0, index).concat(previous.value.slice(index + 1, state.length))}})}}>
            <Ionicons key={index * 10 + 8} name="remove-circle-sharp" size={23} color="#FF3B30" />
            <Text key={index * 10 + 9} style={{color: "#FF3B30", fontSize: 20}}>  Delete</Text>
        </Pressable>
    );
}

function AddButton({state, setState, setIndex, setAdded, setOpen, setStart}) {
    return (
        <Pressable style={styles.button} onPress={() => {
            setAdded(true); 
            setStart(true);
            let length = state.length;
            setIndex(length);
            setState((previous) => {return {...previous, value: previous.value.concat([new TimeSlot()])}});
            setOpen(true);
        }}>
            <Ionicons name="add-circle-sharp" size={28} color="#006AFF" />
            <Text style={{color: "#006AFF", fontSize: 25}}>  Add Time Slot</Text>
        </Pressable>
    );
}

export function Select({state, setState, index, added, start, setStart, open, setOpen}) {
    const now = new Date();
    console.log(state);
    console.log(index);

    return (
        <DatePicker
            modal
            open={open}
            date={(start && added) ? new Date() : ((start || added) ? new Date(now.getFullYear(), now.getMonth(), now.getDate(), state[index].start.getHours(), state[index].start.getMinutes()) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), state[index].end.getHours(), state[index].end.getMinutes()))}
            mode={start ? "datetime" : "time"}
            title={start ? "Select Start Time" : "Select End Time"}
            minimumDate={start ? new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 30) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), state[index].start.getHours(), state[index].start.getMinutes())}
            maximumDate={start ? new Date(now.getFullYear() + 1, now.getMonth(), now.getDate(), 23, 59) : new Date(now.getFullYear(), now.getMonth(), now.getDate(), 18, 0)}
            onConfirm={(date) => {
                if (start) {
                    setState((previous) => {let next = previous.value; next[index].start = date; return {...previous, value: next}});
                    setStart(false);

                    setOpen(false);
                    
                    if (added) {
                        setOpen(true);
                    }
                }

                else {
                    setState((previous) => {let next = previous.value; next[index].end = date; return {...previous, value: next}})
                    setOpen(false);
                }
            }}

            onCancel={() => {
                if (added && start) {
                    setState((previous) => {return {...previous, value: previous.value.slice(0, index - 1)}});
                }
                
                setOpen(false)
            }}
        />
    );
}

export default function SlotList({slots, setSlots}) {
    const [open, setOpen] = useState(false);
    const [start, setStart] = useState(true);
    const [added, setAdded] = useState(false);
    const [index, setIndex] = useState(0);
  
    return (
      <View style={styles.container}>
        {slots.map((slot, index) => (slot == null) || (((index == slots.length - 1) && open && added)) ? null : slot.render(slots, setSlots, index, setIndex, setOpen, setAdded, setStart))}
        <AddButton state={slots} setState={setSlots} setIndex={setIndex} setAdded={setAdded} setOpen={setOpen} setStart={setStart} />
        {open ? <Select state={slots} setState={setSlots} index={index} added={added} start={start} setStart={setStart} open={open} setOpen={setOpen} /> : null}
      </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 50
    },

    button: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
