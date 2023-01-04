import React, {  useEffect } from 'react'
import '../css/Res.css'
import { Resbox } from './Resbox';
import { Resshow} from './Resshow';
import { auth } from '../config/config'
import { useHistory } from 'react-router-dom'

export const ResDashboard = ({user, userID, locationID}) =>{

    const history = useHistory();

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            if (!user) {
                history.push('/');
            }
        })
    })

    return(
        <div className ="Resboard">
            <div className = "gradient__bg">
                <Resbox user={user} userID = {userID} locationID={locationID}/>
            </div>
        </div> 
    )


}


export default ResDashboard