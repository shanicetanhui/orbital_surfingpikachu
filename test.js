import * as SQLite from 'expo-sqlite';

export async function init(){
    const db = await SQLite.openDatabaseAsync('unihealth.db');
    console.log("test.js")
}

export async function exec() {
    const db = await SQLite.openDatabaseAsync('unihealth.db');
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY NOT NULL, value TEXT NOT NULL, intValue INTEGER);
    INSERT INTO test (value, intValue) VALUES ('test1', 123);
    INSERT INTO test (value, intValue) VALUES ('test2', 456);
    INSERT INTO test (value, intValue) VALUES ('test3', 789);
    `);
}

export async function read() {
    const db = await SQLite.openDatabaseAsync('unihealth.db');
    const allRows = await db.getAllAsync('SELECT * FROM test');
    for (const row of allRows) {
        console.log(row.id, row.value, row.intValue);
    }
}