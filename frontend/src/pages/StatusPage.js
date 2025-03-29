import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import assigneeIcon from "../images/assigneeIcon.png"; // Ensure the icon path is correct
import "../styles/Dashboard.css";

function StatusPage() {
    const { status } = useParams(); // Get status from the URL
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]); // New state to hold the list of users
    const [searchQuery, setSearchQuery] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");
    const [assigneeFilter, setAssigneeFilter] = useState("");
    const [creatorFilter, setCreatorFilter] = useState(""); // State for creator filter
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showFilters, setShowFilters] = useState(false); // Toggle filter section
    const [userData, setUserData] = useState(null); // Add user data state
    const [successMessage, setSuccessMessage] = useState(""); // Success message state
    const [errorMessage, setErrorMessage] = useState(""); // Error message state
    const [openDropdown, setOpenDropdown] = useState(null); // Dropdown state for assignee
    const [closeDropdown, setCloseDropdown] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchUserData = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/user/data", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error("Error fetching user data:", error);
                navigate("/login");
            }
        };

        const fetchTasksByStatus = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await fetch("http://localhost:5000/api/user/data", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.ok) {
                    const data = await response.json();
                    const username = data.username; // Get the logged-in username
                    const taskResponse = await fetch(`http://localhost:5000/api/tasks/status/${status}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "username": username, // Send the username as a custom header
                        },
                    }
                    );

                    let taskData = await taskResponse.json();

                    // Fetch creator usernames for each task if needed
                    taskData = await Promise.all(
                        taskData.map(async (task) => {
                            if (task.userId) {
                                try {
                                    const userResponse = await fetch(
                                        `http://localhost:5000/api/user/getUsername/${task.userId}`,
                                        {
                                            headers: { Authorization: `Bearer ${token}` },
                                        }
                                    );
                                    if (userResponse.ok) {
                                        const userData = await userResponse.json();
                                        task.creator = userData.username; // Add the creator's username
                                    }
                                } catch (error) {
                                    console.error("Error fetching creator username:", error);
                                    task.creator = "Unknown"; // Default if fetch fails
                                }
                            }
                            return task;
                        })
                    );

                    setTasks(Array.isArray(taskData) ? taskData : []);
                } else {
                    console.log("Failed to fetch username.");
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
                setTasks([]);
            }
        };


        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/user/allUsers", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUsers(data);
                } else {
                    setErrorMessage("Failed to fetch users.");
                }
            } catch (error) {
                setErrorMessage("Error fetching users.");
            }
        };

        fetchUsers();
        fetchUserData();
        fetchTasksByStatus();
    }, [status, navigate]);

    const handleChangeAssignee = async (taskId, newAssignee) => {
        const token = localStorage.getItem('token');
        const task = tasks.find((task) => task._id === taskId);
        if (!task) return;

        const taskData = {
            ...task,
            assignee: newAssignee,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(taskData),
            });

            if (response.ok) {
                setSuccessMessage("Task updated successfully! ✅");
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task._id === taskId ? { ...task, assignee: newAssignee } : task
                    )
                );
                setTimeout(() => setSuccessMessage(""), 2000);
            } else {
                setErrorMessage("Failed to update task.");
            }
        } catch (error) {
            setErrorMessage("Error updating task.");
        }
    };

    const filteredTasks = tasks.filter((task) => {
        const taskDate = new Date(task.dueDate);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        return (
            (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                task.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (priorityFilter ? task.priority === priorityFilter : true) &&
            (assigneeFilter ? task.assignee === assigneeFilter : true) &&
            (creatorFilter ? task.creator === creatorFilter : true) &&
            (!start || taskDate >= start) &&
            (!end || taskDate <= end)
        );
    });

    const uniqueAssignees = [...new Set(tasks.map((task) => task.assignee))].sort();
    const uniqueCreators = [...new Set(tasks.map((task) => task.creator))].sort();

    return (
        <div className="dashboard-container">
            <h1>{status} Tasks</h1>

            <button className="back-to-button" onClick={() => navigate("/Dashboard")}>
                Back to Dashboard
            </button>
            {/* Toggle Filter Section Button */}
            <button
                className="toggle-filters-button"
                onClick={() => setShowFilters(!showFilters)}
            >
                {showFilters ? "Hide Filters" : "Show Filters"}
            </button>

            {/* Filters Section (Collapsible) */}
            {showFilters && (
                <div className="filtering-container">
                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="Search tasks..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filter-container">
                        <label htmlFor="priorityFilter">Priority: </label>
                        <select
                            id="priorityFilter"
                            value={priorityFilter}
                            onChange={(e) => setPriorityFilter(e.target.value)}
                        >
                            <option value="">All</option>
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                        </select>
                    </div>

                    <div className="filter-container assignee-filter-container">
                        <label htmlFor="assigneeFilter">Assignee: </label>
                        <select
                            id="assigneeFilter"
                            value={assigneeFilter}
                            onChange={(e) => setAssigneeFilter(e.target.value)}
                        >
                            <option value="">All</option>
                            {uniqueAssignees.map((assignee) => (
                                <option key={assignee} value={assignee}>
                                    {assignee}
                                </option>
                            ))}
                        </select>

                        {/* Assigned to Me Button */}
                        <button
                            className="assigned-to-me-button"
                            onClick={() => setAssigneeFilter(userData?.username)} // Filter tasks assigned to the current user
                        >
                            Assigned to Me
                        </button>
                    </div>

                    {/* Creator Filter */}
                    <div className="filter-container creator-filter-container">
                        <label htmlFor="creatorFilter">Creator: </label>
                        <select
                            id="creatorFilter"
                            value={creatorFilter}
                            onChange={(e) => setCreatorFilter(e.target.value)}
                        >
                            <option value="">All</option>
                            {uniqueCreators.map((creator) => (
                                <option key={creator} value={creator}>
                                    {creator}
                                </option>
                            ))}
                        </select>
                        {/* Created by Me Button */}
                        <button
                            className="created-by-me-button"
                            onClick={() => setCreatorFilter(userData?.username)}
                        >
                            Created by Me
                        </button>
                    </div>

                    {/* Due Date Filter */}
                    <div className="filter-container">
                        <label>Due Date Range: </label>
                        From:
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                        To:
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                </div>
            )}

            {/* Task List */}
            <div className="task-grid-container">
                {filteredTasks.length === 0 ? (
                    <p>No tasks found for this status.</p>
                ) : (
                    filteredTasks.map((task) => (
                        <div key={task._id} className="task-card-small">
                            <h4>{task.title}</h4>
                            <p><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</p>
                            <p><strong>Priority:</strong> {task.priority}</p>
                            {task.description && (
                                <p>
                                    <strong>Description:</strong>{" "}
                                    {task.description.length > 50
                                        ? task.description.substring(0, 50) + "..."
                                        : task.description}
                                </p>
                            )}
                            {task.notes && (
                                <p>
                                    <strong>Notes:</strong>{" "}
                                    {task.notes.length > 50
                                        ? task.notes.substring(0, 50) + "..."
                                        : task.notes}
                                </p>
                            )}
                            {task.status === "Completed" && task.completionDate && (
                                <p><strong>Completed On:</strong> {new Date(task.completionDate).toLocaleDateString('en-GB')}</p>
                            )}
                            <p><strong>Assignee:</strong> {task.assignee}</p>
                            <p><strong>Creator:</strong> {task.creator}</p>

                            {successMessage && closeDropdown === task._id && <div className="message success-message">{successMessage}</div>}
                            {errorMessage && closeDropdown === task._id && <div className="message error-message">{errorMessage}</div>}

                            <div className="dashboard-buttons">
                                <button onClick={() => navigate(`/edit-task/${task._id}`)}>Edit</button>
                                <button onClick={() => navigate(`/task-info/${task._id}`)}>More details</button>
                                <div className="assignee-container">
                                    <div className="assignee-dropdown">
                                        <img
                                            src={assigneeIcon}
                                            alt="Assignee"
                                            className="assignee-icon"
                                            onClick={() => setOpenDropdown(openDropdown === task._id ? null : task._id)}
                                        />
                                        {openDropdown === task._id && (
                                            <div className="dropdown-menu">
                                                {users.map((assignee) => (
                                                    <div
                                                        key={assignee.username}
                                                        className="dropdown-item"
                                                        onClick={() => {
                                                            handleChangeAssignee(task._id, assignee.username);
                                                            setOpenDropdown(null);
                                                            setCloseDropdown(task._id);
                                                        }}
                                                    >
                                                        {assignee.username}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default StatusPage;
