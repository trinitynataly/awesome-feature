const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Define database path
const dbPath = path.join(__dirname, 'form_submissions.sqlite3');

// Middleware to parse JSON and form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from public_html
app.use(express.static(path.join(__dirname, 'public_html')));

// Serve homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public_html', 'index.html'));
});

// Handle form submission
app.post('/form-handler', (req, res) => {
  const fields = [
    "first", "last", "email", "phone",
    "dob", "state", "suburb", "street", "house", "message"
  ];

  const labelMap = {
    first: "First name",
    last: "Last name",
    email: "Email address",
    phone: "Phone number",
    dob: "Date of birth",
    state: "State",
    suburb: "Suburb",
    street: "Street",
    house: "House or unit number",
    message: "Message"
  };

  const cleaned = {};
  const errors = [];

  for (const field of fields) {
    let value = (req.body[field] || "").toString().trim();

    // Check required
    if (!value) {
      errors.push(`Missing ${labelMap[field]}`);
      continue;
    }

    // Block HTML/script tags
    if (/<\/?[^>]+>/gi.test(value)) {
      errors.push(`${labelMap[field]} must not contain HTML or code`);
      continue;
    }

    // Field-specific validation
    if (["first", "last", "suburb", "street", "house"].includes(field) && value.length > 50) {
      errors.push(`${labelMap[field]} cannot be longer than 50 characters`);
      continue;
    }

    if (field === "message" && value.length > 3000) {
      errors.push("Message cannot be longer than 3000 characters");
      continue;
    }

    if (field === "email" && !/^\S+@\S+\.\S+$/.test(value)) {
      errors.push("Invalid email format");
      continue;
    }

    if (field === "phone") {
      const cleanedPhone = value.replace(/[\s\-]/g, '');
      if (!/^\d+$/.test(cleanedPhone) || cleanedPhone.length > 15) {
        errors.push("Phone must be digits only and up to 15 characters");
        continue;
      }
      value = cleanedPhone;
    }

    cleaned[field] = value;
  }

  if (errors.length > 0) {
    console.warn("Form validation failed:", errors);
    return res.status(400).send(errors.join(". ") + ".");
  }

  const submitted_at = new Date().toISOString();

  const db = new sqlite3.Database(dbPath);
  const sql = `
    INSERT INTO submissions (
      first, last, email, phone, dob,
      state, suburb, street, house, message, submitted_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(sql, [
    cleaned.first, cleaned.last, cleaned.email, cleaned.phone, cleaned.dob,
    cleaned.state, cleaned.suburb, cleaned.street, cleaned.house,
    cleaned.message, submitted_at
  ], function (err) {
    db.close();

    if (err) {
      console.error("Error saving submission:", err.message);
      return res.status(500).send("Failed to save your submission.");
    }

    console.log("Form saved. ID:", this.lastID);
    res.send("OK");
  });
});


app.post('/delete-submission', (req, res) => {
  const id = parseInt(req.body.id, 10);
  if (!id) return res.status(400).send("Invalid ID");

  const db = new sqlite3.Database(dbPath);
  db.run('DELETE FROM submissions WHERE id = ?', [id], function (err) {
    db.close();
    if (err) {
      console.error("Error deleting submission:", err.message);
      return res.status(500).send("Failed to delete submission.");
    }

    console.log("Deleted submission ID:", id);
    res.send("OK");
  });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/submissions.json', (req, res) => {
  const sqlite3 = require('sqlite3').verbose();
  const db = new sqlite3.Database(path.join(__dirname, 'form_submissions.sqlite3'));

  db.all('SELECT * FROM submissions ORDER BY submitted_at DESC', [], (err, rows) => {
    db.close();
    if (err) {
      console.error("Error fetching submissions:", err.message);
      return res.status(500).json([]);
    }
    res.json(rows);
  });
});

