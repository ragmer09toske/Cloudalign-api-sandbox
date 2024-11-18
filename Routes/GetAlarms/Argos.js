const express = require("express");
const {
  fetchAlarmsFromExternalApi,
} = require("../../Contollers/GetAlarms/Argos");
const router = express.Router();

router.get("/", fetchAlarmsFromExternalApi);
module.exports = router;
