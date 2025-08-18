const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    dueDate: { type: Date },
    category: {
      type: String,
      enum: ["Personal", "Work", "Other"],
      default: "Personal",
    },
    priority: { type: String, enum: ["ToDo", "Critical"], default: "ToDo" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Todo", todoSchema);
