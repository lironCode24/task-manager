const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const router = express.Router();

// User register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  // Check if the email or username already exists
  const existingUser = await User.findOne({ $or: [{ username }, { email }] });
  if (existingUser) {
    return res.status(400).json({ message: "Username or email already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ username, email, password: hashedPassword, isApproved: false,isAdmin: false }); 

  try {
    await user.save();
    res.json({ message: "User registered successfully. You need to be approved by an admin." });
  } catch (error) {
    res.status(500).json({ message: "Error registering user" });
  }
});


// User login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
  
    // Check if the user is approved
    if (!user.isApproved) {
      return res.status(403).json({ message: "Your account is not approved by the admin yet." });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});



router.post("/approveUser/:username", async (req, res) => {
  const { username } = req.params;

  // Check if the user exists and is not already approved
  const user = await User.findOne({ username }, "_id"); // Fetch only the user ID

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.isApproved) {
    return res.status(400).json({ message: "User already approved" });
  }

  user.isApproved = true;
  try {
    await user.save();
    res.json({ message: "User approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error approving user" });
  }
});


module.exports = router;
