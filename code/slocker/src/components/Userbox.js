import React , { useState } from 'react'
import { useHistory } from 'react-router-dom'
import '../css/UserDashboard.css'
import { auth } from "../config/config"

export const Userbox = ({ user }) =>  {

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
      <div>
        <div className='userbox'>
        <div className='leftside'>
        <h1>Hello {user}</h1>

        </div>
        <div className='rightside'>
        <button variant="link" onClick={handleLogout} className='logout'>
          LogOut
        </button>
        </div>
    </div>
    <h1 className="show1">Home Page</h1>
    </div>
    )
  }


export default Userbox