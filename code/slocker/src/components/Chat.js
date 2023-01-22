import React, {  useEffect , useState, useRef } from 'react'
import '../css/Chat.css'
import { auth } from '../config/config'
import { useHistory, useLocation , Link} from 'react-router-dom'
import { realdb } from "../config/configreal";
import { set, ref, onValue, remove, update } from "firebase/database";
import Model1 from "react-modal";
import Model3 from "react-modal";
import Model from "react-modal";
import Whatsapp from "react-whatsapp";
import whatsappImage from '../assets/whatsapp.png';




export const Chat = ({user, userID}) => {

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
        <h1 className='chat-head'>Contact Us</h1>
        <Whatsapp number="+94 705611644" message="Hello admin" className='whatsapp-btn'><img src={whatsappImage} alt="locker" className='image'/>
            Admin 01
        </Whatsapp>
        <Whatsapp number="+94 719725052" message="Hello admin" className='whatsapp-btn'><img src={whatsappImage} alt="locker" className='image'/>
            Admin 02
        </Whatsapp>
        <Whatsapp number="+94 771858798" message="Hello admin" className='whatsapp-btn'><img src={whatsappImage} alt="locker" className='image'/>
            Admin 03
        </Whatsapp>
        </div>
    </div>
  )
}

