import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCEEZ1WLT4bpObGhckaVK0RVgpW9iG06dA",
  authDomain: "casanova-f16d5.firebaseapp.com",
  projectId: "casanova-f16d5",
  storageBucket: "casanova-f16d5.firebasestorage.app",
  messagingSenderId: "458099381179",
  appId: "1:458099381179:web:7c4a8a92c503b3fa6faa9e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
