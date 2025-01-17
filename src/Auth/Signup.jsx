import React, { useEffect, useState } from 'react'
import { useAuth } from './AuthContext'
import { auth, db } from '../Firebase-Config'
import { collection, addDoc, setDoc, doc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth';


const Signup = () => {

  //user signup input
  const { username, setUsername,
    email, setEmail,
    password, setPassword,
    ConfirmPassword, setConfirmPassword
  } = useAuth();
  const [userCredential, setUserCredential] = useState(null);
  const { role, setRole } = useAuth();
  const navigate = useNavigate();

  //user signup error
  const [userError, setUserError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [ConfirmPasswordError, setConfirmPasswordError] = useState(null);
  const [displayError, setDisplayError] = useState(true);

  const [totalPatient, setTotalPatient] = useState(() => {
    const data = localStorage.getItem("totalPatient")
    return data ? JSON.parse(data) : []
  })


  const handleUser = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (username === "") {
      setUserError("Please fill username field");
      isValid = false;
    } else if (username.includes("@")) {
      setUserError("Username cannot contain @");
      isValid = false;
    } else {
      setUserError(null);
      // setDisplayError(false);
    }

    if (email === "") {
      setEmailError("Please fill Email field");
      isValid = false;
    } else {
      setEmailError(null)
      setDisplayError(true);
    }

    if (!password) {
      setPasswordError("Please fill password field");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    } else if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password) || !/[!@#$%^&*()_+]/.test(password)) {
      setPasswordError("Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character");
      isValid = false;
    } else {
      setPasswordError(null);
    }

    if (!ConfirmPassword) {
      setConfirmPasswordError("Please fill ConfirmPassword field");
      isValid = false;
    } else if (password !== ConfirmPassword) {
      setConfirmPasswordError("Password does not match");
      isValid = false;
    } else {
      setConfirmPasswordError(null);
    }

    if (!isValid) {
      setDisplayError(false);
      return;
    } else {
      setDisplayError(true);
    }

    console.log(username, email, password, role);

    // Add user to firestore and signup with email and password 
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user to firestore  based on role   
      if (role === 'admin') {
        await setDoc(doc(db, 'admin', user.uid), {
          username: username,
          email: email,
          role: role,
          password: password
        });
      
      } else {
        const patientInfo = {
          username: username,
          email: email,
          role: role,
          uid: user.uid
        }
        await setDoc(doc(db, 'patients', user.uid), {
         patientInfo: patientInfo,
        });

        setTotalPatient((prev) => {
          const updateInfo = [...prev, patientInfo]
          localStorage.setItem("totalPatient", JSON.stringify(updateInfo))
          return updateInfo
        })
         
      }

      // Redirect based on role after successful signup
      if (role === 'admin') {
        navigate('/admin');
      }
      else {
        navigate('/patient');
      }

      setUsername('');
      setEmail('');
      setPassword('');
      alert("User registered successfully");
    } catch (error) {
      console.log(error);

    }


  }




  return (
    <div className='bg-[#f1f1f1] h-screen flex justify-center items-center'>
      <div className='shadow-lg shadow-slate-300 bg-white border-[#333] w-[350px] p-5 rounded-md  text-center'>
        <p className='text-lg font-semibold'>SignUp</p>
        <form onSubmit={handleUser}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}

            className='py-[8px] px-[10px] w-full bg-white border-[1px] border-[#333] rounded-md
            outline-none my-2 text-[12px] text-black placeholder:text-[#212529]'
          />
          <p hidden={displayError}
            className='text-left text-[10px] font-medium  text-red-500'>
            {userError}
          </p>

          <input
            type="email"
            placeholder="Email"
            value={email}
            // required
            onChange={(e) => setEmail(e.target.value)}
            className='py-[8px] px-[10px] w-full bg-white border-[1px] border-[#333] rounded-md
            outline-none my-2 text-[12px] text-black placeholder:text-[#212529]'
          />
          <p hidden={displayError}
            className='text-left text-[10px] font-medium text-red-500'>
            {emailError}
          </p>


          <input
            type="password"
            placeholder="Password"
            value={password}
            // required
            onChange={(e) => setPassword(e.target.value)}
            className='py-[8px] px-[10px] w-full bg-white border-[1px] border-[#333] rounded-md
            outline-none my-2 text-[12px] text-black placeholder:text-[#212529]'
          />
          <p hidden={displayError}
            className='text-left text-[10px] font-medium text-red-500'>
            {passwordError}
          </p>

          <input
            type='password'
            placeholder='ConfirmPassword'
            value={ConfirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='py-[8px] px-[10px] w-full bg-white border-[1px] border-[#333] rounded-md
          outline-none my-2 text-[12px] text-black placeholder:text-[#212529]'
          />
          <p hidden={displayError}
            className='text-left text-[10px] font-medium text-red-500'>
            {ConfirmPasswordError}
          </p>

          <select
            value={role}
            required
            onChange={(e) => setRole(e.target.value)}
            className='py-[8px] px-[10px] w-full bg-white border-[1px] border-[#333] rounded-md
           outline-none my-2 text-[12px] text-black placeholder:text-[#212529]'>
            <option
              value="" className='bg-blue-500 text-white'>Select Role</option>
            <option value="admin">Admin</option>

            <option
              value="patient"
              className='bg-blue-500 text-white'>
              Patient 🩺
            </option>

           
          </select>
          <br />

          <div className='flex space-x-6 justify-center items-center mt-4'>
            <button
              type="submit"
              className='py-[5px] px-[18px]  bg-blue-500 text-white rounded-md hover:bg-blue-600
              outline-none text-[14px] transition-all duration-300' >
              Sign Up
            </button>
            <Link
              to='/login'
              className='text-[13px] text-blue-500 hover:text-blue-600 transition-all duration-300 underline'>
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}



export default Signup