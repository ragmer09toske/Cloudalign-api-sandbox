const express = require("express");
const router = express.Router();
const Controller = require("../Contollers/envirometal");

// POST route to process ThingSpeak data
router.post("/generic", Controller.processGeneric);
router.get("/generic", Controller.getAllGenericData);
router.delete("/generic", Controller.deleteAllGenericData);

module.exports = router;
