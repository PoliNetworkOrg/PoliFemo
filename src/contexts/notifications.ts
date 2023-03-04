import React from "react"
import { ColorSchemeName } from "react-native"

/**
 * `"predefined"` or `"light"` or `"dark"`
 */
export type ValidColorSchemeName = NonNullable<ColorSchemeName> | "predefined"

export interface Notifications {
  theme: ValidColorSchemeName
}
export interface NotificationsContextProps {
  notifications: Notifications
  setNotifications: React.Dispatch<React.SetStateAction<Notifications>>
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export const NotificationsContext =
  React.createContext<NotificationsContextProps>({
    notifications: { theme: "predefined" },
    setNotifications: () => null,
  })
