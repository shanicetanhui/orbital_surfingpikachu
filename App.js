import React, { useState, useContext, useEffect } from 'react';
import { HomeScreen, DetailsScreen, Stack, TabNavigator, Test, LoginScreen, SignupScreen, styles} from './assets'
import { View, useColorScheme } from 'react-native';
import { auth } from "./firebaseConfig"
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { UserContext, UserProvider} from "./UserContext";
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';
import { EventRegister } from 'react-native-event-listeners'
import { list } from 'firebase/storage';
import theme from './theme/theme';
import themeContext from './theme/themeContext';


function App() {
  const [isSignup, setIsSignup] = useState(false); // Track whether the user is in signup mode
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    const listener = EventRegister.addEventListener('ChangeTheme', (data) =>{
      setDarkMode(data);
    })
    return ()=> {
      EventRegister.removeAllListeners(listener);
    };
  }, [darkMode])

  console.log("top level");
  console.log(auth);

  // if (false) {
  if (loggedInUser) {
    console.log("loggedinuser");
    console.log(loggedInUser.uid);
    return (
      <themeContext.Provider value={darkMode === true ? theme.dark : theme.light}>
        <NavigationContainer theme={darkMode === true ? DarkTheme : DefaultTheme}>
          <Stack.Navigator initialRouteName="Back">
            {/* Three tabs, home, profile and details */}
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ headerShown: false }}
              initialParams={{ uid: loggedInUser.uid, changeLogin: setLoggedInUser }} // Pass uid as initialParams
            />
            <Stack.Screen 
              name="Details" 
              component={DetailsScreen} 
            />
            <Stack.Screen
              name="Back"
              component={TabNavigator}
              options={{ headerShown: false }} // Hide header for back screen
            />
          </Stack.Navigator>
        </NavigationContainer>
      </themeContext.Provider>
    );
  } 
  else if (isSignup) {
    return <SignupScreen setIsSignup={setIsSignup} setLoggedInUser={setLoggedInUser} auth={auth} />;
  } 
  else {
    return <LoginScreen setIsSignup={setIsSignup} setLoggedInUser={setLoggedInUser} auth={auth} />;
  }
}

// export default App ;

export default function Main() {
  return (
    <UserProvider>
      <App />
    </UserProvider>
  );
}