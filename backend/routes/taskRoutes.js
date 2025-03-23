const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authenticate = require('../middleware/authenticate');  

// Route to handle task creation
router.post('/tasks', authenticate, async (req, res) => {
  const { title, description, dueDate, priority, status, completionDate, notes ,assignee } = req.body;
  const userId = req.user.id;  // Extracted from the token

  try {
    const newTask = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      userId,
      completionDate,
      notes,  
      assignee,
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

    // Query tasks where either the user is the creator (userId) or the assignee
    const tasks = await Task.find({
      $or: [
        { userId },           // Tasks where user is the creator
        { assigneeId: userId } // Tasks where user is the assignee
      ]
    });

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


router.put("/:id", authenticate, async (req, res) => {
  const taskId = req.params.id;
  const { title, description, dueDate, priority, status, completionDate, notes, assignee } = req.body;
  
  try {
    let updatedTask = { title, description, dueDate, priority, status, completionDate, notes,assignee }; 

    const task = await Task.findByIdAndUpdate(taskId, updatedTask, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ message: "Error updating task" });
  }
});


// Route to delete a task
router.delete('/:id', authenticate, async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findOneAndDelete({ _id: taskId, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

module.exports = router;
