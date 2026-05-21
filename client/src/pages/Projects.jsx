import { useEffect, useState } from "react"
import axios from "axios"
import AppLayout from "../components/AppLayout"

const API_URL = "http://localhost:8000/projects"

const emptyProject = {
  name: "",
  key: "",
  description: "",
  status: "Active"
}

function Projects({ theme, toggleTheme }) {

  const [projects, setProjects] = useState([])
  const [formData, setFormData] = useState(emptyProject)
  const [loading, setLoading] = useState(true)

  const fetchProjects = async () => {

    try {

      const res = await axios.get(API_URL)

      setProjects(res.data)

    }

    catch (error) {

      console.log(error)

      alert("Failed to load projects")

    }

    finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    fetchProjects()

  }, [])

  const handleInputChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleCreateProject = async (e) => {

    e.preventDefault()

    if (!formData.name.trim() || !formData.key.trim()) {
      alert("Project name and key are required")
      return
    }

    try {

      const res = await axios.post(API_URL, formData)

      setProjects([res.data, ...projects])
      setFormData(emptyProject)

    }

    catch (error) {

      console.log(error)

      alert(error.response?.data?.message || "Failed to create project")

    }

  }

  const handleStatusChange = async (projectId, status) => {

    try {

      const res = await axios.put(`${API_URL}/${projectId}`, {
        status
      })

      setProjects(projects.map((project) => {
        return project._id === projectId ? res.data : project
      }))

    }

    catch (error) {

      console.log(error)

      alert("Failed to update project")

    }

  }

  const handleDeleteProject = async (projectId) => {

    try {

      await axios.delete(`${API_URL}/${projectId}`)

      setProjects(projects.filter((project) => project._id !== projectId))

    }

    catch (error) {

      console.log(error)

      alert("Failed to delete project")

    }

  }

  return (

    <AppLayout title="Projects" kicker="Project planning" theme={theme} toggleTheme={toggleTheme}>

      <form
        onSubmit={handleCreateProject}
        className="bg-white border border-slate-200 rounded-md p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800"
      >

        <div className="flex justify-between items-center mb-4">

          <div>

            <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">
              Create Project
            </h2>

            <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
              Use a short key like WEB, API, APP, or PMT.
            </p>

          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium text-white"
          >
            Create
          </button>

        </div>

        <div className="grid grid-cols-[1.2fr_0.6fr_1.8fr_0.8fr] gap-3">

          <input
            name="name"
            placeholder="Project name"
            value={formData.name}
            onChange={handleInputChange}
            className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />

          <input
            name="key"
            placeholder="Key"
            value={formData.key}
            onChange={handleInputChange}
            className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm uppercase focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />

          <input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          >
            <option>Planning</option>
            <option>Active</option>
            <option>Completed</option>
          </select>

        </div>

      </form>

      <section className="bg-white border border-slate-200 rounded-md mt-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">

        <div className="grid grid-cols-[1fr_0.5fr_1.4fr_0.7fr_0.5fr] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400">
          <p>Name</p>
          <p>Key</p>
          <p>Description</p>
          <p>Status</p>
          <p>Action</p>
        </div>

        {loading ? (

          <div className="p-5 text-sm text-slate-500 dark:text-slate-400">
            Loading projects...
          </div>

        ) : projects.length === 0 ? (

          <div className="p-5 text-sm text-slate-500 dark:text-slate-400">
            No projects yet.
          </div>

        ) : projects.map((project) => (

          <div
            key={project._id}
            className="grid grid-cols-[1fr_0.5fr_1.4fr_0.7fr_0.5fr] gap-4 px-5 py-3 border-b border-slate-100 items-center hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
          >

            <p className="text-sm font-medium text-slate-900 truncate dark:text-slate-100">
              {project.name}
            </p>

            <p className="text-sm text-blue-600 font-medium dark:text-blue-300">
              {project.key}
            </p>

            <p className="text-sm text-slate-500 truncate dark:text-slate-400">
              {project.description || "No description"}
            </p>

            <select
              value={project.status}
              onChange={(e) => handleStatusChange(project._id, e.target.value)}
              className="bg-white border border-slate-300 text-slate-700 p-1.5 rounded-md outline-none text-xs focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-200"
            >
              <option>Planning</option>
              <option>Active</option>
              <option>Completed</option>
            </select>

            <button
              onClick={() => handleDeleteProject(project._id)}
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

export default Projects
