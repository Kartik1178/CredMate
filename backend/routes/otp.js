import express from "express";
import crypto from "crypto";
import User from "../models/user.js";
import { sendOTP } from "../mailer.js";

const router = express.Router();

// **Send OTP via Email**
router.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate a 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // Expires in 5 min
    await user.save();

    // Send OTP via email
    await sendOTP(email, otp);

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// **Verify OTP**
router.post("/verify-otp", async (req, res) => {
    try {
      const { email, otp } = req.body;
  
      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      // Check if OTP matches and is not expired
      if (user.otp !== otp || new Date() > user.otpExpiresAt) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }
  
      // Clear OTP after successful verification
      user.otp = null;
      user.otpExpiresAt = null;
      await user.save();
  
      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

export default router;
