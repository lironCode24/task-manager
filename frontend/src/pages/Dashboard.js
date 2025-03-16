import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa"; // Using FontAwesome React icons for profile
import "../styles/Dashboard.css"; 

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [priorityFilter, setPriorityFilter] = useState(""); // State for priority filter
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    // If there is no token or it's invalid, redirect to login page
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

  // Categorizing tasks by status
  const categorizedTasks = {
    "Not Started": tasks.filter((task) => task.status === "Not Started"),
    "In Progress": tasks.filter((task) => task.status === "In Progress"),
    "Completed": tasks.filter((task) => task.status === "Completed"),
  };

  // Filtering tasks based on title, priority, or due date
  const filteredTasks = Object.fromEntries(
    Object.entries(categorizedTasks).map(([status, taskList]) => [
      status,
      taskList.filter(
        (task) =>
          (task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
            task.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
          (priorityFilter ? task.priority === priorityFilter : true) // Filter by priority
      ),
    ])
  );

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      {/* User Info Icon */}
      <div className="user-icon">
        <FaUserAlt onClick={() => navigate("/user-info")} />
      </div>

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
              onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
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
                        {/* <p>{task.description}</p> */}
                        <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString('en-GB')}</p>
                        {task.status === "Completed" && task.completionDate && (
                          <p><strong>Completed On:</strong> {new Date(task.completionDate).toLocaleDateString('en-GB')}</p>
                        )}
                        <p><strong>Priority:</strong> {task.priority}</p>
                        
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
