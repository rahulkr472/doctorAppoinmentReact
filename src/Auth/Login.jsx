import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { auth } from '../Firebase-Config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../Firebase-Config';


const Login = () => {

    //user 
    const { email, setEmail, password, setPassword } = useAuth();
    const navigate = useNavigate();



    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const doctorDoc = await getDoc(doc(db, 'doctors', user.uid));
            const patientDoc = await getDoc(doc(db, 'patients', user.uid));
            const adminDoc = await getDoc(doc(db, 'admin', user.uid));
            
        //    console.log(doctorDoc.uid);
        //    console.log(adminDoc.uid);
            // Log document IDs to verify they exist
    console.log("Admin Doc ID:", adminDoc.exists() ? adminDoc.id : "Not Found");
    console.log("Doctor Doc ID:", doctorDoc.exists() ? doctorDoc.id : "Not Found");
    console.log("Patient Doc ID:", patientDoc.exists() ? patientDoc.id : "Not Found");
           
           

            if (doctorDoc.exists()) {
                const userData = doctorDoc.data();
                console.log(userData?.doctorSignUpinfo.role);
                
                const userRole = userData?.doctorSignUpinfo.role || "";

                // Redirect based on role after successful login
                if (userRole === 'doctor') {
                    navigate('/doctor/appointment');
                }


                setEmail('');
                setPassword('');

            } else if(adminDoc.exists()){
                const userData = adminDoc.data();
                const userRole = userData.role;

                // Redirect based on role after successful login
                if (userRole === 'admin') {
                    navigate('/admin');
                }


                setEmail('');
                setPassword('');
            }
             else if (patientDoc.exists()) {

                const userData = patientDoc.data();
                const userRole = userData?.patientInfo.role || "";

                console.log("User logged in successfully:", user);
                console.log("User role:", userRole);

                // Redirect based on role after successful login
                if (userRole === 'patient') {
                    navigate('/patient');
                }

                setEmail('');
                setPassword('');
            } else {
                alert("User not found");
            }

        } catch (error) {
            console.error("Login error:", error);
            alert("User not found! pls sign up");
        }



    }

    //  alert(role)


    return (
        <div className='bg-[#f1f1f1] h-screen flex justify-center items-center'>
          <div className='text-center shadow-lg shadow-slate-300 bg-white border-[#333] w-[350px] p-5 rounded-md'>
          <h2 className='text-lg font-semibold'>Login</h2>
            <form >
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='py-[8px] px-[10px] w-full bg-white border-[1px] border-[#333] rounded-md
                          outline-none my-2 text-[12px] text-black placeholder:text-[#212529]'
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='py-[8px] px-[10px] w-full bg-white border-[1px] border-[#333] rounded-md
                          outline-none my-2 text-[12px] text-black placeholder:text-[#212529]'
                    /><br />

                    <div className='flex space-x-6 justify-center items-center mt-4'>
                    <button 
                    onClick={handleLogin}
                    className='py-[5px] px-[18px]  bg-blue-500 text-white rounded-md hover:bg-blue-600
                    outline-none text-[14px] transition-all duration-300' >Login</button>
                    <Link to="/">
                        <p  className='text-[13px] text-blue-500 hover:text-blue-600 transition-all duration-300 underline'>
                            Sign Up
                        </p>
                    </Link>
                    </div>
                   
            </form>
          </div>
           
        </div>
    );
};

export default Login;