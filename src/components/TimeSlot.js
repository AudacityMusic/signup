import React, { useState, useEffect } from 'react';
import { View, Text, Pressable } from 'react-native';
import DatePicker from 'react-native-date-picker';
import colors from '../constants/colors';


/**
 * TimeSlot: UI component for selecting a single time slot (start/end dates)
 * Props:
 *  - slot: { start: Date|null, end: Date|null }
 *  - onChange: function(updatedSlot)
 *  - title?: string (optional label above picker)
 */
export default function TimeSlot({
  slot,
  onChange,
  title = null,
  startPickerMode = 'datetime',
  endPickerMode = 'datetime',
  selectRange = false,
  autoOpen = false,
}) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState('start');
  const [selectingRange, setSelectingRange] = useState(false);
  const [tempStart, setTempStart] = useState(null);

  function label(date, placeholder) {
    return date ? date.toDateString() : placeholder;
  }

  const valid = slot.start && slot.end ? slot.start < slot.end : true;

  // Formatting helpers
  const formatDateTime = (dt) => dt.toLocaleDateString() + ' ' + dt.toLocaleTimeString();
  const formatTimeOnly = (dt) => dt.toLocaleTimeString();
  const combinedLabel = () => {
    if (slot.start && slot.end) return `${formatDateTime(slot.start)} - ${formatTimeOnly(slot.end)}`;
    return 'Select Time Slot';
  };
  // Auto-open picker for new slots when selectRange is enabled
  useEffect(() => {
    if (autoOpen && selectRange) {
      setSelectingRange(true);
      setMode('start');
      setOpen(true);
    }
  }, [autoOpen, selectRange]);

  return (
    <View style={{ marginVertical: 5 }}>
      {title && !selectRange ? <Text style={{ fontWeight: '600', marginBottom: 4 }}>{title}</Text> : null}
      {selectRange ? (
        <Pressable onPress={() => { setSelectingRange(true); setMode('start'); setOpen(true); }}>
          <Text style={{ textDecorationLine: 'underline', color: valid ? 'black' : colors.danger }}>
            {combinedLabel()}
          </Text>
        </Pressable>
      ) : (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Pressable onPress={() => { setMode('start'); setOpen(true); }}>
            <Text style={{ textDecorationLine: 'underline', color: valid ? 'black' : colors.danger }}>
              {label(slot.start, 'Start Date')}
            </Text>
          </Pressable>
          <Pressable onPress={() => { setMode('end'); setOpen(true); }}>
            <Text style={{ textDecorationLine: 'underline', color: valid ? 'black' : colors.danger }}>
              {label(slot.end, 'End Date')}
            </Text>
          </Pressable>
        </View>
      )}
      <DatePicker
        modal
        open={open}
        date={(selectRange && mode === 'start') ? (tempStart || slot.start || new Date()) : (slot[mode] || new Date())}
        mode={selectRange ? (mode === 'start' ? startPickerMode : endPickerMode) : 'datetime'}
        onConfirm={(date) => {
          setOpen(false);
          if (selectRange && selectingRange) {
            if (mode === 'start') {
              setTempStart(date);
              setMode('end');
              setOpen(true);
              // Don't call onChange until both dates are selected
            } else {
              const finalSlot = { start: tempStart, end: date };
              onChange(finalSlot);
              setSelectingRange(false);
              setTempStart(null);
            }
          } else {
            onChange({ ...slot, [mode]: date });
          }
        }}
        onCancel={() => { 
          setSelectingRange(false); 
          setOpen(false); 
          setTempStart(null);
        }}
      />
    </View>
  );
}
