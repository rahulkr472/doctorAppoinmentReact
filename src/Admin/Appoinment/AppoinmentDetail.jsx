import React, { useState } from 'react';
import { FaCalendarAlt, FaUserMd, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';


const AppoinmentDetail = () => {
  const [data, setData] = useState(() => {
    const data = localStorage.getItem('appoinmentDetail');
    return data ? JSON.parse(data) : {};
  });

  console.log(data);

  return (
    <div className="bg-gradient-to-tr from-pink-100 via-blue-100 to-purple-100 min-h-screen flex justify-center items-center">
    <div className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        Appointment Details
      </h1>
      {Object.keys(data).length > 0 ? (
        <div className="bg-gradient-to-tr from-blue-50 via-white to-blue-100 border border-blue-300 rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <p className="text-2xl font-bold text-blue-700">
                Appointment for <span className="text-gray-800">{data.name}</span>
              </p>
              <p className="text-lg text-gray-600">
                {data.gender}, {data.age} years
              </p>
            </div>
            <div className="text-right sm:text-left text-gray-500">
              <p className="flex items-center gap-2">
                <FaCalendarAlt className="text-blue-500" />
                <strong>BookingDate</strong>
                {data.date} 
              </p>
              <p>
                <strong>Appoinment Day: </strong> {data.day}
              </p>
              <p>
                <strong>AppoinmentTime:</strong> {data.time}
              </p>
            </div>
          </div>

          {/* Details Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-700">
                <FaUserMd className="text-green-500" />
                <strong>Doctor:</strong> {data.doctorName}
              </p>
              <p>
                <strong>Reason:</strong> {data.reason}
              </p>
              {/* <p>
                <strong>Message:</strong> {data.message}
              </p> */}
              <p className="flex items-center gap-2 text-gray-700">
                <FaMapMarkerAlt className="text-red-500" />
                <strong>Address:</strong> {data.address}
              </p>
            </div>
            <div className="space-y-3">
              <p className="flex items-center gap-2 text-gray-700">
                <FaPhone className="text-blue-500" />
                <strong>Phone:</strong> {data.phone}
              </p>
              <p>
                <strong>Chronic Conditions:</strong> {data.chronic}
              </p>
              <p>
                <strong>Allergies:</strong> {data.allergies}
              </p>
              <p>
                <strong>Medication:</strong> {data.medication}
              </p>
            </div>
          </div>

          {/* Footer Section */}
          {/* <div className="mt-6 border-t pt-4 text-gray-600">
            <p>
              <strong>Patient ID:</strong> {data.patientId}
            </p>
            <p>
              <strong>Doctor ID:</strong> {data.doctorId}
            </p>
          </div> */}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          No appointment details found.
        </p>
      )}
    </div>
  </div>
  );
};

export default AppoinmentDetail;
