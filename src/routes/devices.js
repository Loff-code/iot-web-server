const express = require("express");
const router = express.Router();
const {
    getState,
    getFrq,
    insertLightState,
    insertFrq,
    deleteState
} = require("../controllers/devicesController");

router.get("/state", getState);
router.get("/frq", getFrq);
router.post("/light", insertLightState);
router.post("/frq", insertFrq);
router.delete("/state", deleteState);

module.exports = router;
