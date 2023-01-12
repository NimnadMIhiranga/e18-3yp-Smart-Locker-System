import React, {  useEffect , useState, useRef } from 'react'
import '../css/Res.css'
import { auth } from '../config/config'
import { useHistory, useLocation , Link} from 'react-router-dom'
import { realdb } from "../config/configreal";
import { set, ref, onValue, remove, update } from "firebase/database";
import Model from "react-modal";
import { db } from "../config/config";


export const Bookings = ({user, userID, uID}) => {

  const [error, setError] = useState("");
  const history = useHistory();


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
    <div className ="Resboard">
      <div className = "gradient__bg">
      <div className='userbox'>
      <div className='leftside'>
                <h1>{user}</h1>
      </div>
      <div className='rightside'>
        <Link to="UserDashboard" ><button variant="link" className='logout'>
              GoBack
        </button></Link>
        <button variant="link" onClick={handleLogout} className='logout'>
              LogOut
            </button>
      </div>
      </div>
      </div>
    </div>
  )
}
