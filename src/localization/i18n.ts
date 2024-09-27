import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import axios from "axios";

const { data: english } = await axios.get("/locales/en/default.json");
const { data: yeastEn } = await axios.get('/locales/en/YeastTable.json')
const { data: german } = await axios.get("/locales/de/default.json");
const { data: yeastDe } = await axios.get('/locales/de/YeastTable.json')
// const { data: french } = await axios.get("/locales/fr/default.json");
// const { data: polish } = await axios.get("/locales/pl/default.json");

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
          ...english,
          yeastTable: {
            ...yeastEn
          }
        },
      },
      de: {
        translation: {
          ...german,
          yeastTable: {
            ...yeastDe
          }
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
