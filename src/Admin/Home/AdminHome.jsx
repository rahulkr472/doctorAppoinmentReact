import React from 'react'
import { useState } from 'react';
import { useAuth } from '../../Auth/AuthContext';
import { db, auth } from '../../Firebase-Config';
import { collection, addDoc, getDoc, setDoc, doc, updateDoc } from 'firebase/firestore'
import { Link, useNavigate } from 'react-router-dom'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

const AdminHome = () => {




    const [name, setName] = useState("");
    const { email, setEmail } = useAuth()
    const { password, setPassword } = useAuth()
    const [specialization, setSpecialization] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("")
    const [experience, setExperience] = useState("")
    const [qualifications, setQualifications] = useState("")
    const [schedule, setSchedule] = useState("")
    const [status, setStatus] = useState("")
    const [dob, setDob] = useState("")
    const [fee, setFee] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [country, setCountry] = useState("")
    const [doctorSignUpInfo, setDoctorSignUpInfo] = useState(() => {
        const data = localStorage.getItem("doctorInfo")
        return data ? JSON.parse(data) : []
    })

    const [profilePicture, setProfilePicture] = useState(null)
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const user = auth.currentUser;
        console.log(user.uid);
        console.log(user.email);

        if (user) {
            try {
                // Ensure the current user is authenticated and authorized (admin check)
                const userDoc = doc(db, "admin", user.uid);
                const userSnap = await getDoc(userDoc);

                if (userSnap.exists() && userSnap.data().role === "admin") {
                    console.log("Authenticated as admin");

                    // Store admin credentials
                    const adminEmail = user.email;
                    const adminPassword = userSnap.data().password; // Ensure this is securely handled

                    // Create the doctor in Firebase Authentication
                    const doctorCredentials = await createUserWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );

                    const doctorUID = doctorCredentials.user.uid;
                    console.log();
                    

                    const doctorSignUpinfo = {
                        name,
                        email,
                        specialization,
                        phone,
                        role: "doctor",
                        uid: doctorUID,
                        profilePicturePreview,
                        gender,
                        dob,
                        experience,
                        qualifications,
                        schedule,
                        fee,
                        status,
                        address,
                        city,
                        state,
                        country

                    }

                    // Add doctor details to Firestore
                    const doctorDoc = doc(db, "doctors", doctorUID);
                    await setDoc(doctorDoc, {
                        doctorSignUpinfo: doctorSignUpinfo

                    });

                    // Update the state and localStorage
                    // Update the state and localStorage
                    setDoctorSignUpInfo((prev) => {
                        const updatedInfo = [...prev, doctorSignUpinfo];
                        localStorage.setItem("doctorInfo", JSON.stringify(updatedInfo)); // Update localStorage
                        return updatedInfo; // Update the state
                    });

                    alert("Doctor added successfully!");

                    // Re-authenticate admin
                    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
                    console.log("Admin re-authenticated!");

                    // Reset the form
                    setName("");
                    setEmail("");
                    setSpecialization("");
                    setPhone("");
                    setPassword("");
                } else {
                    console.log("You are not authorized to perform this action");
                }
            } catch (error) {
                console.error("Error adding doctor:", error.message);
                alert("Error adding doctor: " + error.message);
            }
        } else {
            console.log("User not found");
        }
    };



    const handleImage = (e) => {

        const file = e.target.files[0];
        setProfilePicture(file);

        // Convert the file to a base64 string using FileReader
        const reader = new FileReader();
        reader.onloadend = () => {
            setProfilePicturePreview(reader.result);  // Base64 string of the image
        };
        if (file) {
            reader.readAsDataURL(file);  // Convert the image file to base64
        }

    }

    // console.log(profilePicturePreview);





    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
            <header className="w-full bg-blue-600 text-white py-4 text-center">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </header>
            <main className="w-full max-w-3xl bg-white rounded-lg shadow-lg mt-6 p-6">
                <h2 className="text-xl font-semibold mb-4">Add Doctor</h2>
                <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="name">
                            Doctor Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter doctor's name"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="email">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            name="email"
                            placeholder="Enter doctor's email"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="phone">
                            Phone Number
                        </label>
                        <input
                            type="number"
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            name="phone"
                            placeholder="Enter doctor's phone number"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="password">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password"
                            placeholder="Enter password for doctor"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="profilePicture">
                            Profile Picture
                        </label>
                        <input
                            type="file"
                            id="profilePicture"
                            name="profilePicture"
                            onChange={handleImage}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="gender">
                            Gender
                        </label>
                        <select
                            id="gender"
                            name="gender"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="dob">
                            Date of Birth
                        </label>
                        <input
                            type="date"
                            id="dob"
                            name="dob"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="specialization">
                            Specialization
                        </label>
                        <select
                            id="specialization"
                            name="specialization"
                            value={specialization}
                            onChange={(e) => setSpecialization(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Select Specialization</option>
                            <option value="cardiology">Cardiology</option>
                            <option value="dermatology">Dermatology</option>
                            <option value="neurology">Neurology</option>
                            <option value="orthopedics">Orthopedics</option>
                            <option value="pediatrics">Pediatrics</option>
                            <option value="general">General Medicine</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="experience">
                            Years of Experience
                        </label>
                        <input
                            type="number"
                            id="experience"
                            name="experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            placeholder="Enter years of experience"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="qualifications">
                            Qualifications
                        </label>
                        <input
                            type="text"
                            id="qualifications"
                            name="qualifications"
                            value={qualifications}
                            onChange={(e) => setQualifications(e.target.value)}
                            placeholder="Enter degrees or certifications"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="schedule">
                            Work Schedule
                        </label>
                        <input
                            type="text"
                            id="schedule"
                            name="schedule"
                            value={schedule}
                            onChange={(e) => setSchedule(e.target.value)}
                            placeholder="e.g., Mon-Fri, 9 AM - 5 PM"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="fee">
                            Consultation Fee
                        </label>
                        <input
                            type="number"
                            id="fee"
                            name="fee"
                            value={fee}
                            onChange={(e) => setFee(e.target.value)}
                            placeholder="Enter consultation fee"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="status">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">Status</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    {/* Address */}
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="address">
                            Address
                        </label>
                        <textarea
                            id="address"
                            name="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Enter full address"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                    </div>

                    {/* City */}
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="city">
                            City
                        </label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="Enter city"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* State */}
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="state">
                            State
                        </label>
                        <input
                            type="text"
                            id="state"
                            name="state"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="Enter state"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    {/* Country */}
                    <div>
                        <label className="block text-gray-700 font-medium" htmlFor="country">
                            Country
                        </label>
                        <input
                            type="text"
                            id="country"
                            name="country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Enter country"
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div className="text-right">
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                        >
                            Add Doctor
                        </button>
                    </div>

                </form>
            </main>
        </div>
    )
}

export default AdminHome