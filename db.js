import * as SQLite from 'expo-sqlite';
let db ;

// get date in ddmmyy format
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

export async function fakedata() {
    // populate with fake data first
    const database = await openDatabase();

    today = today_date();
    console.log(today);

    await database.runAsync(`INSERT INTO HabitEntries (habit, day, num) VALUES (?, ?, ?)`, 'Water', today, 2);
    await database.runAsync(`INSERT INTO HabitEntries (habit, day, num) VALUES (?, ?, ?)`, 'Fruits', today, 221);

    console.log("fake data inserted");
}

// CREATE

export async function add_habit(name, description, color) {
    if (description===undefined){
        description = '';
    }
    const database = await openDatabase();
    database.runAsync('INSERT INTO Habits (habit, description, color) VALUES (?, ?, ?)', name, description, color);
    console.log("ADDED HABIT");
}

export async function add_entry(habitname, today, num) {
    const database = await openDatabase();
    // today = today_date();
    const result = await database.runAsync('INSERT INTO HabitEntries (habit, day, num) VALUES (?, ?, ?)', habitname, today, num);
    console.log(result);
}

// READ

export async function read_habits() {
    const database = await openDatabase();
    const allRows = await database.getAllAsync('SELECT * FROM Habits');
    console.log("readhabits");
    console.log(allRows);
    return allRows;
}

export async function fetch_one_habit(habit) {
    const database = await openDatabase();
    const allRows = await database.getAllAsync('SELECT * FROM HabitEntries WHERE habit = ?', habit);
    return allRows;
}

// UPDATE

export async function update_entry(habitname, day, newnum){
    const database = await openDatabase();
    console.log("update attempt");
    const result = await database.runAsync('UPDATE HabitEntries SET num = ? WHERE habit = ? AND day = ?', newnum, habitname, day);
    console.log(result);
}

export async function create_or_update(habitname, day, newnum) {
    const database = await openDatabase();
    await database.runAsync(`
    INSERT INTO HabitEntries (habit, day, num) 
    VALUES (?, ?, ?) 
    ON CONFLICT(habit, day) DO UPDATE SET 
    num = ?
    `, [habitname, day, newnum, newnum]);
}

// DELETE

