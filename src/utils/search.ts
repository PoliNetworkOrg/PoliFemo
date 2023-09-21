import news from "assets/search/news.svg"
import notifications from "assets/search/notifications.svg"
import sections from "assets/search/sections.svg"
import materials from "assets/search/materials.svg"

export const SEARCH_TAGS = [
  "sections",
  "news",
  "notifications",
  "materials",
] as const

export type SearchTag = (typeof SEARCH_TAGS)[number]

export const SEARCH_TAG_TO_LABEL: Record<SearchTag, string> = {
  sections: "Sezioni dell'app",
  news: "News & Avvisi",
  notifications: "Notifiche",
  materials: "Materiali",
}

export const getSearchTagIcon = (type: SearchTag) => {
  switch (type) {
    case "news":
      return news
    case "notifications":
      return notifications
    case "sections":
      return sections
    case "materials":
      return materials
  }
}
