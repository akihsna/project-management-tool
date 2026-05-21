import { useEffect, useState } from "react"
import axios from "axios"
import AppLayout from "../components/AppLayout"

const API_URL = "http://localhost:8000/team"

const emptyMember = {
  name: "",
  email: "",
  role: "Developer"
}

function Team({ theme, toggleTheme }) {

  const [members, setMembers] = useState([])
  const [formData, setFormData] = useState(emptyMember)
  const [loading, setLoading] = useState(true)

  const fetchTeam = async () => {

    try {

      const res = await axios.get(API_URL)

      setMembers(res.data)

    }

    catch (error) {

      console.log(error)

      alert("Failed to load team")

    }

    finally {

      setLoading(false)

    }

  }

  useEffect(() => {

    fetchTeam()

  }, [])

  const handleInputChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })

  }

  const handleAddMember = async (e) => {

    e.preventDefault()

    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Name and email are required")
      return
    }

    try {

      const res = await axios.post(API_URL, formData)

      setMembers([res.data, ...members])
      setFormData(emptyMember)

    }

    catch (error) {

      console.log(error)

      alert(error.response?.data?.message || "Failed to add team member")

    }

  }

  const handleDeleteMember = async (memberId) => {

    try {

      await axios.delete(`${API_URL}/${memberId}`)

      setMembers(members.filter((member) => member._id !== memberId))

    }

    catch (error) {

      console.log(error)

      alert("Failed to delete team member")

    }

  }

  return (

    <AppLayout title="Team" kicker="People" theme={theme} toggleTheme={toggleTheme}>

      <form
        onSubmit={handleAddMember}
        className="bg-white border border-slate-200 rounded-md p-5 shadow-sm dark:bg-slate-900 dark:border-slate-800"
      >

        <div className="flex justify-between items-center mb-4">

          <div>

            <h2 className="text-base font-semibold text-slate-950 dark:text-slate-50">
              Add Team Member
            </h2>

            <p className="text-sm text-slate-500 mt-1 dark:text-slate-400">
              Add people who can own work items.
            </p>

          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium text-white"
          >
            Add
          </button>

        </div>

        <div className="grid grid-cols-[1fr_1.4fr_0.9fr] gap-3">

          <input
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleInputChange}
            className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            className="bg-white border border-slate-300 text-slate-900 p-2.5 rounded-md outline-none text-sm focus:border-blue-500 dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"
          >
            <option>Product Owner</option>
            <option>Scrum Master</option>
            <option>Developer</option>
            <option>Designer</option>
            <option>Tester</option>
          </select>

        </div>

      </form>

      <section className="bg-white border border-slate-200 rounded-md mt-5 shadow-sm dark:bg-slate-900 dark:border-slate-800">

        <div className="grid grid-cols-[1fr_1.4fr_0.9fr_0.5fr] gap-4 px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase dark:bg-slate-950 dark:border-slate-800 dark:text-slate-400">
          <p>Name</p>
          <p>Email</p>
          <p>Role</p>
          <p>Action</p>
        </div>

        {loading ? (

          <div className="p-5 text-sm text-slate-500 dark:text-slate-400">
            Loading team...
          </div>

        ) : members.length === 0 ? (

          <div className="p-5 text-sm text-slate-500 dark:text-slate-400">
            No team members yet.
          </div>

        ) : members.map((member) => (

          <div
            key={member._id}
            className="grid grid-cols-[1fr_1.4fr_0.9fr_0.5fr] gap-4 px-5 py-3 border-b border-slate-100 items-center hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
          >

            <p className="text-sm font-medium text-slate-900 truncate dark:text-slate-100">
              {member.name}
            </p>

            <p className="text-sm text-slate-500 truncate dark:text-slate-400">
              {member.email}
            </p>

            <p className="text-sm text-blue-600 font-medium dark:text-blue-300">
              {member.role}
            </p>

            <button
              onClick={() => handleDeleteMember(member._id)}
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

export default Team
