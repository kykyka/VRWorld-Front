import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import ru from "./locales/ru.json";
import de from "./locales/de.json";

// Инициализация i18next
i18n
  .use(LanguageDetector) // Определение языка пользователя
  .use(initReactI18next) // Инициализация для React
  .init({
    fallbackLng: "en", // Язык по умолчанию
    resources: {
      en: { translation: en },
      ru: { translation: ru },
      de: { translation: de },
    },
    interpolation: {
      escapeValue: false, // Для React не нужно экранировать
    },
    detection: {
      order: ["localStorage", "navigator", "cookie", "htmlTag"], // Порядок поиска языка
    },
  });

export default i18n;
