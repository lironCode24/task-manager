import React, { useState } from "react";
import "../styles/auth.css";  // Use relative path
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  // State for user inputs
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // For storing error messages
  const [successMessage, setSuccessMessage] = useState(""); // For storing success messages
  const navigate = useNavigate();

  // Password validation regex
  const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous errors
    setSuccessMessage(""); // Clear any previous success messages

    // Validate password
    if (!passwordValidationRegex.test(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    try {
      // Send POST request to backend for registration
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        username,
        email,
        password,
      });

      console.log("Registration Success:", response.data);
      setSuccessMessage("Registration successful! Redirecting to login page.");

      // Wait for 4 seconds before redirecting to login page
      setTimeout(() => {
        navigate("/login"); // Redirect to login page
      }, 4000); // 4000ms = 4 seconds
    } catch (error) {
      console.error("Registration Failed:", error.response?.data || error.message);
      // Set the error message to be displayed on the page
      setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <h1>Register Page</h1>
      <form onSubmit={handleRegister}>
        <label>Username:</label>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label>Email:</label>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password:</label>
        <input
          type="password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>

      {/* Display success or error message */}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {/* Back to Login Button */}
      <button 
        onClick={() => navigate("/login")} 
        style={{ marginTop: "15px", padding: "10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Back to Login
      </button>
    </div>
  );
};

export default Register;
