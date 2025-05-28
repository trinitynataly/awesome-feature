const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Define the database file path
const dbPath = path.join(__dirname, 'form_submissions.sqlite3');

// Open or create the database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Database opened at:', dbPath);
  }
});

// Create the 'submissions' table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first TEXT NOT NULL,
      last TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT,
      dob TEXT,
      state TEXT,
      suburb TEXT,
      street TEXT,
      house TEXT,
      message TEXT NOT NULL,
      submitted_at TEXT NOT NULL
    )
  `, (err) => {
    if (err) {
      console.error('Error creating table:', err.message);
    } else {
      console.log('Table "submissions" is ready.');
    }
  });
});

// Close connection
db.close();
