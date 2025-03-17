import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css"; 

import profileIcon1 from "../images/profileIcon1.jpg";
import profileIcon2 from "../images/profileIcon2.jpg";
import profileIcon3 from "../images/profileIcon3.jpg";
import profileIcon4 from "../images/profileIcon4.jpg";
import profileIcon5 from "../images/profileIcon5.jpg";
import profileIcon6 from "../images/profileIcon6.jpg";

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Search query state
  const [priorityFilter, setPriorityFilter] = useState(""); // Priority filter state
  const [assigneeFilter, setAssigneeFilter] = useState(""); // Assignee filter state

  const navigate = useNavigate();

  const icons = {
    profileIcon1,
    profileIcon2,
    profileIcon3,
    profileIcon4,
    profileIcon5,
    profileIcon6,
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/data", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (data.username.length < 2) {
          navigate("/login"); 
        }
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login"); 
      }
    };

    const fetchUserTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/tasks/getTasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      }
    };

    fetchUserData();
    fetchUserTasks();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // Extract unique assignees from tasks
  const uniqueAssignees = [...new Set(tasks.map(task => task.assignee))];

  // Categorizing tasks by status
  const categorizedTasks = {
    "Not Started": tasks.filter((task) => task.status === "Not Started"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    "Completed": tasks.filter((task) => task.status === "Completed"),
  };

  // Filtering tasks based on search query, priority, and assignee
  const filteredTasks = Object.fromEntries(
    Object.entries(categorizedTasks).map(([status, taskList]) => [
      status,
      taskList.filter(
        (task) =>
          (task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            task.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (priorityFilter ? task.priority === priorityFilter : true) &&
          (assigneeFilter ? task.assignee === assigneeFilter : true) // Filter by assignee
      ),
    ])
  );

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>
      
      <img
        src={icons[userData?.avatar] || "/default-profile.png"} 
        alt="User Profile"
        className="user-icon" 
        style={{ width: '80px', height: '80px', borderRadius: '50%' }}
        onClick={() => navigate("/user-info")}
      />

      {!userData ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>Hi, {userData.username}!</h3>

          {/* Search Bar */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search tasks by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Priority Filter */}
          <div className="filter-container">
            <label htmlFor="priorityFilter">Filter by Priority: </label>
            <select
              id="priorityFilter"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Assignee Filter */}
          <div className="filter-container">
            <label htmlFor="assigneeFilter">Filter by Assignee: </label>
            <select
              id="assigneeFilter"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
            >
              <option value="">All Assignees</option>
              {uniqueAssignees.map((assignee) => (
                <option key={assignee} value={assignee}>
                  {assignee}
                </option>
              ))}
            </select>
          </div>

          {/* Kanban Board Layout */}
          <div className="kanban-board">
            {Object.entries(filteredTasks).map(([status, taskList]) => (
              <div key={status} className="kanban-column">
                <h3>{status}</h3>
                <div className="task-list">
                  {taskList.length === 0 ? (
                    <p>No tasks</p>
                  ) : (
                    taskList.map((task) => (
                      <div key={task._id} className="task-card">
                        <h4>{task.title}</h4>
                        <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString('en-GB')}</p>
                        {task.status === "Completed" && task.completionDate && (
                          <p><strong>Completed On:</strong> {new Date(task.completionDate).toLocaleDateString('en-GB')}</p>
                        )}
                        <p><strong>Priority:</strong> {task.priority}</p>
                        <p><strong>Assignee:</strong> {task.assignee}</p>
                        
                        <div className="dashboard-buttons">
                          <button 
                            className="edit-button" 
                            onClick={() => navigate(`/edit-task/${task._id}`)}
                          >
                            Edit
                          </button>

                          <button 
                            className="info-button" 
                            onClick={() => navigate(`/task-info/${task._id}`)}
                          >
                            More details
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="dashboard-buttons">
            <button onClick={() => navigate("/add-task")} className="add-task-button">
              Add Task
            </button>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
