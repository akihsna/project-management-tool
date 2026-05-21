import { useEffect, useState } from "react"
import axios from "axios"
import AppLayout from "../components/AppLayout"

const API_URL = "http://localhost:8000/workspace"

const emptyWorkspace = {
  name: "Project Hub",
  description: "",
  agileMethod: "Kanban",
  sprintLength: 2
}

function Workspace({ theme, toggleTheme }) {

  const [workspace, setWorkspace] = useState(null)
  const [formData, setFormData] = useState(emptyWorkspace)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchWorkspace = async () => {

      try {

        const res = await axios.get(API_URL)

        if (res.data) {
          setWorkspace(res.data)
          setFormData({
            name: res.data.name || "",
            description: res.data.description || "",
            agileMethod: res.data.agileMethod || "Kanban",
            sprintLength: res.data.sprintLength || 2
          })
        }

      }

      catch (error) {

        console.log(error)

        alert("Failed to load workspace")

      }

      finally {

        setLoading(false)

      }

    }

    fetchWorkspace()

  }, [])

  const handleInputChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleSaveWorkspace = async (e) => {

    e.preventDefault()

    if (!formData.name.trim()) {
      alert("Workspace name is required")
      return
    }

    try {

      const res = workspace
        ? await axios.put(`${API_URL}/${workspace._id}`, formData)
        : await axios.post(API_URL, formData)

      setWorkspace(res.data)

      alert("Workspace saved")

    }

    catch (error) {

      console.log(error)

      alert(error.response?.data?.message || "Failed to save workspace")

    }

  }

  return (

    <AppLayout title="Workspace" kicker="Settings" theme={theme} toggleTheme={toggleTheme}>

      <div className="grid grid-cols-[1.4fr_1fr] gap-5">

        <form
          onSubmit={handleSaveWorkspace}
          className="bg-white border border-slate-200 rounded-md p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800"
        >

          <div className="flex justify-between items-center mb-4">

            <div>

              <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">
                Workspace Details
              </h2>

              <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                This is the main space where your projects, team, and tasks live.
              </p>

            </div>

            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium text-white"
            >
              Save
            </button>

          </div>

          {loading ? (

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading workspace...
            </p>

          ) : (

            <div className="space-y-3">

              <input
                name="name"
                placeholder="Workspace name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
              />

              <input
                name="description"
                placeholder="Workspace description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
              />

              <div className="grid grid-cols-2 gap-3">

                <select
                  name="agileMethod"
                  value={formData.agileMethod}
                  onChange={handleInputChange}
                  className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
                >
                  <option>Kanban</option>
                  <option>Scrum</option>
                </select>

                <input
                  name="sprintLength"
                  type="number"
                  min="1"
                  max="8"
                  value={formData.sprintLength}
                  onChange={handleInputChange}
                  className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
                />

              </div>

            </div>

          )}

        </form>

        <section className="bg-white border border-slate-200 rounded-md p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">

          <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">
        
          </h2>

          <p className="text-sm text-slate-600 mt-3 leading-6 dark:text-slate-300">
            
          </p>

          <p className="text-sm text-slate-600 mt-3 leading-6 dark:text-slate-300">
            
          </p>

        </section>

      </div>

    </AppLayout>

  )
}

export default Workspace
