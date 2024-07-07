import React from 'react';
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';

export default function OtherOpportunities() {
    return (
    <View>
      <Text style={styles.header}>Other Opportunities</Text>
      <View style={styles.cardContainer}>
        <Pressable style={[styles.card, styles.first]}>
          <Image
            style={styles.icon}
            source={require('./../assets/music-note-1.png')}
          />
          <Text style={styles.text}>Request a Concert</Text>
          <Image
            style={styles.arrow}
            source={require('./../assets/caret-left-1.png')}
          />
        </Pressable>
        <View style={styles.divider} />
        <Pressable style={[styles.card, styles.last]}>
          <Image
            style={styles.icon}
            source={require('./../assets/gift.png')}
          />
          <Text style={styles.text}>Make a Donation</Text>
          <Image
            style={styles.arrow}
            source={require('./../assets/caret-left-1.png')}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({

  header: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
  },
  first: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  last: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  icon: {
    width: 15,
    height: 15,
    marginRight: 10,
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#555',
  },
  arrow: {
    width: 20,
    height: 20,
    transform: [{ rotateZ: "180deg" }],
  },
  divider: {
    height: 0.1,
    backgroundColor: '#e0e0e0',
  },
});

