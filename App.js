import React, { useEffect, useState } from 'react';
import { Tab, HomeScreen, DetailsScreen, ReminderScreen, BirthdayScreen, SettingsScreen, colors, Stack, TabNavigator, ProfileScreen} from './assets'
import { NavigationContainer } from '@react-navigation/native';

function App() {

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




