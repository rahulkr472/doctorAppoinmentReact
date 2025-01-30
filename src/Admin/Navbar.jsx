import React from 'react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const Navbar = () => {


    const navRef = useRef()

    useGSAP(() => {
        gsap.from("ul li", {
            y: -30,
            duration:.6,
            opacity:0,
            stagger:.2
        })
    })

    return (
        <div className='text-[14px]'>
            <ul className='flex justify-between items-center p-5 bg-blue-500 text-white px-4 sm:px-16'>
                <li >
                    <Link  to="/admin">Home</Link>
                </li>
                <li>
                    <Link to="/admin/Doctor">Add Doctor</Link>
                </li>
            </ul>
        </div>
    )
}

export default Navbar