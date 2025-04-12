# Task Manager App

A full-stack task manager built with **React**, **Node.js**, **Express**, and **MongoDB**, supporting user authentication, task assignments, subtasks, and custom avatars.

---

## Features

- Register/Login with JWT
- Create, update, and delete tasks
- Assign tasks to users
- Add subtasks and toggle their completion
- Filter tasks by status
- Update user avatars
- View all users

---
## Folder Structure

```
/task-manager
  /frontend                # React frontend files
    /src
      /components          # React components (e.g., Register, Login, Dashboard)
      /services            # Axios requests to the backend
      /App.js              # Main application file
      /index.js            # Entry point for React app
  /backend                 # Node.js/Express backend files
    /models                # Mongoose models (e.g., User, Task)
    /routes                # API routes for authentication and task management
    /controllers           # Logic for handling API requests
    /middleware            # JWT authentication middleware
    /server.js             # Main server file
```
---

## Backend API Overview

### **Auth (`/api/auth`)**
- `POST /register` – Register a new user  
- `POST /login` – Authenticate user and receive token  

### **Tasks (`/api/tasks`)**
- `POST /tasks` – Create a new task  
- `GET /getTasks` – Get all tasks for current user or assignee  
- `GET /getTaskById?id=...` – Get task by ID  
- `PUT /:id` – Update a task  
- `DELETE /:id` – Delete a task  
- `GET /status/:status` – Filter tasks by status  
- `PATCH /tasks/:taskId/subtasks/:subtaskIndex` – Toggle subtask completion  

### **Users (`/api/user`)**
- `GET /data` – Get current user data  
- `GET /allUsers` – List all users (id, username, email, approval status)  
- `POST /update-avatar` – Update user avatar  
- `GET /getUserId/:username` – Get user ID by username  
- `GET /getUsername/:userId` – Get username by user ID  

---

## Quick Start

1. **Clone Repo**  
   
   git clone https://github.com/your-username/task-manager.git
   

2. **Frontend**  
   
   cd frontend
   npm install
   npm start
   

3. **Backend**  
   
   cd backend
   npm install
   

   Create a `.env` file in `/backend`:
   
   MONGODB_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   

   Then run:
   
   npm start
   

License
This project is licensed under the MIT License.