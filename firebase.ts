import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "TON_API_KEY",
  authDomain: "livraison-app.firebaseapp.com",
  projectId: "livraison-app",
  storageBucket: "livraison-app.appspot.com",
  messagingSenderId: "123456",
  appId: "123456"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);