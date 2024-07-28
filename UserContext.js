import React, { createContext, useState, useEffect } from 'react';
import { auth } from './firebaseConfig';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoggedInUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
};