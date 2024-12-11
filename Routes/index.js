const express = require("express");
const { login } = require("../Contollers/auth/index");
const { getEmail } = require("../Contollers/auth/index");
const { driver_register } = require("../Contollers/auth/index");
const router = express.Router();

router.get("/login", login);
router.get("/getemail", getEmail);
router.get("/driver_register", driver_register);

module.exports = router;
