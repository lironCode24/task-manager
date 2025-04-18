import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import API_URL from "../config";

import profileIcon1 from "../images/profileIcon1.jpg";
import profileIcon2 from "../images/profileIcon2.jpg";
import profileIcon3 from "../images/profileIcon3.jpg";
import profileIcon4 from "../images/profileIcon4.jpg";
import profileIcon5 from "../images/profileIcon5.jpg";
import profileIcon6 from "../images/profileIcon6.jpg";
import assigneeIcon from "../images/assigneeIcon.png";

function Dashboard() {

  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]); // New state to hold the list of users
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
  const [creatorFilter, setCreatorFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [showFilters, setShowFilters] = useState(false); // Toggle filter section
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const [closeDropdown, setCloseDropdown] = useState(null);

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
        const response = await fetch(API_URL + "/user/data", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (response.status!==200 || data.username.length < 2) {
          localStorage.setItem("token",null);
          navigate("/login");
        }
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        localStorage.setItem("token",null);
        navigate("/login");
      }
    };

    const fetchUserTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(API_URL + "/user/data", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const username = data.username; // Get the logged-in username

          const taskResponse = await fetch(API_URL + "/tasks/getTasks", {
            headers: {
              Authorization: `Bearer ${token}`,
              "username": username, // Send the username as a custom header
            },
          });

          let taskData = await taskResponse.json();

          // Fetch creator usernames for each task if needed
          taskData = await Promise.all(taskData.map(async (task) => {
            if (task.userId) {
              try {
                const userResponse = await fetch(
                  `http://localhost:5000/api/user/getUsername/${task.userId}`,
                  {
                    headers: { Authorization: `Bearer ${token}` },
                  }
                );
                if (userResponse.ok) {
                  const userData = await userResponse.json();
                  task.creator = userData.username; // Add the creator's username
                }
              } catch (error) {
                console.error("Error fetching creator username:", error);
                task.creator = "Unknown"; // Default if fetch fails
              }
            }
            return task;
          }));

          setTasks(Array.isArray(taskData) ? taskData : []);
        } else {
          console.log("Failed to fetch username.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      }
    };


    const fetchUsers = async () => {
      try {
        const response = await fetch(API_URL + "/user/allUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          setErrorMessage("Failed to fetch users.");
        }
      } catch (error) {
        setErrorMessage("Error fetching users.");
      }
    };

    fetchUserData();
    fetchUserTasks();
    fetchUsers();
  }, [navigate]);

  const handleChangeAssignee = async (taskId, newAssignee) => {
    const token = localStorage.getItem("token");

    // Get the task data from state
    const task = tasks.find((task) => task._id === taskId);

    if (!task) return; // If task is not found

    const taskData = {
      ...task,
      assignee: newAssignee, // Update the assignee
    };

    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      if (response.ok) {
        setSuccessMessage("Task updated successfully! ✅");
        // Update the tasks state to reflect the changes
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === taskId ? { ...task, assignee: newAssignee } : task
          )
        );
        setTimeout(() => {
          setSuccessMessage("");
        }, 2000);
      } else {
        setErrorMessage("Failed to update task.");
      }
    } catch (error) {
      setErrorMessage("Error updating task.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const uniqueAssignees = [...new Set(tasks.map(task => task.assignee))].sort();

  const categorizedTasks = {
    "Not Started": tasks.filter((task) => task.status === "Not Started"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    "Completed": tasks.filter((task) => task.status === "Completed"),
  };

  const filteredTasks = Object.fromEntries(
    Object.entries(categorizedTasks).map(([status, taskList]) => [
      status,
      taskList.filter((task) => {
        const taskDate = new Date(task.dueDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (
          (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (priorityFilter ? task.priority === priorityFilter : true) &&
          (assigneeFilter ? task.assignee === assigneeFilter : true) &&
          (creatorFilter ? task.creator === creatorFilter : true) &&
          (!start || taskDate >= start) &&
          (!end || taskDate <= end)
        );
      }),
    ])
  );

  const clearFilters = () => {
    setSearchQuery("");
    setPriorityFilter("");
    setAssigneeFilter("");
    setCreatorFilter("");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="dashboard-container">

      <img
        src={icons[userData?.avatar] || "/default-profile.png"}
        alt="User Profile"
        className="user-icon"
        onClick={() => navigate("/user-info")}
      />

      {!userData ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>Hi, {userData.username}!</h3>
          {userData.isAdmin && (
            <button
              className="approve-users-button"
              onClick={() => navigate("/ApproveUser")}
            >
              Approve Users
            </button>
          )}

          {/* Toggle Filter Section Button */}
          <button
            className="toggle-filters-button"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>

          {/* Filters Section (Collapsible) */}
          {showFilters && (
            <div className="filtering-container">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-container">
                <label htmlFor="priorityFilter">Priority: </label>
                <select
                  id="priorityFilter"
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="">All</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="filter-container assignee-filter-container">
                <label htmlFor="assigneeFilter">Assignee: </label>
                <select
                  id="assigneeFilter"
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {uniqueAssignees.map((assignee) => (
                    <option key={assignee} value={assignee}>
                      {assignee}
                    </option>
                  ))}
                </select>


                {/* Assigned to Me Button */}
                <button
                  className="assigned-to-me-button"
                  onClick={() => setAssigneeFilter(userData?.username)} // Filter tasks assigned to the current user
                >
                  Assigned to Me
                </button>
              </div>
              <div className="filter-container creator-filter-container">
                <label htmlFor="creatorFilter">Creator: </label>
                <select
                  id="creatorFilter"
                  value={creatorFilter}
                  onChange={(e) => setCreatorFilter(e.target.value)}
                >
                  <option value="">All</option>
                  {[...new Set(tasks.map((task) => task.creator))].map((creator) => (
                    <option key={creator} value={creator}>
                      {creator}
                    </option>
                  ))}
                </select>
                {/* Created by Me Button */}
                <button
                  className="created-by-me-button"
                  onClick={() => setCreatorFilter(userData?.username)}
                >
                  Created by Me
                </button>
              </div>

              {/* Due Date Filter */}
              <div className="filter-container">
                <label>Due Date Range: </label>
                From:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                To:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>

              {/* Clear Filters Button */}
              <button className="clear-filters-button" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          )}

          {/* Kanban Board */}
          <div className="kanban-board">
            {Object.entries(filteredTasks).map(([status, taskList]) => (
              <div key={status} className="kanban-column">
                <h3 onClick={() => navigate(`/status/${status}`)} style={{ cursor: 'pointer' }}>
                  {status}
                </h3>

                <div className="task-list">
                  {taskList.length === 0 ? (
                    <p>No tasks</p>
                  ) : (
                    taskList.map((task) => (
                      <div key={task._id} className="task-card">
                        <h4>{task.title}</h4>
                        <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString('en-GB')}</p>
                        <p><strong>Priority:</strong> {task.priority}</p>
                        {task.status === "Completed" && task.completionDate && (
                          <p><strong>Completed On:</strong> {new Date(task.completionDate).toLocaleDateString('en-GB')}</p>
                        )}
                        <p><strong>Assignee:</strong> {task.assignee}</p>

                        {successMessage && closeDropdown === task._id && <div className="message success-message">{successMessage}</div>} {/* Moved success message here */}
                        {errorMessage && closeDropdown === task._id && <div className="message error-message">{errorMessage}</div>} {/* Moved success message here */}

                        <div className="dashboard-buttons">
                          <button onClick={() => navigate(`/edit-task/${task._id}`)}>Edit</button>
                          <button onClick={() => navigate(`/task-info/${task._id}`)}>More details</button>
                          <div className="assignee-container">

                            <div className="assignee-dropdown">
                              <img
                                src={assigneeIcon}
                                alt="Assignee"
                                className="assignee-icon"
                                onClick={() => setOpenDropdown(openDropdown === task._id ? null : task._id)}
                              />

                              {openDropdown === task._id && (

                                <div className="dropdown-menu">

                                  {users.map((assignee) => (
                                    <div
                                      key={assignee.username}
                                      className="dropdown-item"
                                      onClick={() => {
                                        handleChangeAssignee(task._id, assignee.username); // Update assignee
                                        setOpenDropdown(null); // Close the dropdown
                                        setCloseDropdown(task._id); // Close the dropdown
                                      }}
                                    >
                                      {assignee.username} {/* Show only the username here */}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="dashboard-buttons">
            <button onClick={() => navigate("/add-task")}>Add Task</button>
            <button className="logout-button" onClick={handleLogout}>Logout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
