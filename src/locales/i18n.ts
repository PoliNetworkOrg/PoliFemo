/* eslint-disable @typescript-eslint/no-empty-function */
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import commonIT from "./jsons/it/common.json"
import commonEN from "./jsons/en/common.json"
import { getLocales } from "expo-localization"

void i18n.use(initReactI18next).init({
  resources: {
    it: {
      common: commonIT,
    },
    en: {
      common: commonEN,
    },
  },
  lng: getLocales()[0].languageCode,
  compatibilityJSON: "v3",
  fallbackLng: "it",
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
  react: { useSuspense: false },
})

export default i18n
