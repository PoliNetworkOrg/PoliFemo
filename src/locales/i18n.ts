/* eslint-disable @typescript-eslint/no-empty-function */
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import homeIT from "./jsons/it/home.json"
import homeEN from "./jsons/en/home.json"
import { getLocales } from "expo-localization"

void i18n.use(initReactI18next).init({
  resources: {
    it: {
      home: homeIT,
    },
    en: {
      home: homeEN,
    },
  },
  lng: getLocales()[0].languageCode,
  compatibilityJSON: "v3",
  fallbackLng: "it",
  defaultNS: "home",
  interpolation: {
    escapeValue: false,
  },
  react: { useSuspense: false },
})

export default i18n
