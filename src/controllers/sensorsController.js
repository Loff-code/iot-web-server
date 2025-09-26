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
    let { sensor_data, coolState, time_stamp, date_stamp, humidity, temperature } = req.body;

    if (sensor_data === undefined || coolState === undefined) {
        return res.status(400).send("Invalid request");
    }

    sensor_data = parseFloat(sensor_data);
    humidity = humidity ? parseFloat(humidity) : null;
    temperature = temperature ? parseFloat(temperature) : null;
    coolState = (coolState === true || coolState === "true") ? 1 : 0;

    const sql = `
    INSERT INTO sensor_data (sensor_value, coolState, time_stamp, date_stamp, humidity, temperature)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

    db.query(sql, [sensor_data, coolState, time_stamp, date_stamp, humidity, temperature], (err) => {
        if (err) {
            console.error("DB error:", err);
            return res.status(500).send("DB error: " + err.message);
        }
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


exports.get24hData = (req, res) => {
    const lastHourQuery = `
    SELECT 
      CONCAT(date_stamp, ' ', time_stamp) AS timestamp,
      sensor_value AS value
    FROM sensor_data
    WHERE STR_TO_DATE(CONCAT(date_stamp, ' ', time_stamp), '%d/%m/%Y %H:%i:%s') >= NOW() - INTERVAL 1 HOUR
    ORDER BY timestamp
  `;

    const perMinuteQuery = `
    SELECT 
      DATE_FORMAT(
        STR_TO_DATE(CONCAT(date_stamp, ' ', time_stamp), '%d/%m/%Y %H:%i:%s'),
        '%Y-%m-%d %H:%i:00'
      ) AS minute,
      AVG(sensor_value) AS avg_value
    FROM sensor_data
    WHERE STR_TO_DATE(CONCAT(date_stamp, ' ', time_stamp), '%d/%m/%Y %H:%i:%s') >= NOW() - INTERVAL 24 HOUR
      AND STR_TO_DATE(CONCAT(date_stamp, ' ', time_stamp), '%d/%m/%Y %H:%i:%s') < NOW() - INTERVAL 1 HOUR
    GROUP BY minute
    ORDER BY minute
  `;

    db.query(lastHourQuery, (err, lastHourRows) => {
        if (err) return res.status(500).send("DB error: last hour");

        db.query(perMinuteQuery, (err2, perMinuteRows) => {
            if (err2) return res.status(500).send("DB error: per minute");

            res.json({
                lastHour: lastHourRows,
                perMinute: perMinuteRows
            });
        });
    });
};
