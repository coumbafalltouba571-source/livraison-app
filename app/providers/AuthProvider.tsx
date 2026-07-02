"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/app/store/auth";
import { useLanguageStore, type Language } from "@/app/store/language";

const allowedLanguages: Language[] = ["fr", "en", "es", "wo"];

function isValidLanguage(value: unknown): value is Language {
  return typeof value === "string" && allowedLanguages.includes(value as Language);
}

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const userProfile = useAuthStore((state) => state.userProfile);
  const setLanguage = useLanguageStore((state) => state.setLanguage);

  useEffect(() => {
    // Initialize auth on app load
    initializeAuth();

    // Set language from user profile or localStorage
    const savedLanguage = localStorage.getItem("app-language");

    if (isValidLanguage(userProfile?.language)) {
      setLanguage(userProfile.language);
    } else if (isValidLanguage(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, [initializeAuth, setLanguage, userProfile?.language]);

  return <>{children}</>;
}
