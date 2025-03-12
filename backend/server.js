const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const app = express();
app.use(express.json());

const corsOptions = {
  origin: "http://localhost:3000", // Allow frontend to access backend
  methods: "GET,POST,PUT,DELETE",
  credentials: true, // Allow cookies and authentication
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Task Manager API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/user", userRoutes);
