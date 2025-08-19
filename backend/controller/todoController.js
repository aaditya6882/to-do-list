const Todo = require("../models/Todo");

exports.getAllTodos = async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
};

exports.getTodoById = async (req, res) => {
  const todo = await Todo.findOne({ title: req.params.title });
  todo ? res.json(todo) : res.status(404).json({ error: "To-Do not found" });
};

exports.createTodo = async (req, res) => {
  try {
    const todo = await Todo.create(req.body);
    res.status(201).json(todo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTodo = async (req, res) => {
  const { title } = req.params;
  const updated = await Todo.findOneAndUpdate({ title }, req.body, {
    new: true,
  });
  updated
    ? res.json(updated)
    : res.status(404).json({ error: "To-Do not found" });
};

exports.deleteTodo = async (req, res) => {
  const deleted = await Todo.findOneAndDelete(req.params.title);
  deleted
    ? res.json({ message: "To-Do deleted" })
    : res.status(404).json({ error: "To-Do not found" });
};
