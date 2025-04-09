import React, { useState } from "react";
import "../styles/Auth.css";  // Use relative path
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // For storing error messages
  const [successMessage, setSuccessMessage] = useState(""); // For storing success messages
  const navigate = useNavigate();

  const passwordValidationRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!passwordValidationRegex.test(password)) {
      setErrorMessage(
        "Password must be at least 8 characters long and include one uppercase letter, one lowercase letter, and one number."
      );
      return;
    }

    try {
      const response = await axios.post(API_URL + "/auth/register", {
        username,
        email,
        password,
      });

      setSuccessMessage("Registration successful! You need to be approved by an admin.");

      setTimeout(() => {
        navigate("/login");
      }, 4000);
    } catch (error) {
      console.error("Registration Failed:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2>Create a new account</h2>
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

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      <button
        onClick={() => navigate("/login")}
        style={{ marginTop: "15px", padding: "10px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Already have an account?
      </button>
    </div>
  );
};


export default Register;
