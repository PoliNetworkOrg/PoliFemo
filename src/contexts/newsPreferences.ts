import React from "react"
import { Tag } from "api/articles"

export type TagWithData = Tag & {
  /** The column in which the card has to be inserted */
  column: "left" | "right"
  /** The height of the card */
  height: number
  /** Whether the tag is favourite or not */
  favourite: boolean
}

export enum Preference {
  NONE,
  FAVOURITE,
  UNFAVOURITE,
}

export interface NewsPreferences {
  preferences: Record<Tag["name"], Preference>
}

export type NewsPreferencesContextProps = NewsPreferences & {
  setArticlesPreferences: (newPreferences: NewsPreferences) => void
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const NewsPreferencesContext =
  React.createContext<NewsPreferencesContextProps>({
    preferences: {},
    setArticlesPreferences: () => null,
  })
