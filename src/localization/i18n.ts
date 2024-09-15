import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import english from "../../public/locales/en/default.json"
import german from "../../public/locales/de/default.json"
import french from "../../public/locales/fr/default.json"
import polish from "../../public/locales/pl/default.json"


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: ["en", "de",
      // "fr", 'pl'
    ],
    resources: {
      en: {
        translation: {
          greeting: "Hello",
          ...english
        },
      },
      de: {
        translation: {
          greeting: "Hallo",
          ...german
        },
      },
      // fr: {
      //   translation: {
      //     greeting: "Hello",
      //     ...french
      //   },
      // },
      // pl: {
      //   translation: {
      //     greeting: "Hallo",
      //     ...polish
      //   },
      // },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
