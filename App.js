import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { init, fakedata, read } from './db';

export default function App() {
  // app will refresh when data changes
  console.log("===START===")
  const [data, setData] = useState([]);

  useEffect(() => {
    const setupDatabase = async () => {
      await init(); // clear/init every table
      await fakedata(); // populating with fake data at first
      const fetchedData = await read(); // read the data
      setData(fetchedData);
    };

    setupDatabase();
  }, []);

  // what to do if data changes?
  useEffect(() => {
    console.log("===useEffect===");
    console.log(data);
  }, [data]);

  return (
    <View style={styles.container}>
      <Text>PLEASE please!</Text>
      {data.map((item) => (
        <Text key={item.id}>{item.day}: {item.cups} cups</Text>
      ))}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
