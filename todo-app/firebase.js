// Import Firebase functions

import { initializeApp } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import { getAuth } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import { getFirestore } from 
"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";



// Your Firebase configuration

const firebaseConfig = {

  apiKey: "AIzaSyAj-GrWtm_E0qRQpb84veHMd5JSRtRM1z4",

  authDomain: "my-todo-app-a8f44.firebaseapp.com",

  projectId: "my-todo-app-a8f44",

  storageBucket: "my-todo-app-a8f44.firebasestorage.app",

  messagingSenderId: "21136143160",

  appId: "1:21136143160:web:3f92094928140cbedb87cd",

  measurementId: "G-GV796NLY5Y"

};



// Initialize Firebase

const app = initializeApp(firebaseConfig);



// Authentication

const auth = getAuth(app);



// Firestore Database

const db = getFirestore(app);



// Export

export { auth, db };