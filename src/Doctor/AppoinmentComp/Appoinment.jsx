import { collection, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { auth, db } from '../../Firebase-Config'
import { doc } from 'firebase/firestore'
import { useAuth } from '../../Auth/AuthContext'
import { onAuthStateChanged } from 'firebase/auth'
import { updateDoc } from 'firebase/firestore'

const Appoinment = () => {


  const [data, setData] = useState([])
  const { accept, setAccept } = useAuth()
  const [reject, setReject] = useState([])
  const [hiddenAccept, setHiddenAccept] = useState(() => {
    const hiddenState = localStorage.getItem("hiddenState");
    return hiddenState ? JSON.parse(hiddenState) : {}
    
  })
  const [hiddenReject, setHiddenReject] = useState(() => {
    const hiddenState = localStorage.getItem("hiddenRejectState");
    return hiddenState ? JSON.parse(hiddenState) : {}
  })


  const [searchPatient, setSearchPatient] = useState("");
  const [searchReason, setSearchReason] = useState("");
  const [searchDays, setSearchDays] = useState("");
  // const [acceptDetail, setAcceptDetail] = useState([])

  // const [doctorDetailInfo, setDoctorDetailInfo] = useState()

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

        } else {
          console.log("no data");

        }


      } catch (error) {
        console.log(error);

      }
    }
  }


 
  


  //handle accept
  const handleAccept = async(val, index) => {

   setAccept([...accept, val])

    localStorage.setItem("patientRecord", JSON.stringify([...accept, val]))

 //store doctor deta



  const patientId = val.patientId

  
  
    if (patientId) {
  
        try {
          // Fetch the existing appointments from Firestore
          const patientRef = doc(db, "patients", patientId);
          const patientDoc = await getDoc(patientRef);
          console.log(patientDoc);

          const date = new Date()
          console.log(date);
          

          if (patientDoc.exists()) {
            const existingAppointments = patientDoc.data().accept || [];
            // Add the new appointment to the array
            const Accepted = {
            accept: "Accepted",
            doctorName: val.doctorName,
            patientId: patientId
            };
  
            // Update Firestore with the new array
            await updateDoc(patientRef, {
              accept: [...existingAppointments, Accepted],
            })
  

            alert("accepted successfully");
          } else {
            console.error("patient document does not exist.");
          }
        } catch (error) {
          console.error("Error updating appointments:", error);
        }
  
      } else {
        console.log("no data");
  
      }

    // Update hidden states

    const updateHidden = {
      ...hiddenAccept,
      [index]: !hiddenAccept[index],
      
    }

    setHiddenAccept(updateHidden);

    localStorage.setItem("hiddenState", JSON.stringify(updateHidden))

  }

  const handleReject = async(val) => {

    console.log();

    const patientId = val.patientId

  
  
    if (patientId) {
  
        try {
          // Fetch the existing appointments from Firestore
          const patientRef = doc(db, "patients", patientId);
          const patientDoc = await getDoc(patientRef);

          if (patientDoc.exists()) {
            const existingAppointments = patientDoc.data().accept || [];
            // Add the new appointment to the array
            const Rejected = {
            accept: "Rejected",
            doctorName: val.doctorName ,
            doctorLastName: val.doctorLastName,
            patientId: patientId
            };
  
            // Update Firestore with the new array
            await updateDoc(patientRef, {
              accept: [...existingAppointments, Rejected],
            })
  

            alert("rejected successfully");
          } else {
            console.error("patient document does not exist.");
          }
        } catch (error) {
          console.error("Error updating appointments:", error);
        }
  
      } else {
        console.log("no data");
  
      }
    

    const updateHidden = {
      ...hiddenReject,
      [val.patientId]: !hiddenReject[val.patientId]
    }

    setHiddenReject(updateHidden);
    localStorage.setItem("hiddenRejectState", JSON.stringify(updateHidden))

  }


const  filterData = data.filter((val) => {
      
  return (
    val.name.toLowerCase().includes(searchPatient.toLowerCase()) &&
    val.reason.toLowerCase().includes(searchReason.toLowerCase()) &&
    val.day.toLowerCase().includes(searchDays.toLowerCase())
  );


  })
console.log(filterData);




  return (
    <div className='bg-gray-50'>
      <h1 className='text-2xl text-center py-5 font-semibold text-[#6b6b6b]'>
        Appoinment  
      </h1>

      <div className='flex flex-wrap gap-3 justify-center space-x-4 text-center py-5'> 
      <input
                type="text"
                placeholder="Search patient by name"
                value={searchPatient}
                onChange={(e) => setSearchPatient(e.target.value)}
                className="text-center md:px-10  p-2 border rounded-lg shadow-md"
      />
      <input
                type="text"
                placeholder="Search patient by Reason"
                value={searchReason}
                onChange={(e) => setSearchReason(e.target.value)}
                className="text-center md:px-10  p-2 border rounded-lg shadow-md"
      />
      <input
                type="text"
                placeholder="Search patient by days"
                value={searchDays}
                onChange={(e) => setSearchDays(e.target.value)}
                className="text-center md:px-10  p-2 border rounded-lg shadow-md"
      />

      </div>
      
      <div className="p-4 max-w-[80%] mx-auto bg-white rounded-xl shadow-md space-y-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Patient Requests</h2>
        </div>
        <ul>
          { filterData ? (
              filterData.map((val, i) => {
                // console.log(val);
                return <li key={i}>
                  <div className="space-y-2 bg-gray-100">
                    <div className="p-4  rounded-lg flex justify-between items-center">
                      <div>
                        <p className="text-lg font-medium">{val.name}</p>
                        <p className="text-sm text-gray-600">Day: {val.day}</p>
                        <p className="text-sm text-gray-600">Time: {val.time}</p>
                        <p className="text-sm text-gray-600">Reason: {val.reason}</p>
                      </div>
                      <div className="space-x-2">
                        <button
                          onClick={() => handleAccept(val, i)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-700">
                          Accept
                        </button>
                        <button
                          onClick={() => handleReject(val)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-700">Reject</button>
                      </div>
  
  
                    </div>
                    {hiddenAccept[i] !== undefined && hiddenAccept[i] && (
                      <p className="text-[12px] text-green-500 text-right p-3">
                        Accept ✔️
                      </p>
                    )}
                    {hiddenReject[val.patientId] !== undefined && hiddenReject[val.patientId] && (
                      <p className="text-[12px] text-red-500 text-right p-3">
                        Reject ❌
                      </p>
                    )}
                  </div>
                </li>
  
              })
          ):(
            <p>NO appoinment </p>
          )
          
          }
        </ul>

      </div>
    </div>
  )
}

export default Appoinment