import { db } from "./firebaseConfig";
import { collection, doc, getDocs, setDoc, query, where, addDoc, updateDoc, deleteDoc } from "firebase/firestore";

// debug purposes. called in <Test> component
export async function display() {
    console.log("=== display function ===");

    const querySnapshot = await getDocs(collection(db, 'habits'));
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " = ", doc.data());
    })

    const querySnapshot2 = await getDocs(collection(db, 'habitEntries'));
    querySnapshot2.forEach((doc) => {
        console.log(doc.id, " = ", doc.data());
    })

    console.log("========================");
}

// generate date in ddmmyy format to use in HabitEntries table
export function today_date(){
    const today = new Date();

    const year = String(today.getFullYear()).slice(-2); // Last two digits of the year
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month (0-11, so add 1)
    const day = String(today.getDate()).padStart(2, '0');   // Day of the month (1-31)

    const formattedDate = `${year}${month}${day}`;
    return formattedDate;
    // console.log(formattedDate);
}

// CREATE

// create a document under the collection 'habits'
export async function add_habit(name, description, color, goal) {
    console.log("ADDED HABIT");
    await setDoc(doc(db, "habits", name), {
        display_name: name,
        description: description,
        color: color,
        goal: goal
    })
}

// TODO: FIGURE OUT FORMAT OF day
// create a document under the collection 'habitEntries'
export async function add_entry(habit, day, num) {
    await setDoc(collection(db, "habitEntries"), {
        day: day,
        habit: habit,
        num: num
    });
    console.log("ADDED ENTRY");
}

// READ

// get list of habits
export async function read_habits() {
    const querySnapshot = await getDocs(collection(db, 'habits'));
    var to_return = [];
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " = ", doc.data());
        to_return.push(doc.data());
    })
    return to_return;
}

// get all entries for one habit
export async function fetch_entries_habit(habit) {
    const habit_id = await fetch_habit_id(habit);
    console.log(habit_id);
    const q = query(collection(db, "habitEntries"), where("habit", "==", habit_id));

    const querySnapshot = await getDocs(q);
    var to_return = [];

    querySnapshot.forEach((doc) => {
        // console.log(data.data());
        to_return.push(doc.data());
    })
    return to_return;
}

// if the entry exists, returns id based on habit and day
// ELSE returns ''
export async function fetch_entry_id(habit, day) {
    const q = query(collection(db, "habitEntries"), where("habit", "==", habit), where("day", "==", day));
    const entrySnapshot = await getDocs(q);

    const doc_id = ''
    entrySnapshot.forEach((doc) => {
        doc_id = doc.id;
    })
    return doc_id;
}

// if the habit exists, returns id based on display_name
// ELSE returns ''
export async function fetch_habit_id(habit) {
    const q = query(collection(db, "habits"), where("display_name", "==", habit));
    const querySnapshot = await getDocs(q);
    var habit_id = ''
    console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
        habit_id = doc.id;
    })
    return habit_id;
}

// UPDATE

// today's entry
export async function create_or_update(habit, day, newnum) {
    // query to see if today's entry exists
    var entry_id = await fetch_entry_id(habit, day);
    if (entry_id==='') { // entry doesn't exist, must create
        console.log("creating entry");
        add_entry(habit, day, newnum); 
    } else { // entry exists, update it
        console.log(entry_id);
        console.log(new_num);
        updateDoc(doc(db, "habitEntries", entry_id), {num: newnum}); 
    }
}

// for past entry
export async function update_entry(habit, day, newnum) {
    const doc_id = await fetch_entry_id(habit, day);
    if (doc_id==='') {
        console.log("cannot UPDATE past entry of ", habit, " ", day, " doesnt exist");
    } else {
        await updateDoc(doc(db, "habitEntries", doc_id), {num: newnum});
    }
}

// DELETE

// delete entry
export async function delete_habit_entry(habit, day) {

    const doc_id = await fetch_entry_id(habit, day);
    if (doc_id==='') {
        console.log("cannot DELETE entry of ", habit, " ", day, " doesnt exist");
    } else {
        await deleteDoc(doc(db, "habitEntries", doc_id));
    }
}

// delete habit and all its entries too
export async function delete_habit(habit) {
    // habit means the display name of the habit

    // delete all entries for the habit from habitEntries
    const habitentries_q = query(collection(db, "habitEntries"), where("habit", "==", habit));
    const habitentriesSnapshot = await getDocs(habitentries_q);

    habitentriesSnapshot.forEach(async (doc) => {
        await deleteDoc(doc(db, "habitEntries", doc.id));
    })

    // delete the habit itself from habits
    const doc_id = await fetch_habit_id(habit)
    if (doc_id==='') {
        console.log("cannot delete habit ", habit, " id doesnt exist");
    } else {
        await deleteDoc(doc(db, "habits", doc_id));
    }
}