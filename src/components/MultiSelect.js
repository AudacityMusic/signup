import { useState } from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function MultiSelect({ state, setState, title, options }) {
    const [selected, setSelected] = useState(new Array(options.length).fill(false));

    return (
        <View
            onLayout={(event) => {
                setState((prevState) => ({
                ...prevState,
                y: event.nativeEvent.layout.y,
                }));
            }}
        >
            <Text style={[styles.title, {"color": state.valid ? "black" : "red"}]}>{title}</Text>
            {options.map((option, index) => (
                <Pressable key={index * 4} onPress={() => {
                    setState(previous => {
                        const newValue = selected[index] 
                            ? previous.value.filter(item => item !== option)
                            : [...previous.value, option];
                        return { ...previous, value: newValue };
                    });

                    setSelected(previous => {
                        const next = [...previous]; // Create a new copy of the array
                        next[index] = !previous[index];
                        return next;
                    });
                }}>
                    <View key={index * 4 + 1} style={{flexDirection: "row"}}>
                        <MaterialCommunityIcons key={index * 4 + 2} name={selected[index] ? "checkbox-marked" : "checkbox-blank-outline"} size={24} color={selected[index] ? "blue" : "black"} />
                        <Text key={index * 4 + 3} style={styles.optionText}>{option}</Text>
                    </View>
                </Pressable>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: "600",
        marginBottom: 10,
        flexWrap: "wrap",
    },

    optionText: {
        fontSize: 16,
        marginLeft: 10,
        flexWrap: "wrap",
    }
});