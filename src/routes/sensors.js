const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");

dotenv.config();

const {
    getAllData,
    getLatestData,
    get24hData,
    insertData,
    deleteData
} = require("../controllers/sensorsController");

function verifyEspSecret(req, res, next) {
    const token = req.headers["authorization"];
    if (token !== `Bearer ${process.env.ESP_SECRET}`) {
        return res.status(403).send("Forbidden - Invalid ESP secret");
    }
    next();
}

router.get("/", getAllData);
router.get("/latest", getLatestData);
router.get("/24h", get24hData);
router.post("/", verifyEspSecret, insertData);
router.delete("/", verifyEspSecret, deleteData);

module.exports = router;
