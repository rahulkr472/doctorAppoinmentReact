import React from 'react'
import { useState, useEffect} from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { db, auth } from '../../Firebase-Config'
import { doc, getDoc } from 'firebase/firestore'

const PatientDetailPage = () => {

    const [patientPersonalInfo, setPatientPersonalInfo] = useState()
       const [patientMedicalInfo, setPatientMedicalInfo] = useState()
       const [viewDetail, setViewDetail] = useState({})
    
    
        const patient = localStorage.getItem("totalPatient")
        const data = JSON.parse(patient)

        const id = localStorage.getItem("PatientId")
        const PatientId = JSON.parse(id)
    
        useEffect(() => {

            const fetchData = async() => {
                const patientRef = doc(db, "patients", PatientId )
                const patientDoc = await getDoc(patientRef)
                
                if(id){
        
                    try {
                        if(patientDoc.exists()){
                            const data = patientDoc.data()
                            setPatientPersonalInfo(data.personalInfo)
                            setPatientMedicalInfo(data.medicalInfo)
                            
                        }else{
                        console.log("no data");
                        
                        }
                    } catch (error) {
                        console.error(error);
                        
                        
                    }
        
                }else{
        
                }
            }

            fetchData()
            
            
        },[])

  return (
    <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
    <h1 className="text-4xl font-semibold text-center text-gray-800 mb-6">Patient Details</h1>
  
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Personal Information</h2>
        <ul className="space-y-2">
        <li className="flex justify-between">
            <span className="text-gray-600 font-medium">Name:</span>
            <span className="text-gray-800">{patientPersonalInfo?.name || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600 font-medium">Age:</span>
            <span className="text-gray-800">{patientPersonalInfo?.age || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600 font-medium">Gender:</span>
            <span className="text-gray-800">{patientPersonalInfo?.gender || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600 font-medium">Phone:</span>
            <span className="text-gray-800">{patientPersonalInfo?.phone || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600 font-medium">Address:</span>
            <span className="text-gray-800">{patientPersonalInfo?.address || "N/A"}</span>
          </li>
        </ul>
      </div>
  
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold text-gray-700 mb-4">Medical Information</h2>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span className="text-gray-600 font-medium">Allergies:</span>
            <span className="text-gray-800">{patientMedicalInfo?.allergies || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600 font-medium">Chronic Conditions:</span>
            <span className="text-gray-800">{patientMedicalInfo?.chronicConditions || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600 font-medium">Medications:</span>
            <span className="text-gray-800">{patientMedicalInfo?.medications || "N/A"}</span>
          </li>
          <li className="flex justify-between">
            <span className="text-gray-600 font-medium">Other Info:</span>
            <span className="text-gray-800">{patientMedicalInfo?.otherInfo || "N/A"}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
  
  )
}

export default PatientDetailPage