import { useEffect, useMemo, useState } from "react"
import api from "../api"
import AppLayout from "../components/AppLayout"

const statusStyles = {
  "To Do": "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
  "In Progress": "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800",
  "Completed": "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-800"
}

function Dashboard({ theme, toggleTheme }) {

  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [team, setTeam] = useState([])
  const [workspace, setWorkspace] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    const fetchDashboardData = async () => {

      try {

        const [tasksRes, projectsRes, teamRes, workspaceRes] = await Promise.all([
          api.get("/tasks"),
          api.get("/projects"),
          api.get("/team"),
          api.get("/workspace")
        ])

        setTasks(tasksRes.data)
        setProjects(projectsRes.data)
        setTeam(teamRes.data)
        setWorkspace(workspaceRes.data)

      }

      catch (error) {

        console.log(error)

        alert("Failed to load dashboard")

      }

      finally {

        setLoading(false)

      }

    }

    fetchDashboardData()

  }, [])

  const groupedTasks = useMemo(() => {

    return {
      "To Do": tasks.filter((task) => task.status === "To Do"),
      "In Progress": tasks.filter((task) => task.status === "In Progress"),
      Completed: tasks.filter((task) => task.status === "Completed")
    }

  }, [tasks])

  const stats = [
    { label: "Projects", value: projects.length },
    { label: "Tasks", value: tasks.length },
    { label: "Team Members", value: team.length },
    { label: "Completed", value: groupedTasks.Completed.length }
  ]

  return (

    <AppLayout
      title="Project Dashboard"
      kicker={workspace?.name || "Workspace"}
      theme={theme}
      toggleTheme={toggleTheme}
    >

      {loading ? (

        <div className="bg-white border border-slate-200 rounded-md p-5 text-sm text-slate-500 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-400">
          Loading dashboard...
        </div>

      ) : (

        <>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">

            {stats.map((stat) => (

              <div
                key={stat.label}
                className="bg-white border border-slate-200 rounded-md p-4 shadow-sm dark:bg-slate-900 dark:border-slate-800"
              >

                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>

                <p className="text-3xl font-semibold text-slate-950 mt-2 dark:text-slate-50">
                  {stat.value}
                </p>

              </div>

            ))}

          </div>

          <div className="grid grid-cols-1 gap-5 mt-5 w-full">

            <section className="bg-white border border-slate-200 rounded-md shadow-sm dark:bg-slate-900 dark:border-slate-800">

              <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800">

                <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">
                  Task Tracking Board
                </h2>

                <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
                </p>

              </div>

              <div className="grid grid-cols-3 gap-4 p-5">

                {Object.keys(groupedTasks).map((status) => (

                  <div key={status} className="bg-slate-50 rounded-md p-3 dark:bg-slate-950">

                    <div className="flex justify-between items-center mb-3">

                      <span className={`text-xs border px-2 py-1 rounded ${statusStyles[status]}`}>
                        {status}
                      </span>

                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {groupedTasks[status].length}
                      </span>

                    </div>

                    <div className="space-y-2">

                      {groupedTasks[status].slice(0, 4).map((task) => (

                        <div
                          key={task._id}
                          className="bg-white border border-slate-200 rounded-md p-3 dark:bg-slate-900 dark:border-slate-800"
                        >

                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {task.title}
                          </p>

                          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
                            {task.project || "No project"}
                          </p>

                        </div>

                      ))}

                      {groupedTasks[status].length === 0 && (

                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          No tasks
                        </p>

                      )}

                    </div>

                  </div>

                ))}

              </div>

            </section>

            

          </div>

        </>

      )}

    </AppLayout>

  )
}

export default Dashboard
