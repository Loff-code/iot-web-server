const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const bodyParser = require("body-parser");

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

// Use body-parser middleware to parse URL-encoded request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to get data from MySQL
app.get("/data", (req, res) => {
  db.query("SELECT * FROM sensor_data", (err, results) => {
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

// Route to handle POST requests
app.post("/data_receiver", (req, res) => {
  const sensorData = req.body.sensor_data;
  let coolState = req.body.coolState;

  // Debugging: Log received data
  console.log("Received sensor_data:", sensorData);
  console.log("Received coolState:", coolState);

  if (!sensorData || coolState === undefined) {
    return res.status(400).send("Invalid request");
  }

  // Convert coolState to an integer (1 or 0)
  coolState = coolState === "true";

  const sql = "INSERT INTO sensor_data (sensor_value, coolState) VALUES (?, ?)";

  db.query(sql, [sensorData, coolState], (error, results) => {
    if (error) {
      console.error("Error executing SQL statement:", error);
      return res.status(500).send("Database error: " + error.message);
    }

    res.status(200).send("Sensor data inserted successfully");
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
