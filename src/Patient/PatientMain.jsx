import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'
import AuthProvider from '../Auth/AuthContext'


const PatientMain = () => {
    return (
        <div className=' font-poppins'>
            <Navbar />
            <Outlet/>
        </div>
    )
}

export default PatientMain