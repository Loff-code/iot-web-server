const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const {
    getAllData,
    getLatestData,
    insertData,
    deleteData
} = require("../controllers/sensorsController");

// Middleware to verify ESP secret
function verifyEspSecret(req, res, next) {
    const token = req.headers["authorization"];
    if (token !== `Bearer ${process.env.ESP_SECRET}`) {
        return res.status(403).send("Forbidden - Invalid ESP secret");
    }
    next();
}

router.get("/", getAllData);
router.get("/latest", getLatestData);

// Only ESP is allowed to insert or delete
router.post("/", verifyEspSecret, insertData);
router.delete("/", verifyEspSecret, deleteData);

module.exports = router;
