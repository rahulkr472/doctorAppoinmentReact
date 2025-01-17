import React, { useEffect, useState } from 'react'
import { auth, db } from '../../Firebase-Config'
import { useNavigate } from 'react-router'
import { doc, getDoc } from 'firebase/firestore'

const AdminHomePage = () => {

  const navigate = useNavigate()
  
  const [adminName, setAdminName] = useState()

  //doctor mangement
  const doctor = localStorage.getItem("doctorInfo")
  const length = JSON.parse(doctor)
  // console.log(length);
  
  //patient mangement
  const patient = localStorage.getItem("totalPatient")
  const patientLength = JSON.parse(patient)
  // const [storeAccept, setStoreAccept] = useState([])
  //appoiment
  
  const data = localStorage.getItem("appoinment")
  const appoinment = JSON.parse(data)

  //appoinment message
const [hidden, setHidden] = useState(true)
  const [appoimentMessage, setAppoimentMessage] = useState(() => {
    const message = localStorage.getItem("AppoinmentMessage")
    return message ? JSON.parse(message): []
  })


  useEffect(() => {

    const fetchData = async() => {

      const user = auth.currentUser
      console.log(user);

      if(user){
        const adminRef = doc(db, "admin", user.uid)
        const adminDoc = await getDoc(adminRef)

        try {
          if(adminDoc.exists()){

            const data = adminDoc.data()
            setAdminName(data.username)
            // console.log(data);
            
          }else {
            console.log("error");
            
          }
        } catch (error) {
          console.error(error);
          
        }


      }else {
        console.log("no admin found");
        
      }
      

    }

    fetchData()

   


  })

  const handleNotification = () => {
    setHidden(!hidden)
  }

  const deleteMessage = (index) => {
     const update = appoimentMessage.filter((_, i) => {
      return i !== index
     })
     setAppoimentMessage(update)
     localStorage.setItem("AppoinmentMessage", JSON.stringify(update));
  }
  

 const handleLogout = async(e) => {
    e.preventDefault();
    try {
      await auth.signOut();
      console.log("User signed out");
    } catch (error) {
      console.error("Error signing out: ", error);
    }

    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-blue-600 text-white shadow">
        <div className="container mx-auto flex justify-between items-center p-2">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span>{adminName}</span>

            <div className=' text-right text-[14px] absolute top-[75px] right-[200px]'>
            <div className='cursor-pointer'>
              <p onClick={handleNotification}
                className='px-3'
              >Notification
                <span className='bg-green-400 text-[14px] font-semibold px-[5px] pr-[6px] py-[-2px] rounded-full'>
                  {appoimentMessage?.length || "0"}
                </span>
              </p>
              <ul
                hidden={hidden}
                className='h-[420px] text-black w-[250px] mt-3 bg-[#f1f1f1] text-[13px] shadow-xl rounded-md p-4'>
                {
                  appoimentMessage?.length > 0 ? (
                    appoimentMessage.map((val, i) => {
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
                 {
              
                })
              </ul>
            </div>
          </div>

            <button 
            onClick={handleLogout}
            className="bg-white text-blue-600 px-3 py-1 rounded">Logout</button>
          </div>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-1/4 bg-white shadow-md">
          <nav className="p-4 space-y-2">
            <a href="#" className="block text-blue-600 font-semibold p-2 rounded hover:bg-gray-200">
              Dashboard
            </a>
            <a href="admin/DoctorMangement" className="block text-gray-600 p-2 rounded hover:bg-gray-200">
              Doctor Management
            </a>
            <a href="admin/patientMangement" className="block text-gray-600 p-2 rounded hover:bg-gray-200">
              Patient Management
            </a>
            <a href="admin/appoinment" className="block text-gray-600 p-2 rounded hover:bg-gray-200">
              Appointments
            </a>
           
            <a href="#" className="block text-gray-600 p-2 rounded hover:bg-gray-200">
              Settings
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="w-3/4 p-6">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Dashboard Overview</h2>

          {/* Cards Section */}
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Doctors</h3>
              <p className="text-2xl font-bold text-blue-600">{length?.length || "0"}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700">Total Patients</h3>
              <p className="text-2xl font-bold text-green-600">{patientLength?.length || "0"}</p>
            </div>
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-700">Appointments Today</h3>
              <p className="text-2xl font-bold text-red-600">{appoinment?.length || "0"}</p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Recent Activities</h3>
            <div className="bg-white shadow rounded-lg p-4">
              <ul className="divide-y divide-gray-200">
                {
                  appoimentMessage?.length > 0 ? (
                    appoimentMessage.map((val, i) => {
                      return <li key={i} className="py-2">
                        <p className="text-gray-700">{val}</p>
                      </li>
                    })
                  ):(
                   <p>No message yet..</p>
                  )
                }
              
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminHomePage