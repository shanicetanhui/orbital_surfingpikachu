import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
// import { Suspense } from 'react';
// MAYBE!
import { init, exec, read } from './db' ;

export default function App() {
  init();
  exec();
  // trying to grab data from server to iterate on
  // currently error: data.map is not a function (?)
  let data = read();
  console.log("main function data return val");
  console.log(data);
  // const data = [1,2,3];
  return (
    <View style={styles.container}>
      <Text>PLEASE please!</Text>

      {/* {data.map((item, index) => {
        const k = `${item}_${index}`;
        return (<Text key={k}> hello {item}</Text>)
      })} */}

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
