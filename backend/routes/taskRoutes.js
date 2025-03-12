const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authenticate = require('../middleware/authenticate');  

// Route to handle task creation
router.post('/tasks', authenticate, async (req, res) => {
  const { title, description, dueDate, priority, status } = req.body;
  const userId = req.user.id;  // Extracted from the token

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      userId,  // Store the userId from the token
    });

    await newTask.save();  // Save the new task to the database
    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ message: "Error adding task" });
  }
});

module.exports = router;
