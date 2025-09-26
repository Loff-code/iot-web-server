const db = require("../db");
const bcrypt = require("bcrypt");

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send("Missing creds");

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, rows) => {
        if (err) return res.status(500).send("DB error");
        const user = rows[0];
        if (!user) return res.status(400).send("Bad email or password");

        const ok = await bcrypt.compare(password, user.pw_hash);
        if (!ok) return res.status(400).send("Bad email or password");

        req.session.user = { id: user.id, name: user.displayName };

        req.session.save(err => {
            if (err) {
                console.error("Session save error:", err);
                return res.status(500).send("Login failed");
            }
            res.status(200).json({ user: req.session.user });
        });
    });
};


exports.logout = (req, res) => {
    req.session.destroy(() => res.sendStatus(204));
};

exports.register = async (req, res) => {
    try {
        const { email, name, password } = req.body;
        const hash = await bcrypt.hash(password, 12);
        const sql =
            "INSERT INTO users (email, displayName, pw_hash) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE pw_hash = pw_hash";
        db.query(sql, [email, name, hash], (err) => {
            if (err) return res.status(500).send("DB error");
            res.send("User registered successfully");
        });
    } catch (err) {
        res.status(500).send("Server error during registration");
    }
};

exports.me = (req, res) => {
    res.json({ user: req.session.user || null });
};
