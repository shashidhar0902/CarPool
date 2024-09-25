const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const dbFile = './carpool.db';

// Delete the existing database file if it exists
if (fs.existsSync(dbFile)) {
  fs.unlinkSync(dbFile);
  console.log("Existing database deleted.");
}

const db = new sqlite3.Database(dbFile);

// Create the carpool table
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS carpool (
    Id INTEGER PRIMARY KEY AUTOINCREMENT,
    Name TEXT NOT NULL,
    phno TEXT NOT NULL,
    origin TEXT NOT NULL,
    destination TEXT NOT NULL,
    price REAL NOT NULL,
    datetime TEXT NOT NULL,
    vacancies INTEGER NOT NULL
  )`, (err) => {
    if (err) {
      console.error("Error creating table: " + err.message);
    } else {
      console.log("Table created successfully.");
    }
  });
});

// Close the database connection
db.close();
