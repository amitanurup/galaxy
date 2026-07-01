import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

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

const readDB = async () => {
  try {
    const docRef = doc(db, "app_data", "main");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(JSON.stringify(docSnap.data().users, null, 2));
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.error("Error reading database:", error);
  }
  process.exit(0);
};

readDB();
