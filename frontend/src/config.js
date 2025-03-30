const API_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api" // Local API during development
    : "https://task-manager-c8f8.onrender.com/api"; // Deployed API

export default API_URL;
