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
  const [selectedDays, setSelectedDays] = useState("");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [timeSlots, setTimeSlots] = useState([])
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
            date: new Date().toLocaleDateString(),
            day: selectedDays.toString() || "N/A",
            time: selectedSlot || "N/A",
            reason: reason || "Reason",
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
            message: `hey you have a new appoinment by patient ${patientPersonalInfo?.name || "N/A"} ${new Date().toLocaleDateString()}`
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
            const update = [...prev, `Appointment scheduled with ${doctorData[0].doctorSignUpinfo.name} by patient ${patientPersonalInfo?.name || "N/A"} ${new Date().toLocaleDateString()}`]
            localStorage.setItem("AppoinmentMessage", JSON.stringify(update))
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
            date: new Date().toLocaleDateString(),
            day: selectedDays.toString() || "N/A",
            time: selectedSlot || "N/A",
            reason: reason || "Reason",
            doctorId: doctorId,
            patientId: user.uid,
            name: doctorData[0]?.doctorSignUpinfo.name || "N/A",
            city: doctorData[0].doctorSignUpinfo.city,
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

          console.log(appoinment);


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

  const [hidden, setHidden] = useState(true)

  const doctorInfo = doctorData[0]?.doctorSignUpinfo;

  if (!doctorInfo) {
    return <p className="text-red-500">No doctor information available.</p>;
  }

  const workingDays = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
    .filter((day) => doctorInfo?.workingDays?.[day])
    .map((day) => day.charAt(0).toUpperCase() + day.slice(1));


  function getWorkingHours(selectedDay) {
    selectedDay = selectedDay.toLowerCase(); // Ensure case consistency
    if (doctorInfo.workingDays[selectedDay]) {
      return doctorInfo.workingDays[selectedDay];
    } else {
      return "Invalid day selected!";
    }
  }


  const generateTimeSlots = (startTime, endTime) => {
    if (!startTime || !endTime) return [];

    const slots = [];
    let [startHour, startMinute, startPeriod] = startTime.split(/[: ]/);
    let [endHour, endMinute, endPeriod] = endTime.split(/[: ]/);

    // Convert to 24-hour format
    startHour = startPeriod === "PM" && startHour !== "12" ? +startHour + 12 : +startHour;
    endHour = endPeriod === "PM" && endHour !== "12" ? +endHour + 12 : +endHour;

    while (startHour < endHour || (startHour === endHour && startMinute < endMinute)) {
      const formattedTime = `${(startHour % 12 || 12).toString().padStart(2, "0")}:${startMinute
        .toString()
        .padStart(2, "0")} ${startHour >= 12 ? "PM" : "AM"}`;
      slots.push(formattedTime);

      startMinute += 30;
      if (startMinute >= 60) {
        startMinute = 0;
        startHour += 1;
      }
    }

    return slots;
  };

  const handleDaySelection = (day) => {
    // setSelectedDays(day)
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));

    } else {
      setSelectedDays([day]);
    }
    setHidden(!hidden)


    const workingHours = getWorkingHours(day);
    if (workingHours && workingHours.enabled) {
      const slots = generateTimeSlots(workingHours.startTime, workingHours.endTime);
      setTimeSlots(slots);
    } else {
      setTimeSlots([]); // No time slots if doctor isn't available
    }

  };


  useEffect(() => {
    console.log(timeSlots); // This will correctly log the updated state
  }, [timeSlots]);


  const dayOrder = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

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
              <span className="font-semibold">WorkingDays: </span>
              <p className="text-[15px]  text-gray-500 pb-2">
                {/* Working Days:{" "} */}
                {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
                  .filter((day) => doctorData[0].doctorSignUpinfo?.workingDays?.[day].enabled)
                  .map((day) => day.charAt(0).toUpperCase() + day.slice(1))
                  .join(", ")}
              </p>
              <span className="font-semibold">Timing: </span>
              <p className="text-[15px] text-gray-500 pb-2">
                {Object.entries(doctorData[0].doctorSignUpinfo?.workingDays)
                  .filter(([day, isWorking]) => isWorking.enabled)
                  .sort(([dayA], [dayB]) => dayOrder.indexOf(dayA) - dayOrder.indexOf(dayB)) // Sort by predefined order
                  .map(([day, info]) => (
                    <div key={day} className='mt-1'>
                      <span className='text-black font-medium'>
                        {day.charAt(0).toUpperCase() + day.slice(1)} :-
                      </span>
                      {info.startTime} - {info.endTime}
                    </div>
                  ))}
              </p>
              <span className="font-semibold">OffDays: </span>
              <p className="text-sm text-gray-500">
                {/* Off Days:{" "} */}
                {Object.entries(doctorData[0].doctorSignUpinfo?.workingDays)
                  .filter(([day, isWorking]) => !isWorking.enabled)
                  .map(([day]) => (
                    <div>{day.charAt(0).toUpperCase() + day.slice(1)}</div>
                  ))
                }
              </p>
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




      {/* <div
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
      </div> */}
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-700 mb-2">Select Appointment Days</h3>
        <div className="grid grid-cols-3 gap-4">
          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]
            .filter((day) => doctorData[0].doctorSignUpinfo?.workingDays?.[day].enabled)
            .map((day) => (
              <button
                key={day}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedDays.includes(day)
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                onClick={() => handleDaySelection(day)}
              >
                {day}
              </button>
            ))
          }





        </div>
        <div className="mt-4">
          <h4 className="text-gray-700 font-medium">Selected Days:</h4>
          <p className="text-gray-500">
            {selectedDays || "No days selected."}
          </p>
        </div>
      </div>

      {/* time slot */}
      <div
        hidden={hidden}
        className="p-6 bg-white rounded-md shadow-md max-w-[1000px] mx-auto ">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Select a Time Slot
        </h2>
        {/* <p className="text-[15px] text-gray-500">
          <span className="font-medium">Start Time: </span>
          {doctorInfo?.workStartTime || "Not specified"} AM
        </p>
        <p className="text-[15px] mt-1 text-gray-500">
          <span className="font-medium">End Time: </span>
          {doctorInfo?.workEndTime || "Not specified"} PM
        </p> */}
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Available Time Slots
          </h3>
          <div className="grid  grid-cols-3 sm:grid-cols-5 gap-4">
            {timeSlots.length > 0 ? (
              timeSlots.map((slot) => (

                <button
                  key={slot}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedSlot === slot
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  onClick={() => setSelectedSlot(slot)}
                >
                  {slot}{console.log(slot)
                  }
                </button>
              ))
            ) : (
              <p>No time slots is available</p>
            )}
          </div>
          <div className="mt-4">
            <h4 className="text-gray-700 font-medium">Selected Time Slot:</h4>
            <p className="text-gray-500">
              {selectedSlot || "No time slot selected."}
            </p>
          </div>
        </div>
      </div>

      <div className=" bg-gray-50 flex  justify-center">
        <div className="p-6 bg-white rounded-lg shadow-md max-w-md w-full">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Select Appointment Reason
          </h2>
          <div className="mb-6">
            <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
              Reason for Appointment
            </label>
            <select
              id="reason"
              name="reason"
              onChange={(e) => setReason(e.target.value)}
              className="block w-full px-4 py-3 text-sm rounded-lg border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="" disabled>
                -- Select a reason --
              </option>
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="routine-checkup">Routine Checkup</option>
              <option value="dental-cleaning">Dental Cleaning</option>
              <option value="emergency">Emergency</option>
              <option value="other">Other</option>
            </select>
          </div>

        </div>
      </div>


      <button
        onClick={handleSlot}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg shadow-md transition-all"
      >
        Submit
      </button>


    </div >
  )
}

export default DoctorDetail