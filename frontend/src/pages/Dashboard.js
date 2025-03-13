import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa"; // Using FontAwesome React icons for profile
import "../styles/Dashboard.css"; 

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [tasks, setTasks] = useState([]);
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
        // console.log("Tasks from API:", data); // Debugging
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

          {/* Kanban Board Layout */}
          <div className="kanban-board">
            {Object.entries(categorizedTasks).map(([status, taskList]) => (
              <div key={status} className="kanban-column">
                <h3>{status}</h3>
                <div className="task-list">
                  {taskList.length === 0 ? (
                    <p>No tasks</p>
                  ) : (
                    taskList.map((task) => (
                      <div key={task._id} className="task-card">
                        <h4>{task.title}</h4>
                        <h4>{task._id}</h4>
                        <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                        <p><strong>Priority:</strong> {task.priority}</p>
                        <button 
                          className="edit-button" 
                          onClick={() => navigate(`/edit-task/${task._id}`)}
                        >
                          Edit
                        </button>
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
