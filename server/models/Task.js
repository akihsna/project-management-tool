const mongoose = require("mongoose")

const taskSchema = new mongoose.Schema({

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  status: {
    type: String,
    enum: ["To Do", "In Progress", "Completed"],
    default: "To Do"
  },

  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },

  project: {
    type: String,
    trim: true
  },

  assignee: {
    type: String,
    trim: true
  }

}, {
  timestamps: true
})

module.exports = mongoose.model("Task", taskSchema)
