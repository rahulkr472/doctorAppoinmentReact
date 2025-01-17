import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'




const PatientMangement = () => {

   const navigate = useNavigate()


      const [id, setId] = useState()

    const patient = localStorage.getItem("totalPatient")
    const data = JSON.parse(patient)

  

    const handlePatientInfo = (val,i) => {

        console.log(typeof val.uid);
        

        setId(() => {
            localStorage.setItem("PatientId", JSON.stringify(val.uid))
        })

       navigate("/admin/detail")

       

    }
    

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
  <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Total Patients</h1>

  <div className="overflow-x-auto">
    <ul className="space-y-4">
      {data?.length > 0 ? (
        data.map((val, i) => (
 
          <li
            key={i}
            className="flex justify-between items-center p-4 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out"
          >
            <div className="flex flex-col">
              <span className="text-xl font-semibold text-gray-700">{val.username}</span>
              <span className="text-sm text-gray-500">{val.email}</span>
            </div>
            <button 
            onClick={() => handlePatientInfo(val,i)}
            className="text-blue-500 hover:text-blue-700 font-medium">View Details</button>
          </li>
        ))
      ) : (
        <p className="text-center text-lg text-gray-500">No patients available</p>
      )}
    </ul>
  </div>
</div>

    )
}

export default PatientMangement