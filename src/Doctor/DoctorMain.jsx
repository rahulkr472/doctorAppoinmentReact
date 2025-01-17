import React from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom'

const DoctorMain = () => {
    return (
        <div className='font-poppins'>
           <Navbar />
           <Outlet />
        </div>
    );
};

export default DoctorMain;