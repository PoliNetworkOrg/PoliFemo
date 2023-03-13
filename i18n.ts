import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import commonIT from "assets/jsons/locales/it/common.json"
import commonEN from "assets/jsons/locales/en/common.json"

const resources = {
  it: {
    common: commonIT,
  },
  en: {
    common: commonEN,
  },
}

export const initializeI18n = async (): Promise<void> => {
  await i18n.use(initReactI18next).init({
    resources,
    lng: "it",
    fallbackLng: "it",
    interpolation: {
      escapeValue: false,
    },
    cleanCode: true,
  })
}
