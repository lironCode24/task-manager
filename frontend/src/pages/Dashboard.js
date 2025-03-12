import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa"; // Using FontAwesome React icons for profile

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

    // Fetch user data
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/data", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login"); // Redirect to login if there's an error
      }
    };

    // Fetch user tasks
    const fetchUserTasks = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/user/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchUserData();
    fetchUserTasks();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
    // Redirect the user to the login page
    navigate("/login");
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Dashboard</h2>

      {/* User Info Icon */}
      <div style={{ position: "absolute", top: "20px", right: "20px" }}>
        <FaUserAlt
          style={{
            fontSize: "30px",
            cursor: "pointer",
            color: "#007bff",
          }}
          onClick={() => navigate("/user-info")} // Navigate to user info page
        />
      </div>

      {!userData ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Hi, {userData.username}!</h3>

          {/* Tasks Section */}
          <h3>Your Tasks:</h3>
          <ul style={{ listStyleType: "none", padding: "0" }}>
            {tasks.length === 0 ? (
              <p>No tasks available.</p>
            ) : (
              tasks.map((task, index) => (
                <li key={index} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  <h4>{task.title}</h4>
                  <p>{task.description}</p>
                  {/* You can add more task info here */}
                </li>
              ))
            )}
          </ul>

          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
