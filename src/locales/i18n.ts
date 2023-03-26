/* eslint-disable @typescript-eslint/no-empty-function */
import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import homeIT from "./jsons/it/home.json"
import homeEN from "./jsons/en/home.json"
import commonIT from "./jsons/it/common.json"
import commonEN from "./jsons/en/common.json"
import FreeClassIT from "./jsons/it/freeClass.json"
import FreeClassEN from "./jsons/en/freeClass.json"
import settingsIT from "./jsons/it/settings.json"
import settingsEN from "./jsons/en/settings.json"
import { getLocales } from "expo-localization"

void i18n.use(initReactI18next).init({
  resources: {
    it: {
      common: commonIT,
      home: homeIT,
      freeClass: FreeClassIT,
      settings: settingsIT,
    },
    en: {
      common: commonEN,
      home: homeEN,
      freeClass: FreeClassEN,
      settings: settingsEN,
    },
  },
  lng: getLocales()[0].languageCode,
  compatibilityJSON: "v3",
  fallbackLng: "en",
  defaultNS: "common",
  ns: ["common", "home", "freeClass", "settings"],
  interpolation: {
    escapeValue: false,
  },
  react: { useSuspense: false },
})

export default i18n
