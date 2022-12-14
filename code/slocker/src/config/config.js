import * as firebase from 'firebase'

import 'firebase/storage';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDMS9B-KJef2SlUCLWZZFv-PWHA_O-LiYg",
    authDomain: "slocker-6a0e7.firebaseapp.com",
    projectId: "slocker-6a0e7",
    storageBucket: "slocker-6a0e7.appspot.com",
    messagingSenderId: "577241791689",
    appId: "1:577241791689:web:461c887a6cbd41fae86118",
    measurementId: "G-X64C47EMTK"
  };

  firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { auth, db, storage }