"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/auth";
import { db, messaging } from "@/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { doc, setDoc } from "firebase/firestore";

const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

export function useFirebaseMessaging() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (typeof window === "undefined" || !user?.uid) {
      return;
    }

    const messagingInstance = messaging;
    if (!messagingInstance) {
      return;
    }

    let unsubscribed = false;

    const registerMessaging = async () => {
      if (!("Notification" in window)) {
        return;
      }

      if (Notification.permission === "default") {
        await Notification.requestPermission();
      }

      if (Notification.permission !== "granted") {
        console.warn("⚠️ Notifications non autorisées, FCM non initialisé");
        return;
      }

      try {
        const registration = await navigator.serviceWorker.ready;
        const tokenOptions: { vapidKey?: string; serviceWorkerRegistration?: ServiceWorkerRegistration } = {
          serviceWorkerRegistration: registration,
        };

        if (vapidKey) {
          tokenOptions.vapidKey = vapidKey;
        }

        const currentToken = await getToken(messagingInstance, tokenOptions);

        if (currentToken && !unsubscribed) {
          await setDoc(doc(db, "users", user.uid, "devices", currentToken), {
            uid: user.uid,
            token: currentToken,
            platform: navigator.platform,
            userAgent: navigator.userAgent,
            createdAt: new Date(),
          });
        }
      } catch (error) {
        console.error("❌ Impossible d'initialiser FCM:", error);
      }
    };

    void registerMessaging();

    const unsubscribe = onMessage(messagingInstance, (payload) => {
      if (unsubscribed) {
        return;
      }

      const title = payload.notification?.title || "Nouvelle notification";
      const body = payload.notification?.body || "Vous avez un nouveau message";

      if (Notification.permission === "granted") {
        const notification = new Notification(title, {
          body,
          icon: "/logo2_app.png",
        });
        setTimeout(() => notification.close(), 5000);
      }
    });

    return () => {
      unsubscribed = true;
      unsubscribe();
    };
  }, [user?.uid]);
}
