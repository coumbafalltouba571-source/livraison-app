import { useLanguageStore } from "@/app/store/language";
import { translations } from "@/app/utils/translations";

export function useTranslation() {
  const language = useLanguageStore((state) => state.currentLanguage);

  const t = (path: string, defaultValue: string = ""): string => {
    const keys = path.split(".");
    let value: any = translations[language];

    for (const key of keys) {
      if (value && typeof value === "object" && key in value) {
        value = value[key];
      } else {
        return defaultValue;
      }
    }

    return typeof value === "string" ? value : defaultValue;
  };

  return { t, language };
}
