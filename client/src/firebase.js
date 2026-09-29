import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyBK_V_6Gkz8BbZLPJyYZvDQhviJf5ZEK6o",
  authDomain: "exploreblog-50b30.firebaseapp.com",
  projectId: "exploreblog-50b30",
  storageBucket: "exploreblog-50b30.firebasestorage.app",
  messagingSenderId: "311889944083",
  appId: "1:311889944083:web:a770a8c57b384a2abf29e6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);