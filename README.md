# Task Manager Application

This is a full-stack Task Manager application built with React for the frontend and Node.js/Express for the backend. The application allows users to register, log in, create tasks, mark them as complete, and delete tasks. It also provides user authentication via JWT tokens.

## Features

- **User Registration and Login:**
  - Users can register by providing a username, email, and password.
  - Passwords are validated based on certain criteria (e.g., minimum length, includes upper and lower case letters, and a number).
  - After successful registration, users are redirected to the login page.

- **Task Management:**
  - Users can create tasks by providing a task title and description.
  - Tasks can be marked as completed or deleted.
  - Task data is stored in a MongoDB database, and CRUD operations are performed using the backend API.

- **Authentication and Authorization:**
  - JWT-based authentication is used to secure the application.
  - After successful login, the user receives a token that must be included in subsequent requests to protected routes (e.g., task creation, task update, task deletion).

- **User Dashboard:**
  - The dashboard displays the user's tasks with options to mark them as complete or delete them.
  - Tasks are displayed in a list, and each task can have an edit or delete button.
  - After successful registration, users are redirected to the dashboard.

- **Frontend and Backend:**
  - The frontend is built with React.js and React Router for navigation.
  - The backend is built with Node.js and Express.js, using JWT for authentication and MongoDB for data storage.

## Technologies Used

### Frontend:
- **React.js** – JavaScript library for building user interfaces.
- **React Router** – For handling client-side routing.
- **Axios** – For making HTTP requests to the backend API.
- **State Management** – Using React’s `useState` and `useEffect` hooks.

### Backend:
- **Node.js** – JavaScript runtime environment.
- **Express.js** – Web framework for Node.js.
- **MongoDB** – NoSQL database to store user and task data.
- **JWT (JSON Web Token)** – For securing routes and user authentication.
- **bcryptjs** – For hashing passwords securely.

## Installation

### Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v12 or later)
- **npm** or **yarn** for package management
- **MongoDB** (locally or use MongoDB Atlas)

### Frontend Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/task-manager.git
   cd task-manager
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the React development server:

   ```bash
   npm start
   ```

   This will start the frontend at `http://localhost:3000`.

### Backend Setup

1. Go to the backend directory:

   ```bash
   cd backend
   ```

2. Install the necessary backend dependencies:

   ```bash
   npm install
   ```

3. Start the backend server:

   ```bash
   npm start
   ```

   This will start the backend server at `http://localhost:5000`.

4. If you're using MongoDB locally, ensure MongoDB is running. Otherwise, configure the backend to connect to MongoDB Atlas or another database.

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

## API Endpoints

### Authentication

#### POST `/api/auth/register`
Registers a new user.

**Request Body:**
```json
{
  "username": "user123",
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**
- **Success:** 
  - Status: 200 OK
  - Body: `{ "message": "Registration successful!" }`
- **Error:** 
  - Status: 400 Bad Request
  - Body: `{ "message": "Error message" }`

#### POST `/api/auth/login`
Logs the user in.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response:**
- **Success:** 
  - Status: 200 OK
  - Body: `{ "token": "jwt_token_here" }`
- **Error:** 
  - Status: 401 Unauthorized
  - Body: `{ "message": "Invalid credentials" }`

### Task Management

#### GET `/api/tasks`
Fetches all tasks for the authenticated user.

**Response:**
- **Success:** 
  - Status: 200 OK
  - Body: `[ { "id": 1, "title": "Task 1", "description": "Description 1", "completed": false }, ... ]`

#### POST `/api/tasks`
Creates a new task for the authenticated user.

**Request Body:**
```json
{
  "title": "Task title",
  "description": "Task description"
}
```

**Response:**
- **Success:** 
  - Status: 201 Created
  - Body: `{ "id": 1, "title": "Task title", "description": "Task description", "completed": false }`

#### PUT `/api/tasks/:id`
Marks a task as completed.

**Request Body:**
```json
{
  "completed": true
}
```

**Response:**
- **Success:** 
  - Status: 200 OK
  - Body: `{ "id": 1, "title": "Task title", "completed": true }`

#### DELETE `/api/tasks/:id`
Deletes a task.

**Response:**
- **Success:** 
  - Status: 200 OK
  - Body: `{ "message": "Task deleted successfully." }`

## Usage

1. **Registration:** Users can register by entering their username, email, and password on the registration page. After registration, they will be redirected to the login page.
2. **Login:** Once logged in, users are given a token which is stored in localStorage and used to authenticate further requests (e.g., creating tasks).
3. **Dashboard:** After login, users are taken to the dashboard where they can view, create, update, and delete tasks.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

