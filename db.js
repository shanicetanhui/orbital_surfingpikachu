import { db } from "./firebaseConfig";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
// checklist {  read_habits, add_habit, fetch_one_habit, today_date, create_or_update} from './db';

// debug purposes. called in <Test> component
export async function display() {
    const querySnapshot = await getDocs(collection(db, 'habits'));
    querySnapshot.forEach((doc) => {
        console.log(doc.id, " = ", doc.data());
    })
    const querySnapshot2 = await getDocs(collection(db, 'habitEntries'));
    querySnapshot2.forEach((doc) => {
        console.log(doc.id, " = ", doc.data());
    })
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
        colour: color,
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
    // querySnapshot.forEach((doc) => {
    //     console.log(doc.id, " = ", doc.data());
    // })
    console.log(querySnapshot);
    return querySnapshot;
}

export async function fetch_entries_habit(habit) {
    const q = query(collection(db, "habitEntries"), where("habit", "==", habit));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data());
      })
    return querySnapshot;
}

// UPDATE

export async function create_or_update(habit, day, newnum){
    // query to see if exists
    // if exists, update
    // if not exists, create
    const habitEntriesRef = collection(db, "habitEntries");
    const q = query(habitEntriesRef, where("habit", "==", habit), where("day", "==", day));
    const entrySnapshot = await getDoc(q);

    if (entrySnapshot.exists()) {
        await setDoc(doc(db, "habitEntries", entrySnapshot.id()), {
            ...entrySnapshot.data(),
            num: newnum
        })
    } else {
        await setDoc(doc(db, "habitEntries"), {
            habit: habit,
            day: day,
            num: newnum
        })
    }
}

// DELETE