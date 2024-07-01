
import { StyleSheet, Text, Pressable } from "react-native";

export default function Logout() {
    return (
        <Pressable style = {styles.button}>
            <Text style = {styles.text}> Log Out</Text>
        </Pressable>
    );
  }
  
  const styles = StyleSheet.create({
    button: {
        backgroundColor: '#d9534f',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 110,
        alignItems: 'center',
        justifyContent: 'center',
        width: '95%',
        alignSelf: 'center',
      },
      text:{
        color: 'white',
        fontSize: 18
      }
  });
  