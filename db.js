import { db } from "./firebaseConfig";
import { collection, doc, getDoc, getDocs, setDoc, query, where, addDoc, updateDoc } from "firebase/firestore";
// checklist {  read_habits, add_habit, fetch_one_habit, today_date, create_or_update} from './db';

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

// generate date in ddmmyy format
// to use in HabitEntries table
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

// create a document under the collection 'habit'
export async function add_habit(name, description, color, goal) {
    await setDoc(doc(db, 'habit', name), {
        display_name: name,
        description: description,
        color: color,
        goal: goal
    });
    console.log("ADDED HABIT");
}

// TODO: FIGURE OUT FORMAT OF day
// create a document under the collection 'habitEntries'
export async function add_entry(habitname, today, num) {
    // const database = await openDatabase();
    // today = today_date();
    // const result = await database.runAsync('INSERT INTO HabitEntries (habit, day, num) VALUES (?, ?, ?)', habitname, today, num);
    
    await setDoc(doc(db, 'habitEntries'), {
        day: today,
        habit: habitname,
        num: num
    });
    console.log("ADDED ENTRY");
}

// READ

export async function read_habits() {
    const querySnapshot = await getDocs(collection(db, 'habits'));
    var to_return = [];
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " = ", doc.data());
        to_return.push(doc.data());
    })
    return to_return;
}

export async function fetch_entries_habit(habit) {
    const q = query(collection(db, "habitEntries"), where("habit", "==", habit));
    const querySnapshot = await getDocs(q);
    var to_return = [];
    querySnapshot.forEach((doc) => {
        to_return.push(doc.data());
    })
    return to_return;
}

// UPDATE

// for today's entry
export async function create_or_update(habit, day, newnum) {

    // query to see if today's entry exists
    const q = query(collection(db, "habitEntries"), where("habit", "==", habit), where("day", "==", day));
    const entrySnapshot = await getDocs(q);

    var entry = ''
    entrySnapshot.forEach((doc) => {
        entry = doc;
    })

    if (entry==='') {
        // entry doesn't exist, must create
        await addDoc(collection(db, "habitEntries"), {
            habit: habit,
            day: day,
            num: newnum
        })
    } else {
        // entry exists, update it
        await updateDoc(doc(db, "habitEntries", entry.id), {num: newnum});
    }
}

// DELETE