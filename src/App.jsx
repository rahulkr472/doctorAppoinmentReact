import React from 'react'
import Signup from './Auth/Signup'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AuthProvider from './Auth/AuthContext'
import Login from './Auth/Login'
import DoctorMain from './Doctor/DoctorMain'
import PatientMain from './Patient/PatientMain'
import Home from './Patient/Home/Home'
import Profile from './Patient/PatientProfile/Profile'
import PatientAppoinment from './Patient/patientAppoinment/PatientAppoinment'
import DoctorHome from './Doctor/DaseboardComp/DoctorHome'
import DoctorProfile from './Doctor/ProfileComp/DoctorProfile'
import Appoinment from './Doctor/AppoinmentComp/Appoinment'
import Availability from './Doctor/AvailabilityComp/Availability'
import Records from './Doctor/Records'
import DoctorContext from './Doctor/DoctorContext'
import DoctorDetail from './Patient/Home/DoctorDetail'
import AdminMain from './Admin/AdminMain'
import AdminHome from './Admin/Home/AdminHome'
import AdminHomePage from './Admin/Home/AdminHomePage'
import DoctorMangement from './Admin/DoctorMangement/DoctorMangement'
import PatientMangement from './Admin/PatientMangement/PatientMangement'
import PatientDetailPage from './Admin/PatientDetail/PatientDetailPage'
import AdminAppoinment from './Admin/Appoinment/AdminAppoinment'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DoctorContext>
          <Routes>
            <Route path='/' element={<Signup />} />
            <Route path='/login' element={<Login />} />

            <Route path='/admin/*' element={<AdminMain />}>
            
              <Route index element={<AdminHomePage />} />
                <Route path='home' element={<AdminHomePage />}/>
                <Route path='Doctor' element={<AdminHome />} />
                <Route path='DoctorMangement' element={<DoctorMangement />}/>
                <Route path='PatientMangement' element={<PatientMangement />}/>
                <Route path='detail' element={<PatientDetailPage />} />
                <Route path='appoinment' element={<AdminAppoinment/>} /> 
            </Route>

            <Route path='/doctor/*' element={<DoctorMain />}>
              <Route index element={<DoctorHome />} />
              {/* Nested Routes */}
              <Route path='home' element={<DoctorHome />} />
              <Route path='appointment' element={<Appoinment />} />
              <Route path='Availability' element={<Availability />} />
              <Route path='PatientRecords' element={<Records />} />
              <Route path='profile' element={<DoctorProfile />} />
            </Route>

            <Route path='/patient/*' element={<PatientMain />}>
              {/* Default Route */}
              <Route index element={<Home />} />
              {/* Nested Routes */}
              <Route path='home' element={<Home />} />
              <Route path='DoctorDetail' element={<DoctorDetail />} />
              <Route path='appointment' element={<PatientAppoinment />} />
              <Route path='profile' element={<Profile />} />

            </Route>
          </Routes>

        </DoctorContext>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App