require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const crypto = require("crypto")
const User = require("./models/User")
const Task = require("./models/Task")
const Project = require("./models/Project")
const TeamMember = require("./models/TeamMember")
const Workspace = require("./models/Workspace")

const app = express()
const PORT = process.env.PORT || 8000
const MONGO_URI = process.env.MONGO_URI

app.use(cors())
app.use(express.json())

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex")
}

const definedFields = (fields) => {
  return Object.fromEntries(
    Object.entries(fields).filter(([, value]) => value !== undefined)
  )
}

const requireAuth = async (req, res, next) => {

  try {

    const authorization = req.get("authorization") || ""
    const [type, token] = authorization.split(" ")

    if (type !== "Bearer" || !token) {
      return res.status(401).json({
        message: "Please log in to continue"
      })
    }

    const user = await User.findOne({
      authTokenHash: hashToken(token)
    }).select("+authTokenHash")

    if (!user) {
      return res.status(401).json({
        message: "Your session has expired. Please log in again"
      })
    }

    req.user = user

    next()

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to authenticate request"
    })

  }

}

app.get("/", (req, res) => {
  res.send("Server Running")
})

app.post("/signup", async (req, res) => {

  try {

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database is not connected"
      })
    }

    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      })
    }

    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    })

    await newUser.save()

    res.status(201).json({
      message: "User Saved"
    })

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Signup Failed"
    })

  }

})

app.post("/login", async (req, res) => {

  try {

    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({
        message: "Database is not connected"
      })
    }

    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    let isPasswordCorrect = await bcrypt.compare(password, user.password)

    if (!isPasswordCorrect && user.password === password) {
      user.password = await bcrypt.hash(password, 10)
      await user.save()
      isPasswordCorrect = true
    }

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password"
      })
    }

    const token = crypto.randomBytes(32).toString("hex")

    user.authTokenHash = hashToken(token)
    await user.save()

    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    })

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Login Failed"
    })

  }

})

app.post("/logout", requireAuth, async (req, res) => {

  try {

    req.user.authTokenHash = undefined
    await req.user.save()

    res.json({
      message: "Logout Successful"
    })

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Logout Failed"
    })

  }

})

app.use(requireAuth)

app.get("/tasks", async (req, res) => {

  try {

    const tasks = await Task.find({ owner: req.user._id }).sort({ createdAt: -1 })

    res.json(tasks)

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to fetch tasks"
    })

  }

})

app.post("/tasks", async (req, res) => {

  try {

    const { title, description, status, priority, project, assignee } = req.body

    if (!title) {
      return res.status(400).json({
        message: "Task title is required"
      })
    }

    const task = await Task.create({
      owner: req.user._id,
      title,
      description,
      status,
      priority,
      project,
      assignee
    })

    res.status(201).json(task)

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to create task"
    })

  }

})

app.put("/tasks/:id", async (req, res) => {

  try {

    const { title, description, status, priority, project, assignee } = req.body

    const task = await Task.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id
      },
      definedFields({
        title,
        description,
        status,
        priority,
        project,
        assignee
      }),
      {
        new: true,
        runValidators: true
      }
    )

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      })
    }

    res.json(task)

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to update task"
    })

  }

})

app.delete("/tasks/:id", async (req, res) => {

  try {

    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    })

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      })
    }

    res.json({
      message: "Task deleted"
    })

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to delete task"
    })

  }

})

app.get("/projects", async (req, res) => {

  try {

    const projects = await Project.find({ owner: req.user._id }).sort({ createdAt: -1 })

    res.json(projects)

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to fetch projects"
    })

  }

})

app.post("/projects", async (req, res) => {

  try {

    const { name, key, description, status } = req.body

    if (!name || !key) {
      return res.status(400).json({
        message: "Project name and key are required"
      })
    }

    const project = await Project.create({
      owner: req.user._id,
      name,
      key,
      description,
      status
    })

    res.status(201).json(project)

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to create project"
    })

  }

})

app.put("/projects/:id", async (req, res) => {

  try {

    const { name, key, description, status } = req.body

    const project = await Project.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id
      },
      definedFields({
        name,
        key,
        description,
        status
      }),
      {
        new: true,
        runValidators: true
      }
    )

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      })
    }

    res.json(project)

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to update project"
    })

  }

})

app.delete("/projects/:id", async (req, res) => {

  try {

    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    })

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      })
    }

    res.json({
      message: "Project deleted"
    })

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to delete project"
    })

  }

})

app.get("/team", async (req, res) => {

  try {

    const members = await TeamMember.find({ owner: req.user._id }).sort({ createdAt: -1 })

    res.json(members)

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to fetch team"
    })

  }

})

app.post("/team", async (req, res) => {

  try {

    const { name, email, role } = req.body

    if (!name || !email) {
      return res.status(400).json({
        message: "Name and email are required"
      })
    }

    const member = await TeamMember.create({
      owner: req.user._id,
      name,
      email,
      role
    })

    res.status(201).json(member)

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to add team member"
    })

  }

})

app.delete("/team/:id", async (req, res) => {

  try {

    const member = await TeamMember.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    })

    if (!member) {
      return res.status(404).json({
        message: "Team member not found"
      })
    }

    res.json({
      message: "Team member deleted"
    })

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to delete team member"
    })

  }

})

app.get("/workspace", async (req, res) => {

  try {

    const workspace = await Workspace.findOne({ owner: req.user._id })

    res.json(workspace)

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to fetch workspace"
    })

  }

})

app.post("/workspace", async (req, res) => {

  try {

    const existingWorkspace = await Workspace.findOne({
      owner: req.user._id
    })

    if (existingWorkspace) {
      return res.status(409).json({
        message: "Workspace already exists"
      })
    }

    const { name, description, agileMethod, sprintLength } = req.body

    const workspace = await Workspace.create({
      owner: req.user._id,
      name,
      description,
      agileMethod,
      sprintLength
    })

    res.status(201).json(workspace)

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to create workspace"
    })

  }

})

app.put("/workspace/:id", async (req, res) => {

  try {

    const { name, description, agileMethod, sprintLength } = req.body

    const workspace = await Workspace.findOneAndUpdate(
      {
        _id: req.params.id,
        owner: req.user._id
      },
      definedFields({
        name,
        description,
        agileMethod,
        sprintLength
      }),
      {
        new: true,
        runValidators: true
      }
    )

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found"
      })
    }

    res.json(workspace)

  }

  catch (error) {

    console.log(error)

    res.status(500).json({
      message: "Failed to update workspace"
    })

  }

})

const startServer = async () => {

  if (!MONGO_URI) {
    console.log("MONGO_URI is missing. Add it to server/.env")
    return
  }

  try {

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000
    })

    console.log("MongoDB Connected")

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })

  }

  catch (err) {

    console.log("MongoDB connection failed:", err.message)

  }

}

startServer()
