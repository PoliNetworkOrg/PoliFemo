/* eslint-disable @typescript-eslint/no-empty-function */
import { useEffect, useState } from "react"
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
import notificationsIT from "./jsons/it/notifications.json"
import notificationsEN from "./jsons/en/notifications.json"
import calendarIT from "./jsons/it/calendar.json"
import calendarEN from "./jsons/en/calendar.json"
import timetableIT from "./jsons/it/timetable.json"
import timetableEN from "./jsons/en/timetable.json"
import { getLocales } from "expo-localization"

async function initializeI18n() {
  await i18n.use(initReactI18next).init({
    resources: {
      it: {
        common: commonIT,
        home: homeIT,
        freeClass: FreeClassIT,
        settings: settingsIT,
        notifications: notificationsIT,
        calendar: calendarIT,
        timetable: timetableIT,
      },
      en: {
        common: commonEN,
        home: homeEN,
        freeClass: FreeClassEN,
        settings: settingsEN,
        notifications: notificationsEN,
        calendar: calendarEN,
        timetable: timetableEN,
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
      "calendar",
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
