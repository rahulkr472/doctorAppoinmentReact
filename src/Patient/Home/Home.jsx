import React, { useEffect } from 'react'
// import Navbar from './Navbar'
import { collection, doc, getDocs, QuerySnapshot, getDoc } from "firebase/firestore";
import { db } from '../../Firebase-Config';
import { useState } from 'react';
import { auth } from '../../Firebase-Config';
import { useAuth } from '../../Auth/AuthContext';
import Card from './Card';
import { onAuthStateChanged } from 'firebase/auth';

const Home = () => {

  const { doctor, setDoctor } = useAuth()
  const [name, setName] = useState('')
  const [city, setCity] = useState('')
  const [specialization, setSpecialization] = useState('')
  const [storeAccept, setStoreAccept] = useState([])
  const [hidden, setHidden] = useState(true)

// console.log(doctor);

const data = localStorage.getItem("doctorInfo")
const parseData = JSON.parse(data)


  const takeAccept = async (user) => {


    if (user) {

      try {
        // Fetch the existing appointments from Firestore
        const patientRef = doc(db, "patients", user);
        const patientDoc = await getDoc(patientRef);

        if (patientDoc.exists()) {
          const existingPatient = patientDoc.data().accept || [];
          setStoreAccept(existingPatient)



        } else {
          console.error("patient document does not exist.");
        }
      } catch (error) {
        console.error("Error updating appointments:", error);
      }

    } else {
      console.log("no data");

    }


  }

  useEffect(() => {
    const fetchData = async () => {
      const doctorRef = collection(db, "doctors");
      const doctorSnapshot = await getDocs(doctorRef);
      let doctorList = [];
      doctorSnapshot.forEach((doc) => {
        doctorList.push({ id: doc.id, ...doc.data() });
      });
      setDoctor(doctorList)
      // console.log(doctorList);

    }

    fetchData()


    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) {
        takeAccept(user.uid);

      } else {
        console.log("No user is signed in");
        // setPatientPersonalInfo(null);

      }


    })

    return () => unsubscribe();


  }, [])


  const handleDoctorSearch = async () => {


    const filteredDoctors = doctor.filter((val) => {

      if (val.doctorSignUpinfo) {
        return (
          (val.doctorSignUpinfo.name).includes(name.toLowerCase())
          && val.doctorSignUpinfo.city.toLowerCase().includes(city.toLowerCase())
          && val.doctorSignUpinfo.specialization.toLowerCase().includes(specialization.toLowerCase())
        )

      }
    });
    setDoctor(filteredDoctors);
    // console.log(filteredDoctors);


  }
  


  const handleNotification = () => {

    setHidden(!hidden)
  }



  return (
    <div className="px-6 py-12 bg-gray-100 min-h-screen">

    {/* Hero Section */}
    <section className="text-center bg-gradient-to-r from-blue-500 to-blue-700 text-white py-12 rounded-md mb-10">
      <h1 className="text-4xl font-semibold mb-4">Find a Doctor Nearby</h1>
      <p className="text-lg mb-6">Easily search for doctors by name, location, or specialization and book appointments.</p>
      
    </section>
  
    {/* Notification Section */}
    <div className="text-right text-[14px] absolute top-3 right-3">
      <div className="cursor-pointer">
        <p onClick={handleNotification} className="px-3">
          Notification
          <span className="bg-green-400 text-[14px] font-semibold px-[5px] py-[2px] rounded-full">
            {storeAccept.length}
          </span>
        </p>
        <ul hidden={hidden} className="h-[420px] mt-3 bg-[#f1f1f1] text-[12px] shadow-xl rounded-md p-4">
          {
            storeAccept.length > 0 ? (
              storeAccept.map((val, i) => {
                return <li key={i} className="mt-2 text-left">
                  <span>
                    ➡️ {val.doctorName} {val.doctorLastName} {val.accept} your appointment
                  </span>
                </li>
              })
            ) : (
              <p>No notifications</p>
            )
          }
        </ul>
      </div>
    </div>
  
    {/* Search Filters */}
    <div className="bg-white p-6 rounded-md shadow-lg mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="text-[13px] font-medium">
          <p className="pb-2">Doctor Name</p>
          <input
            type="text"
            placeholder="Search doctor by name"
            onChange={(e) => setName(e.target.value)}
            className="w-full text-[12px] p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <p className="pb-2 text-[13px] font-medium">Your Location</p>
          <input
            type="text"
            placeholder="Search doctor by city"
            onChange={(e) => setCity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md text-[13px]"
          />
        </div>
        <div>
          <p className="pb-2 text-[13px] font-medium">Doctor Specialization</p>
          <input
            type="text"
            placeholder="Search doctor by specialization"
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full text-[13px] p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="mt-4">
        <button onClick={handleDoctorSearch} className="w-full p-2 font-medium bg-blue-500 text-white rounded-md shadow-lg hover:bg-blue-600 transition duration-300">
          Search
        </button>
      </div>
    </div>
  
    {/* Doctors List */}
    <div className="mt-8">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {
          doctor && doctor.length > 0 ? (
            doctor.map((doc, i) => {
              return (
                <li key={i} className=" shadow-lg hover:scale-105 transform transition-all duration-300">
                  <Card
                    id={doc.id}
                    image={doc.doctorSignUpinfo.profilePicturePreview}
                    name={doc.doctorSignUpinfo.name}
                    city={doc.doctorSignUpinfo.city}
                    speciality={doc.doctorSignUpinfo.specialization}
                    experience={doc.doctorSignUpinfo.experience}
                    mobile={doc.doctorSignUpinfo.phone}
                    handleDoctor={handleDoctorSearch}
                  />
                </li>
              )
            })
          ) : (
            <p className="text-center text-gray-500">No doctor available</p>
          )
        }
      </ul>
    </div>
  </div>
  
  )
}

export default Home