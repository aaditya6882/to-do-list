const express = require("express");
const router = express.Router();
const todoController = require("../controller/todoController");

// Get all To-Dos
router.get("/", todoController.getAllTodos);

// Get a single To-Do by ID
router.get("/:id", todoController.getTodoById);

// Create a new To-Do
router.post("/", todoController.createTodo);

// Update a To-Do
router.put("/:id", todoController.updateTodo);

// Delete a To-Do
router.delete("/:id", todoController.deleteTodo);

module.exports = router;
