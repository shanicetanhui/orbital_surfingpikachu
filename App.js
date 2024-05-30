import React, { useEffect, useState } from 'react';
import { init, fakedata, read } from './db';
import { Tab, HomeScreen, DetailsScreen, ReminderScreen, BirthdayScreen, SettingsScreen, colors, Stack, TabNavigator, ProfileScreen} from './assets'
import { NavigationContainer } from '@react-navigation/native';

function App() {
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
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="MainTabs" component={TabNavigator} /> 
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;




