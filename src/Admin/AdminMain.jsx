import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router'

const AdminMain = () => {
  return (
    <div>
         <div className='font-poppins'>
           <Navbar />
           <Outlet />
        </div>
    </div>
  )
}

export default AdminMain