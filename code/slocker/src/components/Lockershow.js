import React, { useContext } from 'react'
import { LocationContext } from '../global/LocationContext'
import '../css/LockerDashboard.css'



export const Lockershow= () => {

  const { locations } = useContext(LocationContext);

  return (
    <div>
    {locations.length !== 0 && <h1 className="show">Already Added Locations</h1>}
    <div className='container1'></div>
    {locations.length === 0 && <div className='error-msg'>slow internet...no locations to display</div>}
    {locations.map(location => (
        <div className='card' key={location.LocationID}>
          <div className='name'>
              Location  - {location.LocationName}
          </div>
          <div className='count'>
               Number of lockers -  {location.LocationCount}
          </div>
          <button className='gobutton'>Go to lockers</button>
        </div>
    ))}
    </div>

  )
}
