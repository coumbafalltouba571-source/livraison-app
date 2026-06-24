import { initializeApp } from "firebase/app";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getAuth, type Auth } from "firebase/auth";

// Vérifier que les clés Firebase sont configurées
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "";
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "";
const authDomain = process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "";

// Détection STRICTE des clés fictives
const isFakeKey = 
  !apiKey || 
  apiKey.includes("xxx") ||
  apiKey.includes("xxxxxxx") ||
  apiKey.includes("AIzaSyD") && apiKey.includes("x") && apiKey.length < 40;

const isMissingKey = !apiKey || apiKey.trim() === "";

if (isMissingKey || isFakeKey) {
  console.error("🚨 ERREUR CRITIQUE: Configuration Firebase Invalide! 🚨");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("❌ PROBLEM: Firebase API Key is FAKE or MISSING!");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.error("");
  console.error("📍 Valeur actuelle en .env.local:");
  console.error(`   NEXT_PUBLIC_FIREBASE_API_KEY=${apiKey}`);
  console.error("");
  console.error("❌ C'est une CLÉ FICTIVE (placeholder)!");
  console.error("");
  console.error("✅ SOLUTION IMMÉDIATE:");
  console.error("   1. Aller à: https://console.firebase.google.com");
  console.error("   2. Cliquer sur le projet 'livraison-app'");
  console.error("   3. Aller à: Paramètres (⚙️) → Général");
  console.error("   4. Section 'Vos applications' → Sélectionner Web App");
  console.error("   5. Cliquer sur 'Config' (ou 'Afficher')'");
  console.error("   6. Copier les vraies valeurs (voir exemple ci-dessous)");
  console.error("");
  console.error("📋 EXEMPLE DE VRAIE CONFIGURATION:");
  console.error("   NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyDk1234567890abcdefghijklmnop1234567");
  console.error("   (Au lieu de: AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxx)");
  console.error("");
  console.error("⚠️ CONSÉQUENCE:");
  console.error("   - ❌ Aucune commande ne peut être enregistrée");
  console.error("   - ❌ Firestore ne peut pas être initialisé");
  console.error("   - ❌ Le bouton 'VALIDER LA COMMANDE' reste bloqué");
  console.error("");
  console.error("🔄 APRÈS MODIFICATION:");
  console.error("   1. Modifier .env.local avec les vraies clés");
  console.error("   2. Redémarrer le serveur (npm run dev)");
  console.error("   3. Les commandes fonctionneront");
  console.error("");
  console.error("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "livraison-app.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || ""
};

console.log("🔥 Firebase Configuration Status:", {
  projectId: projectId || "❌ MISSING",
  authDomain: authDomain || "❌ MISSING",
  apiKeyConfigured: !isMissingKey && !isFakeKey ? "✅ OK" : "❌ FAKE/MISSING",
  status: isMissingKey || isFakeKey ? "🚨 CONFIGURATION INVALIDE" : "✅ VALIDE",
});

let app;
let db!: Firestore;
let auth!: Auth;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  console.log("✅ Firebase initialisé avec succès");
} catch (error) {
  console.error("❌ ERREUR lors de l'initialisation Firebase:", error);
  console.error("   Vérifiez que les clés dans .env.local sont valides!");
  // En cas d'erreur, l'accès à db lèvera une erreur à runtime
  // C'est préférable au cas où la clé est fausse
}

export { db, auth };