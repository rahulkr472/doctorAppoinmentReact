import React, { useEffect } from 'react'
import { auth, db } from '../../Firebase-Config'
import { collection, doc, getDoc, updateDoc } from 'firebase/firestore'
import { useState } from 'react'
import { use } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { setDoc } from 'firebase/firestore'
import { useAuth } from '../../Auth/AuthContext'

const Card = () => {

      const { userPersonalInfo, setUserPersonalInfo } = useAuth();


    
    
    

      useEffect(() => { 
       
        const unsubscribe = onAuthStateChanged(auth, (user) => {


            if (user) {
                fetchPersonalInfo(user.uid);
            } else {
                console.log("No user is signed in");
                setUserPersonalInfo(null);

            }
        })

        return () => unsubscribe();



       
       }, [])

       const fetchPersonalInfo = async (uid) => {

        try {
            const snapshot = await getDoc(doc(db, 'doctors', uid));
            if (snapshot.exists()) {
                const userData = snapshot.data();
                console.log(userData);
                
                setUserPersonalInfo(userData.doctorSignUpinfo);

            } else {
                console.log("User not found");
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
   
}            











return (
    <div className=" md:w-[100%] p-5">
    <div className="card md:flex items-center md:space-x-8 bg-white p-6 rounded-lg shadow-lg ">
      {/* Profile Picture */}
      <div className="w-40 md:w-36 h-40  md:h-36 overflow-hidden rounded-full  border-2 border-blue-500">
        <img
          src={userPersonalInfo.profilePicturePreview || "https://via.placeholder.com/150"}
          alt="Profile"
          className="w-44 md:w-36 h-40  md:h-36"
        />
      </div>
  
      {/* Info Section */}
      <div className="text-[16px] sm:mt-8">
        {/* Name and Role */}
        <p className="text-gray-600">Hello, I am</p>
        <h2 className="text-xl font-bold text-gray-800">
          Mr. {userPersonalInfo.name || "N/A"}
        </h2>
        <p className="text-blue-500 font-medium text-sm capitalize">
          {userPersonalInfo.role || "N/A"}
        </p>
  
        {/* Qualifications and Specialization */}
        <p className="text-gray-600 mt-2">
          <span>{userPersonalInfo.qualifications || "N/A"}</span>,{" "}
          <span>{userPersonalInfo.specialization || "N/A"}</span>
        </p>
  
        {/* Experience and Reviews */}
        <p className="text-gray-600">
          {userPersonalInfo.experience || "N/A"} Years Experience Overall
        </p>
        <p className="text-gray-600">466 Reviews</p>
  
        {/* Email and Phone */}
        <div className="mt-3 space-y-1">
          <p className="flex items-center text-gray-600">
            <span className="material-icons text-blue-500 mr-2">email</span>
            {userPersonalInfo.email || "N/A"}
          </p>
          <p className="flex items-center text-gray-600">
            <span className="material-icons text-blue-500 mr-2">phone</span>
            {userPersonalInfo.phone || "N/A"}
          </p>
        </div>
  
        {/* Schedule and Fee */}
        <div className="mt-3 space-y-1">
          <p className="flex items-center text-gray-600">
            <span className="material-icons text-blue-500 mr-2">schedule</span>
            {userPersonalInfo.schedule || "N/A"}
          </p>
          <p className="flex items-center text-gray-600">
            <span className="material-icons text-blue-500 mr-2">attach_money</span>
            Fee: ₹{userPersonalInfo.fee || "N/A"}
          </p>
        </div>
  
        {/* Status Badge */}
        <div className="mt-4">
          <span
            className={`px-3 py-1 rounded-full text-white text-xs ${
              userPersonalInfo.status === "active"
                ? "bg-green-500"
                : "bg-gray-500"
            }`}
          >
            {userPersonalInfo.status || "N/A"}
          </span>
        </div>
      </div>
    </div>
  </div>
  
);
}

export default Card