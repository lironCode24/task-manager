const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authenticate = require('../middleware/authenticate');  
const router = express.Router();

// Protected route to get user data
router.get("/data", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password from response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
