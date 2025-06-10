/* 
Trello Instructions:
"Provide a way to open map so people can see where the events are. If there is a way to start navigation it would be even better."
*/

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Linking } from 'react-native';

const MapButton = ({ location }) => {
  const openGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
    Linking.openURL(url);
  };

  return (
    <TouchableOpacity style={styles.mapButton} onPress={openGoogleMaps}>
      <Text style={styles.mapButtonText}>📍 Open in Google Maps</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mapButton: {
    backgroundColor: '#4285F4',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  mapButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default MapButton;