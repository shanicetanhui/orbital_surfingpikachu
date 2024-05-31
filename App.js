import React, { useEffect, useState } from 'react';
import { Tab, ProfileScreen, HomeScreen, DetailsScreen, SettingsScreen, colors, Stack, TabNavigator} from './assets'
import { NavigationContainer } from '@react-navigation/native';

function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Back">
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen
          name="Back"
          component={TabNavigator}
          options={{ headerShown: false }} // Hide header for Back screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;