const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const ToDoListRoutes = require("./routes/ToDoListRoutes");

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/static", express.static(path.join(__dirname, "../frontend")));

console.log(process.env.MONGODB_URL);

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to to do list database");
  })
  .catch((err) => console.error("Mongodb connection error:", err));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.use("/static", express.static(path.join(__dirname, "../frontend")));
app.use("/api/toDoList", ToDoListRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
