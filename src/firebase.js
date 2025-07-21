import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD0PjUpLkTIDkOTmdvlnCFahVQtjCX0h_U",
  authDomain: "crm-app-bf0fd.firebaseapp.com",
  projectId: "crm-app-bf0fd",
  storageBucket: "crm-app-bf0fd.appspot.com",
  messagingSenderId: "514522011841",
  appId: "1:514522011841:web:d7b03c73b582f7833e1c40"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
