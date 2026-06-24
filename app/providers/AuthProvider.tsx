"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/auth";
import { useLanguageStore } from "@/app/store/language";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const userProfile = useAuthStore((state) => state.userProfile);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  useEffect(() => {
    // Initialize auth on app load
    initializeAuth();

    // Set language from user profile or localStorage
    const savedLanguage = localStorage.getItem("app-language");
    if (userProfile?.language) {
      setLanguage(userProfile.language as any);
    } else if (savedLanguage) {
      setLanguage(savedLanguage as any);
    }
  }, [initializeAuth, setLanguage, userProfile?.language]);

  return <>{children}</>;
}
