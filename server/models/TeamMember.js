const mongoose = require("mongoose")

const teamMemberSchema = new mongoose.Schema({

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

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },

  role: {
    type: String,
    enum: ["Product Owner", "Scrum Master", "Developer", "Designer", "Tester"],
    default: "Developer"
  }

}, {
  timestamps: true
})

module.exports = mongoose.model("TeamMember", teamMemberSchema)
