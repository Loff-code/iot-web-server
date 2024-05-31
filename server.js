const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
const port = 4000;

// MySQL database connection
const db = mysql.createConnection({
  host: "localhost",
  user: "example_user",
  password: "9Lesbians!",
  database: "mydatabase",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database");
});

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Endpoint to get data from MySQL
app.get("/data", (req, res) => {
  db.query("SELECT id, sensor_value FROM sensor_data", (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).send("Error executing SQL query");
      return;
    }
    res.json(results);
  });
});

// Serve index.html at the root URL
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
// Route to delete all data
app.delete("/data", (req, res) => {
  db.query("DELETE FROM sensor_data", (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).send("Error executing SQL query");
      return;
    }
    res.send("All data deleted successfully");
  });
  db.query("ALTER TABLE sensor_data AUTO_INCREMENT = 1", (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      return;
    }
    console.log("Table auto-increment reset");
  });
});
