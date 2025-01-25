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
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 min-h-screen">

    {/* Appointment Section Title */}
    <p className="text-center text-3xl font-semibold py-6 text-gray-800">My Appointments</p>
  
    {/* Appointment List */}
    <div className="px-10">
      <ul className="space-y-6">
        {data?.length > 0 ? (
          data.map((val, i) => (
            <li key={i} className="bg-white p-6 rounded-lg shadow-xl border border-gray-200 hover:shadow-2xl transition-all duration-300 transform ">
              {/* Header Section */}
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-semibold text-gray-900 flex items-center">
                  <span className="mr-2 text-blue-600">
                    <i className="fas fa-user-md"></i> {/* Icon for doctor */}
                  </span>
                  {val.name} {val.lastName}
                </div>
                <div className="text-sm text-gray-500 flex items-center">
                  <i className="fas fa-calendar-alt mr-2"></i> {val.day}, {val.time}
                </div>
              </div>
  
              {/* Appointment Details */}
              <p className="text-sm text-gray-700 mb-2">
                <strong>Specialization:</strong> {val.specialization}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Qualifications:</strong> {val.qualifications}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Experience:</strong> {val.experience} years
              </p>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Consultation Fee:</strong> ₹{val.consultationFee}
              </p>
              <p className="text-sm text-gray-700 mb-4">
                <strong>Clinic Address:</strong> {val.clinicAddress}, {val.city}, {val.state}
              </p>
  
              {/* Action Section (Cancel Button) */}
              <div className="mt-4 text-right">
                <button 
                  onClick={() => handleDeleteAppointment(i)}
                  className="bg-red-500 text-white font-medium py-2 px-6 rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition duration-200">
                  Cancel Appointment
                </button>
              </div>
            </li>
          ))
        ) : (
          <div className="text-center text-gray-500">No appointment available</div>
        )}
      </ul>
    </div>
  
  </div>
  
  )
}

export default PatientAppoinment