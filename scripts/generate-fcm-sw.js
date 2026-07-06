const fs = require("fs");
const path = require("path");

const env = process.env;
const config = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "YOUR_STORAGE_BUCKET",
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
};

const swPath = path.resolve(__dirname, "..", "public", "firebase-messaging-sw.js");
const swContent = `importScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-app-compat.js');\nimportScripts('https://www.gstatic.com/firebasejs/12.13.0/firebase-messaging-compat.js');\n\nfirebase.initializeApp(${JSON.stringify(config, null, 2)});\nconst messaging = firebase.messaging();\n\nmessaging.onBackgroundMessage(function(payload) {\n  console.log('[firebase-messaging-sw.js] Received background message ', payload);\n  const notificationTitle = payload.notification?.title || 'Nouvelle notification';\n  const notificationOptions = {\n    body: payload.notification?.body || '',\n    icon: '/logo2_app.png'\n  };\n  return self.registration.showNotification(notificationTitle, notificationOptions);\n});\n`;

fs.writeFileSync(swPath, swContent, "utf8");
console.log(`✅ Generated ${swPath}`);
