import React, { useEffect } from 'react'
import { useState } from 'react'
import { useAuth } from '../../Auth/AuthContext'
import { addDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../../Firebase-Config'
import { useNavigate } from 'react-router'
import DoctorDetail from './DoctorDetail'
import { getDoc, collection } from 'firebase/firestore'
import { toast } from 'react-toastify'
// import { update } from 'firebase/firestore'

const Card = (props) => {

    const { id, name, city, speciality, image, experience, mobile, handleDoctor } = props


    const { doctor, setDoctor } = useAuth([])

    const [doctorDetail, setDoctorDetail] = useState()
    const [patientDetail, setPatientDetail] = useState()

    
      const user = auth.currentUser;
      const patientCollectionRef = collection(db, 'patients');

    useEffect(() => {
        const fetchData = async() => {
             try {
                  const snapshot = await getDoc(doc(patientCollectionRef, user.uid));
                  if (snapshot.exists()) {
                    const userData = snapshot.data();
                
                    setPatientDetail(userData)
                    // console.log(userData);
            
                  } else {
                    console.log("User not found");
                  }
                } catch (error) {
                  console.error("Error fetching user info:", error);
                }
        }
        fetchData()
    },[])
    

    const navigate = useNavigate()


    const handleDoctorBook = (e) => {
        e.preventDefault(); // Prevent default action if necessary
    
        // Check if patientDetail contains valid data
        if (!patientDetail?.personalInfo || !patientDetail?.medicalInfo) {
            toast.error("Please submit your personal and medical information before booking a doctor.");
            return; // Stop execution if data is missing
        }
    
        // If data is valid, proceed with booking
        const doctorId = id; // Replace with the actual doctor ID
        const filterDoctor = doctor.filter((doc) => doc.id === doctorId);
    
        setDoctorDetail(filterDoctor);
        localStorage.setItem("doctor", JSON.stringify(filterDoctor));
        navigate("/patient/DoctorDetail");
    };
    


//   console.log(patientDetail);
  
    

    return (
        <div>
            <div className=''>
                <div className=" shadow-md rounded-md px-3 hover:shadow-xl hover:bg-slate-300 transition-all duration-300 ease-in-out">
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