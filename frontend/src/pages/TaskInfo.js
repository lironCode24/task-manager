import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/AddTask.css";

function TaskInfo() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    status: "Not Started",
    dueDate: "",
    completionDate: "",
    notes: "",
    assignee: "",
    creator: "",  
    subtasks: [],
  });
  const [errorMessage, setErrorMessage] = useState("");
  
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

        // Fetch the username (creator) based on userId
        const userResponse = await fetch(
          `http://localhost:5000/api/user/getUsername/${data.userId}`, // Assuming creatorId is stored in task data
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const userData = await userResponse.json();
        setTask({
          ...data,
          creator: userData.username,  // Set the username as the creator
          dueDate: data.dueDate ? data.dueDate.split("T")[0] : "",
          completionDate: data.completionDate ? data.completionDate.split("T")[0] : "",
        });
      } catch (error) {
        setErrorMessage("Error fetching task.");
      }
    };

    fetchTask();
  }, [id]);

  return (
    <div className="task-form-container">
      <h2>Task Details</h2>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <form>
        {/* Title */}
        <div>
          <label htmlFor="title">Title *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={task.title}
            readOnly
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={task.description}
            readOnly
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
            readOnly
          />
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="priority">Priority</label>
          <input
            type="text"
            id="priority"
            name="priority"
            value={task.priority}
            readOnly
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor="status">Status</label>
          <input
            type="text"
            id="status"
            name="status"
            value={task.status}
            readOnly
          />
        </div>

        {/* Notes Field */}
        <div>
          <label htmlFor="notes">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={task.notes}
            readOnly
          />
        </div>

        {/* Assignee Field */}
        <div>
          <label htmlFor="assignee">Assignee</label>
          <textarea
            id="assignee"
            name="assignee"
            value={task.assignee}
            readOnly
          />
        </div>

        {/* Creator Field */}
        <div>
          <label htmlFor="creator">Creator</label>
          <input
            type="text"
            id="creator"
            name="creator"
            value={task.creator}  // Display the creator username
            readOnly
          />
        </div>

        
        {/* Subtasks Section */}
        <div>
          <label htmlFor="subtasks">Subtasks</label>
          {task.subtasks.length > 0 ? (
            task.subtasks.map((subtask, index) => (
              <div key={index} className="subtask-item">
                <input
                  type="checkbox"
                  checked={subtask.done}
                />
                <span className={`subtask-text ${subtask.done ? "subtask-completed" : ""}`}>
                  {subtask.text}
                </span>
              </div>
            ))
          ) : (
            <div>No subtasks.</div>
          )}
        </div>


        {/* Completion Date (only shown if the task is completed) */}
        {task.status === "Completed" && (
          <div>
            <label htmlFor="completionDate">Completion Date</label>
            <input
              type="date"
              id="completionDate"
              name="completionDate"
              value={task.completionDate || ""}
              readOnly
            />
          </div>
        )}
      </form>

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

export default TaskInfo;
