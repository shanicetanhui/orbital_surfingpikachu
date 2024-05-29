import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

const TouchableOpacityDemo = () => {
  return (
    <TouchableOpacity style={styles.button} onPress={() => console.log("Hello World!")}>
      <Text>Press Me</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center', // Center the text horizontally
  },
});

export default TouchableOpacityDemo;
