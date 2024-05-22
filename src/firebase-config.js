import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCOS7o0Fm7JnOFiSoKxbrxMTd6L-dcmPNM",
  authDomain: "chatapp-59df4.firebaseapp.com",
  projectId: "chatapp-59df4",
  storageBucket: "chatapp-59df4.appspot.com",
  messagingSenderId: "763217282474",
  appId: "1:763217282474:web:e419c54b0ad8a33fe457d3"
};


const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const storage = getStorage(app);


