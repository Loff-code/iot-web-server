const db = require("../db");

exports.getState = (req, res) => {
    db.query("SELECT * FROM light_state ORDER BY id DESC LIMIT 1", (err, results) => {
        if (err) return res.status(500).send("DB error");
        const state = `${results[0].red}${results[0].yellow}${results[0].green}`;
        res.json(state);
    });
};

exports.getFrq = (req, res) => {
    db.query("SELECT * FROM freq ORDER BY id DESC LIMIT 1", (err, results) => {
        if (err) return res.status(500).send("DB error");
        res.json(results[0].frq);
    });
};

exports.insertLightState = (req, res) => {
    const { red, yellow, green } = req.body;
    if (!red || !yellow || !green) return res.status(400).send("Invalid request");

    const sql = "INSERT INTO light_state (red, yellow, green) VALUES (?, ?, ?)";
    db.query(sql, [red, yellow, green], (err) => {
        if (err) return res.status(500).send("DB error");
        res.send("Light state inserted successfully");
    });
};

exports.insertFrq = (req, res) => {
    const { frq } = req.body;
    if (!frq) return res.status(400).send("Invalid request");

    const sql = "INSERT INTO freq (frq) VALUES (?)";
    db.query(sql, [frq], (err) => {
        if (err) return res.status(500).send("DB error");
        res.send("Frq inserted successfully");
    });
};

exports.deleteState = (req, res) => {
    db.query("DELETE FROM light_state", (err) => {
        if (err) return res.status(500).send("DB error");
        res.send("All state data deleted successfully");
    });
    db.query("ALTER TABLE light_state AUTO_INCREMENT = 1", (err) => {
        if (err) console.error("Error resetting auto-increment:", err);
    });
};
