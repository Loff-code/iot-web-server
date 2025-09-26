const db = require("../db");

exports.getAllData = (req, res) => {
    db.query("SELECT * FROM sensor_data", (err, results) => {
        if (err) return res.status(500).send("DB error");
        res.json(results);
    });
};

exports.getLatestData = (req, res) => {
    db.query("SELECT * FROM sensor_data ORDER BY id DESC LIMIT 1", (err, results) => {
        if (err) return res.status(500).send("DB error");
        res.json(results[0]);
    });
};

exports.insertData = (req, res) => {
    const { sensor_data, coolState, time_stamp, date_stamp, humidity, temperature } = req.body;

    if (!sensor_data || coolState === undefined) {
        return res.status(400).send("Invalid request");
    }

    const sql =
        "INSERT INTO sensor_data (sensor_value, coolState, time_stamp, date_stamp, humidity, temperature) VALUES (?, ?, ?, ?, ?, ?)";

    db.query(sql, [sensor_data, coolState, time_stamp, date_stamp, humidity, temperature], (err) => {
        if (err) return res.status(500).send("DB error");
        res.send("Sensor data inserted successfully");
    });
};

exports.deleteData = (req, res) => {
    db.query("DELETE FROM sensor_data", (err) => {
        if (err) return res.status(500).send("DB error");
        res.send("All sensor data deleted successfully");
    });
    db.query("ALTER TABLE sensor_data AUTO_INCREMENT = 1", (err) => {
        if (err) console.error("Error resetting auto-increment:", err);
    });
};
