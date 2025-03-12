import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [userData, setUserData] = useState(null);
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

    fetchUserData();
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
      <h2>Info</h2>
      {!userData ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h3>Hi, {userData.username}!</h3>
          <p>Email: {userData.email}</p>
          {/* You can display more user data here */}
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
