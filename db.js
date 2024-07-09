import { db } from "./firebaseConfig";
import { collection, doc, getDocs, setDoc, query, where, addDoc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";

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
export function today_date() {
    const today = new Date();
    // console.log(today);
    return today;
}

export function date_display_format(date_object) {
    // Get the day and month from the date object
    const day = date_object.getDate();
    const month = date_object.getMonth() + 1; // getMonth() returns month index starting from 0

    // Ensure two-digit format
    const dayString = day < 10 ? `0${day}` : `${day}`;
    const monthString = month < 10 ? `0${month}` : `${month}`;

    // Return the formatted date
    return `${dayString}/${monthString}`;
}

// CREATE

// create a document under the collection 'habits'
export async function add_habit(name, color, goal) {
    console.log("ADDED HABIT");
    // const desc = 'Daily goal';
    await addDoc(collection(db, "habits"), {
        display_name: name,
        description: `Daily goal: ${goal.toString()}`,
        color: color,
        goal: goal
    })
}

// TODO: FIGURE OUT FORMAT OF day
// create a document under the collection 'habitEntries'
export async function add_entry(habit, day, num) {
    const habit_id = await fetch_habit_id(habit);
    console.log(day);
    // console.log("ADDED ENTRY");
    await addDoc(collection(db, "habitEntries"), {
        day: day,
        habit: habit_id,
        num: num
    }); 

}

// READ

// get list of habits
export async function read_habits() {
    const querySnapshot = await getDocs(collection(db, 'habits'));
    var to_return = [];
    querySnapshot.forEach((doc) => {
        // console.log(doc.id, " = ", doc.data());
        to_return.push(doc.data());
    })
    return to_return;
}

// get all entries for one habit
export async function fetch_entries_habit(habit) {
    const habit_id = await fetch_habit_id(habit);
    // console.log("fetch entries habit");
    const q = query(collection(db, "habitEntries"), where("habit", "==", habit_id));

    const querySnapshot = await getDocs(q);
    var to_return = [];

    day = today_date();
    // console.log(day.toDateString());

    querySnapshot.forEach((doc) => {
        // to_return.push(doc.data());
        // console.log(doc.data().day);
        // console.log(doc.data().day.toDate().toDateString() == day.toDateString());
        to_return.push({...doc.data(), day:doc.data().day.toDate()});
    })
    return to_return;
}

// if the entry exists, returns id based on habit and day
// ELSE returns ''
export async function fetch_entry_id(habit, day) {
    // Get the start and end of the day
    const startOfDay = new Date(day);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(day);
    endOfDay.setHours(23, 59, 59, 999);

    // Convert to Firestore Timestamps
    const startTimestamp = Timestamp.fromDate(startOfDay);
    const endTimestamp = Timestamp.fromDate(endOfDay);

    // console.log(startTimestamp);
    // console.log(endTimestamp);

    const q = query(
        collection(db, "habitEntries"), 
        where("habit", "==", habit), 
        where('day', '<=', endTimestamp),
        where('day', '>=', startTimestamp)
    );

    const entrySnapshot = await getDocs(q);
    // console.log("fetch entry id");
    var doc_id = '';
    entrySnapshot.forEach((doc) => {
        console.log(doc);
        // console.log(doc.id);
        doc_id = doc.id;
    })
    return doc_id;
}

// if the habit exists, returns id based on display_name
// ELSE returns ''
export async function fetch_habit_id(habit) {
    const q = query(collection(db, "habits"), where("display_name", "==", habit));
    const querySnapshot = await getDocs(q);
    var habit_id = '';
    // console.log("inside fetch habit id, going to return");
    // console.log(querySnapshot);
    querySnapshot.forEach((doc) => {
        // console.log(doc.data());
        // console.log(doc.id);
        habit_id = doc.id;
    })
    // console.log(habit_id);
    return habit_id;
}

// UPDATE

// today's entry
export async function create_or_update(habit, day, newnum) {
    // query to see if today's entry exists
    // console.log("inside createorupdate");
    // console.log(habit);
    const habit_id = await fetch_habit_id(habit);
    // console.log(habit_id);
    if (habit_id=='') {
        console.log("cannot add entry. habit does not exist");
        console.log(habit);
    }
    else {
        var entry_id = await fetch_entry_id(habit_id, day);
        if (entry_id==='') { // entry doesn't exist, must create
            console.log("creating entry");
            await addDoc(collection(db, "habitEntries"), {
                day: day,
                habit: habit_id,
                num: num
            }); 
        } else { // entry exists, update it
            console.log("updating entry");
            console.log(entry_id);
            console.log(newnum);
            updateDoc(doc(db, "habitEntries", entry_id), {num: newnum}); 
        }
    }
}

// habits
export async function update_habit(habit_name, new_habit_name, new_goal, new_color) {
    const habit_id = await fetch_habit_id(habit_name);
    if (habit_id==='') {
        console.log("cannot UPDATE habit ", habit, " doesnt exist");
    } else {
        // await updateDoc(doc(db, "habitEntries", doc_id), {num: newnum, day:newday});
        await updateDoc(doc(db, "habits", habit_id), {display_name: new_habit_name, color: new_color, goal: new_goal, description: `Daily goal: ${new_goal}`});
    }
}

// for past entry
export async function update_entry(habit, day, newday, newnum) {
    const doc_id = await fetch_entry_id(habit, day);
    if (doc_id==='') {
        console.log("cannot UPDATE past entry of ", habit, " ", day, " doesnt exist");
    } else {
        await updateDoc(doc(db, "habitEntries", doc_id), {num: newnum, day:newday});
    }
}

// DELETE

// delete entry
export async function delete_habit_entry(habit_id, day) {
    const doc_id = await fetch_entry_id(habit_id, day);
    if (doc_id==='') {
        console.log("cannot DELETE entry of ", habit, " ", day, " doesnt exist");
    } else {
        await deleteDoc(doc(db, "habitEntries", doc_id));
    }
}

// delete habit and all its entries too
export async function delete_habit(habit) {
    // habit means the display name of the habit so first convert to habit_id
    const habit_id = await fetch_habit_id(habit);
    // check if can
    if (habit_id==='') {
        console.log("cannot delete habit ", habit, " id doesnt exist");
    } else {
        // delete all entries for the habit from habitEntries
        const habitentries_q = query(collection(db, "habitEntries"), where("habit", "==", habit_id));
        const habitentriesSnapshot = await getDocs(habitentries_q);

        habitentriesSnapshot.forEach(async (docu) => {
            await deleteDoc(doc(db, "habitEntries", docu.id));
        })

        // delete habit itself
        await deleteDoc(doc(db, "habits", habit_id));
    }
}