import React, { useEffect, useState } from 'react'
import { auth, db } from '../../Firebase-Config'
import { useNavigate } from 'react-router'
import { doc, getDoc } from 'firebase/firestore'
import { Bell, LayoutDashboard, User, Users, Calendar, Settings } from "lucide-react";


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
    return message ? JSON.parse(message) : []
  })


  useEffect(() => {

    const fetchData = async () => {

      const user = auth.currentUser
      // console.log(user);

      if (user) {
        const adminRef = doc(db, "admin", user.uid)
        const adminDoc = await getDoc(adminRef)

        try {
          if (adminDoc.exists()) {

            const data = adminDoc.data()
            setAdminName(data.username)
            // console.log(data);

          } else {
            console.log("error");

          }
        } catch (error) {
          console.error(error);

        }


      } else {
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


  const handleLogout = async (e) => {
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
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold font-heading">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span>{adminName}</span>

            <div className="relative">
              <div className="cursor-pointer">
                <p onClick={handleNotification} className="px-3 flex items-center space-x-2">
                  <Bell className="h-5 w-5 ml-9 text-blue-600" />
                  
                  <span className=" bg-green-400 text-[14px] font-semibold  px-[5px] pr-[6px] py-[-2px] rounded-full">
                    {appoimentMessage?.length || "0"}
                  </span>
                </p>
                <ul
                  hidden={hidden}
                  className="absolute top-[75px] right-[0]  w-[250px] mt-3 bg-[#f1f1f1] text-black text-[13px] shadow-xl rounded-md p-7"
                >
                  {appoimentMessage?.length > 0 ? (
                    appoimentMessage.map((val, i) => (
                      <li key={i} className="mt-2 text-left">
                        <span>
                          ➡️ {val} <span onClick={() => deleteMessage(i)}>❌</span>
                        </span>
                      </li>
                    ))
                  ) : (
                    <p>No messages yet...</p>
                  )}
                </ul>
              </div>
            </div>
            <button onClick={handleLogout}>Logout</button>
          </div>

        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white shadow-md">
          <nav className="p-4 space-y-2">
            <a
              href="#"
              className="block text-blue-600 font-semibold p-2 rounded hover:bg-gray-200"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </a>
            <a
              href="admin/DoctorMangement"
              className="block text-gray-600 p-2 rounded hover:bg-gray-200"
            >
              <User className="mr-2 h-4 w-4" />
              Doctor Management
            </a>
            <a
              href="admin/patientMangement"
              className="block text-gray-600 p-2 rounded hover:bg-gray-200"
            >
              <Users className="mr-2 h-4 w-4" />
              Patient Management
            </a>
            <a
              href="admin/appoinment"
              className="block text-gray-600 p-2 rounded hover:bg-gray-200"
            >
              <Calendar className="mr-2 h-4 w-4" />
              Appointments
            </a>
            <a
              href="#"
              className="block text-gray-600 p-2 rounded hover:bg-gray-200"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </a>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold font-heading mb-6">Dashboard Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white shadow-lg rounded-lg p-4">
              <div className="pb-2 text-sm font-medium text-muted-foreground">Total Doctors</div>
              <div className="text-3xl font-bold text-primary">
                {length?.length || "0"}
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <div className="pb-2 text-sm font-medium text-muted-foreground">Total Patients</div>
              <div className="text-3xl font-bold text-green-500">
                {patientLength?.length || "0"}
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-4">
              <div className="pb-2 text-sm font-medium text-muted-foreground">Appointments Today</div>
              <div className="text-3xl font-bold text-blue-500">
                {appoinment?.length || "0"}
              </div>
            </div>
          </div>

          {/* Recent Activities Card */}
          <div className="bg-white shadow-lg rounded-lg p-4 mt-8">
            <div className="pb-2 text-lg font-semibold">Recent Activities</div>
            <div className="space-y-4">
              {appoimentMessage?.length > 0 ? (
                appoimentMessage.map((val, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">{val}</p>
                  </div>
                ))
              ) : (
                <p>No message yet...</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>

  );
}

export default AdminHomePage