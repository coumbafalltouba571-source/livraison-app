import { useLanguageStore } from "@/app/store/language";
import { translations } from "@/app/utils/translations";

export function useTranslation() {
  const language = useLanguageStore((state) => state.currentLanguage);

  const t = (path: string, defaultValue: string = ""): string => {
    const keys = path.split(".");
    let value: unknown = translations[language];

    for (const key of keys) {
      if (typeof value === "object" && value !== null && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return defaultValue;
      }
    }

    return typeof value === "string" ? value : defaultValue;
  };

  return { t, language };
}
