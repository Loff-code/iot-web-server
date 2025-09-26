const express = require("express");
const router = express.Router();
const {
    getState,
    getFrq,
    insertLightState,
    insertFrq,
    deleteState
} = require("../controllers/devicesController");

// Routes
router.get("/state", getState);          // GET /api/devices/state
router.get("/frq", getFrq);              // GET /api/devices/frq
router.post("/light", insertLightState); // POST /api/devices/light
router.post("/frq", insertFrq);          // POST /api/devices/frq
router.delete("/state", deleteState);    // DELETE /api/devices/state

module.exports = router;
