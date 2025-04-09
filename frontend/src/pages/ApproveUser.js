import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config"; 
import "../styles/ApproveUser.css";  // Use relative path

function ApproveUser() {
  const [userData, setUserData] = useState(null);
  const [users, setUsers] = useState([]); // State for holding the list of users
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [successMessage, setSuccessMessage] = useState(""); // State for success message
  const navigate = useNavigate(); // Initialize useNavigate

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
        if (response.status!==200 || data.username.length < 2 || !data.isAdmin) {
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

    // Fetch all users on component mount
    const fetchUsers = async () => {
        
    const token = localStorage.getItem("token");
      try {
        
        const response = await fetch(API_URL + "/user/allUsers", {
            headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        const notApprovedUsers = data.filter(user => !user.isApproved); // Filter out users who are not approved
        setUsers(notApprovedUsers); // Set state with non-approved users
      } catch (error) {
        console.error("Error fetching users:", error.response?.data || error.message);
        setErrorMessage("Failed to load users.");
      }
    };

    fetchUserData();
    fetchUsers();
  }, []);

  const handleApprove = async (username) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(API_URL + `/auth/approveUser/${username}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Check if the response is successful
      if (!response.ok) {
        const errorText = await response.text(); // Get the response text in case of error
        console.error('Error response:', errorText);
        throw new Error('Something went wrong. Please try again later.');
      }
  
      // Assuming the response contains JSON data on success
      const data = await response.json();
      setSuccessMessage(data.message);  // The success message comes from the API
      setErrorMessage("");  // Clear error messages
  
      // Remove the approved user from the state
      setUsers(prevUsers => prevUsers.filter(user => user.username !== username));
  
    } catch (error) {
      console.error("Error approving user:", error.message || error);
      setErrorMessage(error.message || "Failed to approve the user.");
      setSuccessMessage("");  // Clear any success messages
    }
  };
  

  return (
    <div className="container">
      <h2>Approve Users</h2>

      {/* Success or error message */}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Display non-approved users */}
      {users.length > 0 ? (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              <p>Username: {user.username}</p>
              <p>Email: {user.email}</p>
              <button onClick={() => handleApprove(user.username)}>Approve</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users to approve.</p>
      )}

      {/* Back to dashboard page */}
      <button
        onClick={() => navigate("/dashboard")}
        style={{
          marginTop: "15px",
          padding: "10px",
          backgroundColor: "#6c757d",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Back to dashboard
      </button>
    </div>
  );
}

export default ApproveUser;
