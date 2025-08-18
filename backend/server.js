const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const todoRoutes = require("./routes/todoRoutes"); // renamed for clarity

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json()); // parse JSON bodies

// Serve static frontend files
app.use("/static", express.static(path.join(__dirname, "../frontend")));

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("Connected to ToDo list database"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Serve index.html at root
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// API routes
app.use("/api/todos", todoRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
