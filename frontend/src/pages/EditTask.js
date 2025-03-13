import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({ title: "", description: "", priority: "", status: "" });
  const [successMessage, setSuccessMessage] = useState(""); 

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchTask = async () => {
      console.log(`http://localhost:5000/api/tasks/getTaskById?id=${id}`)
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
        setSuccessMessage("Task updated successfully! ✅"); //  Show success message

        setTimeout(() => {
          setSuccessMessage("");
          navigate("/dashboard"); 
        }, 2000); // 2 seconds delay
      } else {
        console.error("Failed to update task.");
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <div className="edit-task-container">
      <h2>Edit Task</h2>
      
      {successMessage && <p className="success-message">{successMessage}</p>} {/* Display success message */}

      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" name="title" value={task.title} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={task.description} onChange={handleChange} required />

        <label>Priority:</label>
        <select name="priority" value={task.priority} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label>Status:</label>
        <select name="status" value={task.status} onChange={handleChange}>
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <button type="submit">Save Changes</button>
        
      <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Back to dashboard
        </button>
      </form>
    </div>
  );
}

export default EditTask;
