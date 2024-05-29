import * as SQLite from 'expo-sqlite';
let db ;

// this means we don't have to reopen the database every time
export const openDatabase = async () => {
    if (!db) {
        db = await SQLite.openDatabaseAsync('unihealth.db');
    }
    return db;
}

export async function init(){
    const database = await openDatabase();
    console.log("test.js")
}

export async function exec() {
    const database = await openDatabase();
    // jus to prove that we can execute
    await database.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS water (id INTEGER PRIMARY KEY NOT NULL, day TEXT NOT NULL, cups INTEGER NOT NULL);
    INSERT INTO water (day, cups) VALUES ('mon', 3);
    INSERT INTO water (day, cups) VALUES ('tue', 4);
    INSERT INTO water (day, cups) VALUES ('wed', 5);
    `);
}

export async function read() {
    const database = await openDatabase();
    const allRows = await database.getAllAsync('SELECT * FROM water');
    // currently trying to grab data from server so that it can be passed to App.js
    const data = [];
    for (const row of allRows) {
        data.push(row);
        console.log(row.id, row.day, row.cups);
    }
    console.log("uve been read");
    return data;
}