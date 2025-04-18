import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AddTask.css";
import API_URL from "../config";

const AddTask = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [status, setStatus] = useState("Not Started");
  const [notes, setNotes] = useState("");
  const [subtasks, setSubtasks] = useState([]); // [{ name: "Subtask 1", completed: false }]
  const [newSubtask, setNewSubtask] = useState(""); // Input for adding a new subtask
  const [assignee, setAssignee] = useState("");
  const [users, setUsers] = useState([]); // Store list of users
  const [errorMessage, setErrorMessage] = useState("");
  const today = new Date().toISOString().split("T")[0];
  const [completionDate, setCompletionDate] = useState(today);
  const navigate = useNavigate();

  const oneYearLater = new Date();
  oneYearLater.setFullYear(oneYearLater.getFullYear() + 5);
  const maxDate = oneYearLater.toISOString().split("T")[0];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }


    // Fetch list of users from backend
    const fetchUsers = async () => {
      try {
        const response = await fetch(API_URL + "/user/allUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data); // Assuming API returns an array of users
          // Fetch the current user's data and set them as the default assignee
          const userResponse = await fetch(API_URL + "/user/data", {
            headers: { Authorization: `Bearer ${token}` },
          });
          const userData = await userResponse.json();
          setAssignee(userData.username); // Set the current user as the default assignee
        } else {
          setErrorMessage("Failed to fetch users.");
        }
      } catch (error) {
        setErrorMessage("Error fetching users.");
      }
    };

    fetchUsers();
  }, []);  // This effect runs only once when the component mounts

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If assignee is not selected, set the current user as the assignee
    if (!assignee) {
      const token = localStorage.getItem("token");
      const response = await fetch(API_URL + "/user/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      const currentUser = data.username
      setAssignee(currentUser);  // Set the assignee to the current user ID
    }

    if (!title || !description || !dueDate || !assignee) {
      setErrorMessage("Please fill in all the required fields.");
      return;
    }
    const formattedSubtasks = subtasks.map((subtask) => ({
      text: subtask.text,
      done: subtask.done
    }));
    
    
    const taskData = {
      title,
      description,
      dueDate,
      priority,
      status,
      notes,
      assignee,
      subtasks: formattedSubtasks, 
      ...(status === "Completed" && { completionDate })
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(API_URL + "/tasks/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        navigate("/dashboard");
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to add task.");
      }
    } catch (error) {
      setErrorMessage("Error connecting to the server.");
    }
  };

  const addSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, { text: newSubtask, done: false }]);
      setNewSubtask(""); // Clear input field after adding
    }
  };

  const removeSubtask = (index) => {
    // Show confirmation dialog before removing the subtask
    const isConfirmed = window.confirm("Are you sure you want to delete this subtask?");
    
    if (isConfirmed) {
      const updatedSubtasks = subtasks.filter((_, i) => i !== index);
      setSubtasks(updatedSubtasks);
    }
  };  
  
  const toggleSubtaskCompletion = (index) => {
    setSubtasks((prevTask) => {
      const updatedSubtasks = [...prevTask.subtasks];  // Create a new array
      updatedSubtasks[index] = {
        ...updatedSubtasks[index], // Preserve the other properties of the subtask
        done: !updatedSubtasks[index].done, // Toggle the 'done' property
      };
      return { ...prevTask, subtasks: updatedSubtasks }; // Update state with new subtasks array
    });
  };
  

  return (
    <div className="task-form-container">
      <h2>Add Task</h2>
      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div>
          <label htmlFor="title">Title *</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description">Description *</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>

        {/* Due Date */}
        <div>
          <label htmlFor="dueDate">Due Date *</label>
          <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} min={today} max={maxDate} required />
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority">Priority</label>
          <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status">Status</label>
          <select id="status" value={status} onChange={(e) => {
            setStatus(e.target.value);
            setCompletionDate(e.target.value === "Completed" ? today : "");
          }}>
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {status === "Completed" && (
            <div>
              <label htmlFor="completionDate">Completion Date</label>
              <input type="date" id="completionDate" value={completionDate || ""} min="1900-01-01" max={today} onChange={(e) => setCompletionDate(e.target.value)} required />
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes">Notes</label>
          <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
        </div>

        <div>
          <label>Subtasks</label>
          <div className="subtasks-container">
            {subtasks.map((subtask, index) => (
              <div key={index} className="subtask-item">
                <input
                  type="checkbox"
                  checked={subtask.done}
                  onChange={() => toggleSubtaskCompletion(index)}
                />
                <span className={`subtask-text ${subtask.done ? "subtask-completed" : ""}`}>
                  {subtask.text}
                </span>
                <button type="button" className="subtask-remove" onClick={() => removeSubtask(index)}>
                  ❌
                </button>
              </div>
            ))}
          </div>

          <input
            type="text"
            className="subtask-input"
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // Prevents form submission
                addSubtask();
              }
            }}
            placeholder="Add a subtask"
          />
          
          <small style={{ color: "#555", display: "block", marginTop: "4px" }}>
            Press <strong>Enter</strong> to add a subtask
          </small>
        </div>

        {/* Assignee - Dropdown */}
        <div>
          <label htmlFor="assignee">Assignee</label>
          <select id="assignee" value={assignee} onChange={(e) => setAssignee(e.target.value)}>
            <option value="">Select Assignee</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

        {/* Submit Button */}
        <button type="submit">Add Task</button>
      </form>

      <button onClick={() => navigate("/dashboard")} style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer", backgroundColor: "blue" }}>
        Back to dashboard
      </button>
    </div>
  );
};

export default AddTask;
