const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, // Title is required
  },
  description: {
    type: String,
    required: true, // Description is required
  },
  dueDate: {
    type: Date,
    required: true, // Due Date is required
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"], // Only these values are allowed
    default: "Medium", // Default value
  },
  status: {
    type: String,
    enum: ["Not Started", "In Progress", "Completed"], // Enum for task status
    default: "Not Started", // Default value
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true, // Reference to the User model
  },
  completionDate: { type: Date }, // New field for completion date
  notes: {
    type: String, // Free text notes field for extra information
  },
  subtasks: [
    {
      text: { type: String, required: true }, // Subtask description
      done: { type: Boolean, default: false }, // Checkbox status (checked or not)
    }
  ],
  assignee: { type: String, required: false }

}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
