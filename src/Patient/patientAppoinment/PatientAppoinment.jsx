import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Auth/AuthContext'
import { auth, db } from '../../Firebase-Config'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore'

const PatientAppoinment = () => {

  const [data, setData] = useState([])
  // const [deleteItem, setDeleteItem] = useState([])


  const appoinmentCollectionref = collection(db, "patients")

  const fetchAppoinment = async (user) => {
    
    try {
      const appoinmentRef = await getDoc(doc(appoinmentCollectionref, user))
      // console.log(appoinmentRef);
      
      if (appoinmentRef.exists()) {
        const userData = appoinmentRef.data();
        setData(userData.appoinment)
        

      } else {
        console.log("User not found");
      }


    } catch (error) {
      console.log("broo", error);

    }
    

  }

  


  useEffect(() => {

    const subscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchAppoinment(user.uid)
        
      } else {
        setLoading(false);
      }
    });


    return () => subscribe();
  }, [])

  // const handleDeleteAppoinment = async(index) => {

  //   const user = auth.currentUser


  //   try {
  //     // Reference to the user's appointment document
  //     const appointmentRef = doc(appoinmentCollectionref, user.uid);
  
  //     // Get the document data
  //     const appointmentSnapshot = await getDoc(appointmentRef);
  
  //     if (appointmentSnapshot.exists()) {
  //       const userData = appointmentSnapshot.data();
  //       // console.log(userData.appoinment);

  //       const filterData = userData.appoinment.filter((_, i) => i !== index)

  //       console.log(filterData);
        

  //       if (filterData.length === 0) {
  //         // console.log("No appointments left.");
  //     } 
  //         await updateDoc(appointmentRef, { appoinment: filterData });

  //     } else {
  //       console.error("No document found for the current user.");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting appointment: ", error);
  //   }



  //  const doctorCollectionRef = collection(db, "doctors")
   
  //  const filter = data.filter((_,i) => i === index)
  // //  console.log(filter[0].doctorId);
  // //  console.log(data);
   
  //  const doctorId = filter[0].doctorId
  //  console.log(doctorId);
   
   
   

  //   try {
  //     const doctorRef = doc(doctorCollectionRef, doctorId);
  
  //     // console.log(doctorRef);
      
  //     // Get the document data
  //     const doctorSnapshot = await getDoc(doctorRef);
  //     console.log(doctorSnapshot);
      
  //     const data = doctorSnapshot.data()
  //     console.log(data);
      

  //     const filterData = data.appoinment.filter((_,i) =>  i !== index)

  //     console.log(filterData);
      


  //       await updateDoc(doctorRef, { appoinment: filterData });
      
      
  //   } catch (error) {
  //     console.log(error);
      
  //   }

        
  //  setData(data.filter((_, i) => {
  //   return i !== index
  //  }))

    
  // }



  return (
    <div className='bg-gray-50'>
      <p className='text-center text-2xl font-medium pt-5'>My appoiment</p>
      <div className=''>
        <ul className="space-y-4  px-10 py-10  rounded-md shadow-md">
          { data?.length > 0 ? (
            data.map((val, i) => (
              <li
                key={i}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-lg font-semibold text-gray-800">
                    {val.name} {val.lastName}
                  </div>
                  <div className="text-sm text-gray-500">{val.day}, {val.time}</div>
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Specialization:</strong> {val.specialization}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Qualifications:</strong> {val.qualifications}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Experience:</strong> {val.experience} years
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Consultation Fee:</strong> ₹{val.consultationFee}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Clinic Address:</strong> {val.clinicAddress}, {val.city}, {val.state}
                </p>
                {/* <div className='mt-2 text-right'>
                  <button 
                  onClick={() => handleDeleteAppoinment(i)}
                  className="bg-red-500 text-[12px] text-white font-medium py-2 px-4 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-200">
                    Cancel Appointment
                  </button>
                </div> */}
  
              </li>
  
            ))
          ) : (
            <div>No appoinment available</div>
          ) 
        }
        </ul>

      </div>

    </div>
  )
}

export default PatientAppoinment