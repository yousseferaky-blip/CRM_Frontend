import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationAR from "./locales/ar/translation.json";
import translationEN from "./locales/en/translation.json";
import translationFR from "./locales/fr/translation.json";
import translationDE from "./locales/de/translation.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: { translation: translationAR },
      en: { translation: translationEN },
      fr: { translation: translationFR },
      de: { translation: translationDE },
    },
    fallbackLng: "en", 
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
