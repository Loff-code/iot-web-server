const mysql = require("mysql2");

const db = mysql.createConnection(process.env.DATABASE_URL);

db.connect(err => {
    if (err) {
        console.error("DB connection failed: " + err.stack);
        process.exit(1);
    }
    console.log("Connected to database");
});

module.exports = db;
