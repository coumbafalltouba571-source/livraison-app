import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyClqBEiEckYUdxqL24Tx2EU8NBKVHN6dIQ",
  authDomain: "livraison-app-5154a.firebaseapp.com",
  projectId: "livraison-app-5154a",
  storageBucket: "livraison-app-5154a.firebasestorage.app",
  messagingSenderId: "853244578630",
  appId: "1:853244578630:web:d6dd2ca61df4b6a8543347"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

export default app;
