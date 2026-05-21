import { useEffect, useState } from "react"
import axios from "axios"
import AppLayout from "../components/AppLayout"

const API = "http://localhost:8000"

const emptyTask = {
  title: "",
  description: "",
  status: "To Do",
  priority: "Medium",
  project: "",
  assignee: ""
}

const statusStyles = {
  "To Do": "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
  Completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800"
}

function Tasks({ theme, toggleTheme }) {

  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [team, setTeam] = useState([])
  const [formData, setFormData] = useState(emptyTask)
  const [loading, setLoading] = useState(true)

  const fetchPageData = async () => {

    try {

      const [tasksRes, projectsRes, teamRes] = await Promise.all([
        axios.get(`${API}/tasks`),
        axios.get(`${API}/projects`),
        axios.get(`${API}/team`)
      ])

      setTasks(tasksRes.data)
      setProjects(projectsRes.data)
      setTeam(teamRes.data)

    }

    catch (error) {

      console.log(error)

      alert("Failed to load tasks")

    }

    finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    fetchPageData()

  }, [])

  const handleInputChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleCreateTask = async (e) => {

    e.preventDefault()

    if (!formData.title.trim()) {
      alert("Task title is required")
      return
    }

    try {

      const res = await axios.post(`${API}/tasks`, formData)

      setTasks([res.data, ...tasks])
      setFormData(emptyTask)

    }

    catch (error) {

      console.log(error)

      alert(error.response?.data?.message || "Failed to create task")

    }

  }

  const handleStatusChange = async (taskId, status) => {

    try {

      const res = await axios.put(`${API}/tasks/${taskId}`, {
        status
      })

      setTasks(tasks.map((task) => {
        return task._id === taskId ? res.data : task
      }))

    }

    catch (error) {

      console.log(error)

      alert("Failed to update task")

    }

  }

  const handleDeleteTask = async (taskId) => {

    try {

      await axios.delete(`${API}/tasks/${taskId}`)

      setTasks(tasks.filter((task) => task._id !== taskId))

    }

    catch (error) {

      console.log(error)

      alert("Failed to delete task")

    }

  }

  return (

    <AppLayout title="Tasks" kicker="Work items" theme={theme} toggleTheme={toggleTheme}>

      <form
        onSubmit={handleCreateTask}
        className="bg-white border border-slate-200 rounded-md p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800"
      >

        <div className="flex justify-between items-center mb-4">

          <div>

            <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">
              Create Task
            </h2>

            <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
              Add a task, assign it, and connect it to a project.
            </p>

          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium text-white"
          >
            Create
          </button>

        </div>

        <div className="grid grid-cols-3 gap-3">

          <input
            name="title"
            placeholder="Task title"
            value={formData.title}
            onChange={handleInputChange}
            className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />

          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />

          <select
            name="project"
            value={formData.project}
            onChange={handleInputChange}
            className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          >
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project._id} value={project.name}>
                {project.name}
              </option>
            ))}
          </select>

          <select
            name="assignee"
            value={formData.assignee}
            onChange={handleInputChange}
            className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          >
            <option value="">Unassigned</option>
            {team.map((member) => (
              <option key={member._id} value={member.name}>
                {member.name}
              </option>
            ))}
          </select>

          <select
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          >
            <option>To Do</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>

        </div>

      </form>

      <section className="bg-white border border-slate-200 rounded-md mt-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">

        <div className="grid grid-cols-[1.3fr_1.4fr_1fr_1fr_0.8fr_1.1fr_0.6fr] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400">
          <p>Task</p>
          <p>Description</p>
          <p>Project</p>
          <p>Assignee</p>
          <p>Priority</p>
          <p>Status</p>
          <p>Action</p>
        </div>

        {loading ? (

          <div className="p-5 text-sm text-slate-500 dark:text-slate-400">
            Loading tasks...
          </div>

        ) : tasks.length === 0 ? (

          <div className="p-5 text-sm text-slate-500 dark:text-slate-400">
            No tasks yet.
          </div>

        ) : tasks.map((task) => (

          <div
            key={task._id}
            className="grid grid-cols-[1.3fr_1.4fr_1fr_1fr_0.8fr_1.1fr_0.6fr] gap-4 px-5 py-3 border-b border-slate-100 items-center hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
          >

            <p className="text-sm font-medium text-slate-900 truncate dark:text-slate-100">
              {task.title}
            </p>

            <p className="text-sm text-slate-500 truncate dark:text-slate-400">
              {task.description || "No description"}
            </p>

            <p className="text-sm text-slate-600 truncate dark:text-slate-300">
              {task.project || "No project"}
            </p>

            <p className="text-sm text-slate-600 truncate dark:text-slate-300">
              {task.assignee || "Unassigned"}
            </p>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              {task.priority}
            </p>

            <div className="flex items-center gap-2">

              <span className={`text-xs border px-2 py-1 rounded ${statusStyles[task.status]}`}>
                {task.status}
              </span>

              <select
                value={task.status}
                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                className="bg-white border border-slate-300 text-slate-700 p-1.5 rounded-md outline-none text-xs focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200"
              >
                <option>To Do</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

            </div>

            <button
              onClick={() => handleDeleteTask(task._id)}
              className="text-sm text-slate-500 hover:text-rose-600 text-left dark:text-slate-400 dark:hover:text-rose-300"
            >
              Delete
            </button>

          </div>

        ))}

      </section>

    </AppLayout>

  )
}

export default Tasks
