require('dotenv').config();

const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const session = require("express-session");
const bcrypt = require("bcrypt");
const app = express();

const port = 80;

const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect((err) => {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database");
});

app.use(express.static(path.join(__dirname, "public")));
app.set('trust proxy', 1);

app.use(session({
  name: 'sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: true
  }
}));


app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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
  });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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


app.delete("/state", (req, res) => {
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

  console.log("Received sensor_data:", sensorData);
  console.log("Received coolState:", coolState);
  console.log("Received time_stamp:", time_stamp);
  console.log("Received date_stamp:", date_stamp);

  if (!sensorData || coolState === undefined) {
    return res.status(400).send("Invalid request");
  }
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


function requireAuth(req, res, next) {
  if (!req.session.user) return res.status(401).send("Login required");
  next();
}


app.use((req, res, next) => {
  res.locals.currentUser = req.session.user || null;
  next();
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send("Missing creds");

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, rows) => {
    if (err) return res.status(500).send("DB error");
    const user = rows[0];
    if (!user) return res.status(400).send("Bad email or password");

    const ok = await bcrypt.compare(password, user.pw_hash);
    if (!ok) return res.status(400).send("Bad email or password");

    req.session.user = { id: user.id, name: user.displayName };
    res.sendStatus(204);
  });
});


app.post("/logout", (req, res) => {
  req.session.destroy(() => res.sendStatus(204));
});


app.get("/me", (req, res) => {
  res.json({ user: req.session.user || null });
});



app.post('/register', async (req, res) => {
  try {
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    const hash = await bcrypt.hash(password, 12);
    const sql =
      "INSERT INTO users (email, displayName, pw_hash) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE pw_hash = pw_hash";
    db.query(sql, [email, name, hash], (error, results) => {
      if (error) {
        console.error("Error executing SQL statement:", error);
        return res.status(500).send("Database error: " + error.message);
      }

      res.status(200).send("User registered successfully");
    });

  } catch (err) {
    console.error("Error hashing password:", err);
    res.status(500).send("Server error during registration");
  }
});




// Start server
app.listen(port, () => {
  console.log(
    `Server listening at http://192.168.1.240:${port} or http://localhost:${port}`
  );
});

