import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Vérifier que les clés Firebase sont configurées
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";

// Détecter les clés fictives ou vides
const isFakeKey = !apiKey || apiKey.startsWith("AIzaSyD") && apiKey.includes("x") && apiKey.length < 30;
const isFakeProjectId = !projectId || projectId === "livraison-app" && !apiKey;

if (!apiKey || isFakeKey) {
  console.error("❌ ERREUR CRITIQUE: Firebase API Key manquante ou fictive!");
  console.error("   Valeur actuelle:", apiKey.substring(0, 20) + "...");
  console.error("   Créez un fichier .env.local avec vos clés Firebase réelles");
  console.error("   Consultez Firebase Console pour obtenir les bonnes clés");
  console.error("   Instructions: https://console.firebase.google.com → Paramètres du projet → Général");
}

if (isFakeProjectId) {
  console.error("❌ ERREUR CRITIQUE: Firebase Project ID invalide!");
  console.error("   Valeur actuelle:", projectId);
}

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "livraison-app.firebaseapp.com",
  projectId: projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "livraison-app.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

console.log("🔥 Configuration Firebase chargée:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKeyConfigured: !!apiKey && !isFakeKey,
  apiKeyWarning: isFakeKey ? "⚠️ CLÉ FICTIVE/VIDE DÉTECTÉE!" : "✅ OK",
});

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);