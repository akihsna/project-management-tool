const mongoose = require("mongoose")

const workspaceSchema = new mongoose.Schema({

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },

  name: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  agileMethod: {
    type: String,
    enum: ["Kanban", "Scrum"],
    default: "Kanban"
  },

  sprintLength: {
    type: Number,
    default: 2
  }

}, {
  timestamps: true
})

module.exports = mongoose.model("Workspace", workspaceSchema)
