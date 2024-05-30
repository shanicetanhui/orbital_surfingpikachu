import * as SQLite from 'expo-sqlite';
let db ;

const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

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
        habitid INTEGER PRIMARY KEY NOT NULL, 
        habit TEXT NOT NULL,
        description TEXT);
    DROP TABLE IF EXISTS HabitEntries;
    CREATE TABLE HabitEntries (
        entryid INTEGER PRIMARY KEY NOT NULL, 
        habitid INTEGER NOT NULL, 
        day TEXT NOT NULL, 
        num INTEGER NOT NULL, 
        FOREIGN KEY (habitid) REFERENCES Habits(habitid));
    INSERT INTO Habits (habit, description) VALUES ('Water', 'water placeholder desc');
    INSERT INTO Habits (habit, description) VALUES ('Fruits', 'fruits placeholder desc');
    `);

    console.log("init done");
}

export async function fakedata() {
    // populate with fake data first
    const database = await openDatabase();

    today = new Date();
    const day = days[today.getDay()];

    // await database.execAsync(`
    // INSERT INTO water (day, cups) VALUES ('mon', 3);
    // INSERT INTO water (day, cups) VALUES ('tue', 4);
    // INSERT INTO water (day, cups) VALUES ('wed', 5);
    // `);

    await database.runAsync(`INSERT INTO HabitEntries (habitid, day, num) VALUES (?, ?, ?)`, 1, day, 3423);
    await database.runAsync(`INSERT INTO HabitEntries (habitid, day, num) VALUES (?, ?, ?)`, 2, day, 323);

    console.log("fake data inserted");
}

export async function read_habits() {
    const database = await openDatabase();
    const allRows = await database.getAllAsync('SELECT * FROM Habits');
    console.log("readhabits");
    console.log(allRows);
    return allRows;
}

export async function add_habit(name, description) {
    if (description===undefined){
        description = '';
    }
    const database = await openDatabase();
    database.runAsync('INSERT INTO Habits (habit, description) VALUES (?, ?)', name, description);
    console.log("ADDED HABIT");
}

// export async function fetch_one_habit() {
//     const database = await openDatabase();
//     const 
// }