import React, { useState } from 'react'
import DatePicker from 'react-datepicker';

const AdminAppoinment = () => {

  const [appoinment, setAppoinment] = useState(() => {
    const data = localStorage.getItem("appoinment")
    return data ? JSON.parse(data) : []
  })


  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Filter appointments based on selected date range
  const filteredAppointments = appoinment.filter((appointment) => {
    if (!startDate || !endDate) return true; // If no date range, show all
    const appointmentDate = new Date(appointment.date);
    return appointmentDate >= startDate && appointmentDate <= endDate;
  });


  


  return  (
    <div className="bg-gradient-to-r from-blue-50 to-gray-50 min-h-screen p-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-10">
        Appointments
      </h1>

      <div className="container mx-auto">
        {/* Date Range Picker */}
        <div className="flex justify-center items-center mb-6 space-x-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="border border-gray-300 rounded-lg p-2"
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            className="border border-gray-300 rounded-lg p-2"
            placeholderText="End Date"
          />
        </div>

        {/* Appointments List */}
        <ul className="space-y-8">
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((val, i) => (
              <li
                key={i}
                className="bg-white shadow-lg rounded-lg p-8 border border-gray-200"
              >
                {/* Time, Day, and Reason Section */}
                <div className="border-b border-gray-300 pb-4 mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Appointment Schedule
                  </h2>
                  <p className="text-gray-600">
                    <span className="font-bold">Date:</span> {val.date}
                  </p>
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
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Patient Details
                  </h2>
                  <p className="text-gray-600">
                    <span className="font-bold">Name:</span> {val.name} (
                    {val.age} {val.gender})
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold">Phone:</span> {val.phone}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-bold">Address:</span> {val.address}
                  </p>
                </div>

                {/* Doctor Details Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    Doctor Details
                  </h2>
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
  );
};



export default AdminAppoinment