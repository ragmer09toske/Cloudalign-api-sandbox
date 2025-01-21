const express = require("express");
const {
  fetchAlarmsFromExternalApi,
  listenAndExportAlarms,
} = require("../../Contollers/GetAlarms/Argos");
const router = express.Router();

router.get("/", fetchAlarmsFromExternalApi);
router.get("/listen-and-export", listenAndExportAlarms);

module.exports = router;
