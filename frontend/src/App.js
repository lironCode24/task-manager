import React from "react";
import "./styles/global.css"; // Import global styles
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserInfo from "./pages/UserInfo";
import Dashboard from "./pages/Dashboard";
import AddTask from "./pages/AddTask"; // Import the AddTask component

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route path="/add-task" element={<AddTask />} /> {/* Add route for AddTask */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
