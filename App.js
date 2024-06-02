import React from 'react';
import { ProfileScreen, HomeScreen, DetailsScreen, Stack, TabNavigator} from './assets'
import { NavigationContainer } from '@react-navigation/native';

function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Back">
        {/* Three tabs, home, profile and details */}
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen
          name="Back"
          component={TabNavigator}
          options={{ headerShown: false }} // Hide header for back screen
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;