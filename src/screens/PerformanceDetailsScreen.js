// PerformanceDetailsScreen.js
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Button } from 'react-native';
import MultipleChoice from './MultipleChoice';
import TextField from './TextField';

const PerformanceDetailsScreen = () => {
  const [performanceType, setPerformanceType] = useState('individual');
  const [timeLimit, setTimeLimit] = useState('');
  const [recordingLink, setRecordingLink] = useState('');

  const performanceOptions = [
    { label: 'Individual performance only', value: 'individual' },
    { label: 'Individual performance and music instrument presentation', value: 'individualPresentation' },
    { label: 'Group performance only', value: 'group' },
    { label: 'Group performance and music instrument presentation', value: 'groupPresentation' },
    { label: 'Library Band Ensemble (Band, Orchestra, or Choir)', value: 'library' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <MultipleChoice
        options={performanceOptions}
        selectedOption={performanceType}
        onSelect={setPerformanceType}
      />
      <TextField
        title="Length of Performance"
        placeholder="Time Limit: X minutes"
        value={timeLimit}
        onChangeText={setTimeLimit}
      />
      <TextField
        title="Recording Link"
        placeholder="Share to YouTube / Google Drive"
        value={recordingLink}
        onChangeText={setRecordingLink}
      />
      <Button title="Next" onPress={() => {}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
});

export default PerformanceDetailsScreen;
