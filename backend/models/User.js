const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String, default: "profileIcon1" }, // Default avatar
  isApproved: { type: Boolean, default: false }, // Approval field
  isAdmin:{ type: Boolean, default: false }, // Approval field
});

module.exports = mongoose.model("User", userSchema);
