const express = require("express");
const { verifyOtp } = require("../../Contollers/ePharm/otpController");

const router = express.Router();

router.post("/verify", verifyOtp);

module.exports = router;
