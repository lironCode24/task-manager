import React, { useState, useEffect } from "react";
import "../styles/Auth.css";  // Use relative path
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // New state for error message
  const navigate = useNavigate(); // Initialize useNavigate

  // Check if the user is already logged in when the component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // If a token is found, redirect the user to the dashboard or another page
      navigate("/Dashboard");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error message

    try {
      const response = await axios.post(API_URL + "/auth/login", {
        username,
        password,
      });
      // console.log("Login Success:", response.data);

      // Store the token in local storage or state (optional)
      localStorage.setItem("token", response.data.token);

      // Redirect to the dashboard or another page after successful login
      navigate("/Dashboard");
    } catch (error) {
      console.error("Login Failed:", error.response?.data || error.message);
      // Set the error message to be shown on the page
      setErrorMessage(error.response?.data?.message || "Login failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Username:</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      {/* Error message */}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Back to Home Page Button */}
      <button
        onClick={() => navigate("/")}
        style={{ marginTop: "15px", padding: "10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Back to Home Page
      </button>
    </div>
  );
}

export default Login;
