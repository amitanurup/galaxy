import { initializeApp } from "firebase/app";
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAAI5noMDFg0bfLcolNBf9XT-diORXTt0g",
  authDomain: "galaxy-cartridge-care.firebaseapp.com",
  projectId: "galaxy-cartridge-care",
  storageBucket: "galaxy-cartridge-care.firebasestorage.app",
  messagingSenderId: "806916852751",
  appId: "1:806916852751:web:bb1c7eb1a7130e3430677a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const reset = async () => {
  try {
    const docRef = doc(db, "app_data", "main");
    await updateDoc(docRef, {
      users: [
        { id: "ADMIN", name: "Admin", role: "admin", pin: "0000" },
        { id: "ENG-01", name: "Engineer 1", role: "engineer", pin: "1234" },
      ]
    });
    console.log("Users reset to default successfully.");
  } catch (error) {
    console.error("Error resetting users:", error);
  }
  process.exit(0);
};

reset();
