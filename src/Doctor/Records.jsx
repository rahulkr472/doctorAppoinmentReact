import React, { useState } from 'react'
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../Firebase-Config';
import { useAuth } from '../Auth/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase-Config';

const Records = () => {

  const [data, setData] = useState([])
   const {accept, setAccept} = useAuth()

  console.log(accept.length);
  

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) {
        fetchData(user.uid);

      } else {
        console.log("No user is signed in");
        // setPatientPersonalInfo(null);

      }
    })

    return () => unsubscribe();
  }, [])



  // console.log(data);
  const fetchData = async (user) => {


    if (user) {

      try {
        const patientRef = doc(db, "doctors", user);
        const patientDoc = await getDoc(patientRef)

        if (patientDoc.exists()) {
          const data = patientDoc.data()
          setData(data.appoinment)
          // console.log(data.appoinment);

        } else {
          console.log("no data");

        }


      } catch (error) {
        console.log(error);

      }
    }

  }

  const patientRecordString = localStorage.getItem("patientRecord");

  // Parse the string into a JavaScript object or array
  const patientRecord = patientRecordString ? JSON.parse(patientRecordString) : [];
  // console.log(patientRecord);




  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 py-5 text-center">Patient Record</h1>
      <ul className="space-y-4 px-10">
        {

           patientRecord.length > 0 ? (
            patientRecord.map((val, i) => {
              // console.log(val);
  
              return (
                <li key={i} className="bg-white shadow-md rounded-lg p-4 border border-gray-200">
                  <div className="flex flex-col space-y-2">
                    <h3 className="text-xl font-semibold text-gray-800">{val.name}</h3>
                   <div className='grid grid-cols-2 sm:grid-cols-5 gap-5'>
                   
                      <div>
                        <p className="text-sm font-medium text-gray-600">Age:</p>
                        <p className="text-sm text-gray-800">{val.age}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Gender:</p>
                        <p className="text-sm text-gray-800">{val.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Phone:</p>
                        <p className="text-sm text-gray-800">{val.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Address:</p>
                        <p className="text-sm text-gray-800">{val.address}</p>
                      </div>          
                      <div>
                        <p className="text-sm font-medium text-gray-600">Allergies:</p>
                        <p className="text-sm text-gray-800">{val.allergies}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-600">Chronic Conditions:</p>
                        <p className="text-sm text-gray-800">{val.chronic}</p>
                      </div>
                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-600">Current Medication:</p>
                        <p className="text-sm text-gray-800">{val.medication}</p>
                      </div>
  
                      {val.otherInfo && (
                        <div>
                          <p className="text-sm font-medium text-gray-600">Additional Information:</p>
                          <p className="text-sm text-gray-800">{val.otherInfo}</p>
                        </div>
                      )}
                
                   </div>
  
                  </div>
                </li>
              );
            })
           ):(
            <p>No Patient Detail </p>
           )

         
        }
      </ul>

    </div>
  )
}

export default Records