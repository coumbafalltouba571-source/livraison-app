import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Language = "fr" | "en" | "es" | "wo";

interface LanguageStore {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  getLanguage: () => Language;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      currentLanguage: "fr" as Language,

      setLanguage: (language: Language) => {
        set({ currentLanguage: language });
        // Store also in localStorage for persistence
        if (typeof window !== "undefined") {
          localStorage.setItem("app-language", language);
          document.documentElement.lang = language;
        }
      },

      getLanguage: () => get().currentLanguage,
    }),
    {
      name: "language-storage",
      partialize: (state) => ({
        currentLanguage: state.currentLanguage,
      }),
    }
  )
);
