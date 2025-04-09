import React from "react";
import "./styles/Global.css"; // Import global styles
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserInfo from "./pages/UserInfo";
import Dashboard from "./pages/Dashboard";
import AddTask from "./pages/AddTask"; 
import EditTask from "./pages/EditTask";
import TaskInfo from "./pages/TaskInfo";
import StatusPage from "./pages/StatusPage";
import ApproveUser from "./pages/ApproveUser";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/user-info" element={<UserInfo />} />
        <Route path="/add-task" element={<AddTask />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/edit-task/:id" element={<EditTask />} />
        <Route path="/task-info/:id" element={<TaskInfo />} />
        <Route path="/status/:status" element={<StatusPage />} /> 
        <Route path="/approveUser" element={<ApproveUser />} />
      </Routes>
    </Router>
  );
}

export default App;
