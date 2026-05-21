import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import { useEffect, useState } from "react"

import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import Tasks from "./pages/Tasks"
import Projects from "./pages/Projects"
import Team from "./pages/Team"

function ProtectedRoute({ children }) {

  const user = localStorage.getItem("user")

  if (!user) {
    return <Navigate to="/" replace />
  }

  return children

}

function App() {

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light"
  })

  useEffect(() => {
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  return (
    <div className={theme === "dark" ? "dark" : ""}>

      <BrowserRouter>

        <Routes>

          <Route
            path="/"
            element={<Login theme={theme} toggleTheme={toggleTheme} />}
          />

          <Route
            path="/signup"
            element={<Signup theme={theme} toggleTheme={toggleTheme} />}
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <Tasks theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/team"
            element={
              <ProtectedRoute>
                <Team theme={theme} toggleTheme={toggleTheme} />
              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>

    </div>
  )
}

export default App
