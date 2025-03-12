import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Home Page</h1>
      <p>Welcome to the Task Manager App!</p>

      {/* Image */}
      <img
        src={`${process.env.PUBLIC_URL}/task.png`}
        alt="Task Manager"
        style={{ width: "100px", height: "auto", margin: "20px 0" }}
      />

      {/* Buttons */}
      <div>
        <button
          onClick={() => navigate("/register")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Register
        </button>
        <button
          onClick={() => navigate("/login")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Home;
