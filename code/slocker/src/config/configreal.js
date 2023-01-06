import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDMS9B-KJef2SlUCLWZZFv-PWHA_O-LiYg",
    authDomain: "slocker-6a0e7.firebaseapp.com",
    databaseURL: "https://slocker-6a0e7-default-rtdb.firebaseio.com",
    projectId: "slocker-6a0e7",
    storageBucket: "slocker-6a0e7.appspot.com",
    messagingSenderId: "577241791689",
    appId: "1:577241791689:web:461c887a6cbd41fae86118",
    measurementId: "G-X64C47EMTK"
  };

const app = initializeApp(firebaseConfig);
export const realdb = getDatabase(app);
