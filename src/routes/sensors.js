const express = require("express");
const router = express.Router();
const {
    getAllData,
    getLatestData,
    insertData,
    deleteData
} = require("../controllers/sensorsController");

// Routes
router.get("/", getAllData);           // GET /api/sensors
router.get("/latest", getLatestData);  // GET /api/sensors/latest
router.post("/", insertData);          // POST /api/sensors
router.delete("/", deleteData);        // DELETE /api/sensors

module.exports = router;
