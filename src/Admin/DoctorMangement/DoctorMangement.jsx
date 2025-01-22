import React, { useState } from 'react'
import { auth, db } from '../../Firebase-Config'
import { deleteUser } from 'firebase/auth'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'


const DoctorMangement = () => {


  const [parseData, setParseData] = useState(() => {
    const data = localStorage.getItem("doctorInfo")
    return data ? JSON.parse(data) : []
  })


  const handleDelete = async (uid, index) => {
    console.log(index);


    try {

      const doctorRef = doc(db, "doctors", uid)
      const doctorDoc = await getDoc(doctorRef)

      if (doctorDoc.exists()) {
        await deleteDoc(doctorRef)
      }


    } catch (error) {
      console.log(error);

    }

    setParseData((prevData) => {
      const updatedData = prevData.filter((_, i) => i !== index);
      localStorage.setItem("doctorInfo", JSON.stringify(updatedData)); // Update localStorage immediately
      return updatedData;
    });





  }

  // localStorage.clear()

  return (
    <div className="bg-gray-100 min-h-screen flex  justify-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctors List</h1>
        <ul className="space-y-4">
          {parseData.length > 0 ? (
            parseData.map((val, i) => (
              <li
                key={i}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start space-x-4 sm:items-center">
                  <img
                    src={val.profilePicturePreview || '/default-profile.png'}
                    alt={`${val.name}'s profile`}
                    className="w-16 h-16 rounded-full border border-gray-300"
                  />
                  <div>
                    <p className="text-xl font-bold text-gray-800">{val.name}</p>
                    <p className="text-sm text-gray-500">Specialization: {val.specialization}</p>
                    <p className="text-sm text-gray-500">Qualifications: {val.qualifications}</p>
                    <p className="text-sm text-gray-500">Experience: {val.experience} years</p>
                    <p className="text-sm text-gray-500">Fee: ₹{val.fee}</p>
                    <p className="text-sm text-gray-500">
                      Working Days:{" "}
                      {Object.entries(val.workingDays)
                        .filter(([day, isWorking]) => isWorking)
                        .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
                        .join(", ")}
                    </p>
                    <p className="text-sm text-gray-500">Start Time: {val.workStartTime} AM</p>
                    <p className="text-sm text-gray-500">End Time: {val.workEndTime} PM</p>
                    <p className="text-sm text-gray-500">
                      Off Day: {new Date(val.timeOff).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <p className={`text-sm font-medium ${val.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                      Status: {val.status}
                    </p>
                  </div>
                </div>
                <div className="mt-4 sm:mt-0 flex items-center space-x-3">
                  <a
                    href={`mailto:${val.email}`}
                    className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-300"
                  >
                    Email
                  </a>
                  <a
                    href={`tel:${val.phone}`}
                    className="bg-green-500 text-white text-sm px-4 py-2 rounded-md hover:bg-green-600 transition-colors duration-300"
                  >
                    Call
                  </a>
                  <button
                    className="bg-yellow-500 text-white text-sm px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors duration-300"
                    onClick={() => handleEdit(val.uid)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600 transition-colors duration-300"
                    onClick={() => handleDelete(val.uid, i)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))
          ) : (
            <p className="text-center text-gray-600">No doctor is added</p>
          )}
        </ul>
      </div>
    </div>
  )
}

export default DoctorMangement