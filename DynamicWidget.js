import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function DynamicWidget({ text }) {
  // Calculate the height of the text widget based on the number of lines
  const calculateWidgetHeight = (text) => {
    const lines = text.split('\n').length; // Split text by newline character to count lines
    return Math.max(lines * 20, 40); // Assuming each line height is 20 units, with a minimum height of 40 units
  };

  return (
    <View style={[styles.widget, { height: calculateWidgetHeight(text) }]}>
      <Text>{Text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  widget: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 10,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
});