import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {


    return (
        <div className='text-[14px]'>
            <ul className='flex justify-between items-center p-5 bg-blue-500 text-white px-4 sm:px-16'>
                <li>
                    <Link to="/doctor">Dashboard</Link>
                </li>
                <li>
                    <Link to="/doctor/appointment">Appointment</Link>
                </li>
                <li>
                    <Link to="/doctor/Availability">Set Availability </Link>
                </li>
                <li>
                    <Link to="/doctor/PatientRecords">Patient Records</Link>
                </li>
                <li>
                    <Link to="/doctor/profile">Profile</Link>
                </li>
                <li>
                    
                </li>
            </ul>
        </div>
    )
}

export default Navbar