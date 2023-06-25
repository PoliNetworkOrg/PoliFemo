import i18n from "i18next"
import { useEffect, useState } from "react"

/**
 * Custom hook to get the current language.
 * @returns the current language
 */
export const useCurrentLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language)

  const handleLanguageChange = (lng: string) => {
    setCurrentLanguage(lng)
  }

  useEffect(() => {
    i18n.on("languageChanged", handleLanguageChange)

    return () => {
      i18n.off("languageChanged", handleLanguageChange)
    }
  }, [])

  return currentLanguage
}

export const extractImageLinks = (markdown: string): string[] => {
  const regex = /!\[.*?\]\((.*?)\)/g
  const imageLinks: string[] = []
  let match

  while ((match = regex.exec(markdown)) !== null) {
    if (match.length > 1) {
      imageLinks.push(match[1])
    }
  }

  return imageLinks
}
