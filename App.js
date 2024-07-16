import React, { useState, useContext } from 'react';
import { HomeScreen, DetailsScreen, Stack, TabNavigator, Test, LoginScreen, SignupScreen } from './assets'
import { auth } from "./firebaseConfig"
import { NavigationContainer } from '@react-navigation/native';
import { UserContext, UserProvider} from "./UserContext";
import { useFonts } from 'expo-font';
import AppLoading from 'expo-app-loading';

function App() {

  const [isSignup, setIsSignup] = useState(false); // Track whether the user is in signup mode
  
  // const [loggedInUser, setLoggedInUser] = useState(null);
  const { loggedInUser, setLoggedInUser } = useContext(UserContext);

  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged(user => {
  //     setLoggedInUser(user);
  //   });
  //   return () => unsubscribe();
  // }, []);

  console.log("top level");
  console.log(auth);

  // if (false) {
  if (loggedInUser) {
    console.log("loggedinuser");
    console.log(loggedInUser.uid);
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Back">
          {/* Three tabs, home, profile and details */}
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ headerShown: false }}
            initialParams={{ uid: loggedInUser.uid, changeLogin: setLoggedInUser }} // Pass uid as initialParams
            // options={({route, navigation}) => ({
              //   uid: loggedInUser.uid, 
              //   changeLogin: setLoggedInUser
              // })}
            // options={{ headerShown: false, uid: loggedInUser.uid, changeLogin: setLoggedInUser }}
          />
          <Stack.Screen 
            name="Details" 
            component={DetailsScreen} 
            // initialParams = {{ "uid": loggedInUser.uid }}
          />
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