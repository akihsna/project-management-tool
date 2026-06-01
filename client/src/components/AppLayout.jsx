import { NavLink, useNavigate } from "react-router-dom"
import api from "../api"

export function ThemeToggle({ theme, toggleTheme }) {

  return (

    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      title="Toggle theme"
      className="h-9 w-9 grid place-items-center rounded-md border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
    >
      {theme === "dark" ? (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2" />
          <path d="M12 20v2" />
          <path d="m4.93 4.93 1.41 1.41" />
          <path d="m17.66 17.66 1.41 1.41" />
          <path d="M2 12h2" />
          <path d="M20 12h2" />
          <path d="m6.34 17.66-1.41 1.41" />
          <path d="m19.07 4.93-1.41 1.41" />
        </svg>
      ) : (
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 7 7 0 1 0 20.5 14.5Z" />
        </svg>
      )}
    </button>

  )
}

function AppLayout({ children, title, kicker, theme, toggleTheme }) {

  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem("user") || "null")

  const handleLogout = async () => {

    try {
      await api.post("/logout")
    }
    catch (error) {
      console.log(error)
    }

    localStorage.removeItem("authToken")
    localStorage.removeItem("user")

    navigate("/")

  }

  const navItems = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Tasks", path: "/tasks" },
    { label: "Projects", path: "/projects" },
    { label: "Team", path: "/team" }
  ]

  return (

    <div className="min-h-screen bg-slate-100 text-slate-900 flex dark:bg-slate-950 dark:text-slate-100">

      <aside className="w-60 bg-white border-r border-slate-200 px-4 py-5 dark:bg-slate-900 dark:border-slate-800">

        <div className="mb-7">

          <h1 className="text-lg font-semibold text-slate-950 dark:text-slate-50">
            TaskGrid
          </h1>

          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400">
            Project workspace
          </p>

        </div>

        <nav className="space-y-1">

          {navItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => {
                return isActive
                  ? "block bg-blue-50 text-blue-700 border border-blue-100 p-2.5 rounded-md text-sm font-medium dark:bg-blue-950 dark:text-blue-200 dark:border-blue-800"
                  : "block text-slate-600 p-2.5 rounded-md text-sm hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              }}
            >
              {item.label}
            </NavLink>

          ))}

        </nav>

      </aside>

      <main className="flex-1">

        <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center dark:bg-slate-900 dark:border-slate-800">

          <div>

            <p className="text-xs font-medium text-slate-500 uppercase dark:text-slate-400">
              {kicker}
            </p>

            <h1 className="text-2xl font-semibold text-slate-950 mt-1 dark:text-slate-50">
              {title}
            </h1>

          </div>

          <div className="flex items-center gap-3">

            <p className="text-sm text-slate-600 dark:text-slate-300">
              {user?.name || "User"}
            </p>

            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />

            <button
              onClick={handleLogout}
              className="bg-white hover:bg-slate-50 border border-slate-300 px-3 py-2 rounded-md text-sm text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:border-slate-700 dark:text-slate-200"
            >
              Logout
            </button>

          </div>

        </header>

        <div className="px-8 py-6">
          {children}
        </div>

      </main>

    </div>

  )
}

export default AppLayout
