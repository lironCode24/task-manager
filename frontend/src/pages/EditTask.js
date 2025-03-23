import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AddTask.css";

function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Not Started",
    dueDate: "",
    completionDate: "",
    notes: "" ,
    assignee: "" ,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const today = new Date().toISOString().split("T")[0];

  // Restrict future due dates to 5 years from today
  const fiveYearsLater = new Date();
  fiveYearsLater.setFullYear(fiveYearsLater.getFullYear() + 5);
  const maxDate = fiveYearsLater.toISOString().split("T")[0];

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchTask = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/tasks/getTaskById?id=${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await response.json();
        setTask({
          ...data,
          dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
          completionDate: data.completionDate ? data.completionDate.split("T")[0] : "",
          notes: data.notes || "", 
          assignee: data.assignee || "", 
        });
      } catch (error) {
        console.error("Error fetching task:", error);
      }
    };

    fetchTask();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let updatedTask = { ...task, [name]: value };
  
    // Manually set completionDate when the user selects a date
    if (name === "completionDate" && task.status === "Completed") {
      updatedTask.completionDate = value;
    }
  
    // If the status is changed, clear the completionDate unless it's "Completed"
    if (name === "status" && value !== "Completed") {
      updatedTask.completionDate = ""; // Clear completionDate if status is not "Completed"
    }
  
    setTask(updatedTask);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    if (!task.title || !task.description || !task.dueDate) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }

    const taskData = {
      ...task,
      ...(task.status === "Completed" ? { completionDate: task.completionDate } : {}),
    };

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        setSuccessMessage("Task updated successfully! ✅");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/dashboard");
        }, 2000);
      } else {
        setErrorMessage("Failed to update task.");
      }
    } catch (error) {
      setErrorMessage("Error updating task.");
    }
  };

   // Delete Task Function
   const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Task deleted successfully!");
        navigate("/dashboard");
      } else {
        setErrorMessage("Failed to delete task.");
      }
    } catch (error) {
      setErrorMessage("Error deleting task.");
    }
  };

  return (
    <div className="task-form-container">
      <h2>Edit Task</h2>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={task.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            onChange={handleChange}
            required
          />
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate">Due Date *</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={task.dueDate}
            onChange={handleChange}
            min={today}
            max={maxDate}
            required
          />
        </div>

        {/* Priority */}
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

        {/* Status */}
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" value={task.status} onChange={handleChange}>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {task.status === "Completed" && (
          <div>
            <label htmlFor="completionDate">Completion Date</label>
            <input
              type="date"
              id="completionDate"
              name="completionDate"
              value={task.completionDate || ""}
              min="1900-01-01" // Allow past dates
              max={new Date().toISOString().split("T")[0]} // Restrict future dates
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* Notes Field */}
        <div>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={task.notes}
            onChange={handleChange}
          />
        </div>

        
        {/* Assignee Field */}
        <div>
          <label htmlFor="assignee">Assignee</label>
          <textarea
            id="assignee"
            name="assignee"
            value={task.assignee}
            onChange={handleChange}
          />
        </div>

        {/* Submit Button */}
        <button type="submit">Save Changes</button>
      </form>


      {/* Delete Task Button */}
      <button
        onClick={handleDelete}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "red",
          color: "white",
          marginTop: "10px",
        }}
      >
        Delete Task
      </button>


      {/* Back to dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "blue",
        }}
      >
        Back to dashboard
      </button>
    </div>
  );
}

export default EditTask;
