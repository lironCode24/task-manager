const express = require("express");
const User = require("../models/User");
const authenticate = require("../middleware/authenticate");  
const router = express.Router();


// Get user data (protected route)
router.get("/allUsers", authenticate, async (req, res) => {
  try {
    const users = await User.find({}, "id username email"); // Fetch specific fields
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


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

// Get user ID based on username (protected route)
router.get("/getUserId/:username", authenticate, async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }, "_id"); // Fetch only the user ID

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Get username based on user ID (protected route)
router.get("/getUsername/:userId", authenticate, async (req, res) => {
  try {
    const { userId } = req.params;  // Get userId from the URL parameter
    const user = await User.findById(userId, "username");  // Fetch the username based on userId

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
