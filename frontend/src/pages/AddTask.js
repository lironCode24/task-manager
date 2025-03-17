import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddTask.css"; 

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Not Started");
  const [notes, setNotes] = useState(""); 
  const [assignee, setAssignee] = useState(""); 
  const [errorMessage, setErrorMessage] = useState("");
  const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format
  const [completionDate, setCompletionDate] = useState(today);
  const navigate = useNavigate();

  // Get 5 years from today in YYYY-MM-DD format
  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 5);
  const maxDate = oneYearLater.toISOString().split("T")[0];
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation checks
    if (!title || !description || !dueDate) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }

    const taskData = {
      title,
      description,
      dueDate,
      priority,
      status,    
      notes,
      assignee,
      ...(status === "Completed" && { completionDate }) // Only include if completed
    };
    
    const token = localStorage.getItem("token");

    // Send task data to the backend
    try {
        const response = await fetch("http://localhost:5000/api/tasks/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
        });
  
        if (response.ok) {
          navigate("/dashboard");  // Redirect to dashboard after task is added
        } else {
          const error = await response.json();
          setErrorMessage(error.message || "Failed to add task.");
        }
      } catch (error) {
        setErrorMessage("Error connecting to the server.");
      }
  };

  return (
    <div className="task-form-container">
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        {/* Title Field */}
        <div>
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            placeholder="Enter task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Due Date Field */}
        <div>
          <label htmlFor="dueDate">Due Date *</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}            
            onChange={(e) => setDueDate(e.target.value)}
            min={today}   // Restrict past dates
            max={maxDate} // Restrict future dates beyond one year
            required
          />
        </div>

        {/* Priority Field */}
        <div>
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
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
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setCompletionDate(e.target.value === "Completed" ? today : ""); // Auto-set or clear
            }}          
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {status === "Completed" && (
            <div>
              <label htmlFor="completionDate">Completion Date</label>
              <input
                type="date"
                id="completionDate"
                value={completionDate || ""}
                min="1900-01-01" // Allow any past date
                max={today} // Restrict future dates
                onChange={(e) => setCompletionDate(e.target.value)}
                required
              />
            </div>
          )}
        </div>

        {/* Notes Field */}
        <div>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            placeholder="Optional task notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        
        {/* assignee Field */}
        <div>
          <label htmlFor="assignee">Assignee</label>
          <textarea
            id="assignee"
            placeholder="Optional assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          />
        </div>

        {/* Error Message */}
        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {/* Submit Button */}
        <button type="submit">Add Task</button>
      </form>
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
};

export default AddTask;
