import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f4f4f9",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          width: "90%",
          maxWidth: "400px",
        }}
      >
        <h1 style={{ color: "#333", marginBottom: "10px" }}>Task Manager</h1>
        <p style={{ color: "#555", marginBottom: "20px" }}>
          Stay organized and manage your tasks efficiently!
        </p>

        {/* Image */}
        <img
          src={`${process.env.PUBLIC_URL}/task.png`}
          alt="Task Manager"
          style={{
            width: "120px",
            height: "auto",
            marginBottom: "20px",
          }}
        />

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={() => navigate("/register")}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.opacity = "0.8")}
            onMouseOut={(e) => (e.target.style.opacity = "1")}
          >
            Register
          </button>
          <button
            onClick={() => navigate("/login")}
            style={{
              backgroundColor: "#008CBA",
              color: "white",
              padding: "10px 20px",
              borderRadius: "6px",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.opacity = "0.8")}
            onMouseOut={(e) => (e.target.style.opacity = "1")}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
