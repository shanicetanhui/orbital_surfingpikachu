import { initializeApp, applicationDefault } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import * as firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCdlayzke5r2CNoLZpGWRonIkurQPg6hZk",
  authDomain: "unihealth-3e9df.firebaseapp.com",
  databaseURL: "https://unihealth-3e9df-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "unihealth-3e9df",
  storageBucket: "unihealth-3e9df.appspot.com",
  messagingSenderId: "514012527971",
  appId: "1:514012527971:web:04f79a7e749719b0aee756",
  measurementId: "G-6V0PESJYVV"
  //, credential: applicationDefault(),
  };
  
const app = initializeApp(firebaseConfig);  
// firebase.initializeApp(firebaseConfig);

export const db = getFirestore(app);
// export const db = firebase.firestore();