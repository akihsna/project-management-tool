const mongoose = require("mongoose")

const projectSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true
  },

  key: {
    type: String,
    required: true,
    uppercase: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  status: {
    type: String,
    enum: ["Planning", "Active", "Completed"],
    default: "Active"
  }

}, {
  timestamps: true
})

module.exports = mongoose.model("Project", projectSchema)
