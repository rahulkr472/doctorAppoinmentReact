import React, { useEffect } from 'react'
import { useState } from 'react'
import { useAuth } from '../../Auth/AuthContext'
import { addDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../Firebase-Config'
import { useNavigate } from 'react-router'
import DoctorDetail from './DoctorDetail'
// import { update } from 'firebase/firestore'

const Card = (props) => {

    const { id, name, city, speciality, image, experience, mobile, handleDoctor } = props


    const { doctor, setDoctor } = useAuth([])

    const [doctorDetail, setDoctorDetail] = useState()



    const navigate = useNavigate()

    const handleDoctorBook = (e) => {

        navigate("/patient/DoctorDetail")
        const doctorId = id

        const filterDoctor = doctor.filter((doc) => doc.id === doctorId)

        setDoctorDetail(filterDoctor)

        localStorage.setItem("doctor", JSON.stringify(filterDoctor))


    }

    return (
        <div>
            <div className=''>
                <div className="bg-[#f1f1f1] shadow-md rounded-md px-3 hover:shadow-xl hover:bg-slate-300 transition-all duration-300 ease-in-out">
                    <div className="flex justify-between ">
                        <div className='flex space-x-4 items-center'>
                            <div>
                                {
                                    image ? (
                                        <img src={image} alt=""
                                            className='h-32 w-32 rounded-full p-2' />
                                    ) : (
                                        <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Default"
                                            className='h-32 w-32 rounded-full p-2' />
                                    )
                                }

                            </div>
                            <div className=" text-[12px] leading-5 text-black"
                            >
                                <p className="text-[15px] font-medium">Name: {name}</p>
                                <p className="">City: {city}</p>
                                <p className="">Specializtion: {speciality}</p>
                                <p className="">{experience} years of experience</p>
                                <p className="">{mobile}</p>
                            </div>
                        </div>

                        <div className='py-20'>
                            <button
                                onClick={handleDoctorBook}
                                className="bg-blue-500  text-[12px] text-white px-5 py-2 rounded-md">
                                Book
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div >
    )
}

export default Card