// routes/thingSpeakRoutes.js

const express = require("express");
const router = express.Router();
const thingSpeakController = require("../Contollers/envirometal");

// POST route to process ThingSpeak data
router.post("/thingspeak-data", thingSpeakController.processThingSpeakData);

module.exports = router;
