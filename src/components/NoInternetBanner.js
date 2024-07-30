import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

const NoInternetBanner = () => (
  <View style={styles.container}>
    <Text style={styles.text}>No Internet Connection</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.danger,
    padding: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  text: {
    color: 'white',
    textAlign: 'center',
  },
});

export default NoInternetBanner;
