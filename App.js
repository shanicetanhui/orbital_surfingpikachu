import React, {useState, useEffect } from 'react';
import { HomeScreen, DetailsScreen, Stack, TabNavigator, styles} from './assets'
import { View, useColorScheme } from 'react-native';
import "./firebaseConfig"
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { EventRegister } from 'react-native-event-listeners'
import { list } from 'firebase/storage';
import theme from './theme/theme';
import themeContext from './theme/themeContext';


function App() {

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const listener = EventRegister.addEventListener('ChangeTheme', (data) =>{
      setDarkMode(data);
    })
    return ()=> {
      EventRegister.removeAllListeners(listener);
    };
  }, [darkMode])

  return (
    <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
        <NavigationContainer theme={darkMode === true ? DarkTheme : DefaultTheme}>
          <Stack.Navigator initialRouteName="Back">
            <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Details" component={DetailsScreen} />
            <Stack.Screen
              name="Back"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
          </Stack.Navigator>
        </NavigationContainer>
    </themeContext.Provider>
  );
}

export default App;