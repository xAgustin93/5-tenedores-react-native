import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDcytrPy5n59ivxoMFvXlxaQAwzJNzgUUM",
  authDomain: "tenedores-v2-e1b18.firebaseapp.com",
  projectId: "tenedores-v2-e1b18",
  storageBucket: "tenedores-v2-e1b18.appspot.com",
  messagingSenderId: "218041466382",
  appId: "1:218041466382:web:1e7565218f364af352865f",
};

export const initFirebase = initializeApp(firebaseConfig);
export const db = getFirestore(initFirebase);
