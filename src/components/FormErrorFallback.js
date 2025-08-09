import React from 'react';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FormErrorFallback = ({ error, resetError }) => {
  const navigation = useNavigation();

  const handleRedirect = () => {
    navigation.navigate('EmbeddedFormScreen', {
      formURL: 'https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform', // <-- replace with real URL
    });
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ color: 'red', marginBottom: 10 }}>
        Something went wrong: {error.message}
      </Text>
      <Button title="Use embedded form instead" onPress={handleRedirect} />
      <View style={{ marginTop: 10 }}>
        <Button title="Try again" onPress={resetError} />
      </View>
    </View>
  );
};

export default FormErrorFallback;
