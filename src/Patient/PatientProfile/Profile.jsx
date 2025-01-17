import React, { useEffect } from 'react'
import { useState } from 'react'
import { auth, db } from '../../Firebase-Config';
import { useNavigate } from 'react-router-dom';
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { setDoc } from 'firebase/firestore';
import { use } from 'react';
import { useAuth } from '../../Auth/AuthContext';


const Profile = () => {

  const navigate = useNavigate();



  const [ patientPersonalInfo, setPatientPersonalInfo ] = useState()
  const [ userMedicalInfo, setUserMedicalInfo ] = useState()

  // console.log(patientPersonalInfo);
  


  const [ProfileHidden, setProfileHidden] = useState(false)
  const [PersonalHidden, setPersonalHidden] = useState(true)
  const [MedicalHidden, setMedicalHidden] = useState(true)

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',

  })

  const [medicalData, setMedicalData] = useState({
    allergies: '',
    medications: '',
    chronicConditions: '',
    otherInfo: ''
  })

  const handleProfile = () => {
    setProfileHidden(false)
    setPersonalHidden(true)
    setMedicalHidden(true)

  }

  const handlePersonalInfo = () => {
    setProfileHidden(true)
    setMedicalHidden(true)
    setPersonalHidden(false)
  }

  const handleMedicalInfo = () => {
    setProfileHidden(true)
    setPersonalHidden(true)
    setMedicalHidden(false)
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


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })


  }

  const medicalDataHandleChange = (e) => {
    setMedicalData({
      ...medicalData,
      [e.target.name]: e.target.value
    })
  }

  const user = auth.currentUser;
  const patientCollectionRef = collection(db, 'patients');
  // console.log(user.uid);

  const handlePersonalData = async (e) => {
    e.preventDefault();

    if (formData.name === '' || formData.age === '' || formData === '' || formData.phone === '' || formData.address === '') {
      alert('Please fill all fields');
      return;
    } else if (formData.phone.length >= 11) {
      alert('Phone number must be 10 digits');
      return;
    }
    else {
      if (user) {

        try {
          await updateDoc(doc(patientCollectionRef, user.uid), {

            personalInfo: {
              name: formData.name,
              age: formData.age,
              gender: formData.gender,
              phone: formData.phone,
              address: formData.address
            }

          });
          alert('Personal Info submited successfully');


          localStorage.setItem('user', JSON.stringify(formData));
          setPatientPersonalInfo(formData);

        } catch (error) {
          console.log('Error adding document: ', error);

        }

      }
      else {
        console.log('No user found');
      }

    }

    const userInfo = localStorage.getItem('user');
    if (userInfo) {
    setPatientPersonalInfo(JSON.parse(userInfo));
      // loginUser(parsedUserInfo);
      console.log(formData);
      
    }



  }


  const handleMedicalData = async (e) => {
    e.preventDefault();

    if (allergies === '' || medications === '' || chronicConditions === '' || otherInfo === '') {
      alert('Please fill all fields');
      return;

    } else {

      if (user) {

        try {
          await updateDoc(doc(patientCollectionRef, user.uid), {
            medicalInfo: {
              allergies: medicalData.allergies,
              medications: medicalData.medications,
              chronicConditions: medicalData.chronicConditions,
              otherInfo: medicalData.otherInfo
            }
          });
          alert('Medical Info submited successfully');
          localStorage.setItem('medicalData', JSON.stringify(medicalData));
          setUserMedicalInfo(medicalData);
        } catch (error) {
          console.log('Error adding document: ', error);
        }

      }
      else {
        console.log('No user found');
      }

    }

    const medicalInfo = localStorage.getItem('medicalData');
    if (medicalInfo) {
      setUserMedicalInfo(JSON.parse(medicalInfo));
    }


  }


  const fetchPersonalInfo = async (uid) => {

    try {
      const snapshot = await getDoc(doc(patientCollectionRef, uid));
      if (snapshot.exists()) {
        const userData = snapshot.data();
       setPatientPersonalInfo(userData.personalInfo);
       setUserMedicalInfo(userData.medicalInfo);
        // console.log(userData);

      } else {
        console.log("User not found");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  }

  useEffect(() => {

    const subscribe = auth.onAuthStateChanged(user => {
      if (user) {
        fetchPersonalInfo(user.uid)
        
      } else {
        setLoading(false);
      }
    });

    return () => subscribe();
  }, [])


  return (
    <div>


      <div className='bg-[#f0f0f0] min-h-screen p-5'>
        <h1 className='text-2xl font-semibold mb-5'>Patient Profile</h1>

        <div className='flex justify-between space-x-3'>

          {/* leftside */}
          <div className='border-[1px] mt-4 p-4 border-gray-300 rounded-md w-[65%] sm:w-[80%] bg-white shadow-lg'>
            <p className='text-lg font-medium mb-3'>Overview</p>

            {/* Profile */}
            <div
              hidden={ProfileHidden}
              className="max-w-2xl mx-auto p-4 bg-white shadow-md rounded-lg">
              <div className="flex items-center space-x-4">
                <img
                  className="w-24 h-24 rounded-full"
                  src=""
                  alt="Patient Avatar"
                />
                <div>
                  <h2 className="text-2xl font-semibold">{patientPersonalInfo ?  patientPersonalInfo.name : "N/A"}</h2>
                  {/* <p className="text-gray-600">john.doe@example.com</p> */}
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold">Personal Information</h3>
                <div className="mt-2">
                  <p className="text-gray-700"><span className="font-semibold">Age:</span> {patientPersonalInfo ? patientPersonalInfo.age : "N/A"}</p>
                  <p className="text-gray-700"><span className="font-semibold">Gender:</span> {patientPersonalInfo ? patientPersonalInfo.gender : "N/A"}</p>
                  <p className="text-gray-700"><span className="font-semibold">Phone:</span> {patientPersonalInfo ? patientPersonalInfo.phone : "N/A"}</p>
                  <p className="text-gray-700"><span className="font-semibold">Address:</span> {patientPersonalInfo ? patientPersonalInfo.address : "N/A"}</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="text-xl font-semibold">Medical History</h3>
                <div className="mt-2">
                  <p className="text-gray-700"><span className="font-semibold">Allergies:</span> {userMedicalInfo ? userMedicalInfo.allergies : "N/A"}</p>
                  <p className="text-gray-700"><span className="font-semibold">Medications:</span> {userMedicalInfo ? userMedicalInfo.medications : "N/A"}</p>
                  <p className="text-gray-700"><span className="font-semibold">Chronic Conditions:</span> {userMedicalInfo ? userMedicalInfo.chronicConditions : "N/A"}</p>
                  <p className="text-gray-700"><span className="font-semibold">Other Important Info:</span> {userMedicalInfo ? userMedicalInfo.otherInfo : "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Personal Info */}
            <div
              hidden={PersonalHidden}
              className='mt-3'>
              <form
              // onSubmit={handleSubmit}
              >
                <div className='grid sm:grid-cols-3 gap-5 text-[12px]'>
                  {/* Name */}
                  <div>
                    <label htmlFor="name">Name:</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      className='border p-2 w-full mt-1 text-[12px] placeholder-[#212529]'
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Age */}
                  <div>
                    <label htmlFor="age">Age:</label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      placeholder="Enter your age"
                      className='border p-2 mt-1 w-full placeholder-[#212529]'
                      value={formData.age}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Gender */}
                  <div>
                    <label htmlFor="gender">Gender:</label>
                    <select
                      id="gender"
                      name="gender"
                      className='border p-2 w-full mt-1'
                      value={formData.gender}
                      onChange={handleChange}
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  {/* Phone */}
                  <div>
                    <label htmlFor="phone">Phone:</label>
                    <input
                      type="text"
                      id="phone"
                      name="phone"
                      placeholder="Enter your phone number"
                      className='border p-2 w-full mt-1 placeholder-[#212529]'
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  {/* Address */}
                  <div>
                    <label htmlFor="address">Address:</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Enter your address"
                      className='border p-2 w-full mt-1 placeholder-[#212529]'
                      value={formData.address}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div>
                  <button
                    onClick={handlePersonalData}
                    type="submit"
                    className='bg-blue-500 text-white p-2 mt-3 px-8 text-[11px] rounded'>Submit</button>
                </div>
              </form>
            </div>

            {/* Medical History */}
            <div className="mt-6"
              hidden={MedicalHidden}>
              <h3 className="text-xl font-semibold">Record Medical Info</h3>
              <div className="mt-2">
                <label htmlFor="allergies" className="block text-gray-700 font-semibold">Allergies:</label>
                <input
                  type="text"
                  id="allergies"
                  name="allergies"
                  placeholder="Enter your allergies"
                  className="border p-2 w-full mt-1 placeholder-[#212529]"
                  value={medicalData.allergies}
                  onChange={medicalDataHandleChange}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="medications" className="block text-gray-700 font-semibold">Medications:</label>
                <input
                  type="text"
                  id="medications"
                  name="medications"
                  placeholder="Enter your medications"
                  className="border p-2 w-full mt-1 placeholder-[#212529]"
                  value={medicalData.medications}
                  onChange={medicalDataHandleChange}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="chronicConditions" className="block text-gray-700 font-semibold">Chronic Conditions:</label>
                <input
                  type="text"
                  id="chronicConditions"
                  name="chronicConditions"
                  placeholder="Enter your chronic conditions"
                  className="border p-2 w-full mt-1 placeholder-[#212529]"
                  value={medicalData.chronicConditions}
                  onChange={medicalDataHandleChange}
                />
              </div>
              <div className="mt-2">
                <label htmlFor="otherInfo" className="block text-gray-700 font-semibold">Other Important Info:</label>
                <textarea
                  id="otherInfo"
                  name="otherInfo"
                  placeholder="Enter other important information"
                  className="border p-2 w-full mt-1 placeholder-[#212529] h-24"
                  value={medicalData.otherInfo}
                  onChange={medicalDataHandleChange}
                ></textarea>
              </div>
              <div>
                <button
                  onClick={handleMedicalData}
                  className="bg-blue-500 text-white p-2 mt-3 px-8 text-[11px] rounded">
                  Submit</button>
              </div>

            </div>






          </div>

          {/* rightside */}
          <div className='border-[1px] p-4 mt-4 rounded-md border-gray-300 w-[35%] sm:w-[20%] bg-white shadow-lg'>
            <button
              onClick={handleProfile}
              className='w-full bg-blue-500 text-white p-1 mt-2 rounded hover:bg-blue-600 transition duration-300'>
              Profile
            </button><br />
            <button
              onClick={handlePersonalInfo}
              className='w-full bg-blue-500 text-white p-1 mt-2 rounded hover:bg-blue-600 transition duration-300'>
              Personal Info
            </button><br />
            <button
              onClick={handleMedicalInfo}
              className='w-full bg-blue-500 text-white p-1 mt-2 rounded hover:bg-blue-600 transition duration-300'>
              Medical History
            </button><br />
            <button
              onClick={handleLogout}
              className='w-full inline-block text-center bg-red-500 text-white p-1 mt-2 rounded hover:bg-red-600 transition duration-300'>
              Logout
            </button>
          </div>
        </div>
      </div>


    </div>



  )
}

export default Profile