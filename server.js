require('dotenv').config();
const express = require("express");
const session = require("express-session");
const path = require("path");

// Route modules
const sensorsRoutes = require("./src/routes/sensors");
const devicesRoutes = require("./src/routes/devices");
const authRoutes = require("./src/routes/auth");

const app = express();
const port = process.env.PORT || 80;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1);

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

app.use("/api/sensors", sensorsRoutes);
app.use("/api/devices", devicesRoutes);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
