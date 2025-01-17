import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react';
import { auth, db } from '../../Firebase-Config';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import Card from './Card';
import { useAuth } from '../../Auth/AuthContext';



const DoctorProfile = () => {

  const navigate = useNavigate()

  const [doctorData, setDoctorData] = useState([]);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    uniqueId: '',
    mobileNumber: '',
    country: '',
    state: '',
    city: '',
    postalCode: ''
  });

  const [professionalData, setProfessionalData] = useState({
    specialization: '',
    experience: '',
    qualifications: '',
    clinicAddress: '',
    consultationFee: '',
    About: ''

  });


  const [PersonalHidden, setPersonaHidden] = useState(true);
  const [ProfessionalHidden, setProfessionalHidden] = useState(true);
  const [ProfileHidden, setProfileHidden] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setFormData({
      firstName: '',
      lastName: '',
      age: '',
      gender: '',
      uniqueId: '',
      mobileNumber: '',
      country: '',
      state: '',
      city: '',
      postalCode: ''

    })



    const validateFormData = () => {
      const { firstName, lastName, age, gender, uniqueId, mobileNumber, country, state, city, postalCode } = formData;
      if (!firstName || !lastName || !age || !gender || !uniqueId || !mobileNumber || !country || !state || !city || !postalCode) {
        alert("All fields are required.");
        return false;
      }
      if (isNaN(age) || age <= 0) {
        alert("Please enter a valid age.");
        return false;
      }
      if (!/^\d{10}$/.test(mobileNumber)) {
        alert("Please enter a valid 10-digit mobile number.");
        return false;
      }
      return true;
    };

    if (!validateFormData()) {
      return;
    }


    setDoctorData([...doctorData, formData]);

    const user = auth.currentUser;

    if (user) {
      try {
        await updateDoc(doc(db, "doctors", user.uid), {

          personalInfo: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            age: formData.age,
            mobileNumber: formData.mobileNumber,
            uniqueId: formData.uniqueId,
            city: formData.city,
            state: formData.state,
            country: formData.country,
            postalCode: formData.postalCode,
          }


        });
        console.log("Personal info successfully updated!");
      } catch (error) {
        console.error("Error updating personal info:", error);
      }
    } else {
      console.error("No user is currently logged in.");
    }

  };



  const handleProfessionalChange = (e) => {
    const { name, value } = e.target;
    setProfessionalData({
      ...professionalData,
      [name]: value
    });
  }

  const handleProfessionalSubmit = async (e) => {
    e.preventDefault();
    console.log(professionalData);

    setProfessionalData({
      specialization: '',
      experience: '',
      qualifications: '',
      clinicAddress: '',
      consultationFee: '',
      About: ''
    })

    const validateProfessionalData = () => {
      const { specialization, experience, qualifications, clinicAddress, consultationFee, About } = professionalData;
      if (!specialization || !experience || !qualifications || !clinicAddress || !consultationFee || !About) {
        alert("All fields are required.");
        return false;
      }
      if (isNaN(experience) || experience <= 0) {
        alert("Please enter a valid experience in years.");
        return false;
      }
      if (isNaN(consultationFee) || consultationFee <= 0) {
        alert("Please enter a valid consultation fee.");
        return false;
      }
      return true;
    };

    if (!validateProfessionalData()) {
      return;
    }

    const user = auth.currentUser;

    if (user) {
      try {
        await updateDoc(doc(db, "doctors", user.uid), {

          professionalInfo: {
            specialization: professionalData.specialization,
            experience: professionalData.experience,
            qualifications: professionalData.qualifications,
            clinicAddress: professionalData.clinicAddress,
            consultationFee: professionalData.consultationFee,
            About: professionalData.About
          }

        });
        console.log("Professional info successfully updated!");
      } catch (error) {
        console.error("Error updating professional info:", error);
      }
    } else {
      console.error("No user is currently logged in.");
    }

  }

  const handlePersonalInfo = (e) => {
    setPersonaHidden(!PersonalHidden);
    setProfessionalHidden(true);
    setProfileHidden(true);


  }

  const handleProfessionalInfo = (e) => {
    setPersonaHidden(true);
    setProfessionalHidden(!ProfessionalHidden);
    setProfileHidden(true);
  }

  const handleProfile = (e) => {
    setPersonaHidden(true);
    setProfessionalHidden(true);
    setProfileHidden(!ProfileHidden);
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




  const getDoctorData = async (doctorId) => {

    const user = auth.currentUser;

    const doctorDocRef = doc(db, "doctors", user.uid);
    const doctorDocSnap = await getDoc(doctorDocRef);

    if (doctorDocSnap.exists()) {
      return doctorDocSnap.data();
    } else {
      console.error("No such doctor!");
      return null;
    }
  };

  // getDoctorData()


  return (
    <div className='bg-[#f0f0f0] min-h-screen p-5'>
      <h1 className='text-2xl font-semibold mb-5'>Doctor Profile</h1>

      <div className='flex justify-between space-x-3'>

        {/* leftside */}
        <div className='border-[1px] mt-4 p-4 border-gray-300 rounded-md w-[65%] sm:w-[80%] bg-white shadow-lg'>
          <p className='text-lg font-medium mb-3'>Overview</p>

          {/* Profile */}
          <div>
            <div className=" w-[130%] sm:flex sm:space-x-4 sm:items-start mt-4 text-[14px]">
              {/* Doctor Profile Card */}
              <div className="border rounded-md p-6 mt-4 shadow-lg bg-white sm:w-[55%] hover:scale-105 transition-transform duration-300">
                <Card />
              </div>

              {/* Stats */}
              <div className="md:flex   md:space-x-10">
                <div className="text-center border rounded-md p-6 mt-4 bg-gradient-to-r from-blue-200 via-blue-100 to-white shadow-lg sm:w-auto hover:shadow-2xl transition duration-300">
                  <p className="text-3xl font-bold text-blue-600">499</p>
                  <p className="text-lg text-gray-700">Patients</p>
                </div>
                <div className="text-center border rounded-md p-6 mt-4 bg-gradient-to-r from-green-200 via-green-100 to-white shadow-lg sm:w-auto hover:shadow-2xl transition duration-300">
                  <p className="text-3xl font-bold text-green-600">499</p>
                  <p className="text-lg text-gray-700">Reviews</p>
                </div>
              </div>
            </div>
          
        </div>

        {/* Personal Info */}
        {/* <div hidden={PersonalHidden} className='mt-3'>
            <form onSubmit={handleSubmit}>
              <div className='grid sm:grid-cols-3 gap-5 text-[12px]'>
                FirstName
                <div>
                  <label htmlFor="firstName">First Name:</label>
                  <input type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    className='border p-2 w-full mt-1 text-[12px] placeholder-[#212529]'
                    value={formData.firstName}
                    onChange={handleChange} />
                </div>
                LastName
                <div>
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    type="text"
                    id="lastName"
                    placeholder="Enter your last name"
                    name="lastName"
                    className='border mt-1 p-2 w-full placeholder-[#212529]'
                    value={formData.lastName}
                    onChange={handleChange} />
                </div>
                Age
                <div>
                  <label htmlFor="age">Age:</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    placeholder="Enter your age"
                    className='border p-2 mt-1 w-full placeholder-[#212529]'
                    value={formData.age}
                    onChange={handleChange} />
                </div>
                Gender
                <div>
                  <label htmlFor="gender">Gender:</label>
                  <select
                    id="gender"
                    name="gender"
                    className='border p-2 w-full mt-1'
                    value={formData.gender}
                    onChange={handleChange}>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                unique id
                <div>
                  <label htmlFor="uniqueId">Unique ID:</label>
                  <input
                    type="text"
                    id="uniqueId"
                    name="uniqueId"
                    placeholder="Enter your unique id"
                    className='border p-2 w-full placeholder-[#212529] mt-1' 
                    value={formData.uniqueId}
                    onChange={handleChange} />
                </div>
                Mobile number
                <div>
                  <label htmlFor="mobileNumber">Mobile Number:</label>
                  <input
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    placeholder="Enter your mobile number"
                    className='border p-2 w-full mt-1 placeholder-[#212529]'
                    value={formData.mobileNumber}
                    onChange={handleChange} />
                </div>
                Country
                <div>
                  <label htmlFor="country">Country:</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    placeholder="Enter your country"
                    className='border p-2 w-full mt-1 placeholder-[#212529]'
                    value={formData.country}
                    onChange={handleChange} />
                </div>
                State
                <div>
                  <label htmlFor="state">State:</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    placeholder="Enter your state"
                    className='border p-2 w-full mt-1 placeholder-[#212529]'
                    value={formData.state}
                    onChange={handleChange} />
                </div>
                City
                <div>
                  <label htmlFor="city">City:</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="Enter your city"
                    className='border p-2 w-full mt-1 placeholder-[#212529]'
                    value={formData.city}
                    onChange={handleChange} />
                </div>
                Postal Code
                <div>
                  <label htmlFor="postalCode">Postal Code:</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    placeholder="Enter your postal code"
                    className='border p-2 w-full mt-1 placeholder-[#212529] '
                    value={formData.postalCode}
                    onChange={handleChange} />
                </div>
              </div>
              <div>
                <button type="submit" className='bg-blue-500 text-white p-2 mt-3 px-8 text-[11px] rounded'>Submit</button>
              </div>
              
            </form>
          </div> */}

        {/* Professional Info */}
        {/* <div
          hidden={ProfessionalHidden}>
            <div className='mt-3'>
              <form onSubmit={handleProfessionalSubmit}>
                <div className='grid sm:grid-cols-3  gap-5 text-[12px]'>
                  Specialization
                  <div>
                    <label htmlFor="specialization">Specialization:</label>
                    <input
                      type="text"
                      id="specialization"
                      name="specialization"
                      placeholder="Enter your specialization"
                      className='border p-2 w-full mt-1 placeholder-[#212529]'
                      value={professionalData.specialization}
                      onChange={handleProfessionalChange} />
                  </div>
                  Experience
                  <div>
                    <label htmlFor="experience">Experience (years):</label>
                    <input
                      type="number"
                      id="experience"
                      name="experience"
                      placeholder="Enter your experience"
                      className='border p-2 w-full mt-1 placeholder-[#212529]'
                      value={professionalData.experience}
                      onChange={handleProfessionalChange} />
                  </div>
                  Qualifications
                  <div>
                    <label htmlFor="qualifications">Qualifications:</label>
                    <input
                      type="text"
                      id="qualifications"
                      name="qualifications"
                      placeholder="Enter your qualifications"
                      className='border p-2 w-full mt-1 placeholder-[#212529]'
                      value={professionalData.qualifications}
                      onChange={handleProfessionalChange} />
                  </div>
                  Clinic Address
                  <div>
                    <label htmlFor="clinicAddress">Clinic Address:</label>
                    <input
                      type="text"
                      id="clinicAddress"
                      name="clinicAddress"
                      placeholder="Enter your clinic address"
                      className='border p-2 w-full mt-1 placeholder-[#212529]'
                      value={professionalData.clinicAddress}
                      onChange={handleProfessionalChange} />
                  </div>
                  Consultation Fee
                  <div>
                    <label htmlFor="consultationFee">Consultation Fee:</label>
                    <input
                      type="number"
                      id="consultationFee"
                      name="consultationFee"
                      placeholder="Enter your consultation fee"
                      className='border p-2 w-full mt-1 placeholder-[#212529]'
                      value={professionalData.consultationFee}
                      onChange={handleProfessionalChange} />
                  </div><br />
                
                </div>
                  About
                  <div className='text-[12px] mt-2'>
                    <label htmlFor="About">About:</label><br />
                    <textarea
                      id="About"
                      name="About"
                      placeholder="Write About yourself"
                      className='border p-2 h-24 w-[80%] mt-1 placeholder-[#212529]'
                      value={professionalData.About}
                      onChange={handleProfessionalChange} />
                  </div>
                <div>
                  <button type="submit" className='bg-blue-500 text-white p-2 mt-3 px-8 text-[11px] rounded'>Submit</button>
                </div>
              </form>
            </div>
          </div> */}

      </div>

      {/* rightside */}
      <div className='border-[1px] p-4 mt-4 rounded-md border-gray-300 w-[35%] sm:w-[20%] bg-white shadow-lg'>
        <button
          onClick={handleProfile}
          className='w-full bg-blue-500 text-white p-1 mt-2 rounded hover:bg-blue-600 transition duration-300'>
          Profile
        </button><br />
        {/* <button
            onClick={handlePersonalInfo}
            className='w-full bg-blue-500 text-white p-1 mt-2 rounded hover:bg-blue-600 transition duration-300'>
            Personal Info
          </button><br />
          <button
            onClick={handleProfessionalInfo}
            className='w-full bg-blue-500 text-white p-1 mt-2 rounded hover:bg-blue-600 transition duration-300'>
            Professional Info
          </button><br /> */}
        <button
          onClick={handleLogout}
          className='w-full inline-block text-center bg-red-500 text-white p-1 mt-2 rounded hover:bg-red-600 transition duration-300'>
          Logout
        </button>
      </div>
    </div>

      
    </div >
  );
};

export default DoctorProfile;

