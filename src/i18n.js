import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { LANGUAGES } from "./utils/constants";

// Импортируем файлы переводов
import enTranslation from "./locales/en.json";
import ruTranslation from "./locales/ru.json";

// Получаем сохраненный язык из localStorage или используем русский по умолчанию
const savedLanguage = localStorage.getItem("selectedLanguage") || "ru";

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: enTranslation,
    },
    ru: {
      translation: ruTranslation,
    },
  },
  lng: savedLanguage,
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
