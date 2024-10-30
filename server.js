const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 80;

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
    // console.log("All data:", results);
  });
});

app.get("/state", (req, res) => {
  db.query(
    "SELECT * FROM light_state ORDER BY id DESC LIMIT 1",
    (err, results) => {
      if (err) {
        console.error("Error executing SQL query:", err);
        res.status(500).send("Error executing SQL query");
        return;
      }
      results =
        String(results[0].red) +
        String(results[0].yellow) +
        String(results[0].green);
      res.json(results);
      // console.log("Last coolState:", results);
    }
  );
});
app.get("/frq", (req, res) => {
  db.query("SELECT * FROM freq ORDER BY id DESC LIMIT 1", (err, results) => {
    if (err) {
      console.error("Error executing SQL query:", err);
      res.status(500).send("Error executing SQL query");
      return;
    }
    results = results[0].frq;
    res.json(results);
    // console.log("Last coolState:", results);
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
  let time_stamp = req.body.time_stamp;
  let date_stamp = req.body.date_stamp;

  // Debugging: Log received data
  console.log("Received sensor_data:", sensorData);
  console.log("Received coolState:", coolState);
  console.log("Received time_stamp:", time_stamp);
  console.log("Received date_stamp:", date_stamp);
  if (!sensorData || coolState === undefined) {
    return res.status(400).send("Invalid request");
  }

  // Convert coolState to an integer (1 or 0)
  coolState = coolState === "true";

  const sql =
    "INSERT INTO sensor_data (sensor_value, coolState, time_stamp, date_stamp) VALUES (?, ?, ?, ?)";

  db.query(
    sql,
    [sensorData, coolState, time_stamp, date_stamp],
    (error, results) => {
      if (error) {
        console.error("Error executing SQL statement:", error);
        return res.status(500).send("Database error: " + error.message);
      }

      res.status(200).send("Sensor data inserted successfully");
    }
  );
});
app.post("/light_receiver", (req, res) => {
  let red = req.body.red;
  let yellow = req.body.yellow;
  let green = req.body.green;

  // Debugging: Log received data
  console.log("Received red:", red);
  console.log("Received yellow:", yellow);
  console.log("Received green:", green);

  if (!red || !yellow || !green) {
    return res.status(400).send("Invalid request");
  }
  const sql = "INSERT INTO light_state (red, yellow, green) VALUES (?, ?, ?)";
  db.query(sql, [red, yellow, green], (error, results) => {
    if (error) {
      console.error("Error executing SQL statement:", error);
      return res.status(500).send("Database error: " + error.message);
    }
    res.status(200).send("Light state inserted successfully");
  });
});
app.post("/frq_receiver", (req, res) => {
  let frq = req.body.frq;

  // Debugging: Log received data
  console.log("Received frq:", frq);

  if (!frq) {
    return res.status(400).send("Invalid request");
  }
  const sql = "INSERT INTO freq (frq) VALUES (?)";
  db.query(sql, [frq], (error, results) => {
    if (error) {
      console.error("Error executing SQL statement:", error);
      return res.status(500).send("Database error: " + error.message);
    }
    res.status(200).send("Frq inserted successfully");
  });
});

// Start server
app.listen(port, () => {
  console.log(
    `Server listening at http://192.168.1.131:${port} or http://localhost:${port}`
  );
});
