import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
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
  startPickerMode = 'datetime',
  endPickerMode = 'datetime',
  selectRange = false,
  autoOpen = false,
  onCancel = null,
  startTitle = 'Start Date',
  endTitle = 'End Date',
  hideDisplayText = false,
  style = null,
  textStyle = null,
  placeholder = null,
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
    if (slot.start && slot.end) return `${formatDateTime(slot.start)} — ${formatTimeOnly(slot.end)}`;
    return null; // Don't show any text when no dates are selected
  };
  // Auto-open picker for new slots when selectRange is enabled
  useEffect(() => {
    if (autoOpen && selectRange) {
      setSelectingRange(true);
      setMode('start');
      setOpen(true);
    }
  }, [autoOpen, selectRange]);

  const hasContent = style || hideDisplayText 
    ? true // Always show when custom style is provided or hideDisplayText is true
    : (selectRange ? combinedLabel() : (slot.start || slot.end));
  
  return (
    <>
      {hasContent && (
        <View style={style ? [style, combinedLabel() ? { flexDirection: 'row', alignItems: 'center' } : {}, { justifyContent: 'flex-start' }] : (combinedLabel() ? { marginVertical: 5, flexDirection: 'row', alignItems: 'center' } : { marginVertical: 5 })}>
          {selectRange ? (
            <Pressable onPress={() => { 
              setSelectingRange(true); 
              setMode('start'); 
              setOpen(true);
            }}>
              <Text style={textStyle ? textStyle : { textDecorationLine: 'underline', color: valid ? 'black' : colors.danger }}>
                {combinedLabel() || placeholder}
              </Text>
            </Pressable>
          ) : combinedLabel() ? (
            style ? (
              <View style={{ flexDirection: 'row', paddingLeft: 5, justifyContent: 'flex-start' }}>
                <Pressable onPress={() => { setMode('start'); setOpen(true); }}>
                  <Text style={textStyle ? [textStyle, { textDecorationLine: 'underline' }] : { textDecorationLine: 'underline', color: valid ? 'black' : colors.danger }}>
                    {formatDateTime(slot.start)}
                  </Text>
                </Pressable>
                <Text style={{ color: '#666' }}>  —  </Text>
                <Pressable onPress={() => { setMode('end'); setOpen(true); }}>
                  <Text style={textStyle ? [textStyle, { textDecorationLine: 'underline' }] : { textDecorationLine: 'underline', color: valid ? 'black' : colors.danger }}>
                    {formatDateTime(slot.end)}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <>
                <Pressable onPress={() => { setMode('start'); setOpen(true); }}>
                  <Text style={textStyle ? textStyle : { textDecorationLine: 'underline', color: valid ? 'black' : colors.danger }}>
                    {formatDateTime(slot.start)}
                  </Text>
                </Pressable>
                <Text style={{ color: valid ? 'black' : colors.danger }}>  —  </Text>
                <Pressable onPress={() => { setMode('end'); setOpen(true); }}>
                  <Text style={textStyle ? [textStyle, { textAlign: 'right' }] : { textDecorationLine: 'underline', color: valid ? 'black' : colors.danger }}>
                    {formatTimeOnly(slot.end)}
                  </Text>
                </Pressable>
              </>
            )
          ) : (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Pressable onPress={() => { setMode('start'); setOpen(true); }}>
                <Text style={{ textDecorationLine: 'underline', color: valid ? 'black' : colors.danger }}>
                  {label(slot.start, startTitle)}
                </Text>
              </Pressable>
              <Pressable onPress={() => { setMode('end'); setOpen(true); }}>
                <Text style={{ textDecorationLine: 'underline', color: valid ? 'black' : colors.danger }}>
                  {label(slot.end, endTitle)}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      )}
      <DatePicker
        modal
        open={open}
        title={mode === 'start' ? startTitle : endTitle}
        date={(selectRange && mode === 'start') ? (tempStart || slot.start || new Date()) : (slot[mode] || new Date())}
        mode={mode === 'start' ? startPickerMode : endPickerMode}
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
          // Call parent onCancel if provided (for temp slot removal)
          if (onCancel) {
            onCancel();
          }
        }}
      />
    </>
  );
}
