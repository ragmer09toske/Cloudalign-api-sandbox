import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";
import dotenv from "dotenv";

dotenv.config();

// Set up serial communication with Arduino
const port = new SerialPort({
  path: process.env.SERIAL_PORT || "COM3",
  baudRate: 9600,
});
const parser = port.pipe(new ReadlineParser({ delimiter: "\n" }));

// Predefined valid OTPs
const validOtps = {
  1234: "1",
  5678: "2",
  4321: "3",
  8765: "4",
};

// Controller function to handle OTP validation and serial communication
export const verifyOtp = async (req, res) => {
  const { otp } = req.body;

  if (!otp) {
    return res
      .status(400)
      .json({ success: false, message: "OTP is required." });
  }

  if (validOtps[otp]) {
    const doorNumber = validOtps[otp];
    console.log(`✅ OTP Correct! Opening Door ${doorNumber}...`);
    port.write(doorNumber + "\n"); // Send to Arduino
    return res.json({
      success: true,
      message: `✅ Door ${doorNumber} is opening!`,
    });
  } else {
    console.log("❌ Invalid OTP! Access Denied.");
    port.write("0\n"); // Send "0" for failure
    return res
      .status(401)
      .json({ success: false, message: "❌ Invalid OTP! Access Denied." });
  }
};

// Log when serial port opens
port.on("open", () => {
  console.log("🚀 Serial Port Opened. Ready to receive OTPs.");
});
