import { Article } from "api/collections/articles"
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

const getArticleLanguage = (article: Article, language: string) => {
  if (language === "it") {
    return article.content.it ? "it" : article.content.en ? "en" : undefined
  }
  return article.content.en ? "en" : article.content.it ? "it" : undefined
}

export const getArticleParams = (article: Article, language: string) => {
  const articleLanguage = getArticleLanguage(article, language)
  return articleLanguage ? article.content[articleLanguage] : undefined
}

export const getDifferentLanguageNotice = (
  article: Article,
  language: string
) => {
  if (language === "it") {
    return article.content.it ? "" : "Non disponibile in italiano"
  }
  return article.content.en ? "" : "Not available in English"
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
