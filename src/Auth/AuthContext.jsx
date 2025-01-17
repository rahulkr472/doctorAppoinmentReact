import React, { createContext, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {

   

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState(""); 


      const [userPersonalInfo, setUserPersonalInfo] = useState("")
      const [userProfessionalInfo, setUserProfessionalInfo] = useState("")
      const [imageSrc, setImageSrc] = useState()
      const [image, setImage] = useState()

      //patient


      const [appoinment, setAppoinment] = React.useState([])

      const [doctor, setDoctor] = useState([])

    

      
    const [patientPersonalInfo, setPatientPersonalInfo] = useState()
    const [patientMedicalInfo, setPatientMedicalInfo] = useState()

    const [accept, setAccept] = useState([])

    return (
        <AuthContext.Provider value={{ username, setUsername, 
        email, setEmail,
        password, setPassword ,
        role, setRole,
        ConfirmPassword, setConfirmPassword,
        userPersonalInfo, setUserPersonalInfo,
        userProfessionalInfo, setUserProfessionalInfo,
        imageSrc, setImageSrc,
        image, setImage,
        appoinment, setAppoinment,
        doctor, setDoctor,
        patientPersonalInfo,setPatientPersonalInfo,
        patientMedicalInfo, setPatientMedicalInfo,
        accept, setAccept
        
        }}>
        {children}
        </AuthContext.Provider>
    )
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthProvider;