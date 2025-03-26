import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("");
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
        const response = await fetch("http://localhost:5000/api/user/data", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          const username = data.username; // Get the username from the response

          // Now fetch the tasks, passing the username in the header
          const taskResponse = await fetch("http://localhost:5000/api/tasks/getTasks", {
            headers: {
              Authorization: `Bearer ${token}`,
              "username": username, // Send the username as a custom header
            },
          });

          const taskData = await taskResponse.json();
          setTasks(Array.isArray(taskData) ? taskData : []);
        } else {
          console.log("Failed to fetch username.");
        }
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setTasks([]);
      }
    };



    fetchUserData();
    fetchUserTasks();
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
          (!start || taskDate >= start) &&
          (!end || taskDate <= end)
        );
      }),
    ])
  );

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

              <div className="filter-container">
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
            </div>
          )}

          {/* Kanban Board */}
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
                        <p><strong>Priority:</strong> {task.priority}</p>
                        {task.status === "Completed" && task.completionDate && (
                          <p><strong>Completed On:</strong> {new Date(task.completionDate).toLocaleDateString('en-GB')}</p>
                        )}
                        <p><strong>Assignee:</strong> {task.assignee}</p>
 
                        {successMessage &&closeDropdown === task._id && <div className="message success-message">{successMessage}</div>} {/* Moved success message here */}
                          {errorMessage &&closeDropdown === task._id && <div className="message error-message">{errorMessage}</div>} {/* Moved success message here */}

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
                                {uniqueAssignees.map((assignee) => (
                                  <div
                                    key={assignee}
                                    className="dropdown-item"
                                    onClick={() => {
                                      handleChangeAssignee(task._id, assignee); // Update assignee
                                      setOpenDropdown(null); // Close the dropdown
                                      setCloseDropdown(task._id); // Close the dropdown
                                    }}
                                  >
                                    {assignee} {/* Show only the username here */}
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
