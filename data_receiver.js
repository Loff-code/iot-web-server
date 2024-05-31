const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
const port = 2000;

// Middleware to parse JSON body
app.use(bodyParser.json());

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

// Route for handling POST requests
app.post("/", (req, res) => {
  // Check if sensor_data exists in the request body
  if (!req.body || !req.body.sensor_data) {
    return res.status(400).send("Invalid data format");
  }

  const sensorData = req.body.sensor_data;

  // Insert sensor data into MySQL database
  const sql = "INSERT INTO sensor_data (sensor_value) VALUES (?)";
  db.query(sql, [sensorData], (err, result) => {
    if (err) {
      console.error("Error executing SQL statement: " + err.message);
      return res.status(500).send("Error executing SQL statement");
    }
    console.log("Sensor data inserted successfully");
    res.status(200).send("Sensor data inserted successfully");
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
