import { db } from "./firebaseConfig";
import { collection, doc, getDocs, getDoc, setDoc, query, where, addDoc, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";

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

// console.log(uid);

// CREATE

// create a document under the collection 'habits'
export async function add_habit(name, color, goal, uid) {
    console.log("ADDING HABIT");
    // console.log(db);
    console.log(uid);
    console.log(typeof(Number(goal)));
    // const desc = 'Daily goal';
    await addDoc(collection(db, "users", uid, "habits"), {
        display_name: name,
        description: `Daily goal: ${goal.toString()}`,
        color: color,
        goal: Number(goal),
        streak: 0
    })
}

// create a document under the collection 'habitEntries'
export async function add_entry(habit, day, num, uid) {
    const habit_id = await fetch_habit_id(habit, uid);
    console.log(day);
    // console.log("ADDED ENTRY");
    await addDoc(collection(db, "users", uid, "habitEntries"), {
        day: day,
        habit: habit_id,
        num: num
    }); 
}

// create document under the collection 'users'
export async function add_user(uid) {
    console.log("adding user");
    await setDoc(doc(db, "users", uid), {
        age: 0, 
        dark_mode: false,
        msg: "Consistency breeds success.",
        username: "default username"}
    );
    console.log("adding default habit now");
    await addDoc(collection(db, "users", uid, "habits"), {
        display_name: "Water",
        description: "Daily goal: 8",
        color: "rgba(252, 223, 202, 0.7)",
        goal: 8,
        streak: 0
    })
}

// READ

// get list of habits
export async function read_habits(uid) {
    const querySnapshot = await getDocs(collection(db, "users", uid, 'habits'));
    var to_return = [];
    querySnapshot.forEach((doc) => {
        // console.log(doc.id, " = ", doc.data());
        to_return.push(doc.data());
    })
    return to_return;
}

// get all entries for one habit
export async function fetch_entries_habit(habit, uid) {
    const habit_id = await fetch_habit_id(habit, uid);
    // console.log("fetch entries habit");
    const q = query(collection(db, "users", uid, "habitEntries"), where("habit", "==", habit_id));

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
export async function fetch_entry_id(habit, day, uid) {
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
        collection(db, "users", uid, "habitEntries"), 
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
export async function fetch_habit_id(habit, uid) {
    const q = query(collection(db, "users", uid, "habits"), where("display_name", "==", habit));
    const querySnapshot = await getDocs(q);
    var habit_id = '';
    querySnapshot.forEach((doc) => {
        habit_id = doc.id;
    })
    if (habit_id==='') {console.log("inside fetch habit id. no habit id :(");}
    console.log("returning habit_id");
    return habit_id;
}

export async function fetch_user_settings(uid) {
    console.log("inside fetch user settings");
    const docRef = doc(db, "users", uid);
    const userSettings = await getDoc(docRef);
    // console.log(userSettings);
    // console.log("fetch user settings");
    // console.log(userSettings.data());
    if (userSettings.exists()) {
        console.log("user settings are as follows");
        console.log("Document data:", userSettings.data());
        return userSettings.data() ;
    } else {
        // docSnap.data() will be undefined in this case
        console.log("No such document!");
    }
}

export async function fetch_habit_metadata(habit, uid) {
    console.log("fetch matadata");
    const habit_id = await fetch_habit_id(habit, uid);
    const docRef = doc(db, "users", uid, "habits", habit_id);
    const habit_info = await getDoc(docRef);
    return ({
        streak: habit_info.data().streak,
        goal: habit_info.data().goal
    });
}

// UPDATE

// today's entry
export async function create_or_update(habit, day, newnum, uid) {
    // query to see if today's entry exists
    // console.log("inside createorupdate");
    // console.log(habit);
    const habit_id = await fetch_habit_id(habit, uid);
    // console.log(habit_id);
    if (habit_id=='') {
        console.log("cannot add entry. habit does not exist");
        console.log(habit);
    }
    else {
        var entry_id = await fetch_entry_id(habit_id, day, uid);
        if (entry_id==='') { // entry doesn't exist, must create
            console.log("creating entry");
            await addDoc(collection(db, "users", uid, "habitEntries"), {
                day: day,
                habit: habit_id,
                num: num
            }); 
        } else { // entry exists, update it
            console.log("updating entry");
            console.log(entry_id);
            console.log(newnum);
            updateDoc(doc(db, "users", uid,  "habitEntries", entry_id), {num: newnum}); 
        }
    }
}

// habits
export async function update_habit(habit_name, new_habit_name, new_goal, new_color, uid) {
    const habit_id = await fetch_habit_id(habit_name, uid);
    if (habit_id==='') {
        console.log("cannot UPDATE habit ", habit, " doesnt exist");
    } else {
        // await updateDoc(doc(db, "habitEntries", doc_id), {num: newnum, day:newday});
        await updateDoc(doc(db, "users", uid, "habits", habit_id), {display_name: new_habit_name, color: new_color, goal: new_goal, description: `Daily goal: ${new_goal}`});
    }
}

// for past entry
export async function update_entry(habit, day, newday, newnum, uid) {
    const doc_id = await fetch_entry_id(habit, day, uid);
    if (doc_id==='') {
        console.log("cannot UPDATE past entry of ", habit, " ", day, " doesnt exist");
    } else {
        await updateDoc(doc(db, "users", uid, "habitEntries", doc_id), {num: newnum, day:newday});
    }
}

export async function update_streaks(habit, uid, goal) {
    console.log("streak update for habit:", habit);
    try {
        const habit_id = await fetch_habit_id(habit, uid);
        if (!habit_id) {
            console.log('No habit id found for:', habit);
            return;
        }
        console.log("Habit ID:", habit_id);

        const entries = await fetch_entries_habit(habit, uid);
        console.log("Fetched entries:", entries);

        // Sort entries by date
        entries.sort((a, b) => b.day - a.day);

        let streak = 0;
        
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        for (let entry of entries) {
            let entryDate = new Date(entry.day);
            entryDate.setHours(0, 0, 0, 0);

            if (entry.num >= goal && 
                (currentDate - entryDate) / (1000 * 60 * 60 * 24) <= 1) {
                streak++;
                currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
            } else {
                break;
            }
        }

        console.log("Calculated new streak:", streak);

        await updateDoc(doc(db, "users", uid, "habits", habit_id), {streak: streak});
        console.log("Streak updated in database");
    } catch (error) {
        console.error("Error in update_streaks:", error);
    }
}

export async function update_user_settings(uid, new_age, new_dark_mode, new_msg, new_username) {
    console.log("UPDATE USER SETTINGS");
    await updateDoc(doc(db, "users", uid), {age: new_age, dark_mode: new_dark_mode, msg: new_msg, username: new_username});
}

// DELETE

// delete entry
export async function delete_habit_entry(habit_id, day, uid) {
    const doc_id = await fetch_entry_id(habit_id, day, uid);
    if (doc_id==='') {
        console.log("cannot DELETE entry of ", habit, " ", day, " doesnt exist");
    } else {
        await deleteDoc(doc(db, "users", uid, "habitEntries", doc_id));
    }
}

// delete habit and all its entries too
export async function delete_habit(habit, uid) {
    // habit means the display name of the habit so first convert to habit_id
    const habit_id = await fetch_habit_id(habit, uid);
    // check if can
    if (habit_id==='') {
        console.log("cannot delete habit ", habit, " id doesnt exist");
    } else {
        // delete all entries for the habit from habitEntries
        const habitentries_q = query(collection(db, "users", uid, "habitEntries"), where("habit", "==", habit_id));
        const habitentriesSnapshot = await getDocs(habitentries_q);

        habitentriesSnapshot.forEach(async (docu) => {
            await deleteDoc(doc(db, "users", uid, "habitEntries", docu.id));
        })

        // delete habit itself
        await deleteDoc(doc(db, "users", uid, "habits", habit_id));
    }
}

export async function delete_user(uid) {}