import { db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
// import { firebase } from 

export async function init() {

    await docRef.set({
        display_name: 'Water',
        goal: 10,
        colour: 'rgba(252, 223, 202, 0.7)',
        description: 'placeholder desc'
    });
}

export async function display() {
    const docRef = doc(db, 'habits', 'water');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
      } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
      }
}