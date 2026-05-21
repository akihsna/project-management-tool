import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios"
import { ThemeToggle } from "../components/AppLayout"

function Signup({ theme, toggleTheme }) {

  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSignup = async () => {

    try {

      const userData = {
        name,
        email,
        password
      }

      const res = await axios.post(
        "http://localhost:8000/signup",
        userData
      )

      console.log(res.data)

      navigate("/")

    }

    catch (error) {

      console.log(error)

      alert(error.response?.data?.message || "Signup Failed")

    }

  }

  return (

    <div className="h-screen bg-slate-100 flex justify-center items-center text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      <div className="absolute right-6 top-6">
        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      </div>

      <div className="bg-white p-8 rounded-md shadow-sm w-[360px] border border-slate-200 dark:bg-slate-900 dark:border-slate-800">

        <h1 className="text-3xl font-semibold text-slate-950 text-center dark:text-slate-50">
          Create Account
        </h1>

        <p className="text-slate-500 text-center mt-2 text-sm dark:text-slate-400">
          Signup to continue
        </p>

        <div className="mt-7">

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-md bg-white border border-slate-300 text-slate-900 outline-none mb-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-blue-950"
          />

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-md bg-white border border-slate-300 text-slate-900 outline-none mb-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-blue-950"
          />

          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-white border border-slate-300 text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus:ring-blue-950"
          />

          <button
            onClick={handleSignup}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-300 mt-5 p-3 rounded-md text-white font-medium"
          >
            Signup
          </button>

          <p className="text-slate-500 text-center mt-5 text-sm dark:text-slate-400">
            Already have an account?

            <Link
              to="/"
              className="text-blue-600 ml-2 font-medium"
            >
              Login
            </Link>

          </p>

        </div>

      </div>

    </div>

  )
}

export default Signup
