const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

// Create an instance of Express
const app1 = express();

// Use body-parser middleware to parse URL-encoded request bodies
app1.use(bodyParser.urlencoded({ extended: true }));

// Database configuration
const dbConfig = {
  host: "localhost",
  user: "example_user",
  password: "9Lesbians!",
  database: "mydatabase",
};

// Create a MySQL connection pool
const pool = mysql.createPool(dbConfig);

// Route to handle POST requests
app1.post("/data_receiver", (req, res) => {
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

  pool.query(sql, [sensorData, coolState], (error, results) => {
    if (error) {
      console.error("Error executing SQL statement:", error);
      return res.status(500).send("Database error: " + error.message);
    }

    res.status(200).send("Sensor data inserted successfully");
  });
});

// Start the server
const PORT = 3000;
app1.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
