import React, { useState } from 'react'
import { auth, db } from '../../Firebase-Config'
import { deleteUser } from 'firebase/auth'
import { deleteDoc, doc, getDoc } from 'firebase/firestore'


const DoctorMangement = () => {


  const [parseData, setParseData] = useState(() => {
    const data = localStorage.getItem("doctorInfo")
    return data ? JSON.parse(data) : []
  })

  const [searchQuery, setSearchQuery] = useState("");

  // Filter doctors based on the search query
  const filteredDoctors = parseData.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );



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
    <div className="bg-gray-100 min-h-screen flex justify-center">
    <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Doctors List</h1>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for a doctor..."
          className="w-full px-4 py-2 rounded-md border border-gray-300 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Doctors List */}
      <ul className="space-y-4">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((val, i) => (
            <li
              key={i}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-start space-x-4 sm:items-center">
                <img
                  src={val.profilePicturePreview || "/default-profile.png"}
                  alt={`${val.name}'s profile`}
                  className="w-16 h-16 rounded-full border border-gray-300"
                />
                <div>
                  <p className="text-xl font-bold text-gray-800">{val.name}</p>
                  <p className="text-sm text-gray-500">Specialization: {val.specialization}</p>
                  <p className="text-sm text-gray-500">Qualifications: {val.qualifications}</p>
                  <p className="text-sm text-gray-500">Experience: {val.experience} years</p>
                  <p className="text-sm text-gray-500">Fee: ₹{val.fee}</p>
                  <span className="font-semibold">workingDays: </span>
                  <p className="text-sm text-gray-500">
                    {/* Working Days:{" "} */}
                    {Object.entries(val.workingDays)
                      .filter(([day, isWorking]) => isWorking.enabled)
                      .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
                      .join(", ")}
                  </p>
                  <span className="font-semibold">Timing: </span>
                  <p className="text-sm text-gray-500">
                   
                    {Object.entries(val.workingDays)
                      .filter(([day, isWorking]) => isWorking.enabled)
                      .map(([day, info]) => (
                        <div key={day}>
                          <span className='text-black font-medium'>{day.charAt(0).toUpperCase() + day.slice(1)}  :-</span> {info.startTime} - {info.endTime}
                        </div>
                      ))
                    }
                  </p>
                  
                  <span className="font-semibold">OffDays: </span>
                  <p className="text-sm text-gray-500">
                    {/* Off Days:{" "} */}
                    {Object.entries(val.workingDays)
                      .filter(([day, isWorking]) => !isWorking.enabled)
                      .map(([day]) => day.charAt(0).toUpperCase() + day.slice(1))
                      .join(", ")}
                  </p>
                  <p
                    className={`text-sm font-medium ${
                      val.status === "active" ? "text-green-500" : "text-red-500"
                    }`}
                  >
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
          <p className="text-center text-gray-600">No doctor found</p>
        )}
      </ul>
    </div>
  </div>
  )
}

export default DoctorMangement