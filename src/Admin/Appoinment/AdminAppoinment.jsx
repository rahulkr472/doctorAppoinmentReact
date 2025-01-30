import React, { useState } from 'react'
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router';
import { useTheme } from '../ThemeProvider';

const AdminAppoinment = () => {

  const navigate = useNavigate()

  const [appoinment, setAppoinment] = useState(() => {
    const data = localStorage.getItem("appoinment")
    return data ? JSON.parse(data) : []
  })

  // appoinment.map((val) => {
  //   console.log(val);

  // })



  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [searchDoctor, setSearchDoctor] = useState("")

  const currentDate = new Date().toLocaleDateString()

  const filteredAppointments = appoinment.filter((appointment) => {
    const appointmentDate = new Date(appointment.date); // Appointment's date
    const appointmentTime = appointment.time; // Appointment's time
    const doctor = appointment.doctorName; // Doctor's name
  
    const currentDateObj = new Date(currentDate); // Today's date object
  
    // Check if the doctor matches (case-insensitive)
    const doctorMatches =
      !searchDoctor || doctor.toLowerCase() === searchDoctor.toLowerCase();
  
    // Check if the appointment date falls within the selected range
    const dateMatches =
      (!startDate || appointmentDate >= new Date(startDate)) &&
      (!endDate || appointmentDate <= new Date(endDate));
  
    // Check if the time falls within the selected range
    const timeMatches =
      (!startTime || appointmentTime >= startTime) &&
      (!endTime || appointmentTime <= endTime);
  
    // If no date range is selected, show appointments for the current date
    const showCurrentDateOnly =
      !startDate && !endDate
        ? appointmentDate.toDateString() === currentDateObj.toDateString()
        : true; // If a date range is selected, skip this check
  
    // Return true if all conditions match
    return doctorMatches && dateMatches && timeMatches && showCurrentDateOnly;
  });
  


  const handleViewDetails = (val) => {
   
    localStorage.setItem("appoinmentDetail", JSON.stringify(val))
    navigate("/admin/appoinmentDetail")
  }

  // console.log(startTime);


  const {theme} = useTheme()


  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : " text-primary bg-gradient-to-r from-blue-50 to-gray-50"}  min-h-screen p-6`}>
    <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-12">
      Appointments
    </h1>
  
    {/* Date and Time Filters */}
    <div className={`${theme === "dark" ? "bg-gray-900 text-white shadow-[#ffffff41]" : " text-primary"} container mx-auto mb-10 p-6 flex flex-wrap items-center justify-center gap-6 bg-white shadow-lg rounded-xl`}>
      {/* Search Input */}
      <div className="flex flex-col w-full md:w-1/3">
        <label className="text-lg font-semibold text-primary mb-2">Search Doctor</label>
        <input
          value={searchDoctor}
          onChange={(e) => setSearchDoctor(e.target.value)}
          type="text"
          placeholder="Search Doctor"
          className="p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>
  
      {/* Date Range Picker */}
      <div className="flex flex-col w-full md:w-1/3">
        <label className="text-lg font-semibold text-primary mb-2">Date Range</label>
        <div className="flex gap-4">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholderText="Start Date"
          />
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholderText="End Date"
          />
        </div>
      </div>
  
      {/* Time Range Pickers */}
      <div className="flex flex-col w-full md:w-1/3">
        <label className="text-lg font-semibold text-primary mb-2">Time Range</label>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-primary mb-1">Start Time</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full p-3 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-primary mb-1">End Time</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full p-3 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  
    {/* Appointments List */}
    <div className="container mx-auto p-4">
      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((val, i) => (
            <li
              key={i}
              className="bg-gradient-to-r from-blue-100 to-blue-300 flex flex-col justify-between items-center shadow-xl rounded-2xl p-6 border border-gray-200 hover:scale-105 transform transition-all duration-300 ease-in-out"
            >
              {/* Message */}
              <div className="w-full">
                <p className="text-blue-600 font-semibold text-lg mb-4">
                  New appointment{" "}<br/>
                  <span className="font-medium text-[#111111e4] text-lg">DoctorName: {val.doctorName}</span><br/>
                  <span className="font-medium text-[#111111e4] text-lg">PatientName: {val.name}</span>
                </p>
  
                {/* Appointment Info */}
                <div className="mb-4 flex flex-wrap gap-8">
                  <p className="text-gray-600 text-base">
                    <span className="font-semibold">Date:</span> {val.date}
                  </p>
                  <p className="text-gray-600 text-base">
                    <span className="font-semibold">Time:</span> {val.time}
                  </p>
                  <p className="text-gray-600 text-base">
                    <span className="font-semibold">Day:</span> {val.day}
                  </p>
                </div>
              </div>
  
              {/* View Details Button */}
              <div className="w-full flex justify-center mt-4">
                <button
                  onClick={() => handleViewDetails(val)}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 ease-in-out transform hover:scale-105"
                >
                  View Details
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500 text-xl">No appointments found.</p>
        )}
      </ul>
    </div>
  </div>
  
  );
};



export default AdminAppoinment