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

// Get all tasks for the authenticated user
router.get('/getTasks', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;  // Extract user ID from token
    console.log("Fetching tasks for user:", userId); // Debugging

    const tasks = await Task.find({ userId }); // Query tasks linked to user
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get task by id
router.get('/getTaskById', authenticate, async (req, res) => {
  const taskId = req.query.id; // Get id from query params

  if (!taskId) {
    return res.status(400).json({ message: "Task ID is required" });
  }

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({ message: "Error fetching task" });
  }
});


// Update Task by ID
router.put("/:id", authenticate, async (req, res) => {
  const taskId = req.params.id;
  const updatedTask = req.body;

  try {
    const task = await Task.findByIdAndUpdate(taskId, updatedTask, {
      new: true, // Return the updated task
      runValidators: true, // Ensure new data is validated
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
});

module.exports = router;
