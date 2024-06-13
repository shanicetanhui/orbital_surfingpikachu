import * as SQLite from 'expo-sqlite'; //using expo's sqlite
let db ;

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

// this means we don't have to reopen the database every time
export const openDatabase = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync('unihealth.db');
    }
    return db;
}

// set up database with two tables
// insert two habits to start
// DONE IN FIREBASE
export async function init(){
    const database = await openDatabase();

    await database.execAsync(`
    DROP TABLE IF EXISTS Habits;
    CREATE TABLE Habits (
        habit TEXT NOT NULL,
        description TEXT,
        goal REAL NOT NULL,
        color TEXT);
    DROP TABLE IF EXISTS HabitEntries;
    CREATE TABLE HabitEntries (
        entryid INTEGER PRIMARY KEY NOT NULL, 
        habit INTEGER NOT NULL, 
        day TEXT NOT NULL, 
        num REAL NOT NULL, 
        FOREIGN KEY (habit) REFERENCES Habits(habit),
        unique(habit, day));
    INSERT INTO Habits (habit, description, goal, color) VALUES ('Water', 'water placeholder desc', 10, 'rgba(252, 223, 202, 0.7)');
    INSERT INTO Habits (habit, description, goal, color) VALUES ('Fruits', 'fruits placeholder desc', 10, 'rgba(252, 223, 202, 0.7)');
    `);

    console.log("init done");
}

// populate tables with fake data first for debug purposes
// FAKE DATA INSERTED IN FIREBASE
export async function fakedata() {
    const database = await openDatabase();

    today = today_date();
    // console.log(today);
  
    // 4 entries for habits for now
    await database.runAsync(`INSERT INTO HabitEntries (habit, day, num) VALUES (?, ?, ?)`, 'Water', today, 2);
    await database.runAsync(`INSERT INTO HabitEntries (habit, day, num) VALUES (?, ?, ?)`, 'Fruits', today, 5);
    await database.runAsync(`INSERT INTO HabitEntries (habit, day, num) VALUES (?, ?, ?)`, 'Water', 240601, 3);
    await database.runAsync(`INSERT INTO HabitEntries (habit, day, num) VALUES (?, ?, ?)`, 'Fruits', 240601, 6);
    await database.runAsync(`INSERT INTO HabitEntries (habit, day, num) VALUES (?, ?, ?)`, 'Water', 240531, 4);
    await database.runAsync(`INSERT INTO HabitEntries (habit, day, num) VALUES (?, ?, ?)`, 'Fruits', 240531, 5);
    await database.runAsync(`INSERT INTO HabitEntries (habit, day, num) VALUES (?, ?, ?)`, 'Water', 240530, 2);
    await database.runAsync(`INSERT INTO HabitEntries (habit, day, num) VALUES (?, ?, ?)`, 'Fruits', 240530, 4);

    console.log("fake data inserted");
}

// CREATE

// add new habit
export async function add_habit(name, description, color, goal) {
    if (description===undefined){
        description = '';
    }
    const database = await openDatabase();
    database.runAsync('INSERT INTO Habits (habit, description, color, goal) VALUES (?, ?, ?, ?)', name, description, color, goal);
    console.log("ADDED HABIT");
}

// add new entry
export async function add_entry(habitname, today, num) {
    const database = await openDatabase();
    // today = today_date();
    const result = await database.runAsync('INSERT INTO HabitEntries (habit, day, num) VALUES (?, ?, ?)', habitname, today, num);
    console.log(result);
}

// READ

// get entries of habits
export async function read_habits() {
    const database = await openDatabase();
    const allRows = await database.getAllAsync('SELECT * FROM Habits');
    console.log("readhabits");
    console.log(allRows);
    return allRows;
}

// fetch all entries for one habit
export async function fetch_one_habit(habit) {
    const database = await openDatabase();
    const allRows = await database.getAllAsync('SELECT * FROM HabitEntries WHERE habit = ?', habit);
    return allRows;
}

// UPDATE

// export async function update_entry(habitname, day, newnum){
//     const database = await openDatabase();
//     console.log("update attempt");
//     const result = await database.runAsync('UPDATE HabitEntries SET num = ? WHERE habit = ? AND day = ?', newnum, habitname, day);
//     console.log(result);
// }

// function specially used for the counters in the details page
// explanation: the user can change today's value through the counter
// the app will only make a call to the database once the user exits the details page
// it makes a new entry for today for that habit in the database
// BUT if there is already an entry for that habit for today (on conflict), that entry is updated
export async function create_or_update(habitname, day, newnum) {
    const database = await openDatabase();
    await database.runAsync(`
    INSERT INTO HabitEntries (habit, day, num) 
    VALUES (?, ?, ?) 
    ON CONFLICT(habit, day) DO UPDATE SET 
    num = ?
    `, [habitname, day, newnum, newnum]);
}