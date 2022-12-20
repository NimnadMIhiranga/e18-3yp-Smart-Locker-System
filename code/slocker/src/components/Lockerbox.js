import React , { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import '../css/LockerDashboard.css'
import { auth } from "../config/config"

export const Lockerbox =({ user }) => {

  const [error, setError] = useState("")
  const history = useHistory()

  async function handleLogout() {
    setError("")

    try {
      await auth.signOut()
      history.push("/")
    } catch {
      setError("Failed to log out")
    }
  }

  return (
    <div className='userbox'>
        <div className='leftside'>
        <h1>Hello {user}</h1>
        </div>
        <div className='rightside'>
        <Link to="AddLocation" ><button className='button5'>+ Add a new location</button></Link>
        <button variant="link" onClick={handleLogout} className='logout'>
          Log Out
        </button>
        </div>
    </div>
  )
}

export default Lockerbox