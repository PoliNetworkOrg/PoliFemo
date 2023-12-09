/* eslint-disable @typescript-eslint/no-empty-function */
import { getLocales } from "expo-localization"
import i18n from "i18next"
import { useEffect, useState } from "react"
import { initReactI18next } from "react-i18next"
import commonEN from "./jsons/en/common.json"
import { default as FreeClassEN } from "./jsons/en/freeClass.json"
import { default as gradingBookEN } from "./jsons/en/gradingBook.json"
import homeEN from "./jsons/en/home.json"
import notificationsEN from "./jsons/en/notifications.json"
import settingsEN from "./jsons/en/settings.json"
import timetableEN from "./jsons/en/timetable.json"
import commonIT from "./jsons/it/common.json"
import FreeClassIT from "./jsons/it/freeClass.json"
import { default as gradingBookIT } from "./jsons/it/gradingBook.json"
import homeIT from "./jsons/it/home.json"
import notificationsIT from "./jsons/it/notifications.json"
import settingsIT from "./jsons/it/settings.json"
import timetableIT from "./jsons/it/timetable.json"

async function initializeI18n() {
  await i18n.use(initReactI18next).init({
    resources: {
      it: {
        common: commonIT,
        home: homeIT,
        freeClass: FreeClassIT,
        settings: settingsIT,
        notifications: notificationsIT,
        timetable: timetableIT,
        gradingBook: gradingBookIT,
      },
      en: {
        common: commonEN,
        home: homeEN,
        freeClass: FreeClassEN,
        settings: settingsEN,
        notifications: notificationsEN,
        timetable: timetableEN,
        gradingBook: gradingBookEN,
      },
    },
    lng: getLocales()[0].languageCode,
    compatibilityJSON: "v3",
    fallbackLng: "en",
    defaultNS: "common",
    ns: [
      "common",
      "home",
      "freeClass",
      "settings",
      "notifications",
      "timetable",
    ],
    interpolation: {
      escapeValue: false,
    },
    react: { useSuspense: false },
  })
}

export function useLoadI18n() {
  const [i18nLoaded, setI18nLoaded] = useState(false)

  useEffect(() => {
    void initializeI18n().then(() => setI18nLoaded(true))
  }, [])

  return i18nLoaded
}

export { i18n }
