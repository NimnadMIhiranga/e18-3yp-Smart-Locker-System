import React , { useState, useRef } from 'react'
import { useHistory} from 'react-router-dom'
import '../css/Res.css'
import { auth } from "../config/config"
import { db } from "../config/config";
import Model from 'react-modal'
import { Link } from 'react-router-dom'

export const Resbox =({ user, userID}) => {

    const [error, setError] = useState("")
    const history = useHistory()
    const [visible, setvisible] = useState(false);
    const [available, setAvailable] = useState("");
    const [ID, setID] = useState("");
    const lockIDRef = useRef();
    const stateRef = useRef();


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
            <h1>{user}</h1>
            </div>

          <div className='rightside'>
            <Link to="LockerDashboard" ><button variant="link" className='logout'>
              GoBack
            </button></Link>

            <button variant="link" onClick={handleLogout} className='logout'>
              LogOut
        </button>  </div>
        </div>
      )

    
}

export default Resbox