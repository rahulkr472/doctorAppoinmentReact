import { getDoc, doc } from "firebase/firestore"; 
import { db, auth } from "./Firebase-Config";

 const getUserInfo = async () => {
  const user = auth.currentUser;
  
  if (user) {
    try {
      // Fetch Personal Info
      const personalDocRef = doc(db, 'doctors', user.uid, 'detail', 'PersonalInfo');
      const personalDocSnap = await getDoc(personalDocRef);

      // Fetch Professional Info
      const professionalDocRef = doc(db, 'doctors', user.uid, 'detail', 'ProfessionalInfo');
      const professionalDocSnap = await getDoc(professionalDocRef);

      if (personalDocSnap.exists() && professionalDocSnap.exists()) {
        const personalData = personalDocSnap.data();
        const professionalData = professionalDocSnap.data();

        // Combine both pieces of data into one object
        const userData = {
          personal: personalData,
          professional: professionalData
        };

        // Log and return the data in JSON format
        console.log(JSON.stringify(userData, null, 2));
        return userData;
      } else {
        console.error("No document found!");
      }
    } catch (error) {
      console.error("Error fetching documents: ", error);
    }
  } else {
    console.error("No user is signed in.");
  }
};

export default getUserInfo();

