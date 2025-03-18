import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// **Register a User**
router.post("/register", async (req, res) => {
    try {
      const { fullName, email, password, accountType, governmentID, dateOfBirth,phoneNumber } = req.body;
  
      // Check if all required fields are provided
      if (!fullName || !email || !password || !accountType || !governmentID || !dateOfBirth) {
        return res.status(400).json({ message: "All fields (fullName, email, password, accountType, governmentID, dateOfBirth) are required" });
      }
  
      // Validate government ID (Example: It must be exactly 12 digits)
      if (!/^\d{12}$/.test(governmentID)) {
        return res.status(400).json({ message: "Invalid government ID. It must be a 12-digit number." });
      }
      if (!/^\+91\d{10}$/.test(phoneNumber)) {
        return res.status(400).json({ message: "Invalid phone number. It must be in E.164 format like +919876543210." });
    }
      // Validate date of birth (Format: YYYY-MM-DD)
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateOfBirth)) {
        return res.status(400).json({ message: "Invalid dateOfBirth format. Use YYYY-MM-DD." });
      }
  
      // Calculate age and check if the user is above 18
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      if (age < 18) {
        return res.status(400).json({ message: "You must be at least 18 years old to register." });
      }
  
      // Check if email is already registered
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "User already exists" });
  
      // Check if government ID is already registered
      const existingGovID = await User.findOne({ governmentID });
      if (existingGovID) return res.status(400).json({ message: "Government ID is already registered" });
      const existingPhone = await User.findOne({ phoneNumber });
      if (existingPhone) return res.status(400).json({ message: "Phone number is already registered" });
      // Create new user and save it
      const user = new User(req.body);
      await user.save();
  
      // Generate token
      const token = user.generateAuthToken();
  
      res.status(201).cookie("authToken", token, { httpOnly: true }).json({ user, token });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
  

// **Login User**
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = user.generateAuthToken();
    res.status(200).cookie("authToken", token, { httpOnly: true }).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// **Logout User**
router.post("/logout", auth, (req, res) => {
  res.clearCookie("authToken").json({ message: "Logged out successfully" });
});


router.get("/findusers",  async (req, res) => {
    try {
      const users = await User.find().select("-password"); // Exclude passwords
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

export default router;
