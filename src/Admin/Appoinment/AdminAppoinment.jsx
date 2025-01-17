import React from 'react'

const AdminAppoinment = () => {

    const data = localStorage.getItem("appoinment")
    const appoinment = JSON.parse(data)


    // console.log(appoinment);
    

  return (
    <div className="bg-gradient-to-r from-blue-50 to-gray-50 min-h-screen p-6">
    <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">Appointments</h1>
    <div className="container mx-auto">
      <ul className="space-y-8">
        {appoinment?.length > 0 ? (
          appoinment.map((val, i) => (
            <li
              key={i}
              className="bg-white shadow-lg rounded-lg p-8 border border-gray-200 "
            >
              {/* Time, Day, and Reason Section */}
              <div className="border-b border-gray-300 pb-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Appointment Schedule</h2>
                <p className="text-gray-600">
                  <span className="font-bold">Time:</span> {val.time}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Day:</span> {val.day}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Reason:</span> {val.reason}
                </p>
              </div>
  
              {/* Patient Details Section */}
              <div className="border-b border-gray-300 pb-4 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Patient Details</h2>
                <p className="text-gray-600">
                  <span className="font-bold">Name:</span> {val.name}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Age:</span> {val.age}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Gender:</span> {val.gender}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Phone:</span> {val.phone}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Address:</span> {val.address}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Other Info:</span> {val.otherInfo}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Allergies:</span> {val.allergies}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Chronic Conditions:</span> {val.chronic}
                </p>
                <p className="text-gray-600">
                  <span className="font-bold">Medication:</span> {val.medication}
                </p>
              </div>
  
              {/* Doctor Details Section */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">Doctor Details</h2>
                <p className="text-gray-600">
                  <span className="font-bold">Name:</span> {val.doctorName}
                </p>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No appointments found.</p>
        )}
      </ul>
    </div>
  </div>
  
  )
}

export default AdminAppoinment