import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translationEN from "./components/locales/en/translation.json";
import translationPL from "./components/locales/pl/translation.json";
import translationDE from "./components/locales/de/translation.json";

const resources = {
  en: {
    translation: translationEN,
  },
  pl: {
    translation: translationPL,
  },
  de: {
    translation: translationDE
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: true,
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag", "path", "subdomain"],
      caches: ["localStorage"],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;