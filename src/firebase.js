// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBkTC_oJXL1BCoodTvv1e21j6wLKO3L7jQ",
  authDomain: "sistema-salao-6b6bf.firebaseapp.com",
  databaseURL: "https://sistema-salao-6b6bf-default-rtdb.firebaseio.com",
  projectId: "sistema-salao-6b6bf",
  storageBucket: "sistema-salao-6b6bf.firebasestorage.app",
  messagingSenderId: "851895404729",
  appId: "1:851895404729:web:5b9636660fc15111fbb368",
  measurementId: "G-83CY590NMR"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Prepara e exporta a Autenticação (Login) e o Banco de Dados (Firestore)
export const auth = getAuth(app);
export const db = getFirestore(app);    