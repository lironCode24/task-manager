import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AddTask.css"; 

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ title: "", description: "", priority: "", status: "", dueDate: "" });
  const [errorMessage, setErrorMessage] = useState(""); 
  const [successMessage, setSuccessMessage] = useState(""); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchTask = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/tasks/getTaskById?id=${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setTask(data);
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    // Simple validation checks
    if (!task.title || !task.description || !task.dueDate) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(task),
      });

      if (response.ok) {
        setSuccessMessage("Task updated successfully! ✅");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/dashboard"); 
        }, 2000); // 2 seconds delay
      } else {
        setErrorMessage("Failed to update task.");
      }
    } catch (error) {
      setErrorMessage("Error updating task.");
    }
  };

  return (
    <div className="task-form-container">
      <h2>Edit Task</h2>
      
      {/* Display success message */}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      {/* Display error message */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div>
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Enter task title"
            value={task.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter task description"
            value={task.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Due Date Field */}
        <div>
          <label htmlFor="dueDate">Due Date *</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={task.dueDate ? task.dueDate.split("T")[0] : ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* Priority Field */}
        <div>
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={task.priority}
            onChange={handleChange}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Status Field */}
        <div>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={task.status}
            onChange={handleChange}
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit">Save Changes</button>
      </form>
      
      {/* Back to dashboard Button */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "red",
        }}
      >
        Back to dashboard
      </button>
    </div>
  );
}

export default EditTask;
