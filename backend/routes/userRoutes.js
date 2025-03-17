const express = require("express");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");  
const router = express.Router();

// Get user data (protected route)
router.get("/data", authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update user avatar (protected route)
router.post("/update-avatar", authenticate, async (req, res) => {
  const { avatar } = req.body; // Get new avatar name from request body

  if (!avatar) {
    return res.status(400).json({ message: "Avatar is required" });
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatar = avatar; // Update the avatar field
    await user.save(); // Save changes to the database

    res.json({ message: "Avatar updated successfully", avatar: user.avatar });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
