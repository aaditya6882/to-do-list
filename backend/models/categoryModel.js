const e = require("express");
const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
    enum: ["Personal", "Work", "Other"],
  },
});
