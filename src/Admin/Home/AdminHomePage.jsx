import React, { useEffect, useState } from 'react'
import { auth, db } from '../../Firebase-Config'
import { useNavigate } from 'react-router'
import { doc, getDoc } from 'firebase/firestore'
import { Bell, LayoutDashboard, User, Users, Calendar, Settings } from "lucide-react";
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Moon, Sun } from "lucide-react";
import { useTheme } from '../ThemeProvider';



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
    gsap.to("#right ul", {
      x: 0,
      duration: .7, // Smooth transition
      ease: "power2.out"
    });
  }

  const handleNotClose = () => {
    gsap.to("#right ul", {
      x: 420,
      duration: .7, // Smooth transition
      ease: "power2.out"
    });
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

  useGSAP(() => {
    let tl = gsap.timeline()

    tl.from("#navbar #left", {
      x: -60,
      opacity: 0,
      duration: .4,
      delay: .8,
    }, "nav")

    tl.from("#navbar #right", {
      x: 60,
      opacity: 0,
      duration: .4,
      delay: .8,
    }, "nav")


    tl.from("#leftSide a", {
      x: -40,
      duration: .4,
      opacity: 0,
      stagger: .2,

    })

    tl.from("main h2", {
      scale: 0,
      duration: .4,
      opacity: 0
    })
    tl.from("main #content #one", {
      y: 40,
      duration: .4,
      opacity: 0,
      stagger: .2,
    })
    tl.from("#activity", {
      y: -30,
      opacity: 0,
      duration: .4,
      stagger: .2
    })
  })



  const { theme, setTheme } = useTheme();

  return (
    <div className={`overflow-x-hidden min-h-screen bg-background ${theme === "dark" ? "dark:bg-gray-900 text-white" : "text-black"}`}>
      <header className={`sticky top-0 z-50 w-full border-b bg-background/95 ${theme === "dark" ? "dark:bg-gray-900 text-white" : "text-black"}`}>
        <div id="navbar" className="flex h-16 items-center justify-between px-6 ">
          <h1 id='left' className="text-xl font-bold">Admin Dashboard</h1>




          <div id="right" className=" flex items-center space-x-4">
            {/* Dark Mode Toggle */}
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700">
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <span>{adminName}</span>
            <div className="relative">
              <div className=" cursor-pointer">
                <p onClick={handleNotification} className="px-3 flex items-center space-x-2">
                  <Bell className="h-5 w-5 ml-9 text-blue-600" />
                  <span className="bg-green-400 text-[14px] font-semibold px-[5px] pr-[6px] rounded-full">
                    {appoimentMessage?.length || "0"}
                  </span>
                </p>
                <ul id='notification' className=" absolute top-[35px] right-[-94px] w-[420px] mt-3 bg-gray-100 dark:bg-gray-800 text-black dark:text-white text-[13px] shadow-xl rounded-md p-7"
                  style={{ transform: "translateX(420px)" }}
                >
                  <span className='absolute top-[10px] right-[20px] bg-white p-[4px] px-[5px] text-[12px] rounded-full'>
                    <button onClick={handleNotClose}>❌</button>
                  </span>
                  {appoimentMessage?.length > 0 ? (
                    appoimentMessage.map((val, i) => (
                      <li key={i} className="mt-7 text-left">
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
        <aside className={`w-64 bg-white  shadow-md rounded-md ${theme === "dark" ? "dark:bg-gray-900 text-white shadow-[#ffffff2a]" : "text-black"}`}>
          <nav id="leftSide" className="p-4 space-y-2">
            <a href="#" className="block  dark:text-blue-600 p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
            </a>
            <a href="admin/DoctorMangement" className="block text-primary p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <User className="mr-2 h-4 w-4" /> Doctor Management
            </a>
            <a href="admin/patientMangement" className="block text-primary p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <Users className="mr-2 h-4 w-4" /> Patient Management
            </a>
            <a href="admin/appoinment" className="block text-primary p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <Calendar className="mr-2 h-4 w-4" /> Appointments
            </a>
            <a href="#" className="block text-primary p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
              <Settings className="mr-2 h-4 w-4" /> Settings
            </a>
          </nav>
        </aside>



        <main className="flex-1 p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
          <div id='content' className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div id='one' className={`bg-white  shadow-lg rounded-lg p-4 ${theme === "dark" ? "dark:bg-gray-900 text-white shadow-[#ffffff2a] " : "text-black"}`}>
              <div className="text-sm font-medium text-primary text-muted-foreground ">Total Doctors</div>
              <div className="text-3xl font-bold text-primary">{length?.length || "0"}</div>
            </div>
            <div id='one' className={`${theme === "dark" ? "dark:bg-gray-900 text-white shadow-[#ffffff2a] " : "text-black"} bg-white shadow-lg rounded-lg p-4`}>
              <div className="text-sm font-medium text-muted-foreground text-primary">Total Patients</div>
              <div className="text-3xl font-bold text-green-500">{patientLength?.length || "0"}</div>
            </div>
            <div id='one' className={`${theme === "dark" ? "dark:bg-gray-900 text-white shadow-[#ffffff2a]" : "text-black"} bg-white shadow-lg rounded-lg p-4`}>
              <div className="text-sm font-medium text-muted-foreground  text-primary">Appointments Today</div>
              <div className="text-3xl font-bold text-blue-500">{appoinment?.length || "0"}</div>
            </div>
          </div>

          <div id='activity' className={` bg-white  shadow-lg rounded-lg p-4 mt-8 ${theme === "dark" ? "dark:bg-gray-900 text-white shadow-[#ffffff2a]" : "text-black"}`}>
            <div className="pb-2 text-lg font-semibold">Recent Activities</div>
            <div className="space-y-4">
              {appoimentMessage?.length > 0 ? (
                appoimentMessage.map((val, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg border dark:border-gray-300">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground text-primary">{val}</p>
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