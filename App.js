import React from 'react';
// import Text from 'react-native';
import { ProfileScreen, HomeScreen, DetailsScreen, Stack, TabNavigator, Test} from './assets'
import "./firebaseConfig"
import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

function App() {
  console.log("top level");

  // const [fontsLoaded] = useFonts({
  //   'Kolletkif': require('./assets/Roboto/Roboto-LightItalic.ttf'),
  // });

//  if (!fontsLoaded) {
  //  return <AppLoading />;
  //}

  if (false) {

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
    // <Test></Test>
  );
}
else {
  return (
    <Test>testing</Test>
  )
}
}

export default App;