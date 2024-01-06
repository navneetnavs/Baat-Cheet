import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyBPosplIjxRj56-uUFaOVyJf-uXUNKU9Wk",
  authDomain: "chat-68f5f.firebaseapp.com",
  projectId: "chat-68f5f",
  storageBucket: "chat-68f5f.appspot.com",
  messagingSenderId: "680323932305",
  appId: "1:680323932305:web:57782696eac19e01551f30"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth()
export const storage = getStorage()
export const db = getFirestore()