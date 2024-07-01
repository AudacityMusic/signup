import { StyleSheet, Text, View, Image } from "react-native";

export default function Profile() {
  return (
    <View style={styles.background}>
        <Image style = {styles.image} source={require("./../assets/logo.png")}> 
        </Image>
        <View>
            <Text style = {styles.name}>
                Rick
            </Text>
            <Text style={styles.email}>
                cat
            </Text>

        </View>
    </View>

  );
}

const styles = StyleSheet.create({
    background: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5', // Light grey background color
        padding: 20,
        borderRadius: 10,
        borderColor: '#e0e0e0',
        borderWidth: 1,
        margin: 10,
      },
      image: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
      },
      name: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      email: {
        fontSize: 14,
        color: '#555',
      },
});

