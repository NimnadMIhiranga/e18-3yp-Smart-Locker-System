import React , { useState } from 'react'
import { useHistory, Link } from 'react-router-dom'
import '../css/LockerDashboard.css'
import { auth } from "../config/config"

export const Lockerbox =({ user, userID }) => {

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
        <h1>{user} </h1>
        </div>
        {userID  && <div className='rightside'>
        <Link to="AddLocation" ><button className='button5'>+ Add a new location</button></Link>
            <button variant="link" onClick={handleLogout} className='logout'>
              Log Out
        </button>  </div>}
        {!userID && <div className='rightside'>
            <button variant="link" onClick={handleLogout} className='logout'>
              Log Out
        </button>  </div>}
        
    </div>
  )
}

export default Lockerbox

