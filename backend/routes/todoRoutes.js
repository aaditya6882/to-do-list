const express = require("express");
const router = express.Router();
const todoController = require("../controller/todoController");

router.get("/", todoController.getAllTodos);
router.get("/:title", todoController.getTodoById);
router.post("/", todoController.createTodo);
router.put("/:title", todoController.updateTodo);
router.delete("/:title", todoController.deleteTodo);

module.exports = router;
