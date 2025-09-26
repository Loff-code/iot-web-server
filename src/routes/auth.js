const express = require("express");
const router = express.Router();
const { login, logout, register, me } = require("../controllers/authController");

// Routes
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.get("/me", me);

module.exports = router;
