import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const DoctorHome = () => {

  const navigate = useNavigate()

  const handleAppoinment = () => {

    navigate("/doctor/appointment")

  }

  const handlePatient = () => {
    navigate("/doctor/PatientRecords")
  }

  //doctor appoinment message

  const [message, setMessage] = useState(() => {
    const data = localStorage.getItem("doctorMessage")
   return data ? JSON.parse(data) : []
  })
  
 
  // console.log(message);

  const [hidden, setHidden] = useState(true)
  

  const handleNotification = () => {
    setHidden(!hidden)
  }

  const deleteMessage = (index) => {
    console.log("del", index);

    
   const update = message.filter((_, i) => {
      console.log(i);
      
      return i !== index
     })

     setMessage(update)
     localStorage.setItem("doctorMessage", JSON.stringify(update));
  }

  return (
    <div>
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Doctor Dashboard</h1>
       
          <div className=' text-right text-[14px] absolute top-[80px] right-4'>
            <div className='cursor-pointer'>
              <p onClick={handleNotification}
                className='px-3 text-lg'
              >Notification
                <span className='bg-green-400 text-[14px] font-semibold px-[5px] pr-[6px] py-[-2px] rounded-full'>
                  {message?.length || "0"}
                </span>
              </p>
              <ul
                hidden={hidden}
                className='h-[420px] w-[270px] mt-3 bg-[#f1f1f1] text-[13px] shadow-xl rounded-md p-4'>
                {
                  message?.length > 0 ? (
                    message.map((val, i) => {
                      return <li key={i}
                        className='mt-2 text-left'>
                        <span>
                          ➡️  {val} <span onClick={() => deleteMessage(i)}>❌</span>
                        </span>
                      </li>

                    })
                  ) : (
                    <p></p>
                  )

                }
              </ul>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={handleAppoinment}
              className='text-left'>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">Appointments</h2>
                <p className="text-gray-700">Manage your appointments</p>
              </div>
            </button>
            <button
              onClick={handlePatient}
              className='text-left'>
              <div className="bg-white p-6 rounded-lg shadow-md">

                <h2 className="text-xl font-semibold mb-2">Patients</h2>
                <p className="text-gray-700">View patient information</p>

              </div>
            </button>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-2">Messages</h2>
              <p className="text-gray-700">Check your messages</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorHome;