import express from "express";
import { verifyOtp } from "../../Contollers/ePharm/otpController";

const router = express.Router();

router.post("/verify", verifyOtp);

export default router;
