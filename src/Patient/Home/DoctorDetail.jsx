import React, { useState } from 'react'
import { useAuth } from '../../Auth/AuthContext'
import { auth } from '../../Firebase-Config'
import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../Firebase-Config'
import { collection } from 'firebase/firestore'
import { updateDoc } from 'firebase/firestore'
import { useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { parse, stringify } from 'postcss'

const DoctorDetail = () => {


  const doctorData = JSON.parse(localStorage.getItem("doctor"))
  const [day, setDay] = React.useState('')
  const [time, setTime] = React.useState('')
  const [reason, setReason] = useState("")
  const { patientPersonalInfo, setPatientPersonalInfo } = useAuth();
  const { patientMedicalInfo, setPatientMedicalInfo } = useAuth();


  const [appoinment, setAppoinment] = useState(() => {
    const data = localStorage.getItem("appoinment")
   return data ? JSON.parse(data) : []
  })

  const [appoimentMessage, setAppoinmentMessage] = useState(() => {
    const data = localStorage.getItem("AppoinmentMessage")
    return data ? JSON.parse(data) : []
  })

  const [doctorMessage, setDoctorMessage] = useState(() => {
    const data = localStorage.getItem("doctorMessage")
    return data ? JSON.parse(data) : []
  })
  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (user) => {

      if (user) {
        fetchPersonalInfo(user.uid);

      } else {
        console.log("No user is signed in");
        setPatientPersonalInfo(null);

      }
    })

    return () => unsubscribe();




  }, [])


  const fetchPersonalInfo = async (uid) => {

    try {
      const snapshot = await getDoc(doc(db, 'patients', uid));
      if (snapshot.exists()) {
        const userData = snapshot.data();
        setPatientPersonalInfo(userData.personalInfo);
        setPatientMedicalInfo(userData.medicalInfo)
        // console.log(userData);

      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };


  const handleSlot = async () => {

    const doctorId = doctorData[0].id
    const user = auth.currentUser;
    console.log(doctorId);
    // console.log(day);
    // console.log(time);

    if (doctorId) {

      try {
        // Fetch the existing appointments from Firestore
        const doctorRef = doc(db, "doctors", doctorId);
        const doctorDoc = await getDoc(doctorRef);




        if (doctorDoc.exists()) {
          const existingAppointments = doctorDoc.data().appoinment || [];
          // Add the new appointment to the array
          const newAppointment = {
            day: day || "N/A",
            time: time || "N/A",
            reason: reason || "Reason" ,
            doctorId: doctorId,
            patientId: user.uid,
            doctorName: doctorData[0]?.doctorSignUpinfo.name || "N/A",
            name: patientPersonalInfo?.name || "N/A",
            age: patientPersonalInfo?.age || "N/A",
            gender: patientPersonalInfo?.gender || "N/A",
            address: patientPersonalInfo?.address || "N/A",
            phone: patientPersonalInfo?.phone || "N/A",
            allergies: patientMedicalInfo?.allergies || "N/A",
            chronic: patientMedicalInfo?.chronicConditions || "N/A",
            medication: patientMedicalInfo?.medications || "N/A",
            otherInfo: patientMedicalInfo?.otherInfo || "N/A",
          };

          // Update Firestore with the new array
          await updateDoc(doctorRef, {
            appoinment: [...existingAppointments, newAppointment],
          });

           setAppoinment((prev) => {
            const update = [...prev, newAppointment]
            localStorage.setItem("appoinment", JSON.stringify(update))
            return update
           })

           setAppoinmentMessage((prev) => {
            const update = [...prev, `Appointment scheduled with ${doctorData[0].doctorSignUpinfo.name} by patient ${patientPersonalInfo?.name || "N/A"}`]
            localStorage.setItem("AppoinmentMessage", JSON.stringify(update))
            return update
           })
           setDoctorMessage((prev) => {
            const update = [...prev, `hey you have a new appoinment with ${patientPersonalInfo?.name || "N/A"}`]
            localStorage.setItem("doctorMessage", JSON.stringify(update))
            return update
           })


           


          alert("Medical Info submitted successfully");
        } else {
          console.error("Doctor document does not exist.");
        }
      } catch (error) {
        console.error("Error updating appointments:", error);
      }

    } else {
      console.log("no data");

    }

    

    if (user) {

      try {
        // Fetch the existing appointments from Firestore
        const patientRef = doc(db, "patients", user.uid);
        const patientDoc = await getDoc(patientRef);
        //  console.log(patientDoc);

        if (patientDoc.exists()) {
          const existingAppointments = patientDoc.data().appoinment || [];
          // Add the new appointment to the array
          const newAppointment = {
            day: day || "Day",
            time: time || "Time",
            reason: reason || "Reason" ,
            doctorId: doctorId,
            patientId: user.uid,
            name: doctorData[0]?.doctorSignUpinfo.name || "N/A",
            city: doctorData[0].doctorSignUpinfo.city ,
            mobile: doctorData[0].doctorSignUpinfo.phone,
            state: doctorData[0].doctorSignUpinfo.state,
            clinicAddress: doctorData[0].doctorSignUpinfo.address,
            consultationFee: doctorData[0].doctorSignUpinfo.fee,
            experience: doctorData[0].doctorSignUpinfo.experience,
            qualifications: doctorData[0].doctorSignUpinfo.qualifications,
            specialization: doctorData[0].doctorSignUpinfo.specialization
          };

          // Update Firestore with the new array
          await updateDoc(patientRef, {
            appoinment: [...existingAppointments, newAppointment],
          });

          alert("Medical Info submitted successfully");
        } else {
          console.error("Doctor document does not exist.");
        }
      } catch (error) {
        console.error("Error updating appointments:", error);
      }

    } else {
      console.log("no data");

    }


    

  }

  // console.log(reason);
  

  return (
    <div className="p-6 bg-white rounded-lg">


      <div className='rounded-md shadow-lg border-gray-200 pb-4 mb-4 bg-[#f9f9f9]'>
        <h1 className="text-2xl font-bold mb-4 text-center">Doctor Detail</h1>

        <div className='flex justify-between px-4 items-center'>
          <div>
            <div className="mb-2">
              <span className="font-semibold">Name: </span>
              <span>{doctorData[0].doctorSignUpinfo.name}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Qualification: </span>
              <span>{doctorData[0].doctorSignUpinfo.qualifications}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Specialization: </span>
              <span>{doctorData[0].doctorSignUpinfo.specialization}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Experience: </span>
              <span>{doctorData[0].doctorSignUpinfo.experience} years of Experience</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Consultation Fee: </span>
              <span>₹{doctorData[0].doctorSignUpinfo.fee}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Mobile: </span>
              <span>{doctorData[0].doctorSignUpinfo.phone}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Clinic Address: </span>
              <span>{doctorData[0].doctorSignUpinfo.address}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">City: </span>
              <span>{doctorData[0].doctorSignUpinfo.city}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Timing: </span>
              <span>{doctorData[0].doctorSignUpinfo.schedule}</span>
            </div>
          </div>

          <div>

            {
              doctorData[0].doctorSignUpinfo.profilePicturePreview ? (
                <img src={doctorData[0].doctorSignUpinfo.profilePicturePreview} alt="Doctor" className="w-40 h-40 rounded-full mx-auto" />
              ) : (
                <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Doctor" className="w-40 h-40 rounded-full mx-auto" />
              )
            }


          </div>
        </div>

      </div>


      <div
        className='mt-3 shadow-md rounded-md p-4 bg-blue-300'>

        <div className='flex  space-x-4  items-center'>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Day</label>
            <input
              type="date"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setDay(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input
              type="time"
              className="mt-1 block w-[1-0%] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Reason</label>
            <select
              className="mt-1  px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">Select a reason</option>
              <option value="Consultation">Consultation</option>
              <option value="Follow-up">Follow-up</option>
              <option value="Emergency">Emergency</option>
              <option value="Check-up">Check-up</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>



        <button
          onClick={handleSlot}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Book Appointment
        </button>
      </div>




    </div>
  )
}

export default DoctorDetail