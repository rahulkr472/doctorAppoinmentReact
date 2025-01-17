import React, { createContext, useState } from 'react'

const doctorAppoinment = createContext()

const DoctorContext = ({children}) => {

  const [Appoinment, setAppoinment] = useState([])

  return (
    <doctorAppoinment.Provider value={{Appoinment, setAppoinment}}>
      {children}
    </doctorAppoinment.Provider>
  )
}

export default DoctorContext