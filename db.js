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
    await database.execAsync(`
    DROP TABLE IF EXISTS water;
    CREATE TABLE water (id INTEGER PRIMARY KEY NOT NULL, day TEXT NOT NULL, cups INTEGER NOT NULL);
    `);
    console.log("init done");
}

export async function fakedata() {
    // populate with fake data first
    const database = await openDatabase();
    await database.execAsync(`
    PRAGMA journal_mode = WAL;
    INSERT INTO water (day, cups) VALUES ('mon', 3);
    INSERT INTO water (day, cups) VALUES ('tue', 4);
    INSERT INTO water (day, cups) VALUES ('wed', 5);
    `);
    console.log("data inserted");
}

export async function read() {
    const database = await openDatabase();
    const allRows = await database.getAllAsync('SELECT * FROM water');
    // console.log(allRows);
    // currently trying to grab data from server so that it can be passed to App.js
    // const data = [];
    // console.log(data);
    // for (const row of allRows) {
    //     console.log(typeof(row));
    //     // console.log(row.id, row.day, row.cups);
    // }
    // console.log("uve been read");
    return allRows;
}