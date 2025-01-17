import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className='bg-blue-300 py-3 text-[14px] px-4 sm:px-20'>
            <ul className='flex space-x-3'>
                <li>
                    <Link to="/patient">Home</Link>    
                </li>
                <li>
                    <Link to="/Patient/appointment">Appointment</Link>
                </li>
                <li>
                    <Link to="/Patient/profile">Profile</Link>
                </li>
            </ul>
        </div>
    )
}

export default Navbar